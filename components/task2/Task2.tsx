"use client";

import { AnswerBlock } from "@/components/ui/AnswerBlock";
import type { Tier } from "@/components/ui/AnswerBlock";
import { Gloss } from "@/lib/glossify";
import { ExportBar } from "@/components/ui/ExportBar";
import { LeverCalculator } from "@/components/ui/LeverCalculator";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MissingList } from "@/components/ui/MissingList";
import { GridBlock, LossBlock, RecommendBlock, UniformBlock } from "@/components/task2/Blocks";
import { calculationBody } from "@/lib/exportDoc";
import { IDS, l2Missing } from "@/lib/missing";
import { exportName } from "@/lib/slug";
import { COURSE } from "@/lib/routes";
import { usePersisted } from "@/store/usePersisted";
import { tt } from "@/lib/lang";
import { useCapstone } from "@/lib/materiAlias";

type T2 = "2.1" | "2.2" | "2.3" | "2.4";

/** Part 2 · Calculate: the read-only calculator and the four answer blocks of Task 2. */
export function Task2Workspace({ tiers, where = "Route 2 → Task 2" }: { tiers?: Partial<Record<T2, Tier>>; where?: string }) {
  // The Route 1 Case File stops at 2.3: the segment-by-segment choice. Block 2.4 (one option for both) belongs to Route 2.
  const capstone = useCapstone();
  return (
    <>
      <section id="lever-calculator" className="card space-y-3 p-4 md:p-5" aria-labelledby="calc-h">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="calc-h">{tt("Retention lever calculator", "Rechner für Bindungshebel")}</h3>
          <span className="text-caption text-ash">{tt("The given data is read-only", "Die vorgegebenen Daten sind nur lesbar")}</span>
        </div>
        <LeverCalculator />
      </section>

      <AnswerBlock
        tier={tiers?.["2.1"]}
        id="block-2-1"
        title={tt("Block 2.1 · Net impact of every option in every segment", "Block 2.1 · Nettoeffekt jeder Option in jedem Segment")}
        kind="OBJECTIVE"
        findIt={tt(
          `${where} → “Retention lever calculator” → select an option, then a segment. Read the last line of its working. Answer in the grid below.`,
          `${where} → „Rechner für Bindungshebel“ → wählen Sie eine Option, dann ein Segment. Lesen Sie die letzte Zeile der Rechnung. Antworten Sie im Raster unten.`,
        )}
      >
        <MaterialRefs refs={["B3", "B4"]} />
        <GridBlock />
      </AnswerBlock>

      <AnswerBlock
        tier={tiers?.["2.2"]}
        id="block-2-2"
        title={tt("Block 2.2 · Which cells are a net loss?", "Block 2.2 · Welche Zellen sind ein Nettoverlust?")}
        kind="OBJECTIVE"
        findIt={tt(
          `${where} → “Retention lever calculator” → the working of each combination: the line that reads “Net loss”. Answer below.`,
          `${where} → „Rechner für Bindungshebel“ → die Rechnung jeder Kombination: die Zeile mit „Nettoverlust“. Antworten Sie unten.`,
        )}
      >
        <MaterialRefs refs={["B3"]} />
        <LossBlock />
      </AnswerBlock>

      <AnswerBlock
        tier={tiers?.["2.3"]}
        id="block-2-3"
        title={tt("Block 2.3 · Recommend one option per segment", "Block 2.3 · Empfehlen Sie eine Option je Segment")}
        kind="JUDGED"
        findIt={tt(
          `${where} → your grid in Block 2.1, and “Retention lever calculator” for the working behind each figure. Answer below.`,
          `${where} → Ihr Raster in Block 2.1 und „Rechner für Bindungshebel“ für die Rechnung hinter jeder Zahl. Antworten Sie unten.`,
        )}
      >
        <MaterialRefs refs={["B1", "B2", "B4"]} />
        <RecommendBlock />
      </AnswerBlock>

      {!capstone && (
        <AnswerBlock
          tier={tiers?.["2.4"]}
          id="block-2-4"
          title={tt("Block 2.4 · One option for both segments", "Block 2.4 · Eine Option für beide Segmente")}
          kind="OBJECTIVE + JUDGED"
          findIt={tt(
            `${where} → your grid in Block 2.1: add the two segment results of each option. Answer below.`,
            `${where} → Ihr Raster in Block 2.1: Addieren Sie die beiden Segmentergebnisse jeder Option. Antworten Sie unten.`,
          )}
        >
          <MaterialRefs refs={["B2", "B4"]} />
          <UniformBlock />
        </AnswerBlock>
      )}
    </>
  );
}

/** Task 2 · Level 2 · the Calculation Note. Objective grid and flags, a judged recommendation, one trap question. */
export function Task2() {
  const snapshot = usePersisted();
  const missing = l2Missing(snapshot);
  const fname = exportName(snapshot.participant.name, "l2-calculation");

  return (
    <section id="task-2" className="space-y-5">
      <header className="space-y-1">
        <p className="smallcaps text-accent">Task 2 · Level 2 · 15 min</p>
        <h2 className="text-h1">Task 2 · Calculation Note · {COURSE.company}</h2>
        <p className="text-body italic text-ash">One task. Level 2 puts a euro figure on three retention levers and asks you to choose, and to defend the choice.</p>
      </header>

      <div className="card space-y-2 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3>The case</h3>
          <span className="pill border-line bg-mist text-ash">Case assumption</span>
        </div>
        <p className="text-body"><Gloss>
          Task 1 showed where <strong>{COURSE.company}</strong> loses prospects. The managing director now asks a second question: how to keep the clients it already has. The client base
          has <strong>38 clients</strong> in two segments, <strong>14 project clients</strong> (large one-off implementations) and <strong>24 retainer clients</strong> (ongoing, smaller
          support contracts). Three options are on the table: intensified personal account management (A), an 8% discount on the repeat order (B) and a value-added service (C). Each option
          is judged by what it adds in gross profit, less what it costs.
        </Gloss></p>
      </div>

      <div className="card space-y-2 border-accent/30 bg-accentSoft p-4 md:p-5">
        <h3>How to use this task</h3>
        <ul className="list-disc space-y-1 pl-5 text-caption text-ink">
          <li>
            Each answer block starts with a <strong>FIND IT</strong> line. Analyse in the app, then write in the answer area below it.
          </li>
          <li>
            <span className="pill-obj mr-1">OBJECTIVE</span> the calculator settles it. <span className="pill-jdg mx-1">JUDGED</span> your reasoning, defended with a euro figure.
          </li>
          <li>
            Time: about <strong>5 min</strong> for the grid (2.1) and the loss marks (2.2), <strong>6 min</strong> for the recommendations (2.3) and <strong>4 min</strong> for the single-option question (2.4).
          </li>
        </ul>
        <MaterialRefs refs={["B3", "B1"]} lead="Read first" />
      </div>

      <Task2Workspace />

      <div className="space-y-3">
        <MissingList items={missing} lead="Your calculation note is still missing:" />
        <ExportBar
          id={IDS.exportL2}
          previewTitle="Preview of your note"
          exportLabel="Export calculation note"
          docTitle={`Calculation Note — ${COURSE.company}`}
          filename={fname}
          missing={missing}
          buildBody={() => calculationBody(snapshot)}
        />
      </div>
    </section>
  );
}
