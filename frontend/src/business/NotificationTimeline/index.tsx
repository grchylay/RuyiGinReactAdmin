import React from 'react'
import { Typography, Timeline } from 'antd'
import { motion } from 'framer-motion'
import { GlassCard } from '../../ui'
import { themeColors } from '../../theme/config'

const { Text } = Typography

export interface NotificationItem {
  id: string
  title: string
  content: string
  time: string
  type: 'info' | 'warning' | 'error'
}

export interface NotificationTimelineProps {
  items: NotificationItem[]
  title?: string
}

const typeColorMap: Record<string, string> = {
  info: themeColors.primary,
  warning: themeColors.accentOrange,
  error: themeColors.accentRed,
}

const NotificationTimeline: React.FC<NotificationTimelineProps> = ({ items, title = '系统通知' }) => (
  <GlassCard title={<Text style={{ fontWeight: 600, color: themeColors.textPrimary, letterSpacing: 1 }}>{title}</Text>}>
    <Timeline
      items={items.map((n, i) => ({
        color: typeColorMap[n.type] || themeColors.primary,
        children: (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          >
            <Text style={{ fontWeight: 500, fontSize: 14, color: themeColors.textPrimary }}>{n.title}</Text>
            <div><Text style={{ color: themeColors.textSecondary, fontSize: 13 }}>{n.content}</Text></div>
            <Text style={{ color: themeColors.textMuted, fontSize: 12 }}>{n.time}</Text>
          </motion.div>
        ),
      }))}
    />
  </GlassCard>
)

export default NotificationTimeline
