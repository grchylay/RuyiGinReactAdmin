/**
 * Mock 数据：仪表盘统计数据
 */
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

// 仪表盘统计数据
export const dashboardStats: DashboardStat[] = [
  { id: '1', label: '今日访问', value: '8,846', unit: '次', trend: 'up', trendValue: '12.5%', icon: 'EyeOutlined', color: '#1a5cff' },
  { id: '2', label: '订单总量', value: '1,280', unit: '单', trend: 'up', trendValue: '8.2%', icon: 'ShoppingCartOutlined', color: '#22c55e' },
  { id: '3', label: '用户总数', value: '3,642', unit: '人', trend: 'up', trendValue: '5.7%', icon: 'UserOutlined', color: '#f59e0b' },
  { id: '4', label: '营收金额', value: '¥68,420', unit: '', trend: 'down', trendValue: '2.1%', icon: 'DollarOutlined', color: '#ef4444' },
]

// 最近订单
export const recentOrders: RecentOrder[] = [
  { id: '1', orderNo: 'ORD-20240714-001', customer: '清风阁', amount: 1280.00, status: 'completed', createTime: '2024-07-14 09:30' },
  { id: '2', orderNo: 'ORD-20240714-002', customer: '云水轩', amount: 560.00, status: 'processing', createTime: '2024-07-14 10:15' },
  { id: '3', orderNo: 'ORD-20240714-003', customer: '墨香居', amount: 2380.00, status: 'pending', createTime: '2024-07-14 11:00' },
  { id: '4', orderNo: 'ORD-20240714-004', customer: '翠竹堂', amount: 890.00, status: 'completed', createTime: '2024-07-14 11:45' },
  { id: '5', orderNo: 'ORD-20240714-005', customer: '听雨轩', amount: 1680.00, status: 'cancelled', createTime: '2024-07-14 13:20' },
  { id: '6', orderNo: 'ORD-20240714-006', customer: '揽月楼', amount: 3200.00, status: 'completed', createTime: '2024-07-14 14:00' },
]

// 近7日访问趋势
export const visitTrend: ChartDataPoint[] = [
  { date: '07-08', value: 5200 },
  { date: '07-09', value: 6100 },
  { date: '07-10', value: 5800 },
  { date: '07-11', value: 7200 },
  { date: '07-12', value: 6900 },
  { date: '07-13', value: 8100 },
  { date: '07-14', value: 8846 },
]

// 系统通知
export const notifications = [
  { id: '1', title: '系统更新提醒', content: '如意后台管理系统 v2.1.0 已发布，点击查看更新日志', time: '5分钟前', type: 'info' },
  { id: '2', title: '订单提醒', content: '您有 3 笔新订单待处理', time: '15分钟前', type: 'warning' },
  { id: '3', title: '安全通知', content: '上次登录 IP: 192.168.1.100，如非本人操作请及时修改密码', time: '1小时前', type: 'error' },
]
