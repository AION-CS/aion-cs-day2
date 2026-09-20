"use client";

import clsx from "clsx";
import { STEPS, WEAKEST, CONTRACT_VALUE } from "@/data/funnel";
import { citesFunnelFigure } from "@/lib/checks";
import { weakestKey } from "@/lib/answerKey";
import { IDS } from "@/lib/missing";
import { useStore } from "@/store/useStore";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { Field } from "@/components/ui/Field";

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

/** Block 1.4 — one judged sentence: what the leak costs, as a number derived from the funnel. */
export function CostSentence() {
  const l1 = useStore((s) => s.l1);
  const setSentence = useStore((s) => s.setSentence);
  const check = useStore((s) => s.checkSentence);
  const showClue = useStore((s) => s.showSentenceClue);
  const len = l1.sentence.trim().length;

  return (
    <div className="space-y-3">
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
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => check(len > 0 && !citesFunnelFigure(l1.sentence))} className="btn-primary btn-sm">
          Check the figure
        </button>
        <span className="text-caption text-ash">Only checks that the sentence rests on a number from the funnel. The reasoning is yours.</span>
      </div>
    </div>
  );
}
