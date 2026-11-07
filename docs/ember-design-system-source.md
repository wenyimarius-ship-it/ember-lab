# Ember 视觉规范（第一阶段）

以当前 `index.html` 最终生效样式为准；首页有多层历史 CSS 覆盖，不应只读取第一段 `:root`。本阶段只共享基础 token，没有重写首页组件。

## 基础色彩

共享入口：`assets/ember-tokens.css`，首页和 Spaces 均引用。

| Token | 当前值 | 用途 |
| --- | --- | --- |
| `--bg` | `#111322` | 深蓝黑页面背景 |
| `--ink` | `#f3f2ee` | 深底主文字 |
| `--muted` | `#b3b3c4` | 次要说明 |
| `--line` | `#3d4054` | 深底边框、分隔线 |
| `--accent` | `#d0fc88` | 主操作、焦点、Live |
| `--ember-lilac` | `#c3b1ff` | 品牌紫（从首页品牌色命名提取） |

首页观察区另有局部浅色 token：背景 `#e5e6db`、文字 `#253b35`、线条 `#bcc7b9`、次文字 `#5d7166`、强调 `#465c41`。不要把深底文字 token 直接套到浅底。首页原型面板最终背景为 `#e3edcf`，抽屉为 `#211e34`；Spaces 卡片使用深底 `#1a1c2c`。这些是组件颜色，并非新增的全局主题。

## 字体与层级

- 正文 `--sans`：DM Sans → PingFang SC → Microsoft YaHei → sans-serif，基础 14px / 1.8；说明文字通常 11–14px。
- 品牌、项目名 `--serif`：Instrument Serif → Georgia → serif；品牌 24px，项目名约 42–66px。
- 索引、小标签 `--mono`：DM Mono → monospace，通常 10px / 1.6，字距 1.4px。
- 首页主标题最终使用 sans，54–88px / 1.2；章节标题 34–57px / 1.3。Spaces 使用章节级标题，手机端 34px / 1.4。
- 中文使用系统字体；Google Fonts 是可选联网资源，失败时保持回退，不应阻塞正文或交互。

## 按钮、卡片与交互

- 首页 `.primary`：绿色底、深色字、14px/600、17px 24px 内边距、12px 圆角；下方 6px 实色投影，hover 上移 3px，按下下移 3px。
- `.text-link` / `.secondary`：文字配细下划线与方向箭头。Spaces 的访问入口沿用此语汇，最小高度 44px。
- 主要边框为 1px；不把所有组件强行统一圆角。现有 `.lab` 为 `20px 20px 20px 2px`，ATU 胶囊为 50px；Spaces 卡片为 16px，状态胶囊为 999px。
- Spaces：桌面两列、28px 间距、卡片内边距 30px；手机一列、20px 间距、24px 内边距。Live 与 Coming Soon 用文字区分，不能只依赖颜色；规划中的站点不生成链接。
- 焦点沿用 2px 强调色轮廓，偏移 5px。保留键盘操作与真实链接语义；避免用可点击 div 模拟按钮。新页面提供跳到内容链接。
- 首页已有 reduced-motion 覆盖，禁用动画、平滑滚动与过渡；独立 Lab 若增加动画须沿用该可访问性约定。

## 导航、容器与页脚

- 容器最大宽 1500px；桌面宽 `calc(100% - 144px)`。
- 顶栏固定，高 76px，横向内边距 44px，背景 `#111322ed`，15px 模糊与细边框。手机高 64px、内边距 20px；内容需为固定导航留出顶部空间。
- 品牌为紫色 serif 斜体；普通导航约 11px。首页保留原索引按钮、语言切换与章节侧栏；新增 Spaces 在手机仍可见。Spaces 页通过作品、关于和品牌链接返回主站，并用 `aria-current="page"` 标记当前入口。
- 页脚为小号 mono、次要文字、弹性换行，包含版权、联系及返回起点。Spaces 添加细顶边框；沿用首页联系信息。

## 响应式

| 断点 | 当前主页约定及复用方式 |
| --- | --- |
| >1050px | 多列布局、容器左右各约 72px |
| ≤1050px | 容器 `calc(100% - 90px)`、顶栏横内边距 28px |
| ≤700px | 容器 `calc(100% - 40px)`、主内容单列、隐藏章节侧栏；首页原普通导航隐藏，Spaces 入口保留 |
| ≥1600px | 首页部分章节垂直居中、容器局部改为左右各 80px；不是所有页面必须采用 |

测试包含 1440、700、390、320px 浏览器视口；这不等于手机实机测试。长地址使用 `overflow-wrap:anywhere`，网格列使用 `minmax(0,1fr)`，防止横向溢出。

## 独立 Ember Lab 如何复用

1. 后续单独创建仓库时，复制本文件及 `assets/ember-tokens.css`，注明来自主站的提交版本。当前不创建 Lab 仓库。
2. 用该 CSS 的变量建立 Lab 的基础主题；按实际技术栈将导航、按钮和卡片封装为组件，不复制首页的大段历史覆盖 CSS 或内嵌图片。
3. 将字体回退、焦点、移动断点及 reduced-motion 规则带入 Lab；保证独立构建和运行，不运行时依赖主站内部文件路径。
4. 新实验自行管理功能和内容。准备上线后再由主站 `spaces/spaces.js` 新增/更新数据；只有真实上线时才设 `status: 'live'` 和 `url`。

## Spaces 扩展

独立静态页面位于 `spaces/index.html`，本地 HTTP 服务可直接打开 `/spaces/`，无需框架路由或重定向配置。`spaces/spaces.js` 的 `spaces` 数组管理 `name`、`category`、`description`、`address`、`status`、`url`。新增数组项即可新增卡片；状态使用 `live` 或 `coming-soon`，规划项保持 `url: null`。DOM 使用 `textContent` 写入内容，不解析数据中的 HTML。
