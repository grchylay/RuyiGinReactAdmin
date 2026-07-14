import React from 'react'
import { motion } from 'framer-motion'
import { Typography } from 'antd'
import { themeColors } from '../../theme/config'

const { Text } = Typography

export interface ChartDataPoint {
  date: string
  value: number
}

export interface GlassBarChartProps {
  data: ChartDataPoint[]
  height?: number
  barColor?: string
  maxBarWidth?: number
}

const GlassBarChart: React.FC<GlassBarChartProps> = ({
  data, height = 140, barColor = themeColors.primary, maxBarWidth = 36,
}) => {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, padding: '12px 0' }}>
      {data.map((item, i) => (
        <motion.div
          key={i}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            style={{
              width: '100%', maxWidth: maxBarWidth, borderRadius: '6px 6px 2px 2px',
              background: `linear-gradient(180deg, ${barColor}dd 0%, ${barColor} 60%, ${themeColors.primaryDark} 100%)`,
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
            }}
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * (height - 50)}px`, minHeight: 10 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scaleY: 1.12, scaleX: 1.08, transformOrigin: 'bottom' }}
          >
            <motion.div
              style={{
                position: 'absolute', top: 0, left: '-100%', right: 0, bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              }}
              animate={{ left: ['-100%', '200%'] }}
              transition={{ duration: 2, delay: i * 0.15, repeat: Infinity, ease: 'linear' }}
            />
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2), transparent)',
            }} />
          </motion.div>
          <Text style={{ fontSize: 10, color: themeColors.textMuted }}>{item.date}</Text>
          <Text style={{ fontSize: 9, color: themeColors.textSecondary, fontFamily: 'monospace', opacity: 0.7 }}>
            {item.value.toLocaleString()}
          </Text>
        </motion.div>
      ))}
    </div>
  )
}

export default GlassBarChart
