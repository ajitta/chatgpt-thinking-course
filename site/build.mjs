// Builds the GitHub Pages site in docs/ from sources/conversation/ui/lesson-XX.json.
//   node site/build.mjs
// Writes docs/index.html, docs/lessons/NN/{index.html,lesson-data.js}, docs/assets/icons.svg.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(ROOT, "docs");
const SITE = "https://ajitta.github.io/chatgpt-thinking-course/";
const COURSE = "ChatGPT Thinking 원리 이해하기";
const BRAND = "Know Your Unknowns";
const LAST = 20;

// The part grouping is an editorial addition (README.md); lesson numbers and titles are original.
export const PARTS = [
  { name: "AI Thinking의 기본 원리", from: 1, to: 4 },
  { name: "AI 활용과 업무 시스템", from: 5, to: 12 },
  { name: "사람의 사고와 불확실한 판단", from: 13, to: 20 }
];

const { Lesson } = await import(pathToFileURL(path.join(DOCS, "assets", "runtime.js")));

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const esc = s => String(s).replace(/[&<>"]/g, c => ESC[c]);
const pad = n => String(n).padStart(2, "0");
const strip = html => html.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const partOf = n => PARTS.find(p => n >= p.from && n <= p.to);

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function iconSprite() {
  const { icons } = JSON.parse(fs.readFileSync(path.join(ROOT, "site", "vendor", "lucide-icons.json"), "utf8"));
  const attr = o => Object.entries(o).map(([k, v]) => ` ${k}="${esc(v)}"`).join("");
  const symbols = Object.entries(icons).map(([name, nodes]) =>
    `<symbol id="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
    nodes.map(([tag, a]) => `<${tag}${attr(a)}/>`).join("") + `</symbol>`).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg">\n<!-- Lucide icons, ISC License, https://lucide.dev -->\n${symbols}\n</svg>\n`;
}

// Corrections applied to an original program, each shown in that lesson's source note and PROVENANCE.md.
const CORRECTIONS = {
  3: {
    // The "직접 실험해 보기" verdict is inverted against the lesson's own explanation:
    // problem A's conclusion is necessarily true, yet answering "그렇다" was marked wrong.
    replace: [['(choice==="yes")===(!isValid)', '(choice==="yes")===isValid']],
    note: "‘직접 실험해 보기’는 원문의 정답 판정이 바로 아래 해설과 반대여서(문제 A에서 ‘그렇다’를 고르면 오답으로 표시), 판정만 해설에 맞게 바로잡았습니다."
  }
};

// Original images whose source host is listed here are left out: their addresses never reach the generated
// data and the page shows a site note instead. Empty since 2026-11-12: the two Getty Images photos (lessons 2
// and 3) were left out before going public, then restored the same day at the user's decision, since they load
// from the user's own shared conversation like the other original images. Example entry:
//   { host: /(^|\.)gettyimages\.[a-z.]+$/, name: "Getty Images" }
const OMITTED_IMAGE_SOURCES = [];

function omitImages(resolutions) {
  const out = JSON.parse(JSON.stringify(resolutions || {}));
  let count = 0;
  for (const [id, res] of Object.entries(out)) {
    const img = res && res.state && res.state.images && res.state.images[0];
    if (!img) continue;
    let host = "";
    try { host = new URL(img.url || img.original_content_url || "").hostname; } catch {}
    const hit = OMITTED_IMAGE_SOURCES.find(s => s.host.test(host));
    // Replace the whole resolution (it also carries safe_urls) so no address of the image is published.
    if (hit) { out[id] = { state: { omittedImage: hit.name } }; count++; }
  }
  return { resolutions: out, count };
}

// Link-card descriptions are original sentences: the lesson's opening key question,
// or for lesson 10 (which opens without one) two sentences from its first section.
const DESCRIPTIONS = {
  10: "지금까지 배운 것은 개별 AI의 능력이었습니다. 핵심은 AI가 좋은 답변을 만드는 것에서 끝나지 않고, 실제 업무 목표를 달성했는지 확인하는 것입니다."
};

function keyQuestion(html) {
  const afterH1 = html.slice(html.indexOf("</h1>"));
  const h2 = afterH1.indexOf("<h2");
  const opening = h2 > 0 ? afterH1.slice(0, h2) : afterH1.slice(0, 6000);
  const blocks = [...opening.matchAll(/<(p|blockquote)[^>]*>([\s\S]*?)<\/\1>/g)].map(m => ({ tag: m[1], strong: m[2].includes("<strong>"), text: strip(m[2]) }));
  const asks = blocks.filter(b => b.text.includes("?") && b.text.length > 15);
  const pick = asks.find(b => b.tag === "blockquote" || b.strong) || asks[0];
  return pick ? pick.text.replace(/^["“]|["”]$/g, "") : null;
}

const ORDINALS = ["첫", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열"];

async function loadLesson(n) {
  const rec = JSON.parse(fs.readFileSync(path.join(ROOT, "sources", "conversation", "ui", `lesson-${pad(n)}.json`), "utf8"));
  let code = rec.code;
  for (const [from, to] of (CORRECTIONS[n] && CORRECTIONS[n].replace) || []) {
    if (!code.includes(from)) throw new Error(`lesson ${n}: correction target not found: ${from}`);
    code = code.split(from).join(to);
  }
  const { resolutions, count: omittedImages } = omitImages(rec.resolutions);
  // The subtitle under each lesson title ends with ' · 비전공자 과정' in lessons 1-4; the site drops that label (user decision 2026-11-12).
  const constants = Object.fromEntries(Object.entries(rec.constants).map(([k, v]) => [k, typeof v === "string" ? v.replace(/\s*·\s*비전공자 과정$/, "") : v]));
  const data = {
    lesson: rec.lesson,
    start_at_title: rec.start_at_title,
    constants,
    resolutions,
    bindings: rec.bindings,
    widgets: rec.widgets
  };
  const module = `// Generated by site/build.mjs from sources/conversation/ui/lesson-${pad(n)}.json. Do not edit by hand.\n` +
    `// The program below is the original lesson's compiled UI from the shared ChatGPT conversation.\n` +
    `export const data = ${JSON.stringify(data)};\n` +
    `data.program = function (DIL, __dil, GenUI, Cite, Link, AsyncImage, Entity) {\n${code}\n};\n`;
  const file = path.join(DOCS, "lessons", pad(n), "lesson-data.js");
  write(file, module);
  const mod = await import(pathToFileURL(file).href + "?t=" + fs.statSync(file).mtimeMs);
  const lesson = new Lesson(mod.data, { assets: "../../assets/" });
  const { html, toc } = lesson.render();
  const h1 = strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "");
  if (!new RegExp(`^${n}강\\.`).test(h1)) throw new Error(`lesson ${n}: page title is "${h1}"`);
  if (rec.start_at_title && h1 !== rec.start_at_title) throw new Error(`lesson ${n}: start_at_title "${rec.start_at_title}" not found; got "${h1}"`);
  const title = h1.replace(/^\d+강\.\s*/, "");
  const description = DESCRIPTIONS[n] || keyQuestion(html);
  if (!description) throw new Error(`lesson ${n}: no key question for the description`);
  return { n, title, fullTitle: h1, html, toc, description, rec, omittedImages };
}

function head({ title, description, url, depth, image }) {
  const base = depth ? "../../" : "";
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="${depth ? "article" : "website"}">
<meta property="og:locale" content="ko_KR">
<meta property="og:site_name" content="${esc(BRAND)} · ${esc(COURSE)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">${image ? `
<meta property="og:image" content="${esc(SITE + image.src)}">
<meta property="og:image:width" content="${image.w}">
<meta property="og:image:height" content="${image.h}">
<meta property="og:image:alt" content="${esc(image.alt)}">
<meta name="twitter:card" content="summary_large_image">` : `
<meta name="twitter:card" content="summary">`}
<meta name="theme-color" content="#faf9f5">
<link rel="stylesheet" href="${base}assets/site.css">`;
}

function courseList(current) {
  return PARTS.map(p => {
    const items = [];
    for (let i = p.from; i <= p.to; i++) {
      const cur = i === current ? ` aria-current="page"` : "";
      items.push(`<li><a href="../${pad(i)}/"${cur}><span class="no">${i}강</span> ${esc(LESSONS[i - 1].title)}</a></li>`);
    }
    return `<li class="part"><p>${esc(p.name)} <span>${p.from}~${p.to}강</span></p><ol>${items.join("")}</ol></li>`;
  }).join("");
}

const icon = (name, size = "i-sm") => `<svg class="u-icon ${size}" aria-hidden="true" focusable="false"><use href="../../assets/icons.svg#${name}"></use></svg>`;

function lessonPage(L) {
  const prev = L.n > 1 ? LESSONS[L.n - 2] : null;
  const next = L.n < LAST ? LESSONS[L.n] : null;
  const part = partOf(L.n);
  const url = `${SITE}lessons/${pad(L.n)}/`;
  const toc = L.toc.map(t => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join("");
  const pager = `<nav class="pager" aria-label="이전 강의와 다음 강의"><div class="pager-row">
  ${prev ? `<a class="pager-link prev" href="../${pad(prev.n)}/" rel="prev">${icon("chevron-left", "i-lg")}<span class="ttl"><span class="sr-only">이전 강의: </span><span class="no">${prev.n}강</span> ${esc(prev.title)}</span></a>` : `<a class="pager-link prev" href="../../">${icon("chevron-left", "i-lg")}<span class="ttl">1~20강 목차</span></a>`}
  ${next ? `<a class="pager-link next" href="../${pad(next.n)}/" rel="next"><span class="ttl"><span class="sr-only">다음 강의: </span><span class="no">${next.n}강</span> ${esc(next.title)}</span>${icon("chevron-right", "i-lg")}</a>` : `<a class="pager-link next" href="../../"><span class="ttl">1~20강 목차</span>${icon("chevron-right", "i-lg")}</a>`}
</div></nav>`;
  // Source note: what was carried over, then every way this page differs from the original.
  // Footer: only differences that change what the reader sees or does (the full list is in PROVENANCE.md).
  // The site does not mention where the lessons were collected (user decision 2026-11-12).
  const notes = [];
  if (CORRECTIONS[L.n]) notes.push(CORRECTIONS[L.n].note);
  return `${head({ title: `${L.n}강 · ${L.title} | ${COURSE}`, description: L.description, url, depth: 2 })}
${prev ? `<link rel="prev" href="../${pad(prev.n)}/">` : ""}${next ? `<link rel="next" href="../${pad(next.n)}/">` : ""}
<script type="module">
import { mount, railSpy } from "../../assets/runtime.js";
import { data } from "./lesson-data.js";
const root = document.getElementById("lesson");
mount(root, data, { assets: "../../assets/", status: document.getElementById("live-status") });
railSpy(document.querySelector(".rail-toc"), root);
</script>
</head>
<body class="page-lesson">
<a class="skip" href="#lesson">강의 본문으로 바로 가기</a>
<header class="masthead">
  <a class="brand" href="../../"><span>${esc(BRAND)}</span> ${esc(COURSE)}</a>
  <nav class="step" aria-label="강의 순서">
    ${prev ? `<a href="../${pad(prev.n)}/" aria-label="이전 강의: ${prev.n}강">${icon("chevron-left")}${prev.n}강</a>` : `<span aria-hidden="true"></span>`}
    <span class="where"><b>${L.n}강</b> / ${LAST}</span>
    ${next ? `<a href="../${pad(next.n)}/" aria-label="다음 강의: ${next.n}강">${next.n}강${icon("chevron-right")}</a>` : `<span aria-hidden="true"></span>`}
  </nav>
</header>
<div class="layout">
  <aside class="rail">
    <p class="rail-part"><a href="../../#part-${PARTS.indexOf(part) + 1}">${esc(part.name)}</a><span>${part.from}~${part.to}강 · ${part.to - part.from + 1}개 강의 중 ${ORDINALS[L.n - part.from]} 번째</span></p>
    <details class="rail-toc" open>
      <summary>${L.n}강 차례</summary>
      <ol>${toc}</ol>
    </details>
    <script>if (matchMedia("(max-width: 860px)").matches) document.currentScript.previousElementSibling.open = false;</script>
    <details class="rail-course">
      <summary>1~20강 목차</summary>
      <ol class="course-list">${courseList(L.n)}</ol>
    </details>
  </aside>
  <main id="lesson" class="lesson" tabindex="-1">
${L.html}
  </main>
</div>
${pager}
<footer class="colophon"><div class="colophon-body">
${notes.length ? `  <p>원문과 달라진 점: ${notes.join(" ")}</p>\n` : ""}  <p>OpenAI의 공식 강의가 아니며, 강의에 나온 인용과 수치는 따로 확인하지 않았습니다. 실습에 고르거나 적은 내용은 저장하거나 전송하지 않으며, 새로 고치면 지워집니다.</p>
</div></footer>
<p id="live-status" class="sr-only" role="status" aria-live="polite"></p>
</body>
</html>
`;
}

let LESSONS = [];

export async function build({ home } = {}) {
  LESSONS = [];
  for (let n = 1; n <= LAST; n++) LESSONS.push(await loadLesson(n));
  for (const L of LESSONS) write(path.join(DOCS, "lessons", pad(L.n), "index.html"), lessonPage(L));
  write(path.join(DOCS, "assets", "icons.svg"), iconSprite());
  const homeModule = await import(pathToFileURL(path.join(ROOT, "site", "home.mjs")).href);
  write(path.join(DOCS, "index.html"), homeModule.homePage({ LESSONS, PARTS, head, esc, pad, SITE, COURSE, BRAND }));
  return LESSONS;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const lessons = await build();
  for (const L of lessons) console.log(`${pad(L.n)} ${L.toc.length} sections  ${L.title}`);
}
