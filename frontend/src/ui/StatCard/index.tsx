import React from 'react'
import { Card, Typography } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import TiltCard from '../TiltCard'
import CountUp from '../CountUp'
import GradientBorder from '../GradientBorder'
import RippleBorder from '../RippleBorder'
import { cardGlassStyle, themeColors } from '../../theme/config'

const { Text } = Typography

export interface StatItem {
  id: string
  label: string
  value: string
  unit: string
  trend: 'up' | 'down'
  trendValue: string
  icon: React.ReactNode
  color: string
}

export interface StatCardProps {
  stat: StatItem
  index?: number
}

const StatCard: React.FC<StatCardProps> = ({ stat, index = 0 }) => (
  <TiltCard glowColor={`${stat.color}30`}>
    <div style={{ position: 'relative' }}>
      <GradientBorder />
      <RippleBorder color={`${stat.color}30`} />
      <Card
        hoverable
        style={{
          ...cardGlassStyle,
          borderRadius: 16,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
        bodyStyle={{ padding: '22px 24px' }}
      >
        <motion.div
          style={{
            position: 'absolute', top: '-50%', right: '-30%',
            width: 180, height: 180, borderRadius: '50%',
            background: `radial-gradient(circle, ${stat.color}10, transparent 70%)`,
            pointerEvents: 'none',
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, delay: index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <Text style={{ color: themeColors.textSecondary, fontSize: 13, letterSpacing: 1 }}>{stat.label}</Text>
            <div style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 30, fontWeight: 700, color: themeColors.textPrimary, fontFamily: 'monospace', letterSpacing: 1 }}>
                <CountUp value={stat.value} />
              </Text>
              {stat.unit && <Text style={{ fontSize: 14, color: themeColors.textSecondary, marginLeft: 4 }}>{stat.unit}</Text>}
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
              <motion.div animate={{ y: stat.trend === 'up' ? [0, -3, 0] : [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                {stat.trend === 'up'
                  ? <ArrowUpOutlined style={{ color: themeColors.accentGreen, fontSize: 12 }} />
                  : <ArrowDownOutlined style={{ color: themeColors.accentRed, fontSize: 12 }} />}
              </motion.div>
              <Text style={{ fontSize: 13, color: stat.trend === 'up' ? themeColors.accentGreen : themeColors.accentRed }}>
                较昨日 {stat.trendValue}
              </Text>
            </div>
          </div>
          <motion.div
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: `linear-gradient(135deg, ${stat.color}25, ${stat.color}08)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color, border: `1px solid ${stat.color}25`,
            }}
            animate={{
              y: [0, -4, 0],
              boxShadow: [`0 0 0px ${stat.color}00`, `0 0 20px ${stat.color}30`, `0 0 0px ${stat.color}00`],
            }}
            transition={{ duration: 3, delay: index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {stat.icon}
          </motion.div>
        </div>
      </Card>
    </div>
  </TiltCard>
)

export default StatCard
