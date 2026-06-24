import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Profile as ProfileType } from '../types'
import Effects from '../components/Effects'
import DiscordPresence from '../components/DiscordPresence'

export default function Profile() {
  const { username } = useParams()
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [entered, setEntered] = useState(false)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!username) return
    const uname = username.toLowerCase()
    supabase
      .from('profiles')
      .select('*')
      .eq('username', uname)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setNotFound(true)
        } else {
          setProfile(data as ProfileType)
          supabase.rpc('increment_views', { profile_username: uname })
        }
        setLoading(false)
      })
  }, [username])

  const enter = () => {
    setEntered(true)
    const a = audioRef.current
    if (a) a.play().catch(() => {})
  }

  const toggleMute = () => {
    const a = audioRef.current
    if (!a) return
    a.muted = !a.muted
    setMuted(a.muted)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-bg text-white">Đang tải...</div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center animated-bg text-white gap-2">
        <h1 className="text-6xl font-extrabold">404</h1>
        <p className="text-gray-400">Không tìm thấy @{username}</p>
      </div>
    )
  }

  const accent = profile.theme?.accent ?? '#a855f7'
  const font = profile.theme?.font ?? 'system-ui, sans-serif'
  const effects = profile.theme?.effects ?? []
  const bg = profile.background
  const useCustomBg = !!(bg && bg.type && bg.url)

  const rootStyle = { fontFamily: font }
  const avatarStyle = { boxShadow: '0 0 50px ' + accent + 'aa', borderColor: accent }
  const linkStyle = { borderColor: accent + '55' }
  const accentText = { color: accent }
  const blob1 = { width: '380px', height: '380px', background: accent, top: '-80px', left: '-80px' }
  const blob2 = { width: '320px', height: '320px', background: '#3b82f6', bottom: '-60px', right: '-60px', animationDelay: '4s' }
  const bgImageStyle = bg?.url
    ? { backgroundImage: 'url(' + bg.url + ')', backgroundSize: 'cover', backgroundPosition: 'center' }
    : {}

  const rootClass =
    'relative min-h-screen overflow-hidden text-white ' + (useCustomBg ? 'bg-black' : 'animated-bg')

  return (
    <div className={rootClass} style={rootStyle}>
      {/* Nền tuỳ chỉnh */}
      {useCustomBg && bg?.type === 'image' && (
        <div className="fixed inset-0" style={bgImageStyle} />
      )}
      {useCustomBg && bg?.type === 'video' && (
        <video className="fixed inset-0 w-full h-full object-cover" src={bg.url} autoPlay loop muted playsInline />
      )}
      <div className="fixed inset-0 bg-black/40" />

      {/* Quầng sáng (chỉ khi dùng gradient) */}
      {!useCustomBg && <div className="blob" style={blob1} />}
      {!useCustomBg && <div className="blob" style={blob2} />}

      {/* Hiệu ứng + custom cursor */}
      <Effects effects={effects} accent={accent} cursorUrl={profile.cursor_url} />

      {profile.music_url && <audio ref={audioRef} src={profile.music_url} loop preload="auto" />}

      {/* Màn hình bấm để vào */}
      {!entered && (
        <button
          onClick={enter}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-md cursor-pointer"
        >
          <span className="text-xl tracking-[0.3em] uppercase animate-pulse">Bấm để vào</span>
        </button>
      )}

      {/* Nội dung */}
      <div
        className={
          'relative z-10 min-h-screen flex items-center justify-center p-6 transition-all duration-700 ' +
          (entered ? 'opacity-100 blur-0' : 'opacity-0 blur-sm')
        }
      >
        <div className="glass rounded-3xl px-8 py-10 w-full max-w-md flex flex-col items-center gap-5 text-center fade-up">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              style={avatarStyle}
              className="avatar-glow w-28 h-28 rounded-full object-cover border-2"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold">{profile.display_name || profile.username}</h1>
            <p className="text-sm" style={accentText}>@{profile.username}</p>
          </div>

          {profile.bio && <p className="text-gray-300 whitespace-pre-line leading-relaxed">{profile.bio}</p>}

          {profile.badges && profile.badges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {profile.badges.map((b, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full glass">{b}</span>
              ))}
            </div>
          )}

          {profile.discord_id && <DiscordPresence discordId={profile.discord_id} />}

          <div className="flex flex-col gap-3 w-full mt-2">
            {(profile.links ?? []).map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                style={linkStyle}
                className="glass border px-5 py-3 rounded-xl font-medium transition-all duration-200 hover:-translate-y-1 hover:bg-white/15"
              >
                {link.label || link.url}
              </a>
            ))}
          </div>

          <div className="text-xs text-gray-400 mt-3">👁 {profile.view_count} lượt xem</div>
        </div>
      </div>

      {entered && profile.music_url && (
        <button
          onClick={toggleMute}
          className="fixed bottom-5 right-5 z-30 glass w-11 h-11 rounded-full flex items-center justify-center text-lg hover:bg-white/20 transition"
          title={muted ? 'Bật nhạc' : 'Tắt nhạc'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      )}
    </div>
  )
}
