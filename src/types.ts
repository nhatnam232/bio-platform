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
  textEffect?: string
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

export type WidgetType =
  | 'text'
  | 'image'
  | 'link'
  | 'button'
  | 'music'
  | 'video'
  | 'embed'
  | 'discord'
  | 'github'
  | 'spotify'
  | 'youtube'
  | 'map'
  | 'countdown'
  | 'divider'

// Card widget tuỳ biến hiển thị trên trang bio (lưu trong cột profiles.widgets)
export type Widget = {
  id: string
  type: WidgetType
  title?: string
  content?: string
  url?: string
  icon?: string
  size?: 'sm' | 'md' | 'lg' | 'full'
  accent?: string
  data?: Record<string, unknown>
}

// 1 template trong chợ template (bảng templates)
export type Template = {
  id: string
  owner_id: string | null
  name: string
  description: string | null
  preview_url: string | null
  tags: string[] | null
  theme: Theme | null
  background: Background | null
  is_public: boolean
  downloads: number
  created_at: string
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
  phone: string | null
  theme: Theme | null
  links: ProfileLink[] | null
  widgets: Widget[] | null
  discord_id: string | null
  badges: string[] | null
  view_count: number
  is_public: boolean
  created_at: string
}
