import React from 'react'
import { Typography } from 'antd'
import { GlassBarChart, GlassCard } from '../../ui'
import type { ChartDataPoint } from '../../ui'
import { themeColors } from '../../theme/config'

const { Text } = Typography

export interface VisitChartProps {
  data: ChartDataPoint[]
  title?: string
}

const VisitChart: React.FC<VisitChartProps> = ({ data, title = '近7日访问趋势' }) => (
  <GlassCard
    title={<Text style={{ fontWeight: 600, color: themeColors.textPrimary, letterSpacing: 1 }}>{title}</Text>}
  >
    <GlassBarChart data={data} />
  </GlassCard>
)

export default VisitChart
