import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function SecurityTab() {
  const { updatePassword, deleteAccount } = useAuth()
  
  const [pwdCurrent, setPwdCurrent] = useState('')
  const [pwdNew, setPwdNew] = useState('')
  const [pwdStatus, setPwdStatus] = useState('')
  const [pwdSaving, setPwdSaving] = useState(false)

  const [delStatus, setDelStatus] = useState('')
  const [delLoading, setDelLoading] = useState(false)

  const handleUpdatePassword = async () => {
    if (!pwdNew) return
    setPwdSaving(true)
    setPwdStatus('')
    try {
      await updatePassword(pwdCurrent, pwdNew)
      setPwdStatus('✅ Đã cập nhật mật khẩu')
      setPwdCurrent('')
      setPwdNew('')
    } catch (err: any) {
      setPwdStatus('❌ Lỗi: ' + (err.message || 'Không thể đổi mật khẩu'))
    } finally {
      setPwdSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('CẢNH BÁO: Toàn bộ dữ liệu profile, avatar, theme và thông tin đăng nhập sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?')) return
    if (!window.confirm('Bạn có thực sự chắc chắn? Đây là thao tác cuối cùng.')) return
    
    setDelLoading(true)
    setDelStatus('')
    try {
      await deleteAccount()
      // Context will sign user out automatically if delete is successful
    } catch (err: any) {
      setDelStatus('❌ Lỗi: ' + (err.message || 'Không thể xoá tài khoản'))
      setDelLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-1.5 text-white">Security</h2>
        <p className="text-sm text-zinc-400">Bảo mật tài khoản và thay đổi mật khẩu.</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
          <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <span>🔑</span> Thay đổi mật khẩu
          </h3>
          <div className="flex flex-col gap-3 max-w-md">
            <input 
              type="password" 
              placeholder="Mật khẩu mới" 
              value={pwdNew}
              onChange={e => setPwdNew(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition disabled:opacity-50"
              disabled={pwdSaving}
            />
            <button 
              onClick={handleUpdatePassword}
              className="self-start mt-3 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:hover:scale-100" 
              disabled={pwdSaving || !pwdNew}
            >
              {pwdSaving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
            {pwdStatus && <div className="mt-2 text-sm text-zinc-400">{pwdStatus}</div>}
          </div>
        </div>

        <div className="border border-red-500/20 rounded-2xl p-6 bg-red-500/[0.02]">
          <h3 className="text-base font-semibold text-red-500 mb-2 flex items-center gap-2">
            <span>⚠️</span> Vùng nguy hiểm
          </h3>
          <p className="text-sm text-red-400/80 mb-5 max-w-md leading-relaxed">Hành động này không thể hoàn tác. Toàn bộ dữ liệu profile, avatar, theme và thông tin đăng nhập sẽ bị xoá vĩnh viễn.</p>
          <button 
            onClick={handleDeleteAccount}
            className="px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-semibold rounded-xl hover:bg-red-500/20 transition disabled:opacity-50" 
            disabled={delLoading}
          >
            {delLoading ? 'Đang xoá...' : 'Xoá tài khoản vĩnh viễn'}
          </button>
          {delStatus && <div className="mt-2 text-sm text-red-400">{delStatus}</div>}
        </div>
      </div>
    </div>
  )
}
