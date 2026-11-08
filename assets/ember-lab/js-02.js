// Static Chinese content works without JS; language, filters, and index enhance it.
const filters = document.querySelector(".filters");
const cards = [...document.querySelectorAll(".experiment-card")];
const result = document.querySelector("#filter-result");
const empty = document.querySelector(".empty-state");
const languageButton = document.querySelector("#language");
const indexButton = document.querySelector("#index-open");
const index = document.querySelector("#site-index");
let language =
  new URL(location.href).searchParams.get("lang") === "en" ? "en" : "zh";
let filterUsed = false;

function announceCount() {
  if (!filterUsed) return;
  const count = cards.filter((card) => !card.hidden).length;
  result.textContent =
    language === "en"
      ? `Showing ${count} of ${cards.length} experiments.`
      : `显示 ${count} 个项目，共 ${cards.length} 个。`;
}
function filterProjects(value) {
  filterUsed = true;
  for (const card of cards)
    card.hidden = value !== "all" && card.dataset.status !== value;
  for (const button of filters.querySelectorAll("button")) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === value),
    );
  }
  empty.hidden = cards.some((card) => !card.hidden);
  announceCount();
}
function setLanguage(next, updateURL = false) {
  language = next;
  document.documentElement.lang = next === "en" ? "en" : "zh-CN";
  for (const element of document.querySelectorAll("[data-zh][data-en]"))
    element.textContent = element.dataset[next];
  for (const element of document.querySelectorAll(
    "[data-label-zh][data-label-en]",
  ))
    element.setAttribute(
      "aria-label",
      element.dataset[next === "en" ? "labelEn" : "labelZh"],
    );
  languageButton.setAttribute(
    "aria-label",
    next === "en" ? "Switch to Chinese" : "切换为英文",
  );
  languageButton
    .querySelector('[lang="en"]')
    .classList.toggle("selected-language", next === "en");
  languageButton
    .querySelector('[lang="zh-CN"]')
    .classList.toggle("selected-language", next === "zh");
  document.title = location.pathname.startsWith("/about")
    ? next === "en"
      ? "Project notes · Ember Lab"
      : "作品介绍 · Ember Lab"
    : next === "en"
      ? "Ember Lab · Interactive experiments & creative tools"
      : "Ember Lab · 交互实验与创意工具";
  document.querySelector('meta[name="description"]').content =
    next === "en"
      ? "Independent experiments in AI, interactive storytelling, film, and city observation. Turn ideas into experiences with Ember Lab."
      : "Ember 的独立交互实验室：探索 AI、互动叙事、电影与城市观察，将想法转化为可以体验的网页作品。";
  document.querySelector('meta[property="og:locale"]').content =
    next === "en" ? "en_US" : "zh_CN";
  if (updateURL) {
    const url = new URL(location.href);
    if (next === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    history.replaceState(null, "", url);
  }
  // Carry the chosen language across directory / project-note navigation.
  for (const link of document.querySelectorAll('a[href]')) {
    const href = link.getAttribute('href');
    if (!/^(\/|(?:directory|notes)\.html)/.test(href)) continue;
    const target = new URL(href, location.href);
    if (target.origin !== location.origin) continue;
    if (next === 'en') target.searchParams.set('lang', 'en');
    else target.searchParams.delete('lang');
    const path = href.startsWith('/') ? target.pathname : target.pathname.split('/').pop();
    link.setAttribute('href', path + target.search + target.hash);
  }
  announceCount();
}
if (filters) filters.hidden = false;
languageButton.hidden = false;
indexButton.hidden = false;
setLanguage(language);
languageButton.addEventListener("click", () =>
  setLanguage(language === "zh" ? "en" : "zh", true),
);
filters?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (button) filterProjects(button.dataset.filter);
});
document.querySelector("#reset-filter")?.addEventListener("click", () => {
  filterProjects("all");
  filters.querySelector('[data-filter="all"]').focus();
});
indexButton.addEventListener("click", () => {
  index.showModal();
  indexButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("index-open");
});
document
  .querySelector("#index-close")
  .addEventListener("click", () => index.close());
index.addEventListener("close", () => {
  indexButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("index-open");
});
index.addEventListener("click", (event) => {
  if (event.target !== index) return;
  const bounds = index.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    index.close();
});
index.querySelectorAll('a[href^="#"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    // An archive entry must also work when its card was filtered out.
    if (target.matches(".experiment-card") && target.hidden)
      filterProjects("all");
    index.close();
    const url = new URL(location.href);
    url.hash = link.hash;
    history.pushState(null, "", url);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start" });
  }),
);
// Keep keyboard cycling in the index, including the last link → close button.
index.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const controls = [
    ...index.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex="0"]',
    ),
  ].filter((element) => element.getClientRects().length > 0);
  if (!controls.length) return;
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
