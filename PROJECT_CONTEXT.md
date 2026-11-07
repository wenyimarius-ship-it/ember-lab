# Ember Lab 当前上下文

## 范围

2026-11-07：Phase 2，建立独立交互实验目录网站。原仓库为空；本轮创建原生静态站，不改主站、ATU、Spaces、CultureBridge 或三个独立实验的代码，不改 DNS，不执行 Vercel 部署。

## 实现

- Node 22+ 零依赖构建，`npm run build` 输出 dist；`npm run dev` 启动本地服务。
- `experiments.js` 统一数据，构建预渲染 Featured 和卡片，浏览器 JS 只负责状态筛选。
- 主站 tokens 与设计规范来自提交 f66710f627b251aae09c8af16d540d21ab6d1281，来源及对应关系见 docs/design.md。
- CultureBridge 保持已有项目/待接入，其他三项目开发中，全部 URL 为空。
- Vercel 使用 Other + dist；支持读取 VERCEL_URL 或可选 SITE_URL 生成部署分享元信息。

## 验证及待办

详见 docs/validation.md。部署、主域名绑定、真实 CultureBridge 接入和三个独立作品开发均是后续任务。
使用已有独立环境中的 checkout，不需要额外 Git worktree。继续修改前检查 git status，保留用户变更。

## 2026-11-07：导航与双语补齐

用户明确要求补齐主站导航细节，并修复主站到 Lab 的入口；该新授权允许在 ember-personal-site 中仅调整 Spaces 的 Lab 条目及必要说明。

- Lab 默认中文，EN / 中 切换界面、项目说明、状态、筛选反馈和无障碍名称；用 URL 参数保留语言，不写浏览器存储。
- 新增 INDEX 原生 dialog、键盘焦点管理、实验档案定位、Spaces、联系区和主站公开邮箱；手机端导航保持所有入口可见。
- 主站独立修复分支将 Spaces 中 Lab 标为 Live 并填入正式 URL（依据用户已实际打开站点的报告）；不声称本环境已成功访问线上域名。
- 不涉及 DNS、域名绑定、实验内部功能或生产发布。线上更新仍依赖 GitHub 合并与既有部署流程。
