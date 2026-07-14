# RuyiGinReactAdmin — 组件化拆分方案

## 一、现状分析

| 文件 | 行数 | 问题 |
|---|---|---|
| `src/pages/Dashboard.tsx` | 472行 ~18KB | 耦合了 7 个组件 + 主页面逻辑 |
| `src/layouts/MainLayout.tsx` | 230行 | 硬编码菜单、通知、用户菜单 |
| `src/components/ParticleBackground.tsx` | 123行 | 唯一独立组件，良好 |
| `App.tsx` | 72行 | 混合了 ConfigProvider + 布局 + 路由 |

**耦合清单**（Dashboard.tsx 内含 6 个子组件）：
1. `CountUp` — 数字滚动动画
2. `RippleBorder` — 水波纹 hover 效果
3. `GradientBorder` — 边缘流光渐变边框
4. `TiltCard` — 3D 悬浮卡片
5. `StatCard` — 统计卡片
6. `GlassBarChart` — 玻璃渐变柱状图
7. `AnimatedRow` — 表格行入场动画
8. `orderColumns` — 订单列表列定义
9. `statusMap` / `notificationTypeMap` — 硬编码映射表

---

## 二、新目录结构

```
src/
├── components/          ← 通用可复用 UI 组件库
│   ├── glass/           ← 玻璃拟态系列
│   │   ├── GlassCard.tsx
│   │   ├── GlassPanel.tsx
│   │   └── GlassBarChart.tsx
│   ├── effects/         ← 动效组件
│   │   ├── TiltCard.tsx
│   │   ├── GradientBorder.tsx
│   │   ├── RippleBorder.tsx
│   │   ├── CountUp.tsx
│   │   └── AnimatedRow.tsx
│   ├── particles/       ← 粒子/背景
│   │   └── ParticleBackground.tsx   (保留原位，已独立)
│   └── index.ts         ← barrel export
├── layouts/
│   ├── MainLayout.tsx   ← 精简后只保留布局骨架
│   ├── components/
│   │   ├── HeaderBar.tsx
│   │   ├── SideMenu.tsx
│   │   ├── NotificationDropdown.tsx
│   │   └── UserDropdown.tsx
│   └── index.ts
├── pages/
│   ├── Dashboard/
│   │   ├── index.tsx           ← 仪表盘主页面（组合业务组件）
│   │   ├── StatCardGrid.tsx    ← 统计卡片区域（业务组件）
│   │   ├── TrendChart.tsx     ← 访问趋势图（业务组件）
│   │   ├── NotificationPanel.tsx ← 系统通知（业务组件）
│   │   ├── RecentOrders.tsx   ← 最近订单表（业务组件）
│   │   ├── PageHeader.tsx     ← 仪表盘头部（业务组件）
│   │   └── constants.ts      ← statusMap, notificationTypeMap 等
│   └── ... 其他页面
├── hooks/
│   ├── useCountUp.ts          ← 数字滚动逻辑抽为 hook
│   ├── useTilt.ts             ← 3D 悬浮逻辑抽为 hook
│   └── useParticleAnimation.ts ← 粒子动画逻辑抽为 hook
├── theme/
│   ├── config.ts              ← 主题色、渐变（保留）
│   ├── tokens.ts              ← Ant Design token 定义
│   └── cssVariables.ts        ← CSS 变量导出
├── mock/
│   └── dashboard.ts           ← 保持不变
├── types/
│   ├── dashboard.ts           ← DashboardStat, RecentOrder 等类型
│   ├── common.ts              ← 通用泛型工具类型
│   └── components.ts          ← 组件 Props 类型
├── App.tsx                    ← 大幅精简
└── main.tsx                   ← 不变
```

---

## 三、通用组件库设计（`src/components/`）

### 3.1 GlassCard — 玻璃拟态卡片

**路径**: `src/components/glass/GlassCard.tsx`

```typescript
interface GlassCardProps {
  children: React.ReactNode
  /** 是否启用 hover 3D 悬浮效果（默认 true） */
  tilt?: boolean
  /** 炫光跟随颜色（默认 'rgba(26,92,255,0.15)'） */
  glowColor?: string
  /** 是否启用流光边框（默认 false） */
  gradientBorder?: boolean
  /** 是否启用水波纹（默认 false） */
  ripple?: boolean
  /** 卡片样式覆盖 */
  style?: React.CSSProperties
  /** body 区域样式覆盖 */
  bodyStyle?: React.CSSProperties
  /** Ant Card 的 hoverable */
  hoverable?: boolean
  /** 自定义卡片标题 */
  title?: React.ReactNode
  /** 卡片内的装饰光晕配置（位置/颜色） */
  decoration?: {
    position?: { top?: number; right?: number; bottom?: number; left?: number }
    size?: number
    color?: string
  }
  /** 动画延迟 */
  animationDelay?: number
  /** 点击事件 */
  onClick?: () => void
}
```

**职责**: 将 `TiltCard + GradientBorder + RippleBorder + Card + decoration` 整合成一个高可配组件。内部使用 Compound Component 模式提供 `GlassCard.Content` / `GlassCard.Decoration` 等子组件。

**设计模式**: Compound Component — 用 `GlassCard` 包裹自动附加玻璃效果，用户只需写：
```tsx
<GlassCard tilt glowColor="#22c55e30" gradientBorder ripple>
  内容
</GlassCard>
```

### 3.2 GlassPanel — 纯玻璃面板（无 Card 语义）

**路径**: `src/components/glass/GlassPanel.tsx`

```typescript
interface GlassPanelProps {
  children: React.ReactNode
  /** 玻璃强度 0-1（默认 0.05） */
  glassOpacity?: number
  /** 边框透明度 0-1（默认 0.08） */
  borderOpacity?: number
  /** 模糊像素（默认 20） */
  blur?: number
  /** 圆角（默认 16） */
  borderRadius?: number
  style?: React.CSSProperties
}
```

### 3.3 GlassBarChart — 玻璃柱状图

**路径**: `src/components/glass/GlassBarChart.tsx`

```typescript
interface GlassBarChartProps {
  data: { label: string; value: number }[]
  /** 高度（默认 140） */
  height?: number
  /** 条形颜色（默认渐变色） */
  barColors?: string[]
  /** 是否显示波浪光效（默认 true） */
  waveEffect?: boolean
  /** 是否显示数值标签（默认 true） */
  showValue?: boolean
  /** 动画延迟增量（默认 0.1s） */
  staggerDelay?: number
  /** 最大宽度（默认 36） */
  maxBarWidth?: number
}
```

### 3.4 TiltCard — 3D 悬浮核心

**路径**: `src/components/effects/TiltCard.tsx`

```typescript
interface TiltCardProps {
  children: React.ReactNode
  /** 最大旋转角度（默认 6） */
  maxRotate?: number
  /** 弹簧刚度（默认 250） */
  stiffness?: number
  /** 弹簧阻尼（默认 25） */
  damping?: number
  /** 炫光颜色 */
  glowColor?: string
  /** 3D 视角透视（默认 800） */
  perspective?: number
  style?: React.CSSProperties
  /** 入场动画 */
  animation?: {
    initial?: { opacity?: number; y?: number; scale?: number }
    animate?: { opacity?: number; y?: number; scale?: number }
    duration?: number
    delay?: number
  }
}
```

### 3.5 GradientBorder — 流光边框

**路径**: `src/components/effects/GradientBorder.tsx`

```typescript
interface GradientBorderProps {
  /** 渐变色（默认蓝紫色） */
  gradient?: string
  /** 边框圆角（默认 17） */
  borderRadius?: number
  /** 边框宽度（默认 1） */
  borderWidth?: number
  /** 初始透明度（默认 0） */
  initialOpacity?: number
  /** hover 时透明度（默认 1） */
  hoverOpacity?: number
  /** hover 动画时长（默认 0.4） */
  transitionDuration?: number
}
```

### 3.6 RippleBorder — 水波纹边缘

**路径**: `src/components/effects/RippleBorder.tsx`

```typescript
interface RippleBorderProps {
  /** 波纹颜色（默认 rgba(26,92,255,...)） */
  color?: string
  /** 边框圆角（默认 17） */
  borderRadius?: number
  /** 波纹扩散范围 px（默认 2→6） */
  spreadRange?: [number, number]
  /** 动画时长（默认 0.8） */
  duration?: number
}
```

### 3.7 CountUp — 数字滚动动画

**路径**: `src/components/effects/CountUp.tsx`

```typescript
interface CountUpProps {
  /** 目标值（支持 ¥8,846 格式） */
  value: string | number
  /** 动画时长秒（默认 1.5） */
  duration?: number
  /** 缓动函数（默认 easeOutExpo） */
  easing?: 'easeOutExpo' | 'easeOutCubic' | 'linear'
  /** 数字字体样式 */
  style?: React.CSSProperties
  /** 格式化回调 */
  formatter?: (value: number) => string
}
```

### 3.8 AnimatedRow — 表格行动画

**路径**: `src/components/effects/AnimatedRow.tsx`

```typescript
interface AnimatedRowProps {
  children: React.ReactNode
  index: number
  /** 动画方向（默认 'left'） */
  direction?: 'left' | 'right' | 'up' | 'down'
  /** 延迟基数（默认 0.4） */
  baseDelay?: number
  /** 递增延迟（默认 0.05） */
  staggerDelay?: number
}
```

---

## 四、Hooks 设计

### 4.1 `useCountUp`

```typescript
// src/hooks/useCountUp.ts
interface UseCountUpOptions {
  value: string | number
  duration?: number
  easing?: 'easeOutExpo' | 'easeOutCubic' | 'linear'
}

interface UseCountUpReturn {
  displayed: string
  isAnimating: boolean
  /** 手动触发重新动画 */
  reset: () => void
}

function useCountUp(options: UseCountUpOptions): UseCountUpReturn
```

### 4.2 `useTilt`

```typescript
// src/hooks/useTilt.ts
interface UseTiltOptions {
  maxRotate?: number
  stiffness?: number
  damping?: number
}

interface UseTiltReturn {
  ref: React.RefObject<HTMLDivElement>
  style: MotionStyle
  handlers: {
    onMouseMove: (e: React.MouseEvent) => void
    onMouseLeave: () => void
  }
}

function useTilt(options?: UseTiltOptions): UseTiltReturn
```

### 4.3 `useParticleAnimation`

```typescript
// src/hooks/useParticleAnimation.ts
interface ParticleConfig {
  count?: number
  speed?: number
  sizeRange?: [number, number]
  opacityRange?: [number, number]
  hueRange?: [number, number]
  connectionDistance?: number
  connectionAlpha?: number
}

function useParticleAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  config?: ParticleConfig
): { start: () => void; stop: () => void }
```

---

## 五、布局组件拆分（`src/layouts/`）

### 5.1 HeaderBar

**路径**: `src/layouts/components/HeaderBar.tsx`

```typescript
interface HeaderBarProps {
  collapsed: boolean
  onToggle: () => void
  /** 标题文字 */
  title?: string
  /** logo 区域自定义 */
  logo?: React.ReactNode
  /** 右侧操作区自定义 */
  actions?: React.ReactNode
}
```

### 5.2 SideMenu

**路径**: `src/layouts/components/SideMenu.tsx`

```typescript
interface SideMenuProps {
  collapsed: boolean
  /** 菜单项配置（外部注入，不再硬编码） */
  items: MenuItem[]
  /** 当前选中路径 */
  selectedKey?: string
  /** 菜单点击回调 */
  onMenuClick?: (key: string) => void
  /** 底部版本信息 */
  version?: string
}

interface MenuItem {
  key: string
  icon: React.ReactNode
  label: string
  children?: MenuItem[]
}
```

### 5.3 NotificationDropdown

**路径**: `src/layouts/components/NotificationDropdown.tsx`

```typescript
interface NotificationItem {
  key: string
  title: string
  description: string
  time: string
  type?: 'info' | 'warning' | 'error'
}

interface NotificationDropdownProps {
  items: NotificationItem[]
  /** 未读数量 */
  unreadCount?: number
  /** 查看全部回调 */
  onViewAll?: () => void
}
```

### 5.4 UserDropdown

**路径**: `src/layouts/components/UserDropdown.tsx`

```typescript
interface UserDropdownProps {
  username?: string
  avatar?: string
  onProfile?: () => void
  onSettings?: () => void
  onLogout?: () => void
}
```

### 5.5 精简后的 MainLayout

```typescript
// 只保留布局骨架，所有子组件通过 Props / children 注入
interface MainLayoutProps {
  children: React.ReactNode
  collapsed: boolean
  onToggle: () => void
  headerProps?: Partial<HeaderBarProps>
  menuProps?: Partial<SideMenuProps>
}
```

---

## 六、业务页面组件（`src/pages/Dashboard/`）

### 6.1 PageHeader

```typescript
interface PageHeaderProps {
  title: string
  subtitle?: string
  /** 顶部状态标签 */
  status?: {
    text: string
    color?: string
  }
}
```

### 6.2 StatCardGrid

```typescript
interface StatCardGridProps {
  stats: DashboardStat[]
  /** 列配置（默认 xs=24 sm=12 lg=6） */
  colSpan?: Record<string, number>
}
```

### 6.3 TrendChart

```typescript
interface TrendChartProps {
  data: ChartDataPoint[]
  title?: string
  height?: number
}
```

### 6.4 NotificationPanel

```typescript
interface NotificationPanelProps {
  notifications: NotificationItem[]
  title?: string
}
```

### 6.5 RecentOrders

```typescript
interface RecentOrdersProps {
  orders: RecentOrder[]
  /** 列配置覆盖 */
  columns?: any[]
}
```

---

## 七、主题可定制方案

### 当前文件 `src/theme/config.ts` 设计已较好，追加：

**`src/theme/tokens.ts`** — 将 Ant Design Token 定义从 `App.tsx` 迁移至此：

```typescript
import type { ThemeConfig } from 'antd'
import { themeColors } from './config'

export const appTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: themeColors.primary,
    borderRadius: 8,
    colorBgContainer: 'transparent',
    colorBgLayout: 'transparent',
    colorText: themeColors.textPrimary,
    colorTextSecondary: themeColors.textSecondary,
    colorBorder: 'rgba(255,255,255,0.06)',
    fontFamily: '...',
  },
  components: {
    Menu: { /* ... */ },
    Table: { /* ... */ },
    Card: { /* ... */ },
    Timeline: { /* ... */ },
    Dropdown: { /* ... */ },
  },
}
```

**`src/theme/cssVariables.ts`** — 生成 CSS 变量供全局样式引用：

```typescript
export const cssVariables = `
  :root {
    --color-primary: ${themeColors.primary};
    --color-primary-light: ${themeColors.primaryLight};
    --color-primary-dark: ${themeColors.primaryDark};
    --color-text-primary: ${themeColors.textPrimary};
    --color-text-secondary: ${themeColors.textSecondary};
    --color-text-muted: ${themeColors.textMuted};
    --color-accent-green: ${themeColors.accentGreen};
    --color-accent-red: ${themeColors.accentRed};
    --color-card-bg: ${themeColors.cardBg};
    --color-card-border: ${themeColors.cardBorder};
    --gradient-header: ${gradients.header};
    --gradient-content: ${gradients.content};
    --gradient-card-glass: ${gradients.cardGlass};
  }
`
```

**二次开发自定义方式**：用户只需修改 `src/theme/config.ts` 中的颜色变量，所有组件自动生效。

---

## 八、组件依赖关系图

```
                  App.tsx
                    │
         ┌──────────┼──────────┐
         │          │          │
   ConfigProvider  Particle  MainLayout
    (theme/tokens) Background  │
                               ├──────────────────┐
                     ┌─────────┴────────┐         │
                   HeaderBar        SideMenu   Content
                     │                  │          │
           ┌─────────┼────────┐         │      Dashboard/
           │         │        │         │       index.tsx
    Notification  User   Collapse      │          │
    Dropdown    Dropdown  Button       │    ┌─────┼──────────┐
                                        │    │     │          │
                                   PageHeader  StatCardGrid  TrendChart
                                                │             │
                                          GlassCard        GlassBarChart
                                           │  │  │          (components/glass)
                                    TiltCard  │  │
                                    (effects) │  │
                                        Gradient  Ripple
                                        Border   Border
                                        (effects) (effects)

     NotificationPanel      RecentOrders
            │                    │
      Timeline (antd)       Table (antd)
                               │
                          AnimatedRow
                           (effects)

  CountUp (effects) ← 被 StatCardGrid 使用（下层依赖）
```

---

## 九、推荐设计模式

| 模式 | 使用位置 | 理由 |
|---|---|---|
| **Compound Component** | `GlassCard` | `GlassCard.Content` / `GlassCard.Decoration` 让组合灵活且语义化 |
| **Render Props** | 暂不使用 | 本项目动画多、数据展示多，render props 会让 JSX 膨胀 |
| **Custom Hooks** | `useCountUp`, `useTilt`, `useParticleAnimation` | 将 DOM/动画逻辑与 UI 分离，便于测试和复用 |
| **Container/Presentational** | `StatCardGrid`（展示）+ 数据从父组件传入 | 业务与视图分离，mock 数据可替换为真实 API |
| **Barrel Export** | `components/index.ts`, `layouts/index.ts` | 集中导出避免深层 import 路径 |

---

## 十、按文件清单逐文件实施步骤

### Phase 1 — Hooks（无副作用，可先做）
1. `src/hooks/useCountUp.ts`
2. `src/hooks/useTilt.ts`
3. `src/hooks/useParticleAnimation.ts`

### Phase 2 — 通用 UI 组件
4. `src/components/effects/CountUp.tsx` (依赖 useCountUp)
5. `src/components/effects/GradientBorder.tsx`
6. `src/components/effects/RippleBorder.tsx`
7. `src/components/effects/TiltCard.tsx` (依赖 useTilt)
8. `src/components/effects/AnimatedRow.tsx`
9. `src/components/glass/GlassBarChart.tsx`
10. `src/components/glass/GlassPanel.tsx`
11. `src/components/glass/GlassCard.tsx` (整合 TiltCard+GradientBorder+RippleBorder)
12. `src/components/index.ts`

### Phase 3 — 布局组件
13. `src/layouts/components/HeaderBar.tsx`
14. `src/layouts/components/SideMenu.tsx`
15. `src/layouts/components/NotificationDropdown.tsx`
16. `src/layouts/components/UserDropdown.tsx`
17. `src/layouts/index.ts`
18. 精简 `src/layouts/MainLayout.tsx`

### Phase 4 — 类型与主题
19. `src/types/dashboard.ts`
20. `src/types/common.ts`
21. `src/types/components.ts`
22. `src/theme/tokens.ts`
23. `src/theme/cssVariables.ts`

### Phase 5 — 业务页面
24. `src/pages/Dashboard/constants.ts` (statusMap, notificationTypeMap)
25. `src/pages/Dashboard/PageHeader.tsx`
26. `src/pages/Dashboard/StatCardGrid.tsx`
27. `src/pages/Dashboard/TrendChart.tsx`
28. `src/pages/Dashboard/NotificationPanel.tsx`
29. `src/pages/Dashboard/RecentOrders.tsx`
30. `src/pages/Dashboard/index.tsx` (整合以上所有)

### Phase 6 — 入口精简
31. `src/App.tsx` (去掉散落的 theme token，导入 tokens.ts)
32. `src/main.tsx` (不变)

---

## 十一、关键接口契约

### 数据流（Props 单向流动）

```
Dashboard/index.tsx (页面容器)
  ├── PageHeader (title, subtitle, status)
  ├── StatCardGrid (stats: DashboardStat[])
  │     └── GlassCard (tilt, glowColor, ripple, gradientBorder)
  │           ├── CountUp (value, duration)
  │           ├── TiltCard (maxRotate, glowColor)
  │           ├── GradientBorder (gradient, hoverOpacity)
  │           └── RippleBorder (color, spreadRange)
  ├── TrendChart (data: ChartDataPoint[], title)
  │     └── GlassBarChart (data, height, barColors)
  ├── NotificationPanel (notifications[])
  │     └── Timeline (antd)
  └── RecentOrders (orders: RecentOrder[], columns?)
        └── AnimatedRow (index, direction)
```

### 每层职责边界

| 层级 | 职责 | 不允许做的事 |
|---|---|---|
| `pages/Dashboard/index.tsx` | 组合业务组件、传递数据、管理该页面状态 | 不直接引用 theme config |
| `pages/Dashboard/StatCardGrid.tsx` | 业务数据渲染 + 布局排列 | 不包含动画细节（委托给 GlassCard/TiltCard） |
| `components/glass/GlassCard.tsx` | 玻璃卡片样式 + 子效果编排 | 不含业务数据、不含布局逻辑 |
| `components/effects/CountUp.tsx` | 纯数字动画渲染 | 不含卡片/布局/业务 |
| `hooks/useCountUp.ts` | 纯动画状态逻辑 | 不含任何 JSX |

---

## 十二、二次开发扩展指南

### 新页面模板
```tsx
// src/pages/SomeNewPage/index.tsx
import { PageHeader } from '@/components' // 复用通用组件
import { GlassCard } from '@/components/glass'

const SomeNewPage: React.FC = () => (
  <div>
    <PageHeader title="新功能" subtitle="描述" />
    <GlassCard tilt ripple>
      内容
    </GlassCard>
  </div>
)
```

### 自定义主题
只需修改 `src/theme/config.ts` 中的色值，全局生效。
如需扩展组件主题变量，在 `themeTokens` 的 `components` 字段追加。

### 替换为真实 API
将 `src/pages/Dashboard/index.tsx` 中的 `import { dashboardStats } from '../../mock/dashboard'` 替换为 `useEffect` + `fetch` 调用即可，Props 接口不变。

---

## 十三、文件尺寸预估

| 新文件 | 预估行数 | 说明 |
|---|---|---|
| `hooks/useCountUp.ts` | ~35 | 纯逻辑 |
| `hooks/useTilt.ts` | ~45 | framer-motion 封装 |
| `effects/CountUp.tsx` | ~55 | 调用 useCountUp |
| `effects/TiltCard.tsx` | ~90 | 核心 3D 逻辑 |
| `effects/GradientBorder.tsx` | ~40 | 纯渲染 |
| `effects/RippleBorder.tsx` | ~40 | 纯渲染 |
| `effects/AnimatedRow.tsx` | ~30 | 简单封装 |
| `glass/GlassCard.tsx` | ~120 | 整合组件 |
| `glass/GlassPanel.tsx` | ~40 | 简单面板 |
| `glass/GlassBarChart.tsx` | ~80 | 从 Dashboard 迁移 |
| `layouts/HeaderBar.tsx` | ~100 | 从 MainLayout 拆分 |
| `layouts/SideMenu.tsx` | ~60 | 从 MainLayout 拆分 |
| `layouts/NotificationDropdown.tsx` | ~50 | 新组件 |
| `layouts/UserDropdown.tsx` | ~45 | 新组件 |
| `layouts/MainLayout.tsx` | ~50 | 大幅精简后 |
| `pages/Dashboard/constants.ts` | ~25 | 映射表 |
| `pages/Dashboard/PageHeader.tsx` | ~40 | 从 Dashboard 迁移 |
| `pages/Dashboard/StatCardGrid.tsx` | ~30 | 纯布局 |
| `pages/Dashboard/TrendChart.tsx` | ~25 | 包装 GlassBarChart |
| `pages/Dashboard/NotificationPanel.tsx` | ~25 | 纯布局 |
| `pages/Dashboard/RecentOrders.tsx` | ~60 | 表格配置 |
| `pages/Dashboard/index.tsx` | ~50 | 组合所有子组件 |
| `theme/tokens.ts` | ~60 | 从 App.tsx 迁移 |
| `types/` | ~60 | 类型定义 |
| `App.tsx` | ~20 | 大幅精简后 |
| **总计** | **~33 个新文件** | **Dashboard.tsx 从 472→~50 行** |

---

## 十四、注意事项

1. **Barrel export 避免循环依赖**：`components/index.ts` 只导出独立组件，`GlassCard` 在内部 import `effects/`，不会循环
2. **framer-motion 版本**：项目使用 v12，`useMotionValue`/`useSpring`/`useTransform` API 稳定
3. **antd v6**：`bodyStyle` 已废弃为 `styles.body`，需要注意替换
4. **迁移顺序**：先做 hooks 和 effects（无业务依赖）→ glass（依赖 effects）→ layouts（依赖 glass/effects）→ pages（依赖以上全部），保证每一步可编译
