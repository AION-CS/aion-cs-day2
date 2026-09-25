"use client";

import clsx from "clsx";
import { CADENCES, FIXED_COST, GOV_TESTS, ITEMS, ITEM_KPI, OWNERS, OWNER_PROFILE, PICKUPS, SHOW_UP, cadenceLabel, ownerLabel, pickupLabel } from "@/data/program";
import { REPEAT, STEP_BY_ID } from "@/data/funnel";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { fmtEuroPlain } from "@/data/segments";
import { IDS } from "@/lib/missing";
import { fundedItems, hasThreshold, leftOpen } from "@/lib/program";
import { useStore } from "@/store/useStore";
import { Field } from "@/components/ui/Field";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { RevealHint } from "@/components/ui/RevealHint";
import { governanceKey, pickupKey } from "@/lib/answerKey";
import { Gloss } from "@/lib/glossify";
import { useCapstone, useMateri } from "@/lib/materiAlias";
import { cutGuide, govGuide, postponedGuide } from "@/lib/mentorGuide";
import { num, tt } from "@/lib/lang";

/** Block 3.3 — what was cut. Judged: name the item and the consequence in the material's own terms. */
export function CutField() {
  const cut = useStore((s) => s.route3.cut);
  const a = useStore((s) => s.route3.alloc);
  const setCut = useStore((s) => s.setCut);
  const funded = fundedItems(a);
  const nothingCut = funded.length === 4 && a.leverScope === "both";
  const len = cut.trim().length;
  return (
    <Field
      id={IDS.cut}
      htmlFor="cut-input"
      label={
        nothingCut
          ? tt("What did you not buy, and what does that leave exposed?", "Was haben Sie nicht gekauft, und was bleibt dadurch ungeschützt?")
          : tt("What was cut or descoped, and what does that cost?", "Was wurde gestrichen oder eingegrenzt, und was kostet das?")
      }
      help={
        nothingCut
          ? tt(
              "Every line item is funded on cost. Say so, and name what the discount’s ongoing margin cost or the 7 pp the funnel fix leaves open exposes. Two or three sentences.",
              "Jeder Posten ist kostenmäßig finanziert. Sagen Sie das, und nennen Sie, was die laufenden Margenkosten des Rabatts oder die 7 PP, die die Trichter-Behebung offen lässt, ungeschützt lassen. Zwei oder drei Sätze.",
            )
          : tt(
              "Two or three sentences. Name the specific line item or scope you reduced, then the consequence in the terms of the material: which KPI stays unmeasured, which segment’s lever is delayed, which leak stays partly open.",
              "Zwei oder drei Sätze. Nennen Sie den konkreten Posten oder Umfang, den Sie reduziert haben, dann die Folge in den Begriffen des Materials: welche KPI ungemessen bleibt, welcher Segment-Hebel sich verzögert, welches Leck teilweise offen bleibt.",
            )
      }
      meta={<span className="text-micro text-ash">{len} {tt("characters", "Zeichen")}</span>}
    >
      <textarea
        id="cut-input"
        rows={4}
        className="field"
        value={cut}
        onChange={(e) => setCut(e.target.value)}
        placeholder={tt("e.g. I cut item … (€…). As a result … stays …", "z. B. Ich habe Posten … (…€) gestrichen. Dadurch bleibt … …")}
      />
      <WritingHelp
        id="frame-cut"
        steps={
          nothingCut
            ? tt<string[]>(
                [
                  "Say plainly that every line item is funded on cost.",
                  "Name what you did not buy anyway: the margin the discount gives away on every repeat order, or the 7 pp of the show-up gap the fix leaves open.",
                  "Say what that leaves exposed, in the terms of the material.",
                ],
                [
                  "Sagen Sie klar, dass jeder Posten kostenmäßig finanziert ist.",
                  "Nennen Sie, was Sie trotzdem nicht gekauft haben: die Marge, die der Rabatt bei jedem Folgeauftrag verschenkt, oder die 7 PP der Erscheinungslücke, die die Behebung offen lässt.",
                  "Sagen Sie, was das ungeschützt lässt, in den Begriffen des Materials.",
                ],
              )
            : tt<string[]>(
                [
                  "Name the line item or the scope you cut, with its cost.",
                  "Say what the cut leaves open in the terms of the material: which KPI stays unmeasured, which segment's lever is delayed, which leak stays partly open.",
                  "If you cut the weakest-evidenced item first, say why that item and not another.",
                ],
                [
                  "Nennen Sie den Posten oder Umfang, den Sie gestrichen haben, mit seinen Kosten.",
                  "Sagen Sie, was die Kürzung offen lässt, in den Begriffen des Materials: welche KPI ungemessen bleibt, welcher Segment-Hebel sich verzögert, welches Leck teilweise offen bleibt.",
                  "Haben Sie den Posten mit der schwächsten Evidenz zuerst gestrichen, sagen Sie, warum diesen und keinen anderen.",
                ],
              )
        }
        refs={[
          { label: tt("Budget and what you have allocated", "Budget und was Sie zugeteilt haben"), value: tt("see the running total", "siehe die laufende Summe"), target: IDS.allocTotal },
          { label: tt("Funnel-leak fix", "Behebung des Trichter-Lecks"), value: fmtEuroPlain(FIXED_COST.fix), target: IDS.allocGrid },
          { label: tt("KPI dashboard", "KPI-Dashboard"), value: fmtEuroPlain(FIXED_COST.dash), target: IDS.allocGrid },
          { label: tt("Sales training (its effect is not quantified in the case)", "Vertriebsschulung (ihre Wirkung ist im Fall nicht beziffert)"), value: fmtEuroPlain(FIXED_COST.train), target: IDS.allocGrid },
        ]}
        refsTitle={tt("Prices and effects printed in Block 3.1", "In Block 3.1 gedruckte Preise und Wirkungen")}
      />
      <MentorGuide guide={cutGuide()} />
    </Field>
  );
}

/** Block 3.4 — one owner, one review cadence and one escalation trigger per funded line item's KPI. */
export function GovernanceRows() {
  const m = useMateri();
  const r = useStore((s) => s.route3);
  const setGov = useStore((s) => s.setGov);
  const funded = fundedItems(r.alloc);
  if (funded.length === 0) {
    return (
      <p className="rounded-md bg-mist px-3 py-2 text-caption text-ash">
        {tt("Fund at least one line item in Block 3.1. Governance is written for what you fund.", "Finanzieren Sie mindestens einen Posten in Block 3.1. Die Steuerung wird für das geschrieben, was Sie finanzieren.")}
      </p>
    );
  }
  return (
    <div className="space-y-3">
      <p className="text-caption text-ash">
        {tt(
          "One row per funded item, each governed by its own KPI. Every KPI needs an owner, a review cadence and an escalation trigger with a threshold.",
          "Eine Zeile je finanziertem Posten, jeweils gesteuert über seine eigene KPI. Jede KPI braucht einen Owner, einen Review-Rhythmus und einen Eskalations-Auslöser mit einem Schwellenwert.",
        )}
      </p>
      <div className="flex flex-wrap items-start gap-2">
        <RevealHint id="gov-tests" label={tt("Show the test questions", "Testfragen anzeigen")} title={tt(`Test questions · taught in ${m.name("C4")}`, `Testfragen · gelehrt in ${m.name("C4")}`)}>
          <div className="space-y-2 text-caption text-ink">
            <p>
              {tt(
                `Ask these of every row. They repeat the tests from ${m.name("C4")}; they never say which owner fits which KPI.`,
                `Stellen Sie diese Fragen zu jeder Zeile. Sie wiederholen die Tests aus ${m.name("C4")}; sie sagen nie, welcher Owner zu welcher KPI passt.`,
              )}
            </p>
            <ul className="space-y-1.5">
              {GOV_TESTS.map((t) => (
                <li key={t.name}>
                  <span className="font-semibold">{t.name}. </span>
                  <Gloss>{t.test}</Gloss>
                </li>
              ))}
            </ul>
            <p className="smallcaps text-ash">{tt("What each owner option does (Case assumption)", "Was jede Owner-Option tut (Fallannahme)")}</p>
            <ul className="space-y-1">
              {OWNERS.map((o) => (
                <li key={o}>
                  <span className="font-semibold">{ownerLabel(o)}. </span>
                  {OWNER_PROFILE[o].does} <span className="text-ash">{tt("Changes:", "Ändert:")} {OWNER_PROFILE[o].changes}</span>
                </li>
              ))}
            </ul>
            <p className="smallcaps text-ash">{tt("Reference points from the case for a trigger (Case assumption)", "Bezugspunkte aus dem Fall für einen Auslöser (Fallannahme)")}</p>
            <ul className="list-disc space-y-0.5 pl-5">
              {tt(
                <>
                  <li>
                    Repeat-purchase rate: {REPEAT.actual}% now, against a benchmark of {REPEAT.bench}%.
                  </li>
                  <li>
                    Show-up rate (booked → held): {SHOW_UP.before}% now, {SHOW_UP.after}% after the funnel fix, against a benchmark of {SHOW_UP.benchmark}%.
                  </li>
                  <li>Dashboard: no baseline KPI tracking exists today, so a threshold for the other KPIs can only be set once it has produced data.</li>
                  <li>
                    Conversion, proposal → signed: {STEP_BY_ID.signed.actual}% now, against a benchmark of {STEP_BY_ID.signed.bench}%. The training&apos;s effect on it is not quantified.
                  </li>
                </>,
                <>
                  <li>
                    Wiederkaufsrate: derzeit {num(REPEAT.actual, { maximumFractionDigits: 1 })} %, gegenüber einem Benchmark von {num(REPEAT.bench, { maximumFractionDigits: 1 })} %.
                  </li>
                  <li>
                    Erscheinungsquote (gebucht → geführt): derzeit {SHOW_UP.before} %, nach der Trichter-Behebung {SHOW_UP.after} %, gegenüber einem Benchmark von {SHOW_UP.benchmark} %.
                  </li>
                  <li>Dashboard: Es gibt heute kein KPI-Tracking als Ausgangswert, ein Schwellenwert für die anderen KPIs lässt sich also erst setzen, wenn es Daten geliefert hat.</li>
                  <li>
                    Konversion, Angebot → unterzeichnet: derzeit {num(STEP_BY_ID.signed.actual, { maximumFractionDigits: 1 })} %, gegenüber einem Benchmark von {num(STEP_BY_ID.signed.bench, { maximumFractionDigits: 1 })} %. Die Wirkung der Schulung darauf ist nicht beziffert.
                  </li>
                </>,
              )}
            </ul>
            <MaterialRefs refs={["C4"]} lead={tt("Taught in", "Gelehrt in")} />
          </div>
        </RevealHint>
      </div>
      {funded.map((id) => {
        const g = r.gov[id];
        const weak = g.trigger.trim() !== "" && !hasThreshold(g.trigger);
        return (
          <fieldset key={id} id={IDS.gov(id)} className="space-y-3 rounded-lg border border-line bg-paper p-3">
            <legend className="px-1 text-caption font-semibold">
              {ITEMS[id].n} · {ITEMS[id].short} · KPI: {ITEM_KPI[id]}
            </legend>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor={`own-${id}`} className="font-semibold text-ink">
                  {tt("Owner", "Owner")}
                </label>
                <p className="text-caption text-ash">{tt("One named role who acts on this KPI.", "Eine benannte Rolle, die an dieser KPI handelt.")}</p>
                <select id={`own-${id}`} className="field" value={g.owner} onChange={(e) => setGov(id, { owner: e.target.value })}>
                  <option value="">{tt("Choose an owner…", "Owner wählen…")}</option>
                  {OWNERS.map((o) => (
                    <option key={o} value={o}>
                      {ownerLabel(o)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <p id={`cad-label-${id}`} className="font-semibold text-ink">
                  {tt("Review cadence", "Review-Rhythmus")}
                </p>
                <p className="text-caption text-ash">{tt("How often the owner looks at the KPI.", "Wie oft der Owner die KPI ansieht.")}</p>
                <div role="radiogroup" aria-labelledby={`cad-label-${id}`} className="flex flex-wrap gap-2">
                  {CADENCES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={g.cadence === c}
                      onClick={() => setGov(id, { cadence: c })}
                      className={clsx("btn btn-sm min-h-[40px] border", g.cadence === c ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}
                    >
                      {cadenceLabel(c)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor={`trg-${id}`} className="font-semibold text-ink">
                {tt("Escalation trigger", "Eskalations-Auslöser")}
              </label>
              <p className="text-caption text-ash">
                {tt(
                  "The threshold that sends the KPI up, and to whom. Name a number, for example “below 60% for two months, to the Head of Sales”.",
                  "Der Schwellenwert, der die KPI nach oben eskaliert, und an wen. Nennen Sie eine Zahl, zum Beispiel „unter 60 % über zwei Monate, an den Head of Sales“.",
                )}
              </p>
              <input id={`trg-${id}`} className="field" value={g.trigger} onChange={(e) => setGov(id, { trigger: e.target.value })} aria-invalid={weak} />
              {weak && <p className="text-micro text-rust">{tt("A trigger without a number is a wish. Add the threshold.", "Ein Auslöser ohne Zahl ist ein Wunsch. Ergänzen Sie den Schwellenwert.")}</p>}
            </div>
            <AnswerKey block={governanceKey(id)} />
            <MentorGuide guide={govGuide(id)} />
          </fieldset>
        );
      })}
    </div>
  );
}

/** Block 3.5 — the measure you postponed. Required: a memo that names nothing postponed is incomplete. */
export function PostponedField() {
  const r = useStore((s) => s.route3);
  const setPostponed = useStore((s) => s.setPostponed);
  const setPickup = useStore((s) => s.setPickup);
  const open = leftOpen(r.alloc);
  const len = r.postponed.trim().length;
  // In the Case File this one field also carries what was cut (there is no separate block 3.3).
  const capstone = useCapstone();
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-mist/60 p-3 text-caption text-ink">
        <p className="smallcaps">{tt("Left open by your allocation", "Von Ihrer Zuteilung offen gelassen")}</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-5">
          {open.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
      <Field
        id={IDS.postponed}
        htmlFor="postponed-input"
        label={
          capstone
            ? tt("What do you cut or postpone in these four months, and what does that leave open?", "Was streichen oder stellen Sie in diesen vier Monaten zurück, und was lässt das offen?")
            : tt("Which KPI or action are you explicitly not pursuing in these four months?", "Welche KPI oder Maßnahme verfolgen Sie in diesen vier Monaten ausdrücklich nicht?")
        }
        help={
          capstone
            ? tt(
                "Required. Two or three sentences. Name something real from the list above (an item you did not fund or narrowed, or the part of the leak the fix leaves open), say what that leaves exposed in the terms of the material (which KPI stays unmeasured, which segment’s lever is delayed, which leak stays partly open) and why it can wait. A memo that funds everything and names nothing postponed is incomplete.",
                "Pflicht. Zwei oder drei Sätze. Nennen Sie etwas Reales aus der Liste oben (einen Posten, den Sie nicht finanziert oder eingegrenzt haben, oder den Teil des Lecks, den die Behebung offen lässt), sagen Sie, was das in den Begriffen des Materials ungeschützt lässt (welche KPI ungemessen bleibt, welcher Segment-Hebel sich verzögert, welches Leck teilweise offen bleibt) und warum es warten kann. Ein Memo, das alles finanziert und nichts als zurückgestellt benennt, ist unvollständig.",
              )
            : tt(
                "Required. Name something real from the list above (an unfunded or descoped item, or the part of the leak the fix leaves open) and say why it waits. A memo that funds everything and names nothing postponed is incomplete.",
                "Pflicht. Nennen Sie etwas Reales aus der Liste oben (einen nicht finanzierten oder eingegrenzten Posten oder den Teil des Lecks, den die Behebung offen lässt) und sagen Sie, warum es wartet. Ein Memo, das alles finanziert und nichts als zurückgestellt benennt, ist unvollständig.",
              )
        }
        meta={<span className="text-micro text-ash">{len} {tt("characters", "Zeichen")}</span>}
      >
        <textarea
          id="postponed-input"
          rows={3}
          className="field"
          value={r.postponed}
          onChange={(e) => setPostponed(e.target.value)}
          placeholder={tt("e.g. … is not pursued now because … ", "z. B. … wird jetzt nicht verfolgt, weil … ")}
        />
        <WritingHelp
          id="frame-postponed"
          steps={tt<string[]>(
            [
              "Pick one real item from the list above: an unfunded or descoped item, or the part of the leak the fix leaves open.",
              "Say what that leaves exposed, in the terms of the material, and why it can wait: what has to be in place or known first.",
              "Choose a pickup point that fits. A measure judged by a KPI waits for a baseline; a measure that only needs money can wait for a budget round. A postponed measure without a pickup point is a cut.",
            ],
            [
              "Wählen Sie einen realen Posten aus der Liste oben: einen nicht finanzierten oder eingegrenzten Posten oder den Teil des Lecks, den die Behebung offen lässt.",
              "Sagen Sie, was das in den Begriffen des Materials ungeschützt lässt und warum es warten kann: was zuerst vorhanden oder bekannt sein muss.",
              "Wählen Sie einen passenden Wiederaufnahmepunkt. Eine Maßnahme, die an einer KPI gemessen wird, wartet auf einen Ausgangswert; eine Maßnahme, die nur Geld braucht, kann auf eine Budgetrunde warten. Eine zurückgestellte Maßnahme ohne Wiederaufnahmepunkt ist eine Streichung.",
            ],
          )}
        />
      </Field>
      <Field id={IDS.pickup} htmlFor="pickup-select" label={tt("When will it be picked up?", "Wann wird sie wieder aufgenommen?")}
        help={tt("Required. A postponed measure without a pickup point is a cut.", "Pflicht. Eine zurückgestellte Maßnahme ohne Wiederaufnahmepunkt ist eine Streichung.")}
      >
        <select id="pickup-select" className="field" value={r.pickup} onChange={(e) => setPickup(e.target.value)}>
          <option value="">{tt("Choose a pickup point…", "Wiederaufnahmepunkt wählen…")}</option>
          {PICKUPS.map((p) => (
            <option key={p} value={p}>
              {pickupLabel(p)}
            </option>
          ))}
        </select>
        <AnswerKey block={pickupKey()} />
      </Field>
      <MentorGuide guide={postponedGuide()} />
    </div>
  );
}
