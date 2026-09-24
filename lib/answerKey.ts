import { STEPS, WEAKEST, fmtPct, fmtPp, STEP_BY_ID } from "@/data/funnel";
import { PHASE_LABEL } from "@/data/funnel";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { CELL_KEYS, LOCAL_BEST, LOCAL_BEST_TOTAL, LOSS_CELLS, NET, OPTIONS, OPT_IDS, SEGMENTS, UNIFORM, UNIFORM_BEST, calc, cellKey, cellLabel, fmtEuro, fmtEuroPlain, parseKey } from "@/data/segments";
import type { SegId } from "@/data/segments";
import { BUDGET, CADENCES, CADENCE_WHY, FIXED_COST, GOV_EXPECT, ITEMS, ITEM_KPI, KPI_LABEL, OWNERS, OWNER_PROFILE, PICKUPS, PICKUP_MODEL, PICKUP_WHY, SHOW_UP } from "@/data/program";
import type { ItemId } from "@/data/program";
import { fundedItems, leverCost, leverNet, overBy, sequenceTruth, totalSpent, TRUE_KPI } from "@/lib/program";
import type { Route3State } from "@/store/useStore";

/**
 * Mentor-only answer keys for the exercises where the learner picks from fixed options. Each key gives the
 * expected answer and a reason per option — including why each rejected option is rejected — plus a teaching
 * note wherever more than one answer defends. Never exported and never shown to a learner.
 */
export type AnswerKeyOption = { label: string; expected: boolean; why: string };
export type AnswerKeyBlock = { title: string; expected: string; options: AnswerKeyOption[]; teachingNote?: string };

export function sortKey(): AnswerKeyBlock {
  return {
    title: "Block 1.1 · MECE sort",
    expected: TOUCHPOINTS.map((t) => `${t.label} → ${PHASE_LABEL[t.truth]}`).join(" · "),
    options: TOUCHPOINTS.flatMap((t) => [
      { label: `${t.label} → ${PHASE_LABEL[t.truth]}`, expected: true, why: t.why },
      ...(Object.entries(t.rejected) as [keyof typeof PHASE_LABEL, string][]).map(([ph, why]) => ({
        label: `${t.label} → ${PHASE_LABEL[ph]}`,
        expected: false,
        why,
      })),
    ]),
    teachingNote:
      "“Consultation booked” is the boundary case. The convention taught in A2 is that sales starts at a scheduled conversation with a named buyer contact; a learner who files it under pre-sales and defends it by the buyer not yet having met anyone is reasoning, not guessing, but the note keeps the convention. After-sales stays empty: the funnel ends at the signature, so the retention half of the story is the repeat-purchase line beneath it.",
  };
}

export function weakestKey(): AnswerKeyBlock {
  const w = STEP_BY_ID[WEAKEST];
  return {
    title: "Block 1.3 · Largest negative gap",
    expected: `${w.label} (${fmtPct(w.actual)} against ${fmtPct(w.bench)}, ${fmtPp(w.gap)})`,
    options: STEPS.map((s) => ({
      label: s.label,
      expected: s.id === WEAKEST,
      why:
        s.id === WEAKEST
          ? `Actual ${fmtPct(s.actual)} against a benchmark of ${fmtPct(s.bench)}: a gap of ${fmtPp(s.gap)}, the most negative of the five.`
          : `Gap ${fmtPp(s.gap)}. ${
              s.id === "leads"
                ? "This step loses the most people (24,000 → 480), but it sits exactly on its 2.0% benchmark; counts fall at every stage by design."
                : s.id === "signed"
                  ? "The second-largest gap, and the one closest to revenue, but not the largest."
                  : "Below its benchmark, but by a smaller margin than the step named as the answer."
            }`,
    })),
    teachingNote:
      "The trap is reading the funnel by counts. Visitors → Leads loses the most people and is on benchmark; Contract signed is closest to revenue and second-worst. Only the gap against the benchmark, in percentage points, ranks the steps.",
  };
}

export function recommendationKey(seg: SegId): AnswerKeyBlock {
  const best = LOCAL_BEST[seg];
  return {
    title: `Block 2.3 · Recommendation for ${SEGMENTS[seg].name}`,
    expected: `Option ${best} (${fmtEuro(NET[cellKey(best, seg)])})`,
    options: OPT_IDS.map((o) => {
      const net = NET[cellKey(o, seg)];
      return {
        label: OPTIONS[o].name,
        expected: o === best,
        why:
          o === best
            ? `Highest net impact in the segment at ${fmtEuro(net)}.`
            : net < 0
              ? `Shows a net loss of ${fmtEuro(net)}: its cost is larger than the extra gross profit it brings.`
              : `Positive at ${fmtEuro(net)} but ${fmtEuroPlain(NET[cellKey(best, seg)] - net)} below the best option in this segment.`,
      };
    }),
    teachingNote:
      seg === "P"
        ? "B wins the project segment on the numbers, and it is the answer the grid supports. It is also the most assumption-dependent: it rests on the +8 pp uplift, and the material (B4) says a discount is weak against relationship-driven churn. A learner who picks C (+€3,416) and says why, citing the figure and the risk to the uplift, defends a real position. Do not accept either choice without a cited figure."
        : "A wins the retainer segment. B is the trap: the discount is paid on all 4 existing repeat orders as well as the 0.72 extra ones it creates, and its +3 pp uplift cannot cover that, so it loses €8,832. C is a defensible second (+€15,072) if the learner argues against the fixed cost of account management; the grid does not support B.",
  };
}

export function uniformKey(): AnswerKeyBlock {
  return {
    title: "Block 2.4 · One option across both segments",
    expected: `Option ${UNIFORM_BEST} (${fmtEuro(UNIFORM[UNIFORM_BEST])} in total)`,
    options: OPT_IDS.map((o) => ({
      label: OPTIONS[o].name,
      expected: o === UNIFORM_BEST,
      why:
        o === UNIFORM_BEST
          ? `Largest total across both segments: ${fmtEuro(NET[cellKey(o, "P")])} + ${fmtEuro(NET[cellKey(o, "R")])} = ${fmtEuro(UNIFORM[o])}.`
          : `${fmtEuro(NET[cellKey(o, "P")])} + ${fmtEuro(NET[cellKey(o, "R")])} = ${fmtEuro(UNIFORM[o])}, ${fmtEuroPlain(UNIFORM[UNIFORM_BEST] - UNIFORM[o])} below the best single option. ${
              o === "B" ? "The gain in project clients is cancelled by the loss in retainer clients." : "Its loss in project clients outweighs the retainer gain."
            }`,
    })),
    teachingNote: `The trap is picking each segment's local winner (B for project, A for retainer). That is not one strategy: it is two, and it totals ${fmtEuroPlain(LOCAL_BEST_TOTAL)}. Running C everywhere totals ${fmtEuroPlain(UNIFORM[UNIFORM_BEST])}, so the price of one strategy is ${fmtEuroPlain(LOCAL_BEST_TOTAL - UNIFORM[UNIFORM_BEST])}: ${fmtEuroPlain(NET[cellKey("B", "P")] - NET[cellKey("C", "P")])} left in project clients and ${fmtEuroPlain(NET[cellKey("A", "R")] - NET[cellKey("C", "R")])} in retainer clients. Check that the learner names both amounts, not only the letter.`,
  };
}

/** The sequencing key is computed from the learner's own allocation: the rule is applied to what they chose. */
export function sequenceKey(r: Route3State): AnswerKeyBlock {
  const t = sequenceTruth(r.alloc, r.start);
  return {
    title: "Block 3.2 · Did the KPI-blind-spot warning appear",
    expected: t.pending
      ? "Not decidable yet: the start months of the lever and the dashboard are not both set."
      : t.applies
        ? `Yes. The warning reads: “${t.text}” The KPI that loses its baseline: ${KPI_LABEL[TRUE_KPI]}.`
        : "No. The dashboard starts before the lever, so a baseline exists when the lever launches.",
    options: [
      { label: "Yes, the warning appeared", expected: t.applies, why: t.applies ? "The lever launches before, with or without the dashboard, so its early months have no baseline." : "The dashboard is in place first, so there is no blind spot to warn about." },
      { label: "No, it did not appear", expected: !t.applies && !t.pending, why: t.applies ? "The rule is met: the lever is running with no baseline behind it." : "The lever starts after the dashboard, so the rule is not met." },
      ...(["conversion", "clv", "repeat"] as const).map((k) => ({
        label: `KPI: ${KPI_LABEL[k]}`,
        expected: t.applies && k === TRUE_KPI,
        why:
          k === TRUE_KPI
            ? "The lever acts on repeat purchase (goal → action → KPI in C1), so this is the KPI whose early movement cannot be read without a baseline."
            : k === "clv"
              ? "CLV is derived from retention and moves slowly; the lever’s first effect shows in the repeat-purchase rate."
              : "The conversion rate is a funnel measure. A retention lever does not act on it directly.",
      })),
    ],
    teachingNote: "The rule the widget enforces is about order, not about funding alone: an unfunded dashboard means no baseline at all, and a dashboard that starts in the same month leaves that month blind, because its data begins the month after it starts.",
  };
}

/** Rubric evidence for the mentor: the two objective items are computed, the three judged items are read. */
export function rubricRows(r: Route3State): { item: string; status: string; note: string }[] {
  const funded = fundedItems(r.alloc);
  const t = sequenceTruth(r.alloc, r.start);
  const seqOk = !t.pending && r.warned === t.applies && (!t.applies || r.missingKpi === TRUE_KPI);
  const cutItems = (["lever", "fix", "dash", "train"] as const).filter((i) => !funded.includes(i));
  return [
    { item: "Allocation stays within €150,000 (binary)", status: overBy(r.alloc) === 0 && funded.length > 0 ? "Full" : "None", note: `Allocated ${fmtEuroPlain(totalSpent(r.alloc))}${funded.length ? "" : " (nothing funded)"}.` },
    { item: "What was cut names an item and its consequence", status: "Read it", note: cutItems.length ? `Unfunded: ${cutItems.map((i) => ITEMS[i].short).join(", ")}. Full = the item plus the exact KPI, segment or leak affected; partial = the item only; none = no cut named or the budget ignored.` : "Nothing is unfunded on cost. Look for a descoped lever or an accepted residual gap (the fix stops at 68%). Nothing to cut is not a fault." },
    { item: "Governance names owner, cadence and trigger for the funded KPIs", status: "Read it", note: `Funded: ${funded.map((i) => ITEMS[i].short).join(", ") || "none"}. Full = all three per funded item, tied to it; partial = one or two; none = a generic “we will monitor it”. A plan that ignores the cut item is partial.` },
    { item: "Sequence answer matches what the widget showed", status: seqOk ? "Full" : t.pending ? "Not decidable" : "None", note: t.applies ? "The warning applied." : t.pending ? "Start months not both set." : "The warning did not apply." },
    { item: "The postponed measure is real and testable", status: "Read it", note: "Full = tied to an unfunded or descoped item, or to the residual 7 pp of the show-up gap, with a stated pickup point; partial = vague; none = claims nothing was postponed while the budget was exceeded or an item was cut." },
  ];
}


/* ------------------------------------------------------------------ Block 2.2 · loss marks */

/** The six yes/no marks of Block 2.2. The learner's check only counts how many hold, so the names live here. */
export function lossKey(): AnswerKeyBlock {
  return {
    title: "Block 2.2 · Which cells are a net loss",
    expected: LOSS_CELLS.length ? LOSS_CELLS.map(cellLabel).join(" and ") : "No cell shows a loss",
    options: CELL_KEYS.map((k) => {
      const { opt, seg } = parseKey(k);
      const c = calc(opt, seg);
      const loss = c.net < 0;
      return {
        label: `${cellLabel(k)} marked as a loss`,
        expected: loss,
        why: loss
          ? `Net ${fmtEuro(c.net)}: the cost (${fmtEuroPlain(c.cost)}) is larger than the extra gross profit (${fmtEuroPlain(c.extraGp)}).`
          : `Net ${fmtEuro(c.net)}: the extra gross profit (${fmtEuroPlain(c.extraGp)}) is larger than the cost (${fmtEuroPlain(c.cost)}), so it is not a loss.`,
      };
    }),
    teachingNote:
      "The learner’s check reports only “k of 6 hold”, because each cell is a yes or no and naming the wrong ones would name the answer. This key is where the names live. A learner who marks the discount in project clients as a loss has usually charged it to the wrong base or dropped the extra gross profit; ask them to read the calculator’s last line for that cell, not to guess.",
  };
}

/* ------------------------------------------------------------------ Block 3.1 · allocation */

const eur = fmtEuroPlain;

/** The allocation exercise: one fixed choice per line item. The model spends €138,800 of the €150,000. */
export function allocKey(): AnswerKeyBlock {
  const cBoth = leverCost("C", "both");
  const aBoth = leverCost("A", "both");
  const all = (lever: number) => lever + FIXED_COST.fix + FIXED_COST.dash + FIXED_COST.train;
  return {
    title: "Block 3.1 · Allocate the budget",
    expected: `Option C for both segments (${eur(cBoth)}), the funnel fix (${eur(FIXED_COST.fix)}) and the dashboard (${eur(FIXED_COST.dash)}): ${eur(cBoth + FIXED_COST.fix + FIXED_COST.dash)} of ${eur(BUDGET)}. The sales training (${eur(FIXED_COST.train)}) stays out.`,
    options: [
      {
        label: "Lever · Option C, both segments",
        expected: true,
        why: `Costs ${eur(cBoth)} (38 clients × ${eur(OPTIONS.C.costPerClient ?? 0)}) and nets ${fmtEuro(leverNet("C", "both"))} a year, the best single option from Route 2.`,
      },
      {
        label: "Lever · Option A, both segments",
        expected: false,
        why: `Costs ${eur(aBoth)} and nets ${fmtEuro(leverNet("A", "both"))}. With the fix and the dashboard that is ${eur(aBoth + FIXED_COST.fix + FIXED_COST.dash)}, already ${eur(aBoth + FIXED_COST.fix + FIXED_COST.dash - BUDGET)} over the budget; A only fits if it is narrowed to one segment or another item is cut.`,
      },
      {
        label: "Lever · Option B, both segments",
        expected: false,
        why: `Costs nothing upfront (paid from margin on every repeat order) and nets ${fmtEuro(leverNet("B", "both"))}, the least. All four items then cost ${eur(all(0))}, so nothing has to be cut on cost. That is why B is tempting and why it is weak: the margin it gives away is paid outside this budget.`,
      },
      {
        label: "Lever · Option C, one segment only",
        expected: false,
        why: `Narrowing C to retainer clients costs ${eur(leverCost("C", "R"))} and nets ${fmtEuro(leverNet("C", "R"))}; to project clients ${eur(leverCost("C", "P"))} and ${fmtEuro(leverNet("C", "P"))}. Descoping is a real tool, but it is only needed when the budget forces it, and here it does not.`,
      },
      {
        label: "Lever · not funded",
        expected: false,
        why: "Repeat purchase stays untreated in both segments. Nothing in the budget forces that.",
      },
      {
        label: "Funnel fix · funded",
        expected: true,
        why: `${eur(FIXED_COST.fix)}. Lifts the show-up rate from ${SHOW_UP.before}% to ${SHOW_UP.after}% and leaves ${SHOW_UP.benchmark - SHOW_UP.after} pp of the gap to the benchmark open.`,
      },
      {
        label: "Dashboard · funded",
        expected: true,
        why: `${eur(FIXED_COST.dash)}. It produces the baseline every other KPI needs; without it the sequencing warning always applies and no KPI can be governed.`,
      },
      {
        label: "Sales training · not funded",
        expected: true,
        why: `${eur(FIXED_COST.train)} and its effect is not quantified in the case. With Option C the four items total ${eur(all(cBoth))}, ${eur(all(cBoth) - BUDGET)} over the budget, so this is the item to leave out: the weakest evidence is cut first (C3).`,
      },
      {
        label: "Sales training · funded",
        expected: false,
        why: `Only fits if the lever is narrowed or B is chosen. With C for both segments it puts the total ${eur(all(cBoth) - BUDGET)} over the ${eur(BUDGET)}.`,
      },
    ],
    teachingNote: `More than one allocation defends. Option B fits with everything funded (${eur(all(0))}), leaving ${eur(BUDGET - all(0))} unspent; a learner who chooses it should say what the discount costs in margin outside the budget and that Route 2 showed it nets the least across both segments. The objective test is only that the total stays within ${eur(BUDGET)} and every funded item gets a start month.`,
  };
}

/* ------------------------------------------------------------------ Block 3.4 · governance */

/** Owner and cadence for one funded item. Every owner option gets a reason, including why it is not the owner. */
export function governanceKey(item: ItemId): AnswerKeyBlock {
  const g = GOV_EXPECT[item];
  const kpi = ITEM_KPI[item];
  const ownerOptions = OWNERS.map((o) => {
    const p = OWNER_PROFILE[o];
    const yes = o === g.owner;
    const why = yes
      ? g.ownerWhy
      : o === "Controlling"
        ? `${p.does} It reads the number but cannot change what moves it, so it is not the owner of ${kpi}.`
        : o === "Chief Customer Officer / Sales Manager" || o === "Head of Sales"
          ? `${p.does} Better placed as the person the trigger escalates to than as the owner: the owner needs someone above to escalate to.`
          : `${p.does} Not the person closest to the action behind ${kpi}.`;
    return { label: `Owner · ${o}`, expected: yes, why };
  });
  const cadenceOptions = CADENCES.map((c) => ({
    label: `Cadence · ${c}`,
    expected: c === g.cadence,
    why: c === g.cadence ? g.cadenceWhy : CADENCE_WHY[c],
  }));
  return {
    title: `Block 3.4 · ${ITEMS[item].short}`,
    expected: `Owner: ${g.owner}. Cadence: ${g.cadence}. The trigger is free text (see the worked answer).`,
    options: [...ownerOptions, ...cadenceOptions],
    teachingNote:
      item === "lever"
        ? "The Chief Customer Officer or the Head of Sales can be defended as owner if the learner says the key account manager reports to them and names who the trigger escalates to. A KPI owned by the person it escalates to has nobody above to escalate to."
        : item === "dash"
          ? "Here Controlling is right because the KPI is the report itself. The same role would be wrong for the repeat-purchase rate, which is why the rule is “who can change what moves it”, not “who reads the number”."
          : item === "fix"
            ? "The Head of Sales is a defensible owner if the learner says the coordinator only executes. Then the weekly cadence still holds, and the trigger should name the Head of Sales as the one who acts."
            : "This item is left out of the model allocation, so no governance row is expected for it. If a learner funds it, the sales team lead or the Head of Sales are the defensible owners depending on whether the KPI is one team’s habit or the function’s.",
  };
}

/* ------------------------------------------------------------------ Block 3.5 · pickup */

export function pickupKey(): AnswerKeyBlock {
  return {
    title: "Block 3.5 · Pickup point of the postponed measure",
    expected: PICKUP_MODEL,
    options: PICKUPS.map((p) => ({ label: p, expected: p === PICKUP_MODEL, why: PICKUP_WHY[p] })),
    teachingNote:
      "The pickup has to fit what was postponed. A measure judged by a KPI (the training, judged by proposal → signed conversion) belongs after a baseline exists; a measure that only needs money can wait for a budget round. Check that the pickup and the postponed text tell the same story.",
  };
}
