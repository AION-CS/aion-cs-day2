"use client";

import { BUDGET, FIXED_COST } from "@/data/program";
import { Gloss } from "@/lib/glossify";
import { fmtEuroPlain } from "@/data/segments";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { ExportBar } from "@/components/ui/ExportBar";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MissingList } from "@/components/ui/MissingList";
import { AllocationGrid } from "@/components/task3/AllocationGrid";
import { SequenceBlock } from "@/components/task3/SequenceBlock";
import { CutField, GovernanceRows, PostponedField } from "@/components/task3/MemoFields";
import { MemoPanel } from "@/components/task3/MemoPanel";
import { memoBody } from "@/lib/exportDoc";
import { allocKey, rubricRows } from "@/lib/answerKey";
import { allocGuide } from "@/lib/mentorGuide";
import { AnswerKey } from "@/components/ui/AnswerKey";
import type { Tier } from "@/components/ui/AnswerBlock";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { IDS, l3Missing } from "@/lib/missing";
import { exportName } from "@/lib/slug";
import { COURSE } from "@/lib/routes";
import { useJumpTo } from "@/lib/useJumpTo";
import { usePersisted } from "@/store/usePersisted";
import { useHydrated, useStore } from "@/store/useStore";

type T3 = "3.1" | "3.2" | "3.3" | "3.4" | "3.5";

/** Stage 3 · Decide: the five answer blocks of Task 3 with the memo assembling beside them. */
export function Task3Workspace({ tiers, where = "Route 3 → Task 3", mobileStrip = true }: { tiers?: Partial<Record<T3, Tier>>; where?: string; mobileStrip?: boolean }) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]">
        <div className="min-w-0 space-y-5">
          <DiagnosisNotice />

          <AnswerBlock
            tier={tiers?.["3.1"]}
            id="block-3-1"
            title="Block 3.1 · Allocate the budget"
            kind="OBJECTIVE"
            findIt={`${where} → “Budget allocation grid” below. Each line item shows its cost and effect; the bar at the top is the running total against the €150,000.`}
          >
            <MaterialRefs refs={["C3", "C4"]} />
            <AllocationGrid />
            <AnswerKey block={allocKey()} />
            <MentorGuide guide={allocGuide()} />
          </AnswerBlock>

          <AnswerBlock
            tier={tiers?.["3.2"]}
            id="block-3-2"
            title="Block 3.2 · Set the rollout order"
            kind="OBJECTIVE"
            findIt={`${where} → “Budget allocation grid” → the start month of each funded item, then the sequencing warning that appears under it. Answer below.`}
          >
            <MaterialRefs refs={["C1", "C4"]} />
            <SequenceBlock />
          </AnswerBlock>

          <AnswerBlock
            tier={tiers?.["3.3"]}
            id="block-3-3"
            title="Block 3.3 · What was cut"
            kind="JUDGED"
            findIt={`${where} → your allocation in Block 3.1 and the list of what it leaves open in Block 3.5. Answer below.`}
          >
            <MaterialRefs refs={["C3", "C4"]} />
            <CutField />
          </AnswerBlock>

          <AnswerBlock
            tier={tiers?.["3.4"]}
            id="block-3-4"
            title="Block 3.4 · Governance"
            kind="JUDGED"
            findIt={`${where} → the items you funded in Block 3.1, one row each. Answer below.`}
          >
            <MaterialRefs refs={["C2", "C4"]} />
            <GovernanceRows />
          </AnswerBlock>

          <AnswerBlock
            tier={tiers?.["3.5"]}
            id="block-3-5"
            title="Block 3.5 · The measure you postponed"
            kind="JUDGED"
            findIt={`${where} → “Left open by your allocation”, below. Answer beneath it.`}
          >
            <MaterialRefs refs={["C1", "C4"]} />
            <PostponedField />
          </AnswerBlock>

          <RubricPanel />
        </div>
        <MemoPanel mobileStrip={mobileStrip} />
      </div>
    </>
  );
}

/** Task 3 · Level 3 · the Decision Memo: a constraint check, a sequencing rule and three judged sections, with the memo assembling itself beside the questions. */
export function Task3() {
  const snapshot = usePersisted();
  const missing = l3Missing(snapshot);
  const fname = exportName(snapshot.participant.name, "l3-memo");

  return (
    <section id="task-3" className="space-y-5 pb-16 lg:pb-0">
      <header className="space-y-1">
        <p className="smallcaps text-accent">Task 3 · Level 3 · 15 min</p>
        <h2 className="text-h1">Task 3 · Decision Memo · {COURSE.company}</h2>
        <p className="text-body italic text-ash">One task. Level 3 asks you to decide under a budget that does not cover everything, and to say who owns the result.</p>
      </header>

      <div className="card space-y-2 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3>The case</h3>
          <span className="pill border-line bg-mist text-ash">Case assumption</span>
        </div>
        <p className="text-body"><Gloss>
          You are the <strong>Chief Customer Officer / Sales Manager</strong> of <strong>{COURSE.company}</strong>. The CEO wants a retention system in place within four months and has set a budget of{" "}
          <strong>{fmtEuroPlain(BUDGET)}</strong>. Time pressure is high, and the data is incomplete: <strong>no baseline KPI tracking exists yet</strong>. Four line items are on the table. The lever is the one you chose in
          Route 2 (Option A costs €57,000, Option B nothing upfront, Option C €41,800); the funnel-leak fix costs {fmtEuroPlain(FIXED_COST.fix)}, the KPI dashboard {fmtEuroPlain(FIXED_COST.dash)} and the sales training{" "}
          {fmtEuroPlain(FIXED_COST.train)}. Costs and effects are printed on the grid and do not change.
        </Gloss></p>
      </div>

      <div className="card space-y-2 border-accent/30 bg-accentSoft p-4 md:p-5">
        <h3>How to use this task</h3>
        <ul className="list-disc space-y-1 pl-5 text-caption text-ink">
          <li>
            Answer on the left. The memo on the right assembles itself in memo order (header, then sections 1 to 6) whatever order you answer in. The file you export is exactly that memo.
          </li>
          <li>
            <span className="pill-obj mr-1">OBJECTIVE</span> the grid and the sequencing rule settle it. <span className="pill-jdg mx-1">JUDGED</span> your reasoning, in your words.
          </li>
          <li>
            Time: about <strong>4 min</strong> for the allocation (3.1) and the sequence (3.2), <strong>3 min</strong> for what was cut (3.3), <strong>4 min</strong> for governance (3.4) and <strong>4 min</strong> for the postponed measure (3.5).
          </li>
        </ul>
        <MaterialRefs refs={["C1", "C3", "C4"]} lead="Read first" />
      </div>

      <Task3Workspace />

      <div className="space-y-3">
        <MissingList items={missing} lead="Your decision memo is still missing:" />
        <ExportBar
          id={IDS.exportL3}
          previewTitle="Preview of your memo"
          exportLabel="Export decision memo"
          docTitle={`Decision Memo — ${COURSE.company}`}
          filename={fname}
          missing={missing}
          buildBody={() => memoBody(snapshot)}
          showPreview={false}
        />
      </div>
    </section>
  );
}

/** Memo section 1 quotes Routes 1 and 2. If they are not finished the memo says so plainly and this points there; nothing is blocked. */
function DiagnosisNotice() {
  const hydrated = useHydrated();
  const weakest = useStore((s) => s.l1.weakest);
  const uniform = useStore((s) => s.l2.uniform);
  const jump = useJumpTo();
  if (!hydrated || (weakest && uniform)) return null;
  return (
    <aside role="note" className="rounded-lg border border-line bg-mist/60 p-3 text-caption text-ink">
      <p className="smallcaps">Section 1 of the memo quotes your earlier answers</p>
      <p className="mt-1">
        {!weakest && "You have not named the weakest funnel stage (Block 1.3). "}
        {!uniform && "You have not chosen one option for both segments (Block 2.4). "}
        Finish them first and the diagnosis fills in by itself. Nothing on this page is blocked.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {!weakest && (
          <button type="button" onClick={() => jump(IDS.weakest, "/route-1/")} className="btn-ghost btn-sm">
            Go to Block 1.3
          </button>
        )}
        {!uniform && (
          <button type="button" onClick={() => jump(IDS.uniform, "/route-2/")} className="btn-ghost btn-sm">
            Go to Block 2.4
          </button>
        )}
      </div>
    </aside>
  );
}

/** Mentor-only rubric evidence: the objective items computed from the learner's own state, the judged items to read. */
function RubricPanel() {
  const unlocked = useStore((s) => s.mentorUnlocked);
  const r = useStore((s) => s.route3);
  if (!unlocked) return null;
  return (
    <aside aria-label="Mentor rubric" className="fade-in rounded-lg border border-rust/50 bg-rustSoft p-3.5 text-caption text-ink print:hidden">
      <p className="smallcaps text-rust">Mentor · rubric evidence · Task 3</p>
      <ul className="mt-2 space-y-1.5">
        {rubricRows(r).map((row) => (
          <li key={row.item} className="flex gap-2">
            <span className="w-24 shrink-0 font-semibold text-rust">{row.status.toUpperCase()}</span>
            <span>
              <span className="font-semibold">{row.item}.</span> {row.note}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 border-t border-rust/30 pt-2">
        <span className="font-semibold">Teaching note: </span>
        Option B costs €0 upfront, so a lever run on B fits inside the budget with €32,000 to spare: there is nothing to cut on cost. Look at what the learner did with that: the discount’s margin cost is paid on every repeat order outside this budget, and Route 2 showed B nets the least when it is run for both segments.
      </p>
    </aside>
  );
}
