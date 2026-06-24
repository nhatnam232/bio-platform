# BioPlatform

Nền tảng **link-in-bio đa người dùng** (giống guns.lol) — mỗi người có một trang riêng tại `web.com/username` với avatar, links, nhạc nền, hiệu ứng động và Discord presence.

## ✨ Tính năng
- Trang public `/username` với màn "click to enter", nhạc nền, custom cursor
- Thiết kế tối giản kiểu Vercel: nền đen, lưới mờ, khung viền góc cạnh, font mono
- Theme presets + chọn màu chính/phụ, font, layout (Card / Wide / Minimal), hiệu ứng gõ tên
- Hiệu ứng động đồng bộ: particles, tuyết, mưa, sao, đom đóm, matrix
- Links: thêm/xóa, sắp xếp lên/xuống, gắn icon, tự nhận diện nền tảng
- Badges, bật/tắt công khai, chia sẻ + QR code
- Discord presence real-time (Lanyard), đếm lượt xem
- Live preview ngay trong Dashboard
- Auth bằng Supabase, RLS bảo vệ dữ liệu, upload lên Supabase Storage

## 🧱 Stack
React 18 · Vite 5 · TypeScript · TailwindCSS · Supabase · React Router · React Query · Zustand · Vercel

## 🚀 Cài đặt
1. `npm install`
2. Tạo `.env` từ `.env.example`, điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`
3. Mở Supabase → SQL Editor → chạy `supabase_schema.sql`
4. Authentication → Providers → Email → tắt "Confirm email"
5. `npm run dev`

## ☁️ Deploy (Vercel)
Import repo → thêm 2 biến môi trường `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` → Deploy. `vercel.json` đã cấu hình SPA rewrite cho route `/:username`.

## 🎨 Routes
- `/` landing
- `/register`, `/login`
- `/dashboard` (cần đăng nhập)
- `/:username` trang bio public
