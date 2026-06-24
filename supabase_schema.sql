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

-- Hàm tăng lượt xem (security definer để người xem public cũng tăng được)
create or replace function increment_views(profile_username text)
returns void
language sql
security definer
as $$
  update profiles set view_count = view_count + 1 where username = profile_username;
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
