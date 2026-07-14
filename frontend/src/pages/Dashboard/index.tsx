import React from 'react'
import { Row, Col, Typography } from 'antd'
import { motion } from 'framer-motion'
import { DashboardStats, VisitChart, OrderTable, NotificationTimeline } from '../../business'
import { dashboardStats, recentOrders, visitTrend, notifications } from '../../mock/dashboard'
import { themeColors } from '../../theme/config'

const { Title, Text } = Typography

const Dashboard: React.FC = () => (
  <div style={{ position: 'relative', zIndex: 1 }}>
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
        style={{ padding: '6px 16px', borderRadius: 20, background: 'rgba(26,92,255,0.1)', border: '1px solid rgba(26,92,255,0.2)', fontSize: 12, color: themeColors.primaryLight }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ● 系统运行中
      </motion.div>
    </motion.div>

    <DashboardStats data={dashboardStats} />

    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col xs={24} lg={16}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <VisitChart data={visitTrend} />
        </motion.div>
      </Col>
      <Col xs={24} lg={8}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <NotificationTimeline items={notifications} />
        </motion.div>
      </Col>
    </Row>

    <Row style={{ marginTop: 16 }}>
      <Col span={24}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <OrderTable data={recentOrders} />
        </motion.div>
      </Col>
    </Row>
  </div>
)

export default Dashboard
