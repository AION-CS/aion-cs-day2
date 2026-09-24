"use client";

import clsx from "clsx";
import { CONTRACT_VALUE } from "@/data/funnel";
import { BUDGET, FIXED_COST, SHOW_UP } from "@/data/program";
import { OPTIONS, fmtEuroPlain } from "@/data/segments";
import { Gloss } from "@/lib/glossify";
import { COURSE } from "@/lib/routes";
import { scrollToAndFlash } from "@/lib/flash";
import { caseFileBody } from "@/lib/exportDoc";
import { IDS, caseMissing } from "@/lib/missing";
import { stageProgress } from "@/lib/progress";
import { exportName } from "@/lib/slug";
import { usePersisted } from "@/store/usePersisted";
import { useHydrated, useStore } from "@/store/useStore";
import type { Tier } from "@/components/ui/AnswerBlock";
import { ExportBar } from "@/components/ui/ExportBar";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MissingList } from "@/components/ui/MissingList";
import { undoRedoKeyHandler } from "@/components/ui/UndoRedoControls";
import { CapstoneRefs } from "@/lib/materiAlias";
import { OptionalRoutesNotice } from "@/components/chrome/OptionalRoutes";
import { CarriedForward } from "@/components/capstone/CarriedForward";
import { Task1Blocks, Task1Instrument } from "@/components/task1/Task1";
import { Task2Workspace } from "@/components/task2/Task2";
import { Task3Workspace } from "@/components/task3/Task3";

const core = (minutes: number): Tier => ({ level: "core", minutes });
const optional = (minutes: number): Tier => ({ level: "optional", minutes });

/** Core and Optional blocks of the Friday Case File (CLAUDE.md #29). Minutes are a guide; they add up to the stage minutes. */
const T1 = { "1.1": optional(3), "1.2": optional(4), "1.3": core(2), "1.4": core(6) } as const;
const T2 = { "2.1": core(8), "2.2": optional(3), "2.3": core(5), "2.4": core(4) } as const;
const T3 = { "3.1": core(5), "3.2": core(4), "3.3": core(4), "3.4": core(8), "3.5": core(4) } as const;
const sum = (t: Record<string, Tier>) => Object.values(t).reduce((s, x) => s + x.minutes, 0);
const coreSum = (t: Record<string, Tier>) => Object.values(t).filter((x) => x.level === "core").reduce((s, x) => s + x.minutes, 0);
const STAGE_MIN = { 1: sum(T1), 2: sum(T2), 3: sum(T3) } as const;
const CORE_MIN = coreSum(T1) + coreSum(T2) + coreSum(T3);

/** Three segments, one per stage, showing how many Core blocks are filled in. A state, never a grade. */
function StageStrip() {
  const hydrated = useHydrated();
  const p = usePersisted();
  const stages = [
    { n: 1 as const, verb: "Diagnose" },
    { n: 2 as const, verb: "Calculate" },
    { n: 3 as const, verb: "Decide" },
  ];
  return (
    <nav aria-label="The three stages of the Case File" className="grid gap-2 sm:grid-cols-3 print:hidden">
      {stages.map((s) => {
        const { done, total } = hydrated ? stageProgress(p, s.n) : { done: 0, total: stageProgress(p, s.n).total };
        const full = done === total;
        return (
          <button
            key={s.n}
            type="button"
            onClick={() => scrollToAndFlash(`stage-${s.n}`, "ref", "start")}
            aria-label={`Stage ${s.n}, ${s.verb}: ${done} of ${total} core blocks filled in${full ? ", done" : ""}`}
            className={clsx(
              "rounded-lg border px-3 py-2 text-left transition-colors hover:border-accent",
              full ? "border-signal/50 bg-signalSoft" : "border-line bg-paper",
            )}
          >
            <span className="smallcaps block">
              Stage {s.n} · {s.verb}
            </span>
            <span className="tnum block text-caption text-ink">
              {done} of {total} core blocks · about {STAGE_MIN[s.n]} min
              {full && <span className="ml-1 font-semibold text-signal">● filled in</span>}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function StageHeader({ n, verb, lead, refs }: { n: 1 | 2 | 3; verb: string; lead: string; refs: Parameters<typeof MaterialRefs>[0]["refs"] }) {
  return (
    <header className="space-y-1">
      <p className="smallcaps text-accent">
        Stage {n} · {verb} · about {STAGE_MIN[n]} min
      </p>
      <h2 className="text-h1">{verb}</h2>
      <p className="max-w-prose text-body text-ash">
        <Gloss>{lead}</Gloss>
      </p>
      <MaterialRefs refs={refs} lead="Read first" />
    </header>
  );
}

/**
 * Route 1 of the Friday day (CLAUDE.md #29): the whole case in one continuous task. One case brief, three stages
 * (Diagnose, Calculate, Decide) whose answer blocks are the ones of Tasks 1 to 3 with a Core or Optional tier, a
 * "Carried forward" panel between the stages, and one export, the Case File. The answers live in the same slices as the
 * optional full Routes 2 and 3, so work done here carries over to them.
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
        <p className="smallcaps text-accent">Route 1 · Levels 1 to 3 · {STAGE_MIN[1] + STAGE_MIN[2] + STAGE_MIN[3]} min</p>
        <h2 className="text-h1">Case File · {COURSE.company}</h2>
        <p className="text-body italic text-ash">One case, three stages. Level 1 finds the leak, Level 2 puts a euro figure on the options, Level 3 decides and names who owns the result.</p>
      </header>

      <div id="case-brief" className="card space-y-2 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3>The case</h3>
          <span className="pill border-line bg-mist text-ash">Case assumption</span>
        </div>
        <p className="text-body">
          <Gloss>
            You are the <strong>Chief Customer Officer / Sales Manager</strong> of <strong>{COURSE.company}</strong>, a mid-size B2B IT services vendor in Germany. It sells project implementations and retainer support contracts. The managing director&apos;s
            brief: <em>many leads, few closings, weak retention.</em> A signed project contract is worth <strong id="t1-contract">€{CONTRACT_VALUE.toLocaleString("en-US")}</strong> on average, and every benchmark reference is an industry reference for a company of
            this kind. The company has <strong>38 clients</strong> in two segments: <strong>14 project clients</strong> (large one-off implementations) and <strong>24 retainer clients</strong> (ongoing, smaller support contracts). Three options
            could keep them: intensified personal account management (A), an 8% discount on the repeat order (B) and a value-added service (C), each judged by what it adds in gross profit less what it costs. The CEO wants a retention system in
            place within <strong>four months</strong> on a budget of <strong>{fmtEuroPlain(BUDGET)}</strong>. No baseline KPI tracking exists yet. Four line items are on the table: the lever you choose, a funnel-leak fix ({fmtEuroPlain(FIXED_COST.fix)}), a KPI dashboard (
            {fmtEuroPlain(FIXED_COST.dash)}) and sales training ({fmtEuroPlain(FIXED_COST.train)}).
          </Gloss>
        </p>
      </div>

      <div id="case-limits" className="card space-y-2 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3>Limits and reference points you can rely on</h3>
          <span className="pill border-line bg-mist text-ash">Case assumption</span>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-caption text-ink">
          <li>
            <strong>Budget and time:</strong> {fmtEuroPlain(BUDGET)} in all, and four months, so a start month is 1 to 4. The four line items cost what the allocation grid prints; a fixed price never changes, only the lever&apos;s option and scope can.
          </li>
          <li>
            <strong>The three options:</strong> A costs {fmtEuroPlain(OPTIONS.A.costPerClient ?? 0)} per client per year and C {fmtEuroPlain(OPTIONS.C.costPerClient ?? 0)}; B costs nothing upfront and is paid from margin on every repeat order. The uplifts are assumptions you are given, in percentage points of the repeat rate, and they are printed in the Stage 2 tables.
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
        </ul>
      </div>

      <div className="card space-y-2 border-accent/30 bg-accentSoft p-4 md:p-5">
        <h3>How to use this task</h3>
        <ul className="list-disc space-y-1 pl-5 text-caption text-ink">
          <li>
            Each block starts with a <strong>FIND IT</strong> line. Analyse in the app, then write in the answer area below it. <span className="pill-obj mx-1">OBJECTIVE</span> the instrument settles it.{" "}
            <span className="pill-jdg mx-1">JUDGED</span> your reasoning, defended with a figure.
          </li>
          <li>
            <span className="pill border-signal/40 bg-signalSoft text-signal">CORE</span> blocks (about {CORE_MIN} min) are enough for a complete Case File.{" "}
            <span className="pill border-dashed border-ash/60 bg-mist text-ash">OPTIONAL</span> blocks are for whoever has time, and are never listed as missing.
          </li>
          <li>
            Each stage builds on the one before it. If you have not done an earlier stage, the panel at the top of the next stage offers a labelled <strong>reference position</strong> to work from. Nothing is locked.
          </li>
          <li>
            Where a block asks you to work something out or to sort, a hidden help waits under it: <strong>Show the test questions</strong>, <strong>Show the formula</strong> and <strong>Show where the numbers are</strong>. Try first; open one when you are stuck.
          </li>
        </ul>
      </div>

      <StageStrip />

      {/* ------------------------------------------------------------------ Stage 1 */}
      <section id="stage-1" className="space-y-5" onKeyDown={undoRedoKeyHandler(undo, redo)}>
        <StageHeader
          n={1}
          verb="Diagnose"
          lead="Where does DigitalIT Solutions lose prospects between the website and the signature, and what does the leak cost? Core: name the stage (1.3) and write the cost (1.4). Optional: sort the touchpoints (1.1) and write down the funnel's figures (1.2). Hand over: the stage and its cost."
          refs={["A1", "A2"]}
        />
        <Task1Instrument />
        <Task1Blocks tiers={T1} where="Route 1 → Stage 1" />
      </section>

      {/* ------------------------------------------------------------------ Stage 2 */}
      <section id="stage-2" className="space-y-5">
        <StageHeader
          n={2}
          verb="Calculate"
          lead="Put a euro figure on the three options in both segments, and choose. Core: the net-impact grid (2.1), one option per segment (2.3) and one option for both (2.4). Optional: mark the net losses (2.2). Hand over: the single option and what it gives up."
          refs={["A3", "A4"]}
        />
        <CarriedForward stage={2} />
        <Task2Workspace tiers={T2} where="Route 1 → Stage 2" />
      </section>

      {/* ------------------------------------------------------------------ Stage 3 */}
      <section id="stage-3" className="space-y-5">
        <StageHeader
          n={3}
          verb="Decide"
          lead={`Spend the ${fmtEuroPlain(BUDGET)} you have, in what order, with who owning what, and say what you left out. Every block is Core. The memo on the right assembles itself from your answers.`}
          refs={["A5", "A6"]}
        />
        <CarriedForward stage={3} />
        <Task3Workspace tiers={T3} where="Route 1 → Stage 3" mobileStrip={false} />
      </section>

      <div className="space-y-3">
        <MissingList items={missing} lead="Your Case File is still missing:" />
        <ExportBar
          id={IDS.exportCase}
          previewTitle="Preview of your Case File"
          exportLabel="Export Case File"
          docTitle={`Case File — ${COURSE.company}`}
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
