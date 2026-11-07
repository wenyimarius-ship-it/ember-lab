# 2026-11-08 · 紧凑作品目录审阅

状态：仅独立分支 `feat/lab-entry-navigation` 的本地草稿。未推送 main、未部署、未修改 DNS 或任何独立作品源码。

## 可点击预览

当前环境的本地服务端口为 **4174**：

- `/review/`：目录版与现版快照并排，可在各自面板内点击，也可全屏打开。
- `/`：新目录版。
- `/about/`：长介绍、原有 Featured、档案和联系内容。
- `/review/current/`：改动前 `4131461` 的完整首页快照，使用其原有 JS/CSS，避免拿新样式冒充旧版。

重新启动：

```sh
PORT=4174 npm run review
```

`npm run review` 从本仓库的已存在提交生成 `.review/current`，不联网拉取额外仓库，不改历史提交。`/review/` 只由本地开发服务器提供，不包含在 `dist/` 中，不会部署成正式站点的新入口。

可另运行 `node scripts/export-preview.mjs`，将已经构建的新旧页面导出为 `.review/preview/` 内的自包含 HTML，支持复制后用普通本地 HTTP 服务打开。该导出已在本地 HTTP 中验证；本环境浏览器禁止 `file://`，没有把该协议的打开结果记为通过。

## 这版首页

- 四张整卡链接，顺序 Cinema → City → Puzzle → CultureBridge；卡片只有名称、一句真实玩法和箭头。
- 桌面两列，手机一列；大点击区域、可见键盘焦点。不复制四个小按钮或让用户先读长介绍。
- 手机 390×844 首屏能看到四张作品卡；320px 也能直接看到入口，不先经过 Hero 大图或 Featured。截图为浏览器视口，不等于手机实机。
- 首页没有跳往同页后方段落的“进入”按钮；除跳到内容的无障碍链接外，入口都是真实作品地址或独立介绍页。
- 作品在当前标签页打开。没有站内返回入口的作品，可以直接浏览器返回目录，再进入另一件；不会因新开标签页失去返回历史。
- 完整介绍移至 `/about/`，该页固定导航和开头均有回目录入口。
- 保留 Ember tokens、中英文切换、INDEX、联系和主站／Spaces 链接。修正 INDEX 的 Tab 循环，避免焦点离开弹窗。

## 入口核对

以下地址与当前 main 配置以及用户此前确认的正式地址一致，全部保持不变：

| 作品 | Lab 中的真实入口 | 维护方式 |
| --- | --- | --- |
| Cinema Experiment | https://ember-film-experiment.vercel.app | 独立仓库 ember-film-experiment、独立 Vercel 站点 |
| City Observation Desk | https://ember-city-observer.vercel.app | 独立仓库 ember-city-observer、独立 Vercel 站点 |
| Idea Puzzle | https://ember-idea-puzzle.vercel.app | 独立仓库 ember-idea-puzzle、独立 Vercel 站点 |
| CultureBridge | https://culturebridge-dwbxqchgzdremscutzk5eh.streamlit.app/ | 独立 culturebridge 仓库、Streamlit 应用 |

本轮对五个生产域名（包括 Lab）的请求均被环境代理 CONNECT 403 拦截。这不是站点失效的证据，但阻止了独立线上验收。没有更换 URL、改部署保护、开代理或创建替代正式站点。

## 返回入口与跨仓库待办

只读检查的源码快照：

| 作品 | 快照 HEAD | 已查到的返回入口 | 待跨仓库处理 |
| --- | --- | --- | --- |
| Cinema | `805d2b19319747c91b62e09766f1991c4701022c` | `index.html:15` 的固定 `#lab-link`，指向 `https://lab.mariustang.com/` | 暂无必要改动；不改片库、题目、单片推荐和换片流程 |
| City | `d7ac9bd2cc6e84088f82d29b39f1e52c38484428` | `index.html:25` 有 `← Ember Lab`；record 返回试玩，desk 返回 record | 若要所有页面统一“一步返回”，在 `record.html`、`desk.html` 增加直接返回 Lab 的次级链接，保留现有流程返回 |
| Puzzle | `a521819733ef9eed91a494966ba8a1deb22e41f4` | `src/main.js:26` 的 header 仅品牌、保存提示、帮助；未发现 Lab 外链 | 在该仓库 header 添加最小 44px 的「返回 Ember Lab」，不干扰画布、拖拽或本地保存；本轮只能用浏览器返回 |
| CultureBridge | `0d057f6d8f6c3b971b89d011a7af44d2fdf8ebd5` | app.py / i18n.py 未发现 Lab 返回链接 | 需先核实实际部署版本；若确实缺少，在其 Streamlit 页面提供明确返回链接。本轮未运行需服务端环境的 Streamlit 应用 |

这些源码快照尚未与各生产部署的提交 SHA 对齐，因此只证明快照中存在／缺少入口，不将其表述为线上已经逐页检查。三个静态作品的源文件在验收后仍与各自 HEAD 一致，未修改这些仓库或把它们合并进 Lab。

## 实际走通的路径与边界

`tests/navigation_audit.py` 在 390px（触屏模拟）和 1440px 下加载这些仓库的实际 HTML/JS/CSS，并在浏览器中点击：

| 路径 | 返回方式 | 结果 |
| --- | --- | --- |
| 目录 → Cinema → 目录 → City | Cinema 的页面内返回链接 | 本地源码快照通过；回目录即可选下一件 |
| 目录 → City → 目录 → Puzzle | City 首页的页面内返回链接 | 本地源码快照通过 |
| 目录 → Puzzle → 目录 → Cinema | **浏览器 Back** | 本地源码快照通过，无需滚回长页面找按钮 |
| City desk → record → City 首页 → Lab 目录 | 原有逐级返回链 | 本地源码快照通过；缺少一步直返是跨仓库待办 |
| 目录 → CultureBridge → 返回目录 | 当前可用浏览器 Back；应用内返回未知 | **未走通线上路径**：生产域名被代理拦截，未用假页面替代 Streamlit |

快照验收按真实生产 origin 映射本地文件响应，Lab 则加载当前本地构建；独立作品运行了它们自己的界面脚本，不是填充“返回 Lab”的模拟页面。该方法只验证导航结构和当前源码，不能验证 Vercel／Streamlit 服务、TLS、Production 版本或网络可达性。

## 本轮验证

- `npm run build` 成功，输出 `dist/index.html` 与 `dist/about/index.html`。
- `npm test`：16 项通过，包含无死链接、整卡同标签导航、目录排序、长介绍分离及双语转义。
- Lab 浏览器：320 / 390 / 700 / 1440px，目录和介绍页无横向溢出，首屏可见入口，语言、刷新、键盘、INDEX、回目录及无 JS 内容通过。
- 390 / 1440px 的独立静态作品源码快照导航回路通过，无页面 JS 异常。
- 本地 `/review/` 的两个 iframe、独立新旧页面和所用资源均已加载检查。
- 原始报告在 [previews/results.json](previews/results.json) 和 [previews/source-navigation.json](previews/source-navigation.json)。

## 截图

- [手机 390px 目录版](previews/directory-390.png)
- [手机 320px 目录版](previews/directory-320.png)
- [手机 390px 改动前首屏](previews/before-390.png)
- [桌面目录版](previews/directory-1440.png)
- [桌面可点击对照界面](previews/comparison-1440.png)

保持可审阅状态；未推送、未合并、未触发生产发布。
