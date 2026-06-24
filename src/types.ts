export type ProfileLink = {
  label: string
  url: string
  icon?: string
}

export type Profile = {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  background: {
    type?: 'image' | 'video'
    url?: string
    blur?: number
    opacity?: number
  } | null
  music_url: string | null
  cursor_url: string | null
  theme: {
    accent?: string
    textColor?: string
    font?: string
    effects?: string[]
  } | null
  links: ProfileLink[] | null
  discord_id: string | null
  badges: string[] | null
  view_count: number
  is_public: boolean
  created_at: string
}
