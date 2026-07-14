import { motion } from 'framer-motion'

export interface RippleBorderProps {
  style?: React.CSSProperties
  color?: string
}

const RippleBorder: React.FC<RippleBorderProps> = ({ style, color = 'rgba(26,92,255,0.15)' }) => (
  <motion.div
    style={{
      position: 'absolute', inset: -1, borderRadius: 17,
      pointerEvents: 'none', zIndex: 0,
      ...style,
    }}
    initial={{ opacity: 0 }}
    whileHover={{
      opacity: 1,
      boxShadow: [
        `0 0 0 0px ${color}`,
        `0 0 0 2px ${color.replace('0.15', '0.25')}`,
        `0 0 0 6px transparent`,
      ],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeOut' },
    }}
  />
)

export default RippleBorder
