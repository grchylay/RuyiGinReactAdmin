import React from 'react'
import { Card } from 'antd'
import type { CardProps } from 'antd'
import { cardGlassStyle } from '../../theme/config'

export interface GlassCardProps extends CardProps {
  glow?: boolean
}

const GlassCard: React.FC<GlassCardProps> = ({ glow, style, children, ...rest }) => (
  <Card
    style={{
      ...cardGlassStyle,
      position: 'relative',
      overflow: 'hidden',
      ...(style as React.CSSProperties),
    }}
    {...rest}
  >
    {glow && (
      <div style={{
        position: 'absolute', bottom: -40, right: -20,
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,92,255,0.06), transparent)',
        pointerEvents: 'none',
      }} />
    )}
    {children}
  </Card>
)

export default GlassCard
