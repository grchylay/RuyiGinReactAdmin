import React from 'react'
import { motion } from 'framer-motion'

export interface AnimatedRowProps {
  children: React.ReactNode
  index?: number
  delay?: number
}

const AnimatedRow: React.FC<AnimatedRowProps> = ({ children, index = 0, delay = 0.4 }) => (
  <motion.tr
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: delay + index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    style={{ display: 'table-row' }}
  >
    {children}
  </motion.tr>
)

export default AnimatedRow
