import { ReactNode, useState } from 'react'
import { Profile, Theme } from '../types'
import { detectSocial } from '../lib/social'
import { hexToRgba } from '../lib/color'
import { downloadVCard } from '../lib/vcard'
import Frame from './Frame'
import DiscordPresence from './DiscordPresence'
import NameText from './NameText'
import Avatar from './Avatar'
import SocialIcon from './SocialIcon'

function renderDescription(text: string, linkColor: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  const ls = { color: linkColor }
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(<span key={k++}>{text.slice(last, m.index)}</span>)
    out.push(<a key={k++} href={m[2]} target="_blank" rel="noreferrer" className="underline font-semibold hover:opacity-80" style={ls}>{m[1]}</a>)
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
  const widgets = profile.widgets ?? []
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
  const iconColor = theme.iconSingleColor ? (colors.icon || accent) : accent
  const atStyle = { color: accent }
  const descStyle = { color: descColor }
  const arrowStyle = { color: iconColor }

  const couple = theme.couple
  const daysLove = couple?.startTime ? Math.max(0, Math.floor((Date.now() - new Date(couple.startTime).getTime()) / 86400000)) : 0
  const coupleMsg = (couple?.message || '').replace('$[day]', String(daysLove)).replace('${day}', String(daysLove))
  const memberSince = profile.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }) : ''

  const toggleLike = () => {
    if (preview) return
    setLiked((v) => {
      const nv = !v
      setLikes((c) => c + (nv ? 1 : -1))
      return nv
    })
  }

  const saveContact = () => {
    const url = typeof window !== 'undefined' ? window.location.origin + '/' + profile.username : ''
    downloadVCard(profile, url)
  }

  const content = (
    <>
      <Avatar src={profile.avatar_url} alt={profile.username} decorationUrl={theme.avatarDecoration?.url} hue={theme.avatarDecoration?.hue ?? 0} accent={accent} size={104} />

      <div>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
          <NameText text={profile.display_name || profile.username} effect={theme.nameEffect} color={nameColor} glow={theme.glowName} />
        </h1>
        <p className={'text-base mt-1 font-medium ' + (mono ? 'font-mono' : '')} style={atStyle}>@{profile.username}</p>
        {theme.location && <p className="text-sm mt-1.5 flex items-center justify-center gap-1.5" style={descStyle}><SocialIcon id="globe" size={14} /> {theme.location}</p>}
        {profile.phone && <p className="text-sm mt-1.5 flex items-center justify-center gap-1.5 font-medium" style={descStyle}>📞 {profile.phone}</p>}
      </div>

      {profile.bio && <p className={`whitespace-pre-line leading-relaxed text-[15px] ${theme.textEffect ? `fx-${theme.textEffect}` : ''}`} style={descStyle}>{renderDescription(profile.bio, accent)}</p>}

      {badges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {badges.map((b, i) => {
            const bStyle = { borderColor: accent + '55', color: accent }
            return <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-full border" style={bStyle}>{b}</span>
          })}
        </div>
      )}

      {couple?.enabled && (
        <div className="w-full flex items-center justify-center gap-4 py-1">
          <span className="text-sm font-semibold">{profile.display_name || profile.username}</span>
          <span className="text-xl">{couple.heartIcon || '❤️'}</span>
          <span className="text-sm font-semibold">{couple.partner || 'Partner'}</span>
        </div>
      )}
      {couple?.enabled && coupleMsg && <p className="text-xs -mt-2" style={descStyle}>{coupleMsg}</p>}

      {profile.discord_id && theme.discordPresence !== false && !preview && <DiscordPresence discordId={profile.discord_id} />}

      <div className="flex flex-col gap-3 w-full mt-1">
        {links.map((link, i) => {
          const plat = link.platform || detectSocial(link.url || '')
          const showEmoji = plat === 'globe' && !!link.icon
          const lStyle = { borderColor: accent + '33' }
          const onEnter = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.backgroundColor = accent + '14' }
          const onLeave = (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.borderColor = accent + '33'; e.currentTarget.style.backgroundColor = 'transparent' }
          const cls = 'group flex items-center gap-3 border rounded-lg px-4 py-3.5 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5'
          const inner = (
            <>
              <span className="shrink-0 flex items-center justify-center w-6" style={arrowStyle}>{showEmoji ? <span className="text-lg">{link.icon}</span> : <SocialIcon id={plat} size={20} color={iconColor} />}</span>
              <span className="flex-1 text-left truncate">{link.label || link.url}</span>
              {plat && plat !== 'globe' && <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">{plat}</span>}
              {link.mode !== 'text' && <span style={arrowStyle}>↗</span>}
            </>
          )
          if (link.mode === 'text' || preview) {
            return <div key={i} className={cls} style={lStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>{inner}</div>
          }
          return <a key={i} href={link.url || '#'} target="_blank" rel="noreferrer" onMouseEnter={onEnter} onMouseLeave={onLeave} className={cls} style={lStyle}>{inner}</a>
        })}
      </div>

      {widgets.length > 0 && (
        <div className="w-full flex flex-col gap-4 mt-2">
          {widgets.map(w => {
            const wStyle = { backgroundColor: hexToRgba(colors.card || '#000000', Math.min(1, cardOpacity + 0.1)) }
            return (
              <div key={w.id} className="w-full rounded-xl overflow-hidden border border-white/5" style={wStyle}>
                {w.title && <div className="px-4 py-2.5 font-semibold text-sm border-b border-white/10" style={descStyle}>{w.title}</div>}
                <div className="p-4 flex flex-col items-center justify-center text-sm" style={descStyle}>
                  {w.type === 'text' && <div className="whitespace-pre-line text-left w-full leading-relaxed">{w.content}</div>}
                  {w.type === 'image' && w.url && <img src={w.url} alt={w.title} className="w-full rounded-lg" />}
                  {w.type === 'youtube' && w.url && <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/50 flex items-center justify-center text-xs opacity-50">[YouTube Video: {w.url}]</div>}
                  {w.type === 'spotify' && w.url && <div className="h-20 w-full rounded-lg overflow-hidden bg-black/50 flex items-center justify-center text-xs opacity-50">[Spotify Embed: {w.url}]</div>}
                  {w.type === 'link' && w.url && <a href={w.url} target="_blank" rel="noreferrer" className="text-blue-400 underline font-medium break-all text-center">{w.url}</a>}
                  {w.type === 'map' && w.url && <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/50 flex items-center justify-center text-xs opacity-50">[Map: {w.url}]</div>}
                  {!['text', 'image', 'youtube', 'spotify', 'link', 'map'].includes(w.type) && <div>[{w.type} widget placeholder]</div>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-4">
        {theme.likeSystem && (
          <button onClick={toggleLike} className="flex items-center gap-1.5 text-sm font-medium text-zinc-300 hover:text-white transition">
            <span className={liked ? 'heart-pop' : ''}>{liked ? '❤️' : '🤍'}</span>
            <span>{likes}</span>
          </button>
        )}
        {!preview && profile.phone && (
          <button onClick={saveContact} className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition border border-white/10 rounded-md px-3 py-1.5">📇 Lưu danh bạ</button>
        )}
        {onShare && (
          <button onClick={onShare} className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition border border-white/10 rounded-md px-3 py-1.5">⤴ Chia sẻ</button>
        )}
      </div>

      <div className="w-full pt-4 mt-1 border-t border-white/10 flex flex-col items-center gap-2">
        {theme.showStats !== false && (
          <div className="flex items-center gap-3 text-xs font-medium" style={descStyle}>
            <span>{profile.view_count} lượt xem</span>
            <span className="opacity-40">·</span>
            <span>{links.length} liên kết</span>
            {memberSince && <><span className="opacity-40">·</span><span>từ {memberSince}</span></>}
          </div>
        )}
        <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-semibold">made with ▲ bio</div>
      </div>
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
