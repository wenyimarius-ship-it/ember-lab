# Ember 当前入口与托管归属

核对日期：2026-11-07。统一入口是保持同一作品在主站、Lab Featured、项目卡片和 INDEX 中使用同一个真实 URL；不意味着把 Streamlit 应用迁移到 Vercel，也不新建未经授权的域名。

| 页面 | 当前对外入口 | 托管归属与证据 |
| --- | --- | --- |
| Ember 主站 | https://www.mariustang.com/ | 现有 Vercel 主站项目；不改变已有域名/重定向 |
| Spaces | https://www.mariustang.com/spaces/ | 主站的静态子页面 |
| Ember Lab | https://lab.mariustang.com/ | 独立 Vercel ember-lab 项目，域名已由用户配置 |
| CultureBridge | https://culturebridge-dwbxqchgzdremscutzk5eh.streamlit.app/ | 官方仓库 README 的在线演示地址，部署说明为 Streamlit Cloud，入口 app.py |

CultureBridge 仓库：`wenyimarius-ship-it/culturebridge`，本轮只读检查提交 `0d057f6d8f6c3b971b89d011a7af44d2fdf8ebd5`。

- README 第 7 行给出在线地址；“部署到 Streamlit Cloud”章节指定仓库、app.py 与 Streamlit Secrets。
- 仓库为 Python / Streamlit 应用，没有 package.json 或 vercel.json；未发现 Vercel 迁移证据。
- 用户明确确认此网站可以打开；据此接入 Lab，保持 Existing Project 标签，不再显示未接入。主站现有原型入口已经使用这个完全相同的 URL，无需更改主站作品逻辑。
- 本环境请求 Streamlit 仍被代理 CONNECT 403 拦截，无法独立复验在线功能、服务器实例或运行时环境变量；不将代理限制解释为站点失效。
- 不读取/更改 CultureBridge 的 APP_URL、Secrets、服务器、存储或源码。如果未来发现另一个真实部署，应先核实账号与部署证据，再决定是否替换统一入口。

## 为什么线上仍是旧 Lab 导航

本轮开始时 GitHub Lab `main` 仍为初始提交 `2462c60`；完整导航修复 `149e8e4` 只在 `fix/lab-navigation-i18n`（PR #1）。本次 CultureBridge 接入追加到同一分支，合并一次即可同时交付导航与链接。主站 Spaces 修复已在 `main` 的合并提交 `e92c3a2` 中。

本地构建、分支推送、PR 合并与 Production 部署是不同状态。只有 Lab 修复进入实际生产分支，并且对应 Vercel Production 部署完成，线上才会显示新导航。本轮没有绕过 PR 直接修改默认分支或触发生产发布。
