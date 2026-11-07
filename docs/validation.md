# Phase 2 验证记录

验证日期：2026-11-07。运行环境：Linux、Node.js 24.22.1、Chromium（Playwright 自动化）。本轮没有部署到公网，也没有手机实机测试。

## 当前通过

- `npm run build`：生成 4 个项目的静态 HTML 和本地资源。
- `npm test`：配置、发布链接限制、重复 id、状态校验、数据 HTML 转义、扩展项回退视觉和静态内容及部署元信息测试共 8 项通过，0 失败、0 跳过。
- `npm run dev`：构建后独立启动 HTTP 服务；首页 200，OG PNG 200，未知路径 404。
- 浏览器 320 / 390 / 700 / 1440px：无页面横向溢出，项目标题不裁切；检查桌面两列、手机单列截图。
- 已有项目 / 开发中 / Live / Planned / 全部筛选、空状态返回全部：结果及数量正确。
- 所有内部锚点有对应元素；固定导航下的章节定位正常；当前四项目不生成访问链接。
- Tab 跳到内容、Enter 激活跳转及筛选、aria-pressed 状态和 aria-live 提示可用。
- reduced-motion 下禁用平滑滚动；关闭 JavaScript 后四项目内容与导航保留、筛选控件隐藏。
- 页面资源全部同源，没有运行时外部字体、脚本或图片请求，没有浏览器 JS 异常。
- 1200×630 OG PNG 已生成并提交，favicon 为本地 SVG。
- axe-core WCAG 2 A/AA、2.1 AA 自动检查：320 / 1440px 各 23 项通过，0 个确认违规；`color-contrast` 包含需人工判断项（装饰层/复杂背景），不能称为完整 WCAG 认证。正文使用主站高对比 tokens，装饰画不传递唯一信息。

截图及 JSON 原始报告在本实例 `/tmp/ember-lab-checks/`，不作为网站运行依赖。可通过 `python tests/browser.py` 重现主要浏览器检查（需额外的 Python Playwright 和系统 Chromium）。axe 工具仅安装在 `/tmp/ember-lab-tools`，没有加入网站依赖。

## 检查中修复

- 320px 下 Featured 网格子项默认最小宽度导致长标题裁切：子项设置 `min-width:0`、标题换行与小屏字体调整。
- 平滑滚动的浏览器断言起初过早读取位置：等待滚动完成后检查，未通过减少导航功能规避测试。

## 未验证与限制

- CultureBridge：主站找到真实历史地址，但环境代理 CONNECT 403，不能核实应用；保持 Existing Project、URL 为空。
- Ember 主站线上页面本轮未做完整外链功能测试；视觉来源是成功读取的主站仓库文件及对应提交。
- Vercel 部署、正式域名 DNS/TLS、社交平台分享抓取、手机实机、Safari/Firefox、完整读屏流程未执行。
- Vercel 响应头由 `vercel.json` 配置，本地 Node 服务不模拟全部平台响应头，需部署验收时确认。
- 未把未上线的三个实验标记为 Live，未实现它们的功能。
