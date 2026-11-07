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
