import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getVisitorKey } from '../lib/likes'
import { Profile as ProfileType, Theme } from '../types'
import Effects from '../components/Effects'
import BackgroundFX from '../components/BackgroundFX'
import BioCard from '../components/BioCard'
import ShareModal from '../components/ShareModal'

export default function Profile() {
  const { username } = useParams()
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [entered, setEntered] = useState(false)
  const [muted, setMuted] = useState(false)
  const [share, setShare] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!username) return
    const uname = username.toLowerCase()
    supabase.from('profiles').select('*').eq('username', uname).maybeSingle().then(({ data }) => {
      if (!data) setNotFound(true)
      else {
        setProfile(data as ProfileType)
        supabase.rpc('increment_views', { profile_username: uname, p_visitor_key: getVisitorKey() })
      }
      setLoading(false)
    })
  }, [username])

  const theme: Theme = profile?.theme ?? {}

  useEffect(() => {
    if (!profile) return
    const base = (profile.display_name || profile.username) + ' — bio'
    if (!theme.animationTitle) {
      document.title = base
      return
    }
    let s = '✦ ' + base + ' ✦   '
    const id = setInterval(() => {
      s = s.slice(1) + s.slice(0, 1)
      document.title = s
    }, 350)
    return () => clearInterval(id)
  }, [profile, theme.animationTitle])

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
      <div className="relative min-h-screen flex items-center justify-center bg-black">
        <BackgroundFX accent="#ffffff" />
        <span className="relative z-10 text-zinc-500 text-sm">loading…</span>
      </div>
    )
  }
  if (notFound || !profile) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-black gap-2">
        <BackgroundFX accent="#ffffff" />
        <h1 className="relative z-10 text-7xl font-extrabold">404</h1>
        <p className="relative z-10 text-zinc-500">@{username} không tồn tại</p>
      </div>
    )
  }

  const accent = theme.accent || '#ffffff'
  const accent2 = theme.accent2 || accent
  const effects = theme.effects ?? []
  const bg = profile.background
  const banner = theme.wallpaperMode === 'banner'
  const useCustomBg = !!(bg && bg.type && bg.url)
  const profileUrl = typeof window !== 'undefined' ? window.location.href : ''
  const bgColor = theme.colors?.background || '#000000'

  const rootStyle = { fontFamily: theme.font || undefined, backgroundColor: bgColor }
  const fullBgStyle = { backgroundImage: 'url(' + (bg?.url || '') + ')', backgroundSize: 'cover', backgroundPosition: 'center', filter: bg?.blur ? 'blur(' + bg.blur + 'px)' : undefined }
  const overlayStyle = { opacity: bg?.opacity ?? 0.5, backgroundColor: bgColor }
  const bannerStyle = { backgroundImage: 'url(' + (bg?.url || '') + ')', backgroundSize: 'cover', backgroundPosition: 'center' }
  const enterAccent = { color: accent }
  const audioBtnStyle = { color: theme.colors?.audioControl || '#ffffff' }

  return (
    <div className="relative min-h-screen overflow-hidden text-white" style={rootStyle}>
      {useCustomBg && !banner && (
        <>
          {bg?.type === 'image' && <div className="fixed inset-0 -z-10" style={fullBgStyle} />}
          {bg?.type === 'video' && <video className="fixed inset-0 -z-10 w-full h-full object-cover" src={bg?.url} autoPlay loop muted playsInline />}
          <div className="fixed inset-0 -z-10" style={overlayStyle} />
        </>
      )}
      {!useCustomBg && <BackgroundFX accent={accent} accent2={accent2} />}

      <Effects effects={effects} accent={accent} cursorUrl={profile.cursor_url} />
      {profile.music_url && <audio ref={audioRef} src={profile.music_url} loop preload="auto" />}

      {!entered && (
        <button onClick={enter} className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md cursor-pointer gap-3">
          <span className="text-xs uppercase tracking-[0.4em] text-zinc-400">{theme.enterText || 'click to enter'}</span>
          <span className="text-2xl font-semibold" style={enterAccent}>▸ {profile.username}</span>
        </button>
      )}

      <div className={'relative z-10 min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-700 ' + (entered ? 'opacity-100 blur-0' : 'opacity-0 blur-sm pointer-events-none')}>
        {useCustomBg && banner && bg?.type === 'image' && <div className="w-full max-w-md h-32 rounded-xl mb-4" style={bannerStyle} />}
        <BioCard profile={profile} onShare={() => setShare(true)} />
      </div>

      {entered && profile.music_url && theme.volumeControl !== false && (
        <button onClick={toggleMute} className="fixed bottom-5 right-5 z-30 w-11 h-11 border border-white/15 bg-black/50 backdrop-blur rounded-md flex items-center justify-center hover:border-white/40 transition" style={audioBtnStyle} title={muted ? 'Bật nhạc' : 'Tắt nhạc'}>
          {muted ? '🔇' : '🔊'}
        </button>
      )}

      {share && <ShareModal url={profileUrl} accent={accent} onClose={() => setShare(false)} />}
    </div>
  )
}
