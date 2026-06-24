import { useEffect, useState } from 'react'

type Lanyard = {
  discord_user: { username: string; global_name?: string; avatar: string; id: string }
  discord_status: 'online' | 'idle' | 'dnd' | 'offline'
  activities: { name: string; type: number; state?: string; details?: string }[]
}

const statusColor: Record<string, string> = {
  online: '#22c55e',
  idle: '#eab308',
  dnd: '#ef4444',
  offline: '#6b7280',
}
const statusLabel: Record<string, string> = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Bận',
  offline: 'Offline',
}

export default function DiscordPresence({ discordId }: { discordId: string }) {
  const [data, setData] = useState<Lanyard | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    let active = true
    const load = () => {
      fetch('https://api.lanyard.rest/v1/users/' + discordId)
        .then((r) => r.json())
        .then((j) => {
          if (!active) return
          if (j.success) setData(j.data)
          else setErr(true)
        })
        .catch(() => active && setErr(true))
    }
    load()
    const t = setInterval(load, 20000)
    return () => {
      active = false
      clearInterval(t)
    }
  }, [discordId])

  if (err || !data) return null

  const u = data.discord_user
  const avatar = u.avatar
    ? 'https://cdn.discordapp.com/avatars/' + u.id + '/' + u.avatar + '.png?size=64'
    : 'https://cdn.discordapp.com/embed/avatars/0.png'
  const game = data.activities?.find((a) => a.type === 0)
  const dotStyle = { backgroundColor: statusColor[data.discord_status] }

  return (
    <div className="glass rounded-2xl px-4 py-3 w-full flex items-center gap-3 text-left">
      <div className="relative">
        <img src={avatar} alt="" className="w-10 h-10 rounded-full" />
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-black/40"
          style={dotStyle}
        />
      </div>
      <div className="min-w-0">
        <div className="font-medium truncate">{u.global_name || u.username}</div>
        <div className="text-xs text-gray-400 truncate">
          {game ? '🎮 ' + game.name : statusLabel[data.discord_status]}
        </div>
      </div>
    </div>
  )
}
