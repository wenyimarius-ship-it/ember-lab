# Ember Lab · 交互作品目录

Ember Lab 把独立网页实验整理成一个可直接打开的作品目录。[首页](https://lab.mariustang.com/)用于进入作品，[项目介绍](https://lab.mariustang.com/about/)保留玩法背景与概念视觉。个人主站的 Spaces 提供 Lab 入口，Lab 与个人主站分别部署。

| 作品 | 体验 |
| --- | --- |
| [Cinema Experiment](https://cinema.mariustang.com/) | 回答三个情境问题，获得一部电影与推荐理由 |
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

本地默认端口 4173，`/` 为目录，`/about/` 为作品介绍。开发服务启动时构建一次，修改后重新构建或重启即可。需要与旧首页并排审阅时运行 `npm run review` 并打开 `/review/`。它依赖 Git 历史，只用于本地。浏览器验证及跨站源码快照的准备方法见 [导航审阅记录](docs/navigation-review.md)。

## 如何维护目录

- [experiments.js](experiments.js) 是作品配置。首页使用 `entryDescription`、`entryDescriptionEn` 和 `entryOrder`，介绍页使用长描述、标签及概念视觉。保持恰好一个 `featured: true`。
- [index.html](index.html) 和 [pages/project-notes.html](pages/project-notes.html) 是模板。[scripts/build.mjs](scripts/build.mjs) 与 [scripts/render.mjs](scripts/render.mjs) 校验配置并生成页面。
- [assets/](assets/) 包含共享视觉样式、语言和索引交互。[tests/](tests/) 包含构建和浏览器检查。
- `live`、`existing` 项目只有配置真实 HTTPS 地址时才有外链。开发中和规划项保留介绍。构建检查重复 ID、无效状态及不安全地址。

## 部署与边界

Vercel 的 `ember-lab` 项目从本仓库 `main` 部署，核对到的 Production 记录为 READY（`acc22e7`）。[vercel.json](vercel.json) 指定 `npm run build`，发布 `dist/`。无需密钥或数据库。可选 `SITE_URL` 接受纯 HTTPS origin，用于 canonical 与分享元数据。未提供时构建可使用 Vercel 提供的 `VERCEL_URL`。

目录默认中文，英文使用 `?lang=en`，无需 Cookie。关闭 JavaScript 仍能阅读中文并打开作品。卡片在同一标签页进入外部作品，返回链接由各作品维护，或使用浏览器返回。Lab 的 Live 状态来自目录配置，跨站体验与部署版本需分别核对。
