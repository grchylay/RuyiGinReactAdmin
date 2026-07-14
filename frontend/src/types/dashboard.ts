/** 仪表盘相关类型 */
export interface DashboardStat {
  id: string
  label: string
  value: string
  unit: string
  trend: 'up' | 'down'
  trendValue: string
  icon: string
  color: string
}

export interface RecentOrder {
  id: string
  orderNo: string
  customer: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createTime: string
}

export interface ChartDataPoint {
  date: string
  value: number
}

export interface NotificationItem {
  id: string
  title: string
  content: string
  time: string
  type: 'info' | 'warning' | 'error'
}

export type OrderStatus = RecentOrder['status']
