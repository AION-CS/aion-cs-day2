"use client";

import { CONTRACT_VALUE } from "@/data/funnel";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { ExportBar } from "@/components/ui/ExportBar";
import { FunnelInstrument } from "@/components/ui/FunnelInstrument";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MissingList } from "@/components/ui/MissingList";
import { undoRedoKeyHandler } from "@/components/ui/UndoRedoControls";
import { SortBoard } from "@/components/task1/SortBoard";
import { FillTable } from "@/components/task1/FillTable";
import { CostSentence, WeakestPick } from "@/components/task1/WeakestBlock";
import { diagnosticBody } from "@/lib/exportDoc";
import { IDS, l1Missing } from "@/lib/missing";
import { exportName } from "@/lib/slug";
import { COURSE } from "@/lib/routes";
import { usePersisted } from "@/store/usePersisted";
import { useStore } from "@/store/useStore";

/** Task 1 · Level 1 · the Diagnostic Note. Objective sort, objective transcription, one objective pick, one judged sentence. */
export function Task1() {
  const snapshot = usePersisted();
  const undo = useStore((s) => s.undoSort);
  const redo = useStore((s) => s.redoSort);
  const missing = l1Missing(snapshot);
  const fname = exportName(snapshot.participant.no, snapshot.participant.name, "l1-diagnostic");

  return (
    <section id="task-1" className="space-y-5" onKeyDown={undoRedoKeyHandler(undo, redo)}>
      <header className="space-y-1">
        <p className="smallcaps text-accent">Task 1 · Level 1 · 15 min</p>
        <h2 className="text-h1">Task 1 · Diagnostic Note · {COURSE.company}</h2>
        <p className="text-body italic text-ash">One task. Level 1 establishes where the prospects go and what the retention figure says.</p>
      </header>

      <div className="card space-y-2 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3>The case</h3>
          <span className="pill border-line bg-mist text-ash">Case assumption</span>
        </div>
        <p className="text-body">
          <strong>{COURSE.company}</strong> is a mid-size B2B IT services vendor in Germany. It sells project implementations and retainer support contracts.
          The managing director&apos;s brief: <em>many leads, few closings, weak retention.</em> The funnel below is a year of the company&apos;s own data. A signed
          project contract is worth <strong>€{CONTRACT_VALUE.toLocaleString("en-US")}</strong> on average, and every benchmark reference is an industry reference
          for a company of this kind.
        </p>
      </div>

      <div className="card space-y-2 border-accent/30 bg-accentSoft p-4 md:p-5">
        <h3>How to use this task</h3>
        <ul className="list-disc space-y-1 pl-5 text-caption text-ink">
          <li>
            Each answer block starts with a <strong>FIND IT</strong> line: the route, the widget as printed on screen and the click. Analyse in the app, then write in the answer area below it.
          </li>
          <li>
            <span className="pill-obj mr-1">OBJECTIVE</span> the diagram settles it. <span className="pill-jdg mx-1">JUDGED</span> your reasoning, in your words.
          </li>
          <li>
            Time: about <strong>3 min</strong> for the sort (1.1), <strong>6 min</strong> for the table (1.2), <strong>2 min</strong> for the pick (1.3) and <strong>4 min</strong> for the sentence (1.4).
          </li>
        </ul>
        <MaterialRefs refs={["A2", "A4"]} lead="Read first" />
      </div>

      <section id="funnel-instrument" className="card space-y-3 p-4 md:p-5" aria-labelledby="funnel-h">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="funnel-h">DigitalIT Solutions · annual funnel</h3>
          <span className="text-caption text-ash">Read-only · every figure printed here is used below</span>
        </div>
        <FunnelInstrument />
      </section>

      <AnswerBlock
        id="block-1-1"
        title="Block 1.1 · Sort the six touchpoints into journey phases"
        kind="OBJECTIVE"
        findIt="Route 1 → Task 1 → “DigitalIT Solutions · annual funnel”. The six stages, top to bottom, are the six touchpoints. Answer in the phase board below."
      >
        <MaterialRefs refs={["A2", "A3"]} />
        <SortBoard />
      </AnswerBlock>

      <AnswerBlock
        id="block-1-2"
        title="Block 1.2 · Write down what the funnel prints"
        kind="OBJECTIVE"
        findIt="Route 1 → Task 1 → “DigitalIT Solutions · annual funnel”. Beside each arrow: the conversion (large), “ref” (the benchmark) and the gap bar with its pp value. The repeat-purchase rate is the bar beneath the funnel. Answer in the table below."
      >
        <MaterialRefs refs={["A4"]} />
        <FillTable />
      </AnswerBlock>

      <AnswerBlock
        id="block-1-3"
        title="Block 1.3 · Name the stage with the largest negative gap"
        kind="OBJECTIVE"
        findIt="Route 1 → Task 1 → “DigitalIT Solutions · annual funnel” → the gap bars beside the arrows. Answer below."
      >
        <MaterialRefs refs={["A4"]} />
        <WeakestPick />
      </AnswerBlock>

      <AnswerBlock
        id="block-1-4"
        title="Block 1.4 · What does the leak cost?"
        kind="JUDGED"
        findIt="Route 1 → Task 1 → “DigitalIT Solutions · annual funnel” → the two counts either side of the arrow you named in Block 1.3, and the counts further down the funnel."
      >
        <MaterialRefs refs={["A4", "A2"]} />
        <CostSentence />
      </AnswerBlock>

      <div className="space-y-3">
        <MissingList items={missing} lead="Your diagnostic note is still missing:" />
        <ExportBar
          id={IDS.exportL1}
          previewTitle="Preview of your note"
          exportLabel="Export diagnostic note"
          docTitle={`Diagnostic Note — ${COURSE.company}`}
          filename={fname}
          missing={missing}
          buildBody={() => diagnosticBody(snapshot)}
        />
      </div>
    </section>
  );
}
