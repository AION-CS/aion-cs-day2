import { CONTRACT_VALUE, LEAK, REPEAT, STAGE_BY_ID, STEP_BY_ID, WEAKEST, fmtInt, fmtPct, fmtPp } from "@/data/funnel";
import type { RowId } from "@/data/funnel";
import {
  CELL_KEYS,
  CONTRACT,
  LOCAL_BEST,
  LOCAL_BEST_TOTAL,
  LOSS_CELLS,
  NET,
  OPTIONS,
  OPT_IDS,
  SEGMENTS,
  SEG_IDS,
  UNIFORM,
  UNIFORM_BEST,
  calc,
  cellKey,
  cellLabel,
  fmtEuro,
  fmtEuroPlain,
  parseKey,
} from "@/data/segments";
import type { OptId, SegId } from "@/data/segments";
import { BUDGET, FIXED_COST, GOV_EXPECT, ITEMS, ITEM_KPI } from "@/data/program";
import type { ItemId } from "@/data/program";
import { KEY_L1, KEY_L2, KEY_L3 } from "@/data/mentorKey";
import { leverCost, leverNet } from "@/lib/program";

/**
 * Mentor-only worked answers for every task question the answer keys (lib/answerKey.ts) do not already cover:
 * the numeric fields, with every step of the calculation written out with its numbers, and the free-text
 * answers, with the model text and what a good answer must contain. Shown only after the mentor bar is
 * unlocked, never exported. Numbers are computed from the same constants as the tables, the calculator and
 * the answer checks, so they cannot drift from the model answers.
 */
export type WorkedStep = { label: string; calc: string; result: string };
export type MentorGuide = {
  title: string;
  /** The model answer, as a learner would enter it. */
  answer: string;
  /** For a calculation: each step with its numbers, in order. */
  steps?: WorkedStep[];
  /** Why the answer is what it is, in one or two sentences a mentor can say out loud. */
  why?: string;
  /** For free text: what an acceptable answer must contain. */
  lookFor?: string[];
  /** Typical wrong answers, with the number they produce where there is one. */
  pitfalls?: string[];
};

const n = (v: number) => (Math.round(v * 100) / 100).toLocaleString("en-US");
const n1 = (v: number) => (Math.round(v * 10) / 10).toFixed(1);

/* ------------------------------------------------------------------ Task 1 · Block 1.2 (the table) */

/** One row of the transcription table: the conversion, its reference and the gap, with where each comes from. */
export function fillGuide(row: RowId): MentorGuide {
  if (row === "repeat") {
    return {
      title: "1.2 · Repeat-purchase rate (18 months)",
      answer: `Actual ${n1(REPEAT.actual)} · Benchmark ${n1(REPEAT.bench)} · Gap ${n1(REPEAT.gap)} (in %, and pp for the gap)`,
      steps: [
        { label: "Actual (the filled bar under the funnel)", calc: `${REPEAT.orders} repeat orders ÷ ${REPEAT.clients} clients × 100`, result: fmtPct(REPEAT.actual) },
        { label: "Benchmark (the reference mark on the bar)", calc: `ref ${n1(REPEAT.bench)}%`, result: fmtPct(REPEAT.bench) },
        { label: "Gap = actual − benchmark", calc: `${n1(REPEAT.actual)} − ${n1(REPEAT.bench)}`, result: fmtPp(REPEAT.gap) },
      ],
      why: "The rate is printed on the bar, so it is a read-off; the 5 orders and 38 clients only show where it comes from. The gap keeps its sign because the rate is below the reference.",
      pitfalls: [
        `Writing the gap as a relative percentage: (${n1(REPEAT.actual)} − ${n1(REPEAT.bench)}) ÷ ${n1(REPEAT.bench)} = ${n1(((REPEAT.actual - REPEAT.bench) / REPEAT.bench) * 100)}%. The task asks for percentage points.`,
        `Dropping the sign: ${n1(Math.abs(REPEAT.gap))} instead of ${n1(REPEAT.gap)}.`,
      ],
    };
  }
  const s = STEP_BY_ID[row];
  const visitors = STAGE_BY_ID.visitors.count;
  return {
    title: `1.2 · ${s.label}`,
    answer: `Actual ${n1(s.actual)} · Benchmark ${n1(s.bench)} · Gap ${n1(s.gap)} (in %, and pp for the gap; ±0.1 accepted)`,
    steps: [
      { label: "The two counts (the bars either side of the arrow)", calc: `${fmtInt(s.toCount)} below, ${fmtInt(s.fromCount)} above`, result: `${fmtInt(s.toCount)} of ${fmtInt(s.fromCount)}` },
      { label: "Actual = count below ÷ count above × 100", calc: `${fmtInt(s.toCount)} ÷ ${fmtInt(s.fromCount)} × 100`, result: fmtPct(s.actual) },
      { label: "Benchmark (printed after “ref”)", calc: `ref ${n1(s.bench)}%`, result: fmtPct(s.bench) },
      { label: "Gap = actual − benchmark", calc: `${n1(s.actual)} − ${n1(s.bench)}`, result: fmtPp(s.gap) },
    ],
    why: "Each conversion divides a stage by the stage directly above it, never by the top of the funnel. The gap is the difference of two percentages, so it is in percentage points and keeps its sign.",
    pitfalls: [
      // The first arrow already starts at the visitors, so dividing by them is the right answer there, not a mistake.
      ...(row === "leads" ? [] : [`Dividing by the visitors: ${fmtInt(s.toCount)} ÷ ${fmtInt(visitors)} = ${((s.toCount / visitors) * 100).toFixed(2)}%.`]),
      ...(s.gap === 0
        ? [`Reading “on the reference” as a missing answer: a gap of 0.0 is a real answer and is typed as 0.`]
        : [
            `A relative gap: (${n1(s.actual)} − ${n1(s.bench)}) ÷ ${n1(s.bench)} = ${n1(((s.actual - s.bench) / s.bench) * 100)}%. The task asks for percentage points.`,
            `Benchmark minus actual: ${n1(s.bench - s.actual)}. The sign is wrong: a gap is actual minus benchmark.`,
          ]),
    ],
  };
}

/* ------------------------------------------------------------------ Task 1 · Block 1.4 (the cost sentence) */

export function sentenceGuide(): MentorGuide {
  const s = STEP_BY_ID[WEAKEST];
  const signed = STAGE_BY_ID.signed.count;
  const lost = s.fromCount - s.toCount;
  const rate = signed / s.toCount;
  const contracts = lost * rate;
  const revenue = contracts * CONTRACT_VALUE;
  return {
    title: "1.4 · What the leak costs",
    answer: KEY_L1.sentence,
    steps: [
      { label: `Prospects lost at the arrow (${s.label})`, calc: `${fmtInt(s.fromCount)} − ${fmtInt(s.toCount)}`, result: `${lost} prospects` },
      { label: "Rate at which the prospects below the arrow reach a signature", calc: `${signed} signed ÷ ${s.toCount}`, result: `${(rate * 100).toFixed(1)}%` },
      { label: "Contracts the lost prospects would have brought", calc: `${lost} × ${signed} ÷ ${s.toCount}`, result: `${n1(contracts)} contracts` },
      { label: "Revenue at the average contract value (case brief)", calc: `${n1(contracts)} × ${fmtEuroPlain(CONTRACT_VALUE)}`, result: `${fmtEuroPlain(revenue)} (about ${fmtEuroPlain(Math.round(revenue / 1000) * 1000)})` },
    ],
    why: "The lost prospects are assumed to behave like the ones who did get through (Materi A4, Boundary): the funnel's own rate is used, and no figure is imported. The check accepts a number derived from any arrow the learner named, not only this one.",
    lookFor: [
      "One sentence, aimed at the managing director.",
      "Names the count lost or the two counts either side of the arrow the learner chose in Block 1.3.",
      "Converts through the funnel's own downstream rate to contracts, and to euros with the average contract value if the learner wants euros.",
      "Every figure traces to the funnel or the case brief; nothing is invented.",
    ],
    pitfalls: [
      `Dividing by the count above instead of below: ${lost} × ${signed} ÷ ${s.fromCount} = ${n1((lost * signed) / s.fromCount)} contracts (${fmtEuroPlain(((lost * signed) / s.fromCount) * CONTRACT_VALUE)}).`,
      `Assuming every lost prospect would have signed: ${lost} × ${fmtEuroPlain(CONTRACT_VALUE)} = ${fmtEuroPlain(lost * CONTRACT_VALUE)}.`,
      `Using the whole funnel's signing rate (${signed} ÷ ${fmtInt(STAGE_BY_ID.visitors.count)}) on the lost prospects: ${n1((lost * signed) / STAGE_BY_ID.visitors.count)} contracts, far too low.`,
      `Only counting the lost prospects and stopping there ("we lose ${lost} prospects") gives no cost: it needs the conversion step and, for euros, the contract value.`,
      `The model figure ${n1(LEAK.contracts)} contracts and about ${fmtEuroPlain(Math.round(LEAK.revenue / 1000) * 1000)} is one acceptable sentence; a different rounding (5 contracts, €300,000 to €330,000) is fine.`,
    ],
  };
}

/* ------------------------------------------------------------------ Task 2 · Block 2.1 (the six grid cells) */

/** The worked answer for one grid cell, with every step and the typical wrong numbers. */
export function cellGuide(key: string): MentorGuide {
  const { opt, seg } = parseKey(key);
  const c = calc(opt, seg);
  const o = OPTIONS[opt];
  const s = SEGMENTS[seg];
  const discount = o.discount !== null;
  const steps: WorkedStep[] = [
    { label: "Extra repeat orders = clients × uplift ÷ 100", calc: `${c.clients} × ${c.upliftPp} ÷ 100`, result: `${n(c.extraOrders)} orders` },
    { label: "Gross profit per order = price × margin (printed under the client table)", calc: `${fmtEuroPlain(CONTRACT.price)} × ${CONTRACT.margin * 100}%`, result: fmtEuroPlain(CONTRACT.gp) },
    { label: "Extra gross profit = extra orders × gross profit per order", calc: `${n(c.extraOrders)} × ${fmtEuroPlain(CONTRACT.gp)}`, result: fmtEuroPlain(c.extraGp) },
  ];
  if (discount) {
    steps.push(
      { label: "Repeat orders the discount is paid on = existing + extra", calc: `${s.baseline} + ${n(c.extraOrders)}`, result: `${n(s.baseline + c.extraOrders)} orders` },
      {
        label: "Cost = those orders × contract price × discount",
        calc: `${n(s.baseline + c.extraOrders)} × ${fmtEuroPlain(CONTRACT.price)} × ${(o.discount ?? 0) * 100}%`,
        result: fmtEuroPlain(c.cost),
      },
    );
  } else {
    steps.push({ label: "Cost = clients × cost per client per year", calc: `${c.clients} × ${fmtEuroPlain(o.costPerClient ?? 0)}`, result: fmtEuroPlain(c.cost) });
  }
  steps.push({ label: "Net impact = extra gross profit − cost", calc: `${fmtEuroPlain(c.extraGp)} − ${fmtEuroPlain(c.cost)}`, result: fmtEuro(c.net) });

  const other: SegId = seg === "P" ? "R" : "P";
  const pitfalls: string[] = [
    `The price instead of the gross profit: ${n(c.extraOrders)} × ${fmtEuroPlain(CONTRACT.price)} = ${fmtEuroPlain(c.extraOrders * CONTRACT.price)} of extra profit, so the net is ${fmtEuro(c.extraOrders * CONTRACT.price - c.cost)}.`,
    `The other segment's row (${SEGMENTS[other].short}): that is cell ${cellLabel(cellKey(opt, other))}, ${fmtEuro(NET[cellKey(opt, other)])}.`,
  ];
  if (discount) {
    const onlyExtra = c.extraOrders * CONTRACT.price * (o.discount ?? 0);
    pitfalls.unshift(
      `Charging the discount only on the extra orders: ${n(c.extraOrders)} × ${fmtEuroPlain(CONTRACT.price)} × ${(o.discount ?? 0) * 100}% = ${fmtEuroPlain(onlyExtra)}, so the net would be ${fmtEuro(c.extraGp - onlyExtra)}. A price cut is paid on every repeat order, including the ${s.baseline} that already exist.`,
    );
  } else {
    pitfalls.unshift(
      `Multiplying the cost per client by the extra orders instead of the clients: ${n(c.extraOrders)} × ${fmtEuroPlain(o.costPerClient ?? 0)} = ${fmtEuroPlain(c.extraOrders * (o.costPerClient ?? 0))}, so the net would be ${fmtEuro(c.extraGp - c.extraOrders * (o.costPerClient ?? 0))}. The fixed cost is paid for every client, whether or not it re-orders.`,
    );
  }
  if (c.net < 0) pitfalls.push(`Typing the loss without its minus sign: ${n(Math.abs(c.net))}. A loss is entered as ${n(c.net)}.`);
  return {
    title: `2.1 · ${cellLabel(key)}`,
    answer: `${n(c.net)} (€ per year; ±5 accepted)`,
    steps,
    why: discount
      ? `A price cut is paid on every repeat order in the segment: the ${s.baseline} the ${s.short.toLowerCase()} clients already place as well as the ${n(c.extraOrders)} extra ones. ${c.net < 0 ? "Here that cost is larger than the extra gross profit, so the option loses money." : "Here the extra gross profit still covers it."}`
      : `A fixed cost per client is paid for all ${c.clients} clients whether or not they re-order. ${c.net < 0 ? "Here it is larger than the extra gross profit, so the option loses money." : "Here the extra gross profit covers it."}`,
    pitfalls,
  };
}

/* ------------------------------------------------------------------ Task 2 · Block 2.2 (loss marks) */

export function lossGuide(): MentorGuide {
  return {
    title: "2.2 · Which cells are a net loss",
    answer: LOSS_CELLS.length ? LOSS_CELLS.map(cellLabel).join(" and ") : "No cell shows a loss",
    steps: CELL_KEYS.map((k) => {
      const c = calc(parseKey(k).opt, parseKey(k).seg);
      return { label: cellLabel(k), calc: `${fmtEuroPlain(c.extraGp)} − ${fmtEuroPlain(c.cost)}`, result: `${fmtEuro(c.net)} · ${c.net < 0 ? "loss" : "not a loss"}` };
    }),
    why: "A cell is a loss exactly when its cost line is larger than its extra gross profit line. The same test applies to all six cells alike; read it off the calculator's last line, do not estimate.",
    pitfalls: [
      "Marking a cell because it is the segment's lowest, not because it is negative: the lowest cell of a segment can still be positive.",
      "Marking the discount in both segments because the material warns against discounts (B4): the warning is about the mechanism, the calculator decides each cell.",
    ],
  };
}

/* ------------------------------------------------------------------ Task 2 · Block 2.3 (justifications) */

export function recommendGuide(seg: SegId): MentorGuide {
  const best = LOCAL_BEST[seg];
  return {
    title: `2.3 · Why, for ${SEGMENTS[seg].name}`,
    answer: KEY_L2.just[seg],
    why: `Option ${best} nets ${fmtEuro(NET[cellKey(best, seg)])} here, the most of the three. The sentence has to say so with a figure from the learner's own grid, and say what the figure rests on.`,
    lookFor: [
      `Names the option and the segment (model: Option ${KEY_L2.rec[seg]}).`,
      "Cites at least one € figure from the learner's own grid (the check counts any figure of 100 or more that matches a grid value).",
      "Compares with at least one other option in the same segment, not only the chosen one.",
      seg === "P"
        ? "Says the figure rests on the uplift assumption, or that a discount is weak against relationship churn (B4). C, at +€3,416, is a defensible choice if argued this way."
        : "Explains why the discount fails here: it is paid on all 4 existing repeat orders. C, at +€15,072, is a defensible second choice.",
    ],
    pitfalls: [
      "A recommendation with no figure: it scores 0 however well it is worded.",
      seg === "R"
        ? `Recommending Option B: it nets ${fmtEuro(NET[cellKey("B", "R")])} in this segment.`
        : `Recommending Option A: it nets ${fmtEuro(NET[cellKey("A", "P")])} in this segment.`,
      "Choosing by which option \"feels\" more relational, without the number.",
    ],
  };
}

/* ------------------------------------------------------------------ Task 2 · Block 2.4 (the trade-off) */

export function tradeoffGuide(): MentorGuide {
  const bp = NET[cellKey("B", "P")];
  const ar = NET[cellKey("A", "R")];
  const cp = NET[cellKey("C", "P")];
  const cr = NET[cellKey("C", "R")];
  return {
    title: "2.4 · What the single option gives up",
    answer: KEY_L2.tradeoff,
    steps: [
      ...OPT_IDS.map((o: OptId) => ({
        label: `Total of Option ${o} across both segments`,
        calc: `${fmtEuro(NET[cellKey(o, "P")])} + ${fmtEuro(NET[cellKey(o, "R")])}`,
        result: fmtEuro(UNIFORM[o]),
      })),
      { label: "The single best option is the largest total", calc: `Option ${UNIFORM_BEST}`, result: fmtEuro(UNIFORM[UNIFORM_BEST]) },
      { label: "Each segment's own best option", calc: `${SEG_IDS.map((s) => `${SEGMENTS[s].short}: ${LOCAL_BEST[s]} (${fmtEuro(NET[cellKey(LOCAL_BEST[s], s)])})`).join(" · ")}`, result: `${fmtEuro(LOCAL_BEST_TOTAL)} if both were run` },
      { label: "Given up in project clients = its own best − the single option there", calc: `${fmtEuro(bp)} − ${fmtEuro(cp)}`, result: fmtEuroPlain(bp - cp) },
      { label: "Given up in retainer clients", calc: `${fmtEuro(ar)} − ${fmtEuro(cr)}`, result: fmtEuroPlain(ar - cr) },
      { label: "Together", calc: `${fmtEuroPlain(bp - cp)} + ${fmtEuroPlain(ar - cr)}`, result: fmtEuroPlain(LOCAL_BEST_TOTAL - UNIFORM[UNIFORM_BEST]) },
    ],
    why: "One strategy for both segments means neither segment gets its own best option. The price of that is what each segment would have netted with its own winner, minus what it nets with the single option.",
    lookFor: [
      "Names the single option and its total across both segments.",
      "Names what is given up in each segment, in euros from the grid, against that segment's own best option; the letter alone is not an answer.",
      "The euro figures come from the learner's own grid (the check counts them).",
    ],
    pitfalls: [
      `Adding each segment's own best (${fmtEuro(bp)} + ${fmtEuro(ar)} = ${fmtEuro(LOCAL_BEST_TOTAL)}) and calling it the single option: that is two strategies, not one.`,
      `Choosing Option B because it wins project clients: across both it totals only ${fmtEuro(UNIFORM.B)}.`,
      "Naming only one segment's loss, or naming no euro amount.",
    ],
  };
}

/* ------------------------------------------------------------------ Task 3 · Block 3.1 (the allocation) */

export function allocGuide(): MentorGuide {
  const cBoth = leverCost("C", "both");
  const aBoth = leverCost("A", "both");
  const model = cBoth + FIXED_COST.fix + FIXED_COST.dash;
  return {
    title: "3.1 · The allocation",
    answer: `Option C for both segments, the funnel fix and the dashboard: ${fmtEuroPlain(model)} of ${fmtEuroPlain(BUDGET)}`,
    steps: [
      { label: "Lever · Option C for project clients", calc: `${SEGMENTS.P.clients} × ${fmtEuroPlain(OPTIONS.C.costPerClient ?? 0)}`, result: fmtEuroPlain(leverCost("C", "P")) },
      { label: "Lever · Option C for retainer clients", calc: `${SEGMENTS.R.clients} × ${fmtEuroPlain(OPTIONS.C.costPerClient ?? 0)}`, result: fmtEuroPlain(leverCost("C", "R")) },
      { label: "Lever · both segments", calc: `${fmtEuroPlain(leverCost("C", "P"))} + ${fmtEuroPlain(leverCost("C", "R"))}`, result: fmtEuroPlain(cBoth) },
      { label: "Funnel fix + dashboard (fixed prices)", calc: `${fmtEuroPlain(FIXED_COST.fix)} + ${fmtEuroPlain(FIXED_COST.dash)}`, result: fmtEuroPlain(FIXED_COST.fix + FIXED_COST.dash) },
      { label: "Total of the model allocation", calc: `${fmtEuroPlain(cBoth)} + ${fmtEuroPlain(FIXED_COST.fix + FIXED_COST.dash)}`, result: fmtEuroPlain(model) },
      { label: "Remaining of the budget", calc: `${fmtEuroPlain(BUDGET)} − ${fmtEuroPlain(model)}`, result: fmtEuroPlain(BUDGET - model) },
      { label: "Adding the training as well", calc: `${fmtEuroPlain(model)} + ${fmtEuroPlain(FIXED_COST.train)}`, result: `${fmtEuroPlain(model + FIXED_COST.train)} · ${fmtEuroPlain(model + FIXED_COST.train - BUDGET)} over` },
    ],
    why: "The four items together cost more than the budget when the lever is Option C for both segments, so one item has to go. The training is the one whose effect the case does not quantify, so it is the weakest to keep.",
    pitfalls: [
      `Option A for both segments: ${fmtEuroPlain(aBoth)} + ${fmtEuroPlain(FIXED_COST.fix + FIXED_COST.dash)} = ${fmtEuroPlain(aBoth + FIXED_COST.fix + FIXED_COST.dash)}, ${fmtEuroPlain(aBoth + FIXED_COST.fix + FIXED_COST.dash - BUDGET)} over.`,
      `Option B for both segments costs nothing upfront, so all four items total ${fmtEuroPlain(FIXED_COST.fix + FIXED_COST.dash + FIXED_COST.train)}, ${fmtEuroPlain(BUDGET - (FIXED_COST.fix + FIXED_COST.dash + FIXED_COST.train))} under budget. That fits, but B nets ${fmtEuro(leverNet("B", "both"))} across both segments and its margin cost falls outside this budget.`,
      "Forgetting that Options A and C are priced per client (38 clients in all), not once.",
    ],
  };
}

/* ------------------------------------------------------------------ Task 3 · Blocks 3.3 to 3.5 (free text) */

export function cutGuide(): MentorGuide {
  return {
    title: "3.3 · What was cut",
    answer: KEY_L3.cut,
    lookFor: [
      "Names the specific line item or scope that was reduced (model: item 4, the sales training, €21,000).",
      "States the consequence in the material's terms: which KPI stays unmeasured, which segment's lever is delayed, which leak stays partly open.",
      "If everything is funded on cost (Option B), says so and names what the discount's margin cost or the 7 pp left open exposes.",
    ],
    pitfalls: ["“We will do less”: it names no item and no consequence.", "Cutting the dashboard and still writing a governance plan that reads its KPIs (C2, C4)."],
  };
}

export function govGuide(item: ItemId): MentorGuide {
  const g = GOV_EXPECT[item];
  const model = KEY_L3.gov[item];
  return {
    title: `3.4 · Trigger for ${ITEMS[item].short}`,
    answer: model.trigger
      ? `Owner: ${g.owner}. Cadence: ${g.cadence}. Trigger: ${model.trigger}`
      : `Owner: ${g.owner}. Cadence: ${g.cadence}. (Left out of the model allocation, so the model has no trigger for it.)`,
    why: `${g.ownerWhy} ${g.cadenceWhy}`,
    lookFor: [
      `Owner is one role that can change what moves ${ITEM_KPI[item]}.`,
      "The trigger contains a threshold (a number; the check requires at least one digit and 12 characters).",
      "The trigger names the person it escalates to, who is not the owner.",
      "The cadence matches how fast the KPI moves.",
    ],
    pitfalls: ["“We will monitor it”: no threshold, no name.", "A trigger written for a KPI whose item was cut."],
  };
}

export function postponedGuide(): MentorGuide {
  return {
    title: "3.5 · The postponed measure",
    answer: `${KEY_L3.postponed} Pickup: ${KEY_L3.pickup}.`,
    lookFor: [
      "Names something real from the “Left open by your allocation” list: an unfunded or descoped item, or the part of the leak the fix leaves open.",
      "Says why it waits.",
      "Has a pickup that fits: a measure judged by a KPI waits for a baseline.",
    ],
    pitfalls: ["Claiming nothing was postponed while the budget was exceeded or an item was cut.", "A pickup of “later”: a postponed measure without a pickup point is a cut."],
  };
}
