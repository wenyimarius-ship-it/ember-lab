# 已确认更新记录的代码库整合

- 基线：已上线的 Lab 弧光首页 `d50ba9e1dc23ea3101a9d955e5e75a964d49eac1`。
- 分支：`feat/lab-verified-updates`，未改 `main`，没有生产部署。
- 内容：以核实日期与公开提交替换四段示意历史，分开未知起点和未完成验证。
- 保留：正式分享元数据、作品 URL、about 页面、全部动画和分析逻辑、Vercel 配置。
- 来源：[日期证据](history-provenance.md)。

## 验证

- `npm test`：26/26 通过；`npm run build`：成功。
- `tests/browser.py`：320 / 390 / 700 / 1440px，双语与刷新、首个体验入口、目录键盘焦点、弧光前进返回、about 往返、无 JavaScript 与系统减少动态设置通过，无横向溢出或脚本错误。
- `tests/navigation_audit.py`：390 / 1440px 使用已有独立作品真实源码快照验证 Cinema / City 返回和 Puzzle 浏览器返回；没有把这些快照当作线上可用性验收。
- 另用临时浏览器检查四种宽度的中英真实日志展开：日期、公开来源、未完成事项、展开后无横向溢出和脚本错误均通过；未新增测试文件。
- 本地静态服务器的首页与 about 输出均保持唯一 canonical / OG 标签，`og:image` 使用 HTTPS 绝对地址。原模板 head 逐字保持不变。
- `assets/flow/thread.mjs`、`motion.mjs`、`experiments.js`、`assets/og.png`、`vercel.json` 与基线一致；`app.js` 从 `let paused` 起的全部交互、动画与分析逻辑逐字未改。
- `git diff --check`：通过。现有测试无需文字或结构适配，没有修改测试文件。

## 验证边界与后续

- 这是代码库独立分支整合；提交、推送与 PR 由主任务完成，没有合并 main 或执行生产部署。
- 浏览器检查是本地 Chromium 视口，尚未做真实手机、微信分享、生产缓存或跨站服务在线状态验收。
- 生产发布后再实测微信预览与缓存；本轮没有修改 DNS、Vercel 设置或分享图片路径。
