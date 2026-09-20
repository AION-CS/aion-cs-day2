# Retention Lab · Day 2

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 1, Day 2 of 2.**
*Applying behaviour-based sales strategy and systematic customer retention.*
A self-study companion: study material, two working documents (a Diagnostic Note and a Calculation Note) and two
live instruments (a funnel and a lever calculator). One route per level. Routes 1 and 2 are built; Route 3 is a
placeholder.

The case company is **DigitalIT Solutions GmbH**, a mid-size B2B IT services vendor in Germany (project
implementations and retainer support contracts): *many leads, few closings, weak retention.* Every figure in
Routes 1 and 2 is exactly as briefed, so Route 3 (a €150,000, four-month budget case) can reuse it.

This repo was bootstrapped from `day1` (same chrome, primitives, store pattern and tokens) and its content was
replaced. The Day 1 history is kept; nothing of the Kessler case remains in the tree.

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` | Level 1 · Materi A (A1–A4, 30 min) → Task 1 Diagnostic Note (15 min): sort the six funnel stages into journey phases (1.1), transcribe the funnel's figures (1.2), name the stage with the largest negative gap (1.3), one judged sentence on what the leak costs (1.4) | `{no}-{name}-day2-l1-diagnostic.html` |
| `/route-2/` | Level 2 · Materi B (B1–B4, 30 min) → Task 2 Calculation Note (15 min): net-impact grid 3 options × 2 segments (2.1), which cells are a loss (2.2), one option per segment defended with a € figure (2.3), one option for both segments and what it gives up (2.4) | `{no}-{name}-day2-l2-calculation.html` |
| `/route-3/` | Level 3 · Management decision. **Placeholder**: page, nav entry and an empty store slice, so the shape of the site does not change when it is filled in | none yet |

Material minutes: A = 8 + 8 + 8 + 6 = 30, B = 8 + 7 + 7 + 8 = 30. The task minutes (15 each) are split per block on the page.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind (tokens in `tailwind.config.ts`, the CS palette) · Zustand +
`persist` (key `cs-d2-v1`, version 1, `skipHydration` + `StoreHydrator`, deep `merge`) · static export
(`output: "export"`, `trailingSlash`). No animation, drag-and-drop, PDF or chart library: hand-written SVG, CSS
keyframes, native HTML5 DnD with a click-to-place fallback, `window.print()`. Hosting in a sub-folder: set
`NEXT_PUBLIC_BASE_PATH`.

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run verify:calc  # re-derives the Task 2 figures and compares them with the briefed results (±€5)
npm run build        # writes the static site to out/  (stop `npm run dev` first)
```

## Layout

```
app/                  page.tsx (home) · route-1/ · route-2/ · route-3/ (placeholder)
components/chrome/    MentorBar, TopBar, ParticipantStrip, SectionRail, HashFlash, Footer, StoreHydrator
components/ui/        MaterialCard, FunnelInstrument, LeverCalculator, AnswerBlock, AnswerKey, ExportBar, MissingList, Field …
components/materi/    MateriA (A1–A4), MateriB (B1–B4), Materi (the two blocks + references)
components/task1|2/   Task 1 (SortBoard, FillTable, WeakestBlock) and Task 2 (Blocks: grid, loss marks, recommendations, one option)
data/                 funnel, touchpoints, segments, references, materialIndex, mentorKey
lib/                  checks, missing, progress, exportDoc, answerKey, parseAmount, slug, flash, svg
store/                useStore (slices l1, l2, route3), selectors (Route 2 reads Route 1's answers here)
scripts/              verify-calc.mjs
```

## Mentor bar

The first element on every page. Enter `muchson123` once and every model answer of Routes 1 and 2 fills in (plus a
participant number and name if empty), so each export downloads straight away. The same unlock shows a mentor-only
**answer key** (in rust, never the amber accent) next to each exercise with fixed options: the sort, the largest-gap
pick, the recommendation per segment and the single-option question. Each key gives the expected answer, a reason per
option including why each rejected option is rejected, and a teaching note. Client-side convenience gate, not security;
the unlock is session-only, so a reload locks it. Model answers: `data/mentorKey.ts`; keys: `lib/answerKey.ts`.

## Cross-route continuity

Task 2's **segment selector opens locked** (visibly disabled, a `LOCKED` tag, the tooltip *"Unlocks once you've named
the weakest funnel stage in Task 1"*). Clicking it takes you to that field in Route 1 and flashes it; the rest of the
page and the given data stay open (CLAUDE.md #6, #16). Task 2's recommendation block quotes the learner's own Task 1
answers back in a small box (`store/selectors.ts`) and never introduces a case fact they have not derived.

## Notes on deviations from the brief

The day's prompt was built to the shared rules (CLAUDE.md #18: the prompt decides the material, the tasks and the
gamification; the rules decide the structure, style and mechanics). Where they differ, the rule was followed:

1. **Three routes, one per level, not "Route 1 = Level 1 + Level 2".** The prompt put both levels in Route 1 and Level 3 in
   Route 2. CLAUDE.md #12 fixes three routes per day with one export each, so Level 1 is Route 1, Level 2 is Route 2 and
   Level 3 is Route 3 (a placeholder). Route 3's case (€150,000 over four months) is unchanged. If the two-level Route 1
   is wanted for good, the shared rule has to change first.
2. **Export names follow the CS form.** The prompt asked for `2-{name}-day2-route1-l1` and `3-{name}-day2-route1-l2`.
   CURRICULUM-GUIDE §7 makes the leading number the Participant No. and the slug the level and deliverable:
   `1-muchson-day2-l1-diagnostic`, `1-muchson-day2-l2-calculation`.
3. **The discount is charged on every repeat order, not only the extra ones.** The prompt's formula said the discount
   applies only to the additional orders it generates, but its pinned results (B = +€11,328 for project clients, −€8,832
   for retainer clients, +€2,496 uniform) only reproduce when the discount is paid on the baseline orders too:
   (1 + 1.12) × €60,000 × 8% = €10,176 and (4 + 0.72) × €60,000 × 8% = €22,656. The pinned results win, since they are the
   ones Route 3 will reuse. This is also the lesson of B4 (a discount pays for orders that would have come anyway).
   `npm run verify:calc` pins all nine figures.
4. **Block 1.4 does not print "55".** The prompt wrote "losing ~55 prospects a year at that stage". 55 is 96 − 41, so
   printing it in Block 1.4 would name the answer to Block 1.3, which the brief says the task must never do. Block 1.4
   says "the leak at the stage you named in Block 1.3". The sentence check accepts a figure derived from any step.
5. **Average contract value (€60,000) is shown in Task 1's case brief** (labelled *Case assumption*). The prompt gives it
   only in Level 2, but a euro cost of the leak in Task 1, which Task 2 then quotes, needs a price. It is the same number
   Task 2's calculator uses.
6. **The funnel highlight is a gap bar plus a rust hatch, not the widest contraction.** With bar widths on a log scale
   (so 24,000 and 4 fit one screen) the widest contraction is Visitors → Leads. The largest gap (Booked → Held, −32.3 pp) is
   drawn in rust with a hatch, on its connector and on its gap bar, computed from the data; nothing names it as the problem.
7. **The segment "table" stays readable while its selector is locked.** The prompt said the segmentation table opens
   locked. CLAUDE.md #6 and #16 allow a soft lock on a control, not on content, so the given data stays open and the
   segment selector (the control that depends on Task 1) is the locked part.
8. **After-sales stays empty in the sort.** The six funnel stages all end at the signature, so none is after-sales. That is
   deliberate (A2 teaches it), and it is why the sort's check counts how many rows hold and never names which.
9. **Set-level checks for three-way and yes/no tags.** The sort (three phases) and the loss marks (six yes/no cells) report
   only how many hold (CLAUDE.md #12, #13); numeric cells and the two forced picks outline in amber with one clue each.
10. **"Kurang" messages are in English.** The site is English only (CURRICULUM-GUIDE §1); the missing list reads
    "Block 1.2: … has no gap (pp)" and each entry jumps to the exact field.
11. **The mentor auto-fill lives in the top bar only.** The prompt asked for a passcode button on the route; the shared
    MentorBar (CLAUDE.md #7) already fills every route and adds the answer keys, so no second per-route button was added.
12. **`UX-STANDARDS.md` was replaced by a pointer** to the shared `CLAUDE.md`; the copy it held described the older Green IT days.
