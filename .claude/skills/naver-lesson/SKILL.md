---
name: naver-lesson
description: Make the Naver blog magazine post for one lesson (2-20) of this course, following blog/PLAYBOOK.md - manuscript, lint, thumbnail, fill the SmartEditor with ego-browser, user review, publish, records. Use when the user asks to make, draft, or publish a lesson's Naver post ("2강 네이버 글 만들어", "다음 강의 블로그").
argument-hint: "<lesson number>"
---

# Naver lesson post

Follow `blog/PLAYBOOK.md` exactly; it holds the rules and commands. This file is the loop and the approval gates.

1. Read `blog/PLAYBOOK.md`, `blog/lessons-plan.json` (this lesson's entry and `decisions_pending`), the lesson's `lessons/*/lesson-XX.md`, and `blog/lesson-01-summary.html` as the format reference. Also read that lesson's section of `sources/conversation/chatgpt-thinking-공유대화-원본.md` and any diagram listed in the plan entry.
2. If a pending decision affects this lesson (link target, category, title, third-party images), ask before writing.
3. Load the `antislop` and `antislop-copywriting` skills, then write `blog/lesson-XX-summary.html` and propose the blog title, key sentence (with its source location) and thumbnail line breaks. Show them; wait for approval.
4. Run `python blog/tools/lint_manuscript.py XX` until it has no ERROR; regenerate `blog/naver-summary-XX.txt`; build the thumbnail with `blog/tools/thumbnail.py`.
5. Load the `ego-browser` skill. Open the editor (new post or update form), run `buildDraft` from `blog/tools/naver/build-draft.mjs`, require `diff: []` and the thumbnail as representative. Capture the editor and show the user.
6. Publish with `blog/tools/naver/publish.mjs` only after the user approves this post. Publishing is outward-facing; never batch several lessons into one approval.
7. Capture the live page at 360px and 412px, then update `VALIDATION.md`, `PROVENANCE.md`, `blog/README.md` and the plan entry (`status`, `logNo`).
