import { ROW_IDS, ROW_LABEL, COLS, COL_LABEL, cellId } from "@/data/funnel";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { CELL_KEYS, SEG_IDS, SEGMENTS, cellLabel } from "@/data/segments";
import { citedGridFigures, citesFunnelFigure } from "@/lib/checks";
import { ITEMS, ITEM_IDS } from "@/data/program";
import { fundedItems, hasThreshold, overBudgetLines } from "@/lib/program";
import type { Persisted } from "@/store/useStore";

/** DOM ids the missing list points at. One place, so the list and the UI cannot drift. */
export const IDS = {
  participant: "participant-strip",
  touchpoint: (id: string) => `tp-${id}`,
  cell: (id: string) => `cell-${id.replace(".", "-")}`,
  weakest: "weakest-field",
  sentence: "cost-sentence-field",
  exportL1: "export-l1",
  // Route 2
  grid: (k: string) => `grid-${k}`,
  loss: "loss-field",
  rec: (s: string) => `rec-${s}`,
  just: (s: string) => `just-${s}`,
  uniform: "uniform-field",
  tradeoff: "tradeoff-field",
  taskOneQuote: "task1-quote",
  exportL2: "export-l2",
  // Route 3
  allocGrid: "alloc-grid",
  allocTotal: "alloc-total",
  leverPick: "lever-pick",
  start: (i: string) => `start-${i}`,
  seqAnswers: "seq-answers",
  cut: "cut-field",
  gov: (i: string) => `gov-${i}`,
  postponed: "postponed-field",
  pickup: "pickup-field",
  exportL3: "export-l3",
} as const;

export type MissingEntry = { id: string; label: string };

export function participantMissing(p: Persisted): MissingEntry[] {
  const bad = !/^\d+$/.test(p.participant.no.trim()) || !p.participant.name.trim();
  return bad ? [{ id: IDS.participant, label: "Participant number and name are needed for the file name." }] : [];
}

/** Everything still missing from the Task 1 diagnostic note, each with the element to jump to. */
export function l1Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { sort, fill, weakest, sentence } = p.l1;
  for (const t of TOUCHPOINTS) {
    if (sort[t.id] === null) out.push({ id: IDS.touchpoint(t.id), label: `Block 1.1: “${t.label}” is not sorted into a phase.` });
  }
  for (const r of ROW_IDS) {
    for (const c of COLS) {
      if (!(fill[cellId(r, c)] ?? "").trim()) {
        out.push({ id: IDS.cell(cellId(r, c)), label: `Block 1.2: “${ROW_LABEL[r]}” has no ${COL_LABEL[c].toLowerCase()}.` });
      }
    }
  }
  if (!weakest) out.push({ id: IDS.weakest, label: "Block 1.3: the stage with the largest negative gap is not named." });
  const s = sentence.trim();
  if (!s) out.push({ id: IDS.sentence, label: "Block 1.4: the one-sentence cost of the leak is empty." });
  else if (s.length < 30) out.push({ id: IDS.sentence, label: "Block 1.4: the sentence needs at least 30 characters." });
  else if (!citesFunnelFigure(s)) out.push({ id: IDS.sentence, label: "Block 1.4: the sentence states no number derived from the funnel." });
  return out;
}

export function l2Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { l2 } = p;
  for (const k of CELL_KEYS) {
    if (!(l2.grid[k] ?? "").trim()) out.push({ id: IDS.grid(k), label: `Block 2.1: net impact for ${cellLabel(k)} is empty.` });
  }
  if (!CELL_KEYS.some((k) => l2.loss[k]) && !l2.lossNone) {
    out.push({ id: IDS.loss, label: "Block 2.2: mark the cells that show a net loss, or state that none does." });
  }
  for (const s of SEG_IDS) {
    if (!l2.rec[s]) out.push({ id: IDS.rec(s), label: `Block 2.3: no option chosen for ${SEGMENTS[s].name}.` });
    const j = l2.just[s].trim();
    if (!j) out.push({ id: IDS.just(s), label: `Block 2.3: the justification for ${SEGMENTS[s].name} is empty.` });
    else if (citedGridFigures(j, l2).length === 0) {
      out.push({ id: IDS.just(s), label: `Block 2.3: the justification for ${SEGMENTS[s].name} cites no € figure from your grid.` });
    }
  }
  if (!l2.uniform) out.push({ id: IDS.uniform, label: "Block 2.4: no single option chosen for both segments." });
  const t = l2.tradeoff.trim();
  if (!t) out.push({ id: IDS.tradeoff, label: "Block 2.4: the trade-off is empty." });
  else if (t.length < 40) out.push({ id: IDS.tradeoff, label: "Block 2.4: the trade-off needs at least 40 characters." });
  else if (citedGridFigures(t, l2).length === 0) out.push({ id: IDS.tradeoff, label: "Block 2.4: the trade-off cites no € figure from your grid." });
  return out;
}

/** The grid opens once Route 1 has diagnosed the leak and Route 2 has chosen one option for both segments. */
export const l3Unlocked = (p: Persisted) => p.l1.weakest !== null && p.l2.uniform !== null;

export function l3Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const r = p.route3;
  if (!p.l1.weakest) out.push({ id: IDS.weakest, label: "Unlock the grid: name the weakest funnel stage in Route 1 (Block 1.3)." });
  if (!p.l2.uniform) out.push({ id: IDS.uniform, label: "Unlock the grid: choose one option for both segments in Route 2 (Block 2.4)." });
  const funded = fundedItems(r.alloc);
  if (funded.length === 0) out.push({ id: IDS.allocGrid, label: "Block 3.1: no line item is funded." });
  const over = overBudgetLines(r.alloc);
  if (over.length > 0) out.push({ id: IDS.allocTotal, label: `Block 3.1: ${over.slice(0, 2).join(" ")}` });
  for (const i of funded) {
    if (r.start[i] === null) out.push({ id: IDS.start(i), label: `Block 3.2: item ${ITEMS[i].n} (${ITEMS[i].short}) has no start month.` });
  }
  if (r.warned === null) out.push({ id: IDS.seqAnswers, label: "Block 3.2: record whether the KPI-blind-spot warning appeared for your sequence." });
  else if (r.warned && r.missingKpi === null) out.push({ id: IDS.seqAnswers, label: "Block 3.2: name the KPI that loses its baseline." });
  const cut = r.cut.trim();
  if (!cut) out.push({ id: IDS.cut, label: "Block 3.3: what was cut is empty." });
  else if (cut.length < 40) out.push({ id: IDS.cut, label: "Block 3.3: what was cut needs at least 40 characters: name the item and its consequence." });
  for (const i of funded) {
    const g = r.gov[i];
    const name = `item ${ITEMS[i].n} (${ITEMS[i].short})`;
    if (!g.owner) out.push({ id: IDS.gov(i), label: `Block 3.4: ${name} has no owner.` });
    if (!g.cadence) out.push({ id: IDS.gov(i), label: `Block 3.4: ${name} has no review cadence.` });
    if (!g.trigger.trim()) out.push({ id: IDS.gov(i), label: `Block 3.4: ${name} has no escalation trigger.` });
    else if (g.trigger.trim().length < 12 || !hasThreshold(g.trigger)) out.push({ id: IDS.gov(i), label: `Block 3.4: the trigger for ${name} names no threshold (a number).` });
  }
  const post = r.postponed.trim();
  if (!post) out.push({ id: IDS.postponed, label: "Block 3.5: the measure you postponed is empty. It is required." });
  else if (post.length < 30) out.push({ id: IDS.postponed, label: "Block 3.5: the measure you postponed needs at least 30 characters: name it and why it waits." });
  if (!r.pickup) out.push({ id: IDS.pickup, label: "Block 3.5: no pickup point is chosen for the postponed measure." });
  return out;
}

export { ITEM_IDS };
