-- ============================================
-- BIO PLATFORM - Supabase schema
-- Dán toàn bộ file này vào Supabase > SQL Editor > Run
-- ============================================

-- Bảng profile chính, 1 row = 1 user
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null,
  display_name text,
  bio          text,
  avatar_url   text,
  background   jsonb,
  music_url    text,
  cursor_url   text,
  theme        jsonb,
  links        jsonb default '[]'::jsonb,
  discord_id   text,
  badges       text[] default '{}',
  view_count   int default 0,
  is_public    boolean default true,
  created_at   timestamptz default now()
);

-- Bật Row Level Security
alter table profiles enable row level security;

-- Ai cũng xem được profile public
drop policy if exists "public read" on profiles;
create policy "public read" on profiles
  for select using (is_public = true);

-- Chỉ chủ sở hữu mới sửa được profile của mình
drop policy if exists "owner update" on profiles;
create policy "owner update" on profiles
  for update using (auth.uid() = id);

-- Chỉ chủ sở hữu mới tạo được profile của mình
drop policy if exists "owner insert" on profiles;
create policy "owner insert" on profiles
  for insert with check (auth.uid() = id);

-- ============================================
-- THỐNG KÊ LƯỢT XEM THEO NGÀY
-- Mỗi lượt xem ghi 1 dòng log để vẽ biểu đồ theo ngày ở tab Overview
-- ============================================
create table if not exists profile_views (
  id         bigint generated always as identity primary key,
  profile_id uuid references profiles(id) on delete cascade,
  day        date default current_date,
  viewed_at  timestamptz default now()
);

create index if not exists profile_views_profile_day_idx
  on profile_views (profile_id, day);

-- DEDUP LƯỢT XEM (25/06 - REV): mỗi khách chỉ tính 1 lượt / profile / ngày
alter table profile_views add column if not exists visitor_key text not null default 'anon';

-- Gom dữ liệu trùng cũ trước khi tạo unique index
delete from profile_views a using profile_views b
  where a.ctid < b.ctid
    and a.profile_id = b.profile_id
    and a.day = b.day
    and a.visitor_key = b.visitor_key;

create unique index if not exists profile_views_dedup_idx
  on profile_views (profile_id, day, visitor_key);

alter table profile_views enable row level security;

-- Chỉ chủ sở hữu mới đọc được log lượt xem của mình
drop policy if exists "owner read views" on profile_views;
create policy "owner read views" on profile_views
  for select using (auth.uid() = profile_id);

-- Hàm tăng lượt xem (security definer để người xem public cũng tăng được)
-- DEDUP theo (profile, ngày, khách) + KHÔNG đếm khi chính chủ xem trang của mình
create or replace function increment_views(profile_username text, p_visitor_key text default null)
returns void
language plpgsql
security definer
as $$
declare
  pid uuid;
  rc int;
  vkey text := coalesce(nullif(p_visitor_key, ''), 'anon');
begin
  select id into pid from profiles where username = profile_username;
  if pid is null then
    return;
  end if;

  -- Không tính khi chính chủ xem trang của mình
  if auth.uid() = pid then
    return;
  end if;

  -- Dedup: chỉ ghi 1 dòng / profile / ngày / khách
  insert into profile_views (profile_id, visitor_key)
    values (pid, vkey)
    on conflict (profile_id, day, visitor_key) do nothing;
  get diagnostics rc = row_count;

  -- Chỉ cộng tổng view_count khi thực sự là lượt xem mới trong ngày
  if rc > 0 then
    update profiles set view_count = view_count + 1 where id = pid;
  end if;
end;
$$;

-- Thống kê lượt xem theo ngày cho chính chủ tài khoản (dùng ở tab Overview)
create or replace function my_views_by_day(days int default 30)
returns table(day date, count bigint)
language sql
security definer
as $$
  select pv.day, count(*)::bigint as count
  from profile_views pv
  where pv.profile_id = auth.uid()
    and pv.day >= current_date - (days - 1)
  group by pv.day
  order by pv.day;
$$;

-- ============================================
-- LIKE THẬT (25/06 - REV): lưu DB, đếm chung, dedup theo khách
-- ============================================
create table if not exists profile_likes (
  profile_id  uuid references profiles(id) on delete cascade,
  visitor_key text not null,
  created_at  timestamptz default now(),
  primary key (profile_id, visitor_key)
);

alter table profile_likes enable row level security;

-- Ai cũng đọc được (đếm like công khai)
drop policy if exists "read likes" on profile_likes;
create policy "read likes" on profile_likes
  for select using (true);

-- Lấy số like + khách hiện tại đã like chưa
create or replace function get_likes(p_profile_id uuid, p_visitor_key text)
returns table(like_count bigint, liked boolean)
language sql
security definer
as $$
  select
    (select count(*) from profile_likes where profile_id = p_profile_id)::bigint,
    exists(
      select 1 from profile_likes
      where profile_id = p_profile_id and visitor_key = p_visitor_key
    );
$$;

-- Bật/tắt like cho 1 profile theo khách, trả về trạng thái mới
create or replace function toggle_like(p_profile_id uuid, p_visitor_key text)
returns table(like_count bigint, liked boolean)
language plpgsql
security definer
as $$
declare
  is_liked boolean;
begin
  if exists(
    select 1 from profile_likes
    where profile_id = p_profile_id and visitor_key = p_visitor_key
  ) then
    delete from profile_likes
      where profile_id = p_profile_id and visitor_key = p_visitor_key;
    is_liked := false;
  else
    insert into profile_likes (profile_id, visitor_key)
      values (p_profile_id, p_visitor_key)
      on conflict (profile_id, visitor_key) do nothing;
    is_liked := true;
  end if;

  return query
    select (select count(*) from profile_likes where profile_id = p_profile_id)::bigint, is_liked;
end;
$$;

-- ============================================
-- XOÁ TÀI KHOẢN VĨNH VIỄN (Vùng nguy hiểm - tab Security)
-- security definer: xoá file storage + xoá auth user (cascade xoá profile & log)
-- ============================================
create or replace function delete_account()
returns void
language plpgsql
security definer
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Chua dang nhap';
  end if;

  -- Xoá toàn bộ file của user trong bucket assets (<userId>/...)
  delete from storage.objects
    where bucket_id = 'assets'
      and (storage.foldername(name))[1] = uid::text;

  -- Xoá auth user → cascade xoá profile + profile_views + profile_likes
  delete from auth.users where id = uid;
end;
$$;

-- ============================================
-- TÍNH NĂNG MỚI (25/06): số điện thoại, card widget, chợ template
-- ============================================

-- Số điện thoại liên hệ hiển thị trên profile
alter table profiles add column if not exists phone text;

-- Card widgets: mảng widget tuỳ biến hiển thị trên trang bio
alter table profiles add column if not exists widgets jsonb default '[]'::jsonb;

-- --------------------------------------------
-- CHỢ TEMPLATE: user tự up template để người khác dùng
-- --------------------------------------------
create table if not exists templates (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references auth.users(id) on delete set null,
  name        text not null,
  description text,
  preview_url text,
  tags        text[] default '{}',
  theme       jsonb,
  background  jsonb,
  is_public   boolean default true,
  downloads   int default 0,
  created_at  timestamptz default now()
);

create index if not exists templates_public_downloads_idx
  on templates (is_public, downloads desc);

alter table templates enable row level security;

-- Ai cũng xem được template công khai; chủ sở hữu xem được cả template riêng
drop policy if exists "read public templates" on templates;
create policy "read public templates" on templates
  for select using (is_public = true or auth.uid() = owner_id);

-- Người đã đăng nhập tự đăng template của mình
drop policy if exists "owner insert templates" on templates;
create policy "owner insert templates" on templates
  for insert with check (auth.uid() = owner_id);

-- Chủ sở hữu sửa template của mình
drop policy if exists "owner update templates" on templates;
create policy "owner update templates" on templates
  for update using (auth.uid() = owner_id);

-- Chủ sở hữu xoá template của mình
drop policy if exists "owner delete templates" on templates;
create policy "owner delete templates" on templates
  for delete using (auth.uid() = owner_id);

-- Tăng lượt tải khi có người áp dụng template (security definer để ai cũng tăng được)
create or replace function use_template(template_id uuid)
returns void
language sql
security definer
as $$
  update templates set downloads = downloads + 1 where id = template_id;
$$;

-- ============================================
-- STORAGE: bucket 'assets' cho avatar / nhạc / nền / cursor / preview template
-- ============================================
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

-- Ai cũng xem được file (bucket public)
drop policy if exists "public read assets" on storage.objects;
create policy "public read assets" on storage.objects
  for select using (bucket_id = 'assets');

-- Người đã đăng nhập được upload
drop policy if exists "auth upload assets" on storage.objects;
create policy "auth upload assets" on storage.objects
  for insert with check (bucket_id = 'assets' and auth.role() = 'authenticated');

-- Chỉ sửa/xóa file trong thư mục của chính mình (<userId>/...)
drop policy if exists "auth update own assets" on storage.objects;
create policy "auth update own assets" on storage.objects
  for update using (bucket_id = 'assets' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "auth delete own assets" on storage.objects;
create policy "auth delete own assets" on storage.objects
  for delete using (bucket_id = 'assets' and auth.uid()::text = (storage.foldername(name))[1]);
