# AGENTS.md

本文件适用于整个项目，供后续协作的开发者与 AI 编码代理使用。

## 项目定位

- 项目名称：星屑手记 / HOSHIKUZU NOTE。
- 项目类型：中文个人博客，内容主要涉及插画、游戏、音乐和日常生活。
- 设计方向：干净、有质感、具有专业产品完成度，同时保留克制的二次元与星空氛围。
- 当前正式站点：[https://hoshikuzu-note-blog.netlify.app](https://hoshikuzu-note-blog.netlify.app)。
- 网站默认语言为简体中文。除非用户另有要求，新增页面、文章、按钮和提示均使用自然的中文表达。

## 技术栈与运行方式

- 使用 npm，不要擅自更换为 pnpm、Yarn 或其他包管理器。
- Node.js 最低版本为 `22.13.0`；Netlify 构建环境使用 Node.js `24`。
- 核心技术：Next.js 16 App Router、React 19、TypeScript 5、Vite 8 与 vinext。
- 本地开发命令：`npm run dev`，默认访问地址为 `http://localhost:3000/`。
- Sites/vinext 构建命令：`npm run build`，产物位于 `dist/`。
- Netlify 正式构建命令：`npm run build:netlify`，产物位于 `out/`。
- 代码检查命令：`npm run lint`。
- 数据库迁移生成命令：`npm run db:generate`；仅在实际修改 Drizzle schema 时使用。

项目保留两套兼容路径：本地开发与 Sites 使用 vinext，Netlify 正式部署使用 Next.js 静态导出。修改配置、路由或依赖时，不能只验证其中一套而破坏另一套。

## 关键文件与职责

- `app/page.tsx`：博客首页，包括导航、首页主视觉、文章分类、文章列表、作者介绍和主题切换。
- `app/layout.tsx`：全站根布局、站点 metadata，以及跨页面常驻的背景音乐播放器。
- `app/posts.ts`：博客文章的唯一数据来源，包括 slug、分类、标题、摘要、日期、正文和引用。
- `app/posts/[slug]/page.tsx`：文章详情页、静态路由生成、文章 metadata 和下一篇推荐。
- `app/cover-art.tsx`：文章封面的场景结构和英文场景标签。
- `app/bgm-player.tsx`：基于 Web Audio API 的多曲目背景音乐播放器。
- `app/globals.css`：全局设计变量、页面布局、文章样式、封面场景、动效及播放器样式。
- `next.config.ts`：Next.js 静态导出配置，当前使用 `output: "export"` 和 `images.unoptimized`。
- `netlify.toml`：Netlify 构建命令、静态产物目录、Node.js 版本及响应头配置。
- `vite.config.ts` 与 `worker/index.ts`：vinext、Cloudflare Worker 和 Sites 的本地运行支持。
- `.openai/hosting.json`：既有 Sites 项目标识和可选资源绑定；保留该文件，不要擅自重建或重新绑定。
- `.netlify/state.json`：本机 Netlify 站点关联信息，属于忽略文件，不得提交。
- `db/`、`drizzle/`、`examples/d1/`：可选数据库与示例能力，不是当前公开博客的核心功能。

## 路由、内容与静态导出

- 新增或修改文章时，优先更新 `app/posts.ts`，避免在首页和详情页重复维护内容。
- 每篇文章的 `slug` 必须唯一、稳定，并适合放入 URL。
- 新文章必须补齐摘要、分类、日期、预计阅读时长、导语与实际正文，不能只提供占位内容。
- 首页分类与文章分类应保持一致；增加新的分类时，需要同步检查筛选按钮。
- 文章详情页依赖 `generateStaticParams()`，并设置 `dynamicParams = false`。新增文章后应确认静态导出包含对应详情页。
- 文章页面的标题、description、Open Graph 和 Twitter metadata 应与实际文章一致。
- Netlify 当前部署的是纯静态站点。未经明确需求，不要引入必须依赖请求时服务端渲染、动态 API Route、运行时数据库、Cookie 或请求头的功能。
- 使用 `next/image` 时保持与静态导出兼容；不要无故移除 `images.unoptimized`。
- 所有新增资源应适合静态托管，优先放在 `public/`，并使用项目内可访问的路径。

## 视觉与交互规范

- 延续现有“星空、蓝紫、纸感、轻量编辑设计”的品牌语言，不要替换为通用后台模板或高饱和营销页面。
- 优先复用 `app/globals.css` 中的现有设计变量：
  - `--ink: #171b2c`
  - `--muted: #6f7382`
  - `--paper: #f4f5f7`
  - `--surface: #fff`
  - `--accent: #4a55c7`
  - `--accent-soft: #e4e6f7`
  - `--line: #d9dce4`
  - `--success: #288567`
- 保持现有深色主题变量可用。新增组件不应只在浅色主题下可读。
- 中文展示标题优先延续 `SimSun` / `STSong` 的宋体气质；正文优先使用 `Microsoft YaHei UI`、`PingFang SC` 等现有字体栈。
- 英文辅助标签保持简短、克制，避免无意义的装饰性编号与过度营销文案。
- 文章封面以 CSS 场景为主。新增文章时，应同步检查 `CoverArt` 的场景类、场景标签及首页和详情页展示。
- 响应式布局主要以 `920px` 和 `620px` 为断点；新增布局应遵循现有模式并兼容手机。
- 交互元素应提供明确的可访问名称、键盘焦点和必要的 `aria-*` 状态。
- 动画必须尊重 `prefers-reduced-motion`，避免新增高频闪烁、阻塞阅读或影响性能的效果。
- 页面文案中已经存在“小星”和“小星星”等不同上下文称呼；修改前先确认具体位置，不要进行无差别全局替换。

## 背景音乐规范

- 音乐播放器挂载在根布局中，应在首页和文章详情页之间持续可用。
- 当前 BGM 使用 Web Audio API 实时生成原创旋律，不依赖外部音频服务，也不引入不明版权的音频文件。
- 浏览器音频必须由用户交互触发；不要强制自动播放或在页面载入时直接创建并播放音频。
- 保留播放、暂停、上一首、下一首、歌单选曲、自动切歌和音量调节能力。
- 当前曲目与音量属于设备本地偏好，可使用 `localStorage`；读取浏览器 API 时必须留在客户端组件或 effect 中。
- 切歌时清理旧定时器，组件卸载时释放 `AudioContext`，避免多重播放、内存泄漏和后台持续发声。
- 播放器保持低音量、克制动效和移动端可操作性，不应遮挡主要阅读内容。

## Netlify 部署

- 用户提到“部署”“上线”“发布”且上下文明确指向当前博客时，优先使用既有 Netlify 站点，而不是另建站点或发布到 `chatgpt.site`。
- 正式地址固定为 `https://hoshikuzu-note-blog.netlify.app`，不要随意更改域名、重建站点或覆盖站点绑定。
- 正式发布前先运行：

  ```bash
  npm run build:netlify
  ```

- 当前 Netlify 自动启用的 Next.js 插件可能在 `onPostBuild` 阶段出现 `Failed publishing static content`。如果静态构建已经成功，应直接发布 `out/`，并明确跳过再次构建：

  ```bash
  npx netlify-cli deploy --prod --dir out --no-build
  ```

- 如果系统 npm 缓存目录没有写权限，可以将缓存放在已忽略的项目目录中：

  ```bash
  npx --yes --cache .netlify/npm-cache netlify-cli deploy --prod --dir out --no-build
  ```

- 不要因为 Netlify 自动插件失败就删除静态导出配置、切换为 SSR、修改站点域名或重新初始化站点。
- `.openai/hosting.json` 的存在只说明项目兼容 Sites；用户明确要求 Netlify 时，不得替换为 Sites 发布流程。
- 除非用户明确要求部署，否则只修改和验证本地代码，不主动更新公开站点。

## 验证与已知限制

- 与 Netlify、文章路由、metadata 或静态资源有关的修改，应优先运行 `npm run build:netlify`。
- 与 vinext、Cloudflare Worker 或 Sites 兼容性有关的修改，还应运行 `npm run build`。
- 修改前后注意 `next-env.d.ts` 可能被构建工具自动重写；不要把无关的生成内容混入本次变更。
- `README.md` 目前仍包含初始化模板说明，不能把其中的 starter 描述当成当前博客的真实产品需求。
- `tests/rendered-html.test.mjs` 仍检查早期 starter loading skeleton，已经与当前博客页面不一致。不要为了让旧测试通过而恢复模板页面；如用户要求完善测试，应先将其更新为真实博客行为。
- 不要手动编辑、提交或纳入源码评审：`node_modules/`、`.next/`、`.vinext/`、`dist/`、`out/`、`.netlify/`、`.wrangler/` 等生成目录。

## Git 与协作边界

- 修改前检查现有工作区状态，保留用户未提交的改动，不覆盖无关文件。
- 未经用户明确要求，不要执行 `git add`、`git commit`、`git push`、创建分支、修改远程仓库或发起部署。
- 用户明确要求发布时，优先使用 Netlify CLI 直接部署已经构建的静态产物，不必为了部署自动提交或推送 GitHub。
- 仓库可能同时存在 `origin`、`github` 和 `sites` 三个远程：前两个指向 GitHub，`sites` 指向 Sites 源码仓库。不要混淆发布目标。
- 用户要求推送 GitHub 时，先确认目标远程和分支；用户要求发布 Netlify 时，不得顺手推送 `sites` 或 GitHub。
- 不要修改 `.git/config`、远程默认分支、用户凭据、站点访问权限或公开范围，除非用户明确要求。
- 完成任务时，简要说明实际变更、验证结果，以及是否执行了提交、推送或线上发布。
