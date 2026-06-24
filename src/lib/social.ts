export type SocialId =
  | 'github' | 'x' | 'instagram' | 'youtube' | 'tiktok' | 'discord'
  | 'twitch' | 'spotify' | 'telegram' | 'facebook' | 'linkedin' | 'email' | 'globe'

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
  { id: 'email', re: /^mailto:/i },
]

export function detectSocial(url: string): SocialId {
  if (!url) return 'globe'
  for (const m of MATCHERS) if (m.re.test(url)) return m.id
  return 'globe'
}
