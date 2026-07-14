import { motion } from 'framer-motion'

export interface GradientBorderProps {
  style?: React.CSSProperties
  colors?: string
}

const GradientBorder: React.FC<GradientBorderProps> = ({
  style,
  colors = 'linear-gradient(135deg, rgba(26,92,255,0.4), rgba(99,102,241,0.1), rgba(26,92,255,0.4))',
}) => (
  <motion.div
    style={{
      position: 'absolute', inset: -1, borderRadius: 17,
      pointerEvents: 'none', zIndex: 0, opacity: 0,
      ...style,
    }}
    whileHover={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div style={{ width: '100%', height: '100%', borderRadius: 17, padding: 1, background: colors }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 16, background: 'transparent' }} />
    </div>
  </motion.div>
)

export default GradientBorder
