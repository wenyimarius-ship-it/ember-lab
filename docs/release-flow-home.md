# 新 Lab 首页发布记录

正式目标：marius 团队下的 `ember-lab` 项目，域名 `https://lab.mariustang.com/`。

- 发布源码在独立分支 `feat/lab-flow-home`；未改动 `main`，未改 DNS 或 Vercel 项目配置。
- 首页来自用户确认的独立交互预览，保留四件作品的正式体验链接；`/about/` 继续使用原有完整介绍页面。
- 整合此前 `fix/share-meta` 的正式域名分享标签，以及 `fix/copy-consistency` 的故事偏好文案；这两个原分支保持不变。
- 抽象图案全部为原创程序几何，无真实海报或外部图像；创作记录仍明确标记为示意。
- 浏览器测试随首页结构做最小适配，保留正确外链、同标签跳转、四种视口、双语往返、键盘、筛选、无 JavaScript 和页面错误检查；增加滚动弧光和减少动态效果检查。
- 本地服务器增加 `.mjs` 的 JavaScript MIME 类型，保证与生产相同的 ES 模块正常加载。

发布前生产部署：`dpl_8xHBxGWbXsFWwaVPZRCTfQ8ctJG7`，提交 `ca4f6899eb50ce8c6c9ec8fac702f057f81c702d`。

后续从 `main` 发布前，应先合并本分支，以免重新发布旧版首页。部署不会修改三个独立实验或 CultureBridge 的源码。

## 发布前验证

- `npm test`：26 项通过；`npm run build` 成功。
- `tests/browser.py`：320 / 390 / 700 / 1440px 下，首个体验入口、无横向溢出、语言与刷新、介绍页往返、键盘目录、弧光前进与返回通过；关闭 JavaScript 和系统减少动态效果检查通过；无页面脚本错误。
- `tests/navigation_audit.py`：390 / 1440px 下，加载独立作品的只读源码快照验证往返。外部作品未作为线上服务验收。
- 使用现有生产 CSP 加载 390 / 1440px 页面，图案可见，模块和静态资源可用，分享标签正确。
- `vercel.json` 和原 OG 图片保持不变；独立源码快照及 Cinema 的 `films.js`、`questions.js` 哈希均保持不变。

## 本分支涉及的文件

- `index.html`、`assets/flow/`：新版首页及动画、双语、目录和记录交互。
- `pages/project-notes.html`、`scripts/build.mjs`：整合此前分享标签修复，介绍页正文保持原样。
- `experiments.js`、`scripts/localize.mjs`：整合此前 Cinema 故事偏好文案修复，不改推荐或项目行为。
- `scripts/serve.mjs`：补齐 ES 模块 MIME 类型。
- `tests/experiments.test.mjs`、`tests/browser.py`、`tests/navigation_audit.py`、`tests/motion.test.mjs`、`tests/thread.test.mjs`：保留原功能检查，适配新布局并验证动静态配合。
- `README.md`、`docs/deployment.md`、本记录：维护与发布说明。
