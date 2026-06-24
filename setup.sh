#!/usr/bin/env bash
set -e

echo "📦 Đang cài đặt dependencies..."
npm install

if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "✅ Đã tạo file .env từ .env.example"
  echo "   ⚠️  Mở .env và điền VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY"
fi

echo ""
echo "🎉 Setup xong! Các bước tiếp theo:"
echo "   1. Tạo project trên supabase.com"
echo "   2. SQL Editor > dán nội dung supabase_schema.sql > Run"
echo "   3. Settings > Authentication > tắt 'Confirm email' (cho dev)"
echo "   4. Settings > API > copy URL + anon key vào file .env"
echo "   5. Chạy: npm run dev"
