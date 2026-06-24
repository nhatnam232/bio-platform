export type LinkMode = 'text' | 'link'

export type ProfileLink = {
  label: string
  url: string
  icon?: string
  platform?: string
  mode?: LinkMode
}

export type ThemeColors = {
  description?: string
  displayName?: string
  card?: string
  icon?: string
  audioControl?: string
  background?: string
  backgroundEffect?: string
}

export type Couple = {
  enabled?: boolean
  startTime?: string
  partner?: string
  message?: string
  heartIcon?: string
}

export type AvatarDecoration = {
  url?: string
  hue?: number
}

export type Theme = {
  accent?: string
  accent2?: string
  font?: string
  monospace?: boolean
  layout?: 'card' | 'minimal' | 'wide'
  effects?: string[]
  backgroundEffect?: string
  preset?: string
  template?: string
  nameTyping?: boolean
  nameEffect?: string
  showStats?: boolean
  colors?: ThemeColors
  cardOpacity?: number
  cardBlur?: number
  glowName?: boolean
  glowIcon?: boolean
  discordPresence?: boolean
  discordShowAvatar?: boolean
  discordShowDecoration?: boolean
  likeSystem?: boolean
  iconSingleColor?: boolean
  animationTitle?: boolean
  volumeControl?: boolean
  location?: string
  enterText?: string
  wallpaperMode?: 'wallpaper' | 'banner'
  avatarDecoration?: AvatarDecoration
  couple?: Couple
}

export type Background = {
  type?: 'image' | 'video'
  url?: string
  bannerUrl?: string
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
