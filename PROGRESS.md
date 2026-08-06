# CISA Prep — Progress Tracker

Last updated: 2026-08-06 (after question data integrity audit, theme fixes, shuffle fix)

This file exists so we don't have to reconstruct project history from chat
scrollback. Update it whenever a feature lands or a decision gets made —
treat it as the source of truth for "what's actually done" vs. "what's
still an idea."

---

## ✅ Done

### Dashboard layout
- **Sidebar removed entirely.** `DashboardLayout.tsx` no longer renders it.
  Every non-Dashboard page instead gets a small floating "← Dashboard"
  button (added once in the shared layout, not per-page). `Sidebar.tsx`
  itself is now an orphaned file — nothing imports it, safe to delete
  whenever.
- Header restructured into 3 stacked pieces: "CISA Prep." branding
  (centered), then a status bar (greeting + exam countdown on the left,
  exam date/edit + help/settings on the right), then a centered
  Practice/Exam/Flashcards nav row. Study is deliberately not in that nav
  row — it's folded into Current Study Plan itself instead.
- **No page-level scaling/transform system.** Went through several
  iterations here (see "Key decisions" below for the full story) — the
  current, confirmed-working approach is plain `height: 100dvh,
  overflow: hidden` on the root with flexbox (`flex: 1`, `minHeight: 0`)
  doing the space-fitting, no `transform: scale()` anywhere. User has
  directly tested this across all real configurations (laptop maximized
  and half-screen, ultrawide maximized and half-screen) and confirmed it
  holds up with no scrollbars, no stacking, no cramping.
- Current Study Plan's pre-assessment CTA now offers two paths: "Take
  Assessment" or "I'll Do It Myself" (skips straight to free Study
  browsing via `navigate("/study")`).

### Overall Readiness
- Exam-only, still defined as **pass rate over the most recently
  completed cycle** (see Key decisions).
- Ring shows **"—" with a "Ready" label** (not "Pass Rate") when no cycle
  is complete yet, instead of a misleading "0%".
- Domain legend beside the ring is color-coded (red <60%, amber 60–74%,
  green 75%+) with a ✓ on passing domains, plus a summary line — "X/5
  domains passing" — actively highlighting strengths, not just listing
  numbers passively.

### Focus Areas
- Two columns, but at **different granularities on purpose**: **Study**
  shows the weakest individual *categories* across all domains (you study
  a specific topic, not a whole domain) — no domain badge, just the
  category name. **Practice** stays *domain*-level (mirrors how the real
  exam actually scores things).
- **Untried is excluded entirely from both** — this flipped at least once
  during development (see Key decisions); current, confirmed-final rule
  is: only show what's actually been attempted.
- Clicking a Study category navigates straight into
  `/session/study/[category]` — no modal, since the row already tells you
  exactly what you're going to study.
- Clicking a Practice domain opens a modal with a full breakdown of every
  attempted category in that domain, split into **"Needs Improvement"
  (≤50%)** and **"Getting There" (51–74%)** columns — each category row is
  directly clickable. A column is hidden entirely (not shown empty) if it
  has no data; if only one column has data it takes the full width.
- The old single-category "why this section?" modal and its
  `goToWeakestCategoryInDomain`/`weakAreaPrompt` machinery were fully
  removed once this breakdown modal replaced it.

### Strengths (new card, sits beside Focus Areas)
- Same Study/Practice structural split as Focus Areas, inverted to show
  ≥75% instead of <75%, sorted strongest-first.
- **Study** = all-time strong categories (same aggregation style as
  Study's Focus Areas column).
- **Practice** = domains scoring 75%+ **within the single most recent
  Practice attempt only** — not an all-time aggregate. This was a
  deliberate correction: an all-time aggregate could show "100%" based on
  just 2-3 questions ever attempted, which is misleading. The card shows
  which specific Practice Set the data is from (e.g. "Based on your last
  attempt — Practice Set 2"), so there's real context instead of an
  ambiguous sample size.
- Rows are informational only — no click action, by design.

### Study
- Categories within an expanded domain sort weakest-first, using combined
  Study+Practice+Exam per-category accuracy (`/progress/categories`), with
  a "Focus here" badge on the single genuinely-weak one (if any).
- Deep-link support (`study_open_domains` / `study_scroll_target` in
  sessionStorage) so Dashboard links land you in the right place.

### Practice / Exam
- Practice counts progressively — an abandoned/partial attempt still
  contributes its answered questions to domain/category stats (Study and
  Exam still require full submission).
- Exam Sets correctly attributed by their real `mockSlot`, not
  chronological position.
- Exam cycle tracking (`utils/examCycles.ts`, shared between Dashboard and
  ExamLandingPage) — cycle = one attempt on each of the 5 distinct Exam
  Sets, retaking a set before the cycle completes replaces that set's
  score rather than corrupting the count.
- **CISA domain weighting fixed and centralized.** Was already
  implemented for both the 5 Exam Sets and 5 Practice Sets, but both
  independently used an old, superseded weight set (D1:21%, D2:17%,
  D3:12%, D4:23%, D5:27%) instead of the corrected official weights
  (D1:18%, D2:18%, D3:12%, D4:26%, D5:26%). Fixed and moved into
  `frontend/src/utils/cisaWeights.ts` (`CISA_DOMAIN_WEIGHTS`) — a single
  shared constant imported by `examUtils.ts` and
  `PracticeSessionPage.tsx`, instead of two independently-declared
  copies (which is exactly how they drifted out of sync originally).

### API
- `/progress/domains` and `/progress/domains?mode=X` — combined or
  mode-scoped per-domain accuracy, "most recent answer per question" so
  retakes don't inflate/deflate stats.
- `/progress/categories` (+ `?mode=X`) — same logic, grouped by category.
- `/progress/latest-practice` (**new**) — per-domain breakdown of the
  single most recent *submitted* Practice attempt (not an all-time
  aggregate). Powers Strengths' Practice column. Orders by `submittedAt`
  desc; only considers fully submitted attempts (not in-progress ones).
- `/attempts` includes `mockSlot`.
- `/progress/streak` still exists but is unused by the frontend (Study
  Streak feature was built, then removed).

### Question bank data integrity (2026-08-06 session)
- **ISACA Perform copy script built and iterated (`isaca-clean-copy.js`)** —
  Tampermonkey userscript that copies a question's full content (text,
  choices, correct answer, justification, Domain/Knowledge
  Statement/Task Statement) directly from the DOM instead of
  `innerText`-scraping. Went through several bug fixes along the way:
  - Original innerText-based approach could silently truncate on
    questions whose text contained the words "Incorrect" or "Correct
    answer is" (used as footer-clip markers) — replaced with structural
    DOM selectors instead.
  - Discovered the page renders **two** `.question-container` elements
    once you answer a question (a stale empty `display:none` one, plus
    the real one with `#answer`) — script was grabbing the wrong one.
    Fixed by preferring the container that actually has `#answer`.
  - Script output format was iterated to match the exact plain-text
    format of the original Word docs (`X of Y` / `Question: ...` /
    lettered choices / `Justification` / `Domain`/`Knowledge
    Statement`/`Task Statement`), so copied questions can be pasted
    straight into a Word doc and run through the existing
    `parse_questions.py` pipeline with no reformatting.
- **`parse_questions.py` updated** to handle the copy script's output:
  strips optional `A.`/`B.`/`C.`/`D.` labels from justification
  paragraphs (added for readability when pasted into Word) before
  storing, and accepts both the old bare `Question` label and the new
  inline `Question: xxx` format. Fully backward-compatible with the
  original 5 source Word docs (verified via test parse, no
  regressions).
- **Fixed real data corruption: D1-116.** A parser merge glitch had
  fused choices A and B into one garbled entry, dropping choice B's
  text and justification entirely. Confirmed and fixed against the live
  ISACA Perform question.
- **Investigated and resolved the "Cloud and Virtualized Environments"
  domain question** (see old entry below, now closed) — confirmed via
  ISACA's own official course outline that this category legitimately
  belongs under **D5**, not D4. The original D1–D5 source Word docs were
  actually named by **list position** in ISACA Perform's UI (which
  displays categories in the non-numeric order D1, D2, D4, D5, D3), not
  by real domain number — this caused the on-disk filenames
  (`domain3.json` etc.) to not match their actual content. Files
  renamed to reflect true contents (`domain3.json` → actually D4 →
  renamed `domain4_raw.json`, etc.); the merged `questions.json` itself
  was never affected since `merge_questions.py` reads the internal
  `code` field, not the filename.
- **Found and fixed a genuine duplicate: D5-836.** Two entries existed
  for the same "shared user accounts" IAM question stem with different
  correct answers (C vs. D) and different Task Statements. Live
  re-verification against ISACA Perform (copying through the full
  40-question IAM category) confirmed only one is real; the other was
  an artifact from the original scrape. Removed, then — important
  correction — **re-confirmed via the category's own "40 of 40" total on
  ISACA Perform** that 40 is correct and the question needed to stay;
  restored it. (Earlier in this same investigation, a partial
  session-review count of "39 of 39" was mistakenly treated as the true
  category total — it was only counting that session's answered
  questions, not the full pool. Lesson: only the category-listing page's
  own count is authoritative for "how many total questions exist," not
  a review-session count.)
- **Full category/domain reconciliation completed.** Cross-checked
  every one of the 1,072 questions' domain+category assignment against
  ISACA Perform's own category-listing screenshots (all 5 domains, 60
  categories total). Found and fixed:
  - ~15 categories fragmented across multiple near-duplicate JSON
    groups (inconsistent category-name strings from parsing
    quirks/non-breaking spaces/leading dashes) — merged into canonical
    names.
  - 2 individual D1 questions in the wrong category (content-based
    fix, confirmed by the count imbalance resolving cleanly).
  - 1 individual D3 question in the wrong category.
  - D4 was the messiest: 4 individual misfiled questions (identified
    via `externalId` sequence breaks — e.g. an ID like `D4-605` sitting
    inside a group otherwise numbered `D4-357`–`D4-368` — combined with
    content matching) plus **7 questions with a completely blank
    category** (their `taskId` had also failed to parse, defaulting to
    `T0` — a full metadata-parse failure on whatever source file they
    came from). All 7 were assigned to "Problem and Incident
    Management" based on a strong arithmetic signal (that category was
    short exactly 7, matching the blank count exactly) plus content
    review.
  - **Result: all 60 categories across all 5 domains now match ISACA
    Perform exactly** (verified via comparison table, all ✅). Total
    question count: **1,072** (unchanged from before — this was a
    reclassification exercise, not additions/removals, aside from the
    single D1-116 repair).
  - ⚠️ **Caveat worth flagging**: the D4 fixes (blank-category
    questions especially) were resolved via content inference + count
    arithmetic, not a live re-check against ISACA Perform like the
    D5-836 case got. Confidence is high but not verified the same way —
    worth a spot-check if time allows.
- **Fixed a data-seeding bug causing duplicate questions in the DB**
  (discovered via IAM showing 80 questions in-app instead of 40).
  Root cause: `seed.ts` upserts on `legacyId` (= `externalId` from
  `merge_questions.py`), but `externalId` is a **global sequential
  counter** dependent on the order `merge_questions.py` processes
  files — renaming the domain source files (to fix the naming
  confusion above) shifted that order, so re-seeding with new
  `externalId`s created a second copy of everything instead of updating
  the first. Fixed by truncating `Choice`/`AttemptAnswer`/
  `AttemptQuestion`/`Question` and reseeding clean. **Note for future
  reference**: `legacyId`/`externalId` is not a stable identifier across
  file-order changes — if the source `.json` files are ever renamed or
  reordered again, expect the same duplication risk unless
  `merge_questions.py`'s numbering scheme is made stable (e.g. derived
  from ISACA's own `legacyId` captured by the copy script, or a content
  hash) instead of positional.

### Randomization fix
- **Study/Practice/Exam question shuffling used a biased shuffle.**
  `api/src/server.ts`'s `/attempts` endpoint used
  `questions.sort(() => Math.random() - 0.5)`, which is a well-known
  non-uniform shuffle (biased by the sort algorithm's comparison
  pattern). Replaced with a proper Fisher-Yates shuffle — the same
  pattern already correctly used in `examUtils.ts` and
  `PracticeSessionPage.tsx` — now defined once in `server.ts` and
  reused. (Confirmed via testing that Study mode *is* randomized on
  each new session/attempt — this was a correctness fix, not a
  "it wasn't randomized at all" fix.)

### Theme (light/dark mode) bugs fixed
- **`SimulatorPage.tsx`** (powers Study session questions) had every
  color hardcoded as dark-only module constants, completely bypassing
  the app's `ThemeProvider`/`useTheme()` system — always rendered dark
  regardless of the user's theme setting. Fixed: proper light/dark
  palettes wired to `useTheme()`.
- **`ExamTakePage.tsx`** had the same hardcoded-dark-only bug, same fix
  applied (new `getTheme(mode)` function, wired to `useTheme()`).
- **`ExamReviewPage.tsx` / `ExamResultsPage.tsx`** had a more subtle
  version: a **correct, working `getTheme()` function already existed**
  reading `data-theme` off the DOM — but it was dead code, never called.
  Hardcoded dark-only constants directly below it silently overrode it.
  Fixed by wiring the existing function up to `useTheme()` (for proper
  React reactivity instead of a one-time DOM read) and actually using
  it, plus filling in a few missing overlay-color tokens
  (`rgba(255,255,255,...)` hardcoded overlays that would've been
  wrong/invisible in light mode).

## 🟡 Known simplifications (working as intended, not bugs)

- **Flashcards have zero tracking.** No session log, not part of Focus
  Areas/Strengths. Confirmed fine — it's a definitions-drilling tool, not
  meant to feed the readiness system.
- **Assessment is genuinely one-time, no retake.** Confirmed intentional
  — user has a concrete follow-up idea that builds on this (see Pending).

---

## 🔧 Pending / Next up (in stated priority order)

1. **Practice module** — routing is broken; UI needs an overhaul.
2. **Study module answer-color bug** — correct answers sometimes show
   red instead of green.
3. **Exam landing page** — goes blank on "Back to Setup" navigation.
4. **Settings page** — gear icon currently only has the theme toggle.
   Display name editing was pulled out of the header early on and was
   meant to move here; never built.
5. **Assessment-related idea (unspecified)** — user has a concrete plan
   here they haven't detailed yet.
6. **Game scores** — currently not persisted to the database; move
   them there.
7. **Dashboard metrics** — connect remaining placeholder metrics to
   real data.
8. **Exam intro page** — not yet built.
9. **General UI polish** — background image and other visual
   refinements. Dashboard's current look was flagged as "too white,
   lifeless, boring" — plan is to explore a redesign in Figma
   (html.to.design plugin against an exported HTML/CSS snapshot) rather
   than iterating live in code.
10. **Google Cloud deployment** — planned, not yet started.
11. **Spot-check the D4 question-category reassignments** done during
    the 2026-08-06 data integrity audit against live ISACA Perform, since
    those were resolved by inference rather than direct re-verification
    (see note above).

## 📋 Deferred (explicitly, not forgotten)

- **Mobile/responsive layout** — after desktop is fully polished.
- **Multi-user/production migration** (real accounts replacing the
  localStorage-based bits) — after everything else is polished.
- **Sidebar redesign** — resolved by removing it entirely; no longer
  pending, just noting the decision landed here in case it's revisited.

---

## Key decisions worth remembering (so we don't re-litigate them)

- **Overall Readiness = pass rate over last completed cycle**, not an
  average, not all-time. See prior reasoning — still holds.
- **Weak threshold = 75%**, matching the real passing rate everywhere.
- **Untried counts as weak in Focus Areas... then this reversed.** Early
  on, untried was deliberately included as "weak" (unanswered = 0% = not
  passing). Later, explicitly reversed: Focus Areas and Strengths now
  both **exclude untried entirely** — only show what's actually been
  attempted. If this comes up again, the *current* rule is exclude,
  confirmed twice now.
- **Focus Areas' Study/Practice split uses different granularities on
  purpose** — Study = category-level (what you actually study), Practice
  = domain-level (mirrors real exam scoring). This was also confirmed
  explicitly, don't "fix" it toward matching granularities.
- **The page-scaling story, condensed**: tried (1) transform-scale
  shrink-only capped at 1x + centering on wide screens — worked, but
  "why can't it grow on wide screens too" led to (2) allowing scale-up,
  which mathematically breaks (dividing pre-scale height by a
  scaleFactor > 1 gives *less* virtual room, squeezing every card and
  causing individual scrollbars) — reverted. Then pushed toward genuine
  CSS breakpoint reflow (stacking columns at narrow widths, allowing
  page scroll) as "how real websites do it" — user rejected this
  outright: explicitly does not want stacking or scrolling, wants one
  fixed layout at every size. Went back to shrink-only transform-scale.
  Then Gemini (a different assistant) rewrote it using a **different,
  simpler mechanism that the transform-scale approach never used**:
  dual-axis scaling — `Math.min(scaleX, scaleY)` where both axes are
  computed against a fixed design width *and height* — plus fixed-px
  card padding instead of `clamp(vh/vw)` (which was double-shrinking
  under the transform). That version worked well. **Current version**
  (this update) removes even that — no transform at all, pure flexbox
  (`flex: 1`, `minHeight: 0` throughout, `overflow: hidden` per card).
  User has directly tested this across all real configurations and
  confirmed it holds. If layout bugs resurface at some specific window
  size, this history is the place to look before re-inventing a fix.
- **This app never claims to predict real ISACA exam results.**

---

## File map (touched across recent sessions)

```
api/src/server.ts                                 (latest-practice endpoint; Fisher-Yates shuffle fix)
api/data/questions.json                            (full data integrity audit/fix, 2026-08-06)
api/prisma/seed.ts                                  (unchanged, but see legacyId stability note above)
frontend/src/layout/DashboardLayout.tsx            (sidebar removed, back-button added)
frontend/src/layout/Sidebar.tsx                    (orphaned — nothing imports it)
frontend/src/pages/Dashboard/Dashboard.tsx
frontend/src/pages/Dashboard/InfoModal.tsx
frontend/src/pages/Dashboard/DailyQuizModal.tsx
frontend/src/pages/Dashboard/AssessmentQuizModal.tsx
frontend/src/pages/Dashboard/HelpModal.tsx
frontend/src/pages/Exam/ExamLandingPage.tsx
frontend/src/pages/Exam/examUtils.ts
frontend/src/pages/Exam/ExamTakePage.tsx           (theme fix, 2026-08-06)
frontend/src/pages/Exam/ExamReviewPage.tsx         (theme fix — wired up dead getTheme(), 2026-08-06)
frontend/src/pages/Exam/ExamResultsPage.tsx        (theme fix — wired up dead getTheme(), 2026-08-06)
frontend/src/pages/Simulator/SimulatorPage.tsx     (theme fix, 2026-08-06)
frontend/src/pages/Study/StudyPage.tsx
frontend/src/pages/Practice/PracticeCategories.tsx
frontend/src/pages/Practice/PracticeSessionPage.tsx
frontend/src/utils/examCycles.ts

Tooling (outside app source):
isaca-clean-copy.js  (Tampermonkey userscript — copies questions from ISACA Perform)
parse_questions.py   (updated to strip justification labels, accept inline "Question: xxx")
```
