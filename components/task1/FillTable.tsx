"use client";

import { COLS, COL_LABEL, ROW_IDS, ROW_LABEL, cellId } from "@/data/funnel";
import type { Col, RowId } from "@/data/funnel";
import { colOf, flagsForFill, rowOf } from "@/lib/checks";
import { IDS } from "@/lib/missing";
import { useStore } from "@/store/useStore";

const HELP: Record<Col, string> = {
  actual: "The conversion printed beside the arrow, in %.",
  bench: "The number after “ref” beside the arrow, in %.",
  gap: "Actual minus benchmark, in percentage points, with its sign.",
};

const CLUE = (row: RowId, col: Col): string => {
  if (col === "actual")
    return row === "repeat"
      ? "The rate is printed on the bar beneath the funnel. Which number sits at the left end of the filled bar?"
      : "Divide the count at this stage by the count at the stage above it. Which two counts does this arrow join?";
  if (col === "bench") return "The reference is printed in grey after “ref”, next to the actual figure. Which number follows “ref” on this arrow?";
  return "The gap is the actual minus the benchmark. Which of the two is larger here, and does the sign in your cell say so?";
};

/**
 * Block 1.2 — the funnel's own figures, transcribed into a table. Six rows (five arrows and the repeat-purchase
 * line), three cells each. A check outlines the cells outside ±0.1 and offers one clue per cell.
 */
export function FillTable() {
  const l1 = useStore((s) => s.l1);
  const setFill = useStore((s) => s.setFill);
  const checkFill = useStore((s) => s.checkFill);
  const showClue = useStore((s) => s.showFillClue);
  const flaggedSet = new Set(l1.fillFlagged);
  const filled = ROW_IDS.flatMap((r) => COLS.map((c) => cellId(r, c))).filter((id) => (l1.fill[id] ?? "").trim()).length;

  return (
    <div className="space-y-4">
      <dl className="grid gap-x-4 gap-y-1 text-caption text-ash sm:grid-cols-3">
        {COLS.map((c) => (
          <div key={c}>
            <dt className="font-semibold text-ink">{COL_LABEL[c]}</dt>
            <dd>{HELP[c]}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-3">
        {ROW_IDS.map((r) => (
          <fieldset key={r} className="rounded-lg border border-line bg-paper p-3">
            <legend className="px-1 text-caption font-semibold text-ink">{ROW_LABEL[r]}</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {COLS.map((c) => {
                const id = cellId(r, c);
                const flagged = flaggedSet.has(id);
                return (
                  <div key={c} id={IDS.cell(id)} className={flagged ? "is-flagged space-y-1 p-1" : "space-y-1 p-1"}>
                    <label htmlFor={`in-${IDS.cell(id)}`} className="block text-micro font-semibold uppercase text-ash">
                      {COL_LABEL[c]}
                    </label>
                    <input
                      id={`in-${IDS.cell(id)}`}
                      inputMode="decimal"
                      autoComplete="off"
                      className="field tnum"
                      value={l1.fill[id] ?? ""}
                      onChange={(e) => setFill(id, e.target.value)}
                      aria-label={`${ROW_LABEL[r]}, ${COL_LABEL[c]}`}
                      placeholder={c === "gap" ? "e.g. −4.5" : "e.g. 12.3"}
                    />
                    {flagged &&
                      (l1.fillClue[id] ? (
                        <p role="status" className="fade-in rounded-md border border-gold bg-accentSoft px-2 py-1 text-micro normal-case tracking-normal text-ink">
                          <span className="smallcaps mr-1 text-accent">Clue</span>
                          {CLUE(rowOf(id), colOf(id))}
                        </p>
                      ) : (
                        <button type="button" onClick={() => showClue(id)} className="btn-ghost btn-sm border-gold">
                          Show clue
                        </button>
                      ))}
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3">
        <button type="button" onClick={() => checkFill(flagsForFill(l1.fill))} className="btn-primary">
          Check my table
        </button>
        <span className="text-caption text-ash">
          {filled} of {ROW_IDS.length * COLS.length} cells filled · Checks requested: <span className="tnum font-semibold text-ink">{l1.checks}</span>
        </span>
        <span className="text-caption text-ash">A check outlines in amber; it never gives the number.</span>
      </div>
      {l1.checks > 0 && (
        <p role="status" className="text-caption text-ink">
          {l1.fillFlagged.length === 0 ? "No filled cell is outlined." : `${l1.fillFlagged.length} filled ${l1.fillFlagged.length === 1 ? "cell is" : "cells are"} outlined in amber.`}
        </p>
      )}
    </div>
  );
}
