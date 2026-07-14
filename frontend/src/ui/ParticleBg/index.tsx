import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; opacity: number; hue: number
}

export interface ParticleBgProps {
  density?: number
  colorHue?: [number, number]
  connectDistance?: number
  lineOpacity?: number
}

const ParticleBg: React.FC<ParticleBgProps> = ({
  density = 60,
  colorHue = [200, 260],
  connectDistance = 120,
  lineOpacity = 0.12,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const c = Math.min(density, Math.floor((canvas.width * canvas.height) / 25000))
    particlesRef.current = Array.from({ length: c }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.15,
      hue: Math.random() * (colorHue[1] - colorHue[0]) + colorHue[0],
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const ps = particlesRef.current
      const time = Date.now() * 0.0005
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i]
        p.x += p.vx + Math.sin(time + i) * 0.15
        p.y += p.vy + Math.cos(time + i * 0.7) * 0.15
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
        grad.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${p.opacity})`)
        grad.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`)
        ctx.fillStyle = grad
        ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 90%, 80%, ${p.opacity + 0.2})`
        ctx.fill()
      }
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x
          const dy = ps[i].y - ps[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectDistance) {
            const alpha = (1 - dist / connectDistance) * lineOpacity
            ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y)
            ctx.strokeStyle = `hsla(220, 80%, 60%, ${alpha})`
            ctx.lineWidth = 0.6; ctx.stroke()
          }
        }
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animRef.current) }
  }, [density, colorHue[0], colorHue[1], connectDistance, lineOpacity])

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      pointerEvents: 'none', zIndex: 0,
    }} />
  )
}

export default ParticleBg
