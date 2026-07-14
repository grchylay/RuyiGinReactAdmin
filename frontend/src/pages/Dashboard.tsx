import React from 'react'
import { Card, Row, Col, Table, Tag, Typography, Timeline } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, EyeOutlined, ShoppingCartOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { themeColors, cardGlassStyle, gradients } from '../theme/config'
import { dashboardStats, recentOrders, visitTrend, notifications } from '../mock/dashboard'

const { Title, Text } = Typography

const iconMap: Record<string, React.ReactNode> = {
  EyeOutlined: <EyeOutlined style={{ fontSize: 24 }} />,
  ShoppingCartOutlined: <ShoppingCartOutlined style={{ fontSize: 24 }} />,
  UserOutlined: <UserOutlined style={{ fontSize: 24 }} />,
  DollarOutlined: <DollarOutlined style={{ fontSize: 24 }} />,
}

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'gold', text: '待处理' },
  processing: { color: 'processing', text: '处理中' },
  completed: { color: 'success', text: '已完成' },
  cancelled: { color: 'error', text: '已取消' },
}

const notificationTypeMap: Record<string, string> = {
  info: themeColors.primary,
  warning: themeColors.accentOrange,
  error: themeColors.accentRed,
}

// ===== 3D 悬浮卡片组件 =====
const TiltCard: React.FC<{
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  glowColor?: string
}> = ({ children, style, glowColor = 'rgba(26,92,255,0.15)' }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5])

  const handleMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px)
    y.set(py)
  }

  const handleLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, perspective: 800, ...style }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// ===== 3D 统计卡片 =====
const StatCard: React.FC<{
  stat: typeof dashboardStats[0]
  index: number
}> = ({ stat, index }) => {
  return (
    <TiltCard glowColor={`${stat.color}22`}>
      <Card
        hoverable
        style={{
          ...cardGlassStyle,
          borderRadius: 16,
          transition: 'border-color 0.3s',
        }}
        bodyStyle={{ padding: '22px 24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Text style={{ color: themeColors.textSecondary, fontSize: 13, letterSpacing: 1 }}>{stat.label}</Text>
            <div style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 30, fontWeight: 700, color: themeColors.textPrimary, fontFamily: 'monospace' }}>
                {stat.value}
              </Text>
              {stat.unit && <Text style={{ fontSize: 14, color: themeColors.textSecondary, marginLeft: 4 }}>{stat.unit}</Text>}
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
              {stat.trend === 'up'
                ? <ArrowUpOutlined style={{ color: themeColors.accentGreen, fontSize: 12 }} />
                : <ArrowDownOutlined style={{ color: themeColors.accentRed, fontSize: 12 }} />}
              <Text style={{ fontSize: 13, color: stat.trend === 'up' ? themeColors.accentGreen : themeColors.accentRed }}>
                较昨日 {stat.trendValue}
              </Text>
            </div>
          </div>
          <motion.div
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}08)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color,
              border: `1px solid ${stat.color}20`,
            }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, delay: index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {iconMap[stat.icon]}
          </motion.div>
        </div>
      </Card>
    </TiltCard>
  )
}

// ===== 玻璃柱状图 =====
const GlassBarChart: React.FC<{ data: { date: string; value: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 130, padding: '12px 0' }}>
      {data.map((item, i) => (
        <motion.div
          key={i}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
        >
          <Text style={{ fontSize: 10, color: themeColors.textSecondary, fontFamily: 'monospace' }}>
            {item.value.toLocaleString()}
          </Text>
          <motion.div
            style={{
              width: '100%', maxWidth: 36, borderRadius: '6px 6px 2px 2px',
              background: `linear-gradient(180deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%)`,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 85}px`, minHeight: 12 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: 'easeOut' }}
            whileHover={{ scaleY: 1.08, scaleX: 1.05, transformOrigin: 'bottom' }}
          >
            {/* 光泽 */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: '50%', bottom: '50%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2), transparent)',
            }} />
          </motion.div>
          <Text style={{ fontSize: 10, color: themeColors.textMuted }}>{item.date}</Text>
        </motion.div>
      ))}
    </div>
  )
}

const orderColumns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    render: (text: string) => <Text copyable={{ text }} style={{ fontFamily: 'monospace', fontSize: 13, color: themeColors.textPrimary }}>{text}</Text>,
  },
  { title: '客户', dataIndex: 'customer', key: 'customer', render: (text: string) => <Text style={{ fontWeight: 500, color: themeColors.textPrimary }}>{text}</Text> },
  { title: '金额', dataIndex: 'amount', key: 'amount', render: (val: number) => <Text style={{ color: themeColors.primaryLight, fontWeight: 600 }}>¥{val.toFixed(2)}</Text> },
  { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => { const s = statusMap[status]; return <Tag color={s.color}>{s.text}</Tag> } },
  { title: '下单时间', dataIndex: 'createTime', key: 'createTime', render: (text: string) => <Text style={{ color: themeColors.textSecondary, fontSize: 13 }}>{text}</Text> },
]

const Dashboard: React.FC = () => {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 24 }}
      >
        <Title level={4} style={{ margin: 0, color: themeColors.textPrimary, fontWeight: 700 }}>
          如意仪表盘
        </Title>
        <Text style={{ color: themeColors.textSecondary, fontSize: 14 }}>
          欢迎回来 · {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </Text>
      </motion.div>

      {/* 3D 悬浮统计卡片 */}
      <Row gutter={[16, 16]}>
        {dashboardStats.map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={stat.id}>
            <StatCard stat={stat} index={i} />
          </Col>
        ))}
      </Row>

      {/* 图表 + 通知 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <Card
              title={<Text style={{ fontWeight: 600, color: themeColors.textPrimary }}>近7日访问趋势</Text>}
              style={cardGlassStyle}
              bodyStyle={{ padding: '12px 20px 16px' }}
            >
              <GlassBarChart data={visitTrend} />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={8}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <Card
              title={<Text style={{ fontWeight: 600, color: themeColors.textPrimary }}>系统通知</Text>}
              style={cardGlassStyle}
              bodyStyle={{ padding: '16px 20px' }}
            >
              <Timeline
                items={notifications.map((n) => ({
                  color: notificationTypeMap[n.type] || themeColors.primary,
                  children: (
                    <div>
                      <Text style={{ fontWeight: 500, fontSize: 14, color: themeColors.textPrimary }}>{n.title}</Text>
                      <div><Text style={{ color: themeColors.textSecondary, fontSize: 13 }}>{n.content}</Text></div>
                      <Text style={{ color: themeColors.textMuted, fontSize: 12 }}>{n.time}</Text>
                    </div>
                  ),
                }))}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 最近订单表格 */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <Card
              title={<Text style={{ fontWeight: 600, color: themeColors.textPrimary }}>最近订单</Text>}
              style={cardGlassStyle}
              bodyStyle={{ padding: 0 }}
            >
              <Table
                columns={orderColumns}
                dataSource={recentOrders}
                rowKey="id"
                pagination={false}
                style={{ background: 'transparent' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
