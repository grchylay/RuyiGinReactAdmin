import React, { useState } from 'react'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { BrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ParticleBg from './ui/ParticleBg'
import { themeColors } from './theme/config'
import AppRouter from './router'

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
          colorBgContainer: 'transparent',
          colorBgLayout: 'transparent',
          colorText: themeColors.textPrimary,
          colorTextSecondary: themeColors.textSecondary,
          colorBorder: 'rgba(255,255,255,0.06)',
          colorBgElevated: 'rgba(15, 29, 58, 0.95)',
          colorBgMask: 'rgba(0,0,0,0.6)',
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
            itemBorderRadius: 10,
            itemMarginInline: 8,
            itemMarginBlock: 4,
          },
          Table: {
            headerBg: 'rgba(255,255,255,0.02)',
            headerColor: themeColors.textSecondary,
            rowHoverBg: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.04)',
            colorBgContainer: 'transparent',
          },
          Card: { paddingLG: 20 },
          Timeline: {
            itemPaddingBottom: 20,
            tailColor: 'rgba(255,255,255,0.08)',
          },
          Dropdown: { colorBgElevated: 'rgba(15, 29, 58, 0.95)' },
        },
      }}
    >
      <BrowserRouter>
        <ParticleBg />
        <MainLayout collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)}>
          {AppRouter}
        </MainLayout>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
