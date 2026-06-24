import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-zinc-500 font-mono text-sm">loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
