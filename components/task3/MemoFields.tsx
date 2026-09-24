"use client";

import clsx from "clsx";
import { CADENCES, FIXED_COST, GOV_TESTS, ITEMS, ITEM_KPI, OWNERS, OWNER_PROFILE, PICKUPS, SHOW_UP } from "@/data/program";
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
import { useMateri } from "@/lib/materiAlias";
import { cutGuide, govGuide, postponedGuide } from "@/lib/mentorGuide";

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
      label={nothingCut ? "What did you not buy, and what does that leave exposed?" : "What was cut or descoped, and what does that cost?"}
      help={
        nothingCut
          ? "Every line item is funded on cost. Say so, and name what the discount’s ongoing margin cost or the 7 pp the funnel fix leaves open exposes. Two or three sentences."
          : "Two or three sentences. Name the specific line item or scope you reduced, then the consequence in the terms of the material: which KPI stays unmeasured, which segment’s lever is delayed, which leak stays partly open."
      }
      meta={<span className="text-micro text-ash">{len} characters</span>}
    >
      <textarea
        id="cut-input"
        rows={4}
        className="field"
        value={cut}
        onChange={(e) => setCut(e.target.value)}
        placeholder="e.g. I cut item … (€…). As a result … stays …"
      />
      <WritingHelp
        id="frame-cut"
        steps={
          nothingCut
            ? [
                "Say plainly that every line item is funded on cost.",
                "Name what you did not buy anyway: the margin the discount gives away on every repeat order, or the 7 pp of the show-up gap the fix leaves open.",
                "Say what that leaves exposed, in the terms of the material.",
              ]
            : [
                "Name the line item or the scope you cut, with its cost.",
                "Say what the cut leaves open in the terms of the material: which KPI stays unmeasured, which segment's lever is delayed, which leak stays partly open.",
                "If you cut the weakest-evidenced item first, say why that item and not another.",
              ]
        }
        refs={[
          { label: "Budget and what you have allocated", value: "see the running total", target: IDS.allocTotal },
          { label: "Funnel-leak fix", value: fmtEuroPlain(FIXED_COST.fix), target: IDS.allocGrid },
          { label: "KPI dashboard", value: fmtEuroPlain(FIXED_COST.dash), target: IDS.allocGrid },
          { label: "Sales training (its effect is not quantified in the case)", value: fmtEuroPlain(FIXED_COST.train), target: IDS.allocGrid },
        ]}
        refsTitle="Prices and effects printed in Block 3.1"
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
    return <p className="rounded-md bg-mist px-3 py-2 text-caption text-ash">Fund at least one line item in Block 3.1. Governance is written for what you fund.</p>;
  }
  return (
    <div className="space-y-3">
      <p className="text-caption text-ash">One row per funded item, each governed by its own KPI. Every KPI needs an owner, a review cadence and an escalation trigger with a threshold.</p>
      <div className="flex flex-wrap items-start gap-2">
        <RevealHint id="gov-tests" label="Show the test questions" title={`Test questions · taught in ${m.name("C4")}`}>
          <div className="space-y-2 text-caption text-ink">
            <p>Ask these of every row. They repeat the tests from {m.name("C4")}; they never say which owner fits which KPI.</p>
            <ul className="space-y-1.5">
              {GOV_TESTS.map((t) => (
                <li key={t.name}>
                  <span className="font-semibold">{t.name}. </span>
                  <Gloss>{t.test}</Gloss>
                </li>
              ))}
            </ul>
            <p className="smallcaps text-ash">What each owner option does (Case assumption)</p>
            <ul className="space-y-1">
              {OWNERS.map((o) => (
                <li key={o}>
                  <span className="font-semibold">{o}. </span>
                  {OWNER_PROFILE[o].does} <span className="text-ash">Changes: {OWNER_PROFILE[o].changes}</span>
                </li>
              ))}
            </ul>
            <p className="smallcaps text-ash">Reference points from the case for a trigger (Case assumption)</p>
            <ul className="list-disc space-y-0.5 pl-5">
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
            </ul>
            <MaterialRefs refs={["C4"]} lead="Taught in" />
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
                  Owner
                </label>
                <p className="text-caption text-ash">One named role who acts on this KPI.</p>
                <select id={`own-${id}`} className="field" value={g.owner} onChange={(e) => setGov(id, { owner: e.target.value })}>
                  <option value="">Choose an owner…</option>
                  {OWNERS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <p id={`cad-label-${id}`} className="font-semibold text-ink">
                  Review cadence
                </p>
                <p className="text-caption text-ash">How often the owner looks at the KPI.</p>
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
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor={`trg-${id}`} className="font-semibold text-ink">
                Escalation trigger
              </label>
              <p className="text-caption text-ash">The threshold that sends the KPI up, and to whom. Name a number, for example “below 60% for two months, to the Head of Sales”.</p>
              <input id={`trg-${id}`} className="field" value={g.trigger} onChange={(e) => setGov(id, { trigger: e.target.value })} aria-invalid={weak} />
              {weak && <p className="text-micro text-rust">A trigger without a number is a wish. Add the threshold.</p>}
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
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-mist/60 p-3 text-caption text-ink">
        <p className="smallcaps">Left open by your allocation</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-5">
          {open.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
      <Field
        id={IDS.postponed}
        htmlFor="postponed-input"
        label="Which KPI or action are you explicitly not pursuing in these four months?"
        help="Required. Name something real from the list above (an unfunded or descoped item, or the part of the leak the fix leaves open) and say why it waits. A memo that funds everything and names nothing postponed is incomplete."
        meta={<span className="text-micro text-ash">{len} characters</span>}
      >
        <textarea
          id="postponed-input"
          rows={3}
          className="field"
          value={r.postponed}
          onChange={(e) => setPostponed(e.target.value)}
          placeholder="e.g. … is not pursued now because … "
        />
        <WritingHelp
          id="frame-postponed"
          steps={[
            "Pick one real item from the list above: an unfunded or descoped item, or the part of the leak the fix leaves open.",
            "Say why it can wait: what has to be in place or known first.",
            "Choose a pickup point that fits. A measure judged by a KPI waits for a baseline; a measure that only needs money can wait for a budget round. A postponed measure without a pickup point is a cut.",
          ]}
        />
      </Field>
      <Field id={IDS.pickup} htmlFor="pickup-select" label="When will it be picked up?" help="Required. A postponed measure without a pickup point is a cut.">
        <select id="pickup-select" className="field" value={r.pickup} onChange={(e) => setPickup(e.target.value)}>
          <option value="">Choose a pickup point…</option>
          {PICKUPS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <AnswerKey block={pickupKey()} />
      </Field>
      <MentorGuide guide={postponedGuide()} />
    </div>
  );
}
