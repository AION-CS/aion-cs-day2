"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { CELL_KEYS, OPTIONS, OPT_IDS, SEGMENTS, SEG_IDS, cellFormula, cellKey, cellLabel, cellSources, parseKey } from "@/data/segments";
import type { OptId, SegId } from "@/data/segments";
import { flagsForGrid, lossHolds, citedGridFigures } from "@/lib/checks";
import { lossKey, recommendationKey, uniformKey } from "@/lib/answerKey";
import { GRID_BUILDERS, gridPartFlags } from "@/lib/calcBuilder";
import { scrollToAndFlash } from "@/lib/flash";
import { cellGuide, lossGuide, recommendGuide, tradeoffGuide } from "@/lib/mentorGuide";
import { IDS } from "@/lib/missing";
import { useJumpTo } from "@/lib/useJumpTo";
import { getLeakSentence, weakestLabel } from "@/store/selectors";
import { useHydrated, useStore } from "@/store/useStore";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { CalcDiagnosis } from "@/components/ui/CalcDiagnosis";
import { Field } from "@/components/ui/Field";
import { FormulaBuilder } from "@/components/ui/FormulaBuilder";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { RevealHint } from "@/components/ui/RevealHint";

const GRID_CLUE =
  "Select this option and segment in the calculator again. Which line of its working is the net impact, and does your figure match it, sign included?";

/** Block 2.1 — the net-impact grid, three options by two segments. One shared grid, checked on request. */
export function GridBlock() {
  const l2 = useStore((s) => s.l2);
  const setGrid = useStore((s) => s.setGrid);
  const check = useStore((s) => s.checkGrid);
  const showClue = useStore((s) => s.showGridClue);
  const flagged = new Set(l2.gridFlagged);
  const filled = CELL_KEYS.filter((k) => (l2.grid[k] ?? "").trim()).length;
  const [helpCell, setHelpCell] = useState<string | null>(null);

  // A check that flags a part opens the help for that cell, so a flag never sits behind a closed panel.
  useEffect(() => {
    const first = l2.partFlags[0];
    if (first) setHelpCell(first.split(".")[0]);
  }, [l2.partFlags]);

  const openHelp = (k: string) => {
    setHelpCell(k);
    window.setTimeout(() => scrollToAndFlash("cell-help", "ref", "start"), 60);
  };

  return (
    <div className="space-y-4">
      <p className="text-caption text-ash">
        One cell per combination. Type the net impact in euros the calculator shows: a loss with a minus sign (for example −4,872). Any layout works: 4872, 4,872 or €4.872.
      </p>
      <p className="text-caption text-ink">
        The method is taught in Materi B3, with a worked example on Alpenwerk&apos;s numbers. Try each cell yourself first. If you get stuck, press <strong>Help for this cell</strong> under it: it opens two helps, &ldquo;Show the formula&rdquo; (in
        words, with a calculator that checks each part) and &ldquo;Show where the numbers are&rdquo; (the exact rows of the tables above). You are practising combining the numbers correctly.
      </p>
      <div className="grid gap-3 md:grid-cols-[minmax(0,12rem)_repeat(2,minmax(0,1fr))]">
        <div className="hidden md:block" />
        {SEG_IDS.map((s) => (
          <p key={s} className="hidden text-caption font-semibold md:block">
            {SEGMENTS[s].name}
          </p>
        ))}
        {OPT_IDS.map((o) => (
          <div key={o} className="contents">
            <p className="text-caption font-semibold md:self-center">{OPTIONS[o].name}</p>
            {SEG_IDS.map((s) => {
              const k = cellKey(o, s);
              const isFlag = flagged.has(k);
              return (
                <div key={s} id={IDS.grid(k)} className={clsx("space-y-1 p-1", isFlag && "is-flagged")}>
                  <label htmlFor={`in-${IDS.grid(k)}`} className="block text-micro font-semibold uppercase text-ash md:sr-only">
                    {SEGMENTS[s].name} · net impact (€)
                  </label>
                  <input
                    id={`in-${IDS.grid(k)}`}
                    inputMode="decimal"
                    autoComplete="off"
                    className="field tnum"
                    value={l2.grid[k] ?? ""}
                    onChange={(e) => setGrid(k, e.target.value)}
                    aria-label={`${cellLabel(k)}, net impact in euros`}
                    placeholder="e.g. 12,345 or −1,234"
                  />
                  {isFlag && (
                    <CalcDiagnosis
                      builder={GRID_BUILDERS[k]}
                      figure={k}
                      parts={l2.parts}
                      partFlags={l2.partFlags}
                      name="this cell"
                      mismatch={(r) => `Every part of the formula is right and gives ${r}, but your entry in this cell differs. Press “Help for this cell”, open “Show the formula” and press “Use this result”, or retype the figure with its sign.`}
                    />
                  )}
                  {isFlag &&
                    (l2.gridClue[k] ? (
                      <p role="status" className="fade-in rounded-md border border-gold bg-accentSoft px-2 py-1 text-micro normal-case tracking-normal text-ink">
                        <span className="smallcaps mr-1 text-accent">Clue</span>
                        {GRID_CLUE}
                      </p>
                    ) : (
                      <button type="button" onClick={() => showClue(k)} className="btn-ghost btn-sm border-gold">
                        Show clue
                      </button>
                    ))}
                  <button type="button" onClick={() => openHelp(k)} className="btn-ghost btn-sm" aria-controls="cell-help">
                    Help for this cell
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3">
        <button type="button" onClick={() => check(flagsForGrid(l2), gridPartFlags(l2.parts))} className="btn-primary">
          Check my grid
        </button>
        <span className="text-caption text-ash">
          {filled} of {CELL_KEYS.length} cells filled · Checks requested: <span className="tnum font-semibold text-ink">{l2.checks}</span>
        </span>
        <span className="text-caption text-ash">A check outlines in amber (±€5); it never gives the figure.</span>
      </div>
      {l2.checks > 0 && (
        <p role="status" className="text-caption text-ink">
          {l2.gridFlagged.length === 0 ? "No filled cell is outlined." : `${l2.gridFlagged.length} filled ${l2.gridFlagged.length === 1 ? "cell is" : "cells are"} outlined in amber.`}
          {l2.partFlags.length > 0 &&
            ` ${l2.partFlags.length} ${l2.partFlags.length === 1 ? "part" : "parts"} in the formula calculators ${l2.partFlags.length === 1 ? "is" : "are"} outlined, each naming the row to read.`}
        </p>
      )}

      <div id="cell-help" className="space-y-2 rounded-lg border border-line bg-paper p-3">
        <p className="smallcaps">Help with one cell</p>
        <div role="group" aria-label="Choose a cell" className="flex flex-wrap gap-2">
          {CELL_KEYS.map((k) => {
            const partFlagged = l2.partFlags.some((f) => f.startsWith(`${k}.`));
            return (
              <button
                key={k}
                type="button"
                aria-pressed={helpCell === k}
                onClick={() => setHelpCell(k)}
                className={clsx(
                  "btn btn-sm min-h-[40px] border",
                  partFlagged && "is-flagged",
                  helpCell === k ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
                )}
              >
                {cellLabel(k)}
              </button>
            );
          })}
        </div>
        {helpCell ? (
          <CellHelp key={helpCell} cell={helpCell} />
        ) : (
          <p className="text-caption text-ash">Choose a cell to open its formula and the list of numbers it is built from. Nothing opens until you ask.</p>
        )}
      </div>

      <div className="space-y-2">
        {CELL_KEYS.map((k) => (
          <MentorGuide key={k} guide={cellGuide(k)} />
        ))}
      </div>
    </div>
  );
}

/** The two on-demand helps for one grid cell, hidden until asked for: the formula in words with the automatic calculator, and the printed rows it uses. */
function CellHelp({ cell }: { cell: string }) {
  const parts = useStore((s) => s.l2.parts);
  const partFlags = useStore((s) => s.l2.partFlags);
  const setPart = useStore((s) => s.setL2Part);
  const setGrid = useStore((s) => s.setGrid);
  const { opt, seg } = parseKey(cell);
  const anyFlag = partFlags.some((k) => k.startsWith(`${cell}.`));
  return (
    <div className="flex flex-wrap items-start gap-2">
      <RevealHint id={`formula-${cell}`} label="Show the formula" title={`Formula · ${cellLabel(cell)} · from Materi B3`} forceOpen={anyFlag}>
        <p className="text-caption text-ink">{cellFormula(opt)}</p>
        <FormulaBuilder
          figure={cell}
          builder={GRID_BUILDERS[cell]}
          parts={parts}
          partFlags={partFlags}
          onPart={setPart}
          onUse={(v) => setGrid(cell, String(Math.round(v * 100) / 100))}
          unit="€ per year"
          label={cellLabel(cell)}
          source="the tables in the calculator above"
        />
      </RevealHint>
      <RevealHint id={`src-${cell}`} label="Show where the numbers are" title="Numbers you need · click one to see it in its table">
        <ul className="space-y-1">
          {cellSources(opt, seg).map((src) => (
            <li key={src.label}>
              <button
                type="button"
                onClick={() => scrollToAndFlash(src.target, "ref")}
                className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left text-caption hover:bg-accentSoft"
              >
                <span className="text-micro font-semibold uppercase text-ash">{src.where}</span>
                <span className="text-ink">{src.label}:</span>
                <span className="tnum font-semibold text-ink">{src.value}</span>
              </button>
            </li>
          ))}
        </ul>
      </RevealHint>
    </div>
  );
}

/** Block 2.2 — which cells show a net loss. Six binary answers: a check reports only how many hold. */
export function LossBlock() {
  const l2 = useStore((s) => s.l2);
  const toggle = useStore((s) => s.toggleLoss);
  const setNone = useStore((s) => s.setLossNone);
  const check = useStore((s) => s.checkLoss);
  const showClue = useStore((s) => s.showLossClue);
  const res = l2.lossResult;

  return (
    <div className="space-y-3">
      <Field
        id={IDS.loss}
        label="Cells that show a net loss"
        help="Select every cell whose net impact is negative in your grid, or state that none is."
      >
        <div role="group" aria-label="Cells with a net loss" className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {CELL_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={!!l2.loss[k]}
              onClick={() => toggle(k)}
              className={clsx(
                "rounded-lg border px-3 py-2 text-left text-caption font-semibold transition-colors",
                l2.loss[k] ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
              )}
            >
              {l2.loss[k] ? "◐ " : "○ "}
              {cellLabel(k)}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={l2.lossNone}
            onClick={() => setNone(!l2.lossNone)}
            className={clsx(
              "rounded-lg border px-3 py-2 text-left text-caption font-semibold transition-colors sm:col-span-2 md:col-span-3",
              l2.lossNone ? "border-accent bg-accentSoft text-ink" : "border-dashed border-ash/60 bg-mist/50 text-ash hover:border-ash",
            )}
          >
            No cell shows a net loss
          </button>
        </div>
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => check(lossHolds(l2).holds)} className="btn-primary btn-sm">
          Check my marks
        </button>
        {!l2.lossClue && (
          <button type="button" onClick={showClue} className="btn-ghost btn-sm border-gold">
            Show clue
          </button>
        )}
        <span className="text-caption text-ash">
          Checks requested: <span className="tnum font-semibold text-ink">{l2.checks}</span>
        </span>
      </div>
      {l2.lossClue && (
        <p role="status" className="fade-in rounded-md border border-gold bg-accentSoft px-3 py-2 text-caption text-ink">
          <span className="smallcaps mr-1 text-accent">Clue</span>
          In the calculator&apos;s working, for each combination: is the cost line larger than the extra gross profit line? That is the whole test, applied to all six cells alike.
        </p>
      )}
      <p className="text-micro normal-case tracking-normal text-ash">A check counts how many of the six cells are marked correctly. It never says which, because each cell is a yes or no.</p>
      {res && lossHolds(l2).answered && (
        <p role="status" className="text-caption text-ink">
          {res.holds} of {CELL_KEYS.length} cells hold.
        </p>
      )}
      <AnswerKey block={lossKey()} />
      <MentorGuide guide={lossGuide()} />
    </div>
  );
}

/** A small reference box quoting the learner's own Task 1 answers as context. Never introduces a new case fact. */
function TaskOneQuote() {
  const hydrated = useHydrated();
  const weakest = useStore((s) => s.l1.weakest);
  const sentence = useStore((s) => getLeakSentence({ l1: s.l1 }));
  const jump = useJumpTo();
  if (!hydrated) return <div id={IDS.taskOneQuote} className="min-h-[3rem]" />;
  return (
    <aside id={IDS.taskOneQuote} className="rounded-lg border border-line bg-mist/60 p-3 text-caption">
      <p className="smallcaps">Your Task 1 answer · for context</p>
      {weakest || sentence ? (
        <div className="mt-1 space-y-1 text-ink">
          <p>
            Largest negative gap you named: <strong>{weakestLabel(weakest) || "—"}</strong>
          </p>
          <blockquote className="border-l-4 border-gold bg-accentSoft px-3 py-1.5">{sentence || "You have not written the cost sentence yet."}</blockquote>
        </div>
      ) : (
        <p className="mt-1 text-ash">You have not answered Task 1 yet. Nothing here depends on it.</p>
      )}
      <button type="button" onClick={() => jump(IDS.sentence, "/route-1/")} className="btn-ghost btn-sm mt-2">
        {sentence ? "Open it in Route 1" : "Go to Task 1, Block 1.4"}
      </button>
    </aside>
  );
}

function OptionPicker({ label, value, onPick, name }: { label: string; value: OptId | null; onPick: (o: OptId) => void; name: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-2 sm:grid-cols-3">
      {OPT_IDS.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onPick(o)}
          data-name={name}
          className={clsx(
            "rounded-lg border px-3 py-2 text-left text-caption font-semibold transition-colors",
            value === o ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
          )}
        >
          {OPTIONS[o].name}
        </button>
      ))}
    </div>
  );
}

/** Block 2.3 — one option per segment, defended with a € figure from the grid. Judged: nothing here is marked. */
export function RecommendBlock() {
  const l2 = useStore((s) => s.l2);
  const setRec = useStore((s) => s.setRec);
  const setJust = useStore((s) => s.setJust);

  return (
    <div className="space-y-4">
      <TaskOneQuote />
      {SEG_IDS.map((s: SegId) => {
        const n = citedGridFigures(l2.just[s], l2).length;
        return (
          <div key={s} className="space-y-3 rounded-lg border border-line p-3">
            <Field
              id={IDS.rec(s)}
              label={`Which option do you recommend for ${SEGMENTS[s].name}?`}
              help="Pick one. A recommendation is defended by a figure, in the next field."
            >
              <OptionPicker label={`Option for ${SEGMENTS[s].name}`} value={l2.rec[s]} onPick={(o) => setRec(s, o)} name={s} />
            </Field>
            <Field
              id={IDS.just(s)}
              htmlFor={`just-input-${s}`}
              label="Why, in one or two sentences?"
              help="Cite at least one € figure from your grid. A recommendation with no number scores 0."
              meta={<span className="text-micro text-ash">{n === 0 ? "No figure from your grid cited yet" : `${n} figure${n === 1 ? "" : "s"} from your grid cited`}</span>}
            >
              <textarea
                id={`just-input-${s}`}
                rows={3}
                className="field"
                value={l2.just[s]}
                onChange={(e) => setJust(s, e.target.value)}
                placeholder="e.g. Option … nets … in this segment, against … for …"
              />
            </Field>
            <AnswerKey block={recommendationKey(s)} />
            <MentorGuide guide={recommendGuide(s)} />
          </div>
        );
      })}
    </div>
  );
}

/** Block 2.4 — the trap: one option across both segments, and what it gives up. Checked on request; the trade-off is judged. */
export function UniformBlock() {
  const l2 = useStore((s) => s.l2);
  const setUniform = useStore((s) => s.setUniform);
  const check = useStore((s) => s.checkUniform);
  const showClue = useStore((s) => s.showUniformClue);
  const setTradeoff = useStore((s) => s.setTradeoff);
  const n = citedGridFigures(l2.tradeoff, l2).length;

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-line bg-mist/60 p-3 text-body">
        DigitalIT Solutions can run <strong>only one</strong> option across <strong>both</strong> segments. Which single option gives the largest total net impact, and what does
        choosing it force you to give up?
      </p>
      <Field
        id={IDS.uniform}
        label="The single option for both segments"
        help="Pick one. Work from your grid: add each option's two segment results."
        flagged={l2.uniformFlagged}
        clue="For each option, add its project result and its retainer result. Which of the three totals is the largest? Note that this is not the same as picking each segment's best cell."
        clueShown={l2.uniformClue}
        onShowClue={showClue}
      >
        <OptionPicker label="Single option for both segments" value={l2.uniform} onPick={setUniform} name="uniform" />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => check(l2.uniform !== null && l2.uniform !== "C")} className="btn-primary btn-sm">
          Check my choice
        </button>
        <span className="text-caption text-ash">
          Checks requested: <span className="tnum font-semibold text-ink">{l2.checks}</span>
        </span>
      </div>
      <Field
        id={IDS.tradeoff}
        htmlFor="tradeoff"
        label="What does that choice give up?"
        help="Two or three sentences. Name what you give up in each segment, in euros from your grid, compared with that segment's own best option. A letter alone is not an answer."
        meta={<span className="text-micro text-ash">{n === 0 ? "No figure from your grid cited yet" : `${n} figure${n === 1 ? "" : "s"} from your grid cited`}</span>}
      >
        <textarea
          id="tradeoff"
          rows={4}
          className="field"
          value={l2.tradeoff}
          onChange={(e) => setTradeoff(e.target.value)}
          placeholder="e.g. Choosing … nets … in total. In the … segment I give up … compared with …, and in the … segment …"
        />
        <UniformHelp />
      </Field>
      <AnswerKey block={uniformKey()} />
      <MentorGuide guide={tradeoffGuide()} />
    </div>
  );
}

/** Formula in words and the learner's own grid entries for Block 2.4, hidden until asked for. The method is taught in Materi B2. */
function UniformHelp() {
  const grid = useStore((s) => s.l2.grid);
  return (
    <div className="flex flex-wrap items-start gap-2">
      <RevealHint id="formula-uniform" label="Show the formula" title="Formula · from Materi B2">
        <p className="text-caption text-ink">
          Total of an option = its result in project clients + its result in retainer clients. The single best option is the largest total. What it gives up = for each segment, that segment&apos;s own best result minus the chosen option&apos;s
          result there; then add the two. Taught in Materi B2.
        </p>
      </RevealHint>
      <RevealHint id="src-uniform" label="Show where the numbers are" title="Numbers you need · your own grid from Block 2.1">
        <ul className="grid gap-1 sm:grid-cols-2">
          {CELL_KEYS.map((k) => (
            <li key={k}>
              <button
                type="button"
                onClick={() => scrollToAndFlash(IDS.grid(k), "ref")}
                className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left text-caption hover:bg-accentSoft"
              >
                <span className="text-ink">{cellLabel(k)}:</span>
                <span className="tnum font-semibold text-ink">{(grid[k] ?? "").trim() || "not entered yet"}</span>
              </button>
            </li>
          ))}
        </ul>
      </RevealHint>
    </div>
  );
}
