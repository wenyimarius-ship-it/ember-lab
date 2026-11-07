# 视觉来源与对应

参考仓库：`wenyimarius-ship-it/ember-personal-site`，只读克隆至环境临时目录。参考提交：`f66710f627b251aae09c8af16d540d21ab6d1281`。

已读取 `docs/ember-design-system.md`、`assets/ember-tokens.css`、首页最终样式结构以及 `spaces/spaces.css`、`spaces/spaces.js`。没有修改主站文件，也没有复制主站交互应用或内嵌截图。

| 主站规范 | Lab 实现 |
| --- | --- |
| 背景 #111322、文字 #f3f2ee、次文字 #b3b3c4 | `ember-tokens.css` 原样复用 |
| 紫色 #c3b1ff、绿色 #d0fc88 | 品牌、标签、标题及主操作 |
| serif 品牌和项目名、sans 标题和正文、mono 标签 | 沿用字体栈；不联网下载字体，实际使用 Georgia / 系统 sans / monospace 回退 |
| 原型浅绿 #e3edcf、Spaces 深底 #1a1c2c | CultureBridge 概念视觉、项目卡片 |
| Spaces 16px 卡片圆角、1px 边框、桌面 28px 间距 | 两列项目网格；手机单列、20px 间距、24px 内边距 |
| 原型面板 20px 20px 20px 2px | Featured 面板 |
| primary 12px 圆角、绿色底、实色投影 | 探索实验按钮 |
| 2px 强调色焦点、偏移 5px、跳转内容 | 链接、按钮、主内容焦点；键盘可操作筛选 |
| 容器最大 1500px；桌面左右 72px、1050px 以下 45px、700px 以下 20px | 同断点和容器 |
| 桌面固定 76px 导航 | 桌面一致；手机为保留三个入口改成 84px 两行，避免 320px 挤压 |
| reduced-motion | 禁用平滑滚动和过渡 |

主站没有独立的全局浅色模式；观察区浅色只是局部组件，因此 Lab 不新增主题切换。Lab 概念图使用 CSS 图形，清楚标注“概念示意”，不是产品运行截图。favicon 为临时 serif 字母 e，非新的品牌标志。

## CultureBridge 地址证据

主站 `PROJECT_CONTEXT.md` 及首页真实外链记录：
`https://culturebridge-dwbxqchgzdremscutzk5eh.streamlit.app/`

初始阶段该 URL 被环境代理 CONNECT 403 拦截，曾显示待接入。2026-11-07 用户确认可用后，已只读核实 CultureBridge 官方仓库 README 与部署说明，并接入同一个 Streamlit 地址。Lab Featured、项目卡片、INDEX 和主站原型入口统一使用该 URL。本环境仍无法独立验证远端运行情况；证据与托管归属见 [site-addresses.md](site-addresses.md)。

GitHub 页脚仓库地址使用现有 origin，已用只读 Git 操作确认访问成功。未来三个独立仓库名来自用户规划，未把它们作为已上线应用链接。
