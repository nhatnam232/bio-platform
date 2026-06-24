import TypingText from './TypingText'

export default function NameText({
  text,
  effect,
  color,
  glow,
  className,
}: {
  text: string
  effect?: string
  color?: string
  glow?: boolean
  className?: string
}) {
  const style = { color: color || undefined }
  const fx =
    effect === 'glow' ? 'fx-glow' :
    effect === 'rainbow' ? 'fx-rainbow' :
    effect === 'gradient' ? 'fx-gradient' :
    effect === 'shake' ? 'fx-shake' :
    effect === 'neon' ? 'fx-neon' :
    effect === 'glitch' ? 'fx-glitch' : ''
  const glowCls = glow && effect !== 'glow' && effect !== 'neon' ? 'fx-glow' : ''
  if (effect === 'typing') {
    return <span className={className} style={style}><TypingText text={text} /></span>
  }
  return <span className={(className || '') + ' ' + fx + ' ' + glowCls} style={style}>{text}</span>
}
