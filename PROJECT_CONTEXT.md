# Ember Lab 当前上下文

## 范围

2026-11-07：Phase 2，建立独立交互实验目录网站。原仓库为空；本轮创建原生静态站，不改主站、ATU、Spaces、CultureBridge 或三个独立实验的代码，不改 DNS，不执行 Vercel 部署。

## 实现

- Node 22+ 零依赖构建，`npm run build` 输出 dist；`npm run dev` 启动本地服务。
- `experiments.js` 统一数据，构建预渲染 Featured 和卡片，浏览器 JS 只负责状态筛选。
- 主站 tokens 与设计规范来自提交 f66710f627b251aae09c8af16d540d21ab6d1281，来源及对应关系见 docs/design.md。
- CultureBridge 已按用户确认与官方仓库记录接入 Streamlit 真实地址，状态保持已有项目；其他三项目开发中且 URL 为空。
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

## 2026-11-07：CultureBridge 接入与线上版本核对

- 只读检查 culturebridge 仓库提交 0d057f6，README 线上地址及部署说明均指向 Streamlit Cloud，无 Vercel 迁移证据。用户确认网站可打开，本环境代理仍阻断独立访问。
- experiments.js 写入同一真实 URL，Featured、卡片和 INDEX 共用配置，移除待接入；主站现有原型链接已相同。三个未上线实验仍无链接。
- 主站 main 已合并入口修复（e92c3a2）；Lab main 仍为 2462c60，双语导航 PR #1 未进入 main。本次更新追加到该 PR 的原分支，不创建第二套导航修复。
- 新增 docs/site-addresses.md 记录规范入口、托管证据和验证限制。未修改 CultureBridge 源码、服务器、Secrets、DNS 或生产部署。

## 2026-11-08：紧凑作品目录草稿（审阅分支）

- 分支 feat/lab-entry-navigation，从 main 的 4131461 创建；用户要求先提供本地可点击对照，停在可审阅状态，不推送 main 或部署。
- 首页改为 Cinema / City / Puzzle / CultureBridge 四张整卡链接：名称、一句实际玩法、箭头，当前标签页打开。原有长介绍移到 /about/，可直接回目录；四作品的正式 URL、状态和独立源码均不变。
- 新增本地 /review/ 对照改动前完整快照与目录版；快照及离线导出在忽略目录 .review，比较路由不进入 dist。
- 16 项 Node 测试、四种宽度 Lab 浏览器检查通过。390/1440px 使用三独立作品实际源码快照走通返回回路，未用假页面替代应用。Cinema 未改片库、问题或推荐流程。
- 源码显示 Cinema 和 City 首页已有 Lab 返回链接；Puzzle 没有，使用浏览器 Back；City 深层页逐级返回。CultureBridge app.py/i18n.py 未发现 Lab 返回链接，远端未能核实。
- 所有生产域名仍被代理 CONNECT 403 阻断，未声称完成线上实际回路或实机测试。完整路径、源码 SHA、跨仓库待办和截图在 docs/navigation-review.md。
