import { ROW_IDS, ROW_LABEL, COLS, COL_LABEL, cellId } from "@/data/funnel";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { CELL_KEYS, SEG_IDS, SEGMENTS, cellLabel } from "@/data/segments";
import { citedGridFigures, citesFunnelFigure } from "@/lib/checks";
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
