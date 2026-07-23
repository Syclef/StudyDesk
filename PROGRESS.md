# CISA Prep — Progress Tracker

Last updated: 2026-07-23 (after commit `2043354`)

This file exists so we don't have to reconstruct project history from chat
scrollback. Update it whenever a feature lands or a decision gets made —
treat it as the source of truth for "what's actually done" vs. "what's
still an idea."

---

## ✅ Done

### Dashboard
- Current Study Plan — gated behind a one-time 25-question Assessment
  (5 questions/domain). Hybrid (unstudied-first, then weakest) vs Adaptive
  (always-weakest) modes, auto-recommended from assessment results,
  manually overridable. Clicking a domain deep-links into Study, scrolled
  to and expanded on that section.
- Focus Areas — split into two columns: Study-only and Practice-only weak
  domains (untried domains count as weak too, not excluded). Weak
  threshold = 75% (the real passing rate). Clicking a domain jumps
  directly into the single weakest *category* inside it (not just the
  domain), with a "why this section?" context modal showing the real
  numbers behind the recommendation. Exam's weak domains are intentionally
  not duplicated here — they live in Overall Readiness's color-coded
  legend instead.
- Overall Readiness — Exam-only. Defined as **pass rate over your most
  recently completed cycle** (one attempt per each of the 5 Exam Sets),
  not an average and not all-time (both were considered and rejected —
  see "Key decisions" below). Domain legend beside the ring is
  color-coded (red/amber/green) so exam-driven weakness is visible even
  though it's not in a Focus Areas column.
- Study Streak, Daily Quiz (domain rotates via a date-seeded hash, not
  simple day-of-year cycling) — unaffected by Flashcards or partial
  Practice/Exam sessions.
- Info icons (ⓘ) throughout use a shared `InfoModal` component instead of
  clipped inline tooltips.
- Recent Activity card removed (deemed not useful).
- Fixed-viewport layout (`height: 100vh`, `overflow: hidden`, flex-ratio
  sections) — no page-level scrolling, ever.

### Study
- Categories within an expanded domain sort weakest-first, using combined
  Study+Practice+Exam per-category accuracy (`/progress/categories`), with
  a "Focus here" badge on the single genuinely-weak one (if any).
- Deep-link support (`study_open_domains` / `study_scroll_target` in
  sessionStorage) so Dashboard links land you in the right place, not just
  the generic Study page.

### Practice / Exam
- Practice counts progressively — an abandoned/partial Practice attempt
  still contributes its answered questions to domain/category stats
  (Study and Exam still require full submission).
- Exam Sets are now correctly attributed by their real `mockSlot`, not by
  chronological position (this was a real pre-existing bug — see "Bugs
  fixed" below).
- Exam cycle tracking (`utils/examCycles.ts`, shared between Dashboard and
  ExamLandingPage): a cycle = one attempt on each of the 5 distinct Exam
  Sets. Retaking a set before the cycle completes replaces that set's
  score for the cycle rather than corrupting or double-counting it.
  Already-used-this-cycle sets show a badge + soft-lock confirmation
  before retaking.

### API
- `/progress/domains` and `/progress/domains?mode=X` — combined or
  mode-scoped per-domain accuracy, using "most recent answer per question"
  so retakes don't inflate/deflate stats.
- `/progress/categories` (+ `?mode=X`) — same logic, grouped by category
  instead of domain.
- `/attempts` includes `mockSlot`.

---

## 🟡 Known simplifications (working as intended, not bugs)

- **Flashcards have zero tracking.** No session log, doesn't count toward
  Streak, not part of Focus Areas. Confirmed fine — it's just a
  definitions-drilling tool, not meant to feed the readiness system.
- **Assessment is genuinely one-time, no retake.** Confirmed intentional
  — user has plans that build on this (see Pending).
- **Domain weights (18/18/12/26/26%) aren't factored in anywhere yet.**
  Confirmed this matters specifically for the **Exam module** — that's
  the whole point of Exam replicating real conditions. Not yet built
  anywhere (see Pending).

---

## 🔧 Pending / Next up (in stated priority order)

1. **Practice-column weak-category fix** — clicking a weak domain in the
   Practice column currently finds the weakest *category* using combined
   (Study+Practice+Exam) data, not Practice-specific data. Needs its own
   Practice-scoped category lookup so the "why this section?" modal and
   the category it sends you to are both honestly Practice-based.
2. **Sidebar redesign** — open question, possibly removing the sidebar
   entirely. No direction decided yet.
3. **Settings page** — gear icon currently only has the theme toggle.
   Display name editing was pulled out of the header early on and was
   meant to move here; never built.
4. **Domain weighting in the Exam module** — apply the real CISA weights
   (18/18/12/26/26%) somewhere in Exam-specific scoring/readiness logic.
   Explicitly confirmed as a priority, tied to Exam being the
   "real conditions" simulator.
5. **Assessment-related idea (unspecified)** — user has a concrete plan
   here they haven't detailed yet; flagged as likely "next" once the
   above settle.

## 📋 Deferred (explicitly, not forgotten)

- **Mobile/responsive layout** — after desktop is fully polished, one
  version at a time.
- **Multi-user/production migration** (real accounts replacing the
  localStorage-based bits: exam date, assessment result, study plan mode,
  daily quiz) — after everything else is polished.

---

## Key decisions worth remembering (so we don't re-litigate them)

- **Overall Readiness = pass rate over last completed cycle**, not an
  average. Rejected average because two strong attempts can mask three
  weak ones. Rejected all-time pass rate because early struggling
  attempts would permanently cap the number even after genuine
  improvement.
- **Cycle = 5 distinct Exam Sets**, not "last 5 testing days" (an earlier,
  now-abandoned version) — chosen because it maps exactly onto the app's
  real content (there are exactly 5 Exam Sets), making "100%" a genuine,
  complete claim rather than an arbitrary sample size.
- **Weak threshold = 75%**, matching the real passing rate everywhere
  else — not 60%. This was a real bug (mismatch) fixed after confusion
  about Focus Areas showing "only 3 domains."
- **Untried domains count as weak**, not excluded. "Unanswered" = 0% =
  not passing.
- **This app never claims to predict real ISACA exam results** — Overall
  Readiness's info modal explicitly disclaims this. It measures
  consistency on this app's own mock exams only.

---

## File map (touched this session)

```
api/src/server.ts
frontend/src/pages/Dashboard/Dashboard.tsx
frontend/src/pages/Dashboard/InfoModal.tsx        (new)
frontend/src/pages/Dashboard/DailyQuizModal.tsx
frontend/src/pages/Dashboard/AssessmentQuizModal.tsx
frontend/src/pages/Dashboard/HelpModal.tsx
frontend/src/pages/Exam/ExamLandingPage.tsx
frontend/src/pages/Exam/examUtils.ts
frontend/src/pages/Study/StudyPage.tsx
frontend/src/pages/Practice/PracticeCategories.tsx
frontend/src/pages/Practice/PracticeSessionPage.tsx
frontend/src/utils/examCycles.ts                  (new)
frontend/src/layout/Sidebar.tsx
```
