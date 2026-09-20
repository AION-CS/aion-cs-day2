import { ROW_IDS, COLS, ROW_TRUTH, cellId, WEAKEST } from "@/data/funnel";
import type { Phase, StageId, StepId } from "@/data/funnel";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { CELL_KEYS, EXPECTED, LOSS_CELLS } from "@/data/segments";
import type { OptId, SegId } from "@/data/segments";

/**
 * Every model answer of Routes 1 and 2, in one file. A mentor enters the passcode in the top bar once and the
 * whole site fills in, so every export can be downloaded without typing. The passcode is a convenience gate in
 * client code, not security.
 */
export const MENTOR_PASSCODE = "muchson123";

export const KEY_L1 = {
  sort: Object.fromEntries(TOUCHPOINTS.map((t) => [t.id, t.truth])) as Record<StageId, Phase>,
  fill: Object.fromEntries(
    ROW_IDS.flatMap((r) => COLS.map((c) => [cellId(r, c), String(ROW_TRUTH[r][c].toFixed(1))])),
  ) as Record<string, string>,
  weakest: WEAKEST as StepId,
  sentence:
    "Losing the 55 prospects who book a consultation but never meet us (96 booked, 41 held) costs about 5 contracts a year, because 4 of every 41 held consultations sign: roughly €322,000 of project revenue at the €60,000 average contract value.",
};

const fmt = (n: number) => String(Math.round(n));

export const KEY_L2 = {
  grid: Object.fromEntries(CELL_KEYS.map((k) => [k, fmt(EXPECTED[k])])) as Record<string, string>,
  loss: Object.fromEntries(CELL_KEYS.map((k) => [k, LOSS_CELLS.includes(k)])) as Record<string, boolean>,
  rec: { P: "B", R: "A" } as Record<SegId, OptId>,
  just: {
    P: "Option B nets +€11,328 in the project segment, against +€3,416 for C and −€4,872 for A. Project clients placed only 1 repeat order in the last 12 months, so an 8% discount gives little margin away on orders that would have come anyway. The figure rests on the +8 pp uplift assumption; if the uplift is far smaller, C is the safer choice.",
    R: "Option A nets +€19,296 in the retainer segment, against +€15,072 for C and −€8,832 for B. Retainer clients already placed 4 repeat orders in the last 12 months, so a discount would be paid on all of them, and its +3 pp uplift cannot cover that. Account management answers the relationship motive, and its €36,000 cost is covered by 2.88 extra orders.",
  } as Record<SegId, string>,
  uniform: "C" as OptId,
  tradeoff:
    "Across both segments C nets +€18,488, against +€14,424 for A and +€2,496 for B, so C is the best single option. Choosing it gives up the local winners: in project clients B would have netted +€11,328 instead of +€3,416 (€7,912 less), and in retainer clients A would have netted +€19,296 instead of +€15,072 (€4,224 less). Together that is €12,136 less than running B for project and A for retainer clients.",
};
