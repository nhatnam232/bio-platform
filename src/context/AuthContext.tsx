import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  updatePassword: async () => {},
  deleteAccount: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Đổi mật khẩu: xác minh mật khẩu hiện tại rồi mới cập nhật mật khẩu mới
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    const email = session?.user?.email
    if (!email) throw new Error('Chưa đăng nhập')

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    })
    if (reauthError) throw new Error('Mật khẩu hiện tại không đúng')

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  // Xoá tài khoản vĩnh viễn qua RPC security definer, sau đó đăng xuất
  const deleteAccount = async () => {
    const { error } = await supabase.rpc('delete_account')
    if (error) throw error
    await supabase.auth.signOut()
  }

  const value: AuthContextType = {
    user: session?.user ?? null,
    session,
    loading,
    signOut,
    updatePassword,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
