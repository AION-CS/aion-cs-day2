import { MATERIALS } from "@/data/materialIndex";
import { CELL_KEYS, SEG_IDS } from "@/data/segments";
import { ROW_IDS, COLS, cellId } from "@/data/funnel";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { citedGridFigures, citesFunnelFigure } from "@/lib/checks";
import { fundedItems, hasThreshold, overBy, sequenceTruth } from "@/lib/program";
import type { Persisted } from "@/store/useStore";

export type TaskBlockId = "b11" | "b12" | "b13" | "b14" | "b21" | "b22" | "b23" | "b24" | "b31" | "b32" | "b33" | "b34" | "b35" | "c31" | "c32";

/** Which task blocks are complete — complete means filled in, never correct. */
export function taskBlocks(p: Persisted): Record<TaskBlockId, boolean> {
  const { l1, l2, route3: r3 } = p;
  const funded = fundedItems(r3.alloc);
  const seq = sequenceTruth(r3.alloc, r3.start);
  return {
    b11: TOUCHPOINTS.every((t) => l1.sort[t.id] !== null),
    b12: ROW_IDS.every((r) => COLS.every((c) => (l1.fill[cellId(r, c)] ?? "").trim() !== "")),
    b13: l1.weakest !== null,
    b14: l1.sentence.trim().length >= 30 && citesFunnelFigure(l1.sentence),
    b21: CELL_KEYS.every((k) => (l2.grid[k] ?? "").trim() !== ""),
    b22: CELL_KEYS.some((k) => l2.loss[k]) || l2.lossNone,
    b23: SEG_IDS.every((s) => l2.rec[s] !== null && l2.just[s].trim() !== "" && citedGridFigures(l2.just[s], l2).length > 0),
    b24: l2.uniform !== null && l2.tradeoff.trim().length >= 40 && citedGridFigures(l2.tradeoff, l2).length > 0,
    b31: funded.length > 0 && overBy(r3.alloc) === 0 && funded.every((i) => r3.start[i] !== null),
    b32: r3.warned !== null && (r3.warned === false || r3.missingKpi !== null) && !seq.pending,
    b33: r3.cut.trim().length >= 40,
    b34: funded.length > 0 && funded.every((i) => r3.gov[i].owner && r3.gov[i].cadence && r3.gov[i].trigger.trim().length >= 12 && hasThreshold(r3.gov[i].trigger)),
    b35: r3.postponed.trim().length >= 30 && r3.pickup !== "",
    // The two blocks of the Case File's decision part: 3.1 allocate and set the start months, 3.2 leave out and own.
    c31: funded.length > 0 && overBy(r3.alloc) === 0 && funded.every((i) => r3.start[i] !== null),
    c32:
      r3.postponed.trim().length >= 30 &&
      r3.pickup !== "" &&
      funded.length > 0 &&
      funded.every((i) => r3.gov[i].owner && r3.gov[i].cadence && r3.gov[i].trigger.trim().length >= 12 && hasThreshold(r3.gov[i].trigger)),
  };
}

/**
 * The Case File of Route 1 (CLAUDE.md #29): one task with nine blocks. Core blocks give a complete file; Optional
 * blocks are for whoever has time and are never listed as missing.
 */
export const CASE_CORE: TaskBlockId[] = ["b13", "b14", "b21", "b23", "c31", "c32"];
export const CASE_OPTIONAL: TaskBlockId[] = ["b11", "b12", "b22"];

const BLOCKS_OF: Record<1 | 2 | 3, TaskBlockId[]> = {
  1: CASE_CORE,
  2: ["b21", "b22", "b23", "b24"],
  3: ["b31", "b32", "b33", "b34", "b35"],
};

/** Dossier progress for one route: its cards marked read + its task blocks completed. */
export function dossierProgress(p: Persisted, route: 1 | 2 | 3): { done: number; total: number } {
  const block = route === 1 ? "A" : route === 2 ? "B" : "C";
  const cards = MATERIALS.filter((m) => m.block === block);
  const read = cards.filter((m) => p.ui.sectionsRead[m.id]).length;
  const tb = taskBlocks(p);
  const done = BLOCKS_OF[route].filter((b) => tb[b]).length;
  return { done: read + done, total: cards.length + BLOCKS_OF[route].length };
}
