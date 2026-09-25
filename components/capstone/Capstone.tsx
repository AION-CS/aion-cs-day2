"use client";

import { CONTRACT_VALUE } from "@/data/funnel";
import { BUDGET, FIXED_COST, SHOW_UP } from "@/data/program";
import { OPTIONS, fmtEuroPlain } from "@/data/segments";
import { Gloss } from "@/lib/glossify";
import { num, tt } from "@/lib/lang";
import { COURSE } from "@/lib/routes";
import { caseFileBody } from "@/lib/exportDoc";
import { IDS, caseMissing } from "@/lib/missing";
import { exportName } from "@/lib/slug";
import { usePersisted } from "@/store/usePersisted";
import { useStore } from "@/store/useStore";
import type { Tier } from "@/components/ui/AnswerBlock";
import { ExportBar } from "@/components/ui/ExportBar";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MissingList } from "@/components/ui/MissingList";
import { undoRedoKeyHandler } from "@/components/ui/UndoRedoControls";
import { CapstoneRefs } from "@/lib/materiAlias";
import { OptionalRoutesNotice } from "@/components/chrome/OptionalRoutes";
import { DecisionBlocks } from "@/components/capstone/Decision";
import { Task1Blocks, Task1Instrument } from "@/components/task1/Task1";
import { Task2Workspace } from "@/components/task2/Task2";

const core = (minutes: number): Tier => ({ level: "core", minutes });
const optional = (minutes: number): Tier => ({ level: "optional", minutes });

/** Core and Optional blocks of the Friday Case File (CLAUDE.md #29). Minutes are a guide; they add up to the task minutes. */
const T1 = { "1.1": optional(3), "1.2": optional(4), "1.3": core(2), "1.4": core(6) } as const;
const T2 = { "2.1": core(8), "2.2": optional(3), "2.3": core(5) } as const;
const T3 = { "3.1": core(10), "3.2": core(10) } as const;
const sum = (t: Record<string, Tier>) => Object.values(t).reduce((s, x) => s + x.minutes, 0);
const coreSum = (t: Record<string, Tier>) => Object.values(t).filter((x) => x.level === "core").reduce((s, x) => s + x.minutes, 0);
const TOTAL_MIN = sum(T1) + sum(T2) + sum(T3);
const CORE_MIN = coreSum(T1) + coreSum(T2) + coreSum(T3);

/** A thin divider between the three parts of the one task. No panel, no minutes, no gate: it only says what the next blocks are for. */
function PartLabel({ n, verb, lead, refs }: { n: 1 | 2 | 3; verb: string; lead: string; refs: Parameters<typeof MaterialRefs>[0]["refs"] }) {
  return (
    <div id={`part-${n}`} className="space-y-1 border-t-2 border-ink pt-3">
      <p className="smallcaps text-accent">
        {tt("Part", "Teil")} {n} · {verb}
      </p>
      <p className="max-w-prose text-body text-ash">
        <Gloss>{lead}</Gloss>
      </p>
      <MaterialRefs refs={refs} lead={tt("Read first", "Zuerst lesen")} />
    </div>
  );
}

/**
 * Route 1 of the Friday day (CLAUDE.md #29): the whole case as one task on one page. One case brief, then nine answer blocks
 * (1.1–1.4 diagnose, 2.1–2.3 calculate, 3.1–3.2 decide), each Core or Optional, and one export, the Case File. Nothing in it
 * is locked. The answers live in the same slices as the optional full Routes 2 and 3, so work done here carries over to them.
 */
export function Capstone() {
  const snapshot = usePersisted();
  const undo = useStore((s) => s.undoSort);
  const redo = useStore((s) => s.redoSort);
  const missing = caseMissing(snapshot);
  const fname = exportName(snapshot.participant.name, "case-file");

  return (
    <CapstoneRefs value>
    <section id="task-1" className="space-y-8">
      <header className="space-y-1">
        <p className="smallcaps text-accent">
          {tt("Route 1 · Levels 1 to 3", "Route 1 · Level 1 bis 3")} · {tt("about", "ca.")} {TOTAL_MIN} {tt("min", "Min.")}
        </p>
        <h2 className="text-h1">
          {tt("Case File", "Fallakte")} · {COURSE.company}
        </h2>
        <p className="text-body italic text-ash">
          {tt(
            "One case, one task. Level 1 finds the leak, Level 2 puts a euro figure on the options, Level 3 decides and names who owns the result.",
            "Ein Fall, eine Aufgabe. Level 1 findet das Leck, Level 2 beziffert die Optionen in Euro, Level 3 entscheidet und benennt, wer das Ergebnis verantwortet.",
          )}
        </p>
      </header>

      <div id="case-brief" className="card space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3>{tt("The case", "Der Fall")}</h3>
          <span className="pill border-line bg-mist text-ash">{tt("Case assumption", "Fallannahme")}</span>
        </div>

        <p className="text-body">
          <Gloss>
            {tt(
              <>
                You are the <strong>Chief Customer Officer / Sales Manager</strong> of <strong>{COURSE.company}</strong>, a mid-size B2B IT services vendor in Germany. The managing director&apos;s brief is short: <em>many leads, few closings, weak retention.</em>
              </>,
              <>
                Sie sind <strong>Chief Customer Officer / Vertriebsleiter</strong> von <strong>{COURSE.company}</strong>, einem mittelgroßen B2B-IT-Dienstleister in Deutschland. Der Auftrag der Geschäftsführung ist kurz: <em>viele Leads, wenige Abschlüsse, schwache Kundenbindung.</em>
              </>,
            )}
          </Gloss>
        </p>

        <div className="space-y-2">
          <p className="smallcaps">{tt("The clients", "Die Kunden")}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-canvas/60 p-3 text-caption">
              <p className="font-semibold text-ink">{tt("14 project clients", "14 Projektkunden")}</p>
              <p className="text-ash">
                <Gloss>{tt("Large one-off implementations.", "Große einmalige Implementierungen.")}</Gloss>
              </p>
            </div>
            <div className="rounded-lg border border-line bg-canvas/60 p-3 text-caption">
              <p className="font-semibold text-ink">{tt("24 retainer clients", "24 Retainer-Kunden")}</p>
              <p className="text-ash">
                <Gloss>{tt("Ongoing, smaller support contracts.", "Laufende, kleinere Supportverträge.")}</Gloss>
              </p>
            </div>
          </div>
          <p className="text-caption text-ink">
            <Gloss>
              {tt(
                <>
                  A signed project contract is worth <strong id="t1-contract">€{CONTRACT_VALUE.toLocaleString("en-US")}</strong> on average. Every benchmark reference in this case is an industry reference for a company of this kind.
                </>,
                <>
                  Ein unterzeichneter Projektvertrag ist im Schnitt <strong id="t1-contract">{num(CONTRACT_VALUE)}&nbsp;€</strong> wert. Jeder Benchmark in diesem Fall ist eine Branchenreferenz für ein Unternehmen dieser Art.
                </>,
              )}
            </Gloss>
          </p>
        </div>

        <div className="space-y-2">
          <p className="smallcaps">{tt("Three ways to keep them", "Drei Wege, sie zu halten")}</p>
          <ul className="grid gap-2 md:grid-cols-3">
            {[
              {
                id: "A",
                en: "Intensified personal account management.",
                de: "Intensivierte persönliche Kundenbetreuung.",
              },
              {
                id: "B",
                en: "An 8% discount on the repeat order.",
                de: "Ein Rabatt von 8 % auf den Folgeauftrag.",
              },
              {
                id: "C",
                en: "A value-added service.",
                de: "Eine Zusatzleistung.",
              },
            ].map((o) => (
              <li key={o.id} className="flex gap-2.5 rounded-lg border border-line bg-canvas/60 p-3 text-caption">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-ink text-micro font-bold text-paper">{o.id}</span>
                <span className="text-ink">
                  <Gloss>{tt(o.en, o.de)}</Gloss>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-caption text-ash">
            <Gloss>{tt("Each option is judged by what it adds in gross profit, less what it costs.", "Jede Option wird daran gemessen, was sie an Rohertrag bringt, abzüglich ihrer Kosten.")}</Gloss>
          </p>
        </div>

        <div className="space-y-2">
          <p className="smallcaps">{tt("The decision", "Die Entscheidung")}</p>
          <p className="text-caption text-ink">
            <Gloss>
              {tt(
                <>
                  The CEO wants a retention system in place within <strong>four months</strong> on a budget of <strong>{fmtEuroPlain(BUDGET)}</strong>. No baseline KPI tracking exists yet. Four line items are on the table:
                </>,
                <>
                  Der CEO möchte innerhalb von <strong>vier Monaten</strong> ein Bindungssystem mit einem Budget von <strong>{fmtEuroPlain(BUDGET)}</strong>. Es gibt noch kein KPI-Tracking als Ausgangswert. Vier Posten stehen zur Wahl:
                </>,
              )}
            </Gloss>
          </p>
          <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <li className="rounded-lg border border-line bg-canvas/60 p-3 text-caption">
              <p className="font-semibold text-ink">{tt("The lever you choose", "Der Hebel, den Sie wählen")}</p>
              <p className="text-ash">{tt("Option A, B or C", "Option A, B oder C")}</p>
            </li>
            <li className="rounded-lg border border-line bg-canvas/60 p-3 text-caption">
              <p className="font-semibold text-ink">{tt("Funnel-leak fix", "Behebung des Trichter-Lecks")}</p>
              <p className="tnum text-ash">{fmtEuroPlain(FIXED_COST.fix)}</p>
            </li>
            <li className="rounded-lg border border-line bg-canvas/60 p-3 text-caption">
              <p className="font-semibold text-ink">{tt("KPI dashboard", "KPI-Dashboard")}</p>
              <p className="tnum text-ash">{fmtEuroPlain(FIXED_COST.dash)}</p>
            </li>
            <li className="rounded-lg border border-line bg-canvas/60 p-3 text-caption">
              <p className="font-semibold text-ink">{tt("Sales training", "Vertriebsschulung")}</p>
              <p className="tnum text-ash">{fmtEuroPlain(FIXED_COST.train)}</p>
            </li>
          </ul>
        </div>
      </div>

      <div id="case-limits" className="card space-y-2 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3>{tt("Limits and reference points you can rely on", "Grenzen und Bezugspunkte, auf die Sie sich verlassen können")}</h3>
          <span className="pill border-line bg-mist text-ash">{tt("Case assumption", "Fallannahme")}</span>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-caption text-ink">
          {tt(
            <>
              <li>
                <strong>Budget and time:</strong> {fmtEuroPlain(BUDGET)} in all, and four months, so a start month is 1 to 4. The four line items cost what the allocation grid prints; a fixed price never changes, only the lever&apos;s option and scope can.
              </li>
              <li>
                <strong>The three options:</strong> A costs {fmtEuroPlain(OPTIONS.A.costPerClient ?? 0)} per client per year and C {fmtEuroPlain(OPTIONS.C.costPerClient ?? 0)}; B costs nothing upfront and is paid from margin on every repeat order. The uplifts are assumptions you are given, in percentage points of the repeat rate, and they are printed in the tables of the calculator.
              </li>
              <li>
                <strong>What the funnel fix and the dashboard do:</strong> the fix lifts the show-up rate from {SHOW_UP.before}% to {SHOW_UP.after}%, not to the {SHOW_UP.benchmark}% benchmark, so {SHOW_UP.benchmark - SHOW_UP.after} pp stay open. The dashboard produces the baseline every KPI needs. The training&apos;s effect is not quantified in the case.
              </li>
              <li>
                <strong>Benchmarks and prices are references, not verdicts:</strong> every benchmark is an industry reference for a company of this kind, and a gap tells you where to ask &ldquo;why here?&rdquo;, not the cause.
              </li>
              <li>
                <strong>Where the help is:</strong> every block has a FIND IT line, and a Check that gives a question, not the answer. The blocks that ask you to write have &ldquo;Show how to build the answer&rdquo;, and the calculations have &ldquo;Show the formula&rdquo; and &ldquo;Show where the numbers are&rdquo;.
              </li>
            </>,
            <>
              <li>
                <strong>Budget und Zeit:</strong> insgesamt {fmtEuroPlain(BUDGET)} und vier Monate, ein Startmonat ist also 1 bis 4. Die vier Posten kosten, was das Zuteilungsraster ausweist; ein fester Preis ändert sich nie, nur Option und Umfang des Hebels können sich ändern.
              </li>
              <li>
                <strong>Die drei Optionen:</strong> A kostet {fmtEuroPlain(OPTIONS.A.costPerClient ?? 0)} pro Kunde und Jahr, C {fmtEuroPlain(OPTIONS.C.costPerClient ?? 0)}; B kostet vorab nichts und wird bei jedem Folgeauftrag aus der Marge bezahlt. Die Steigerungen sind Annahmen, die Ihnen vorgegeben sind, in Prozentpunkten der Wiederkaufsrate, und sie stehen in den Tabellen des Rechners.
              </li>
              <li>
                <strong>Was die Trichter-Behebung und das Dashboard tun:</strong> Die Behebung hebt die Erscheinungsquote von {SHOW_UP.before} % auf {SHOW_UP.after} %, nicht auf den Benchmark von {SHOW_UP.benchmark} %, sodass {SHOW_UP.benchmark - SHOW_UP.after} PP offen bleiben. Das Dashboard liefert den Ausgangswert, den jede KPI braucht. Die Wirkung der Schulung ist im Fall nicht beziffert.
              </li>
              <li>
                <strong>Benchmarks und Preise sind Bezugspunkte, keine Urteile:</strong> Jeder Benchmark ist eine Branchenreferenz für ein Unternehmen dieser Art, und eine Abweichung sagt Ihnen, wo Sie fragen sollten „Warum hier?“, nicht die Ursache.
              </li>
              <li>
                <strong>Wo die Hilfe ist:</strong> Jeder Block hat eine Zeile FINDEN und eine Prüfung, die eine Frage gibt, nicht die Antwort. Die Blöcke, in denen Sie schreiben, haben „Aufbau der Antwort anzeigen“, und die Rechnungen haben „Formel anzeigen“ und „Zeigen, wo die Zahlen stehen“.
              </li>
            </>,
          )}
        </ul>
      </div>

      <div className="card space-y-2 border-accent/30 bg-accentSoft p-4 md:p-5">
        <h3>{tt("How to use this task", "So arbeiten Sie mit dieser Aufgabe")}</h3>
        <ul className="list-disc space-y-1 pl-5 text-caption text-ink">
          {tt(
            <>
              <li>
                Each block starts with a <strong>FIND IT</strong> line. Analyse in the app, then write in the answer area below it. <span className="pill-obj mx-1">OBJECTIVE</span> the instrument settles it.{" "}
                <span className="pill-jdg mx-1">JUDGED</span> your reasoning, defended with a figure.
              </li>
              <li>
                <span className="pill border-signal/40 bg-signalSoft text-signal">CORE</span> blocks (about {CORE_MIN} min) are enough for a complete Case File.{" "}
                <span className="pill border-dashed border-ash/60 bg-mist text-ash">OPTIONAL</span> blocks are for whoever has time: they start as one quiet line, open with a click and are never listed as missing.
              </li>
              <li>
                The blocks build on each other from top to bottom (the leak, then the options, then the decision), but nothing is locked: you can start anywhere.
              </li>
              <li>
                Where a block asks you to work something out or to sort, a hidden help waits under it: <strong>Show the test questions</strong>, <strong>Show the formula</strong> and <strong>Show where the numbers are</strong>. Try first; open one when you are stuck.
              </li>
            </>,
            <>
              <li>
                Jeder Block beginnt mit einer Zeile <strong>FINDEN</strong>. Analysieren Sie in der App und schreiben Sie dann in den Antwortbereich darunter. <span className="pill-obj mx-1">OBJEKTIV</span> das Instrument entscheidet.{" "}
                <span className="pill-jdg mx-1">BEURTEILT</span> Ihre Begründung, mit einer Zahl belegt.
              </li>
              <li>
                <span className="pill border-signal/40 bg-signalSoft text-signal">KERN</span>-Blöcke (ca. {CORE_MIN} Min.) genügen für eine vollständige Fallakte.{" "}
                <span className="pill border-dashed border-ash/60 bg-mist text-ash">OPTIONAL</span>-Blöcke sind für alle, die Zeit haben: Sie beginnen als eine unauffällige Zeile, öffnen sich per Klick und werden nie als fehlend aufgeführt.
              </li>
              <li>
                Die Blöcke bauen von oben nach unten aufeinander auf (das Leck, dann die Optionen, dann die Entscheidung), aber nichts ist gesperrt: Sie können überall beginnen.
              </li>
              <li>
                Wo ein Block verlangt, etwas zu berechnen oder zuzuordnen, wartet darunter eine verborgene Hilfe: <strong>Testfragen anzeigen</strong>, <strong>Formel anzeigen</strong> und <strong>Zeigen, wo die Zahlen stehen</strong>. Versuchen Sie es zuerst; öffnen Sie eine, wenn Sie nicht weiterkommen.
              </li>
            </>,
          )}
        </ul>
      </div>

      {/* ------------------------------------------------------------------ one task, three parts */}
      <div className="space-y-5" onKeyDown={undoRedoKeyHandler(undo, redo)}>
        <PartLabel
          n={1}
          verb={tt("Diagnose", "Diagnostizieren")}
          lead={tt(
            "Where does DigitalIT Solutions lose prospects between the website and the signature, and what does the leak cost? Core: name the stage (1.3) and write the cost (1.4). Optional: sort the touchpoints (1.1) and write down the funnel's figures (1.2).",
            "Wo verliert DigitalIT Solutions zwischen Website und Unterschrift Interessenten, und was kostet das Leck? Kern: die Stufe benennen (1.3) und die Kosten aufschreiben (1.4). Optional: die Kontaktpunkte zuordnen (1.1) und die Zahlen des Trichters notieren (1.2).",
          )}
          refs={["A1", "A2"]}
        />
        <Task1Instrument />
        <Task1Blocks tiers={T1} where={tt("Route 1 → Case File", "Route 1 → Fallakte")} />
      </div>

      <div className="space-y-5">
        <PartLabel
          n={2}
          verb={tt("Calculate", "Berechnen")}
          lead={tt(
            "Put a euro figure on the three options in both segments, and choose one per segment. Core: the net-impact grid (2.1) and one option per segment (2.3). Optional: mark the net losses (2.2).",
            "Beziffern Sie die drei Optionen in beiden Segmenten in Euro, und wählen Sie eine je Segment. Kern: das Raster des Nettoeffekts (2.1) und eine Option je Segment (2.3). Optional: die Nettoverluste markieren (2.2).",
          )}
          refs={["A3", "A4"]}
        />
        <Task2Workspace tiers={T2} where={tt("Route 1 → Case File", "Route 1 → Fallakte")} />
      </div>

      <div className="space-y-5">
        <PartLabel
          n={3}
          verb={tt("Decide", "Entscheiden")}
          lead={tt(
            `Spend the ${fmtEuroPlain(BUDGET)} you have and set the start months (3.1), then say what you leave out and who owns each thing you fund (3.2). Both blocks are Core.`,
            `Verteilen Sie die ${fmtEuroPlain(BUDGET)}, die Sie haben, und legen Sie die Startmonate fest (3.1), und sagen Sie dann, was Sie weglassen und wer jeden finanzierten Posten verantwortet (3.2). Beide Blöcke sind Kern.`,
          )}
          refs={["A5", "A6"]}
        />
        <DecisionBlocks tiers={T3} where={tt("Route 1 → Case File", "Route 1 → Fallakte")} />
      </div>

      <div className="space-y-3">
        <MissingList items={missing} lead={tt("Your Case File is still missing:", "In Ihrer Fallakte fehlt noch:")} />
        <ExportBar
          id={IDS.exportCase}
          previewTitle={tt("Preview of your Case File", "Vorschau Ihrer Fallakte")}
          exportLabel={tt("Export Case File", "Fallakte exportieren")}
          docTitle={`${tt("Case File", "Fallakte")} — ${COURSE.company}`}
          filename={fname}
          missing={missing}
          buildBody={() => caseFileBody(snapshot)}
        />
        <OptionalRoutesNotice />
      </div>
    </section>
    </CapstoneRefs>
  );
}
