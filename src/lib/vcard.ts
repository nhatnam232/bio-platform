import { Profile } from '../types'

// Escape ky tu dac biet theo chuan vCard 3.0 (RFC 2426): \ , ; va xuong dong
function esc(value: string): string {
  return (value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

// Tao chuoi vCard 3.0 tu profile + URL trang bio
export function buildVCard(profile: Profile, profileUrl: string): string {
  const name = profile.display_name || profile.username
  const lines: string[] = []
  lines.push('BEGIN:VCARD')
  lines.push('VERSION:3.0')
  lines.push('FN:' + esc(name))
  lines.push('N:' + esc(name) + ';;;;')
  lines.push('NICKNAME:' + esc(profile.username))
  if (profile.phone) lines.push('TEL;TYPE=CELL:' + esc(profile.phone))
  if (profile.avatar_url) lines.push('PHOTO;VALUE=URI:' + profile.avatar_url)
  if (profile.bio) lines.push('NOTE:' + esc(profile.bio))
  if (profileUrl) lines.push('URL:' + profileUrl)
  const links = profile.links ?? []
  for (const link of links) {
    if (link.url) lines.push('URL:' + link.url)
  }
  lines.push('END:VCARD')
  return lines.join('\r\n')
}

// Tao file .vcf va kich hoat tai ve
export function downloadVCard(profile: Profile, profileUrl: string): void {
  const vcf = buildVCard(profile, profileUrl)
  const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' })
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = (profile.username || 'contact') + '.vcf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(objectUrl)
}
