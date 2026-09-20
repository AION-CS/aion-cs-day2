"use client";

import { AnswerBlock } from "@/components/ui/AnswerBlock";
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

/** Task 2 · Level 2 · the Calculation Note. Objective grid and flags, a judged recommendation, one trap question. */
export function Task2() {
  const snapshot = usePersisted();
  const missing = l2Missing(snapshot);
  const fname = exportName(snapshot.participant.no, snapshot.participant.name, "l2-calculation");

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
        <p className="text-body">
          Task 1 showed where <strong>{COURSE.company}</strong> loses prospects. The managing director now asks a second question: how to keep the clients it already has. The client base
          has <strong>38 clients</strong> in two segments, <strong>14 project clients</strong> (large one-off implementations) and <strong>24 retainer clients</strong> (ongoing, smaller
          support contracts). Three options are on the table: intensified personal account management (A), an 8% discount on the repeat order (B) and a value-added service (C). Each option
          is judged by what it adds in gross profit, less what it costs.
        </p>
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

      <section id="lever-calculator" className="card space-y-3 p-4 md:p-5" aria-labelledby="calc-h">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="calc-h">Retention lever calculator</h3>
          <span className="text-caption text-ash">The given data is read-only</span>
        </div>
        <LeverCalculator />
      </section>

      <AnswerBlock
        id="block-2-1"
        title="Block 2.1 · Net impact of every option in every segment"
        kind="OBJECTIVE"
        findIt="Route 2 → Task 2 → “Retention lever calculator” → select an option, then a segment. Read the last line of its working. Answer in the grid below."
      >
        <MaterialRefs refs={["B3", "B4"]} />
        <GridBlock />
      </AnswerBlock>

      <AnswerBlock
        id="block-2-2"
        title="Block 2.2 · Which cells are a net loss?"
        kind="OBJECTIVE"
        findIt="Route 2 → Task 2 → “Retention lever calculator” → the working of each combination: the line that reads “Net loss”. Answer below."
      >
        <MaterialRefs refs={["B3"]} />
        <LossBlock />
      </AnswerBlock>

      <AnswerBlock
        id="block-2-3"
        title="Block 2.3 · Recommend one option per segment"
        kind="JUDGED"
        findIt="Route 2 → Task 2 → your grid in Block 2.1, and “Retention lever calculator” for the working behind each figure. Answer below."
      >
        <MaterialRefs refs={["B1", "B2", "B4"]} />
        <RecommendBlock />
      </AnswerBlock>

      <AnswerBlock
        id="block-2-4"
        title="Block 2.4 · One option for both segments"
        kind="OBJECTIVE + JUDGED"
        findIt="Route 2 → Task 2 → your grid in Block 2.1: add the two segment results of each option. Answer below."
      >
        <MaterialRefs refs={["B2", "B4"]} />
        <UniformBlock />
      </AnswerBlock>

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
