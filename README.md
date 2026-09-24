# Retention Lab · Day 2

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 1, Day 2 of 2.**
*Applying behaviour-based sales strategy and systematic customer retention.*
**This is a Friday day** (`../CLAUDE.md` #29): learners leave early, so the day is **one capstone route of about two hours**
(60 min of material, 60 min of task) that carries one case through all three levels and ends in one document, the **Case File**.
The full Level 2 and Level 3 routes are kept as **optional Routes 2 and 3**, listed only after a small button is pressed.
A self-study companion: study material, three live instruments (a funnel, a lever calculator and a budget-allocation grid) and
the working documents built on them.
It carries the shared standards `../CLAUDE.md` #1 to #28 (the day-1 level of interaction): a home page that opens with what the day is about and what is in it for the
learner, a page map on every route, an "In plain words" box on every card, hidden helps under every calculation, and mentor worked answers
for every task question.

The case company is **DigitalIT Solutions GmbH**, a mid-size B2B IT services vendor in Germany (project
implementations and retainer support contracts): *many leads, few closings, weak retention.* Every figure is exactly as briefed, so the decision stage (a €150,000, four-month budget case) reuses the diagnosis and the calculation.

This repo was bootstrapped from `day1` (same chrome, primitives, store pattern and tokens) and its content was
replaced. The Day 1 history is kept; nothing of the Kessler case remains in the tree.

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` **Capstone** | **Materi A**: six cards, two per level, 10 min each (A1 buying motive → sales action, A2 the journey and the funnel read by its gaps · A3 three levers and what each nets, A4 segments and why a discount is weak · A5 goal → action → KPI and a governed system, A6 scale, sequence, owner, cadence, trigger). **Case File**, one case brief and three stages: *Stage 1 · Diagnose* (about 15 min: sort the touchpoints 1.1 and write down the funnel's figures 1.2, both Optional; name the largest negative gap 1.3 and what the leak costs 1.4, both Core), *Stage 2 · Calculate* (about 20 min: net-impact grid 2.1, one option per segment 2.3, one option for both segments 2.4, Core; loss marks 2.2, Optional), *Stage 3 · Decide* (about 25 min: allocation 3.1, rollout order 3.2, what was cut 3.3, governance 3.4, the postponed measure 3.5, all Core). Each stage opens with a "Carried forward" panel of the learner's own earlier answers. | `1-{name}-day2-case-file.html` |
| `/route-2/` *optional* | The full Level 2: Materi B (B1–B4, 30 min) → Task 2 Calculation Note (15 min). Same blocks 2.1–2.4 and the same answers as Stage 2. | `2-{name}-day2-l2-calculation.html` |
| `/route-3/` *optional* | The full Level 3: Materi C (C1–C4, 30 min) → Task 3 Decision Memo (15 min), the memo assembling itself beside the questions. Same blocks 3.1–3.5 and the same answers as Stage 3. | `3-{name}-day2-l3-memo.html` |

Route 1 material minutes: 6 × 10 = 60. Stage minutes 15 + 20 + 25 = 60; the **Core** blocks alone (about 50 min) make a complete Case File, and the **Optional** blocks are never listed as missing. The optional routes keep their own minutes (Materi B and C 30 each, tasks 15 each).

**Optional routes.** By default the home page, the top navigation and Route 1 show Route 1 only. A small quiet button under the Route 1 card (and a one-line notice at the end of Route 1) lists Routes 2 and 3 as cards and nav entries labelled "Optional"; the choice is saved (`ui.optionalRoutesShown`). Hidden is not locked: `/route-2/` and `/route-3/` open by URL at any time, and opening one lists them from then on.

**Shared answers.** Route 1's stages and the optional routes use the same store slices (`l1`, `l2`, `route3`), so an answer written in Stage 2 is already in Route 2, and the other way round.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind (tokens in `tailwind.config.ts`, the CS palette) · Zustand +
`persist` (key `cs-d2-v1`, version 4 with a `migrate` step, `skipHydration` + `StoreHydrator`, deep `merge`) · static export
(`output: "export"`, `trailingSlash`). No animation, drag-and-drop, PDF or chart library: hand-written SVG, CSS
keyframes, native HTML5 DnD with a click-to-place fallback, `window.print()`. Hosting in a sub-folder: set
`NEXT_PUBLIC_BASE_PATH`.

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run verify:calc  # re-derives the Task 2 figures and the Task 3 programme totals and compares them with the briefed results
npm run build        # writes the static site to out/  (stop `npm run dev` first)
```

## Layout

```
app/                  page.tsx (home) · route-1/ · route-2/ · route-3/
components/chrome/    MentorBar, TopBar, ParticipantStrip, SectionRail, PageNav, GlossaryPanel, HashFlash, Footer, StoreHydrator
components/ui/        MaterialCard, FunnelInstrument, LeverCalculator, AnswerBlock, AnswerKey, MentorGuide, RevealHint, FormulaBuilder, CalcDiagnosis, ExportBar, MissingList, Field …
components/materi/    CapstoneCards (A1–A6, Route 1), MateriA / MateriB / MateriC (the diagrams the capstone reuses; B and C also hold the full cards of Routes 2 and 3), Materi (the three blocks + references)
components/capstone/  Capstone (brief, stages, Core/Optional tiers, the Case File export), CarriedForward (handover panel + reference position)
components/task1|2|3/ Task 1 blocks (SortBoard, FillTable, WeakestBlock), Task 2 (Blocks: grid, loss marks, recommendations, one option; `Task2Workspace`), Task 3 (AllocationGrid, SequenceBlock, MemoFields, MemoPanel; `Task3Workspace`). The workspaces are shared by Route 1 and the optional routes
data/                 funnel, touchpoints, segments, program, references, glossary, materialIndex, materialPlain, dayIntro, pageNav, mentorKey
lib/                  checks, program, missing, progress, exportDoc (incl. `caseFileBody`), answerKey, mentorGuide, calcBuilder, materiAlias, useOptionalRoutes, parseAmount, slug, flash, svg
store/                useStore (slices l1, l2, route3), selectors (Route 2 reads Route 1's answers here)
scripts/              verify-calc.mjs
```

## Plain-language glossary

Every technical term, abbreviation and German word in the material and the tasks is an entry in `data/glossary.ts` (the shared
Day 1 entries plus this day's funnel, sales-strategy, lever and governance terms). In the text it is a dotted-underlined
button (`lib/glossify.tsx`); a click opens one explanation card (`GlossaryPanel`) written for a non-expert. Cards, bullets,
tables, callouts, captions and field help are glossified automatically; other prose is wrapped in `<Gloss>`. Rule:
`../CLAUDE.md` #19.

## What a learner sees on top of the material and the tasks

- **Home page** (`data/dayIntro.ts`, CLAUDE.md #27): "What today is about" with the case and one tile per route (verb, question, the export it ends in), then "What's in it for you", six skills with their pay-off at the learner's own work, each tagged with the route that teaches it. Every figure in it is one the day itself prints.
- **Page map** (`components/chrome/PageNav.tsx`, `data/pageNav.ts`, #28): every card and every task block of the route, in page order. A slim column of pills on the right at 1280 px and wider, a "Jump to" button below that. A card marked read or a block filled in carries a teal dot; the pill for the part in view is dark.
- **"In plain words" box** on every card (`data/materialPlain.ts`, #22): the idea in everyday words, why it matters for the case, and how to read the picture below. A full `Record<MaterialId, …>`, so a card without one fails the typecheck.
- **Hidden helps under a calculation** (#21, #24, #26): Block 1.4 (the cost of the leak) and every cell of Block 2.1 carry "Show the formula" (in words, no numbers, naming the card that teaches it, plus an automatic calculator that splits it into small labelled parts) and "Show where the numbers are" (the printed rows, each a button that scrolls to and flashes its row or bar). After a check, a wrong part is outlined in amber and names the table, the row and which part of the row to read, never the value; a flagged answer always gets a specific "What to check" line. Block 2.4 has the same two helps built on the learner's own grid. Parts and part flags are persisted (`l1`, `l2`), which is why the persist version is 4.
- **Test questions for the assignment exercises** (#25): the sort in Block 1.1 and the owner column of Block 3.4 both ask the learner to put an option on an item. Materi A2 carries one test per phase, the tests for the confusable pairs, a phase profile table and a worked sort on a different company (Alpenwerk) explained per stage; Materi C4 carries a profile of every owner option, the tests for owner, cadence and trigger, and a governance example that explains each of its three columns. Both blocks have a hidden "Show the test questions".
- **"What this shows"** under every exploratory control (#20): the funnel arrows, the lever calculator and the allocation grid join the material diagrams.

## Mentor bar

The first element on every page. Enter `muchson123` once and every model answer of Routes 1, 2 and 3 fills in (plus a
participant name if empty; it also fills every formula calculator's parts), so each export downloads straight away. The same unlock shows two
mentor-only tools, in rust and never the amber accent:

- an **answer key** next to each exercise with fixed options: the sort, the largest-gap pick, the loss marks (2.2), the recommendation per
  segment, the single-option question, the allocation (3.1), the sequencing answer, the owner and cadence per funded item (3.4) and the pickup
  point (3.5). Each key gives the expected answer, a reason per option including why each rejected option is rejected, and a teaching note;
- a **worked answer** for every other question (`lib/mentorGuide.ts`, #23): each row of the table in 1.2, the cost sentence in 1.4, each of the six
  grid cells in 2.1, the loss marks, both justifications, the trade-off, the allocation, what was cut, the trigger per funded item and the
  postponed measure. A calculation is a table of *step · calculation · result* with the real numbers, then *why*, then the typical wrong answers
  with the number each produces. Free text gets the model answer and what a good answer must contain. Every number is computed from the same
  constants as the tables, the calculator and `data/mentorKey.ts`.

Task 3 also shows a rubric-evidence panel (the objective items computed from the learner's own state). Client-side convenience gate, not security;
the unlock is session-only, so a reload locks it. Model answers: `data/mentorKey.ts`; keys: `lib/answerKey.ts`; worked answers: `lib/mentorGuide.ts`.

## Cross-route continuity

Task 2's **segment selector opens locked** (visibly disabled, a `LOCKED` tag, the tooltip *"Unlocks once you've named
the weakest funnel stage in Task 1"*). Clicking it takes you to that field in Route 1 and flashes it; the rest of the
page and the given data stay open (CLAUDE.md #6, #16). Task 2's recommendation block quotes the learner's own Task 1
answers back in a small box (`store/selectors.ts`) and never introduces a case fact they have not derived.

Task 3's **allocation grid opens locked** the same way (tooltip *"Unlocks once you've diagnosed the leak and chosen a lever in Routes 1 and 2"*): it opens once Route 1 has a named weakest stage and Route 2 has one option for both segments. Clicking any locked control takes you to the field that opens it. Memo section 1 quotes the leak sentence and the chosen lever verbatim; if Routes 1 and 2 are unfinished it says so plainly and points there.

## Notes on deviations from the brief

The day's prompt was built to the shared rules (CLAUDE.md #18: the prompt decides the material, the tasks and the
gamification; the rules decide the structure, style and mechanics). Where they differ, the rule was followed:

1. **Three routes, one per level, not "Route 1 = Level 1 + Level 2".** The prompt put both levels in Route 1 and Level 3 in
   Route 2. CLAUDE.md #12 fixes three routes per day with one export each, so Level 1 is Route 1, Level 2 is Route 2 and
   Level 3 is Route 3. Route 3's case (€150,000 over four months) is unchanged. If the two-level Route 1
   is wanted for good, the shared rule has to change first.
2. **Export names follow the CS form.** The prompt asked for `2-{name}-day2-route1-l1` and `3-{name}-day2-route1-l2`.
   CURRICULUM-GUIDE §7 makes the leading number the route's own number, added automatically (there is no number field, only a
   name), and the slug the level and deliverable: `1-muchson-day2-l1-diagnostic`, `2-muchson-day2-l2-calculation`,
   `3-muchson-day2-l3-memo`.
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
12. **Route 3 numbering.** The Route 3 prompt called itself "Route 2 (Level 3)" and asked for `4-{name}-day2-route2-l3`. It is `/route-3/` and exports `{no}-{name}-day2-l3-memo` (deviations 1 and 2). The grid's lock tooltip reads "Routes 1 and 2" because Route 1 of the prompt is Routes 1 and 2 here.
13. **Option B fits inside the budget, so nothing has to be cut on cost.** The four items cost €175,000 with Option A and €159,800 with Option C, but only €118,000 with Option B (€0 upfront), which leaves €32,000 unspent. The costs are kept as briefed. The grid therefore never claims a shortfall it does not have: the over-budget message appears only when the allocation is over, Block 3.3 changes its wording when everything is funded on cost (it asks what the discount's margin cost or the 7 pp left open exposes), and the mentor panel flags this. The margin cost of the discount (about €32,800 a year for both segments) is paid outside this budget; if it should count against it, the brief has to say how.
14. **Partial scope exists only for the lever.** The brief allowed partial-scope stops per item but gave costs only for the lever. The lever can be funded for both segments, retainer clients only or project clients only; its cost is the per-client cost times the clients in scope (derived from Task 2), and its net impact is the sum of the segments' Route 2 figures. Items 2 to 4 are fund or not fund, in full, so no cost is invented.
15. **The sequencing rule is stated generally.** The brief gave the warning for a lever that launches before the dashboard. The widget applies it to a lever that starts before or in the same month as the dashboard, or with no dashboard, and prints the same sentence with the months that apply (month 1 and the dashboard in month 1 gives the briefed text exactly). The "what goes missing" question is one pick among the three dashboard KPIs (the repeat-purchase rate is the answer).
16. **A trigger must name a number.** The brief asked for owner, cadence and trigger; Block 3.4 also requires the trigger to contain a threshold (a digit), which is what the material (C4) teaches.
17. **`UX-STANDARDS.md` was replaced by a pointer** to the shared `CLAUDE.md`; the copy it held described the older Green IT days.
18. **Upgrade to the day-1 standards (#20 to #28) changed features only.** The number of cards (12), their minutes (30 per route) and the task minutes (15 per route) are as before. Two cards grew in length, not in number: A2 gained a phase table and a worked sort (#25), and C4 gained an owner-profile table and the test questions.
19. **Block 1.2 has no formula calculator.** Its three columns are read off the funnel (the conversion, the "ref" figure and the gap are all printed), so a builder would only re-print them. Its worked answer per row shows where each printed figure comes from.
20. **The helps of Block 2.1 live in one panel under the grid, not under each cell.** The grid is a two-column layout (CLAUDE.md #14), and a formula calculator with four to six parts does not fit in half a column. Each cell has a "Help for this cell" button that opens the panel on that cell; a check that flags a part opens it by itself, so a flag is never behind a closed panel.
21. **Block 1.4's calculator is built on the arrow the learner named in Block 1.3.** Its part labels and clues say "the arrow you named", never a stage, so the help does not hand over the answer to 1.3. If nothing is named yet it says so and points there.
22. **Task 3 has no numeric answer field.** Its only figures (the total, the remaining budget, the lever's cost by scope) are computed by the app and printed live, so #21, #24 and #26 have nothing to attach to; its questions are covered by the answer keys (#7) and the worked answers (#23).
23. **Owner profiles are a Case assumption.** The prompt gave the owner options but not what each role does. The profile lines (`OWNER_PROFILE` in `data/program.ts`) are a practitioner observation for a company of this kind, labelled so on screen, and are the single source for the material table, the hidden help and the answer key.
24. **The model owner for the sales training is a mentor-side choice.** The model allocation leaves the training out, so the model answer has no governance row for it. `GOV_EXPECT.train` (Sales team lead, monthly) exists only so the answer key has an expected answer if a learner funds it.
25. **Day 2 is a Friday day, so Route 1 is now a capstone (CLAUDE.md #29).** Deviations 1, 2 and 12 above describe the earlier layout (three routes, one per level, each with its own export). Route 1 (Materi A + Task 1) was replaced by the two-hour capstone; the Route 2 and Route 3 that were already built are kept unchanged in form and hidden behind a small button. The old Route 1 (Diagnostic Note, its four A cards) is in git history.
26. **The capstone reuses the day's tasks instead of writing new ones.** Its stages are the answer blocks of Tasks 1 to 3 (same numbers 1.1–3.5, same helps, keys and worked answers), each tagged **Core** or **Optional**. This is why the optional routes share answers with it. The blocks and their Core minutes (Core about 50, everything about 60) are set in `components/capstone/Capstone.tsx`.
27. **Materi A was rewritten for the capstone.** Six cards, two per level, built from the diagrams of the full Materi A, B and C. The old cards A3 (trust, relevance, consistency at each touchpoint, with the German consent and tracking constraint) and the separate KPI primer were folded or dropped: A2 keeps the journey, the phase tests, the worked sort and the funnel-gap worked example; A3 to A6 carry the Level 2 and Level 3 rules. The German consent constraint is no longer on Route 1's path (it is in git history); say if it should come back as a callout in A1.
28. **The Case File counts Core blocks only.** Its one `missing` list (`caseMissing` in `lib/missing.ts`) spans all three stages and never lists 1.1, 1.2 or 2.2. Those blocks appear in the file only when the learner filled them in. The optional routes keep their own, stricter lists.
29. **"Use the reference position".** When an earlier stage is empty, the Carried-forward panel offers a labelled stand-in (the day's model answers for the leak, the grid, the single option and its trade-off), filled only where the learner has not answered and marked "Reference position, not your answer" on screen and in the file (`l1.refPosition`, `l2.refPosition`). Editing the handover field makes it the learner's own. It does not fill 2.3 or any Stage 3 block: those stay the learner's work.
30. **Reset semantics.** Route 1 is the whole Case File, so "Reset Route 1" (and "Clear this route" in the mentor bar on Route 1) clears all three answer slices, which the optional routes share. Resetting Route 2 or 3 clears its own slice, and so also that stage of Route 1.
31. **Mobile memo strip.** The live memo of Stage 3 shows as a sticky column on wide screens; on a phone it is not shown as a fixed strip inside the Case File (it would sit over the other stages). The Case File preview above the export button shows the same content.
32. **Persist version 5.** `ui.optionalRoutesShown`, `l1.refPosition` and `l2.refPosition` were added; `merge` fills them from the defaults for an older blob.

## Coverage: where each task block is taught, and what helps

| Block | Taught in | Help while answering |
|---|---|---|
| 1.1 Sort (Optional) | A2 (phase tests, table, worked sort) | Show the test questions · Check + clue per touchpoint · reasoning after two checks |
| 1.2 Funnel figures (Optional) | A2 (conversion, gap, repeat rate) | FIND IT line · Check + one clue per cell |
| 1.3 Largest gap | A2 (rank by gap in pp, not by count) | Check + clue |
| 1.4 Cost of the leak | A2 (worked cost of a leak) | Show the formula (with per-part calculator) · Show where the numbers are · Check + clue |
| 2.1 Net-impact grid | A3 (four steps, two cost shapes, worked example) | Help for this cell: formula + calculator, numbers · Check + clue · calculator shows the working |
| 2.2 Loss marks (Optional) | A3 (a negative net impact is an answer) | Check (how many hold) + clue |
| 2.3 One option per segment | A3, A4 (choose by cause, cite the figure, say what it rests on) | Show how to build the answer (frame + your own grid cells) |
| 2.4 One option for both | A4 (add the segments, what you give up) | Show the formula · Show where the numbers are (your grid) · Show how to build the answer · Check + clue |
| 3.1 Allocation | A6 (cost shapes, add the costs, descope, cut the weakest evidence) | Live total, budget bar, message naming the moves that close a gap · "Limits and reference points" in the brief |
| 3.2 Rollout order | A5, A6 (baseline first) | Live sequencing warning · Check + clue |
| 3.3 What was cut | A6 (consequence in the material's terms) | Show how to build the answer (frame + printed prices) |
| 3.4 Governance | A6 (owner test, profiles, cadence, threshold) | Show the test questions (with the case's reference points for a trigger) · a trigger without a number is flagged |
| 3.5 Postponed measure | A6 (postpone with a pickup point) | "Left open" list · Show how to build the answer |

The case brief also carries a "Limits and reference points you can rely on" card: budget and time, option costs, what the fix and the dashboard do, and how to read a benchmark.
