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

alter table profile_views enable row level security;

-- Chỉ chủ sở hữu mới đọc được log lượt xem của mình
drop policy if exists "owner read views" on profile_views;
create policy "owner read views" on profile_views
  for select using (auth.uid() = profile_id);

-- Hàm tăng lượt xem (security definer để người xem public cũng tăng được)
-- vừa cộng tổng view_count, vừa ghi 1 dòng log theo ngày
create or replace function increment_views(profile_username text)
returns void
language plpgsql
security definer
as $$
declare
  pid uuid;
begin
  update profiles
    set view_count = view_count + 1
    where username = profile_username
    returning id into pid;

  if pid is not null then
    insert into profile_views (profile_id) values (pid);
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

  -- Xoá auth user → cascade xoá profile + profile_views
  delete from auth.users where id = uid;
end;
$$;

-- ============================================
-- STORAGE: bucket 'assets' cho avatar / nhạc / nền / cursor
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
