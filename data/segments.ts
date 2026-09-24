/**
 * Day 2 · Task 2 — DigitalIT Solutions' client base, the three retention options and the calculation.
 * All inputs are exactly as briefed. The task's expected results are pinned by `EXPECTED` and checked by
 * `npm run verify:calc` (scripts/verify-calc.mjs), so a change to any input cannot drift silently.
 */

export type SegId = "P" | "R";
export type OptId = "A" | "B" | "C";
export const SEG_IDS: SegId[] = ["P", "R"];
export const OPT_IDS: OptId[] = ["A", "B", "C"];

export const CONTRACT = { price: 60000, margin: 0.32, gp: 60000 * 0.32 } as const; // €19,200 per order

export const SEGMENTS: Record<SegId, { id: SegId; name: string; short: string; clients: number; baseline: number; about: string }> = {
  P: { id: "P", name: "Project clients (P)", short: "Project", clients: 14, baseline: 1, about: "Large one-off implementations." },
  R: { id: "R", name: "Retainer clients (R)", short: "Retainer", clients: 24, baseline: 4, about: "Ongoing, smaller support contracts." },
};

export const OPTIONS: Record<
  OptId,
  { id: OptId; name: string; short: string; costPerClient: number | null; discount: number | null; uplift: Record<SegId, number> }
> = {
  A: { id: "A", name: "A · Intensified personal account management", short: "Account management", costPerClient: 1500, discount: null, uplift: { P: 6, R: 12 } },
  B: { id: "B", name: "B · Discount (8% off the repeat order)", short: "Discount", costPerClient: null, discount: 0.08, uplift: { P: 8, R: 3 } },
  C: { id: "C", name: "C · Value-added service", short: "Value-added service", costPerClient: 1100, discount: null, uplift: { P: 7, R: 9 } },
};

export type Calc = {
  clients: number;
  baseline: number;
  upliftPp: number;
  extraOrders: number;
  gpPerOrder: number;
  extraGp: number;
  /** How the cost is counted, in words the calculator prints under the figure. */
  costBasis: string;
  cost: number;
  net: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * extra orders = clients × uplift
 * net = extra orders × gross profit per order − cost of the option
 * A and C cost a fixed amount per client per year. B (the discount) is a price cut, so it is paid on every
 * repeat order in the segment, the existing ones and the extra ones: cost = (baseline + extra) × price × 8%.
 */
export function calc(opt: OptId, seg: SegId): Calc {
  const o = OPTIONS[opt];
  const s = SEGMENTS[seg];
  const upliftPp = o.uplift[seg];
  const extraOrders = round2((s.clients * upliftPp) / 100);
  const extraGp = extraOrders * CONTRACT.gp;
  let cost: number;
  let costBasis: string;
  if (o.discount !== null) {
    const orders = s.baseline + extraOrders;
    cost = orders * CONTRACT.price * o.discount;
    costBasis = `${s.baseline} existing + ${extraOrders} extra = ${round2(orders)} repeat orders × €${CONTRACT.price.toLocaleString("en-US")} × ${o.discount * 100}%`;
  } else {
    cost = s.clients * (o.costPerClient ?? 0);
    costBasis = `${s.clients} clients × €${(o.costPerClient ?? 0).toLocaleString("en-US")}`;
  }
  return {
    clients: s.clients,
    baseline: s.baseline,
    upliftPp,
    extraOrders,
    gpPerOrder: CONTRACT.gp,
    extraGp,
    costBasis,
    cost,
    net: extraGp - cost,
  };
}

export const cellKey = (opt: OptId, seg: SegId) => `${opt}-${seg}`;
export const CELL_KEYS = OPT_IDS.flatMap((o) => SEG_IDS.map((s) => cellKey(o, s)));
export const parseKey = (k: string): { opt: OptId; seg: SegId } => ({ opt: k[0] as OptId, seg: k[2] as SegId });

export const NET: Record<string, number> = Object.fromEntries(OPT_IDS.flatMap((o) => SEG_IDS.map((s) => [cellKey(o, s), calc(o, s).net])));
export const LOSS_CELLS = CELL_KEYS.filter((k) => NET[k] < 0);
export const cellLabel = (k: string) => {
  const { opt, seg } = parseKey(k);
  return `Option ${opt} · ${SEGMENTS[seg].short}`;
};

/** Uniform choice: one option across both segments. */
export const UNIFORM: Record<OptId, number> = Object.fromEntries(OPT_IDS.map((o) => [o, NET[cellKey(o, "P")] + NET[cellKey(o, "R")]])) as Record<OptId, number>;
export const UNIFORM_BEST: OptId = OPT_IDS.reduce((a, b) => (UNIFORM[b] > UNIFORM[a] ? b : a));
/** Each segment's own best option. */
export const LOCAL_BEST: Record<SegId, OptId> = {
  P: OPT_IDS.reduce((a, b) => (NET[cellKey(b, "P")] > NET[cellKey(a, "P")] ? b : a)),
  R: OPT_IDS.reduce((a, b) => (NET[cellKey(b, "R")] > NET[cellKey(a, "R")] ? b : a)),
};
export const LOCAL_BEST_TOTAL = NET[cellKey(LOCAL_BEST.P, "P")] + NET[cellKey(LOCAL_BEST.R, "R")];

/** Results the brief pins, in €. Tolerance ±5. */
export const EXPECTED: Record<string, number> = {
  "A-P": -4872, "C-P": 3416, "B-P": 11328,
  "A-R": 19296, "C-R": 15072, "B-R": -8832,
};
export const EXPECTED_UNIFORM: Record<OptId, number> = { A: 14424, C: 18488, B: 2496 };
export const TOLERANCE = 5;

export const fmtEuro = (n: number) => `${n < 0 ? "−" : n > 0 ? "+" : ""}€${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
export const fmtEuroPlain = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;

/* ------------------------------------------------------------------ helps under the grid (Block 2.1) */

/** DOM ids of the printed rows of the calculator's "Given" tables, so "Numbers you need" can scroll to and flash them. */
export const T2_IDS = {
  seg: (s: SegId) => `t2-seg-${s}`,
  opt: (o: OptId) => `t2-opt-${o}`,
  contract: "t2-contract",
} as const;

/** The formula of one grid cell, in words and with no numbers. It names the card that teaches the method (Materi B3). */
export const cellFormula = (opt: OptId): string =>
  OPTIONS[opt].discount === null
    ? "Net impact = (clients × uplift ÷ 100 × gross profit per order) − (clients × cost per client per year). Extra orders come first; the cost of a fixed-cost option does not depend on how many orders follow."
    : "Net impact = (clients × uplift ÷ 100 × gross profit per order) − ((existing repeat orders + extra orders) × contract price × discount ÷ 100). The discount is paid on every repeat order in the segment, the existing ones as well as the extra ones.";

export type CellSource = { target: string; where: string; label: string; value: string };

/**
 * The printed rows one grid cell is built from ("Numbers you need"). Every entry is an input the model answer
 * uses; none is a decoy. Values are computed from the same constants as the calculator's tables.
 */
export function cellSources(opt: OptId, seg: SegId): CellSource[] {
  const s = SEGMENTS[seg];
  const o = OPTIONS[opt];
  const segRow = { target: T2_IDS.seg(seg), where: "Given · client base" };
  const optRow = { target: T2_IDS.opt(opt), where: "Given · the three options" };
  const contract = { target: T2_IDS.contract, where: "Below the client-base table" };
  const out: CellSource[] = [
    { ...segRow, label: `${s.name} · Clients`, value: String(s.clients) },
    { ...optRow, label: `Option ${opt} · Uplift ${seg}`, value: `+${o.uplift[seg]} pp` },
    { ...contract, label: "Gross profit per order", value: fmtEuroPlain(CONTRACT.gp) },
  ];
  if (o.discount === null) out.push({ ...optRow, label: `Option ${opt} · Cost / client / yr`, value: fmtEuroPlain(o.costPerClient ?? 0) });
  else {
    out.push({ ...segRow, label: `${s.name} · Baseline repeat orders, last 12 months`, value: String(s.baseline) });
    out.push({ ...contract, label: "Contract price", value: fmtEuroPlain(CONTRACT.price) });
    out.push({ ...optRow, label: `Option ${opt} · the discount, in its name`, value: `${o.discount * 100}%` });
  }
  return out;
}
