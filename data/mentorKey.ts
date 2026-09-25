import { ROW_IDS, COLS, ROW_TRUTH, cellId, WEAKEST } from "@/data/funnel";
import type { Phase, StageId, StepId } from "@/data/funnel";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { CELL_KEYS, EXPECTED, LOSS_CELLS } from "@/data/segments";
import type { OptId, SegId } from "@/data/segments";
import { getLang, tt } from "@/lib/lang";

/**
 * Every model answer of Routes 1 and 2, in one file. A mentor enters the passcode in the top bar once and the
 * whole site fills in, so every export can be downloaded without typing. The passcode is a convenience gate in
 * client code, not security.
 *
 * The free-text answers are getters: "Fill all model answers" enters them in the language the site is showing (Route 1 can
 * be read in German). Values a select or a radio stores (owner, cadence, pickup point) stay the English constants.
 */
export const MENTOR_PASSCODE = "muchson123";

export const KEY_L1 = {
  sort: Object.fromEntries(TOUCHPOINTS.map((t) => [t.id, t.truth])) as Record<StageId, Phase>,
  get fill() {
    const v = (n: number) => (getLang() === "de" ? n.toFixed(1).replace(".", ",") : n.toFixed(1));
    return Object.fromEntries(ROW_IDS.flatMap((r) => COLS.map((c) => [cellId(r, c), v(ROW_TRUTH[r][c])]))) as Record<string, string>;
  },
  weakest: WEAKEST as StepId,
  get sentence() {
    return tt(
      "Losing the 55 prospects who book a consultation but never meet us (96 booked, 41 held) costs about 5 contracts a year, because 4 of every 41 held consultations sign: roughly €322,000 of project revenue at the €60,000 average contract value.",
      "Die 55 Interessenten zu verlieren, die eine Beratung buchen, aber nie mit uns sprechen (96 gebucht, 41 geführt), kostet etwa 5 Verträge im Jahr, denn von je 41 geführten Beratungen unterzeichnen 4: rund 322.000 € Projektumsatz bei einem durchschnittlichen Vertragswert von 60.000 €.",
    );
  },
};

const fmt = (n: number) => String(Math.round(n));

export const KEY_L2 = {
  grid: Object.fromEntries(CELL_KEYS.map((k) => [k, fmt(EXPECTED[k])])) as Record<string, string>,
  loss: Object.fromEntries(CELL_KEYS.map((k) => [k, LOSS_CELLS.includes(k)])) as Record<string, boolean>,
  rec: { P: "B", R: "A" } as Record<SegId, OptId>,
  just: {
    get P() {
      return tt(
        "Option B nets +€11,328 in the project segment, against +€3,416 for C and −€4,872 for A. Project clients placed only 1 repeat order in the last 12 months, so an 8% discount gives little margin away on orders that would have come anyway. The figure rests on the +8 pp uplift assumption; if the uplift is far smaller, C is the safer choice.",
        "Option B bringt im Projektsegment netto +11.328 €, gegenüber +3.416 € für C und −4.872 € für A. Projektkunden haben in den letzten 12 Monaten nur 1 Folgeauftrag erteilt, deshalb verschenkt ein Rabatt von 8 % wenig Marge auf Aufträge, die ohnehin gekommen wären. Die Zahl beruht auf der Annahme einer Steigerung um +8 PP; ist die Steigerung viel kleiner, ist C die sicherere Wahl.",
      );
    },
    get R() {
      return tt(
        "Option A nets +€19,296 in the retainer segment, against +€15,072 for C and −€8,832 for B. Retainer clients already placed 4 repeat orders in the last 12 months, so a discount would be paid on all of them, and its +3 pp uplift cannot cover that. Account management answers the relationship motive, and its €36,000 cost is covered by 2.88 extra orders.",
        "Option A bringt im Retainer-Segment netto +19.296 €, gegenüber +15.072 € für C und −8.832 € für B. Retainer-Kunden haben in den letzten 12 Monaten bereits 4 Folgeaufträge erteilt, ein Rabatt würde also auf alle davon anfallen, und seine Steigerung von +3 PP kann das nicht decken. Kundenbetreuung antwortet auf das Beziehungsmotiv, und ihre Kosten von 36.000 € werden durch 2,88 zusätzliche Aufträge gedeckt.",
      );
    },
  } as Record<SegId, string>,
  uniform: "C" as OptId,
  get tradeoff() {
    return tt(
      "Across both segments C nets +€18,488, against +€14,424 for A and +€2,496 for B, so C is the best single option. Choosing it gives up the local winners: in project clients B would have netted +€11,328 instead of +€3,416 (€7,912 less), and in retainer clients A would have netted +€19,296 instead of +€15,072 (€4,224 less). Together that is €12,136 less than running B for project and A for retainer clients.",
      "Über beide Segmente bringt C netto +18.488 €, gegenüber +14.424 € für A und +2.496 € für B, C ist also die beste einzelne Option. Wer sie wählt, verzichtet auf die lokalen Sieger: Bei Projektkunden hätte B netto +11.328 € statt +3.416 € gebracht (7.912 € weniger), bei Retainer-Kunden A +19.296 € statt +15.072 € (4.224 € weniger). Zusammen sind das 12.136 € weniger, als B für Projekt- und A für Retainer-Kunden zu betreiben.",
    );
  },
};

/**
 * Route 3 model answer: Option C for both segments (€41,800), the funnel fix (€58,000) and the dashboard
 * (€39,000) are funded for €138,800; the training (€21,000) is cut. The dashboard and the fix start in month 1
 * and the lever in month 2, so the KPI-blind-spot warning does not appear.
 */
export const KEY_L3 = {
  alloc: { leverOpt: "C" as OptId, leverScope: "both" as "both" | "P" | "R", fix: true, dash: true, train: false },
  start: { lever: 2, fix: 1, dash: 1, train: null } as Record<"lever" | "fix" | "dash" | "train", number | null>,
  warned: false,
  missingKpi: null as "conversion" | "clv" | "repeat" | null,
  get cut() {
    return tt(
      "I cut item 4, the sales training (€21,000). The team gets no workshop or coaching in behaviour-based selling in this window, so the conversion rate from proposal to signature stays dependent on current selling habits, and the funnel fix rests on the new coordinator alone. Nothing else was descoped, so every segment gets the value-added service and the show-up rate is still lifted to 68%.",
      "Ich habe Posten 4, die Vertriebsschulung (21.000 €), gestrichen. Das Team erhält in diesem Zeitraum keinen Workshop und kein Coaching im verhaltensbasierten Verkauf, die Konversion von Angebot zu Unterschrift bleibt also von den heutigen Verkaufsgewohnheiten abhängig, und die Trichter-Behebung beruht allein auf der neuen Koordinationsrolle. Sonst wurde nichts eingegrenzt, jedes Segment erhält also die Zusatzleistung, und die Erscheinungsquote wird weiterhin auf 68 % gehoben.",
    );
  },
  gov: {
    lever: {
      owner: "Key account manager",
      cadence: "Monthly",
      get trigger() {
        return tt(
          "If the repeat-purchase rate has not risen by at least 2 pp after three months of baseline, escalate to the Chief Customer Officer and review the lever.",
          "Ist die Wiederkaufsrate nach drei Monaten Ausgangsdaten nicht um mindestens 2 PP gestiegen, an den Chief Customer Officer eskalieren und den Hebel überprüfen.",
        );
      },
    },
    fix: {
      owner: "CRM coordinator",
      cadence: "Weekly",
      get trigger() {
        return tt(
          "If the show-up rate is below 55% for two consecutive weeks, escalate to the Head of Sales for a change of reminder workflow.",
          "Liegt die Erscheinungsquote zwei Wochen in Folge unter 55 %, an den Head of Sales eskalieren, um den Erinnerungsablauf zu ändern.",
        );
      },
    },
    dash: {
      owner: "Controlling",
      cadence: "Monthly",
      get trigger() {
        return tt(
          "If any of the three KPIs is published more than 5 working days late, escalate to the Chief Customer Officer.",
          "Wird eine der drei KPIs mehr als 5 Arbeitstage zu spät veröffentlicht, an den Chief Customer Officer eskalieren.",
        );
      },
    },
    train: { owner: "", cadence: "", trigger: "" },
  } as Record<"lever" | "fix" | "dash" | "train", { owner: string; cadence: string; trigger: string }>,
  get postponed() {
    return tt(
      "The behaviour-based selling training (item 4) and the last 7 pp of the show-up gap (68% against the 75% benchmark) are not pursued in these four months. Both wait until the dashboard has three months of baseline, so we can see whether the funnel fix and the lever already move the conversion rate before spending on them.",
      "Die Schulung im verhaltensbasierten Verkauf (Posten 4) und die letzten 7 PP der Erscheinungslücke (68 % gegenüber dem Benchmark von 75 %) werden in diesen vier Monaten nicht verfolgt. Beides wartet, bis das Dashboard drei Monate Ausgangsdaten hat, damit wir sehen können, ob die Trichter-Behebung und der Hebel die Konversionsrate schon bewegen, bevor wir dafür Geld ausgeben.",
    );
  },
  pickup: "After three months of dashboard baseline",
};
