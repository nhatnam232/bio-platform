export default function SecurityTab() {
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
              placeholder="Mật khẩu hiện tại" 
              className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition disabled:opacity-50"
              disabled
            />
            <input 
              type="password" 
              placeholder="Mật khẩu mới" 
              className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-white focus:ring-1 focus:ring-white outline-none transition disabled:opacity-50"
              disabled
            />
            <button className="self-start mt-3 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:hover:scale-100" disabled>
              Cập nhật mật khẩu
            </button>
            <div className="mt-4 border border-dashed border-white/20 rounded-lg p-4 text-xs text-zinc-500 text-center bg-black/30 leading-relaxed">
              [Backend / CL: Hook tính năng đổi mật khẩu Supabase vào khu vực này]
            </div>
          </div>
        </div>

        <div className="border border-red-500/20 rounded-2xl p-6 bg-red-500/[0.02]">
          <h3 className="text-base font-semibold text-red-500 mb-2 flex items-center gap-2">
            <span>⚠️</span> Vùng nguy hiểm
          </h3>
          <p className="text-sm text-red-400/80 mb-5 max-w-md leading-relaxed">Hành động này không thể hoàn tác. Toàn bộ dữ liệu profile, avatar, theme và thông tin đăng nhập sẽ bị xoá vĩnh viễn.</p>
          <button className="px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-semibold rounded-xl hover:bg-red-500/20 transition disabled:opacity-50" disabled>
            Xoá tài khoản vĩnh viễn
          </button>
          <div className="mt-4 max-w-md border border-dashed border-red-500/30 rounded-lg p-4 text-xs text-red-500/60 text-center bg-red-500/5 leading-relaxed">
            [Backend / CL: Viết Edge Function hoặc RPC để xoá hoàn toàn Auth User và các dữ liệu liên quan ở đây]
          </div>
        </div>
      </div>
    </div>
  )
}