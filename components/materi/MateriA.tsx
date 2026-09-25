"use client";

import { useId, useState } from "react";
import { Bul, Insight } from "@/components/materi/kit";
import { PHASE_TESTS } from "@/data/touchpoints";
import type { Phase } from "@/data/funnel";
import { Gloss } from "@/lib/glossify";
import { d1, num, tt } from "@/lib/lang";
import { wrap } from "@/lib/svg";

/**
 * The diagrams of Materi A that the Route 1 cards use (CapstoneCards.tsx): the motive ladder, the journey map, the worked sort
 * and the KPI ladder. Every visible text is available in English and German (`tt`).
 */

/* ------------------------------------------------------------------ A1 */

const motives = () =>
  [
    {
      id: "trust",
      motive: tt("Trust", "Vertrauen"),
      sub: tt("risk aversion · security", "Risikoaversion · Sicherheit"),
      strategy: tt("Reduce the buyer’s risk", "Das Risiko des Käufers senken"),
      proof: tt<string[]>(
        [
          "Reference customers (Referenzkunden) in the same sector and size",
          "A paid pilot phase (proof of concept) before the full contract",
          "Compliance proof: an ISO/IEC 27001 certificate, a BSI C5 attestation for cloud services, a GDPR Art. 28 data-processing agreement (Auftragsverarbeitungsvertrag, AVV)",
        ],
        [
          "Referenzkunden aus derselben Branche und Größenklasse",
          "Eine bezahlte Pilotphase (Proof of Concept) vor dem vollständigen Vertrag",
          "Compliance-Nachweise: ein ISO/IEC-27001-Zertifikat, ein BSI-C5-Testat für Cloud-Dienste, ein Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO",
        ],
      ),
      german: tt(
        "In a Mittelstand (mid-sized company) buying committee the IT security officer and the data protection officer can each stop the deal, so the proof has to be on the table before they ask.",
        "In einem Buying Committee eines Mittelständlers können der IT-Sicherheitsbeauftragte und der Datenschutzbeauftragte jeweils den Abschluss stoppen, deshalb müssen die Nachweise auf dem Tisch liegen, bevor sie fragen.",
      ),
    },
    {
      id: "price",
      motive: tt("Price", "Preis"),
      sub: tt("total cost of ownership", "Gesamtkosten des Besitzes"),
      strategy: tt("Make the total cost visible", "Die Gesamtkosten sichtbar machen"),
      proof: tt<string[]>(
        [
          "A cost comparison over the whole contract life, not only the licence or day-rate line",
          "Fixed-price phases with a written change-request rule",
          "Run costs, exit costs and add-ons named in the offer",
        ],
        [
          "Ein Kostenvergleich über die gesamte Vertragslaufzeit, nicht nur die Zeile für Lizenz oder Tagessatz",
          "Festpreisphasen mit einer schriftlichen Regel für Änderungswünsche",
          "Betriebskosten, Ausstiegskosten und Zusatzleistungen, im Angebot benannt",
        ],
      ),
      german: tt(
        "An Ausschreibung (formal tender) usually scores price on the offer as written, so a cost that appears only after signature is caught at evaluation or resented at the first invoice.",
        "Eine Ausschreibung bewertet den Preis meist nach dem Angebot, wie es geschrieben ist; ein Kostenpunkt, der erst nach der Unterschrift auftaucht, wird bei der Bewertung entdeckt oder bei der ersten Rechnung übel genommen.",
      ),
    },
    {
      id: "benefit",
      motive: tt("Benefit", "Nutzen"),
      sub: tt("perceived value", "wahrgenommener Wert"),
      strategy: tt("Prove the outcome", "Das Ergebnis belegen"),
      proof: tt<string[]>(
        [
          "A value case built from the buyer’s own figures, not the vendor’s brochure",
          "One KPI with a baseline and a target",
          "A review date at which the result is measured against the target",
        ],
        [
          "Eine Nutzenrechnung aus den eigenen Zahlen des Käufers, nicht aus der Broschüre des Anbieters",
          "Eine KPI mit Ausgangswert und Zielwert",
          "Ein Review-Termin, an dem das Ergebnis am Zielwert gemessen wird",
        ],
      ),
      german: tt(
        "A Fachabteilung (business department) that owns the budget decides on the outcome it must report upward, so the offer has to speak in that department’s KPI.",
        "Eine Fachabteilung, die das Budget besitzt, entscheidet nach dem Ergebnis, das sie nach oben berichten muss; das Angebot muss also in der KPI dieser Abteilung sprechen.",
      ),
    },
    {
      id: "relationship",
      motive: tt("Relationship", "Beziehung"),
      sub: tt("continuity of people", "Kontinuität der Personen"),
      strategy: tt("Keep the people constant", "Die Ansprechpartner konstant halten"),
      proof: tt<string[]>(
        [
          "A named account owner who stays through the project and after it",
          "A fixed review rhythm, for example a quarterly business review",
          "A known escalation path with a name at the end of it",
        ],
        [
          "Ein namentlich benannter Account Owner, der durch das Projekt und danach bleibt",
          "Ein fester Review-Rhythmus, zum Beispiel eine vierteljährliche Business Review",
          "Ein bekannter Eskalationsweg mit einem Namen an seinem Ende",
        ],
      ),
      german: tt(
        "When the buyer’s contact changes twice in a year, the relationship restarts. Switching a long-standing IT partner is felt as a personal risk, and continuity is what makes it feel larger than the saving.",
        "Wechselt der Ansprechpartner des Käufers zweimal im Jahr, beginnt die Beziehung neu. Einen langjährigen IT-Partner zu wechseln, wird als persönliches Risiko empfunden, und Kontinuität lässt dieses Risiko größer wirken als die Ersparnis.",
      ),
    },
  ] as const;

export function MotiveLadder() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<string>("trust");
  const MOTIVES = motives();
  const m = MOTIVES.find((x) => x.id === sel)!;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 250" className="mx-auto h-auto w-full max-w-[600px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt(`From buying motive to sales strategy`, `Vom Kaufmotiv zur Vertriebsstrategie`)}</title>
        <desc id={`${uid}-d`}>
          {tt(
            `Four buying motives, each with the strategy it calls for: trust, price, benefit and relationship. Select a row to read the proof the buyer needs.`,
            `Vier Kaufmotive, jeweils mit der Strategie, die sie verlangen: Vertrauen, Preis, Nutzen und Beziehung. Wählen Sie eine Zeile, um den Beleg zu lesen, den der Käufer braucht.`,
          )}
        </desc>
        <text x="4" y="14" fontSize="12" fontWeight="700" fill="#59606A">{tt("BUYING MOTIVE", "KAUFMOTIV")}</text>
        <text x="330" y="14" fontSize="12" fontWeight="700" fill="#59606A">{tt("STRATEGY IT CALLS FOR", "GEFORDERTE STRATEGIE")}</text>
        {MOTIVES.map((x, i) => {
          const y = 24 + i * 56;
          const on = x.id === sel;
          const pick = () => setSel(x.id);
          return (
            <g
              key={x.id}
              className="hit"
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${x.motive}: ${x.strategy}`}
              onClick={pick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick();
                }
              }}
            >
              <rect x="0" y={y} width="250" height="48" rx="8" fill={on ? "#FBF0D6" : "#FFFEFA"} stroke={on ? "#8A5A0B" : "#59606A"} strokeWidth={on ? 2.6 : 1.4} className="hit-shape" />
              <text x="14" y={y + 21} fontSize="16" fontWeight="700" fill="#1F2328">{x.motive}</text>
              <text x="14" y={y + 39} fontSize="12.5" fill="#59606A">{x.sub}</text>
              <line x1="256" x2="318" y1={y + 24} y2={y + 24} stroke="#59606A" strokeWidth="2" markerEnd={`url(#${uid}-ar)`} />
              <rect x="326" y={y} width="234" height="48" rx="8" fill={on ? "#DFEEEB" : "#ECE6D6"} stroke="#0F6B6B" strokeWidth={on ? 2.2 : 1} />
              <text x="340" y={y + 29} fontSize="15" fontWeight="600" fill="#1F2328">{x.strategy}</text>
            </g>
          );
        })}
        <defs>
          <marker id={`${uid}-ar`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#59606A" />
          </marker>
        </defs>
      </svg>
      <div aria-live="polite" className="space-y-2 rounded-lg border border-line bg-paper p-4 text-caption">
        <p className="smallcaps">
          {m.motive} → {m.strategy}
        </p>
        <p className="font-semibold text-ink">{tt("The proof this buyer looks for", "Der Beleg, den dieser Käufer sucht")}</p>
        <Bul items={[...m.proof]} />
        <p className="text-ash">
          <span className="font-semibold text-ink">{tt("German B2B IT context. ", "Kontext im deutschen B2B-IT-Umfeld. ")}</span>
          <Gloss>{m.german}</Gloss>
        </p>
      </div>
      <Insight>
        {tt(
          "Every motive keeps the same shape — a claim the buyer has to be able to check — but what counts as proof changes completely from row to row: trust needs an outside party to vouch (a reference, a pilot, a certificate); price needs the whole contract life made visible, not the headline number; benefit needs the buyer's own KPI, not the vendor's case study; relationship needs a named, stable person. A pitch built to prove one motive rarely helps with another.",
          "Jedes Motiv hat dieselbe Form — eine Behauptung, die der Käufer prüfen können muss —, aber was als Beleg zählt, ändert sich von Zeile zu Zeile völlig: Vertrauen braucht eine dritte Stelle, die bürgt (eine Referenz, ein Pilot, ein Zertifikat); Preis braucht die ganze Vertragslaufzeit sichtbar gemacht, nicht die Schlagzeilenzahl; Nutzen braucht die eigene KPI des Käufers, nicht die Fallstudie des Anbieters; Beziehung braucht eine benannte, beständige Person. Ein Pitch, der ein Motiv belegen soll, hilft bei einem anderen selten.",
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A2 */

const journey = () =>
  [
    {
      id: "aware",
      label: tt("Awareness", "Aufmerksamkeit"),
      phase: "pre",
      owner: tt("Marketing", "Marketing"),
      text: tt(
        "Search, an article, an event talk, a referral. The buyer researches without you: Gartner (2017) found buyers spend only about 17% of buying time meeting suppliers.",
        "Suche, ein Artikel, ein Vortrag auf einer Veranstaltung, eine Empfehlung. Der Käufer recherchiert ohne Sie: Gartner (2017) fand, dass Käufer nur etwa 17 % ihrer Kaufzeit mit Lieferanten verbringen.",
      ),
    },
    {
      id: "first",
      label: tt("First contact", "Erstkontakt"),
      phase: "pre",
      owner: tt("Marketing", "Marketing"),
      text: tt(
        "A contact-form message, a whitepaper download or a call-back request. A named person now exists, but no seller has a scheduled or held conversation with them yet.",
        "Eine Nachricht über das Kontaktformular, ein Whitepaper-Download oder eine Rückrufbitte. Es gibt jetzt eine namentlich bekannte Person, aber noch hat kein Verkäufer ein geplantes oder geführtes Gespräch mit ihr.",
      ),
    },
    {
      id: "consult",
      label: tt("Consultation", "Beratung"),
      phase: "sales",
      owner: tt("Sales", "Vertrieb"),
      text: tt(
        "A scheduled or held conversation between a seller and a named buyer contact: a discovery or scoping meeting. Booking it counts, because a seller now owns a name and a date.",
        "Ein geplantes oder geführtes Gespräch zwischen einem Verkäufer und einem namentlich bekannten Ansprechpartner des Käufers: ein Discovery- oder Scoping-Termin. Schon die Buchung zählt, denn ein Verkäufer hat jetzt einen Namen und einen Termin.",
      ),
    },
    {
      id: "proposal",
      label: tt("Proposal", "Angebot"),
      phase: "sales",
      owner: tt("Sales", "Vertrieb"),
      text: tt(
        "A written offer with scope, price and terms, sent to a buyer who has not decided yet.",
        "Ein schriftliches Angebot mit Umfang, Preis und Bedingungen, gesendet an einen Käufer, der noch nicht entschieden hat.",
      ),
    },
    {
      id: "nego",
      label: tt("Negotiation & contract", "Verhandlung & Vertrag"),
      phase: "sales",
      owner: tt("Sales + buyer procurement", "Vertrieb + Einkauf des Käufers"),
      text: tt(
        "Terms, price, the data-processing annex (AVV) and the security questionnaire. It ends at the signature.",
        "Bedingungen, Preis, die Anlage zur Datenverarbeitung (AVV) und der Sicherheitsfragebogen. Sie endet mit der Unterschrift.",
      ),
    },
    {
      id: "onboard",
      label: tt("Onboarding", "Onboarding"),
      phase: "after",
      owner: tt("Delivery", "Umsetzung (Delivery)"),
      text: tt("Kick-off, access, first delivery. It starts after the signature.", "Kick-off, Zugänge, erste Lieferung. Es beginnt nach der Unterschrift."),
    },
    {
      id: "support",
      label: tt("Support", "Support"),
      phase: "after",
      owner: tt("Support", "Support"),
      text: tt(
        "Tickets, the service level agreement (SLA), incident handling. This is where the promise made in sales is kept or broken.",
        "Tickets, das Service Level Agreement (SLA), Störungsbearbeitung. Hier wird das im Vertrieb gegebene Versprechen gehalten oder gebrochen.",
      ),
    },
    {
      id: "renew",
      label: tt("Renewal", "Verlängerung"),
      phase: "after",
      owner: tt("Account management", "Kundenbetreuung (Account Management)"),
      text: tt(
        "Renewal, extension or the next project. The repeat purchase happens here.",
        "Verlängerung, Erweiterung oder das nächste Projekt. Hier findet der Wiederkauf statt.",
      ),
    },
  ] as const;

const phaseStyle = () =>
  ({
    pre: { fill: "#ECE6D6", label: tt("PRE-SALES", "PRE-SALES") },
    sales: { fill: "#FBF0D6", label: tt("SALES", "VERTRIEB") },
    after: { fill: "#DFEEEB", label: tt("AFTER-SALES", "AFTER-SALES") },
  }) as const;

export function JourneyPhases() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<string>("first");
  const JOURNEY = journey();
  const PHASE_STYLE = phaseStyle();
  const t = JOURNEY.find((x) => x.id === sel)!;
  const ROW = 38;
  const TOP = 6;
  const bands = [
    { p: "pre", from: 0, to: 2 },
    { p: "sales", from: 2, to: 5 },
    { p: "after", from: 5, to: 8 },
  ] as const;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 330" className="mx-auto h-auto w-full max-w-[600px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt(`The customer journey in three phases`, `Die Customer Journey in drei Phasen`)}</title>
        <desc id={`${uid}-d`}>
          {tt(
            `Eight touchpoints in three phases. Pre-sales: awareness and first contact. Sales: consultation, proposal, negotiation and contract. After-sales: onboarding, support and renewal. A boundary sits between first contact and consultation, and another at the signature.`,
            `Acht Kontaktpunkte in drei Phasen. Pre-Sales: Aufmerksamkeit und Erstkontakt. Vertrieb: Beratung, Angebot, Verhandlung und Vertrag. After-Sales: Onboarding, Support und Verlängerung. Eine Grenze liegt zwischen Erstkontakt und Beratung, eine weitere bei der Unterschrift.`,
          )}
        </desc>
        {bands.map((b) => (
          <g key={b.p}>
            <rect x="0" y={TOP + b.from * ROW} width="128" height={(b.to - b.from) * ROW - 4} rx="6" fill={PHASE_STYLE[b.p].fill} stroke="#59606A" strokeWidth="1" />
            <text x="12" y={TOP + b.from * ROW + ((b.to - b.from) * ROW - 4) / 2 + 4} fontSize="13" fontWeight="700" fill="#1F2328">{PHASE_STYLE[b.p].label}</text>
          </g>
        ))}
        {JOURNEY.map((x, i) => {
          const y = TOP + i * ROW;
          const on = x.id === sel;
          const pick = () => setSel(x.id);
          return (
            <g
              key={x.id}
              className="hit"
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${x.label}, ${PHASE_STYLE[x.phase].label.toLowerCase()}`}
              onClick={pick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick();
                }
              }}
            >
              <rect x="140" y={y} width="220" height={ROW - 4} rx="7" fill={on ? "#FBF0D6" : "#FFFEFA"} stroke={on ? "#8A5A0B" : "#59606A"} strokeWidth={on ? 2.6 : 1.4} className="hit-shape" />
              <circle cx="160" cy={y + (ROW - 4) / 2} r="6" fill="#2F5D62" />
              <text x="176" y={y + (ROW - 4) / 2 + 5} fontSize="14.5" fontWeight="600" fill="#1F2328">{x.label}</text>
            </g>
          );
        })}
        {/* the two boundaries */}
        <line x1="0" x2="560" y1={TOP + 2 * ROW - 2} y2={TOP + 2 * ROW - 2} stroke="#A4472A" strokeWidth="1.8" strokeDasharray="6 4" />
        <line x1="0" x2="560" y1={TOP + 5 * ROW - 2} y2={TOP + 5 * ROW - 2} stroke="#A4472A" strokeWidth="1.8" strokeDasharray="6 4" />
        {[
          {
            y: TOP + 2 * ROW - 2,
            text: tt(
              "Sales starts here: a named buyer contact and a seller are in a scheduled or held conversation.",
              "Der Vertrieb beginnt hier: Ein namentlich bekannter Ansprechpartner und ein Verkäufer führen ein geplantes oder geführtes Gespräch.",
            ),
          },
          {
            y: TOP + 5 * ROW - 2,
            text: tt("Sales ends here: the signature. After-sales starts after it.", "Der Vertrieb endet hier: mit der Unterschrift. After-Sales beginnt danach."),
          },
        ].map((bd) => {
          const ls = wrap(bd.text, tt(28, 27));
          return ls.map((l, k) => (
            <text key={bd.y + "-" + k} x="372" y={bd.y - 8 - (ls.length - 1 - k) * 15} fontSize="12.5" fill="#A4472A">
              {l}
            </text>
          ));
        })}
      </svg>
      <div aria-live="polite" className="space-y-1 rounded-lg border border-line bg-paper p-4 text-caption">
        <p className="smallcaps">
          {PHASE_STYLE[t.phase].label} · {t.label} · {tt("usually owned by", "in der Regel verantwortet von")} {t.owner}
        </p>
        <p className="text-ink">
          <Gloss>{t.text}</Gloss>
        </p>
      </div>
      <Insight>
        {tt(
          "The two dashed lines don't track how engaged the buyer feels, they track two concrete tests: does a seller now own a named contact in a scheduled or held conversation, and has the contract been signed. First contact and consultation can look similar from outside — both involve the buyer reaching out — but only consultation puts a seller in a booked meeting, which is what moves a touchpoint from pre-sales into sales.",
          "Die beiden gestrichelten Linien messen nicht, wie engagiert der Käufer wirkt, sondern zwei konkrete Tests: Hat ein Verkäufer jetzt einen namentlich bekannten Ansprechpartner in einem geplanten oder geführten Gespräch, und ist der Vertrag unterzeichnet? Erstkontakt und Beratung können von außen ähnlich aussehen — in beiden meldet sich der Käufer —, aber nur die Beratung setzt einen Verkäufer in einen gebuchten Termin, und genau das hebt einen Kontaktpunkt von Pre-Sales in den Vertrieb.",
        )}
      </Insight>
    </div>
  );
}

/* A2 worked sort: a different company's stages, sorted with the tests the task uses. Read-only, Case assumption. */

const sortExample = (): { id: string; label: string; phase: Phase; why: string; insight: string }[] => [
  {
    id: "fair",
    label: tt("Trade-fair visitors", "Messebesucher"),
    phase: "pre",
    why: tt(
      "Anonymous traffic at a stand. Nobody has told a seller who they are, and no conversation is booked.",
      "Anonymer Traffic an einem Stand. Niemand hat einem Verkäufer gesagt, wer er ist, und kein Gespräch ist gebucht.",
    ),
    insight: tt(
      "Nobody has a name and a date yet, so neither part of the sales test is met.",
      "Es gibt noch keinen Namen und keinen Termin, also ist keiner der beiden Teile des Vertriebstests erfüllt.",
    ),
  },
  {
    id: "brochure",
    label: tt("Brochure download with an e-mail address", "Broschüren-Download mit E-Mail-Adresse"),
    phase: "pre",
    why: tt(
      "A named person now exists, but no seller has booked or held a conversation with them.",
      "Es gibt jetzt eine namentlich bekannte Person, aber kein Verkäufer hat ein Gespräch mit ihr gebucht oder geführt.",
    ),
    insight: tt(
      "A name alone is not enough: the sales test also needs a booked or held conversation. Compare it with “Workshop date fixed”, where a date exists.",
      "Ein Name allein genügt nicht: Der Vertriebstest verlangt auch ein gebuchtes oder geführtes Gespräch. Vergleichen Sie es mit „Workshop-Termin vereinbart“, wo ein Termin existiert.",
    ),
  },
  {
    id: "datefixed",
    label: tt("Workshop date fixed with a named contact", "Workshop-Termin mit namentlich bekanntem Ansprechpartner vereinbart"),
    phase: "sales",
    why: tt(
      "A name and a date are now in a seller's plan. The sales test is met even though the workshop has not happened yet.",
      "Ein Name und ein Termin stehen jetzt in der Planung eines Verkäufers. Der Vertriebstest ist erfüllt, auch wenn der Workshop noch nicht stattgefunden hat.",
    ),
    insight: tt(
      "This is the boundary case. What moved it from pre-sales is the date in a seller's plan, not how interested the buyer feels.",
      "Das ist der Grenzfall. Was ihn aus Pre-Sales herausgehoben hat, ist der Termin in der Planung eines Verkäufers, nicht wie interessiert der Käufer wirkt.",
    ),
  },
  {
    id: "held",
    label: tt("Workshop held", "Workshop durchgeführt"),
    phase: "sales",
    why: tt(
      "The seller and the named contact have actually met, and no offer has been made yet.",
      "Verkäufer und namentlich bekannter Ansprechpartner haben sich tatsächlich getroffen, und noch wurde kein Angebot gemacht.",
    ),
    insight: tt("Still sales: a conversation is held and the contract is not signed.", "Weiterhin Vertrieb: Ein Gespräch ist geführt und der Vertrag nicht unterzeichnet."),
  },
  {
    id: "quote",
    label: tt("Quote in negotiation", "Angebot in Verhandlung"),
    phase: "sales",
    why: tt("The buyer is deciding. The contract is not signed.", "Der Käufer entscheidet noch. Der Vertrag ist nicht unterzeichnet."),
    insight: tt(
      "The buyer's conversation with a seller continues, and the signature has not happened. Both parts of the sales test hold.",
      "Das Gespräch des Käufers mit einem Verkäufer läuft weiter, und die Unterschrift ist nicht erfolgt. Beide Teile des Vertriebstests gelten.",
    ),
  },
  {
    id: "signed",
    label: tt("Order signed", "Auftrag unterzeichnet"),
    phase: "sales",
    why: tt(
      "The signature is the last sales event. Sales ends here; it does not open after-sales.",
      "Die Unterschrift ist das letzte Vertriebsereignis. Der Vertrieb endet hier; er eröffnet nicht den After-Sales.",
    ),
    insight: tt(
      "The boundary sits after the signature, so the signature itself belongs to sales. Only what follows it is after-sales.",
      "Die Grenze liegt nach der Unterschrift, also gehört die Unterschrift selbst zum Vertrieb. Erst was danach kommt, ist After-Sales.",
    ),
  },
  {
    id: "kickoff",
    label: tt("Onboarding kick-off", "Onboarding-Kick-off"),
    phase: "after",
    why: tt(
      "The signature has already happened. Getting the client started is delivery, which is after-sales.",
      "Die Unterschrift ist bereits geschehen. Den Kunden an den Start zu bringen ist Umsetzung, also After-Sales.",
    ),
    insight: tt(
      "The only after-sales test is “does it come after the signature?”. Here the answer is yes.",
      "Der einzige After-Sales-Test lautet: „Kommt es nach der Unterschrift?“ Hier lautet die Antwort ja.",
    ),
  },
];

export function SortExample() {
  const [sel, setSel] = useState<string>("datefixed");
  const SORT_EXAMPLE = sortExample();
  const item = SORT_EXAMPLE.find((x) => x.id === sel)!;
  const test = PHASE_TESTS.find((t) => t.phase === item.phase)!;
  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-3">
        {PHASE_TESTS.map((ph) => (
          <div key={ph.phase} className="space-y-1.5 rounded-lg border border-line bg-paper p-2.5">
            <p className="smallcaps">{ph.name}</p>
            {SORT_EXAMPLE.filter((x) => x.phase === ph.phase).map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={sel === x.id}
                onClick={() => setSel(x.id)}
                className={
                  "min-h-[40px] w-full rounded-md border px-2.5 py-1.5 text-left text-caption font-semibold transition-colors " +
                  (sel === x.id ? "border-accent bg-accentSoft text-ink" : "border-line bg-canvas text-ash hover:border-ash")
                }
              >
                {x.label}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div aria-live="polite" className="space-y-1 rounded-lg border border-line bg-paper p-4 text-caption">
        <p className="smallcaps">
          Alpenwerk · {item.label} → {test.name}
        </p>
        <p className="text-ink">
          <span className="font-semibold">{tt("Why it sits here. ", "Warum es hier liegt. ")}</span>
          <Gloss>{item.why}</Gloss>
        </p>
        <p className="text-ink">
          <span className="font-semibold">{tt("The test that decides it. ", "Der entscheidende Test. ")}</span>
          <Gloss>{test.test}</Gloss>
        </p>
      </div>
      <Insight>{item.insight}</Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A4 */

const EX = [
  { label: () => tt("Visitors → Leads", "Besucher → Leads"), from: 10000, to: 300, ref: 2.5 },
  { label: () => tt("Leads → Consultation", "Leads → Beratung"), from: 300, to: 60, ref: 25 },
];

export function KpiLadder() {
  const uid = useId().replace(/:/g, "");
  const f = (n: number) => num(n);
  const pct = (n: number) => `${d1(n)}${tt("%", " %")}`;
  return (
    <svg viewBox="0 0 560 160" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
      <title id={`${uid}-t`}>{tt(`Worked example: from two counts to a gap in percentage points`, `Rechenbeispiel: von zwei Zahlen zu einer Abweichung in Prozentpunkten`)}</title>
      <desc id={`${uid}-d`}>
        {tt(
          `Alpenwerk GmbH, illustrative. Visitors to leads: 300 divided by 10,000 is 3.0 percent against a reference of 2.5 percent, a gap of plus 0.5 percentage points. Leads to consultation held: 60 divided by 300 is 20.0 percent against 25 percent, a gap of minus 5.0 percentage points.`,
          `Alpenwerk GmbH, zur Veranschaulichung. Besucher zu Leads: 300 geteilt durch 10.000 sind 3,0 Prozent gegenüber einem Referenzwert von 2,5 Prozent, eine Abweichung von plus 0,5 Prozentpunkten. Leads zu geführter Beratung: 60 geteilt durch 300 sind 20,0 Prozent gegenüber 25 Prozent, eine Abweichung von minus 5,0 Prozentpunkten.`,
        )}
      </desc>
      <defs>
        <pattern id={`${uid}-h`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="7" height="7" fill="#ECE6D6" />
          <line x1="0" y1="0" x2="0" y2="7" stroke="#59606A" strokeWidth="2.4" />
        </pattern>
      </defs>
      {tt(["Step", "Two counts", "Actual", "Ref", "Gap = actual − ref"], ["Schritt", "Zwei Zahlen", "Ist", "Ref", "Abweichung = Ist − Ref"]).map((h, i) => (
        <text key={h} x={[4, 190, 316, 380, 440][i]} y="16" fontSize="12" fontWeight="700" fill="#59606A">{h.toUpperCase()}</text>
      ))}
      {EX.map((e, i) => {
        const actual = Math.round((e.to / e.from) * 1000) / 10;
        const gap = Math.round((actual - e.ref) * 10) / 10;
        const y = 34 + i * 70;
        return (
          <g key={e.from + "-" + e.to}>
            <line x1="0" x2="560" y1={y - 8} y2={y - 8} stroke="#D8D1BF" />
            <text x="4" y={y + 18} fontSize="14" fontWeight="600" fill="#1F2328">{e.label()}</text>
            <text x="190" y={y + 18} fontSize="14" fill="#1F2328">{`${f(e.to)} ÷ ${f(e.from)}`}</text>
            <text x="316" y={y + 18} fontSize="15" fontWeight="700" fill="#1F2328">{pct(actual)}</text>
            <text x="380" y={y + 18} fontSize="14" fill="#59606A">{pct(e.ref)}</text>
            <rect x="440" y={y + 4} width={Math.abs(gap) * 12 + 2} height="18" rx="2" fill={`url(#${uid}-h)`} stroke="#59606A" strokeWidth="1.2" />
            <text x={440 + Math.abs(gap) * 12 + 8} y={y + 18} fontSize="13.5" fontWeight="600" fill="#1F2328">{`${gap > 0 ? "+" : "−"}${d1(Math.abs(gap))}${tt(" pp", " PP")}`}</text>
            <text x="4" y={y + 38} fontSize="12" fill="#59606A">{tt(`Divide this stage by the stage above it, never by visitors.`, `Diese Stufe durch die Stufe darüber teilen, nie durch die Besucher.`)}</text>
          </g>
        );
      })}
    </svg>
  );
}
