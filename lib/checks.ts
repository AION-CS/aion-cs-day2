import { ROW_IDS, ROW_TRUTH, COLS, LEAK, CONTRACT_VALUE, STEPS, REPEAT, cellId, STAGE_BY_ID } from "@/data/funnel";
import type { Col, RowId } from "@/data/funnel";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { CELL_KEYS, EXPECTED, EXPECTED_UNIFORM, LOCAL_BEST_TOTAL, LOSS_CELLS, NET, TOLERANCE, UNIFORM, UNIFORM_BEST } from "@/data/segments";
import { extractAmounts, parseAmount, parsePct } from "@/lib/parseAmount";
import type { L1State, L2State } from "@/store/useStore";

/* ------------------------------------------------------------------ Task 1 */

/** How many placed touchpoints sit in their true phase. Unplaced ones are "missing", not counted. */
export function sortHolds(sort: L1State["sort"]): { holds: number; placed: number } {
  let holds = 0;
  let placed = 0;
  for (const t of TOUCHPOINTS) {
    const p = sort[t.id];
    if (p === null) continue;
    placed++;
    if (p === t.truth) holds++;
  }
  return { holds, placed };
}

/** Table cells filled but outside ±0.1 of what the diagram prints. Empty cells are "missing", not flagged. */
export function flagsForFill(fill: L1State["fill"]): string[] {
  const out: string[] = [];
  for (const r of ROW_IDS) {
    for (const c of COLS) {
      const id = cellId(r, c);
      const raw = fill[id] ?? "";
      if (!raw.trim()) continue;
      const v = parsePct(raw);
      if (v === null || Math.abs(v - ROW_TRUTH[r][c]) > 0.1 + 1e-9) out.push(id);
    }
  }
  return out;
}

/** Which column / row a cell id belongs to — picks the right clue. */
export const colOf = (id: string): Col => id.split(".")[1] as Col;
export const rowOf = (id: string): RowId => id.split(".")[0] as RowId;

/** Figures a cost sentence may rest on: counts, rates and gaps the funnel prints, and what is derived from them. */
const FUNNEL_FIGURES: number[] = (() => {
  const s = new Set<number>();
  for (const st of Object.values(STAGE_BY_ID)) s.add(st.count);
  for (const step of STEPS) {
    s.add(step.actual);
    s.add(step.bench);
    s.add(Math.abs(step.gap));
  }
  s.add(REPEAT.actual);
  s.add(REPEAT.bench);
  s.add(Math.abs(REPEAT.gap));
  for (const step of STEPS) s.add(step.fromCount - step.toCount); // prospects lost at each step (55 at booked → held)
  const atRef = Math.round(STAGE_BY_ID.booked.count * 0.75);
  s.add(atRef - STAGE_BY_ID.held.count); // 31 — held below the 75% reference
  s.add(Math.round(LEAK.contracts * 10) / 10); // 5.4
  s.add(Math.round(LEAK.contracts)); // 5
  s.add(CONTRACT_VALUE);
  return [...s];
})();

/** Expand "322k" and "0.3m" so a rounded euro figure still counts. */
function amountsIn(text: string): number[] {
  const expanded = text.replace(/(\d+(?:[.,]\d+)?)\s*(k|m)\b/gi, (whole: string, n: string, u: string) => {
    const v = parseAmount(n);
    return v === null ? whole : String(v * (u.toLowerCase() === "k" ? 1000 : 1_000_000));
  });
  return extractAmounts(expanded);
}

/** True when the sentence cites at least one figure that traces to the funnel or to a value derived from it. */
export function citesFunnelFigure(text: string): boolean {
  return amountsIn(text).some((n) => {
    if (FUNNEL_FIGURES.some((f) => Math.abs(f - n) <= (f >= 1000 ? f * 0.005 : 0.05))) return true;
    // an estimate of lost revenue: contracts × the average contract value
    return n >= CONTRACT_VALUE && n <= 10 * CONTRACT_VALUE;
  });
}

/* ------------------------------------------------------------------ Task 2 */

export const gridValue = (l2: Pick<L2State, "grid">, key: string): number | null => parseAmount(l2.grid[key] ?? "");

/** Grid cells filled but outside ±€5 of the calculator's figure. Empty cells are "missing", not flagged. */
export function flagsForGrid(l2: Pick<L2State, "grid">): string[] {
  return CELL_KEYS.filter((k) => {
    const raw = (l2.grid[k] ?? "").trim();
    if (raw === "") return false;
    const v = gridValue(l2, k);
    return v === null || Math.abs(v - EXPECTED[k]) > TOLERANCE;
  });
}

/** How many of the six loss flags match the calculator. */
export function lossHolds(l2: Pick<L2State, "loss" | "lossNone">): { holds: number; answered: boolean } {
  const answered = CELL_KEYS.some((k) => l2.loss[k]) || l2.lossNone;
  const holds = CELL_KEYS.filter((k) => !!l2.loss[k] === LOSS_CELLS.includes(k)).length;
  return { holds, answered };
}

const isCandidate = (n: number) => Math.abs(n) >= 100;
const near = (a: number, b: number) => Math.abs(a - b) <= Math.max(TOLERANCE, Math.abs(b) * 0.005);

/**
 * Figures in a justification that match a value the grid shows: the calculator's result for any cell, a
 * uniform total, or one of the learner's own grid entries. Small numbers (percentages, counts) are ignored, so
 * "8% off" does not count as citing a figure.
 */
export function citedGridFigures(text: string, l2: Pick<L2State, "grid">): number[] {
  const printed = [
    ...Object.values(NET),
    ...Object.values(UNIFORM),
    ...Object.values(EXPECTED_UNIFORM),
    LOCAL_BEST_TOTAL,
    LOCAL_BEST_TOTAL - UNIFORM[UNIFORM_BEST],
  ];
  const mine = CELL_KEYS.map((k) => gridValue(l2, k)).filter((v): v is number => v !== null);
  const seen = new Set<number>();
  const out: number[] = [];
  for (const raw of amountsIn(text)) {
    for (const n of [raw, -raw]) {
      if (!isCandidate(n) || seen.has(Math.abs(n))) continue;
      if (printed.some((p) => near(p, n)) || mine.some((m) => near(m, n))) {
        seen.add(Math.abs(n));
        out.push(Math.abs(n));
      }
    }
  }
  return out;
}
