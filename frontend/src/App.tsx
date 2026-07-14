import React, { useState } from 'react'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import { themeColors } from './theme/config'

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: themeColors.primary,
          borderRadius: 8,
          colorBgContainer: themeColors.cardBg,
          colorBgLayout: themeColors.contentBg,
          colorText: themeColors.textPrimary,
          colorTextSecondary: themeColors.textSecondary,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
        },
        components: {
          Menu: {
            darkItemBg: 'transparent',
            darkItemColor: themeColors.sidebarText,
            darkItemHoverBg: themeColors.sidebarHoverBg,
            darkItemHoverColor: '#ffffff',
            darkItemSelectedBg: themeColors.sidebarActiveBg,
            darkItemSelectedColor: themeColors.sidebarActiveText,
            itemBorderRadius: 8,
            itemMarginInline: 8,
          },
          Table: {
            headerBg: '#f8fafc',
            headerColor: themeColors.textSecondary,
          },
          Card: {
            paddingLG: 20,
          },
          Timeline: {
            itemPaddingBottom: 20,
          },
        },
      }}
    >
      <MainLayout collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)}>
        <Dashboard />
      </MainLayout>
    </ConfigProvider>
  )
}

export default App
