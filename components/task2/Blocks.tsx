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
import { useMateri } from "@/lib/materiAlias";
import { getLeakSentence, weakestLabel } from "@/store/selectors";
import { useHydrated, useStore } from "@/store/useStore";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { CalcDiagnosis } from "@/components/ui/CalcDiagnosis";
import { Field } from "@/components/ui/Field";
import { FormulaBuilder } from "@/components/ui/FormulaBuilder";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { tt } from "@/lib/lang";

const GRID_CLUE = () =>
  tt(
    "Select this option and segment in the calculator again. Which line of its working is the net impact, and does your figure match it, sign included?",
    "Wählen Sie diese Option und dieses Segment im Rechner noch einmal. Welche Zeile der Rechnung ist der Nettoeffekt, und stimmt Ihre Zahl damit überein, Vorzeichen eingeschlossen?",
  );

const cited = (n: number) =>
  n === 0
    ? tt("No figure from your grid cited yet", "Noch keine Zahl aus Ihrem Raster zitiert")
    : tt(`${n} figure${n === 1 ? "" : "s"} from your grid cited`, `${n} ${n === 1 ? "Zahl" : "Zahlen"} aus Ihrem Raster zitiert`);

/** Block 2.1 — the net-impact grid, three options by two segments. One shared grid, checked on request. */
export function GridBlock() {
  const m = useMateri();
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
        {tt(
          "One cell per combination. Type the net impact in euros the calculator shows: a loss with a minus sign (for example −4,872). Any layout works: 4872, 4,872 or €4.872.",
          "Eine Zelle je Kombination. Tragen Sie den Nettoeffekt in Euro ein, den der Rechner zeigt: einen Verlust mit Minuszeichen (zum Beispiel −4.872). Jedes Format funktioniert: 4872, 4.872 oder 4.872 €.",
        )}
      </p>
      <p className="text-caption text-ink">
        {tt(
          <>
            The method is taught in {m.name("B3")}, with a worked example on Alpenwerk&apos;s numbers. Try each cell yourself first. If you get stuck, press <strong>Help for this cell</strong> under it: it opens two helps, &ldquo;Show the formula&rdquo; (in
            words, with a calculator that checks each part) and &ldquo;Show where the numbers are&rdquo; (the exact rows of the tables above). You are practising combining the numbers correctly.
          </>,
          <>
            Die Methode wird in {m.name("B3")} gelehrt, mit einem Rechenbeispiel zu den Zahlen von Alpenwerk. Versuchen Sie jede Zelle zuerst selbst. Wenn Sie nicht weiterkommen, drücken Sie darunter <strong>Hilfe zu dieser Zelle</strong>: Sie öffnet zwei Hilfen, „Formel anzeigen“ (in
            Worten, mit einem Rechner, der jeden Teil prüft) und „Zeigen, wo die Zahlen stehen“ (die genauen Zeilen der Tabellen oben). Sie üben, die Zahlen richtig zu verbinden.
          </>,
        )}
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
                    {SEGMENTS[s].name} · {tt("net impact (€)", "Nettoeffekt (€)")}
                  </label>
                  <input
                    id={`in-${IDS.grid(k)}`}
                    inputMode="decimal"
                    autoComplete="off"
                    className="field tnum"
                    value={l2.grid[k] ?? ""}
                    onChange={(e) => setGrid(k, e.target.value)}
                    aria-label={tt(`${cellLabel(k)}, net impact in euros`, `${cellLabel(k)}, Nettoeffekt in Euro`)}
                    placeholder={tt("e.g. 12,345 or −1,234", "z. B. 12.345 oder −1.234")}
                  />
                  {isFlag && (
                    <CalcDiagnosis
                      builder={GRID_BUILDERS[k]}
                      figure={k}
                      parts={l2.parts}
                      partFlags={l2.partFlags}
                      name={tt("this cell", "diese Zelle")}
                      mismatch={(r) =>
                        tt(
                          `Every part of the formula is right and gives ${r}, but your entry in this cell differs. Press “Help for this cell”, open “Show the formula” and press “Use this result”, or retype the figure with its sign.`,
                          `Jeder Teil der Formel stimmt und ergibt ${r}, aber Ihre Eingabe in dieser Zelle weicht ab. Drücken Sie „Hilfe zu dieser Zelle“, öffnen Sie „Formel anzeigen“ und drücken Sie „Dieses Ergebnis verwenden“, oder tippen Sie die Zahl mit Vorzeichen neu ein.`,
                        )
                      }
                    />
                  )}
                  {isFlag &&
                    (l2.gridClue[k] ? (
                      <p role="status" className="fade-in rounded-md border border-gold bg-accentSoft px-2 py-1 text-micro normal-case tracking-normal text-ink">
                        <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
                        {GRID_CLUE()}
                      </p>
                    ) : (
                      <button type="button" onClick={() => showClue(k)} className="btn-ghost btn-sm border-gold">
                        {tt("Show clue", "Hinweis anzeigen")}
                      </button>
                    ))}
                  <button type="button" onClick={() => openHelp(k)} className="btn-ghost btn-sm" aria-controls="cell-help">
                    {tt("Help for this cell", "Hilfe zu dieser Zelle")}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3">
        <button type="button" onClick={() => check(flagsForGrid(l2), gridPartFlags(l2.parts))} className="btn-primary">
          {tt("Check my grid", "Mein Raster prüfen")}
        </button>
        <span className="text-caption text-ash">
          {tt(`${filled} of ${CELL_KEYS.length} cells filled · Checks requested:`, `${filled} von ${CELL_KEYS.length} Zellen ausgefüllt · Angeforderte Prüfungen:`)}{" "}
          <span className="tnum font-semibold text-ink">{l2.checks}</span>
        </span>
        <span className="text-caption text-ash">{tt("A check outlines in amber (±€5); it never gives the figure.", "Eine Prüfung umrandet bernsteinfarben (±5 €); sie nennt nie die Zahl.")}</span>
      </div>
      {l2.checks > 0 && (
        <p role="status" className="text-caption text-ink">
          {l2.gridFlagged.length === 0
            ? tt("No filled cell is outlined.", "Keine ausgefüllte Zelle ist umrandet.")
            : tt(
                `${l2.gridFlagged.length} filled ${l2.gridFlagged.length === 1 ? "cell is" : "cells are"} outlined in amber.`,
                `${l2.gridFlagged.length} ausgefüllte ${l2.gridFlagged.length === 1 ? "Zelle ist" : "Zellen sind"} bernsteinfarben umrandet.`,
              )}
          {l2.partFlags.length > 0 &&
            tt(
              ` ${l2.partFlags.length} ${l2.partFlags.length === 1 ? "part" : "parts"} in the formula calculators ${l2.partFlags.length === 1 ? "is" : "are"} outlined, each naming the row to read.`,
              ` ${l2.partFlags.length} ${l2.partFlags.length === 1 ? "Teil" : "Teile"} in den Formelrechnern ${l2.partFlags.length === 1 ? "ist" : "sind"} umrandet und nennt jeweils die Zeile, die Sie lesen sollen.`,
            )}
        </p>
      )}

      <div id="cell-help" className="space-y-2 rounded-lg border border-line bg-paper p-3">
        <p className="smallcaps">{tt("Help with one cell", "Hilfe zu einer Zelle")}</p>
        <div role="group" aria-label={tt("Choose a cell", "Zelle wählen")} className="flex flex-wrap gap-2">
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
          <p className="text-caption text-ash">
            {tt(
              "Choose a cell to open its formula and the list of numbers it is built from. Nothing opens until you ask.",
              "Wählen Sie eine Zelle, um ihre Formel und die Liste der Zahlen zu öffnen, aus denen sie gebildet wird. Nichts öffnet sich, bevor Sie fragen.",
            )}
          </p>
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
  const m = useMateri();
  const parts = useStore((s) => s.l2.parts);
  const partFlags = useStore((s) => s.l2.partFlags);
  const setPart = useStore((s) => s.setL2Part);
  const setGrid = useStore((s) => s.setGrid);
  const { opt, seg } = parseKey(cell);
  const anyFlag = partFlags.some((k) => k.startsWith(`${cell}.`));
  return (
    <div className="flex flex-wrap items-start gap-2">
      <RevealHint
        id={`formula-${cell}`}
        label={tt("Show the formula", "Formel anzeigen")}
        title={tt(`Formula · ${cellLabel(cell)} · from ${m.name("B3")}`, `Formel · ${cellLabel(cell)} · aus ${m.name("B3")}`)}
        forceOpen={anyFlag}
      >
        <p className="text-caption text-ink">
          {cellFormula(opt)} {tt(`Taught in ${m.name("B3")}.`, `Gelehrt in ${m.name("B3")}.`)}
        </p>
        <FormulaBuilder
          figure={cell}
          builder={GRID_BUILDERS[cell]}
          parts={parts}
          partFlags={partFlags}
          onPart={setPart}
          onUse={(v) => setGrid(cell, String(Math.round(v * 100) / 100))}
          unit="€ per year"
          label={cellLabel(cell)}
          source={tt("the tables in the calculator above", "den Tabellen im Rechner oben")}
        />
      </RevealHint>
      <RevealHint
        id={`src-${cell}`}
        label={tt("Show where the numbers are", "Zeigen, wo die Zahlen stehen")}
        title={tt("Numbers you need · click one to see it in its table", "Zahlen, die Sie brauchen · klicken Sie eine an, um sie in ihrer Tabelle zu sehen")}
      >
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
        label={tt("Cells that show a net loss", "Zellen mit Nettoverlust")}
        help={tt(
          "Select every cell whose net impact is negative in your grid, or state that none is.",
          "Wählen Sie jede Zelle, deren Nettoeffekt in Ihrem Raster negativ ist, oder geben Sie an, dass keine es ist.",
        )}
      >
        <div role="group" aria-label={tt("Cells with a net loss", "Zellen mit Nettoverlust")} className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
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
            {tt("No cell shows a net loss", "Keine Zelle zeigt einen Nettoverlust")}
          </button>
        </div>
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => check(lossHolds(l2).holds)} className="btn-primary btn-sm">
          {tt("Check my marks", "Meine Markierungen prüfen")}
        </button>
        {!l2.lossClue && (
          <button type="button" onClick={showClue} className="btn-ghost btn-sm border-gold">
            {tt("Show clue", "Hinweis anzeigen")}
          </button>
        )}
        <span className="text-caption text-ash">
          {tt("Checks requested:", "Angeforderte Prüfungen:")} <span className="tnum font-semibold text-ink">{l2.checks}</span>
        </span>
      </div>
      {l2.lossClue && (
        <p role="status" className="fade-in rounded-md border border-gold bg-accentSoft px-3 py-2 text-caption text-ink">
          <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
          {tt(
            "In the calculator's working, for each combination: is the cost line larger than the extra gross profit line? That is the whole test, applied to all six cells alike.",
            "In der Rechnung des Rechners, für jede Kombination: Ist die Kostenzeile größer als die Zeile des zusätzlichen Rohertrags? Das ist der ganze Test, auf alle sechs Zellen gleich angewandt.",
          )}
        </p>
      )}
      <p className="text-micro normal-case tracking-normal text-ash">
        {tt(
          "A check counts how many of the six cells are marked correctly. It never says which, because each cell is a yes or no.",
          "Eine Prüfung zählt, wie viele der sechs Zellen richtig markiert sind. Sie sagt nie welche, denn jede Zelle ist ein Ja oder Nein.",
        )}
      </p>
      {res && lossHolds(l2).answered && (
        <p role="status" className="text-caption text-ink">
          {tt(`${res.holds} of ${CELL_KEYS.length} cells hold.`, `${res.holds} von ${CELL_KEYS.length} Zellen stimmen.`)}
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
      <p className="smallcaps">{tt("Your leak diagnosis · for context", "Ihre Diagnose des Lecks · zum Kontext")}</p>
      {weakest || sentence ? (
        <div className="mt-1 space-y-1 text-ink">
          <p>
            {tt("Largest negative gap you named:", "Größte negative Abweichung, die Sie benannt haben:")} <strong>{weakestLabel(weakest) || "—"}</strong>
          </p>
          <blockquote className="border-l-4 border-gold bg-accentSoft px-3 py-1.5">{sentence || tt("You have not written the cost sentence yet.", "Sie haben den Kostensatz noch nicht geschrieben.")}</blockquote>
        </div>
      ) : (
        <p className="mt-1 text-ash">
          {tt(
            "You have not answered the diagnosis yet (Blocks 1.3 and 1.4). Nothing here depends on it.",
            "Sie haben die Diagnose noch nicht beantwortet (Blöcke 1.3 und 1.4). Nichts hier hängt davon ab.",
          )}
        </p>
      )}
      <button type="button" onClick={() => jump(IDS.sentence, "/route-1/")} className="btn-ghost btn-sm mt-2">
        {sentence ? tt("Open it (Block 1.4)", "Öffnen (Block 1.4)") : tt("Go to Block 1.4", "Zu Block 1.4")}
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
              label={tt(`Which option do you recommend for ${SEGMENTS[s].name}?`, `Welche Option empfehlen Sie für ${SEGMENTS[s].name}?`)}
              help={tt("Pick one. A recommendation is defended by a figure, in the next field.", "Wählen Sie eine. Eine Empfehlung wird im nächsten Feld mit einer Zahl begründet.")}
            >
              <OptionPicker label={tt(`Option for ${SEGMENTS[s].name}`, `Option für ${SEGMENTS[s].name}`)} value={l2.rec[s]} onPick={(o) => setRec(s, o)} name={s} />
            </Field>
            <Field
              id={IDS.just(s)}
              htmlFor={`just-input-${s}`}
              label={tt("Why, in one or two sentences?", "Warum, in ein oder zwei Sätzen?")}
              help={tt(
                "Cite at least one € figure from your grid. A recommendation with no number scores 0.",
                "Nennen Sie mindestens eine €-Zahl aus Ihrem Raster. Eine Empfehlung ohne Zahl erhält 0 Punkte.",
              )}
              meta={<span className="text-micro text-ash">{cited(n)}</span>}
            >
              <textarea
                id={`just-input-${s}`}
                rows={3}
                className="field"
                value={l2.just[s]}
                onChange={(e) => setJust(s, e.target.value)}
                placeholder={tt("e.g. Option … nets … in this segment, against … for …", "z. B. Option … bringt in diesem Segment netto …, gegenüber … bei …")}
              />
              <WritingHelp
                id={`frame-rec-${s}`}
                steps={tt<string[]>(
                  [
                    "Name the option you recommend for this segment.",
                    "Give its net impact from your grid, and set it beside the figure of one other option in the same segment.",
                    "Say what the figure rests on (the uplift you were given) and what would make you choose differently. A recommendation with no figure scores 0.",
                  ],
                  [
                    "Nennen Sie die Option, die Sie für dieses Segment empfehlen.",
                    "Geben Sie ihren Nettoeffekt aus Ihrem Raster an und stellen Sie ihn neben die Zahl einer anderen Option im selben Segment.",
                    "Sagen Sie, worauf die Zahl beruht (die Ihnen vorgegebene Steigerung) und was Sie anders entscheiden ließe. Eine Empfehlung ohne Zahl erhält 0 Punkte.",
                  ],
                )}
                refs={OPT_IDS.map((o) => ({
                  label: `${OPTIONS[o].short} · ${SEGMENTS[s].short}`,
                  value: (l2.grid[cellKey(o, s)] ?? "").trim() || tt("not entered yet in Block 2.1", "in Block 2.1 noch nicht eingetragen"),
                  target: IDS.grid(cellKey(o, s)),
                }))}
                refsTitle={tt("Your grid, this segment", "Ihr Raster, dieses Segment")}
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
        {tt(
          <>
            DigitalIT Solutions can run <strong>only one</strong> option across <strong>both</strong> segments. Which single option gives the largest total net impact, and what does choosing it force you to give up?
          </>,
          <>
            DigitalIT Solutions kann <strong>nur eine</strong> Option über <strong>beide</strong> Segmente hinweg betreiben. Welche einzelne Option bringt den größten Gesamt-Nettoeffekt, und worauf müssen Sie dafür verzichten?
          </>,
        )}
      </p>
      <Field
        id={IDS.uniform}
        label={tt("The single option for both segments", "Die eine Option für beide Segmente")}
        help={tt("Pick one. Work from your grid: add each option's two segment results.", "Wählen Sie eine. Gehen Sie von Ihrem Raster aus: Addieren Sie die beiden Segmentergebnisse jeder Option.")}
        flagged={l2.uniformFlagged}
        clue={tt(
          "For each option, add its project result and its retainer result. Which of the three totals is the largest? Note that this is not the same as picking each segment's best cell.",
          "Addieren Sie für jede Option ihr Projekt- und ihr Retainer-Ergebnis. Welche der drei Summen ist die größte? Beachten Sie: Das ist nicht dasselbe, wie die beste Zelle jedes Segments zu wählen.",
        )}
        clueShown={l2.uniformClue}
        onShowClue={showClue}
      >
        <OptionPicker label={tt("Single option for both segments", "Einzelne Option für beide Segmente")} value={l2.uniform} onPick={setUniform} name="uniform" />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => check(l2.uniform !== null && l2.uniform !== "C")} className="btn-primary btn-sm">
          {tt("Check my choice", "Meine Wahl prüfen")}
        </button>
        <span className="text-caption text-ash">
          {tt("Checks requested:", "Angeforderte Prüfungen:")} <span className="tnum font-semibold text-ink">{l2.checks}</span>
        </span>
      </div>
      <Field
        id={IDS.tradeoff}
        htmlFor="tradeoff"
        label={tt("What does that choice give up?", "Worauf verzichtet diese Wahl?")}
        help={tt(
          "Two or three sentences. Name what you give up in each segment, in euros from your grid, compared with that segment's own best option. A letter alone is not an answer.",
          "Zwei oder drei Sätze. Nennen Sie, worauf Sie in jedem Segment verzichten, in Euro aus Ihrem Raster, verglichen mit der besten Option dieses Segments. Ein Buchstabe allein ist keine Antwort.",
        )}
        meta={<span className="text-micro text-ash">{cited(n)}</span>}
      >
        <textarea
          id="tradeoff"
          rows={4}
          className="field"
          value={l2.tradeoff}
          onChange={(e) => setTradeoff(e.target.value)}
          placeholder={tt("e.g. Choosing … nets … in total. In the … segment I give up … compared with …, and in the … segment …", "z. B. Die Wahl von … bringt insgesamt netto …. Im Segment … verzichte ich auf … gegenüber …, und im Segment …")}
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
  const m = useMateri();
  const grid = useStore((s) => s.l2.grid);
  return (
    <div className="flex flex-wrap items-start gap-2">
      <WritingHelp
        id="frame-tradeoff"
        steps={tt<string[]>(
          [
            "Name the single option and its total across both segments.",
            "For each segment, name that segment's own best option and say how many euros you give up by not running it there.",
            "State both amounts in euros from your grid, not only the letter of the option.",
          ],
          [
            "Nennen Sie die einzelne Option und ihre Summe über beide Segmente.",
            "Nennen Sie für jedes Segment dessen eigene beste Option und sagen Sie, wie viele Euro Sie verschenken, indem Sie sie dort nicht einsetzen.",
            "Geben Sie beide Beträge in Euro aus Ihrem Raster an, nicht nur den Buchstaben der Option.",
          ],
        )}
      />
      <RevealHint id="formula-uniform" label={tt("Show the formula", "Formel anzeigen")} title={tt(`Formula · from ${m.name("B2")}`, `Formel · aus ${m.name("B2")}`)}>
        <p className="text-caption text-ink">
          {tt(
            <>
              Total of an option = its result in project clients + its result in retainer clients. The single best option is the largest total. What it gives up = for each segment, that segment&apos;s own best result minus the chosen option&apos;s
              result there; then add the two. Taught in {m.name("B2")}.
            </>,
            <>
              Summe einer Option = ihr Ergebnis bei Projektkunden + ihr Ergebnis bei Retainer-Kunden. Die einzelne beste Option ist die größte Summe. Worauf sie verzichtet = für jedes Segment das beste Ergebnis dieses Segments minus das Ergebnis der gewählten Option dort;
              dann addieren Sie die beiden. Gelehrt in {m.name("B2")}.
            </>,
          )}
        </p>
      </RevealHint>
      <RevealHint
        id="src-uniform"
        label={tt("Show where the numbers are", "Zeigen, wo die Zahlen stehen")}
        title={tt("Numbers you need · your own grid from Block 2.1", "Zahlen, die Sie brauchen · Ihr eigenes Raster aus Block 2.1")}
      >
        <ul className="grid gap-1 sm:grid-cols-2">
          {CELL_KEYS.map((k) => (
            <li key={k}>
              <button
                type="button"
                onClick={() => scrollToAndFlash(IDS.grid(k), "ref")}
                className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left text-caption hover:bg-accentSoft"
              >
                <span className="text-ink">{cellLabel(k)}:</span>
                <span className="tnum font-semibold text-ink">{(grid[k] ?? "").trim() || tt("not entered yet", "noch nicht eingetragen")}</span>
              </button>
            </li>
          ))}
        </ul>
      </RevealHint>
    </div>
  );
}
