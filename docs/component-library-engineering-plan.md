# RuyiGin React Admin — 组件库工程化方案

> 基于当前项目（Vite + React 19 + TypeScript 6 + Ant Design 6）的设计决策记录。
> 目标：打造可复用、可二次开发、可发布的通用管理系统骨架。

---

## 目录

1. [Monorepo 架构](#1-monorepo-架构)
2. [包管理方案](#2-包管理方案)
3. [内部组件库开发工作流](#3-内部组件库开发工作流)
4. [主题定制方案](#4-主题定制方案)
5. [按需加载与 Tree-Shaking](#5-按需加载与-tree-shaking)
6. [组件库文档方案](#6-组件库文档方案)
7. [版本管理与发布策略](#7-版本管理与发布策略)
8. [脚手架结构](#8-脚手架结构)
9. [推荐实施路线图](#9-推荐实施路线图)

---

## 1. Monorepo 架构

### 推荐方案：pnpm workspace monorepo

> **理由**：当前项目是一个独立的 Vite SPA，而组件库与项目本身耦合紧（共享主题、antd 版本、TypeScript 配置）。将组件库放在 monorepo 的子包中，开发时 zero-config 联动，需要发布时独立打包发 npm，兼顾开发体验与复用能力。

### 目录结构

```
RuyiGinReactAdmin/
├── pnpm-workspace.yaml          # pnpm workspace 配置
├── package.json                 # 根 package（仅 devDeps + scripts）
├── packages/
│   ├── components/              # 组件库包（核心交付物）
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts       # 用 vite build 打 esm + cjs
│   │   ├── src/
│   │   │   ├── index.ts         # barrel export
│   │   │   ├── Button/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── style.ts     # 组件级样式（CSS变量 + token）
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   ├── Layout/
│   │   │   ├── TablePro/
│   │   │   ├── FormPro/
│   │   │   ├── ParticleBackground/
│   │   │   └── theme/
│   │   │       ├── tokens.ts    # design token 定义
│   │   │       ├── dark.ts      # 暗色主题 token
│   │   │       └── light.ts     # 亮色主题 token
│   │   └── lib/                  # 构建产物（发布用）
│   └── admin/                   # 管理端应用（当前 frontend/ 迁移至此）
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
├── apps/
│   └── storybook/               # Storybook 文档站点
│       ├── package.json
│       └── stories/
├── tooling/
│   └── create-ruyi-admin/       # 脚手架 CLI（模板）
├── tsconfig.base.json           # 全局 TS 基础配置
├── .github/
│   └── workflows/
│       ├── release.yaml         # 发布工作流
│       └── ci.yaml              # CI 测试
└── docs/
    └── component-library-engineering-plan.md
```

### 关键决策

| 选项 | 结论 | 理由 |
|------|------|------|
| 单一 repo 子目录 vs monorepo | **pnpm workspace monorepo** | 组件库和管理端共享 devDeps、tsconfig、lint；pnpm 的 workspace protocol 让本地引用 zero-config |
| pnpm vs npm vs yarn | **pnpm** | pnpm workspace 是 monorepo 场景的事实标准；支持 filter、部署体积小、严格的依赖隔离 |
| Turborepo / Nx | **暂不需要** | 当前 1 个组件包 + 1 个应用，Turborepo 的缓存编排带来的 ROI 不高。当包数 >5 或 CI 耗时 >5min 时引入 |

---

## 2. 包管理方案

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tooling/*'
```

### 根 package.json 职责

- 公共开发依赖（TypeScript, ESLint/oxlint, prettier, commitlint, husky）
- `scripts` 只放编排命令（build, test, lint, clean）
- `private: true` 防止意外发布

```jsonc
{
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @ruyi/admin dev",
    "build": "pnpm --filter @ruyi/components build && pnpm --filter @ruyi/admin build",
    "build:components": "pnpm --filter @ruyi/components build",
    "build:admin": "pnpm --filter @ruyi/admin build",
    "lint": "pnpm -r lint",
    "clean": "pnpm -r clean",
    "changeset": "changeset",
    "version": "changeset version",
    "publish": "pnpm -r publish"
  }
}
```

### 组件库依赖关系

```
@ruyi/admin  ──depends on──>  @ruyi/components  (workspace:*)
```

`package.json` 中：

```jsonc
// packages/admin/package.json
{
  "dependencies": {
    "@ruyi/components": "workspace:*"
  }
}
```

workspace protocol 开发时直接引用本地源码（不 link、不 yalc），pnpm 自动软链。

---

## 3. 内部组件库开发工作流

### 开发时热更新

```bash
# 终端1：组件库 watch 模式
pnpm --filter @ruyi/components dev

# 终端2：管理端 dev server
pnpm --filter @ruyi/admin dev
```

组件库使用 Vite 的 `lib` 模式 + `build.watch`，每次改组件源码，管理端 HMR 自动生效。

### 为什么不需要 yalc / npm link

| 工具 | 问题 | 本方案的解法 |
|------|------|-------------|
| npm link | 符号链接破坏 node_modules 解析，React hooks 会 `invalid hook call` | pnpm workspace 用硬链接 + 隔离的 node_modules，不会出现 duplicate React |
| yalc | 需要手动 push/publish，额外心智负担 | workspace protocol 完全自动 |
| npm workspace | 提升所有包到根 node_modules，破坏隔离 | pnpm workspace 保持了严格的依赖隔离 |

### 组件库的 vite 构建配置

```ts
// packages/components/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.json' })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RuyiComponents',
      formats: ['es', 'cjs'],
      fileName: format => `ruyi-components.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd', '@ant-design/icons', 'framer-motion'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
          'framer-motion': 'FramerMotion',
        },
      },
    },
    // 开发 watch 模式
    watch: process.env.NODE_ENV === 'development' ? {} : null,
  },
})
```

---

## 4. 主题定制方案

### 推荐方案：CSS 自定义属性（CSS Variables）+ Ant Design 6 Token

**双层架构**，兼顾 antd 生态兼容与轻量自定义。

#### 第一层：Ant Design 6 Design Token（JS 变量）

```ts
// packages/components/src/theme/antd-token.ts
import type { ThemeConfig } from 'antd'

export const ruyiLightToken: ThemeConfig['token'] = {
  colorPrimary: '#1a5cff',
  borderRadius: 8,
  // ...映射到当前 themeColors
}

export const ruyiDarkToken: ThemeConfig['token'] = {
  colorPrimary: '#4a8cff',
  borderRadius: 8,
  colorBgContainer: 'rgba(255,255,255,0.05)',
  // ...
}
```

管理端在 `ConfigProvider` 中注入：

```tsx
<ConfigProvider theme={{ token: ruyiDarkToken }}>
  <App />
</ConfigProvider>
```

#### 第二层：CSS 自定义属性（轻量组件用）

```css
/* 组件库内部使用 */
:root {
  --ruyi-primary: #1a5cff;
  --ruyi-bg-glass: rgba(255,255,255,0.05);
  --ruyi-border-glass: rgba(255,255,255,0.08);
  --ruyi-text-primary: #e8edf5;
  --ruyi-sidebar-bg: rgba(10,22,40,0.85);
  /* ... */
}

[data-theme='dark'] {
  --ruyi-primary: #4a8cff;
  --ruyi-bg-glass: rgba(255,255,255,0.03);
  /* 覆盖 */
}
```

组件中直接使用：

```tsx
// packages/components/src/Button/style.ts
export const glassButtonStyle: React.CSSProperties = {
  background: 'var(--ruyi-bg-glass)',
  border: '1px solid var(--ruyi-border-glass)',
  color: 'var(--ruyi-text-primary)',
}
```

#### 二次开发时定制主题

用户只需：

1. 在项目中定义自己的 CSS 变量（覆盖 `--ruyi-*`）
2. 包裹 `<ConfigProvider theme={{ token: {...} }}>` 覆盖 antd token
3. 如果使用组件库的 `<ThemeProvider>`，传入 `customTokens` 覆盖默认

```tsx
// 用户项目
import { ThemeProvider } from '@ruyi/components'

const app = (
  <ThemeProvider
    mode="dark"
    customTokens={{ colorPrimary: '#7c3aed' }}
    customCssVars={{ '--ruyi-primary': '#7c3aed' }}
  >
    <App />
  </ThemeProvider>
)
```

### 为什么是 CSS变量 + antd Token（而不是 styled-components / emotion）

| 方法 | 运行时开销 | 二次开发难度 | 与 antd 兼容 |
|------|-----------|-------------|-------------|
| CSS Variables | **零** | 低，写 CSS 即可 | 旁路兼容 |
| Antd Token | 零（ConfigProvider）| 中，需了解 antd token | 原生兼容 |
| styled-components | 有 | 低 | 需要包裹 |
| Emotion CSS prop | 有 | 低 | 需要包裹 |

**结论**：CSS Variables 覆盖 90% 的场景（背景色、文字色、边框等），Antd Token 覆盖 antd 自有组件。两者互补，无需额外运行时 CSS-in-JS。

---

## 5. 按需加载与 Tree-Shaking

### ESM 输出 + sideEffects: false

```jsonc
// packages/components/package.json
{
  "type": "module",
  "main": "./lib/ruyi-components.cjs",
  "module": "./lib/ruyi-components.mjs",
  "types": "./lib/index.d.ts",
  "exports": {
    ".": {
      "import": "./lib/ruyi-components.mjs",
      "require": "./lib/ruyi-components.cjs",
      "types": "./lib/index.d.ts"
    }
  },
  "sideEffects": false
}
```

关键点：

1. **Vite 的 lib 模式**天然输出 ESM + CJS，Rollup 自动 tree-shaking
2. **`sideEffects: false`** 告诉打包工具可以安全删除未使用的导出
3. **`exports` 字段**让 Vite/Webpack 优先使用 ESM 入口
4. **组件不要包含全局副作用**（不要 import 'xxx.css'，改为 CSS-in-JS 或 CSS Modules）
5. **antd 本身支持 tree-shaking**（无需 babel-plugin-import，antd v5+ 已原生支持）

### Barrel export 的注意事项

```ts
// packages/components/src/index.ts
export { Button, GlassButton } from './Button'
export { GlassCard } from './Card'
export { MainLayout } from './Layout'
export { TablePro } from './TablePro'
export { FormPro } from './FormPro'
export { ThemeProvider, useTheme } from './theme'
export type { ThemeMode, ThemeTokens } from './theme'
```

Vite/Rollup 的 tree-shaking 可以正确处理 barrel export——只会打包实际 import 的组件。

---

## 6. 组件库文档方案

### 推荐方案：Storybook 8 + 中文文档 + 在线 Playground

#### 为什么是 Storybook

| 方案 | 优点 | 缺点 |
|------|------|------|
| **Storybook 8** | 生态最成熟；交互式 playground；MDX 写文档；支持 CSF 3.0 | 构建略慢；配置略多 |
| Documate | 轻量；基于 Vite | 生态小；缺少交互式 demo |
| Docusaurus | 适合站点文档 | 不适合组件 demo |
| Styleguidist | 支持 react-docgen | 已不活跃 |
| ~~自己写~~ | 灵活 | 需要造轮子，ROI 低 |

#### 目录结构

```
apps/storybook/
├── package.json
├── .storybook/
│   ├── main.ts          # stories 路径、plugins、addons
│   ├── preview.tsx      # 全局 decorator（ThemeProvider）
│   └── manager.ts       # 品牌色配置
├── stories/
│   ├── Introduction.mdx  # 介绍页
│   ├── GettingStarted.mdx
│   ├── Theme/
│   │   └── Theme.mdx     # 主题定制说明
│   ├── Button/
│   │   ├── Button.stories.tsx
│   │   ├── GlassButton.stories.tsx
│   │   └── Button.docs.mdx
│   ├── Card/
│   │   └── Card.stories.tsx
│   ├── Layout/
│   │   └── Layout.stories.tsx
│   └── Pro/
│       ├── TablePro.stories.tsx
│       └── FormPro.stories.tsx
└── public/
```

#### 关键 Addon 配置

```ts
// .storybook/main.ts
export default {
  stories: ['../stories/**/*.stories.@(ts|tsx)', '../stories/**/*.mdx'],
  addons: [
    '@storybook/addon-essentials',       // Controls, Actions, Docs, Viewport
    '@storybook/addon-interactions',      // 交互测试
    '@storybook/addon-a11y',              // 无障碍检查
    'storybook-dark-mode',                // 暗色模式切换
    '@storybook/addon-themes',            // 主题切换
  ],
  framework: '@storybook/react-vite',
}
```

```tsx
// .storybook/preview.tsx
import { ThemeProvider } from '@ruyi/components'

export const decorators = [
  (Story, context) => (
    <ThemeProvider mode={context.globals.theme || 'dark'}>
      <Story />
    </ThemeProvider>
  ),
]

export const parameters = {
  backgrounds: { disable: true },
  themes: {
    default: 'dark',
    list: [
      { name: '暗色', value: 'dark' },
      { name: '亮色', value: 'light' },
    ],
  },
}
```

#### 文档即代码

每个组件目录下维护一个 `.stories.tsx` 文件，用 CSF 3.0 的 `render` + `args` 生成 demo：

```tsx
// stories/Button/GlassButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { GlassButton } from '@ruyi/components'

const meta: Meta<typeof GlassButton> = {
  title: '通用/GlassButton',
  component: GlassButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'default', 'ghost'] },
    size: { control: 'select', options: ['small', 'middle', 'large'] },
  },
}

export default meta
type Story = StoryObj<typeof GlassButton>

export const Primary: Story = {
  args: { variant: 'primary', children: '主要按钮' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: '幽灵按钮' },
}
```

#### 部署方式

- **GitHub Pages**（免费）：`pnpm --filter storybook build`，输出到 `docs/` 或 gh-pages branch
- **Vercel**：monorepo 中配置 `apps/storybook` 为独立部署
- **Netlify**：同理

---

## 7. 版本管理与发布策略

### 推荐方案：Changesets + Conventional Commits + GitHub Releases

#### 工作流

```
开发者提交 feat/fix → Changeset 自动生成 changelog → PR merge → CI 发布
```

#### 工具链

| 职责 | 工具 |
|------|------|
| 版本号管理 | `@changesets/cli` |
| 提交规范 | Conventional Commits + commitlint |
| Changelog 生成 | changeset 自动生成 |
| 发布 | GitHub Actions + npm publish |

#### Changesets 配置

```jsonc
// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@3/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@ruyi/admin"]
}
```

#### npm 包配置

```jsonc
// packages/components/package.json
{
  "name": "@ruyi/components",
  "version": "0.1.0",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "files": [
    "lib/",
    "README.md",
    "LICENSE"
  ]
}
```

#### 发布流程

```
main 分支
  │
  ├─ developer commits: feat:, fix:, chore:
  │
  ├─ pnpm changeset        ← 交互式选择版本 bump
  │
  ├─ PR merge to main
  │
  ├─ GitHub Actions:
  │    ├─ pnpm install
  │    ├─ pnpm build
  │    ├─ pnpm test
  │    └─ pnpm publish -r  ← 自动发布到 npm
  │
  └─ GitHub Release 创建
```

#### GitHub Actions CI

```yaml
# .github/workflows/release.yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm build
      - run: pnpm -r test
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm publish -r
          commit: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### 版本策略

| 阶段 | 版本号 | 说明 |
|------|--------|------|
| 内部开发 | 0.x.x | 快速迭代，可以不严格遵守 semver |
| 开放使用 | 1.x.x | 遵循 semver；breaking change 要 major 版本 |
| 组件级发布 | 各包独立版本 | changesets 自动管理 inter-package 依赖 |

---

## 8. 脚手架结构

### 推荐方案：npm create 脚手架

当开发者想「复制一份快速二次开发」，不需要手动去 GitHub clone 然后删掉 .git，而是：

```bash
npm create @ruyi/admin my-admin-app
# 或
pnpm create @ruyi/admin my-admin-app
```

#### 目录结构

```
tooling/create-ruyi-admin/
├── package.json
├── src/
│   ├── index.ts            # 入口：交互式问答
│   ├── questions.ts        # prompts（项目名、包名、theme、是否安装storybook）
│   ├── template.ts         # 模板渲染逻辑
│   └── utils.ts
└── templates/
    ├── _package.json.hbs    # Handlebars 模板
    ├── _vite.config.ts.hbs
    ├── _tsconfig.json.hbs
    ├── src/
    │   ├── main.tsx.hbs
    │   ├── App.tsx.hbs
    │   ├── theme/
    │   │   └── config.ts.hbs
    │   └── pages/
    │       └── Dashboard.tsx.hbs
    ├── .gitignore.hbs
    └── README.md.hbs
```

#### 模板引擎选择

**Handlebars**（轻量，无运行时依赖）或 **EJS**（更常见）。推荐 Handlebars，因为语法简单、模板不可执行。

```ts
// 交互式问答
const questions = [
  { type: 'input', name: 'projectName', message: '项目名称', default: 'my-admin' },
  { type: 'select', name: 'packageManager', message: '包管理器', choices: ['pnpm', 'npm'] },
  { type: 'toggle', name: 'storybook', message: '是否安装 Storybook？', initial: true },
  { type: 'select', name: 'theme', message: '默认主题', choices: ['暗色', '亮色', '双主题'] },
]
```

```jsonc
// tooling/create-ruyi-admin/package.json
{
  "name": "@ruyi/create-admin",
  "version": "0.1.0",
  "bin": {
    "@ruyi/create-admin": "dist/index.js",
    "create-ruyi-admin": "dist/index.js"
  },
  "files": ["dist", "templates"]
}
```

#### 为什么不直接推荐 clone repo

| 方式 | 问题 | create 脚手架的方式 |
|------|------|--------------------|
| git clone + 删 .git | 笨重，需要手动改 package.json 名字 | 自动生成 |
| 模板 repo（template repo）| 无法交互式选择功能 | 交互式问答 |
| Fork | 需要 GitHub 操作，不够本地化 | 纯本地 |

#### 完整脚手架命令示例

```bash
$ pnpm create @ruyi/admin my-admin-app
✔ 项目名称 · my-admin-app
✔ 包管理器 · pnpm
✔ 是否安装 Storybook？ · 是
✔ 默认主题 · 暗色

🎉 项目创建成功！
cd my-admin-app
pnpm install
pnpm dev
```

生成的目录结构：

```
my-admin-app/
├── package.json
├── pnpm-workspace.yaml
├── packages/
│   ├── components/       # @ruyi/components (本地 link)
│   └── admin/            # 管理端应用
├── apps/
│   └── storybook/        # (可选)
├── tsconfig.base.json
└── README.md
```

---

## 9. 推荐实施路线图

### Phase 1 — 基础设施（1-2 天）

- [ ] 初始化 pnpm workspace
- [ ] 创建 `packages/components/` 目录，从 `frontend/src/` 提取可复用组件（GlassButton, GlassCard, MainLayout, ParticleBackground）
- [ ] 创建 `packages/admin/`，将当前 `frontend/` 迁移过来
- [ ] 配置组件库的 `vite.config.ts`（lib 模式 + dts）
- [ ] 配置根 package.json scripts（`pnpm --filter` 编排）
- [ ] 验证 `pnpm dev` 热更新正常

### Phase 2 — 主题系统（1 天）

- [ ] 提取 `theme/` 包：`tokens.ts`, `antd-token.ts`, CSS 自定义属性
- [ ] 实现 `ThemeProvider` 组件（包裹 ConfigProvider + CSS 变量注入）
- [ ] 亮/暗色主题切换
- [ ] 从 `frontend/src/theme/config.ts` 迁移主题变量

### Phase 3 — 文档与 CI（2-3 天）

- [ ] 配置 Storybook 8 + dark mode addon
- [ ] 为核心组件编写 storie（GlassButton, GlassCard, MainLayout, ThemeProvider）
- [ ] 配置 Changesets
- [ ] GitHub Actions: CI（lint + build + test）
- [ ] GitHub Actions: Release（publish to npm）

### Phase 4 — 脚手架（2 天）

- [ ] 实现 `create-ruyi-admin` CLI
- [ ] 设计 Handlebars 模板
- [ ] 发布到 npm
- [ ] 验证 `pnpm create @ruyi/admin` 端到端流程

### Phase 5 — 进阶（持续）

- [ ] 组件单元测试（Vitest + Testing Library）
- [ ] Chromatic 视觉回归测试
- [ ] 组件使用数据统计
- [ ] Pro 级别组件（TablePro, FormPro, CrudPage 等）

---

## 附录：关键决策总结

| # | 问题 | 决策 | 理由 |
|---|------|------|------|
| 1 | monorepo 吗？ | 是，pnpm workspace | 开发时共享依赖和配置，发布时独立打包 |
| 2 | 内部包管理？ | workspace protocol | 比 yalc/link 更可靠，HMR 原生支持 |
| 3 | 主题定制？ | CSS Variables + antd Token | 零运行时开销 + antd 原生兼容 |
| 4 | 按需加载？ | ESM + `sideEffects: false` | Rollup 自动 tree-shaking，无需额外配置 |
| 5 | 文档方案？ | Storybook 8 + MDX | 交互式 demo + 中文文档，生态最成熟 |
| 6 | 版本管理？ | Changesets + Conventional Commits | 自动化 changelog + 发布，减少人工失误 |
| 7 | 脚手架？ | npm create CLI | 交互式问答生成项目，比 clone 更优雅 |
| 8 | 构建工具？ | Vite lib 模式 | 与现有 Vite 生态一致，零学习成本 |
