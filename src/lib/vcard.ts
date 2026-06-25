import { Profile } from '../types'

// Tao noi dung vCard (.vcf) tu profile de khach luu nhanh vao danh ba.
export function buildVCard(profile: Profile, profileUrl: string): string {
  const name = profile.display_name || profile.username
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:' + escapeVCard(name),
    'N:' + escapeVCard(name) + ';;;;',
    'NICKNAME:' + escapeVCard(profile.username),
  ]
  if (profile.phone) lines.push('TEL;TYPE=CELL:' + escapeVCard(profile.phone))
  if (profile.avatar_url) lines.push('PHOTO;VALUE=URI:' + profile.avatar_url)
  if (profile.bio) lines.push('NOTE:' + escapeVCard(stripMarkdownLinks(profile.bio)))
  if (profileUrl) lines.push('URL:' + profileUrl)
  for (const link of profile.links ?? []) {
    if (link.url) lines.push('URL:' + link.url)
  }
  lines.push('END:VCARD')
  return lines.join('\r\n')
}

// Tai file .vcf ve may khach.
export function downloadVCard(profile: Profile, profileUrl: string): void {
  const vcf = buildVCard(profile, profileUrl)
  const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' })
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = profile.username + '.vcf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(href), 1000)
}

// Escape ky tu dac biet theo chuan vCard 3.0.
function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

// Bo cu phap [text](url) -> chi giu text cho ghi chu danh ba.
function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
}
