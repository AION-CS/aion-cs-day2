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
import { euro, tt } from "@/lib/lang";

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
        label={tt("The stage with the largest negative gap", "Die Stufe mit der größten negativen Abweichung")}
        help={tt(
          "Pick one arrow of the funnel. Compare the gaps printed on the diagram, in percentage points.",
          "Wählen Sie einen Pfeil des Trichters. Vergleichen Sie die im Diagramm gedruckten Abweichungen, in Prozentpunkten.",
        )}
        flagged={l1.weakestFlagged}
        clue={tt(
          "Set the counts aside: they fall at every stage by design. Which arrow has the longest gap bar, and is it the same arrow as the one that loses the most people?",
          "Legen Sie die Zahlen beiseite: Sie fallen von Stufe zu Stufe von selbst. Welcher Pfeil hat den längsten Abweichungsbalken, und ist es derselbe Pfeil wie der, der die meisten Personen verliert?",
        )}
        clueShown={l1.weakestClue}
        onShowClue={showClue}
      >
        <div role="radiogroup" aria-label={tt("Stage with the largest negative gap", "Stufe mit der größten negativen Abweichung")} className="grid gap-2 sm:grid-cols-2">
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
          {tt("Check my pick", "Meine Wahl prüfen")}
        </button>
        <span className="text-caption text-ash">
          {tt("Checks requested:", "Angeforderte Prüfungen:")} <span className="tnum font-semibold text-ink">{l1.checks}</span>
        </span>
      </div>
      <AnswerKey block={weakestKey()} />
    </div>
  );
}

/** The formula of Block 1.4 in words, with no numbers. Taught in Materi A4. */
const COST_FORMULA = () =>
  tt(
    "Prospects lost at the arrow = the count above it minus the count below it. Contracts they would have brought = those prospects × (contracts signed ÷ the count below the arrow). Cost in euros = those contracts × the average contract value. Taught in Materi A2, in the worked example on Alpenwerk.",
    "Verlorene Interessenten am Pfeil = die Zahl darüber minus die Zahl darunter. Verträge, die sie gebracht hätten = diese Interessenten × (unterzeichnete Verträge ÷ die Zahl unter dem Pfeil). Kosten in Euro = diese Verträge × der durchschnittliche Vertragswert. Gelehrt in Materi A2, im Rechenbeispiel zu Alpenwerk.",
  );

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
        {tt("The formula help and the list of numbers are built on the arrow you name in Block 1.3.", "Die Formelhilfe und die Liste der Zahlen beruhen auf dem Pfeil, den Sie in Block 1.3 benennen.")}{" "}
        <button type="button" onClick={() => jump(IDS.weakest, "/route-1/")} className="font-semibold text-ink underline decoration-dotted underline-offset-2">
          {tt("Name it first", "Zuerst benennen")}
        </button>
        .
      </p>
    );
  }
  const st = STEP_BY_ID[weakest];
  const builder = costBuilder(weakest);
  const sources = [
    { target: `funnel-stage-${st.from}`, where: tt("Funnel · the bar above the arrow you named", "Trichter · der Balken über dem benannten Pfeil"), label: tt("Count at that stage", "Zahl dieser Stufe"), value: fmtInt(st.fromCount) },
    { target: `funnel-stage-${st.id}`, where: tt("Funnel · the bar below the arrow you named", "Trichter · der Balken unter dem benannten Pfeil"), label: tt("Count at that stage", "Zahl dieser Stufe"), value: fmtInt(st.toCount) },
    { target: "funnel-stage-signed", where: tt("Funnel · the last bar", "Trichter · der letzte Balken"), label: tt("Contract signed", "Vertrag unterzeichnet"), value: fmtInt(STAGE_BY_ID.signed.count) },
    { target: "t1-contract", where: tt("Case brief", "Fallbeschreibung"), label: tt("Average value of a signed project contract", "Durchschnittlicher Wert eines unterzeichneten Projektvertrags"), value: euro(CONTRACT_VALUE) },
  ];
  return (
    <div className="flex flex-wrap items-start gap-2">
      <RevealHint id="formula-cost" label={tt("Show the formula", "Formel anzeigen")} title={tt("Formula · from Materi A2", "Formel · aus Materi A2")} forceOpen={anyFlag}>
        <p className="text-caption text-ink">{COST_FORMULA()}</p>
        <FormulaBuilder figure={COST_FIGURE} builder={builder} parts={parts} partFlags={partFlags} onPart={setPart} unit="€" source={tt("the funnel and the case brief", "dem Trichter und der Fallbeschreibung")} />
      </RevealHint>
      <RevealHint id="src-cost" label={tt("Show where the numbers are", "Zeigen, wo die Zahlen stehen")} title={tt("Numbers you need · click one to see it on the page", "Zahlen, die Sie brauchen · klicken Sie eine an, um sie auf der Seite zu sehen")}>
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
        {tt(
          <>
            The method is taught in Materi A2, with a worked example on Alpenwerk&apos;s numbers. Try it yourself first. If you get stuck, two helps sit under the field: &ldquo;Show the formula&rdquo; gives the formula in words with a
            calculator that checks each part, and &ldquo;Show where the numbers are&rdquo; lists the exact bars to read. You are practising combining the counts correctly, then writing the result in one sentence.
          </>,
          <>
            Die Methode wird in Materi A2 gelehrt, mit einem Rechenbeispiel zu den Zahlen von Alpenwerk. Versuchen Sie es zuerst selbst. Wenn Sie nicht weiterkommen, gibt es unter dem Feld zwei Hilfen: „Formel anzeigen“ nennt die Formel in Worten, mit einem
            Rechner, der jeden Teil prüft, und „Zeigen, wo die Zahlen stehen“ listet die genauen Balken, die Sie ablesen sollen. Sie üben, die Zahlen richtig zu verbinden, und schreiben das Ergebnis dann in einem Satz auf.
          </>,
        )}
      </p>
      <Field
        id={IDS.sentence}
        htmlFor="cost-sentence"
        label={tt(
          "What does the leak at the stage you named in Block 1.3 cost DigitalIT Solutions each year?",
          "Was kostet das Leck an der in Block 1.3 benannten Stufe DigitalIT Solutions pro Jahr?",
        )}
        help={tt(
          <>
            One sentence, aimed at the managing director. State the cost as a number you can trace: use the counts on the funnel and, if you want euros, the average contract value in the case brief (€
            {CONTRACT_VALUE.toLocaleString("en-US")}). Do not invent a figure.
          </>,
          <>
            Ein Satz, gerichtet an die Geschäftsführung. Nennen Sie die Kosten als Zahl, die Sie nachvollziehen können: Nutzen Sie die Zahlen im Trichter und, wenn Sie Euro möchten, den durchschnittlichen Vertragswert aus der Fallbeschreibung ({euro(CONTRACT_VALUE)}). Erfinden Sie keine Zahl.
          </>,
        )}
        flagged={l1.sentenceFlagged}
        clue={tt(
          "How many prospects fall out at that stage (the count above it minus the count below it)? If they behaved like the prospects who do get through, how many contracts would that be? Which two counts on the funnel give you that rate?",
          "Wie viele Interessenten fallen an dieser Stufe heraus (die Zahl darüber minus die Zahl darunter)? Wenn sie sich wie die Interessenten verhielten, die durchkommen, wie viele Verträge wären das? Welche zwei Zahlen im Trichter ergeben diese Rate?",
        )}
        clueShown={l1.sentenceClue}
        onShowClue={showClue}
        meta={<span className="text-micro text-ash">{len} {tt("characters", "Zeichen")}</span>}
      >
        <textarea
          id="cost-sentence"
          rows={3}
          className="field"
          value={l1.sentence}
          onChange={(e) => setSentence(e.target.value)}
          aria-describedby="cost-sentence-help"
          placeholder={tt("e.g. Losing … prospects a year costs about … because …", "z. B. …Interessenten pro Jahr zu verlieren kostet etwa … weil …")}
        />
        {l1.sentenceFlagged && builder && (
          <CalcDiagnosis
            builder={builder}
            figure={COST_FIGURE}
            parts={l1.parts}
            partFlags={l1.partFlags}
            name={tt("the figure in your sentence", "die Zahl in Ihrem Satz")}
            mismatch={(r) =>
              tt(
                `Every part of your formula is right and gives ${r}, but your sentence does not state a figure that traces to the funnel. Put that result, or a rounding of it, in the sentence.`,
                `Jeder Teil Ihrer Formel stimmt und ergibt ${r}, aber Ihr Satz nennt keine Zahl, die sich auf den Trichter zurückführen lässt. Setzen Sie dieses Ergebnis oder eine Rundung davon in den Satz.`,
              )
            }
          />
        )}
        {l1.sentenceFlagged && !builder && (
          <p role="status" className="rounded-md border border-gold bg-accentSoft px-2.5 py-1.5 text-micro normal-case tracking-normal text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("What to check", "Was zu prüfen ist")}</span>
            {tt(
              "Name the stage in Block 1.3 first: the formula calculator under this field is built on it and shows which part of the working is off.",
              "Benennen Sie zuerst die Stufe in Block 1.3: Der Formelrechner unter diesem Feld beruht darauf und zeigt, welcher Teil der Rechnung nicht stimmt.",
            )}
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
          {tt("Check the figure", "Zahl prüfen")}
        </button>
        <span className="text-caption text-ash">
          {tt(
            "Only checks that the sentence rests on a number from the funnel, and each part of the formula calculator you filled. The reasoning is yours.",
            "Prüft nur, dass der Satz auf einer Zahl aus dem Trichter beruht, und jeden Teil des Formelrechners, den Sie ausgefüllt haben. Die Begründung ist Ihre.",
          )}
        </span>
      </div>
      <MentorGuide guide={sentenceGuide()} />
    </div>
  );
}
