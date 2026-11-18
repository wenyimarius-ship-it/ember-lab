# Ember Lab · 灵感与交互作品

Ember Lab 把四个网页实验串成可滚动浏览的作品首页。[首页](https://lab.mariustang.com/)用柔和弧光连接原创抽象图案，提供具体的中文索引和体验入口；[项目介绍](https://lab.mariustang.com/about/)保留完整玩法背景。滚动时图案保持稳定，停稳后只有当前图案轻微变化。折叠的创作记录为设计示意，不代表经过核实的版本历史。

| 作品 | 体验 |
| --- | --- |
| [Cinema Experiment](https://cinema.mariustang.com/) | 回答三个关于故事的问题，获得一部电影与推荐理由 |
| [City Observation Desk](https://city.mariustang.com/) | 试玩两条示意路线，或记录自己的路线 |
| [Idea Puzzle](https://puzzle.mariustang.com/) | 把想法写成卡片，分组并选出下一步 |
| [CultureBridge](https://culturebridge-dwbxqchgzdremscutzk5eh.streamlit.app/) | 创作文化短帖、核对语境并收集读者反馈 |

## 本地构建与验证

需要 Node.js 22 或更高版本。Node 负责构建和本地服务，产物是原生 HTML、CSS 和 JavaScript，无应用运行时依赖。

```sh
npm run dev
npm test
npm run build
```

本地默认端口 4173，`/` 为作品首页，`/about/` 为作品介绍。开发服务启动时构建一次，修改后重新构建或重启即可。服务运行时执行 `python tests/browser.py` 可验证四种宽度、双语、键盘、弧光导航和无 JavaScript 页面。跨站源码快照准备方法见 [导航审阅记录](docs/navigation-review.md)，该方法不代表线上可用性测试。

## 如何维护目录

- [experiments.js](experiments.js) 是作品配置，介绍页使用长描述、标签及概念视觉。新首页的短文案和体验链接在 [index.html](index.html) 与 [assets/flow/app.js](assets/flow/app.js) 中维护；现有测试核对四个体验链接与目录配置一致。保持恰好一个 `featured: true`。
- [index.html](index.html) 和 [pages/project-notes.html](pages/project-notes.html) 是模板。[scripts/build.mjs](scripts/build.mjs) 与 [scripts/render.mjs](scripts/render.mjs) 校验配置并生成页面。
- [assets/flow/](assets/flow/) 包含新首页的图案、弧光、动静态配合和双语交互；原有样式和脚本继续用于介绍页。[tests/](tests/) 包含构建、动效逻辑和浏览器检查。
- `live`、`existing` 项目只有配置真实 HTTPS 地址时才有外链。开发中和规划项保留介绍。构建检查重复 ID、无效状态及不安全地址。

## 部署与边界

Vercel 的 `ember-lab` 项目绑定正式域名 `lab.mariustang.com`。[vercel.json](vercel.json) 指定 `npm run build`，发布 `dist/`。无需密钥或数据库。canonical、og:url 和绝对分享图片地址默认使用 `https://lab.mariustang.com`，本地及预览构建均不读取 `VERCEL_URL`。可选 `SITE_URL` 接受纯 HTTPS origin，用于显式覆盖这些元数据。

首页默认中文，英文使用 `?lang=en`，与介绍页往返时保留语言，无需 Cookie。支持暂停动效和系统减少动态效果设置。关闭 JavaScript 仍能阅读中文并打开作品。体验入口在同一标签页打开外部作品，可通过作品内返回链接或浏览器返回。Lab 的 Live 状态来自目录配置，跨站体验与部署版本需分别核对。
