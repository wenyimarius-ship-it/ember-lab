# Ember Lab

Ember 的独立作品目录。首页让访客直接进入 Cinema、City、Puzzle 和 CultureBridge；作品保持独立站点、独立源码与现有玩法。详细介绍位于 `/about/`。

零运行时依赖，原生 HTML/CSS/JavaScript。Node.js 22+ 仅用于构建与本地服务；无需数据库、账号、密钥、外部字体或第三方脚本。

## 运行与审阅

```sh
npm run dev       # 本地端口默认 4173，启动时构建一次
npm run build     # 生成可独立部署的 dist/
npm test          # Node 内置测试
```

修改后运行 `npm run build` 或重启 dev，没有自动热更新。

本轮目录草稿与旧首页的本地对照：

```sh
PORT=4174 npm run review
# 开发服务的 /review/ 是并排可点击对照；/ 为目录版；/about/ 为介绍。
```

`npm run review` 从已存在的历史提交生成 `.review/current`，本地比较路由不进入生产 `dist/`。可运行 `node scripts/export-preview.mjs` 生成 `.review/preview` 的自包含对照文件，供普通本地 HTTP 服务使用。

本轮入口、源码快照回路、手机截图、生产访问限制与跨仓库待办见 [docs/navigation-review.md](docs/navigation-review.md)。

## 结构

```text
index.html                     紧凑目录模板
pages/project-notes.html        独立作品介绍模板
experiments.js                 统一项目配置、正式 URL、简短玩法和顺序
assets/                        Ember tokens、样式、语言/INDEX 增强、favicon/OG
scripts/render.mjs             安全渲染目录及介绍卡片
scripts/localize.mjs           界面双语文本
scripts/build.mjs              构建两个静态页面
scripts/serve.mjs               本地 HTTP 服务及仅本地的比较路由
scripts/prepare-review.mjs      改动前的可重现快照
scripts/export-preview.mjs      自包含比较文件导出
scripts/review.html             仅本地的比较界面
tests/                         Node、Lab 浏览器、跨站源码快照导航检查
docs/                          设计来源、部署步骤、导航审阅和截图
vercel.json                    独立静态部署配置
dist/                          生成产物，不提交
.review/                       本地审阅产物，不提交
```

## 项目配置

每项至少有 `id / title / description / category / status / url / preview / tags`；状态为 `live`、`existing`、`in-development` 或 `planned`。只有 live/existing 且有真实 HTTPS 地址时生成可点击入口，开发中项目 URL 必须为空；构建会拒绝不安全地址、重复 ID、无 URL 的 Live 和不支持的状态。

目录用 `entryDescription`、`entryDescriptionEn` 保存一句具体玩法，用 `entryOrder` 决定顺序；新增项目只需追加配置。介绍页继续使用 description、descriptionEn、tags 和概念视觉；它们不是产品截图。`featured: true` 保持且仅保持一个项目。

首页每张卡是单个语义化链接，**当前标签页**进入独立作品；在独立作品内返回，或使用浏览器返回。Lab 无法跨域给独立应用注入返回导航。当前源码中 Cinema 和 City 首页有返回，Puzzle 需要浏览器返回；跨仓库改动应独立审阅。

默认中文，`EN / 中` 整页切换；英文选择保留在 URL 的 `?lang=en`，不使用 cookies 或 localStorage。INDEX 支持键盘循环、Esc、关闭和焦点恢复。关闭 JS 时目录仍可点击、中文仍可读。访客输入不发送给外部服务。

## 浏览器检查

需要 Python Playwright 和系统 `/usr/bin/chromium`（开发工具，不是应用依赖）：

```sh
LAB_TEST_URL=http://127.0.0.1:4174 python tests/browser.py
```

源码快照回路是可选审阅辅助，不属于普通构建前置条件。准备 cinema/city/puzzle 的只读 checkout 后，先在 puzzle 执行 `npm ci`、`npm run build`，再运行：

```sh
LAB_AUDIT_SOURCES=/tmp/ember-nav-audit LAB_TEST_URL=http://127.0.0.1:4174 python tests/navigation_audit.py
```

此检查加载真实源码文件，但不代表 Production 版本、TLS 或网络已经验证，详见审阅记录。

独立 Vercel 配置与未来域名操作说明见 [docs/deployment.md](docs/deployment.md)；设计来源见 [docs/design.md](docs/design.md)。本轮只做本地审阅，不部署、不改 DNS 或其他仓库。
