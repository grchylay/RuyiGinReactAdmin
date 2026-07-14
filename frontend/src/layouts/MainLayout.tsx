import React from 'react'
import { Layout, Menu, Avatar, Badge, Dropdown, Space, Typography } from 'antd'
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { themeColors, gradients } from '../theme/config'

const { Header, Sider, Content } = Layout
const { Text } = Typography

interface MainLayoutProps {
  children: React.ReactNode
  collapsed: boolean
  onToggle: () => void
}

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/orders', icon: <ShoppingOutlined />, label: '订单管理' },
  { key: '/users', icon: <UserOutlined />, label: '用户管理' },
  { key: '/articles', icon: <FileTextOutlined />, label: '内容管理' },
  { key: '/category', icon: <AppstoreOutlined />, label: '分类管理' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
]

const userMenuItems = [
  { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
  { key: 'settings', icon: <SettingOutlined />, label: '账号设置' },
  { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
]

const notificationItems = [
  {
    key: 'title',
    label: <div style={{ padding: '8px 16px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>系统通知</div>,
    disabled: true,
  },
  { key: 'n1', label: <div style={{ padding: '8px 16px', maxWidth: 280 }}><div style={{ fontWeight: 500 }}>系统更新提醒</div><div style={{ fontSize: 12, color: '#8899bb' }}>如意后台管理系统 v2.1.0 已发布</div><div style={{ fontSize: 11, color: '#5a6a8a', marginTop: 4 }}>5分钟前</div></div> },
  { key: 'n2', label: <div style={{ padding: '8px 16px', maxWidth: 280 }}><div style={{ fontWeight: 500 }}>订单提醒</div><div style={{ fontSize: 12, color: '#8899bb' }}>您有 3 笔新订单待处理</div><div style={{ fontSize: 11, color: '#5a6a8a', marginTop: 4 }}>15分钟前</div></div> },
  { key: 'viewAll', label: <div style={{ textAlign: 'center', padding: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', color: themeColors.primary }}>查看全部通知</div> },
]

const MainLayout: React.FC<MainLayoutProps> = ({ children, collapsed, onToggle }) => {
  return (
    <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      {/* ===== 动态渐变 Header（带流动光效） ===== */}
      <Header
        style={{
          height: 60,
          lineHeight: '60px',
          padding: '0 24px',
          background: gradients.header,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          flexShrink: 0,
          zIndex: 100,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 流动光带 */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0, left: '-50%',
            width: '200%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(26,92,255,0.04), rgba(99,102,241,0.02), transparent)',
            pointerEvents: 'none',
          }}
          animate={{ left: ['-50%', '50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        {/* 顶部光晕装饰 */}
        <div style={{
          position: 'absolute',
          top: -40,
          left: '20%',
          width: 300,
          height: 120,
          background: 'radial-gradient(ellipse, rgba(26,92,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: -30,
          right: '30%',
          width: 200,
          height: 100,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            style: { fontSize: 18, color: '#b0c5e5', cursor: 'pointer' },
            onClick: onToggle,
          })}
          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              style={{
                width: 34, height: 34, borderRadius: 10,
                background: gradients.blueGlow,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 'bold', color: '#fff',
                boxShadow: '0 0 20px rgba(26,92,255,0.3)',
              }}
              animate={{ boxShadow: ['0 0 20px rgba(26,92,255,0.3)', '0 0 35px rgba(26,92,255,0.5)', '0 0 20px rgba(26,92,255,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              如
            </motion.div>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: 3 }}>
              如意后台
            </Text>
          </motion.div>
        </div>

        <Space size={20} style={{ position: 'relative', zIndex: 1 }}>
          <Dropdown menu={{ items: notificationItems }} placement="bottomRight" arrow trigger={['click']}>
            <Badge count={3} size="small" offset={[-2, 2]}>
              <BellOutlined style={{ fontSize: 18, color: '#b0c5e5', cursor: 'pointer' }} />
            </Badge>
          </Dropdown>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor: themeColors.primary, boxShadow: '0 0 12px rgba(26,92,255,0.3)' }} />
              <Text style={{ color: '#b0c5e5', fontSize: 14 }}>管理员</Text>
            </Space>
          </Dropdown>
        </Space>
      </Header>

      <Layout style={{ flex: 1, minHeight: 0 }}>
        {/* ===== 左侧毛玻璃 Sider ===== */}
        <Sider
          width={220}
          collapsedWidth={64}
          collapsed={collapsed}
          style={{
            background: themeColors.sidebarBg,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRight: `1px solid ${themeColors.sidebarBorder}`,
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'relative',
          }}
          trigger={null}
        >
          {/* 侧栏装饰光带 */}
          <div style={{
            position: 'absolute',
            top: 80,
            right: -60,
            width: 120,
            height: 200,
            background: 'radial-gradient(ellipse, rgba(26,92,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <Menu
            mode="inline"
            defaultSelectedKeys={['/dashboard']}
            items={menuItems}
            style={{
              background: 'transparent',
              borderRight: 'none',
              paddingTop: 8,
            }}
            theme="dark"
          />

          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                padding: '20px 24px',
                textAlign: 'center',
                fontSize: 11,
                color: 'rgba(255,255,255,0.15)',
                letterSpacing: 1,
                borderTop: '1px solid rgba(255,255,255,0.04)',
                background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.2))',
              }}
            >
              如意后台 v2.1.0
            </motion.div>
          )}
        </Sider>

        {/* ===== 右侧内容区 ===== */}
        <Content
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'auto',
            background: gradients.content,
            padding: 28,
            position: 'relative',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
