import React from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Typography, Space, Progress, Timeline } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { themeColors } from '../theme/config'
import { dashboardStats, recentOrders, visitTrend, notifications } from '../mock/dashboard'

const { Title, Text } = Typography

// 统计卡片图标映射
const iconMap: Record<string, React.ReactNode> = {
  EyeOutlined: <EyeOutlined style={{ fontSize: 24 }} />,
  ShoppingCartOutlined: <ShoppingCartOutlined style={{ fontSize: 24 }} />,
  UserOutlined: <UserOutlined style={{ fontSize: 24 }} />,
  DollarOutlined: <DollarOutlined style={{ fontSize: 24 }} />,
}

// 订单状态标签
const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'gold', text: '待处理' },
  processing: { color: 'processing', text: '处理中' },
  completed: { color: 'success', text: '已完成' },
  cancelled: { color: 'error', text: '已取消' },
}

// 通知类型映射
const notificationTypeMap: Record<string, { color: string; icon: string }> = {
  info: { color: themeColors.primary, icon: '●' },
  warning: { color: themeColors.accentOrange, icon: '●' },
  error: { color: themeColors.accentRed, icon: '●' },
}

const orderColumns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    render: (text: string) => <Text copyable={{ text }} style={{ fontFamily: 'monospace', fontSize: 13 }}>{text}</Text>,
  },
  {
    title: '客户',
    dataIndex: 'customer',
    key: 'customer',
    render: (text: string) => <Text style={{ fontWeight: 500 }}>{text}</Text>,
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    render: (val: number) => <Text style={{ color: themeColors.textPrimary, fontWeight: 600 }}>¥{val.toFixed(2)}</Text>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const s = statusMap[status]
      return <Tag color={s.color}>{s.text}</Tag>
    },
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text: string) => <Text style={{ color: themeColors.textSecondary, fontSize: 13 }}>{text}</Text>,
  },
]

// 简单柱状图（纯 CSS 实现）
const SimpleBarChart: React.FC<{ data: { date: string; value: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, padding: '8px 0' }}>
      {data.map((item, index) => (
        <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 11, color: themeColors.textSecondary }}>{item.value.toLocaleString()}</Text>
          <div
            style={{
              width: '100%',
              maxWidth: 40,
              height: `${(item.value / maxValue) * 80}px`,
              minHeight: 16,
              borderRadius: '4px 4px 0 0',
              background: `linear-gradient(180deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%)`,
              opacity: 0.8 + (index === data.length - 1 ? 0.2 : 0),
              transition: 'height 0.3s',
              cursor: 'pointer',
            }}
          />
          <Text style={{ fontSize: 11, color: themeColors.textMuted }}>{item.date}</Text>
        </div>
      ))}
    </div>
  )
}

const Dashboard: React.FC = () => {
  return (
    <div>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
          如意仪表盘
        </Title>
        <Text style={{ color: themeColors.textSecondary, fontSize: 14 }}>
          欢迎回来，今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        {dashboardStats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.id}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                border: '1px solid #eef2f6',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text style={{ color: themeColors.textSecondary, fontSize: 14 }}>{stat.label}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text style={{ fontSize: 28, fontWeight: 700, color: themeColors.textPrimary }}>
                      {stat.value}
                    </Text>
                    {stat.unit && (
                      <Text style={{ fontSize: 14, color: themeColors.textSecondary, marginLeft: 4 }}>{stat.unit}</Text>
                    )}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {stat.trend === 'up' ? (
                      <ArrowUpOutlined style={{ color: themeColors.accentGreen, fontSize: 12 }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: themeColors.accentRed, fontSize: 12 }} />
                    )}
                    <Text
                      style={{
                        fontSize: 13,
                        color: stat.trend === 'up' ? themeColors.accentGreen : themeColors.accentRed,
                      }}
                    >
                      较昨日 {stat.trendValue}
                    </Text>
                  </div>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${stat.color}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {iconMap[stat.icon]}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表 + 通知区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 访问趋势 */}
        <Col xs={24} lg={16}>
          <Card
            title={<Text style={{ fontWeight: 600 }}>近7日访问趋势</Text>}
            style={{
              borderRadius: 12,
              border: '1px solid #eef2f6',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            bodyStyle={{ padding: '16px 24px' }}
          >
            <SimpleBarChart data={visitTrend} />
          </Card>
        </Col>

        {/* 系统通知 */}
        <Col xs={24} lg={8}>
          <Card
            title={<Text style={{ fontWeight: 600 }}>系统通知</Text>}
            style={{
              borderRadius: 12,
              border: '1px solid #eef2f6',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Timeline
              items={notifications.map((n) => ({
                color: notificationTypeMap[n.type]?.color || themeColors.primary,
                children: (
                  <div>
                    <Text style={{ fontWeight: 500, fontSize: 14 }}>{n.title}</Text>
                    <div>
                      <Text style={{ color: themeColors.textSecondary, fontSize: 13, lineHeight: 1.6 }}>
                        {n.content}
                      </Text>
                    </div>
                    <Text style={{ color: themeColors.textMuted, fontSize: 12 }}>{n.time}</Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近订单 */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            title={<Text style={{ fontWeight: 600 }}>最近订单</Text>}
            style={{
              borderRadius: 12,
              border: '1px solid #eef2f6',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            bodyStyle={{ padding: '0' }}
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              rowKey="id"
              pagination={false}
              style={{ borderRadius: 12 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
