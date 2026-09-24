"use client";

import clsx from "clsx";
import { STEPS, STEP_BY_ID, STAGE_BY_ID, WEAKEST, CONTRACT_VALUE, fmtInt } from "@/data/funnel";
import { citesFunnelFigure } from "@/lib/checks";
import { weakestKey } from "@/lib/answerKey";
import { COST_FIGURE, costBuilder, wrongParts } from "@/lib/calcBuilder";
import { scrollToAndFlash } from "@/lib/flash";
import { IDS } from "@/lib/missing";
import { sentenceGuide } from "@/lib/mentorGuide";
import { useJumpTo } from "@/lib/useJumpTo";
import { useStore } from "@/store/useStore";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { CalcDiagnosis } from "@/components/ui/CalcDiagnosis";
import { Field } from "@/components/ui/Field";
import { FormulaBuilder } from "@/components/ui/FormulaBuilder";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { RevealHint } from "@/components/ui/RevealHint";

/** Block 1.3 — name the one stage with the largest negative gap. An objective pick from five, checked on request. */
export function WeakestPick() {
  const l1 = useStore((s) => s.l1);
  const setWeakest = useStore((s) => s.setWeakest);
  const check = useStore((s) => s.checkWeakest);
  const showClue = useStore((s) => s.showWeakestClue);

  return (
    <div className="space-y-3">
      <Field
        id={IDS.weakest}
        label="The stage with the largest negative gap"
        help="Pick one arrow of the funnel. Compare the gaps printed on the diagram, in percentage points."
        flagged={l1.weakestFlagged}
        clue="Set the counts aside: they fall at every stage by design. Which arrow has the longest gap bar, and is it the same arrow as the one that loses the most people?"
        clueShown={l1.weakestClue}
        onShowClue={showClue}
      >
        <div role="radiogroup" aria-label="Stage with the largest negative gap" className="grid gap-2 sm:grid-cols-2">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={l1.weakest === s.id}
              onClick={() => setWeakest(s.id)}
              className={clsx(
                "rounded-lg border px-3 py-2 text-left text-caption font-semibold transition-colors",
                l1.weakest === s.id ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => check(l1.weakest !== null && l1.weakest !== WEAKEST)} className="btn-primary btn-sm">
          Check my pick
        </button>
        <span className="text-caption text-ash">
          Checks requested: <span className="tnum font-semibold text-ink">{l1.checks}</span>
        </span>
      </div>
      <AnswerKey block={weakestKey()} />
    </div>
  );
}

/** The formula of Block 1.4 in words, with no numbers. Taught in Materi A4. */
const COST_FORMULA =
  "Prospects lost at the arrow = the count above it minus the count below it. Contracts they would have brought = those prospects × (contracts signed ÷ the count below the arrow). Cost in euros = those contracts × the average contract value. Taught in Materi A4, in the worked example on Alpenwerk.";

/**
 * The two on-demand helps under the cost sentence, hidden until asked for: the formula in words with the
 * automatic calculator, and "Numbers you need". Both are built from the arrow the learner named in Block 1.3,
 * so neither names a stage. The learner still reads the values and writes the sentence.
 */
function CostHelp() {
  const weakest = useStore((s) => s.l1.weakest);
  const parts = useStore((s) => s.l1.parts);
  const partFlags = useStore((s) => s.l1.partFlags);
  const setPart = useStore((s) => s.setL1Part);
  const jump = useJumpTo();
  const anyFlag = partFlags.some((k) => k.startsWith(`${COST_FIGURE}.`));
  if (!weakest) {
    return (
      <p className="rounded-md bg-mist px-3 py-2 text-caption text-ash">
        The formula help and the list of numbers are built on the arrow you name in Block 1.3.{" "}
        <button type="button" onClick={() => jump(IDS.weakest, "/route-1/")} className="font-semibold text-ink underline decoration-dotted underline-offset-2">
          Name it first
        </button>
        .
      </p>
    );
  }
  const st = STEP_BY_ID[weakest];
  const builder = costBuilder(weakest);
  const sources = [
    { target: `funnel-stage-${st.from}`, where: "Funnel · the bar above the arrow you named", label: "Count at that stage", value: fmtInt(st.fromCount) },
    { target: `funnel-stage-${st.id}`, where: "Funnel · the bar below the arrow you named", label: "Count at that stage", value: fmtInt(st.toCount) },
    { target: "funnel-stage-signed", where: "Funnel · the last bar", label: "Contract signed", value: fmtInt(STAGE_BY_ID.signed.count) },
    { target: "t1-contract", where: "Case brief", label: "Average value of a signed project contract", value: `€${CONTRACT_VALUE.toLocaleString("en-US")}` },
  ];
  return (
    <div className="flex flex-wrap items-start gap-2">
      <RevealHint id="formula-cost" label="Show the formula" title="Formula · from Materi A4" forceOpen={anyFlag}>
        <p className="text-caption text-ink">{COST_FORMULA}</p>
        <FormulaBuilder figure={COST_FIGURE} builder={builder} parts={parts} partFlags={partFlags} onPart={setPart} unit="€" source="the funnel and the case brief" />
      </RevealHint>
      <RevealHint id="src-cost" label="Show where the numbers are" title="Numbers you need · click one to see it on the page">
        <ul className="space-y-1">
          {sources.map((src) => (
            <li key={src.target + src.where}>
              <button
                type="button"
                onClick={() => scrollToAndFlash(src.target, "ref")}
                className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left text-caption hover:bg-accentSoft"
              >
                <span className="text-micro font-semibold uppercase text-ash">{src.where}</span>
                <span className="text-ink">{src.label}:</span>
                <span className="tnum font-semibold text-ink">{src.value}</span>
              </button>
            </li>
          ))}
        </ul>
      </RevealHint>
    </div>
  );
}

/** Block 1.4 — one judged sentence: what the leak costs, as a number derived from the funnel. */
export function CostSentence() {
  const l1 = useStore((s) => s.l1);
  const setSentence = useStore((s) => s.setSentence);
  const check = useStore((s) => s.checkSentence);
  const showClue = useStore((s) => s.showSentenceClue);
  const len = l1.sentence.trim().length;
  const builder = l1.weakest ? costBuilder(l1.weakest) : null;

  return (
    <div className="space-y-3">
      <p className="text-caption text-ink">
        The method is taught in Materi A4, with a worked example on Alpenwerk&apos;s numbers. Try it yourself first. If you get stuck, two helps sit under the field: &ldquo;Show the formula&rdquo; gives the formula in words with a
        calculator that checks each part, and &ldquo;Show where the numbers are&rdquo; lists the exact bars to read. You are practising combining the counts correctly, then writing the result in one sentence.
      </p>
      <Field
        id={IDS.sentence}
        htmlFor="cost-sentence"
        label="What does the leak at the stage you named in Block 1.3 cost DigitalIT Solutions each year?"
        help={
          <>
            One sentence, aimed at the managing director. State the cost as a number you can trace: use the counts on the funnel and, if you want euros, the average contract value in the case brief (€
            {CONTRACT_VALUE.toLocaleString("en-US")}). Do not invent a figure.
          </>
        }
        flagged={l1.sentenceFlagged}
        clue="How many prospects fall out at that stage (the count above it minus the count below it)? If they behaved like the prospects who do get through, how many contracts would that be? Which two counts on the funnel give you that rate?"
        clueShown={l1.sentenceClue}
        onShowClue={showClue}
        meta={<span className="text-micro text-ash">{len} characters</span>}
      >
        <textarea
          id="cost-sentence"
          rows={3}
          className="field"
          value={l1.sentence}
          onChange={(e) => setSentence(e.target.value)}
          aria-describedby="cost-sentence-help"
          placeholder="e.g. Losing … prospects a year costs about … because …"
        />
        {l1.sentenceFlagged && builder && (
          <CalcDiagnosis
            builder={builder}
            figure={COST_FIGURE}
            parts={l1.parts}
            partFlags={l1.partFlags}
            name="the figure in your sentence"
            mismatch={(r) => `Every part of your formula is right and gives ${r}, but your sentence does not state a figure that traces to the funnel. Put that result, or a rounding of it, in the sentence.`}
          />
        )}
        {l1.sentenceFlagged && !builder && (
          <p role="status" className="rounded-md border border-gold bg-accentSoft px-2.5 py-1.5 text-micro normal-case tracking-normal text-ink">
            <span className="smallcaps mr-1 text-accent">What to check</span>
            Name the stage in Block 1.3 first: the formula calculator under this field is built on it and shows which part of the working is off.
          </p>
        )}
        <CostHelp />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => check(len > 0 && !citesFunnelFigure(l1.sentence), builder ? wrongParts(builder, COST_FIGURE, l1.parts) : [])}
          className="btn-primary btn-sm"
        >
          Check the figure
        </button>
        <span className="text-caption text-ash">Only checks that the sentence rests on a number from the funnel, and each part of the formula calculator you filled. The reasoning is yours.</span>
      </div>
      <MentorGuide guide={sentenceGuide()} />
    </div>
  );
}
