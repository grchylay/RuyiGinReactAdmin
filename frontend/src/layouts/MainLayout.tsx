import React from 'react'
import { Layout, Menu, Avatar, Badge, Dropdown, Space, Typography, theme } from 'antd'
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
import { themeColors, headerGradient } from '../theme/config'

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
    label: (
      <div style={{ padding: '8px 16px', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>
        系统通知
      </div>
    ),
    disabled: true,
  },
  {
    key: 'n1',
    label: (
      <div style={{ padding: '8px 16px', maxWidth: 280 }}>
        <div style={{ fontWeight: 500 }}>系统更新提醒</div>
        <div style={{ fontSize: 12, color: '#999' }}>如意后台管理系统 v2.1.0 已发布</div>
        <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>5分钟前</div>
      </div>
    ),
  },
  {
    key: 'n2',
    label: (
      <div style={{ padding: '8px 16px', maxWidth: 280 }}>
        <div style={{ fontWeight: 500 }}>订单提醒</div>
        <div style={{ fontSize: 12, color: '#999' }}>您有 3 笔新订单待处理</div>
        <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>15分钟前</div>
      </div>
    ),
  },
  {
    key: 'viewAll',
    label: (
      <div style={{ textAlign: 'center', padding: '8px', borderTop: '1px solid #f0f0f0', color: themeColors.primary }}>
        查看全部通知
      </div>
    ),
  },
]

const MainLayout: React.FC<MainLayoutProps> = ({ children, collapsed, onToggle }) => {
  return (
    <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* ===== 顶部 Header（固定高度 56px） ===== */}
      <Header
        style={{
          height: 56,
          lineHeight: '56px',
          padding: '0 20px',
          background: headerGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        {/* 左侧：Logo + 折叠按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            style: { fontSize: 18, color: '#fff', cursor: 'pointer' },
            onClick: onToggle,
          })}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1a5cff, #4a8cff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(26,92,255,0.3)',
            }}>
              如
            </div>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>
              如意后台
            </Text>
          </div>
        </div>

        {/* 右侧：通知 + 用户头像 */}
        <Space size={20}>
          <Dropdown menu={{ items: notificationItems }} placement="bottomRight" arrow trigger={['click']}>
            <Badge count={3} size="small" offset={[-2, 2]}>
              <BellOutlined style={{ fontSize: 18, color: '#b0c5e5', cursor: 'pointer' }} />
            </Badge>
          </Dropdown>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{ backgroundColor: themeColors.primary }}
              />
              <Text style={{ color: '#b0c5e5', fontSize: 14 }}>管理员</Text>
            </Space>
          </Dropdown>
        </Space>
      </Header>

      <Layout style={{ flex: 1, minHeight: 0 }}>
        {/* ===== 左侧 Sider（固定宽度 220 / 80） ===== */}
        <Sider
          width={220}
          collapsedWidth={64}
          collapsed={collapsed}
          style={{
            background: themeColors.sidebarBg,
            borderRight: '1px solid rgba(255,255,255,0.04)',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          trigger={null}
        >
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

          {/* 底部版本信息 */}
          {!collapsed && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 20px',
              textAlign: 'center',
              fontSize: 12,
              color: 'rgba(255,255,255,0.25)',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              background: themeColors.sidebarBg,
            }}>
              如意后台 v2.1.0
            </div>
          )}
        </Sider>

        {/* ===== 右侧内容区（自适应，可滚动） ===== */}
        <Content
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'auto',
            background: themeColors.contentBg,
            padding: 24,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
