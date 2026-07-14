import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export interface TiltCardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  glowColor?: string
  tiltFactor?: number
}

const TiltCard: React.FC<TiltCardProps> = ({
  children, style, glowColor = 'rgba(26,92,255,0.15)', tiltFactor = 6,
}) => {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const springX = useSpring(x, { stiffness: 250, damping: 25 })
  const springY = useSpring(y, { stiffness: 250, damping: 25 })
  const rotateX = useTransform(springY, [0, 1], [tiltFactor, -tiltFactor])
  const rotateY = useTransform(springX, [0, 1], [-tiltFactor, tiltFactor])
  const glowX = useTransform(springX, [0, 1], ['0%', '100%'])
  const glowY = useTransform(springY, [0, 1], ['0%', '100%'])

  const handleMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }
  const handleLeave = () => { x.set(0.5); y.set(0.5) }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX, rotateY, perspective: 800,
        transformStyle: 'preserve-3d',
        position: 'relative',
        ...style,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        style={{
          position: 'absolute', inset: -2, borderRadius: 18,
          background: useTransform(
            [glowX, glowY] as any,
            ([gx, gy]: string[]) => `radial-gradient(circle at ${gx} ${gy}, ${glowColor}, transparent 60%)`
          ),
          pointerEvents: 'none', zIndex: 0, opacity: 0.6,
        }}
      />
      {children}
    </motion.div>
  )
}

export default TiltCard
