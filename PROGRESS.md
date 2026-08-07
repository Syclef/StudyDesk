# CISA Prep — Progress Tracker

Last updated: 2026-08-06 (multi-user confirmed — auth/security elevated to top priority)

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

### Assessment fixes (2026-08-06)
- **Results screen added.** `handleAssessmentComplete` in `Dashboard.tsx`
  was computing per-domain scores and the recommended mode correctly,
  but then just called `setShowAssessment(false)` — closing the modal
  with zero feedback shown. `AssessmentQuizModal.tsx` now has a real
  `"results"` phase (added between `"quiz"` and modal-close): total
  score, a per-domain progress-bar breakdown, and the recommended mode
  with a plain-language explanation of why, before a "Continue to
  Dashboard" button actually calls `onComplete`.
- **Hybrid/Adaptive manual toggle added, then removed later the same
  session.** Initially added because the assessment's own intro copy
  promised "You can still switch between the two manually afterward"
  and no such UI existed. Superseded a few turns later when Current
  Study Plan's selection logic was redesigned entirely (see "Current
  Study Plan redesign" below) — once selection is just "show weak
  domains," a Hybrid-vs-Adaptive choice no longer means anything, so
  the toggle was removed rather than kept as dead UI.
- **"Only 2 domains" — superseded, see redesign below.** Originally
  clarified via a relabel ("CURRENT STUDY PLAN — NEXT UP") since the
  `.slice(0, 2)` cap was intentional but confusing. Later removed
  entirely — Current Study Plan now shows *every* weak domain, no cap.
- **Retake mechanism (manual, for testing only):** the assessment is
  still meant to run once — there's no "retake" button by design. To
  force a retake (e.g. to verify these fixes), clear
  `localStorage.removeItem("studydesk_assessment_result_v1")` in the
  browser console and refresh. See the note under Pending (#6) about
  why this same mechanism means "once ever" isn't currently
  *enforceable* — it's just the default, resettable by anyone who
  clears their own browser storage.

### Current Study Plan redesign, trend tracking, Daily Quiz streak (2026-08-06)
- **Removed the exam-weight display and the whole Hybrid/Adaptive
  distinction entirely.** Turned out "26% weight" next to a domain meant
  nothing to a user without context, and once selection is purely
  "weak domains, ranked somehow," Hybrid-vs-Adaptive stopped being a
  meaningful choice — it collapsed into one behavior. Removed
  `studyPlanMode` state, the toggle UI, `STUDY_PLAN_MODE_KEY`, and all
  the recommended-mode logic in the assessment flow along with it.
- **Current Study Plan now shows every domain under 75%, weakest
  first** (untried domains — no score yet — sort last, since there's
  nothing to rank them against). Visual style adapted from the
  assessment results screen: colored progress bars (amber 50-74%, red
  <50%) instead of plain text rows.
- **New: per-domain improvement indicator (▲/▼).** New backend
  endpoint, `GET /progress/domains/trend?mode=STUDY` — unlike
  `/progress/domains` (which dedupes to your *latest* answer per
  question, discarding history), this keeps every individual Study
  answer, splits them chronologically into an earlier half and a
  recent half per domain, and compares accuracy between the two.
  Requires at least 6 answered questions in a domain before showing
  anything (`MIN_ANSWERS_FOR_TREND` in `server.ts`) — a 1-question swing
  on a tiny sample isn't a trend, it's noise. Uses the existing
  `answeredAt` timestamp on `AttemptAnswer` (already in the schema, just
  unused until now) — no schema changes needed.
- **Daily Quiz: streak system + previous-score-for-this-topic.**
  Storage migrated from a single `studydesk_daily_quiz_v1` key (today's
  result only, overwritten daily) to a full history array
  (`studydesk_daily_quiz_history_v1`). New helpers in `Dashboard.tsx`:
  `computeStreak()` — consecutive calendar days ending today (or
  yesterday, if today's quiz just hasn't happened yet — a streak
  shouldn't zero out mid-day) — and `previousScoreForDomain()`, which
  finds your most recent *prior* completion of the same domain
  specifically (not just "yesterday's score," since the daily quiz
  rotates through all 5 domains by date via `pickDomainForDate`, so the
  same domain typically only recurs every ~5 days). Streak shown as a
  🔥 badge in the card header; previous score shown as a line under
  today's topic ("Last time on this topic: 7/10 (70%)").

## 📐 Study Plan roadmap (design discussion, not yet built)

A longer design conversation (partly with Gemini) produced a fuller
vision for what "Current Study Plan" could become — recorded here so
the ideas aren't lost, but explicitly **not** committed to for the
Aug 31 deadline. Worth revisiting post-deadline or if there's spare
time.

**Important context update:** StudyDesk is now confirmed to be going
**multi-user** (a group, not just personal use) — this changes the
priority of a couple of items below from "premature optimization" to
"actually relevant soon":
- The cached `UserDomainStat`-style table (see below) — live-computed
  queries are fine for one person's data on a local machine, but
  become a real concern once multiple people are hitting the same
  endpoints.
- More importantly, this makes **Pending #6 (Production auth +
  security hardening) a hard blocker, not a nice-to-have.** Every
  request currently runs as a single shared hardcoded `"anon"` account
  — with a real group of users, that's not a future security
  consideration anymore, it's an immediate correctness problem: without
  real per-user accounts, everyone's progress, attempts, and Study Plan
  data would collide into one shared identity from day one. Real auth
  needs to land *before* this goes to more than one person, not after.

- **Weighted Deficit Score for prioritization:**
  `(75% − Current Accuracy) × Exam Weight`, so a 10-point deficit in a
  26%-weighted domain outranks a 15-point deficit in a 12%-weighted one.
  (Note: today's simpler "weakest first" fix deliberately does *not* do
  this — see above. This would be a deliberate upgrade, not a bug fix,
  if pursued.)
- **Actionable "next best action" cards** instead of a static list —
  e.g. "Drill 10 Missed Questions" launching a filtered mini-quiz of
  previously-wrong questions in a weak domain, "Review 5 Weak Concepts."
  Requires: a way to query "questions this user got wrong," which is
  derivable from existing `AttemptAnswer` data (join to `Choice.isCorrect`),
  but the UI/flow to launch a filtered practice session from it doesn't
  exist yet.
- **Countdown-driven study phases**, tied to the exam date already
  tracked on the dashboard: early phase = broad weakness-hunting,
  mid phase = shift priority to high-weight domains (D4/D5), final
  1-2 days = light taper (flashcards/summary review only, avoid new
  material). Would need explicit phase-boundary logic keyed off days-
  until-exam.
- **Diagnostic gap categorization** (knowledge gap vs. application
  gap — theoretical/definition questions missed vs. scenario-based
  FIRST/BEST/MOST questions missed) to recommend flashcards vs. drilled
  practice accordingly. Would need question-level tagging beyond the
  current `category` field — not present in the schema today.
- **Readiness status badges per domain:** 🔴 Critical (<65% or
  untested high-weight domain), 🟡 In Progress (65-74%), 🟢 Exam Ready
  (≥75% *and* a minimum question-volume threshold, e.g. 50+ answered —
  so a domain can't look "ready" off 3 lucky guesses).
- **Blended Exam/Practice/Study readiness weighting**, discussed at
  length: Exam Mode attempts (timed, blind, closest to real conditions)
  should carry more weight toward "true readiness" than Practice
  (untimed, instant feedback, prone to false confidence from repeat
  exposure) or Study. A concrete proposal from that discussion: retake
  decay (a 2nd/3rd attempt at the same Practice set counts for much
  less than the 1st, to filter out answer memorization) and an overall
  Exam:Practice weighting like 60:40. **Concrete mechanism for retake
  decay** (from a follow-up Gemini conversation, worth preserving):
  add an `attemptNumber` field to `AttemptAnswer` (or derive it at query
  time from existing `Attempt.startedAt` ordering per user+question —
  either works, deriving avoids a migration), then weight accuracy
  calculations so `attemptNumber = 1` counts at 100% and subsequent
  attempts count at roughly 30–50%, rather than treating every attempt
  as equally informative. **Correction from that
  conversation, important to preserve:** Practice mode in this app is
  **not** domain/topic-filterable — it's 5 fixed full-length practice
  sets, structurally identical to Exam Mode minus the timer and with
  instant per-question feedback. Any design here needs to work within
  that constraint, not assume free-form practice-by-topic exists.
- **Cold-start / first-time-user flow:** a distinct onboarding state
  before any data exists — "Establish Your Baseline" CTA in place of a
  domain list, unlocking the real Study Plan logic only after the first
  Practice/Exam set or the diagnostic Assessment is completed. Partially
  exists already (today's Study Plan does show a "Take Assessment / I'll
  Do It Myself" CTA when nothing's been attempted) — the more elaborate
  multi-phase version (Setup → Calibration → Full Adaptive) is not built.
- **Single-mode fallback handling:** if a user only ever uses Practice
  (risk: inflated confidence from instant feedback) or only Exam (risk:
  no granular diagnostic signal), the readiness calculation and Study
  Plan guidance should adapt rather than silently assuming both are in
  use. Not implemented.
- **Cached per-user domain stats table** (e.g. `UserDomainStat`:
  `userId`, `domainId`, `practiceAccuracy`, `examAccuracy`,
  `lastAttemptAt`), recalculated on attempt submission rather than
  live-computed on every dashboard load. Skip-worthy for one person's
  data on a local machine; **actually worth doing once multiple users
  are hitting the same API** (see multi-user note above) — the current
  `/progress/domains` and `/progress/domains/trend` endpoints scan and
  aggregate raw `AttemptAnswer` rows on every request, which is fine at
  today's single-user scale but won't stay fine indefinitely as
  attempt history grows across several people.

---



- **Flashcards have zero tracking.** No session log, not part of Focus
  Areas/Strengths. Confirmed fine — it's a definitions-drilling tool, not
  meant to feed the readiness system.
- **Assessment retake:** no "retake" button exists by design — it's
  meant to be one-time diagnostic data. As of 2026-08-06 this is only
  enforced client-side (`localStorage`), not server-side — see Pending
  #6 for the plan to make it properly enforceable once real user
  accounts exist.

---

## 🔧 Pending / Next up (in stated priority order)

1. **Production auth + real per-user accounts — elevated to top
   priority, 2026-08-06.** StudyDesk is now confirmed going
   **multi-user** (a group, not solo use) — this is no longer a
   "before going public" nice-to-have, it's a correctness blocker.
   Bundles several related gaps, all stemming from the same root cause:
   - **No real authentication at all right now.** Every request in
     `server.ts` runs as a single hardcoded shared account
     (`ANON_USER_ID = "anon"`, password `"none"`). With more than one
     real person using this, everyone's progress, attempts, and Study
     Plan data would collide into that one shared identity — not a
     hypothetical risk, an immediate one as soon as a second person
     opens the app.
   - The assessment is meant to run **once ever per user**, but
     enforcement is currently a `localStorage` flag only — meaningless
     once there's more than one person, since it's not even tied to an
     identity at all right now. True one-time enforcement needs a
     server-side check tied to a real user account (e.g. a
     `hasCompletedAssessment` flag checked via API before the modal can
     open).
   - **CORS is wide open** (`origin: true` in `server.ts`) — needs
     locking down to the exact deployed frontend domain before going
     public.
   - **No rate limiting** on the API — needed both against abuse and
     to avoid burning through free-tier hosting quotas.
   - Once real accounts exist, the cached `UserDomainStat`-style table
     idea (see Study Plan roadmap above) also becomes worth doing, not
     just theoretical — live-aggregating raw `AttemptAnswer` rows on
     every dashboard load is fine for one person, less fine for several.
2. **Practice module** — routing is broken; UI needs an overhaul.
3. **Study module answer-color bug** — correct answers sometimes show
   red instead of green.
4. **Exam landing page** — goes blank on "Back to Setup" navigation.
5. **Settings page** — gear icon currently only has the theme toggle.
   Display name editing was pulled out of the header early on and was
   meant to move here; never built. (Now more clearly needed once real
   accounts exist — this is presumably where per-user display name
   actually belongs.)
6. ~~Assessment-related idea (unspecified)~~ — **done, 2026-08-06.** Turned
   out to be two concrete bugs: the assessment silently closed with no
   results screen shown (score, per-domain breakdown were computed but
   never rendered), and a promised-but-never-built Hybrid/Adaptive
   toggle. Both addressed — though the toggle itself was later removed
   entirely rather than fixed, once Current Study Plan's whole
   selection logic was redesigned the same day (see the "Current Study
   Plan redesign" entry above) to just show weak domains directly,
   which made Hybrid-vs-Adaptive a distinction without a difference.
7. **Game scores** — currently not persisted to the database; move
   them there.
8. **Dashboard metrics** — connect remaining placeholder metrics to
   real data.
9. **Exam intro page** — not yet built.
10. **General UI polish** — background image and other visual
    refinements. Dashboard's current look was flagged as "too white,
    lifeless, boring" — plan is to explore a redesign in Figma
    (html.to.design plugin against an exported HTML/CSS snapshot) rather
    than iterating live in code.
11. **Production deployment** — decided **against** Google Cloud (Cloud
    SQL isn't free-tier). Current plan, given "free tier only": **Vercel**
    (frontend) + **Render** free Web Service (API — accept the 15-min
    idle spin-down/cold-start tradeoff) + **Neon or Supabase** (Postgres —
    both have a genuinely permanent free tier, unlike Railway which
    dropped its free tier in favor of a 30-day $5 trial requiring a
    card). Blocked on: the 18 hardcoded `localhost`/`127.0.0.1`
    references in the frontend need to become an env var, and item 1
    above (auth/security) must land *before* this goes live to the
    group, not after — this is now a hard dependency, not a suggestion.
12. **Spot-check the D4 question-category reassignments** done during
    the 2026-08-06 data integrity audit against live ISACA Perform, since
    those were resolved by inference rather than direct re-verification
    (see note above).

## 📋 Deferred (explicitly, not forgotten)

- **Mobile/responsive layout** — after desktop is fully polished.
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
api/src/server.ts                                 (latest-practice endpoint; Fisher-Yates shuffle fix; new /progress/domains/trend endpoint, 2026-08-06)
api/data/questions.json                            (full data integrity audit/fix, 2026-08-06)
api/prisma/seed.ts                                  (unchanged, but see legacyId stability note above)
frontend/src/layout/DashboardLayout.tsx            (sidebar removed, back-button added)
frontend/src/layout/Sidebar.tsx                    (orphaned — nothing imports it)
frontend/src/pages/Dashboard/Dashboard.tsx           (assessment results wiring; Current Study Plan redesign; Daily Quiz streak, 2026-08-06)
frontend/src/pages/Dashboard/AssessmentQuizModal.tsx (results phase added, 2026-08-06)
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
