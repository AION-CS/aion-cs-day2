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
import { tt } from "@/lib/lang";

const MONTHS = Array.from({ length: WINDOW_MONTHS }, (_, i) => i + 1);

/** The start-month pickers and the live sequencing warning, shared by Block 3.2 of Route 3 and Block 3.1 of the Case File. */
export function StartMonths() {
  const r = useStore((s) => s.route3);
  const setStart = useStore((s) => s.setStart);
  const { locked, go } = useL3Lock();
  const funded = fundedItems(r.alloc);
  const t = sequenceTruth(r.alloc, r.start);
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <p className="text-caption text-ash">
          {tt(
            `Pick the month (1 to ${WINDOW_MONTHS}) in which each funded item starts. An item you did not fund has no month.`,
            `Wählen Sie den Monat (1 bis ${WINDOW_MONTHS}), in dem jeder finanzierte Posten startet. Ein Posten, den Sie nicht finanziert haben, hat keinen Monat.`,
          )}
        </p>
        {funded.length === 0 && (
          <p className="rounded-md bg-mist px-3 py-2 text-caption text-ash">{tt("Fund at least one line item in Block 3.1 first.", "Finanzieren Sie zuerst mindestens einen Posten in Block 3.1.")}</p>
        )}
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
                  {tt("Month", "Monat")} {m}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div aria-live="polite">
        {t.text ? (
          <div role="alert" className="rounded-lg border border-gold bg-accentSoft p-3 text-caption text-ink">
            <p className="smallcaps text-accent">{tt("Sequencing warning", "Hinweis zur Reihenfolge")}</p>
            <p className="mt-1 font-semibold">{t.text}</p>
          </div>
        ) : t.pending ? (
          <p className="rounded-md bg-mist px-3 py-2 text-caption text-ash">
            {tt(
              "Set the start month of both the lever and the dashboard to see whether the order raises a warning.",
              "Legen Sie den Startmonat sowohl des Hebels als auch des Dashboards fest, um zu sehen, ob die Reihenfolge einen Hinweis auslöst.",
            )}
          </p>
        ) : r.alloc.leverOpt !== null && funded.every((i) => r.start[i] !== null) ? (
          <p className="rounded-md bg-mist px-3 py-2 text-caption text-ash">{tt("No sequencing warning for this order.", "Kein Hinweis zur Reihenfolge für diese Ordnung.")}</p>
        ) : null}
      </div>

    </div>
  );
}

/**
 * Block 3.2 — the rollout order and the KPI-blind-spot warning. Each funded item gets a start month (a discrete
 * stop). The rule is enforced live: a lever that launches before the dashboard, with it, or without it prints
 * a specific warning. The learner then records whether it appeared and what goes unmeasured; a set-level
 * check counts how many of those answers hold and never says which.
 */
export function SequenceBlock() {
  const r = useStore((s) => s.route3);
  const setWarned = useStore((s) => s.setWarned);
  const setKpi = useStore((s) => s.setMissingKpi);
  const check = useStore((s) => s.checkSeq);
  const showClue = useStore((s) => s.showSeqClue);

  return (
    <div className="space-y-4">
      <StartMonths />

      <div id={IDS.seqAnswers} className="space-y-3 rounded-lg border border-line p-3">
        <Field
          id="seq-warned"
          label={tt("Did the KPI-blind-spot warning appear for your sequence?", "Ist für Ihre Reihenfolge der Hinweis auf den KPI-Blindfleck erschienen?")}
          help={tt(
            "Answer for the order you set above. If you changed the order after reading the warning, answer for the final one.",
            "Antworten Sie für die Reihenfolge, die Sie oben festgelegt haben. Haben Sie die Reihenfolge nach dem Lesen des Hinweises geändert, antworten Sie für die endgültige.",
          )}
        >
          <div role="radiogroup" aria-label={tt("Warning appeared", "Hinweis erschienen")} className="flex flex-wrap gap-2">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                role="radio"
                aria-checked={r.warned === v}
                onClick={() => setWarned(v)}
                className={clsx("btn btn-sm min-h-[40px] border", r.warned === v ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}
              >
                {v ? tt("Yes, it appeared", "Ja, er ist erschienen") : tt("No, it did not appear", "Nein, er ist nicht erschienen")}
              </button>
            ))}
          </div>
        </Field>
        {r.warned === true && (
          <Field
            id="seq-kpi"
            label={tt("Which KPI loses its baseline for the lever’s early months?", "Welche KPI verliert für die ersten Monate des Hebels ihren Ausgangswert?")}
            help={tt("Pick the one KPI the lever acts on directly; the other two are not the lever’s target.", "Wählen Sie die eine KPI, auf die der Hebel direkt wirkt; die anderen beiden sind nicht das Ziel des Hebels.")}
          >
            <div role="radiogroup" aria-label={tt("KPI that loses its baseline", "KPI, die ihren Ausgangswert verliert")} className="grid gap-2 sm:grid-cols-3">
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
            {tt("Check my answers", "Meine Antworten prüfen")}
          </button>
          {!r.seqClue && (
            <button type="button" onClick={showClue} className="btn-ghost btn-sm border-gold">
              {tt("Show clue", "Hinweis anzeigen")}
            </button>
          )}
          <span className="text-caption text-ash">
            {tt("Checks requested:", "Angeforderte Prüfungen:")} <span className="tnum font-semibold text-ink">{r.checks}</span>
          </span>
        </div>
        {r.seqResult && (
          <p role="status" className="text-caption text-ink">
            {tt(`${r.seqResult.holds} of 2 answers hold.`, `${r.seqResult.holds} von 2 Antworten stimmen.`)}
          </p>
        )}
        {r.seqClue && (
          <p role="status" className="fade-in rounded-md border border-gold bg-accentSoft px-3 py-2 text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
            {tt(
              "Compare the start month of the lever with the start month of the dashboard: which is earlier, and when does the dashboard’s data begin? Then ask which KPI the lever’s goal is measured by.",
              "Vergleichen Sie den Startmonat des Hebels mit dem Startmonat des Dashboards: Welcher liegt früher, und wann beginnen die Daten des Dashboards? Fragen Sie dann, an welcher KPI das Ziel des Hebels gemessen wird.",
            )}
          </p>
        )}
        <p className="text-micro normal-case tracking-normal text-ash">{tt("A check counts how many of the two answers hold. It never says which one.", "Eine Prüfung zählt, wie viele der beiden Antworten stimmen. Sie sagt nie welche.")}</p>
      </div>
      <AnswerKey block={sequenceKey(r)} />
    </div>
  );
}
