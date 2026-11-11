# AGENTS.md

Guidance for coding agents working in this repository.

## What this repo is

A Korean-language, 30-lesson course ("Know Your Unknowns · ChatGPT Thinking 원리 이해하기") for non-specialists, collected from a public ChatGPT conversation and republished as static files. It is a content repo: no package manager, build step, or test suite. Prose, README, and commit-adjacent docs are written in Korean; keep new user-facing text in Korean.

The central constraint is **provenance**. Every lesson is an edit of captured original text, not newly written content. Read `PROVENANCE.md` before changing lesson content.

## Layout and how the pieces relate

Each lesson exists in several independent copies. Changing one does not update the others; check each one deliberately.

| Path | Role | Editing rule |
|---|---|---|
| `sources/lesson-XX.txt` | Captured original text (the ground truth) | Never edit. SHA-256 is recorded in `sources/manifest.json`. |
| `sources/history/`, `sources/connector/` | Superseded/partial captures (lessons 10–11) and tool-returned text (27–30) | Archive only. |
| `lessons/<part>/lesson-XX.md` | Canonical reading copy (static Markdown edit) | Formatting changes only; do not rewrite or summarize content. |
| `blog/lesson-XX.txt` | Plain-text copies for pasting into Naver Blog | Tables use `\|`-separated rows. |
| `blog/lesson-01-summary.html`, `blog/naver-summary-01.txt`, `blog/assets/` | Editorial summary of lesson 1 as published on Naver | Rich-text paste manuscript, not an embed; no JS. |
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
- Don't download or redistribute external images. `docs/assets/lesson-01-attention.svg` is the original SVG decoded from the source DOM; keep it unmodified.
- The Naver posts are editorial adaptations, distinct from the static transcription. Label new adaptations the same way. The web lessons are not adaptations: they render the original lesson UI unchanged except for the site rules below.

## The course site (`docs/`)

Plain HTML/CSS/vanilla JS served by GitHub Pages from `docs/` (`.nojekyll`), at https://ajitta.github.io/chatgpt-thinking-course/ (home) and `/lessons/01/` … `/lessons/20/`. It goes live when `docs/` reaches `main`.

- `node site/build.mjs` writes each lesson's `lesson-data.js` (the original program and its data), renders the initial HTML with `docs/assets/runtime.js`, and wraps it in the shared shell (masthead with N / 20, left rail with the lesson contents and the course list, prev/next pager, source note). In the browser the same runtime re-renders after every answer, slider move, or keystroke and morphs the DOM so focus stays put.
- Site rules applied to the original UI (keep them; they are recorded in `PROVENANCE.md`): buttons that call `GenUI.issueNewTurn` ("continue in ChatGPT") are dropped; the original's blues/greys map to the one green accent and grey-green; `utm_*`/`trk` parameters are stripped from links; images are hotlinked from their original URLs with a "원문 이미지" caption; lesson 10 starts at its complete-version title.
- `PRODUCT.md` constraints: no stored answers or progress (no localStorage), no github.com links on the site, no external fonts/libraries/tracking.
- Per `docs/DESIGN.md`: paper ground, dark ink, one green accent, system fonts, keyboard-operable controls, one column on narrow screens.

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

## Naver lesson posts (lessons 2-20)

Start a new session from `blog/STATUS.md` (current state, next steps, agreed working style). The process proven on lesson 1 is written down in `blog/PLAYBOOK.md`; per-lesson decisions and status live in `blog/lessons-plan.json`; the project skill `naver-lesson` runs it. Tools: `blog/tools/lint_manuscript.py` (manuscript check), `blog/tools/thumbnail.py` (series thumbnail), `blog/tools/naver/build-draft.mjs` and `publish.mjs` (SmartEditor automation via ego-browser). MaruBuri fonts go in `blog/tools/fonts/` (git-ignored). `sources/conversation/chatgpt-thinking-공유대화-원본.md` is the full shared conversation (lessons 1-30, visible messages only), with its SVG diagrams in `sources/conversation/assets/`.

## Publication state

The site in `docs/` covers lessons 1–20 (live once merged to `main`); lessons 21–30 are not on the site. Naver posts: see `blog/STATUS.md` (lesson 1 https://blog.naver.com/ajitta/224472328521 links to the site root, which is now the course home). Publishing to Naver or changing the live post is outward-facing; confirm with the user first.
