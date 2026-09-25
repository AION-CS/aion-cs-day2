"use client";

import { ReferencesAccordion } from "@/components/ui/ReferencesAccordion";
import { MATERIALS } from "@/data/materialIndex";
import type { RefKey } from "@/data/references";
import { tt } from "@/lib/lang";
import { CardA1, CardA2, CardA3, CardA4, CardA5, CardA6 } from "@/components/materi/CapstoneCards";
import { CardB1, CardB2, CardB3, CardB4 } from "@/components/materi/MateriB";
import { CardC1, CardC2, CardC3, CardC4 } from "@/components/materi/MateriC";

// What each block's cards cite, for its References accordion.
const REFS_A: RefKey[] = [
  "bauer1960", "morgan1994", "anderson2006", "iso27001", "bsic5", "gdpr", "lemon2016", "gartner2017", "gupta2003", "reichheld1990",
  "dick1994", "nagle2018", "fader2005", "burnham2003", "kahneman1979", "samuelson1988", "kahneman1991", "gustafsson2005",
  "kaplan1992", "doran1981", "deming1986", "brealey2020", "betrvg87",
];
const REFS_B: RefKey[] = [
  "morgan1994", "anderson2006", "reichheld1990", "dick1994", "fader2005", "gupta2003", "nagle2018", "burnham2003",
  "kahneman1979", "samuelson1988", "kahneman1991", "gustafsson2005",
];

const REFS_C: RefKey[] = ["kaplan1992", "doran1981", "deming1986", "nagle2018", "brealey2020", "gupta2003", "betrvg87"];

const minutes = (b: "A" | "B" | "C") => MATERIALS.filter((m) => m.block === b).reduce((s, m) => s + m.minutes, 0);

export function MateriA() {
  return (
    <section id="materi-a" className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">
          {tt("Materi A · Levels 1 to 3", "Materi A · Level 1 bis 3")} · {minutes("A")} {tt("min", "Min.")}
        </p>
        <h2 className="text-h1">{tt("The whole case in six cards", "Der ganze Fall in sechs Karten")}</h2>
        <p className="max-w-prose text-body text-ash">
          {tt(
            `Six short cards, two per level (${minutes("A")} min, facilitator-led). Level 1 (A1, A2): why a buyer acts, and where a funnel leaks. Level 2 (A3, A4): what a retention lever nets in euros, and why segments differ. Level 3 (A5, A6): how to govern what you fund under a budget that does not cover everything. Each card holds the tests you need for the Case File below; the full Level 2 and Level 3 material is kept as optional Routes 2 and 3.`,
            `Sechs kurze Karten, zwei pro Level (${minutes("A")} Min., von der Moderation geleitet). Level 1 (A1, A2): warum ein Käufer handelt und wo ein Trichter leckt. Level 2 (A3, A4): was ein Bindungshebel in Euro netto bringt und warum Segmente sich unterscheiden. Level 3 (A5, A6): wie Sie steuern, was Sie finanzieren, wenn das Budget nicht für alles reicht. Jede Karte enthält die Tests, die Sie für die Fallakte unten brauchen; das vollständige Material zu Level 2 und Level 3 bleibt als optionale Routen 2 und 3 erhalten.`,
          )}
        </p>
      </header>
      <CardA1 />
      <CardA2 />
      <CardA3 />
      <CardA4 />
      <CardA5 />
      <CardA6 />
      <ReferencesAccordion block="A" keys={REFS_A} />
    </section>
  );
}

export function MateriB() {
  return (
    <section id="materi-b" className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">Materi B · Level 2 · Application · {minutes("B")} min</p>
        <h2 className="text-h1">Choosing a retention lever by what it nets</h2>
        <p className="max-w-prose text-body text-ash">
          Four short cards ({minutes("B")} min, facilitator-led). They give you the tests you need for Task 2: which lever answers which motive, why segments differ, how to put a euro figure on a
          lever, and why a discount is a weak tool against relationship churn.
        </p>
      </header>
      <CardB1 />
      <CardB2 />
      <CardB3 />
      <CardB4 />
      <ReferencesAccordion block="B" keys={REFS_B} />
    </section>
  );
}

export function MateriC() {
  return (
    <section id="materi-c" className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">Materi C · Level 3 · Management decision · {minutes("C")} min</p>
        <h2 className="text-h1">Deciding under a budget that does not cover everything</h2>
        <p className="max-w-prose text-body text-ash">
          Four short cards ({minutes("C")} min, facilitator-led). They give you the tests you need for Task 3: how to write an action as goal, action and KPI, why a governed system beats a one-off fix,
          which actions scale and which only move one deal, and what a governance plan and a postponed measure must contain.
        </p>
      </header>
      <CardC1 />
      <CardC2 />
      <CardC3 />
      <CardC4 />
      <ReferencesAccordion block="C" keys={REFS_C} note="Frameworks from Levels 1 and 2 are listed in the references of Routes 1 and 2." />
    </section>
  );
}
