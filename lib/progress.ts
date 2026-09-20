import { MATERIALS } from "@/data/materialIndex";
import { CELL_KEYS, SEG_IDS } from "@/data/segments";
import { ROW_IDS, COLS, cellId } from "@/data/funnel";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { citedGridFigures, citesFunnelFigure } from "@/lib/checks";
import type { Persisted } from "@/store/useStore";

export type TaskBlockId = "b11" | "b12" | "b13" | "b14" | "b21" | "b22" | "b23" | "b24";

/** Which task blocks are complete — complete means filled in, never correct. */
export function taskBlocks(p: Persisted): Record<TaskBlockId, boolean> {
  const { l1, l2 } = p;
  return {
    b11: TOUCHPOINTS.every((t) => l1.sort[t.id] !== null),
    b12: ROW_IDS.every((r) => COLS.every((c) => (l1.fill[cellId(r, c)] ?? "").trim() !== "")),
    b13: l1.weakest !== null,
    b14: l1.sentence.trim().length >= 30 && citesFunnelFigure(l1.sentence),
    b21: CELL_KEYS.every((k) => (l2.grid[k] ?? "").trim() !== ""),
    b22: CELL_KEYS.some((k) => l2.loss[k]) || l2.lossNone,
    b23: SEG_IDS.every((s) => l2.rec[s] !== null && l2.just[s].trim() !== "" && citedGridFigures(l2.just[s], l2).length > 0),
    b24: l2.uniform !== null && l2.tradeoff.trim().length >= 40 && citedGridFigures(l2.tradeoff, l2).length > 0,
  };
}

const BLOCKS_OF: Record<1 | 2, TaskBlockId[]> = {
  1: ["b11", "b12", "b13", "b14"],
  2: ["b21", "b22", "b23", "b24"],
};

/** Dossier progress for one route: its cards marked read + its task blocks completed. Route 3 is not built. */
export function dossierProgress(p: Persisted, route: 1 | 2 | 3): { done: number; total: number } {
  if (route === 3) return { done: 0, total: 0 };
  const block = route === 1 ? "A" : "B";
  const cards = MATERIALS.filter((m) => m.block === block);
  const read = cards.filter((m) => p.ui.sectionsRead[m.id]).length;
  const tb = taskBlocks(p);
  const done = BLOCKS_OF[route].filter((b) => tb[b]).length;
  return { done: read + done, total: cards.length + BLOCKS_OF[route].length };
}
