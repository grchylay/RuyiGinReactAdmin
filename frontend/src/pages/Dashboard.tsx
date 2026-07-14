import React, { useEffect, useRef, useState } from 'react'
import { Card, Row, Col, Table, Tag, Typography, Timeline } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, EyeOutlined, ShoppingCartOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
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

// ===== 数字滚动动画组件 =====
const CountUp: React.FC<{ value: string; duration?: number }> = ({ value, duration = 1.5 }) => {
  const [displayed, setDisplayed] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    const clean = value.replace(/[^0-9.]/g, '')
    const prefix = value.replace(/[0-9.,]/g, '')
    const target = parseFloat(clean)
    if (isNaN(target)) { setDisplayed(value); return }

    const startTime = Date.now()
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = Math.floor(target * eased)
      setDisplayed(prefix + current.toLocaleString())
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span ref={ref}>{displayed}</span>
}

// ===== 水波纹组件（hover 时在卡片边缘扩散） =====
const RippleBorder: React.FC = () => {
  return (
    <motion.div
      style={{
        position: 'absolute', inset: -1, borderRadius: 17,
        pointerEvents: 'none',
        background: 'transparent',
        zIndex: 0,
      }}
      initial={{ opacity: 0 }}
      whileHover={{
        opacity: 1,
        boxShadow: [
          '0 0 0 0px rgba(26,92,255,0)',
          '0 0 0 2px rgba(26,92,255,0.15)',
          '0 0 0 6px rgba(26,92,255,0)',
        ],
        transition: { duration: 0.8, repeat: Infinity, ease: 'easeOut' },
      }}
    />
  )
}

// ===== 边缘流光渐变边框 =====
const GradientBorder: React.FC = () => (
  <motion.div
    style={{
      position: 'absolute', inset: -1, borderRadius: 17,
      pointerEvents: 'none', zIndex: 0,
      opacity: 0,
    }}
    whileHover={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div style={{
      width: '100%', height: '100%', borderRadius: 17,
      padding: 1,
      background: 'linear-gradient(135deg, rgba(26,92,255,0.4), rgba(99,102,241,0.1), rgba(26,92,255,0.4))',
    }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 16, background: 'transparent' }} />
    </div>
  </motion.div>
)

// ===== 3D 悬浮卡片组件（带炫光跟随） =====
const TiltCard: React.FC<{
  children: React.ReactNode
  style?: React.CSSProperties
  glowColor?: string
}> = ({ children, style, glowColor = 'rgba(26,92,255,0.15)' }) => {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const springX = useSpring(x, { stiffness: 250, damping: 25 })
  const springY = useSpring(y, { stiffness: 250, damping: 25 })
  const rotateX = useTransform(springY, [0, 1], [6, -6])
  const rotateY = useTransform(springX, [0, 1], [-6, 6])
  const glowX = useTransform(springX, [0, 1], ['0%', '100%'])
  const glowY = useTransform(springY, [0, 1], ['0%', '100%'])

  const handleMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    x.set(px)
    y.set(py)
  }
  const handleLeave = () => { x.set(0.5); y.set(0.5) }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX, rotateY, perspective: 800,
        transformStyle: 'preserve-3d',
        position: 'relative',
        ...style,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 跟随鼠标的炫光 */}
      <motion.div
        style={{
          position: 'absolute', inset: -2, borderRadius: 18,
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, ${glowColor}, transparent 60%)`
          ),
          pointerEvents: 'none', zIndex: 0,
          opacity: 0.6,
        }}
      />
      {children}
    </motion.div>
  )
}

// ===== 统计卡片（带数字滚动 + 流光边框 + 浮动图标） =====
const StatCard: React.FC<{ stat: typeof dashboardStats[0]; index: number }> = ({ stat, index }) => {
  return (
    <TiltCard glowColor={`${stat.color}30`}>
      <div style={{ position: 'relative' }}>
        <GradientBorder />
        <RippleBorder />
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
          {/* 背景光晕 */}
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
                <motion.div
                  animate={{ y: stat.trend === 'up' ? [0, -3, 0] : [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
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
                color: stat.color,
                border: `1px solid ${stat.color}25`,
              }}
              animate={{
                y: [0, -4, 0],
                boxShadow: [
                  `0 0 0px ${stat.color}00`,
                  `0 0 20px ${stat.color}30`,
                  `0 0 0px ${stat.color}00`,
                ],
              }}
              transition={{ duration: 3, delay: index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {iconMap[stat.icon]}
            </motion.div>
          </div>
        </Card>
      </div>
    </TiltCard>
  )
}

// ===== 玻璃渐变柱状图（带波浪光效） =====
const GlassBarChart: React.FC<{ data: { date: string; value: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140, padding: '12px 0' }}>
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
              width: '100%', maxWidth: 36,
              borderRadius: '6px 6px 2px 2px',
              background: `linear-gradient(180deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 60%, ${themeColors.primaryDark} 100%)`,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 88}px`, minHeight: 10 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scaleY: 1.12, scaleX: 1.08, transformOrigin: 'bottom' }}
          >
            {/* 波浪光泽 */}
            <motion.div
              style={{
                position: 'absolute', top: 0, left: '-100%', right: 0, bottom: 0,
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)`,
              }}
              animate={{ left: ['-100%', '200%'] }}
              transition={{ duration: 2, delay: i * 0.15, repeat: Infinity, ease: 'linear' }}
            />
            {/* 顶部光晕 */}
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

const orderColumns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    render: (text: string) => (
      <Text copyable={{ text }} style={{ fontFamily: 'monospace', fontSize: 13, color: themeColors.textPrimary }}>
        {text}
      </Text>
    ),
  },
  { title: '客户', dataIndex: 'customer', key: 'customer', render: (text: string) => <Text style={{ fontWeight: 500, color: themeColors.textPrimary }}>{text}</Text> },
  { title: '金额', dataIndex: 'amount', key: 'amount', render: (val: number) => <Text style={{ color: themeColors.primaryLight, fontWeight: 600 }}>¥{val.toFixed(2)}</Text> },
  { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => { const s = statusMap[status]; return <Tag color={s.color}>{s.text}</Tag> } },
  { title: '下单时间', dataIndex: 'createTime', key: 'createTime', render: (text: string) => <Text style={{ color: themeColors.textSecondary, fontSize: 13 }}>{text}</Text> },
]

// ===== 订单行动画 =====
const AnimatedRow: React.FC<{ children: React.ReactNode; index: number }> = ({ children, index }) => (
  <motion.tr
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 + index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    style={{ display: 'table-row' }}
  >
    {children}
  </motion.tr>
)

const Dashboard: React.FC = () => {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* ===== 页面标题 ===== */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
      >
        <div>
          <Title level={4} style={{ margin: 0, color: themeColors.textPrimary, fontWeight: 700, letterSpacing: 1 }}>
            如意仪表盘
          </Title>
          <Text style={{ color: themeColors.textSecondary, fontSize: 14 }}>
            欢迎回来 · {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </Text>
        </div>
        <motion.div
          style={{
            padding: '6px 16px', borderRadius: 20,
            background: 'rgba(26,92,255,0.1)',
            border: '1px solid rgba(26,92,255,0.2)',
            fontSize: 12, color: themeColors.primaryLight,
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ● 系统运行中
        </motion.div>
      </motion.div>

      {/* ===== 3D 悬浮统计卡片 ===== */}
      <Row gutter={[16, 16]}>
        {dashboardStats.map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={stat.id}>
            <StatCard stat={stat} index={i} />
          </Col>
        ))}
      </Row>

      {/* ===== 图表 + 通知 ===== */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 访问趋势 */}
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card
              title={<Text style={{ fontWeight: 600, color: themeColors.textPrimary, letterSpacing: 1 }}>近7日访问趋势</Text>}
              style={{ ...cardGlassStyle, overflow: 'hidden', position: 'relative' }}
              bodyStyle={{ padding: '8px 20px 16px' }}
            >
              {/* 装饰光晕 */}
              <div style={{
                position: 'absolute', bottom: -40, right: -20,
                width: 200, height: 200, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(26,92,255,0.06), transparent)',
                pointerEvents: 'none',
              }} />
              <GlassBarChart data={visitTrend} />
            </Card>
          </motion.div>
        </Col>

        {/* 系统通知 */}
        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card
              title={<Text style={{ fontWeight: 600, color: themeColors.textPrimary, letterSpacing: 1 }}>系统通知</Text>}
              style={{ ...cardGlassStyle, overflow: 'hidden', position: 'relative' }}
              bodyStyle={{ padding: '16px 20px' }}
            >
              <div style={{
                position: 'absolute', top: -30, right: -30,
                width: 120, height: 120, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent)',
                pointerEvents: 'none',
              }} />
              <Timeline
                items={notifications.map((n, i) => ({
                  color: notificationTypeMap[n.type] || themeColors.primary,
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
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* ===== 最近订单 ===== */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card
              title={<Text style={{ fontWeight: 600, color: themeColors.textPrimary, letterSpacing: 1 }}>最近订单</Text>}
              style={{ ...cardGlassStyle, position: 'relative', overflow: 'hidden' }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{
                position: 'absolute', top: -50, left: '30%',
                width: 300, height: 300, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(26,92,255,0.04), transparent)',
                pointerEvents: 'none',
              }} />
              <Table
                columns={orderColumns}
                dataSource={recentOrders}
                rowKey="id"
                pagination={false}
                style={{ background: 'transparent' }}
                components={{
                  body: {
                    row: (props: any) => {
                      const index = props['data-row-key']
                      const idx = recentOrders.findIndex(r => r.id === index)
                      return <AnimatedRow index={idx}>{props.children}</AnimatedRow>
                    },
                  },
                }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
