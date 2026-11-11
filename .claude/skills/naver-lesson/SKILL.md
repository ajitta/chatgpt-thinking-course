---
name: naver-lesson
description: Make or republish the Naver blog magazine post for one lesson of this course (lessons 1-20 are published; 21-30 need a blog/lessons-plan.json entry first), following blog/PLAYBOOK.md - manuscript, lint, thumbnail, fill the SmartEditor with ego-browser, user review, publish, records. Use when the user asks to make, draft, publish or republish a lesson's Naver post ("21강 네이버 글 만들어", "다음 강의 블로그", "1강 글 재발행").
argument-hint: "<lesson number>"
---

# Naver lesson post

Follow `blog/PLAYBOOK.md` exactly; it holds the rules and commands. This file is the loop and the approval gates.

1. Read `blog/PLAYBOOK.md`, `blog/lessons-plan.json` (this lesson's entry and `decisions`), that lesson's section of `sources/conversation/chatgpt-thinking-공유대화-원본.md` (the base text), the lesson's `lessons/*/lesson-XX.md`, and `blog/lesson-03-summary.html` as the format reference (it follows the phone-length rules; its closing line gets a lint WARN at 605px but is two lines live). Also read any diagram listed in the plan entry.
2. If a pending decision affects this lesson (link target, category, title, third-party images), ask before writing.
3. Load the `antislop` and `antislop-copywriting` skills, then write `blog/lesson-XX-summary.html` and propose the blog title, key sentence (with its source location) and thumbnail line breaks. Show them; wait for approval. Use the post structure decided on 2026-11-12 (`decisions.next_republish`): a next-post line right under the closing '다음 강의는' paragraph (none until the next post exists), the web-lesson link and a previous-post link together at the end, and `data-tight` on the first body paragraph after each h2.
4. Run `python blog/tools/lint_manuscript.py XX` until it has no ERROR; regenerate `blog/naver-summary-XX.txt`; build the thumbnail with `blog/tools/thumbnail.py`.
5. Load the `ego-browser` skill. Open the editor (new post or update form), run `buildDraft` from `blog/tools/naver/build-draft.mjs`, require `diff: []` and the thumbnail as representative. Capture the editor and show the user.
6. Publish with `blog/tools/naver/publish.mjs` only after the user approves this post. Publishing is outward-facing; never batch several lessons into one approval unless the user explicitly approves a batch (so far: publishing lessons 3-20 on 2026-11-11, and the republish of lessons 1-20 done on 2026-11-12 in blog/STATUS.md 다음에 할 일 1, where one post is approved from an editor capture first and the other 19 under one approval); then follow PLAYBOOK section 5 (buildDraft ok and checkLive ok per lesson).
7. Run `checkLive` from `blog/tools/naver/check-live.mjs` on a second page (360px and 412px; it must return `ok: true`), fix and republish if it fails, then update `VALIDATION.md`, `PROVENANCE.md`, `blog/README.md`, `README.md` (네이버 글 column) and the plan entry (`status`, `logNo`). When this is a new lesson, add its link as the next-post line in the previous lesson's post and republish that post too (outward-facing: its own approval, buildDraft ok, checkLive ok).
