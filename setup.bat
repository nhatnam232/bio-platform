@echo off
chcp 65001 >nul
echo ============================================
echo   BIO PLATFORM - Setup cho Windows
echo ============================================
echo.
echo [1/2] Dang cai dat dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo LOI: npm chua duoc cai. Tai Node.js tai https://nodejs.org roi chay lai.
  pause
  exit /b 1
)

if not exist .env (
  copy .env.example .env >nul
  echo.
  echo [2/2] Da tao file .env tu .env.example
  echo        Mo .env va dien VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
)

echo.
echo Setup xong! Cac buoc tiep theo:
echo   1. Tao project tren supabase.com
echo   2. SQL Editor - dan noi dung supabase_schema.sql - Run
echo   3. Authentication - tat "Confirm email" (cho dev)
echo   4. Settings - API - copy URL + anon key vao file .env
echo   5. Chay: npm run dev
echo.
pause
