export type ProfileLink = {
  label: string
  url: string
  icon?: string
}

export type Theme = {
  accent?: string
  accent2?: string
  textColor?: string
  font?: string
  monospace?: boolean
  layout?: 'card' | 'minimal' | 'wide'
  effects?: string[]
  preset?: string
  nameTyping?: boolean
  showStats?: boolean
}

export type Background = {
  type?: 'image' | 'video'
  url?: string
  blur?: number
  opacity?: number
}

export type Profile = {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  background: Background | null
  music_url: string | null
  cursor_url: string | null
  theme: Theme | null
  links: ProfileLink[] | null
  discord_id: string | null
  badges: string[] | null
  view_count: number
  is_public: boolean
  created_at: string
}
