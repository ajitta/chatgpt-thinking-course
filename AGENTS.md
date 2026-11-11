# AGENTS.md

Guidance for coding agents working in this repository.

## What this repo is

A Korean-language, 30-lesson course ("Know Your Unknowns · ChatGPT Thinking 원리 이해하기") for non-specialists, collected from a public ChatGPT conversation and republished as static files. It is a content repo with one build step and no package manager or test suite: `node site/build.mjs` regenerates the lesson site in `docs/` from `sources/conversation/ui/` (plain Node, no dependencies). Prose, README, and commit-adjacent docs are written in Korean; keep new user-facing text in Korean.

The central constraint is **provenance**. Every lesson is an edit of captured original text, not newly written content. Read `PROVENANCE.md` before changing lesson content.

## Layout and how the pieces relate

Each lesson exists in several independent copies. Changing one does not update the others; check each one deliberately.

| Path | Role | Editing rule |
|---|---|---|
| `sources/lesson-XX.txt` | Captured original text (the ground truth) | Never edit. SHA-256 is recorded in `sources/manifest.json`. |
| `sources/history/`, `sources/connector/` | Superseded/partial captures (lessons 10–11) and tool-returned text (27–30) | Archive only. |
| `lessons/<part>/lesson-XX.md` | Canonical reading copy (static Markdown edit) | Formatting changes only; do not rewrite or summarize content. |
| `blog/lesson-XX.txt` | Plain-text copies for pasting into Naver Blog | Tables use `\|`-separated rows. |
| `blog/lesson-XX-summary.html`, `blog/naver-summary-XX.txt`, `blog/assets/` | Magazine-style editorial summaries of lessons 1-20 as published on Naver, with thumbnails and diagram PNGs | Rich-text paste manuscript, not an embed; no JS. Regenerate the `.txt` with `blog/tools/summary_text.py`. |
| `sources/conversation/ui/lesson-XX.json` | Lessons 1–20 as the original compiled lesson UI (text, state, answers, feedback, formulas, resolved links/images/charts), extracted from the shared-conversation data by `site/extract_lessons.py` | Never edit. Re-extract only from the share data. |
| `site/` | Site generator: `build.mjs` (pages), `home.mjs` (course home), `extract_lessons.py`, `vendor/` (Lucide icons, ISC) | Edit here, then run `node site/build.mjs`. |
| `docs/` | GitHub Pages site: course home + lessons 1–20. `assets/runtime.js` renders the lesson UI, `assets/site.css` styles everything | `docs/index.html`, `docs/lessons/`, `docs/assets/icons.svg` are generated; don't hand-edit them. Design rules in `docs/DESIGN.md`. |
| `PRODUCT.md`, `.impeccable/surfaces/` | Product context and the course-home/lesson-shell design brief used by the impeccable skill | Update when audience, constraints, or the site structure change. |
| `README.md` | Table of contents for all 30 lessons | Update links/status when files move or publish state changes. |
| `PROVENANCE.md`, `VALIDATION.md` | Editorial policy and the record of what was checked | Append when you change content or verify something. |

Lessons are grouped into five parts (`01-ai-fundamentals` … `05-creativity-and-products`). The grouping is an editorial addition; lesson numbers and titles come from the original.

## Content conventions

- Lesson Markdown starts with a provenance blockquote linking `PROVENANCE.md` and the matching `sources/` file, and ends with `---` followed by repo navigation (`[전체 목차](../../README.md) · [이전/다음: N강](...)`).
- Interactive elements from the original are rendered statically using bracket markers: `[정적 실습: …]`, `[직접 적기…]`, `[원문 이미지 생략: …]`, `[원문 도표의 문자: …]`. Don't present these as working controls.
- Lesson 10 and 11 use the later, complete versions from the conversation (see `PROVENANCE.md`). Don't merge versions.
- Don't download or redistribute external images. `docs/assets/lesson-01-attention.svg` is the original SVG decoded from the source DOM, kept as an archive (no page uses it now); keep it unmodified.
- The Naver posts are editorial adaptations, distinct from the static transcription. Label new adaptations the same way. The web lessons are not adaptations: they render the original lesson UI unchanged except for the site rules below.

## The course site (`docs/`)

Plain HTML/CSS/vanilla JS served by GitHub Pages from `docs/` (`.nojekyll`), at https://ajitta.github.io/chatgpt-thinking-course/ (home) and `/lessons/01/` … `/lessons/20/`. It goes live when `docs/` reaches `main`.

- `node site/build.mjs` writes each lesson's `lesson-data.js` (the original program and its data), renders the initial HTML with `docs/assets/runtime.js`, and wraps it in the shared shell (masthead with N / 20, left rail with the lesson contents and the course list, prev/next pager, source note). In the browser the same runtime re-renders after every answer, slider move, or keystroke and morphs the DOM so focus stays put.
- Site rules applied to the original UI (keep them; they are recorded in `PROVENANCE.md`): buttons that call `GenUI.issueNewTurn` (they send a new request to ChatGPT) are dropped and a dashed site note (`.u-sitenote`) names them in their place; the original's blues/greys map to the one green accent and grey-green (`COLORS` in `runtime.js`); a second chart series is muted, never a status colour; `maxLines` is not applied, so prompts show in full; `utm_*`/`trk` parameters are stripped from links and github.com sources are named but not linked; images are hotlinked from their original URLs with a "원문 이미지 · 출처" caption; lesson 10 starts at its complete-version title (the build fails if it is not found). Before going public (blog/STATUS.md 다음에 할 일 1, step 2, approved 2026-11-12) the two Getty Images photos (lesson 2 mixing console, lesson 3 apple) are dropped at build time; lesson 16's github.com citation stays unlinked because the same lesson already links the official scikit-learn docs page.
- Per-lesson corrections to an original program go in `CORRECTIONS` in `site/build.mjs`: an exact string replacement in the program plus a `note` that appears in that lesson's source note. Record each one in `PROVENANCE.md`. The only one so far is lesson 3's inverted quiz verdict.
- Every lesson page's source note lists how the page differs from the original (charts redrawn, formulas simplified, corrections, removed buttons, hotlinked images); `site/build.mjs` builds it from what the page contains. Link-card descriptions are the lesson's opening key question (an original sentence), with `DESCRIPTIONS` overrides.
- `PRODUCT.md` constraints: no stored answers or progress (no localStorage), no github.com links on the site, no external fonts/libraries/tracking.
- Per `docs/DESIGN.md`: paper ground, dark ink, one green accent, system fonts, keyboard-operable controls, one column on narrow screens.

## Extending the site (lessons 21-30)

1. Get the shared-conversation data again (the share link's conversation JSON, read in a logged-in browser; it holds `linear_conversation` messages with `metadata.model_dil_v2`). Keep it outside the repository.
2. Add lessons 21-30 to `LESSONS` in `site/extract_lessons.py` (the `.md` message numbers are 070, 073, ... 097; the message ids are `source_message_id` in `sources/manifest.json`) and run `python site/extract_lessons.py <share.json>`. It refuses a message whose text does not match the `.md` source.
3. In `site/build.mjs` set `LAST`, add parts 4-5 to `PARTS` (21-28 '실행·학습·장기 성장', 29-30 '창의성과 실제 가치 만들기', as in README), and replace the literal '1~20강' strings in `build.mjs` and `site/home.mjs`.
4. Add any new colour literals to `COLORS`/`BACKGROUNDS` in `docs/assets/runtime.js` and any new icon names to `site/vendor/lucide-icons.json`.
5. Rebuild, drive every control in a browser, and update README (web column), PRODUCT.md (scope), docs/DESIGN.md, PROVENANCE.md and VALIDATION.md.

## Checks

```sh
# Source snapshots still match the manifest (expect "mismatches: []")
python -c "import json,hashlib;m=json.load(open('sources/manifest.json',encoding='utf-8'));print(len(m),'entries; mismatches:',[e['lesson'] for e in m if hashlib.sha256(open(e['source_snapshot'],'rb').read()).hexdigest()!=e['snapshot_sha256']])"

# Rebuild the site from sources/conversation/ui (expect 20 lines, one per lesson)
node site/build.mjs

# JS syntax for the runtime
node --check docs/assets/runtime.js

# Preview the site locally
python -m http.server -d docs 8000
```

After a change, record what you verified (and what you didn't) in `VALIDATION.md` in the same PASS / scope style.

## Naver lesson posts (lessons 1-20 published)

Start a new session from `blog/STATUS.md` (current state, next steps, agreed working style). The process proven on lesson 1 is written down in `blog/PLAYBOOK.md`; per-lesson decisions and status live in `blog/lessons-plan.json`; the project skill `naver-lesson` runs it. Tools: `blog/tools/lint_manuscript.py` (manuscript check, including phone-length rules), `blog/tools/summary_text.py` (plain-text copy), `blog/tools/thumbnail.py` (series thumbnail), `blog/tools/naver/build-draft.mjs`, `publish.mjs` and `check-live.mjs` (SmartEditor automation and live-post check via ego-browser). MaruBuri fonts go in `blog/tools/fonts/` (git-ignored). `sources/conversation/chatgpt-thinking-공유대화-원본.md` is the full shared conversation (lessons 1-30, visible messages only), with its SVG diagrams in `sources/conversation/assets/`. Since 2026-11-11 it is the base text for the Naver posts; cite its line numbers for key and closing sentences.

## Publication state

Lessons 1-20 are on Naver as magazine-style posts (links in `README.md` and `blog/README.md`, log numbers in `blog/lessons-plan.json`), under `ChatGPT Thinking` in three categories: AI 기본원리 (1-4), AI 활용과 업무 시스템 (5-12), 사람의 사고와 불확실한 판단 (13-20). The site in `docs/` covers lessons 1-20 (course home plus `lessons/NN/`) and goes live when merged to `main`; lessons 21-30 are on neither. The Naver lesson 1 post links to the site root, which becomes the course home; the planned republish of all 20 posts (`blog/STATUS.md`) points it to `lessons/01/` and adds web-lesson, previous and next links. Publishing to Naver or changing a live post is outward-facing; confirm with the user first.
