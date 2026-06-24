export default function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  const track = checked ? 'bg-emerald-500/80 border-emerald-400/50' : 'bg-white/10 border-white/15'
  const knob = checked ? 'translate-x-[18px] bg-white' : 'translate-x-0.5 bg-zinc-400'
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center justify-between gap-3 w-full">
      {label && <span className="text-sm text-zinc-300">{label}</span>}
      <span className={'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition ' + track}>
        <span className={'h-3.5 w-3.5 rounded-full transition ' + knob} />
      </span>
    </button>
  )
}
