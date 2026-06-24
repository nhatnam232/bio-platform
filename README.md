# Bio Platform (guns.lol clone)

Nền tảng bio link đa người dùng. Stack: **React + Vite + TypeScript + TailwindCSS + Supabase**.

## 🚀 Cài đặt

```bash
npm install
cp .env.example .env    # Windows: copy .env.example .env
npm run dev
```

## 🔑 Kết nối Supabase

1. Tạo project miễn phí tại [supabase.com](https://supabase.com).
2. **SQL Editor** → dán toàn bộ `supabase_schema.sql` → **Run** (tạo bảng + RLS + Storage bucket).
3. **Authentication > Providers > Email** → tắt **"Confirm email"** (để dev có session ngay).
4. **Settings > API** → copy `Project URL` + `anon public key` vào `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhb...
```

## 🗺️ Routes

| Route | Mô tả |
|---|---|
| `/` | Landing page |
| `/register` | Đăng ký + chọn username |
| `/login` | Đăng nhập |
| `/dashboard` | Chỉnh sửa profile (cần đăng nhập) |
| `/:username` | Trang bio public |

## ✨ Tính năng

- Đăng ký / đăng nhập (Supabase Auth) + chọn username
- RLS: mỗi người chỉ sửa profile của mình
- **Upload** avatar / nhạc / nền / cursor lên Supabase Storage
- **Trang public** với: màn hình "bấm để vào", nhạc nền, glassmorphism, avatar glow
- **Theme editor**: màu chủ đạo, font, nền (gradient / ảnh / video)
- **Hiệu ứng**: tuyết rơi, particles, custom cursor
- **Discord presence** real-time qua Lanyard API
- View counter

## 🎮 Discord presence (Lanyard)

Để hiển thị trạng thái Discord, bạn phải **join server Lanyard**: https://discord.gg/lanyard
Rồi dán **Discord User ID** vào Dashboard. Nếu không join, presence sẽ không hiện.

## 🚀 Deploy lên Vercel

1. Vào [vercel.com](https://vercel.com) → **Add New > Project** → import repo này từ GitHub.
2. Vercel tự nhận Vite. Thêm 2 biến môi trường:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy. File `vercel.json` (đã có sẵn) lo SPA routing cho route `/:username`.

## 🔜 Làm tiếp

- Drag & drop sắp xếp links
- Thống kê lượt xem theo ngày
- Custom domain riêng cho mỗi user
- Animated text / typing effect
