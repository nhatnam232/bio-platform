import { supabase } from './supabase'

export type DailyViews = {
  day: string
  count: number
}

// Lấy thống kê lượt xem theo ngày của chính chủ tài khoản (mặc định 30 ngày gần nhất)
export async function getMyViewsByDay(days = 30): Promise<DailyViews[]> {
  const { data, error } = await supabase.rpc('my_views_by_day', { days })
  if (error) throw error
  return (data ?? []) as DailyViews[]
}
