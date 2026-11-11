---
version: 1
slug: "docs-index-html"
primary_target: "docs/index.html"
related_targets: ["site/build.mjs","docs/assets/site.css"]
---

# Course home and lesson shell

Scope: `docs/index.html` (course home) and the shell every lesson page shares (`site/build.mjs`, `docs/assets/site.css`). Lesson bodies are the original lesson UI rendered by `docs/assets/runtime.js`; their content is fixed.

Mode: Read. Audience: non-specialist Korean readers, phone and PC in equal measure. Job: start at lesson 1 or find a lesson, then read 1 to 20 without losing the thread. Proof and content: the original lessons, their working practice, and the shared conversation link. Constraints: PRODUCT.md (no storage, no github.com links, no "ask ChatGPT" buttons, no external fonts or libraries).

Chosen structure: unit openers by part (rolled lead; the user delegated the choice on 2026-11-11). Alternatives shown: twenty questions list, lesson 1 front page with index.

## Direction contract

THESIS: The course reads like a textbook's unit pages: three parts opened in turn, each lesson a numbered line that leads straight into the original lesson. It refuses the card grid of lesson tiles and the hero-with-stats course landing.

OWN-WORLD: The lesson 1 paper: ground #faf9f5, ink #182720, muted #48564d, one green #216044 for lesson numbers, links and the chosen state. System Korean sans. Parts open on a 2px ink rule with the part name and its lesson range; lessons are ruled lines with the number set in green tabular figures.

STORY: The reader learns what the course covers and that the lessons are the original conversation with working practice, starts at lesson 1 or jumps to any lesson, and inside a lesson always sees where they are (N / 20, part, contents) and what comes next.

FIRST VIEWPORT: Desktop: masthead line; left column (about 400px) with the course title as the only h1, the original learning goal quoted, "1강부터 읽기" as the single solid button, and one line on what the site is; right column with part 1 (1-4강) fully open and part 2 starting below. Phone: the same order in one column; the button sits above the fold.

FORM: Unit openers by part, position 4 of my ordered list of 7, dealt as the lead. seed: 4a55c38a9e3cadf8

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
