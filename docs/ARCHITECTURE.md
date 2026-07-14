# RuyiGinReactAdmin 组件化架构方案

> 基于 React + TypeScript + Vite + Ant Design + framer-motion 的通用后台管理系统骨架

---

## 一、设计目标与原则

### 核心目标
1. **可复用性** — UI 组件、业务组件、布局组件全部可独立迁移和复用
2. **可扩展性** — 新增一个业务页面只需关注业务逻辑，无需关心视觉层
3. **可替换性** — 主题/品牌更换不影响业务代码
4. **可测试性** — 组件粒度足够细，每个组件职责单一

### 分层原则
```
┌─────────────────────────────────────┐
│           pages / 页面层              │  ← 编排业务组件 + 布局
├─────────────────────────────────────┤
│      business / 业务组件层            │  ← 带业务语义的复合组件
├─────────────────────────────────────┤
│       ui / 通用 UI 组件层             │  ← 纯展示组件，零业务依赖
├─────────────────────────────────────┤
│   layouts / 布局组件层                │  ← 页面框架（Header/Sider/Content）
├─────────────────────────────────────┤
│     hooks / 自定义 Hook 层            │  ← 逻辑复用（动画/数据/交互）
├─────────────────────────────────────┤
│  theme / 主题系统                     │  ← 设计 Token + CSS 变量
└─────────────────────────────────────┘
```

### 依赖方向
- **pages → business → ui**（允许跳层，如 pages 直接引用 ui）
- **business / ui → layouts**（禁止）
- **所有层 → hooks, theme**（允许）

---

## 二、详细目录结构

下面的目录树是重构后的目标结构，标注了「**已有**」「**新增**」标识。

```
frontend/src/
├── index.ts                          # 入口导出（方便内部化 npm 包引用）
│
├── layouts/                          # 布局组件层 ──────── 页面框架
│   ├── MainLayout.tsx                #   **已有** 主布局（Header + Sider + Content）
│   ├── MainLayout.module.css         #   **新增** 布局样式模块化
│   ├── components/                   #   **新增** 布局内部子组件
│   │   ├── Logo.tsx                  #     品牌 Logo（如意图标 + 文字）
│   │   ├── HeaderActions.tsx         #     顶栏操作区（通知/用户下拉）
│   │   ├── SidebarMenu.tsx           #     侧栏菜单（从路由配置自动生成）
│   │   └── HeaderGlowEffect.tsx      #     Header 流动光效装饰
│   └── index.ts                      #   **新增** 导出
│
├── ui/                               # 通用 UI 组件层 ──── 零业务依赖
│   ├── GlassCard/                    #   玻璃拟态卡片（antd Card 封装）
│   │   ├── index.tsx                 #     **新增** 从 Dashboard 抽离
│   │   └── style.ts                  #     **新增** 样式常量
│   ├── TiltCard/                     #   3D 悬浮卡片（带炫光跟随）
│   │   ├── index.tsx                 #     **新增** 从 Dashboard 抽离
│   │   └── types.ts                  #     **新增** 属性类型
│   ├── CountUp/                      #   数字滚动动画
│   │   └── index.tsx                 #     **新增** 从 Dashboard 抽离
│   ├── GradientBorder/               #   流光渐变边框
│   │   └── index.tsx                 #     **新增** 从 Dashboard 抽离
│   ├── RippleBorder/                 #   水波纹边框 hover 效果
│   │   └── index.tsx                 #     **新增** 从 Dashboard 抽离
│   ├── ParticleBg/                   #   粒子背景（Canvas 实现）
│   │   └── index.tsx                 #     **新增** 从 components/ 迁移
│   ├── GlassBarChart/                #   玻璃渐变柱状图
│   │   ├── index.tsx                 #     **新增** 从 Dashboard 抽离
│   │   └── types.ts                  #     **新增**
│   ├── AnimatedRow/                  #   表格行入场动画
│   │   └── index.tsx                 #     **新增** 从 Dashboard 抽离
│   ├── StatCard/                     #   统计卡片（复合：TiltCard + CountUp + 图标）
│   │   └── index.tsx                 #     **新增** 从 Dashboard 抽离
│   └── index.ts                      #   **新增** 组件库统一导出
│
├── business/                         # 业务组件层 ──────── 包含业务语义
│   ├── DashboardStats/               #   仪表盘统计卡片组
│   │   └── index.tsx                 #     **新增** 编排 4 个 StatCard
│   ├── VisitChart/                   #   访问趋势图表
│   │   └── index.tsx                 #     **新增** 从 Dashboard 抽离
│   ├── OrderTable/                   #   最近订单表格（带行动画）
│   │   ├── index.tsx                 #     **新增** 从 Dashboard 抽离
│   │   └── columns.tsx               #     **新增** 表格列定义
│   ├── NotificationTimeline/         #   系统通知时间线
│   │   └── index.tsx                 #     **新增** 从 Dashboard 抽离
│   └── index.ts                      #   **新增** 业务组件统一导出
│
├── pages/                            # 页面组件层 ──────── 路由入口
│   ├── Dashboard/                    #   **已有 → 拆分** 仪表盘
│   │   └── index.tsx                 #     由 200+ 行降为 ~40 行编排代码
│   ├── Orders/                       #   **新增** 订单管理
│   │   └── index.tsx                 #
│   ├── Users/                        #   **新增** 用户管理
│   │   └── index.tsx                 #
│   ├── Articles/                     #   **新增** 内容管理
│   │   └── index.tsx                 #
│   ├── Category/                     #   **新增** 分类管理
│   │   └── index.tsx                 #
│   ├── Settings/                     #   **新增** 系统设置
│   │   └── index.tsx                 #
│   └── index.ts                      #   **新增** 路由懒加载导出
│
├── hooks/                            # 自定义 Hook 层 ──── 逻辑复用
│   ├── useTilt.ts                    #   **新增** 3D 悬浮鼠标追踪逻辑
│   ├── useCountUp.ts                 #   **新增** 数字滚动动画逻辑
│   ├── useAnimatedEntry.ts           #   **新增** 页面入场动画通用 Hook
│   ├── useTheme.ts                   #   **新增** 主题上下文访问
│   └── index.ts                      #   **新增**
│
├── theme/                            # 主题系统
│   ├── config.ts                     #   **已有** 主题 Token 定义
│   ├── tokens.css                    #   **新增** CSS 变量（方便非 React 场景）
│   ├── context.tsx                   #   **新增** ThemeProvider + useTheme
│   ├── features/                     #   **新增** 主题子模块（按需扩展）
│   │   ├── glassmorphism.ts          #     玻璃拟态样式计算
│   │   ├── animations.ts            #     动画预设缓动曲线
│   │   └── glassBarStyle.ts         #     玻璃柱状图渐变工厂
│   └── index.ts                      #   **新增** 统一导出
│
├── router/                           # **新增** 路由配置层
│   ├── index.tsx                     #   路由表配置
│   └── types.ts                      #   路由项 TS 类型（含 meta/权限）
│
├── mock/                             # Mock 数据层
│   ├── dashboard.ts                  #   **已有** 仪表盘 Mock
│   ├── orders.ts                     #   **新增** 订单 Mock
│   ├── users.ts                      #   **新增** 用户 Mock
│   └── index.ts                      #   **新增** 统一导出
│
├── types/                            # **新增** 全局类型定义
│   ├── api.ts                        #   API 响应通用结构
│   ├── common.ts                     #   分页/排序/搜索参数
│   └── index.ts
│
├── utils/                            # **新增** 工具函数
│   ├── format.ts                     #   金额/日期/手机号格式化
│   └── index.ts
│
├── styles/                           # 全局样式
│   ├── index.css                     #   **已有** 全局样式（迁移至此）
│   ├── scrollbar.css                 #   **新增** 滚动条样式
│   ├── antd-overrides.css            #   **新增** antd 覆盖样式
│   └── glass-animations.css          #   **新增** 玻璃拟态关键帧
│
├── App.tsx                           # **已有** 简化：只做布局 + 路由挂载
├── main.tsx                          # **已有** 入口：ReactDOM.createRoot
│
└── vite-env.d.ts                     # Vite 类型声明
```

---

## 三、组件分层策略详解

### 3.1 层级定义与职责

#### 🧩 UI 组件层 (`src/ui/`)
| 组件 | 职责 | 原所在文件 | 复杂度 |
|------|------|-----------|--------|
| `GlassCard` | 玻璃拟态 Card 包装（`cardGlassStyle` + backdropFilter） | Dashboard.tsx | ⭐ |
| `TiltCard` | 3D 悬浮容器 + 炫光跟随鼠标 | Dashboard.tsx | ⭐⭐ |
| `CountUp` | 数字滚动动画（easeOutExpo） | Dashboard.tsx | ⭐⭐ |
| `GradientBorder` | hover 时渐变色边框 | Dashboard.tsx | ⭐ |
| `RippleBorder` | hover 时水波纹扩散效果 | Dashboard.tsx | ⭐ |
| `ParticleBg` | Canvas 粒子动画背景 | components/ParticleBackground.tsx | ⭐⭐⭐ |
| `GlassBarChart` | 玻璃渐变柱状图 + 波浪光泽 | Dashboard.tsx | ⭐⭐ |
| `AnimatedRow` | Table 行入场滑入动画 | Dashboard.tsx | ⭐ |
| `StatCard` | 统计卡片（TiltCard + CountUp + 浮动图标 + 渐变 Icon Box） | Dashboard.tsx | ⭐⭐⭐ |

**UI 组件特性**：
- 不引用任何 mock 数据文件
- 不引用任何业务页面 type
- 所有配置通过 props 传入
- 样式从 props/theme 获取，无硬编码色值

#### 🏢 业务组件层 (`src/business/`)
| 组件 | 职责 | 构成 |
|------|------|------|
| `DashboardStats` | 渲染统计卡片行，传入 mock 数据 | 编排 4× StatCard + TiltCard |
| `VisitChart` | 近7日访问趋势卡片 | GlassBarChart + Card 包装 |
| `OrderTable` | 最近订单表格 | Table + AnimatedRow + orderColumns |
| `NotificationTimeline` | 系统通知时间线 | Timeline + Card 包装 |

**业务组件特性**：
- 引用 mock 数据或 API 调用
- 使用 UI 组件组装
- 包含业务相关文案
- 可被页面组件直接引用

#### 📄 页面组件层 (`src/pages/`)
```tsx
// pages/Dashboard/index.tsx — 重构后约 40 行
const Dashboard: React.FC = () => {
  const { entryVariants } = useAnimatedEntry()

  return (
    <PageContainer>
      <PageHeader title="如意仪表盘" subtitle="欢迎回来 · ..." />
      <DashboardStats data={dashboardStats} />
      <Row gutter={[16, 16]}>
        <Col span={16}><VisitChart data={visitTrend} /></Col>
        <Col span={8}><NotificationTimeline items={notifications} /></Col>
      </Row>
      <OrderTable data={recentOrders} />
    </PageContainer>
  )
}
```

#### 🧱 布局组件层 (`src/layouts/`)
维持 MainLayout 框架，但将内部元素拆分为专属子组件：
- `Logo` — Logo + 品牌文字（可替换为其他品牌）
- `HeaderActions` — 通知铃铛 + 用户头像下拉
- `SidebarMenu` — 侧栏菜单（接收 items prop）
- `HeaderGlowEffect` — 流动光带装饰

### 3.2 组件层级依赖矩阵

| 引用 ↓ \ 被引用 → | `ui/` | `business/` | `layouts/` | `pages/` | `hooks/` | `theme/` |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **ui/** | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **business/** | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **layouts/** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **pages/** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **hooks/** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **theme/** | ❌ | ❌ | ❌ | ❌ | ❌ | — |

---

## 四、主题系统设计方案

### 4.1 三层主题架构

```
┌─────────────────────────────────┐
│  ThemeProvider (React Context)   │  ← 运行时切换（暗/亮/自定义）
├─────────────────────────────────┤
│   theme/config.ts (Design Token) │  ← 设计定稿（色板/字体/间距）
├─────────────────────────────────┤
│  theme/tokens.css (CSS 变量)     │  ← 非 React 场景 + 浏览器工具
└─────────────────────────────────┘
```

### 4.2 当前 config.ts 结构分析

当前 `theme/config.ts` 包含了三类内容，重构后应分离：

```
config.ts （重构后）:
├── 色彩 Token:  themeColors        ← 品牌色板
├── 渐变 Token:  gradients          ← 渐变工厂
│   colors: { primary, ... }
│   surfaces: { header, content }
│   effects: { cardGlass, blueGlow }
├── 样式工厂:    cardGlassStyle      ← 返回 CSSProperties 的函数
├── 动画预设:    card3DHover         ← motion 变体预设
└── 新加:        shadows, glows, typography
```

### 4.3 主题运行时切换方案

```tsx
// theme/context.tsx
interface ThemeContextValue {
  mode: 'dark' | 'light' | 'custom'
  colors: typeof themeColors
  setMode: (mode: string) => void
  setCustomColor: (key: string, value: string) => void
}
```

支持通过 ConfigProvider 的 `theme.algorithm` 切换 antd 组件色彩，同时透传自定义 Token 到 UI 组件。

### 4.4 主题复用策略

- **单项目**：直接 `import { themeColors } from '@/theme'`
- **跨项目**：抽离为独立的 `@ruyi/theme` 包，发布到内部 npm registry
- **CSS 变量**：`tokens.css` 暴露 `--ruyi-primary: #1a5cff` 等变量，供非 React 页面或浏览器 DevTools 调整

---

## 五、组件库发布方案

### 方案 A：内部目录引用（推荐初期使用）

```
frontend/
├── src/ui/              ← 组件源码，Vite 直接引用
├── src/business/        ← 业务组件同上
```

**特点**：
- 零构建配置，修改即时生效（HMR）
- 适合单体项目快速迭代
- 新项目 clone 后直接复制 `src/ui/ + src/business/ + src/theme/` 即可

**新项目快速启动**：
```bash
# 从模板克隆
git clone <template-repo> my-new-admin
# 仅复制核心组件
cp -r ruyi-admin/frontend/src/ui/     my-new-admin/src/
cp -r ruyi-admin/frontend/src/theme/  my-new-admin/src/
cp -r ruyi-admin/frontend/src/hooks/  my-new-admin/src/
# 然后定制业务组件
```

### 方案 B：内部 NPM 包（推荐团队多项目时使用）

```
packages/
├── @ruyi/ui/            ← UI 组件库
├── @ruyi/theme/         ← 主题系统
├── @ruyi/hooks/         ← 通用 Hooks
└── @ruyi/business/      ← 业务组件（可选）
```

使用 **Vite library mode** + `tsup`/`vite build` 打包：

```ts
// packages/ui/vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'RuyiUI',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'antd', 'framer-motion'],
    },
  },
})
```

**CI/CD 流水线**：
1. `changeset` 管理版本号 + changelog
2. `pnpm publish --filter @ruyi/ui` 发布到内部 npm registry
3. 主项目 `pnpm add @ruyi/ui` 引用

### 推荐路线图

```
阶段 1（现在） ──→ 方案 A：目录引用
阶段 2（2+ 项目）─→ 方案 B：monorepo 分包发布
```

---

## 六、二次开发工作流

### 6.1 新业务页面开发流程

```
┌─────────────────────────────────────────┐
│ 1. pages/ 下新建页面                     │
│    pages/Reports/index.tsx               │
├─────────────────────────────────────────┤
│ 2. 用 UI 组件库快速搭建                   │
│    import { GlassCard, TiltCard }        │
│    从 '@/ui'                              │
├─────────────────────────────────────────┤
│ 3. 编写业务组件（可选）                    │
│    business/SalesChart/index.tsx         │
├─────────────────────────────────────────┤
│ 4. 添加路由                              │
│    router/index.tsx 加入新路由项           │
├─────────────────────────────────────────┤
│ 5. 添加 Mock 数据 / API 对接              │
│    mock/reports.ts 或 services/reports.ts │
└─────────────────────────────────────────┘
```

### 6.2 主题定制（换肤/换品牌）

```ts
// 修改 theme/config.ts 的 themeColors 对象
export const themeColors = {
  primary: '#1677ff',          // 改为新品牌主色
  primaryDark: '#0958d9',
  primaryLight: '#4096ff',
  // ...
}
```
所有 UI 组件自动跟随，无需修改组件代码。

### 6.3 从模板创建新项目

```bash
# 方式一：复制核心目录 (推荐)
cp -r ../ruyi-admin/frontend/src/{ui,theme,hooks,utils,types,layouts} src/
# 然后：
# 1. 修改 layouts/MainLayout.tsx 中的菜单项
# 2. 修改 theme/config.ts 中的品牌色
# 3. 开发 pages/ 下的业务页面

# 方式二：使用 create-ruyi CLI 脚手架（后续规划）
npx create-ruyi-admin my-app
```

---

## 七、重构迁移计划

### 阶段 1：UI 组件抽离（1-2 天）

| 步骤 | 操作 | 影响文件 |
|------|------|---------|
| 1 | 创建 `src/ui/` 目录结构 | — |
| 2 | 抽离 `CountUp` → `ui/CountUp/index.tsx` | Dashboard.tsx 删除 30-59行 |
| 3 | 抽离 `RippleBorder` → `ui/RippleBorder/index.tsx` | Dashboard.tsx 删除 62-83行 |
| 4 | 抽离 `GradientBorder` → `ui/GradientBorder/index.tsx` | Dashboard.tsx 删除 86-104行 |
| 5 | 抽离 `TiltCard` → `ui/TiltCard/index.tsx` | Dashboard.tsx 删除 107-159行 |
| 6 | 抽离 `GlassBarChart` → `ui/GlassBarChart/index.tsx` | Dashboard.tsx 删除 242-292行 |
| 7 | 抽离 `AnimatedRow` → `ui/AnimatedRow/index.tsx` | Dashboard.tsx 删除 312-321行 |
| 8 | 抽离 `StatCard` → `ui/StatCard/index.tsx` | Dashboard.tsx 删除 162-239行 |
| 9 | 迁移 `ParticleBg` → `ui/ParticleBg/index.tsx` | components/ParticleBackground.tsx 移除 |
| 10 | 创建 `ui/index.ts` 统一导出 | — |

### 阶段 2：业务组件抽离（1 天）

| 步骤 | 操作 |
|------|------|
| 1 | 创建 `src/business/` 目录 |
| 2 | 将 `orderColumns` → `business/OrderTable/columns.ts` |
| 3 | 将订单 Table 封装 → `business/OrderTable/index.tsx` |
| 4 | 将统计卡片行封装 → `business/DashboardStats/index.tsx` |
| 5 | 将访问趋势 Card → `business/VisitChart/index.tsx` |
| 6 | 将通知 Timeline → `business/NotificationTimeline/index.tsx` |

### 阶段 3：Hooks 与主题优化（0.5 天）

| 步骤 | 操作 |
|------|------|
| 1 | 从 `TiltCard` 抽离鼠标追踪逻辑 → `hooks/useTilt.ts` |
| 2 | 从 `CountUp` 抽离动画逻辑 → `hooks/useCountUp.ts` |
| 3 | 封装入场动画 → `hooks/useAnimatedEntry.ts` |
| 4 | 创建 `theme/context.tsx` 提供运行时主题切换 |
| 5 | 分离玻璃拟态样式工厂 → `theme/features/glassmorphism.ts` |

### 阶段 4：路由与布局优化（0.5 天）

| 步骤 | 操作 |
|------|------|
| 1 | 创建 `src/router/` → 路由配置表 |
| 2 | 拆分 `MainLayout` → 子组件 |
| 3 | 页面懒加载 |
| 4 | 全局类型和工具函数目录初始化 |

---

## 八、关键目录封装接口设计

### ui/index.ts — 组件库统一导出

```ts
export { GlassCard } from './GlassCard'
export type { GlassCardProps } from './GlassCard'
export { TiltCard } from './TiltCard'
export type { TiltCardProps } from './TiltCard'
export { CountUp } from './CountUp'
export type { CountUpProps } from './CountUp'
// ... 其余组件
```

### hooks/index.ts — Hook 统一导出

```ts
export { useTilt } from './useTilt'
export { useCountUp } from './useCountUp'
export { useAnimatedEntry } from './useAnimatedEntry'
export { useTheme } from './useTheme'
```

### theme/index.ts — 主题系统统一导出

```ts
export { themeColors, gradients, cardGlassStyle } from './config'
export type { ThemeColors } from './config'
export { ThemeProvider, useTheme } from './context'
export type { ThemeContextValue } from './context'
export { glassCardStyle, frostedBorder } from './features/glassmorphism'
export { entranceVariants, staggerVariants } from './features/animations'
```

---

## 九、架构优势总结

| 需求 | 方案 | 收益 |
|------|------|------|
| 代码拆分 | 按层级分目录 | 单文件最大 80 行，定位快 |
| 视觉复用 | UI 组件库 + 主题 Token | 换肤改 1 个文件 |
| 业务复用 | Business 组件 + Mock 数据 | 新页面 10 分钟搭建 |
| 项目克隆 | 复制 `ui/ theme/ hooks/` | 1 小时获得完整视觉框架 |
| 团队协作 | 分层清晰 + 统一导出 | 新人上手快 |
| 后续扩展 | 方案 B → monorepo 发包 | 按需升级 |

---

> **下一步行动建议**：按「重构迁移计划」阶段 1 逐步执行，每个组件抽离后验证 HMR 正常。
