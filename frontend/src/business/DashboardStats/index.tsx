import React from 'react'
import { Row, Col } from 'antd'
import { EyeOutlined, ShoppingCartOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons'
import { StatCard } from '../../ui'
import type { StatItem } from '../../ui'

const iconMap: Record<string, React.ReactNode> = {
  EyeOutlined: <EyeOutlined style={{ fontSize: 24 }} />,
  ShoppingCartOutlined: <ShoppingCartOutlined style={{ fontSize: 24 }} />,
  UserOutlined: <UserOutlined style={{ fontSize: 24 }} />,
  DollarOutlined: <DollarOutlined style={{ fontSize: 24 }} />,
}

export interface DashboardStatsProps {
  data: StatItem[]
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => (
  <Row gutter={[16, 16]}>
    {data.map((stat, i) => (
      <Col xs={24} sm={12} lg={6} key={stat.id}>
        <StatCard stat={{ ...stat, icon: iconMap[stat.icon] || stat.icon } as StatItem & { icon: React.ReactNode }} index={i} />
      </Col>
    ))}
  </Row>
)

export default DashboardStats
