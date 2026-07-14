/**
 * 如意国风科技蓝 v2 · 主题配置
 * 融合玻璃拟态、3D悬浮、动态渐变、粒子光效
 */

export const themeColors = {
  primary: '#1a5cff',
  primaryDark: '#0d3fa8',
  primaryLight: '#4a8cff',
  primaryBg: '#e8f0ff',

  // 深空渐变（从蓝到靛紫）
  headerBgStart: '#050e1f',
  headerBgEnd: '#0f1d3a',
  headerAccent: '#1a3a6a',
  headerText: '#ffffff',

  // 侧边栏 —— 半透明深色毛玻璃
  sidebarBg: 'rgba(10, 22, 40, 0.85)',
  sidebarBorder: 'rgba(255,255,255,0.06)',
  sidebarText: '#b0c5e5',
  sidebarActiveBg: 'rgba(26, 92, 255, 0.7)',
  sidebarActiveText: '#ffffff',
  sidebarHoverBg: 'rgba(26, 45, 82, 0.6)',

  // 内容区 —— 深色科技风渐变背景
  contentBgStart: '#070f1e',
  contentBgEnd: '#0d1a33',
  contentBgRadial: '#13264a',

  // 玻璃拟态卡片
  cardBg: 'rgba(255, 255, 255, 0.05)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  cardHoverBorder: 'rgba(74, 140, 255, 0.3)',

  // 文字
  textPrimary: '#e8edf5',
  textSecondary: '#8899bb',
  textMuted: '#5a6a8a',

  // 状态色
  gold: '#c9a84c',
  goldLight: '#e8d48b',
  accentGreen: '#22c55e',
  accentRed: '#ef4444',
  accentOrange: '#f59e0b',

  // 玻璃光效
  glowBlue: 'rgba(26, 92, 255, 0.15)',
  glowPurple: 'rgba(99, 102, 241, 0.12)',
}

export const gradients = {
  header: 'linear-gradient(135deg, #050e1f 0%, #0f1d3a 40%, #1a2d52 70%, #0f1d3a 100%)',
  content: 'radial-gradient(ellipse at 50% 0%, #13264a 0%, #0d1a33 40%, #070f1e 100%)',
  cardGlass: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
  blueGlow: 'linear-gradient(135deg, #1a5cff, #6366f1)',
}

// 3D 悬浮预设
export const card3DHover = {
  rest: { rotateX: 0, rotateY: 0, scale: 1, z: 0 },
  hover: { rotateX: 3, rotateY: -5, scale: 1.02, z: 20 },
}

export const cardGlassStyle: React.CSSProperties = {
  background: gradients.cardGlass,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
}
