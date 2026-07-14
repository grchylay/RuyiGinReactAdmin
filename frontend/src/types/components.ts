import type { ReactNode, CSSProperties } from 'react'

/* ============================================================
   Glass 系列组件 Props
   ============================================================ */

export interface GlassCardProps {
  children: ReactNode
  /** 是否启用 hover 3D 悬浮效果（默认 true） */
  tilt?: boolean
  /** 炫光跟随颜色（默认 'rgba(26,92,255,0.15)'） */
  glowColor?: string
  /** 是否启用流光边框（默认 false） */
  gradientBorder?: boolean
  /** 是否启用水波纹（默认 false） */
  ripple?: boolean
  /** 卡片样式覆盖 */
  style?: CSSProperties
  /** body 区域样式覆盖（antd v6 使用 styles.body） */
  bodyStyle?: CSSProperties
  /** Ant Card hoverable */
  hoverable?: boolean
  /** 卡片标题 */
  title?: ReactNode
  /** 装饰光晕 */
  decoration?: {
    position?: { top?: number; right?: number; bottom?: number; left?: number }
    size?: number
    color?: string
  }
  /** 入场动画延迟（秒） */
  animationDelay?: number
  onClick?: () => void
}

export interface GlassPanelProps {
  children: ReactNode
  /** 玻璃强度 0-1（默认 0.05） */
  glassOpacity?: number
  /** 边框透明度（默认 0.08） */
  borderOpacity?: number
  /** 模糊像素（默认 20） */
  blur?: number
  borderRadius?: number
  style?: CSSProperties
}

export interface GlassBarChartProps {
  data: { label: string; value: number }[]
  height?: number
  barColors?: string[]
  waveEffect?: boolean
  showValue?: boolean
  staggerDelay?: number
  maxBarWidth?: number
}

/* ============================================================
   动效组件 Props
   ============================================================ */

export interface TiltCardProps {
  children: ReactNode
  maxRotate?: number
  stiffness?: number
  damping?: number
  glowColor?: string
  perspective?: number
  style?: CSSProperties
  animation?: {
    initial?: { opacity?: number; y?: number; scale?: number }
    animate?: { opacity?: number; y?: number; scale?: number }
    duration?: number
    delay?: number
  }
}

export interface GradientBorderProps {
  gradient?: string
  borderRadius?: number
  borderWidth?: number
  initialOpacity?: number
  hoverOpacity?: number
  transitionDuration?: number
}

export interface RippleBorderProps {
  color?: string
  borderRadius?: number
  spreadRange?: [number, number]
  duration?: number
}

export interface CountUpProps {
  value: string | number
  duration?: number
  easing?: 'easeOutExpo' | 'easeOutCubic' | 'linear'
  style?: CSSProperties
  formatter?: (value: number) => string
}

export interface AnimatedRowProps {
  children: ReactNode
  index: number
  direction?: 'left' | 'right' | 'up' | 'down'
  baseDelay?: number
  staggerDelay?: number
}

/* ============================================================
   布局组件 Props
   ============================================================ */

export interface MenuItem {
  key: string
  icon: ReactNode
  label: string
  children?: MenuItem[]
}

export interface SideMenuProps {
  collapsed: boolean
  items: MenuItem[]
  selectedKey?: string
  onMenuClick?: (key: string) => void
  version?: string
}

export interface HeaderBarProps {
  collapsed: boolean
  onToggle: () => void
  title?: string
  logo?: ReactNode
  actions?: ReactNode
}

export interface NotificationDropdownItem {
  key: string
  title: string
  description: string
  time: string
  type?: 'info' | 'warning' | 'error'
}

export interface NotificationDropdownProps {
  items: NotificationDropdownItem[]
  unreadCount?: number
  onViewAll?: () => void
}

export interface UserDropdownProps {
  username?: string
  avatar?: string
  onProfile?: () => void
  onSettings?: () => void
  onLogout?: () => void
}

export interface MainLayoutProps {
  children: ReactNode
  collapsed: boolean
  onToggle: () => void
  headerProps?: Partial<HeaderBarProps>
  menuProps?: Partial<SideMenuProps>
}

/* ============================================================
   仪表盘业务组件 Props
   ============================================================ */

export interface PageHeaderProps {
  title: string
  subtitle?: string
  status?: {
    text: string
    color?: string
  }
}

export interface StatCardGridProps {
  stats: import('./dashboard').DashboardStat[]
  colSpan?: Record<string, number>
}

export interface TrendChartProps {
  data: import('./dashboard').ChartDataPoint[]
  title?: string
  height?: number
}

export interface NotificationPanelProps {
  notifications: import('./dashboard').NotificationItem[]
  title?: string
}

export interface RecentOrdersProps {
  orders: import('./dashboard').RecentOrder[]
  columns?: any[]
}
