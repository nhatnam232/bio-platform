import { useEffect, useState } from 'react'

export default function TypingText({
  text,
  speed = 75,
  className,
}: {
  text: string
  speed?: number
  className?: string
}) {
  const [i, setI] = useState(0)

  useEffect(() => setI(0), [text])
  useEffect(() => {
    if (i >= text.length) return
    const t = setTimeout(() => setI((v) => v + 1), speed)
    return () => clearTimeout(t)
  }, [i, text, speed])

  return (
    <span className={className}>
      {text.slice(0, i)}
      <span className="caret">▌</span>
    </span>
  )
}
