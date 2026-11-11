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
| `blog/lesson-XX-summary.html`, `blog/naver-summary-XX.txt`, `blog/assets/` | Magazine-style editorial summaries of lessons 1-20 as published on Naver, with thumbnails and diagram PNGs | Rich-text paste manuscript, not an embed; no JS. Regenerate the `.txt` with `blog/tools/summary_text.py`. |
| `docs/` | GitHub Pages site (lesson 1 only): `index.html`, `lesson01.js`, `style.css` | Design rules in `docs/DESIGN.md`. |
| `README.md` | Table of contents for all 30 lessons | Update links/status when files move or publish state changes. |
| `PROVENANCE.md`, `VALIDATION.md` | Editorial policy and the record of what was checked | Append when you change content or verify something. |

Lessons are grouped into five parts (`01-ai-fundamentals` … `05-creativity-and-products`). The grouping is an editorial addition; lesson numbers and titles come from the original.

## Content conventions

- Lesson Markdown starts with a provenance blockquote linking `PROVENANCE.md` and the matching `sources/` file, and ends with `---` followed by repo navigation (`[전체 목차](../../README.md) · [이전/다음: N강](...)`).
- Interactive elements from the original are rendered statically using bracket markers: `[정적 실습: …]`, `[직접 적기…]`, `[원문 이미지 생략: …]`, `[원문 도표의 문자: …]`. Don't present these as working controls.
- Lesson 10 and 11 use the later, complete versions from the conversation (see `PROVENANCE.md`). Don't merge versions.
- Don't download or redistribute external images. `docs/assets/lesson-01-attention.svg` is the original SVG decoded from the source DOM; keep it unmodified.
- The web page and Naver summary are editorial adaptations, distinct from the static transcription. Label new adaptations the same way.

## The lesson 1 site (`docs/`)

Plain HTML/CSS/vanilla JS served by GitHub Pages from `docs/` (`.nojekyll`). Published at https://ajitta.github.io/chatgpt-thinking-course/.

- Quiz forms carry the correct value in `data-answer` (`#prediction`, `#reasoning`); feedback goes to `role="status"` / `aria-live` elements. The token demo (`#token-next`) steps through a fixed sentence; it does not run a model.
- Per `docs/DESIGN.md`: one green accent, system fonts, no external fonts/libraries, no tracking, no stored responses, keyboard-operable radios/buttons, one-column layout on narrow screens.
- `VALIDATION.md` records prior checks: no horizontal overflow at 390/768px and desktop, contrast ≥7:1 for accent and secondary text, keyboard/focus behaviour, all quiz states.

## Checks

```sh
# Source snapshots still match the manifest (expect "mismatches: []")
python -c "import json,hashlib;m=json.load(open('sources/manifest.json',encoding='utf-8'));print(len(m),'entries; mismatches:',[e['lesson'] for e in m if hashlib.sha256(open(e['source_snapshot'],'rb').read()).hexdigest()!=e['snapshot_sha256']])"

# JS syntax for the lesson 1 page
node --check docs/lesson01.js

# Preview the site locally
python -m http.server -d docs 8000
```

After a change, record what you verified (and what you didn't) in `VALIDATION.md` in the same PASS / scope style.

## Naver lesson posts (lessons 1-20 published)

Start a new session from `blog/STATUS.md` (current state, next steps, agreed working style). The process proven on lesson 1 is written down in `blog/PLAYBOOK.md`; per-lesson decisions and status live in `blog/lessons-plan.json`; the project skill `naver-lesson` runs it. Tools: `blog/tools/lint_manuscript.py` (manuscript check, including phone-length rules), `blog/tools/summary_text.py` (plain-text copy), `blog/tools/thumbnail.py` (series thumbnail), `blog/tools/naver/build-draft.mjs`, `publish.mjs` and `check-live.mjs` (SmartEditor automation and live-post check via ego-browser). MaruBuri fonts go in `blog/tools/fonts/` (git-ignored). `sources/conversation/chatgpt-thinking-공유대화-원본.md` is the full shared conversation (lessons 1-30, visible messages only), with its SVG diagrams in `sources/conversation/assets/`. Since 2026-11-11 it is the base text for the Naver posts; cite its line numbers for key and closing sentences.

## Publication state

Lessons 1-20 are on Naver as magazine-style posts (links in `README.md` and `blog/README.md`, log numbers in `blog/lessons-plan.json`), under `ChatGPT Thinking` in three categories: AI 기본원리 (1-4), AI 활용과 업무 시스템 (5-12), 사람의 사고와 불확실한 판단 (13-20). Only lesson 1 has a web page (above). Lessons 21-30 are not on the blog or the site. Publishing to Naver or changing a live post is outward-facing; confirm with the user first.
