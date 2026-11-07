# Ember Lab

Ember 的独立交互实验室。当前是作品集合与导航网站，不包含三个未来实验的功能，也不重新实现 CultureBridge。

零运行时依赖，使用原生 HTML/CSS/JavaScript；Node.js 22+ 只用于构建和本地服务。无需数据库、登录、API 密钥、外部字体或第三方脚本。

## 本地运行

```sh
cd /workspace/ember-lab # 其他机器进入实际克隆目录
npm run dev
```

服务默认使用 4173 端口，`PORT=8080 npm run dev` 可改端口。`dev`/`start` 在启动时构建一次；修改源码后重启服务，或另一个终端运行 `npm run build` 刷新产物。没有自动热更新。

```sh
npm run build # 生成可独立托管的 dist/
npm test      # Node 内置测试，无需 npm install
```

可选浏览器验证（开发工具，不是应用依赖）：安装 Python Playwright 并提供 `/usr/bin/chromium`，先启动本地服务，再运行 `python tests/browser.py`。截图和报告默认存于 `/tmp/ember-lab-checks`，可用 `LAB_TEST_OUTPUT` 修改。该检查同时从 `assets/og.svg` 导出 `assets/og.png`；修改 OG 源图后重跑并构建。已提交的 PNG 不需要在部署时重生成。

## 目录

```text
ember-lab/
├── index.html                 # 页面模板、语义结构、SEO
├── experiments.js             # 唯一项目数据入口
├── assets/
│   ├── ember-tokens.css        # 主站共享 token 原样副本
│   ├── lab.css                 # Lab 布局、组件、响应式
│   ├── lab.js                  # 可选状态筛选增强
│   ├── favicon.svg             # 临时字母 e 标识
│   └── og.svg / og.png         # 本地分享图源文件及导出图
├── scripts/
│   ├── render.mjs              # 数据校验、卡片及 Featured 生成
│   ├── build.mjs               # 构建静态页面
│   └── serve.mjs               # 本地 HTTP 服务
├── tests/                     # 配置/构建测试和浏览器检查
├── docs/
│   ├── design.md               # 主站规范对应、素材与链接证据
│   ├── ember-design-system-source.md
│   ├── deployment.md           # Vercel、DNS、后续接入
│   └── validation.md           # 本轮验证记录
├── vercel.json
└── dist/                      # 生成目录，不提交
```

## 管理项目

编辑 `experiments.js`，每项包含 `id / title / description / category / status / url / preview / tags`。`category`、`tags` 是数组；`url` 为 `null` 或验证后的 HTTPS 地址。`subtitle`、`connectionNote`、`repository` 可选。保持一个项目 `featured: true`。

状态值：`live`、`existing`、`in-development`、`planned`，界面显示 Live、Existing Project、In Development、Planned。仅 `live`/`existing` 且 URL 非空时生成访问链接；开发中或规划中项目不得填 URL。Live 缺 URL、重复 id、不安全地址或未知状态会使构建失败。

`preview` 是概念视觉键，不是伪造截图。已有 `bridge / puzzle / cinema / city`，新键使用通用视觉。新增配置项会自动加入网格、数量和对应状态筛选，不用改首页组件。若未来使用真实截图，应另扩展渲染器并添加图片替代文字。

本地不收集访客数据，不用 cookies 或浏览器存储。筛选只影响当前页面，不发送网络请求。禁用 JS 时仍展示完整项目和导航。

部署和接入步骤见 [docs/deployment.md](docs/deployment.md)，设计来源见 [docs/design.md](docs/design.md)。本轮未推送 GitHub、未部署 Vercel、未绑定正式域名。
