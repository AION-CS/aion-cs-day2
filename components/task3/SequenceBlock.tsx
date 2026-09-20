"use client";

import clsx from "clsx";
import { ITEMS, KPIS, WINDOW_MONTHS } from "@/data/program";
import { IDS } from "@/lib/missing";
import { fundedItems, seqHolds, sequenceTruth } from "@/lib/program";
import { sequenceKey } from "@/lib/answerKey";
import { useStore } from "@/store/useStore";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { Field } from "@/components/ui/Field";
import { useL3Lock } from "@/components/task3/AllocationGrid";

const MONTHS = Array.from({ length: WINDOW_MONTHS }, (_, i) => i + 1);

/**
 * Block 3.2 — the rollout order and the KPI-blind-spot warning. Each funded item gets a start month (a discrete
 * stop). The rule is enforced live: a lever that launches before the dashboard, with it, or without it prints
 * a specific warning. The learner then records whether it appeared and what goes unmeasured; a set-level
 * check counts how many of those answers hold and never says which.
 */
export function SequenceBlock() {
  const r = useStore((s) => s.route3);
  const setStart = useStore((s) => s.setStart);
  const setWarned = useStore((s) => s.setWarned);
  const setKpi = useStore((s) => s.setMissingKpi);
  const check = useStore((s) => s.checkSeq);
  const showClue = useStore((s) => s.showSeqClue);
  const { locked, go } = useL3Lock();

  const funded = fundedItems(r.alloc);
  const t = sequenceTruth(r.alloc, r.start);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <p className="text-caption text-ash">Pick the month (1 to {WINDOW_MONTHS}) in which each funded item starts. An item you did not fund has no month.</p>
        {funded.length === 0 && <p className="rounded-md bg-mist px-3 py-2 text-caption text-ash">Fund at least one line item in Block 3.1 first.</p>}
        {funded.map((id) => (
          <div key={id} id={IDS.start(id)} className="space-y-1 rounded-lg border border-line bg-paper p-2.5">
            <p id={`start-label-${id}`} className="text-caption font-semibold">
              {ITEMS[id].n} · {ITEMS[id].short}
            </p>
            <div role="radiogroup" aria-labelledby={`start-label-${id}`} className="flex flex-wrap gap-2">
              {MONTHS.map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={r.start[id] === m}
                  aria-disabled={locked}
                  onClick={() => (locked ? go() : setStart(id, m))}
                  className={clsx(
                    "btn btn-sm min-h-[40px] min-w-[5.5rem] border",
                    locked ? "border-dashed border-ash/60 bg-mist/60 text-ash" : r.start[id] === m ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
                  )}
                >
                  Month {m}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div aria-live="polite">
        {t.text ? (
          <div role="alert" className="rounded-lg border border-gold bg-accentSoft p-3 text-caption text-ink">
            <p className="smallcaps text-accent">Sequencing warning</p>
            <p className="mt-1 font-semibold">{t.text}</p>
          </div>
        ) : t.pending ? (
          <p className="rounded-md bg-mist px-3 py-2 text-caption text-ash">Set the start month of both the lever and the dashboard to see whether the order raises a warning.</p>
        ) : r.alloc.leverOpt !== null && funded.every((i) => r.start[i] !== null) ? (
          <p className="rounded-md bg-mist px-3 py-2 text-caption text-ash">No sequencing warning for this order.</p>
        ) : null}
      </div>

      <div id={IDS.seqAnswers} className="space-y-3 rounded-lg border border-line p-3">
        <Field
          id="seq-warned"
          label="Did the KPI-blind-spot warning appear for your sequence?"
          help="Answer for the order you set above. If you changed the order after reading the warning, answer for the final one."
        >
          <div role="radiogroup" aria-label="Warning appeared" className="flex flex-wrap gap-2">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                role="radio"
                aria-checked={r.warned === v}
                onClick={() => setWarned(v)}
                className={clsx("btn btn-sm min-h-[40px] border", r.warned === v ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}
              >
                {v ? "Yes, it appeared" : "No, it did not appear"}
              </button>
            ))}
          </div>
        </Field>
        {r.warned === true && (
          <Field id="seq-kpi" label="Which KPI loses its baseline for the lever’s early months?" help="Pick the one KPI the lever acts on directly; the other two are not the lever’s target.">
            <div role="radiogroup" aria-label="KPI that loses its baseline" className="grid gap-2 sm:grid-cols-3">
              {KPIS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  role="radio"
                  aria-checked={r.missingKpi === k.id}
                  onClick={() => setKpi(k.id)}
                  className={clsx("rounded-lg border px-3 py-2 text-left text-caption font-semibold", r.missingKpi === k.id ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </Field>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => check(seqHolds(r))} className="btn-primary btn-sm">
            Check my answers
          </button>
          {!r.seqClue && (
            <button type="button" onClick={showClue} className="btn-ghost btn-sm border-gold">
              Show clue
            </button>
          )}
          <span className="text-caption text-ash">
            Checks requested: <span className="tnum font-semibold text-ink">{r.checks}</span>
          </span>
        </div>
        {r.seqResult && (
          <p role="status" className="text-caption text-ink">
            {r.seqResult.holds} of 2 answers hold.
          </p>
        )}
        {r.seqClue && (
          <p role="status" className="fade-in rounded-md border border-gold bg-accentSoft px-3 py-2 text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">Clue</span>
            Compare the start month of the lever with the start month of the dashboard: which is earlier, and when does the dashboard’s data begin? Then ask which KPI the lever’s goal is measured by.
          </p>
        )}
        <p className="text-micro normal-case tracking-normal text-ash">A check counts how many of the two answers hold. It never says which one.</p>
      </div>
      <AnswerKey block={sequenceKey(r)} />
    </div>
  );
}
