import React, { useEffect, useRef, useState } from 'react'

export interface CountUpProps {
  value: string
  duration?: number
  className?: string
  style?: React.CSSProperties
}

const CountUp: React.FC<CountUpProps> = ({ value, duration = 1.5, className, style }) => {
  const [displayed, setDisplayed] = useState('0')
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    const clean = value.replace(/[^0-9.]/g, '')
    const prefix = value.replace(/[0-9.,]/g, '')
    const target = parseFloat(clean)
    if (isNaN(target)) { setDisplayed(value); return }
    const start = Date.now()
    const animate = () => {
      const elapsed = (Date.now() - start) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplayed(prefix + Math.floor(target * eased).toLocaleString())
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span className={className} style={style}>{displayed}</span>
}

export default CountUp
