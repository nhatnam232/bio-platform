import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
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
        supabase.rpc('increment_views', { profile_username: uname })
      }
      setLoading(false)
    })
  }, [username])

  useEffect(() => {
    if (profile) document.title = (profile.display_name || profile.username) + ' — bio'
  }, [profile])

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
        <span className="relative z-10 text-zinc-500 font-mono text-sm">loading…</span>
      </div>
    )
  }
  if (notFound || !profile) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-black gap-2">
        <BackgroundFX accent="#ffffff" />
        <h1 className="relative z-10 text-7xl font-extrabold font-mono">404</h1>
        <p className="relative z-10 text-zinc-500 font-mono">@{username} không tồn tại</p>
      </div>
    )
  }

  const theme: Theme = profile.theme ?? {}
  const accent = theme.accent || '#ffffff'
  const accent2 = theme.accent2 || accent
  const effects = theme.effects ?? []
  const bg = profile.background
  const useCustomBg = !!(bg && bg.type && bg.url)
  const profileUrl = typeof window !== 'undefined' ? window.location.href : ''

  const rootStyle = { fontFamily: theme.font || undefined }
  const imgBgStyle = { backgroundImage: 'url(' + (bg?.url || '') + ')', backgroundSize: 'cover', backgroundPosition: 'center', filter: bg?.blur ? 'blur(' + bg.blur + 'px)' : undefined }
  const overlayStyle = { opacity: bg?.opacity ?? 0.5 }
  const enterAccent = { color: accent }

  return (
    <div className="relative min-h-screen overflow-hidden text-white" style={rootStyle}>
      {useCustomBg ? (
        <>
          {bg?.type === 'image' && <div className="fixed inset-0 -z-10" style={imgBgStyle} />}
          {bg?.type === 'video' && <video className="fixed inset-0 -z-10 w-full h-full object-cover" src={bg?.url} autoPlay loop muted playsInline />}
          <div className="fixed inset-0 -z-10 bg-black" style={overlayStyle} />
        </>
      ) : (
        <BackgroundFX accent={accent} accent2={accent2} />
      )}

      <Effects effects={effects} accent={accent} cursorUrl={profile.cursor_url} />
      {profile.music_url && <audio ref={audioRef} src={profile.music_url} loop preload="auto" />}

      {!entered && (
        <button onClick={enter} className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md cursor-pointer gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-zinc-400">click to enter</span>
          <span className="font-mono text-2xl" style={enterAccent}>▸ {profile.username}</span>
        </button>
      )}

      <div className={'relative z-10 min-h-screen flex items-center justify-center p-6 transition-all duration-700 ' + (entered ? 'opacity-100 blur-0' : 'opacity-0 blur-sm pointer-events-none')}>
        <BioCard profile={profile} onShare={() => setShare(true)} />
      </div>

      {entered && profile.music_url && (
        <button onClick={toggleMute} className="fixed bottom-5 right-5 z-30 w-11 h-11 border border-white/15 bg-black/50 backdrop-blur flex items-center justify-center hover:border-white/40 transition" title={muted ? 'Bật nhạc' : 'Tắt nhạc'}>
          {muted ? '🔇' : '🔊'}
        </button>
      )}

      {share && <ShareModal url={profileUrl} accent={accent} onClose={() => setShare(false)} />}
    </div>
  )
}
