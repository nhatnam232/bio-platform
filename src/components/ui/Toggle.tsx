export default function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  // Token-driven switch: on=brand, focus-visible ring, a11y role=switch (skill.md)
  const track = checked ? 'bg-brand border-brand' : 'bg-white/10 border-white/20'
  const knob = checked ? 'translate-x-[18px] bg-white' : 'translate-x-0.5 bg-zinc-400'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-dash-bg"
    >
      {label && <span className="text-sm text-zinc-300">{label}</span>}
      <span className={'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition ' + track}>
        <span className={'h-3.5 w-3.5 rounded-full transition ' + knob} />
      </span>
    </button>
  )
}
