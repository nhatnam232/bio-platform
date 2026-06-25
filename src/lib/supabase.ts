import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Guard ro rang: thieu env thi bao loi de hieu thay vi createClient(undefined) gay crash mo ho.
if (!url || !anonKey) {
  throw new Error(
    '[Supabase] Thieu VITE_SUPABASE_URL hoac VITE_SUPABASE_ANON_KEY. ' +
      'Tao file .env (xem .env.example) roi khoi dong lai dev server, ' +
      'hoac cau hinh Environment Variables tren Vercel truoc khi build/deploy.'
  )
}

export const supabase = createClient(url, anonKey)
