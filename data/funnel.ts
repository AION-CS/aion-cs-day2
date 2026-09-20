/**
 * DigitalIT Solutions GmbH — the Day 2 case. Every figure here is exactly as briefed, so Route 3 can reuse
 * it. The funnel counts are annual; the benchmark references are a Case assumption (an industry reference
 * the brief supplies, not a measured figure).
 */

export type Phase = "pre" | "sales" | "after";
export const PHASES: { id: Phase; label: string; hint: string }[] = [
  { id: "pre", label: "Pre-sales", hint: "Awareness and first contact." },
  { id: "sales", label: "Sales", hint: "Consultation, proposal, negotiation and contract." },
  { id: "after", label: "After-sales", hint: "Onboarding, support and renewal." },
];
export const PHASE_LABEL: Record<Phase, string> = { pre: "Pre-sales", sales: "Sales", after: "After-sales" };

export type StageId = "visitors" | "leads" | "booked" | "held" | "proposal" | "signed";
export type StepId = Exclude<StageId, "visitors">;

export const STAGE_IDS: StageId[] = ["visitors", "leads", "booked", "held", "proposal", "signed"];
export const STEP_IDS: StepId[] = ["leads", "booked", "held", "proposal", "signed"];

export const FUNNEL: { id: StageId; label: string; count: number }[] = [
  { id: "visitors", label: "Website visitors", count: 24000 },
  { id: "leads", label: "Leads (contact / download)", count: 480 },
  { id: "booked", label: "Consultation booked", count: 96 },
  { id: "held", label: "Consultation held", count: 41 },
  { id: "proposal", label: "Proposal sent", count: 22 },
  { id: "signed", label: "Contract signed", count: 4 },
];
export const STAGE_BY_ID = Object.fromEntries(FUNNEL.map((s) => [s.id, s])) as Record<StageId, (typeof FUNNEL)[number]>;

/** Benchmark reference per stage-to-stage conversion, in %. */
export const BENCH: Record<StepId, number> = { leads: 2.0, booked: 22, held: 75, proposal: 60, signed: 30 };

const r1 = (n: number) => Math.round(n * 10) / 10;

export type Step = {
  id: StepId;
  from: StageId;
  /** "Consultation booked → Consultation held" */
  label: string;
  fromCount: number;
  toCount: number;
  actual: number;
  bench: number;
  /** actual − benchmark, in percentage points */
  gap: number;
};

export const STEPS: Step[] = STEP_IDS.map((id, i) => {
  const from = FUNNEL[i];
  const to = FUNNEL[i + 1];
  const actual = r1((to.count / from.count) * 100);
  return {
    id,
    from: from.id,
    label: `${from.label.replace(" (contact / download)", "")} → ${to.label.replace(" (contact / download)", "")}`,
    fromCount: from.count,
    toCount: to.count,
    actual,
    bench: BENCH[id],
    gap: r1(actual - BENCH[id]),
  };
});
export const STEP_BY_ID = Object.fromEntries(STEPS.map((s) => [s.id, s])) as Record<StepId, Step>;

/** The step with the most negative gap. Computed from the data; never printed as "the problem" on screen. */
export const WEAKEST: StepId = STEPS.reduce((a, b) => (b.gap < a.gap ? b : a)).id;

/** The retention half of the story: existing clients re-ordering within 18 months. */
export const REPEAT = {
  actual: 13.2,
  bench: 35,
  gap: r1(13.2 - 35),
  /** 5 repeat orders across 38 clients (14 project + 24 retainer) — the same base Task 2 uses. */
  orders: 5,
  clients: 38,
};

/** A signed project contract's average value. Case assumption; the same price Task 2's calculator uses. */
export const CONTRACT_VALUE = 60000;

/** What losing the prospects between "booked" and "held" costs, derived from the funnel itself. */
export const LEAK = (() => {
  const booked = STAGE_BY_ID.booked.count;
  const held = STAGE_BY_ID.held.count;
  const signed = STAGE_BY_ID.signed.count;
  const lost = booked - held;
  const contracts = (lost * signed) / held;
  return { lost, signedPerHeld: signed / held, contracts, revenue: contracts * CONTRACT_VALUE };
})();

/** Table rows for the transcription block (five funnel steps + the repeat-purchase line). */
export type RowId = StepId | "repeat";
export const ROW_IDS: RowId[] = [...STEP_IDS, "repeat"];
export type Col = "actual" | "bench" | "gap";
export const COLS: Col[] = ["actual", "bench", "gap"];
export const COL_LABEL: Record<Col, string> = { actual: "Actual %", bench: "Benchmark %", gap: "Gap (pp)" };
export const ROW_LABEL: Record<RowId, string> = {
  ...(Object.fromEntries(STEPS.map((s) => [s.id, s.label])) as Record<StepId, string>),
  repeat: "Repeat-purchase rate (18 months)",
};
export const ROW_TRUTH: Record<RowId, Record<Col, number>> = {
  ...(Object.fromEntries(STEPS.map((s) => [s.id, { actual: s.actual, bench: s.bench, gap: s.gap }])) as Record<
    StepId,
    Record<Col, number>
  >),
  repeat: { actual: REPEAT.actual, bench: REPEAT.bench, gap: REPEAT.gap },
};
export const cellId = (row: RowId, col: Col) => `${row}.${col}`;

/** Formatting helpers shared by the SVG, the export and the answer key. */
export const fmtPct = (n: number) => `${n.toFixed(1)}%`;
export const fmtPp = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)} pp`;
export const fmtInt = (n: number) => n.toLocaleString("en-US");
