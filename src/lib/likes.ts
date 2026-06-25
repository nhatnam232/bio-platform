import { supabase } from './supabase'

export type LikeState = { count: number; liked: boolean }

// Khoa an danh cho moi khach (luu localStorage) de dedup like/view theo trinh duyet
export function getVisitorKey(): string {
  try {
    const k = 'bio_visitor_key'
    let v = localStorage.getItem(k)
    if (!v) {
      v =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()) + Math.random().toString(36).slice(2)
      localStorage.setItem(k, v)
    }
    return v
  } catch {
    return 'anon'
  }
}

function parse(data: unknown): LikeState {
  const row = Array.isArray(data) ? data[0] : data
  const r = (row || {}) as { like_count?: number; liked?: boolean }
  return { count: Number(r.like_count ?? 0), liked: !!r.liked }
}

// Lay so like + khach hien tai da like chua
export async function getLikes(profileId: string): Promise<LikeState> {
  const { data, error } = await supabase.rpc('get_likes', {
    p_profile_id: profileId,
    p_visitor_key: getVisitorKey(),
  })
  if (error) return { count: 0, liked: false }
  return parse(data)
}

// Bat/tat like cho 1 profile, tra ve trang thai moi
export async function toggleLike(profileId: string): Promise<LikeState> {
  const { data, error } = await supabase.rpc('toggle_like', {
    p_profile_id: profileId,
    p_visitor_key: getVisitorKey(),
  })
  if (error) return { count: 0, liked: false }
  return parse(data)
}
