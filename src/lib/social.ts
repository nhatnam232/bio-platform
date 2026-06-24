export type SocialId =
  | 'x' | 'instagram' | 'youtube' | 'tiktok' | 'discord' | 'twitch' | 'spotify'
  | 'telegram' | 'facebook' | 'linkedin' | 'github' | 'reddit' | 'pinterest'
  | 'snapchat' | 'steam' | 'roblox' | 'soundcloud' | 'paypal' | 'kick'
  | 'email' | 'globe'

export type SocialDef = { id: SocialId; label: string; icon: string; base: string }

export const SOCIALS: SocialDef[] = [
  { id: 'x', label: 'X', icon: '𝕏', base: 'https://x.com/' },
  { id: 'instagram', label: 'Instagram', icon: '📷', base: 'https://instagram.com/' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', base: 'https://youtube.com/@' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', base: 'https://tiktok.com/@' },
  { id: 'discord', label: 'Discord', icon: '🎮', base: 'https://discord.gg/' },
  { id: 'twitch', label: 'Twitch', icon: '🟪', base: 'https://twitch.tv/' },
  { id: 'spotify', label: 'Spotify', icon: '🎧', base: 'https://open.spotify.com/user/' },
  { id: 'telegram', label: 'Telegram', icon: '✈️', base: 'https://t.me/' },
  { id: 'facebook', label: 'Facebook', icon: '👥', base: 'https://facebook.com/' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', base: 'https://linkedin.com/in/' },
  { id: 'github', label: 'GitHub', icon: '🐱', base: 'https://github.com/' },
  { id: 'reddit', label: 'Reddit', icon: '👽', base: 'https://reddit.com/u/' },
  { id: 'pinterest', label: 'Pinterest', icon: '📌', base: 'https://pinterest.com/' },
  { id: 'snapchat', label: 'Snapchat', icon: '👻', base: 'https://snapchat.com/add/' },
  { id: 'steam', label: 'Steam', icon: '🎮', base: 'https://steamcommunity.com/id/' },
  { id: 'roblox', label: 'Roblox', icon: '🧱', base: 'https://roblox.com/users/' },
  { id: 'soundcloud', label: 'SoundCloud', icon: '☁️', base: 'https://soundcloud.com/' },
  { id: 'paypal', label: 'PayPal', icon: '💳', base: 'https://paypal.me/' },
  { id: 'kick', label: 'Kick', icon: '🟩', base: 'https://kick.com/' },
  { id: 'email', label: 'Email', icon: '✉️', base: 'mailto:' },
  { id: 'globe', label: 'Website', icon: '🌐', base: '' },
]

export function getSocial(id: string): SocialDef {
  return SOCIALS.find((s) => s.id === id) || SOCIALS[SOCIALS.length - 1]
}

const MATCHERS: { id: SocialId; re: RegExp }[] = [
  { id: 'github', re: /github\.com/i },
  { id: 'x', re: /(?:twitter\.com|x\.com)/i },
  { id: 'instagram', re: /instagram\.com/i },
  { id: 'youtube', re: /(?:youtube\.com|youtu\.be)/i },
  { id: 'tiktok', re: /tiktok\.com/i },
  { id: 'discord', re: /discord(?:\.gg|app\.com|\.com)/i },
  { id: 'twitch', re: /twitch\.tv/i },
  { id: 'spotify', re: /spotify\.com/i },
  { id: 'telegram', re: /(?:t\.me|telegram\.me)/i },
  { id: 'facebook', re: /(?:facebook\.com|fb\.com)/i },
  { id: 'linkedin', re: /linkedin\.com/i },
  { id: 'reddit', re: /reddit\.com/i },
  { id: 'pinterest', re: /pinterest\.com/i },
  { id: 'snapchat', re: /snapchat\.com/i },
  { id: 'steam', re: /steam(?:community|powered)\.com/i },
  { id: 'roblox', re: /roblox\.com/i },
  { id: 'soundcloud', re: /soundcloud\.com/i },
  { id: 'paypal', re: /paypal\.(?:me|com)/i },
  { id: 'kick', re: /kick\.com/i },
  { id: 'email', re: /^mailto:/i },
]

export function detectSocial(url: string): SocialId {
  if (!url) return 'globe'
  for (const m of MATCHERS) if (m.re.test(url)) return m.id
  return 'globe'
}
