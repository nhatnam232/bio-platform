import { Profile, Theme } from '../types'
import { detectSocial } from '../lib/social'
import Frame from './Frame'
import DiscordPresence from './DiscordPresence'
import TypingText from './TypingText'

export default function BioCard({
  profile,
  preview = false,
  onShare,
}: {
  profile: Profile
  preview?: boolean
  onShare?: () => void
}) {
  const theme: Theme = profile.theme ?? {}
  const accent = theme.accent || '#ffffff'
  const mono = !!theme.monospace
  const layout = theme.layout || 'card'
  const links = profile.links ?? []
  const badges = profile.badges ?? []
  const joined = new Date(profile.created_at).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })

  const avatarStyle = { borderColor: accent, boxShadow: '0 0 35px ' + accent + '66' }
  const atStyle = { color: accent }
  const arrowStyle = { color: accent }

  const content = (
    <>
      {profile.avatar_url && (
        <img src={profile.avatar_url} alt={profile.username} className="w-24 h-24 rounded-xl object-cover border-2" style={avatarStyle} />
      )}
      <div>
        <h1 className="text-2xl font-bold">
          {theme.nameTyping && !preview ? <TypingText text={profile.display_name || profile.username} /> : (profile.display_name || profile.username)}
        </h1>
        <p className="text-sm font-mono mt-0.5" style={atStyle}>@{profile.username}</p>
      </div>
      {profile.bio && <p className="text-zinc-300 whitespace-pre-line leading-relaxed text-sm">{profile.bio}</p>}
      {badges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {badges.map((b, i) => {
            const bStyle = { borderColor: accent + '55', color: accent }
            return <span key={i} className="text-[11px] font-mono px-2 py-1 border" style={bStyle}>{b}</span>
          })}
        </div>
      )}
      {profile.discord_id && !preview && <DiscordPresence discordId={profile.discord_id} />}
      <div className="flex flex-col gap-2.5 w-full mt-1">
        {links.map((link, i) => {
          const plat = detectSocial(link.url || '')
          const lStyle = { borderColor: accent + '33' }
          const onEnter = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = accent }
          const onLeave = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = accent + '33' }
          const onClick = (e: React.MouseEvent) => { if (preview) e.preventDefault() }
          return (
            <a key={i} href={preview ? undefined : (link.url || '#')} target="_blank" rel="noreferrer" onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave} className="group flex items-center gap-3 border px-4 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5" style={lStyle}>
              <span className="font-mono text-xs text-zinc-500">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 text-left truncate">{link.icon ? link.icon + ' ' : ''}{link.label || link.url}</span>
              {plat !== 'globe' && <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{plat}</span>}
              <span style={arrowStyle}>↗</span>
            </a>
          )
        })}
      </div>
      {theme.showStats !== false && (
        <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500 mt-2">
          <span>◷ {profile.view_count} views</span>
          <span>⛓ {links.length} links</span>
          <span>★ {joined}</span>
        </div>
      )}
      {onShare && (
        <button onClick={onShare} className="text-[11px] font-mono text-zinc-500 hover:text-white transition border border-white/10 px-3 py-1 mt-1">⤴ share</button>
      )}
    </>
  )

  const maxW = layout === 'wide' ? 'max-w-lg' : 'max-w-md'
  const monoCls = mono ? 'font-mono' : ''
  const pad = 'px-7 py-9 flex flex-col items-center gap-5 text-center fade-up'

  if (layout === 'minimal') {
    return <div className={'w-full ' + maxW + ' ' + pad + ' ' + monoCls}>{content}</div>
  }
  return <Frame accent={accent} className={'w-full ' + maxW + ' ' + pad + ' ' + monoCls}>{content}</Frame>
}
