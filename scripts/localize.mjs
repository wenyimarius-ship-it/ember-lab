import { escapeHTML } from "./render.mjs";

// Each pair is [Chinese, English]. Shared brand and project names stay unchanged.
const pairs = [
  ["04 / 联系", "04 / CONTACT"],
  ["语境", "CONTEXT"],
  ["连接", "CONNECTION"],
  ["文化 → 对话", "CULTURE → CONVERSATION"],
  ["假如？", "What if?"],
  ["连接。", "Connect."],
  ["试一试 ↗", "Try it ↗"],
  ["镜头 / 001", "FRAME / 001"],
  ["什么打动了你？", "WHAT MOVES YOU?"],
  ["实验作品", "Experiments"],
  ["关于实验室", "About Lab"],
  ["返回主站", "Back to Ember"],
  ["精选实验", "Featured Experiment"],
  ["全部实验", "All Experiments"],
  ["已有项目", "Existing Project"],
  ["开发中", "In Development"],
  ["已上线", "Live"],
  ["规划中", "Planned"],
  ["Ember / 交互实验室", "EMBER / INTERACTIVE LAB"],
  ["让想法成为体验", "IDEAS INTO EXPERIENCES"],
  [
    "交互实验、创意工具与 AI 探索的集合。",
    "A collection of interactive experiments,",
  ],
  [
    "在好奇中尝试，在动手中发现。",
    "creative tools, and AI-powered explorations.",
  ],
  ["给好奇一个动手的地方。", "A place to put curiosity into practice."],
  [
    "这里收集我的交互作品与 AI 实验，让零散的想法，慢慢成为可以体验的东西。",
    "A collection of my interactive work and AI experiments, turning scattered ideas into experiences you can try.",
  ],
  ["探索实验", "Explore experiments"],
  ["有些问题，", "Some questions"],
  ["适合动手", "are better"],
  ["寻找答案。", "built."],
  ["思考 → 制作 → 探索", "THINK → MAKE → EXPLORE"],
  ["[ 实验手记 / 001 ]", "[ LAB NOTES / 001 ]"],
  ["AI · 文化 · 日常好奇", "AI · CULTURE · EVERYDAY CURIOSITY"],
  ["从一个问题开始", "Start with a question"],
  [
    "视觉示意 · 展示项目主题与流程，非应用界面或运行截图。",
    "Concept illustration of the project and workflow, not an application screenshot.",
  ],
  [
    "一些已开始的探索，一些正在成形的想法。",
    "Some explorations have begun. Others are taking shape.",
  ],
  ["全部", "All"],
  ["已有项目", "Existing projects"],
  ["开发中", "In development"],
  [
    "这个分类暂时还没有项目。好想法，正在路上。",
    "No experiments in this category yet. More ideas are on the way.",
  ],
  ["查看全部实验 ↗", "View all experiments ↗"],
  [
    "卡片视觉为概念示意。项目上线并验证后，这里会开放真实体验入口。",
    "Card visuals are concept studies. Verified projects will have working links when released.",
  ],
  ["03 / 关于实验室", "03 / ABOUT LAB"],
  ["把想法，", "Turn ideas"],
  ["变成", "into"],
  ["可体验的东西。", "real experiences."],
  [
    "Ember Lab 是我的独立交互实验室。在这里，AI、互动叙事、个人观察与网页交互交汇，成为一个个小而具体的产品尝试。",
    "Ember Lab is my independent interactive laboratory, bringing together AI, interactive storytelling, personal observations, and web interaction in small, tangible product experiments.",
  ],
  [
    "每个实验从一个问题出发，也保留继续修改的空间。Lab 负责记录与连接；每件作品独立生长，拥有自己的功能、风格和节奏。",
    "Each experiment starts with a question and leaves room for revision. Lab documents and connects them; each work grows independently, with its own features, style, and pace.",
  ],
  ["回到 Ember，了解更多", "More about Ember"],
  ["保持好奇，动手创造。", "Stay curious. Make something."],
  ["返回主站 ↗", "Back to Ember ↗"],
  ["（新窗口打开）", "(opens in a new tab)"],
  ["生成", "Generate"],
  ["核验", "Review"],
  ["反馈", "Listen"],
  [
    "待接入 · 原型地址尚待验证",
    "Awaiting connection · prototype URL unverified",
  ],
  ["开发中 · 尚未上线", "In development · not released"],
  ["正在规划 · 尚未上线", "Planned · not released"],
  ["想法拼图", "A workspace for ideas"],
  ["电影选择实验", "A film decision experiment"],
  ["城市观察对照台", "A desk for city observations"],
  ["AI / 文化 / 内容", "AI / Culture / Content"],
  ["创意 / 交互", "Creativity / Interaction"],
  ["电影 / 选择 / 交互", "Film / Decision / Interaction"],
  ["城市 / 观察 / 对照", "City / Observation / Comparison"],
  ["AI 辅助创作", "AI-assisted creation"],
  ["文化语境", "Cultural context"],
  ["反馈闭环", "Feedback loop"],
  ["想法卡片", "Idea cards"],
  ["拖拽分组", "Drag and group"],
  ["本地保存", "Local saving"],
  ["情境选择", "Situational choices"],
  ["电影推荐", "Film recommendations"],
  ["推荐理由", "Recommendation reasons"],
  ["空间对照", "Space comparison"],
  ["个人观察", "Personal observations"],
  ["观察卡", "Observation cards"],
  ["跳到主要内容", "Skip to main content"],
  ["Ember Lab 首页", "Ember Lab home"],
  ["主导航", "Main navigation"],
  ["按项目状态筛选", "Filter experiments by status"],
  ["项目标签", "Project tags"],
  ["联系", "Contact"],
  ["邮件联系", "Contact by email"],
  ["站点索引", "Site index"],
  ["关闭索引", "Close index"],
  ["打开完整索引", "Open complete index"],
  ["切换为英文", "Switch to English"],
  ["起点", "Start"],
  ["作品", "Work"],
  ["关于", "About"],
  ["主站 ↗", "Ember Home ↗"],
  ["写封邮件，聊聊想法。", "Send an email. Let’s talk ideas."],
  ["实验档案", "Experiment archive"],
  [
    "已上线的作品可打开体验，其他作品可定位到介绍。",
    "Open released projects or jump to an introduction for work in progress.",
  ],
];
const dictionary = new Map();
for (const pair of pairs)
  for (const source of pair)
    if (!dictionary.has(source)) dictionary.set(source, pair);

export function localizeHTML(html, experiments) {
  const copy = new Map(dictionary);
  for (const item of experiments) {
    copy.set('体验 ' + item.title, ['体验 ' + item.title, 'Open ' + item.title]);
    if (item.descriptionEn)
      copy.set(item.description, [item.description, item.descriptionEn]);
    const caption = "CONCEPT STUDY / " + item.id.toUpperCase();
    copy.set(caption, ["概念示意 / " + item.title, caption]);
  }
  for (const match of html.matchAll(/(\d+) \/ EXPERIMENT/g))
    copy.set(match[0], [match[1] + " / 实验作品", match[0]]);
  for (const match of html.matchAll(
    /(\d+) EXPERIMENTS \/ AN OPEN COLLECTION/g,
  )) {
    copy.set(match[0], [
      `${match[1]} 个实验 / 持续收集`,
      `${match[1]} EXPERIMENTS / AN OPEN COLLECTION`,
    ]);
  }
  for (const match of html.matchAll(/(\d+) \/ IN THE COLLECTION/g))
    copy.set(match[0], [`${match[1]} / 收录项目`, match[0]]);
  // Operate on text tokens only; data is escaped and never interpreted as HTML.
  // The head is intentionally excluded: metadata must not contain span elements.
  const bodyStart = html.indexOf("<body");
  const body = html
    .slice(bodyStart)
    .split(/(<[^>]*>)/g)
    .map((token) => {
      if (token.startsWith("<")) {
        return token.replace(/aria-label="([^"]*)"/g, (original, label) => {
          const pair = copy.get(label);
          return pair
            ? `aria-label="${escapeHTML(pair[0])}" data-label-zh="${escapeHTML(pair[0])}" data-label-en="${escapeHTML(pair[1])}"`
            : original;
        });
      }
      const key = token.trim();
      const pair = copy.get(key);
      return pair
        ? token.replace(
            key,
            `<span data-zh="${escapeHTML(pair[0])}" data-en="${escapeHTML(pair[1])}">${escapeHTML(pair[0])}</span>`,
          )
        : token;
    })
    .join("");
  return html.slice(0, bodyStart) + body;
}
