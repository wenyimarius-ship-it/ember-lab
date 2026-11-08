# 独立部署及未来接入

本轮只交付代码与验证，不触发部署、域名绑定、DNS 或重定向操作。

## GitHub

在 `feat/ember-lab-phase-2` 本地分支提交本轮代码。推送前确认仓库为 `wenyimarius-ship-it/ember-lab`，随后可执行：

```sh
git push -u origin feat/ember-lab-phase-2
```

在 GitHub 审阅并合并到 `main`。仓库最初为空，没有 main；首次建主分支时可在确认后通过 GitHub 设置或将此提交推为 main，不要强推或覆盖其他提交。当前本地提交不等于远端已保存。

## Vercel 独立项目

1. 登录正确 Vercel 账号/团队，先检查是否已有 Ember Lab 项目；优先使用现有项目，避免重复创建。
2. 在允许部署时，导入 `wenyimarius-ship-it/ember-lab`，项目目录为仓库根目录，Framework Preset 选 **Other**，Node.js 选受支持的 22.x 或更高版本。
3. Build Command：`npm run build`，Output Directory：`dist`。本项目没有依赖，可将 Install Command 设为 `npm install --ignore-scripts --no-audit --no-fund`，或使用 Vercel 默认安装；不需要密钥；`SITE_URL` 是可选非秘密配置。仓库的 `vercel.json` 已指定构建、输出及安全响应头。
4. 先使用 Vercel 分配的项目地址验证。检查根页面、favicon、OG PNG、导航、状态筛选、320px 布局、无 JS 页面与不存在路径的 404。不要给卡片补未上线的链接。
5. 项目确认后选择实际生产分支。此过程只部署 Lab，不连接主站的 Vercel 项目，不改主站域名与重定向。

首页与 `/about/` 构建时使用 `SITE_URL` 作为 canonical、OG 和 Twitter Card 中绝对地址的来源，默认 `https://lab.mariustang.com`。`SITE_URL` 必须为 HTTPS 源地址，且无需配置 Vercel 部署域名变量。分享图随 `dist/assets/og.png` 发布。

## 未来绑定 lab.mariustang.com（说明，未执行）

1. 确认 Lab 预览/项目域名已通过验收，并取得绑定正式子域名的授权。
2. 在 **Lab 项目** Settings → Domains 添加 `lab.mariustang.com`，记录 Vercel 当时显示的准确 DNS 目标。不要添加或移动 `www.mariustang.com`、根域或其他现有域名。
3. 在 Porkbun 的权威 DNS 中，针对主机名 `lab` 添加 **CNAME**，目标填 Vercel 提供的准确值（常见为 `cname.vercel-dns.com` 或项目专属目标，以控制台为准），TTL 可用默认值。先检查 `lab` 是否已有 A/AAAA/CNAME；有冲突时停止核实，不盲目删除。若 Vercel 要求域名所有权验证，再按其提供的名称和值添加指定 TXT。
4. 不修改 nameserver，不开启 Cloudflare 代理，不改现有 A/AAAA、www 记录、重定向或其他 Vercel 域名绑定。
5. 等待 DNS 生效，核查 Vercel 域名验证与 TLS 证书成功，实际请求 HTTPS 页面及静态资源。设置 `SITE_URL` 为正式 HTTPS 源地址并重新部署，核查 canonical、og:url、og:image 和 twitter:image 并复验。DNS 生效前不要把规划地址当已上线链接分享。

## 后续接入三个独立作品

| 项目 | 独立仓库 |
| --- | --- |
| Idea Puzzle | `wenyimarius-ship-it/ember-idea-puzzle` |
| Cinema Experiment | `wenyimarius-ship-it/ember-film-experiment` |
| City Observation Desk | `wenyimarius-ship-it/ember-city-observer` |

1. 在各自仓库独立开发和部署，Lab 不嵌入它们的源码、依赖或服务。各作品可以有自己的设计。
2. 验证实际部署 URL、移动端和核心交互；访问登录页、404 或占位页面不算上线。
3. 修改 Lab 的 `experiments.js` 对应条目：`status: 'live'`、`url: 'https://真实部署地址'`，按实际功能更新描述和 tags。计划中的功能不要继续写成已实现。
4. 执行 `npm test`、`npm run build`，运行网站检查新入口。现有浏览器测试中“全体不可点击”和筛选数量断言对应本轮四项目初始状态，接入上线项目时应同步更新为新预期。
5. 将 Lab 的变更单独提交与部署。主站是否新增 Lab 入口是另一项独立任务，不在此处修改 Spaces 或主站导航。

新增第五个及以后项目时，在配置数组追加唯一 id 的对象即可。`preview` 未匹配现有视觉键时自动使用通用图形；数量、卡片和状态筛选来自数据，不需复制页面组件。
