import { ReactNode, useState } from 'react'
import { Profile, Theme } from '../types'
import { detectSocial } from '../lib/social'
import { hexToRgba } from '../lib/color'
import Frame from './Frame'
import DiscordPresence from './DiscordPresence'
import NameText from './NameText'
import Avatar from './Avatar'

function renderDescription(text: string, linkColor: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  const ls = { color: linkColor }
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(<span key={k++}>{text.slice(last, m.index)}</span>)
    out.push(<a key={k++} href={m[2]} target="_blank" rel="noreferrer" className="underline hover:opacity-80" style={ls}>{m[1]}</a>)
    last = re.lastIndex
  }
  if (last < text.length) out.push(<span key={k++}>{text.slice(last)}</span>)
  return out
}

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
  const colors = theme.colors ?? {}
  const accent = theme.accent || '#ffffff'
  const layout = theme.layout || 'card'
  const mono = !!theme.monospace
  const links = profile.links ?? []
  const badges = profile.badges ?? []
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  const cardOpacity = theme.cardOpacity ?? 0.4
  const cardBlur = theme.cardBlur ?? 0
  const cardStyle = {
    backgroundColor: hexToRgba(colors.card || '#000000', cardOpacity),
    backdropFilter: cardBlur ? 'blur(' + cardBlur + 'px)' : undefined,
    WebkitBackdropFilter: cardBlur ? 'blur(' + cardBlur + 'px)' : undefined,
  }
  const nameColor = colors.displayName || '#ffffff'
  const descColor = colors.description || '#d4d4d8'
  const iconColor = theme.iconSingleColor ? (colors.icon || accent) : undefined
  const atStyle = { color: accent }
  const descStyle = { color: descColor }
  const arrowStyle = { color: iconColor || accent }

  const couple = theme.couple
  const daysLove = couple?.startTime ? Math.max(0, Math.floor((Date.now() - new Date(couple.startTime).getTime()) / 86400000)) : 0
  const coupleMsg = (couple?.message || '').replace('$[day]', String(daysLove)).replace('${day}', String(daysLove))

  const toggleLike = () => {
    if (preview) return
    setLiked((v) => {
      const nv = !v
      setLikes((c) => c + (nv ? 1 : -1))
      return nv
    })
  }

  const content = (
    <>
      <Avatar src={profile.avatar_url} alt={profile.username} decorationUrl={theme.avatarDecoration?.url} hue={theme.avatarDecoration?.hue ?? 0} accent={accent} />

      <div>
        <h1 className="text-2xl font-semibold">
          <NameText text={profile.display_name || profile.username} effect={theme.nameEffect} color={nameColor} glow={theme.glowName} />
        </h1>
        <p className={'text-sm mt-0.5 ' + (mono ? 'font-mono' : '')} style={atStyle}>@{profile.username}</p>
        {theme.location && <p className="text-xs mt-1" style={descStyle}>📍 {theme.location}</p>}
      </div>

      {profile.bio && <p className="whitespace-pre-line leading-relaxed text-sm" style={descStyle}>{renderDescription(profile.bio, accent)}</p>}

      {badges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {badges.map((b, i) => {
            const bStyle = { borderColor: accent + '55', color: accent }
            return <span key={i} className="text-[11px] px-2 py-1 rounded-full border" style={bStyle}>{b}</span>
          })}
        </div>
      )}

      {couple?.enabled && (
        <div className="w-full flex items-center justify-center gap-4 py-2">
          <span className="text-sm font-medium">{profile.display_name || profile.username}</span>
          <span className="text-xl">{couple.heartIcon || '❤️'}</span>
          <span className="text-sm font-medium">{couple.partner || 'Partner'}</span>
        </div>
      )}
      {couple?.enabled && coupleMsg && <p className="text-xs -mt-2" style={descStyle}>{coupleMsg}</p>}

      {profile.discord_id && theme.discordPresence !== false && !preview && <DiscordPresence discordId={profile.discord_id} />}

      <div className="flex flex-col gap-2.5 w-full mt-1">
        {links.map((link, i) => {
          const plat = link.platform || detectSocial(link.url || '')
          const lStyle = { borderColor: accent + '33' }
          const onEnter = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.borderColor = accent }
          const onLeave = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.borderColor = accent + '33' }
          const iconStyle = { color: iconColor || undefined }
          const cls = 'group flex items-center gap-3 border rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5'
          const inner = (
            <>
              <span className="text-base" style={iconStyle}>{link.icon || '🔗'}</span>
              <span className="flex-1 text-left truncate">{link.label || link.url}</span>
              {plat && plat !== 'globe' && <span className="text-[10px] uppercase tracking-wider text-zinc-500">{plat}</span>}
              {link.mode !== 'text' && <span style={arrowStyle}>↗</span>}
            </>
          )
          if (link.mode === 'text' || preview) {
            return <div key={i} className={cls} style={lStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>{inner}</div>
          }
          return <a key={i} href={link.url || '#'} target="_blank" rel="noreferrer" onMouseEnter={onEnter} onMouseLeave={onLeave} className={cls} style={lStyle}>{inner}</a>
        })}
      </div>

      <div className="flex items-center gap-4 mt-1">
        {theme.likeSystem && (
          <button onClick={toggleLike} className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition">
            <span className={liked ? 'heart-pop' : ''}>{liked ? '❤️' : '🤍'}</span>
            <span>{likes}</span>
          </button>
        )}
        {onShare && (
          <button onClick={onShare} className="text-[11px] text-zinc-500 hover:text-white transition border border-white/10 rounded-md px-3 py-1">⤴ share</button>
        )}
      </div>

      {theme.showStats !== false && (
        <div className="flex items-center gap-4 text-[11px] text-zinc-500 mt-1">
          <span>◷ {profile.view_count} views</span>
          <span>⛓ {links.length} links</span>
        </div>
      )}
    </>
  )

  const maxW = layout === 'wide' ? 'max-w-lg' : 'max-w-md'
  const monoCls = mono ? 'font-mono' : ''
  const pad = 'px-7 py-9 flex flex-col items-center gap-5 text-center fade-up rounded-xl'

  if (layout === 'minimal') {
    return <div className={'w-full ' + maxW + ' ' + pad + ' ' + monoCls} style={cardStyle}>{content}</div>
  }
  return <Frame accent={accent} className={'w-full ' + maxW + ' ' + pad + ' ' + monoCls} style={cardStyle}>{content}</Frame>
}
