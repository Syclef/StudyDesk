# CISA Prep — Progress Tracker

Last updated: 2026-07-24 (after CISA domain weight fix)

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

---

## 🐛 Known data issue (not a code bug — flagged, not yet fixed)

- Found via manual inspection: some questions in the **"Cloud and
  Virtualized Environments"** category are tagged `domain = 'D5'` in the
  database, but per the user's review of actual question content, that
  category should only exist under **D4**. This is a question-seeding
  mistake, not a dashboard bug — the dashboard correctly reports whatever
  domain/category pairing actually exists in the DB. Fix is a manual SQL
  `UPDATE` on the affected rows (query provided in chat, not yet run as
  of this writing). Worth checking whether other categories have the
  same cross-domain duplication pattern once this one's confirmed fixed.

---

## 🟡 Known simplifications (working as intended, not bugs)

- **Flashcards have zero tracking.** No session log, not part of Focus
  Areas/Strengths. Confirmed fine — it's a definitions-drilling tool, not
  meant to feed the readiness system.
- **Assessment is genuinely one-time, no retake.** Confirmed intentional
  — user has a concrete follow-up idea that builds on this (see Pending).

---

## 🔧 Pending / Next up (in stated priority order)

1. **Settings page** — gear icon currently only has the theme toggle.
   Display name editing was pulled out of the header early on and was
   meant to move here; never built.
2. **Assessment-related idea (unspecified)** — user has a concrete plan
   here they haven't detailed yet.
3. **Fix the D5/"Cloud and Virtualized Environments" data mistag** (see
   Known data issue above), then audit for similar cross-domain category
   name collisions elsewhere in the question bank.

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
api/src/server.ts                                 (latest-practice endpoint added)
frontend/src/layout/DashboardLayout.tsx            (sidebar removed, back-button added)
frontend/src/layout/Sidebar.tsx                    (orphaned — nothing imports it)
frontend/src/pages/Dashboard/Dashboard.tsx
frontend/src/pages/Dashboard/InfoModal.tsx
frontend/src/pages/Dashboard/DailyQuizModal.tsx
frontend/src/pages/Dashboard/AssessmentQuizModal.tsx
frontend/src/pages/Dashboard/HelpModal.tsx
frontend/src/pages/Exam/ExamLandingPage.tsx
frontend/src/pages/Exam/examUtils.ts
frontend/src/pages/Study/StudyPage.tsx
frontend/src/pages/Practice/PracticeCategories.tsx
frontend/src/pages/Practice/PracticeSessionPage.tsx
frontend/src/utils/examCycles.ts
```
