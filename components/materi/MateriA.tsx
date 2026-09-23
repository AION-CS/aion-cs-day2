"use client";

import { useId, useState } from "react";
import { Callout, MaterialCard } from "@/components/ui/MaterialCard";
import { Bul, Diagram, Insight } from "@/components/materi/kit";
import { wrap } from "@/lib/svg";

/* ------------------------------------------------------------------ A1 */

const MOTIVES = [
  {
    id: "trust",
    motive: "Trust",
    sub: "risk aversion · security",
    strategy: "Reduce the buyer’s risk",
    proof: [
      "Reference customers (Referenzkunden) in the same sector and size",
      "A paid pilot phase (proof of concept) before the full contract",
      "Compliance proof: an ISO/IEC 27001 certificate, a BSI C5 attestation for cloud services, a GDPR Art. 28 data-processing agreement (Auftragsverarbeitungsvertrag, AVV)",
    ],
    german:
      "In a Mittelstand (mid-sized company) buying committee the IT security officer and the data protection officer can each stop the deal, so the proof has to be on the table before they ask.",
  },
  {
    id: "price",
    motive: "Price",
    sub: "total cost of ownership",
    strategy: "Make the total cost visible",
    proof: [
      "A cost comparison over the whole contract life, not only the licence or day-rate line",
      "Fixed-price phases with a written change-request rule",
      "Run costs, exit costs and add-ons named in the offer",
    ],
    german:
      "An Ausschreibung (formal tender) usually scores price on the offer as written, so a cost that appears only after signature is caught at evaluation or resented at the first invoice.",
  },
  {
    id: "benefit",
    motive: "Benefit",
    sub: "perceived value",
    strategy: "Prove the outcome",
    proof: [
      "A value case built from the buyer’s own figures, not the vendor’s brochure",
      "One KPI with a baseline and a target",
      "A review date at which the result is measured against the target",
    ],
    german:
      "A Fachabteilung (business department) that owns the budget decides on the outcome it must report upward, so the offer has to speak in that department’s KPI.",
  },
  {
    id: "relationship",
    motive: "Relationship",
    sub: "continuity of people",
    strategy: "Keep the people constant",
    proof: [
      "A named account owner who stays through the project and after it",
      "A fixed review rhythm, for example a quarterly business review",
      "A known escalation path with a name at the end of it",
    ],
    german:
      "When the buyer’s contact changes twice in a year, the relationship restarts. Switching a long-standing IT partner is felt as a personal risk, and continuity is what makes it feel larger than the saving.",
  },
] as const;

function MotiveLadder() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<string>("trust");
  const m = MOTIVES.find((x) => x.id === sel)!;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 250" className="mx-auto h-auto w-full max-w-[600px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`From buying motive to sales strategy`}</title>
        <desc id={`${uid}-d`}>{`Four buying motives, each with the strategy it calls for: trust, price, benefit and relationship. Select a row to read the proof the buyer needs.`}</desc>
        <text x="4" y="14" fontSize="12" fontWeight="700" fill="#59606A">BUYING MOTIVE</text>
        <text x="330" y="14" fontSize="12" fontWeight="700" fill="#59606A">STRATEGY IT CALLS FOR</text>
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
        <p className="font-semibold text-ink">The proof this buyer looks for</p>
        <Bul items={[...m.proof]} />
        <p className="text-ash">
          <span className="font-semibold text-ink">German B2B IT context. </span>
          {m.german}
        </p>
      </div>
      <Insight>
        Every motive keeps the same shape — a claim the buyer has to be able to check — but what counts as proof changes completely from row to row: trust needs an outside party to vouch (a reference, a pilot, a certificate); price needs the whole contract life made visible, not the headline number; benefit needs the buyer&apos;s own KPI, not the vendor&apos;s case study; relationship needs a named, stable person. A pitch built to prove one motive rarely helps with another.
      </Insight>
    </div>
  );
}

export function CardA1() {
  return (
    <MaterialCard
      id="A1"
      scan="Choose the sales action from the buyer’s motive, not from your product’s feature list."
      sources={["bauer1960", "morgan1994", "anderson2006", "iso27001", "bsic5", "gdpr"]}
      reasoning={[
        "Name the motive first (trust, price, benefit or relationship), then choose the action and the proof. If you cannot say which motive an action serves, it is a feature pitch.",
        "Match the action to the motive: trust → references, a pilot and compliance proof; price → the total cost made visible; benefit → a value case in the buyer’s own figures; relationship → named, stable contacts and a review rhythm.",
        "An action aimed at a different motive spends effort without touching the reason. A discount answers the price motive only; offered against a trust or relationship motive it gives margin away and leaves the reason in place.",
        "A motive is inferred from evidence, and one observation is not evidence of a motive. State what you saw before you name what it means.",
      ]}
    >
      <Diagram label="Motive → strategy" caption="Select a motive to read the proof that buyer needs. The four motives are the ones used on Day 1.">
        <MotiveLadder />
      </Diagram>
      <Bul
        items={[
          <><strong>What it is.</strong> A behaviour-based sales strategy starts from why this buyer would act, the buying <em>motive</em>, and derives the sales action and the proof from it. A feature-led pitch starts from what the product does and hopes the motive matches.</>,
          <><strong>Why it matters in long-cycle IT procurement.</strong> The buyer carries the risk of a wrong choice personally: Bauer (1960) called this perceived risk. Where risk aversion is the motive, the strategy is to build trust: references, a pilot phase and compliance proof, exactly the things a security-minded committee can check.</>,
          <><strong>Trust is built, not asserted.</strong> Morgan &amp; Hunt (1994) found that trust and commitment together carry a business relationship forward. Anderson, Narus &amp; van Rossum (2006) add the value side: a customer value proposition states the points of difference the buyer will actually get.</>,
          <><strong>Boundary.</strong> The four motives can sit in the same committee at once, in different people. The strategy for one buyer is chosen by the motive the evidence shows, not by the one you would prefer.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A2 */

const JOURNEY = [
  { id: "aware", label: "Awareness", phase: "pre", owner: "Marketing", text: "Search, an article, an event talk, a referral. The buyer researches without you: Gartner (2017) found buyers spend only about 17% of buying time meeting suppliers." },
  { id: "first", label: "First contact", phase: "pre", owner: "Marketing", text: "A contact-form message, a whitepaper download or a call-back request. A named person now exists, but no seller has a scheduled or held conversation with them yet." },
  { id: "consult", label: "Consultation", phase: "sales", owner: "Sales", text: "A scheduled or held conversation between a seller and a named buyer contact: a discovery or scoping meeting. Booking it counts, because a seller now owns a name and a date." },
  { id: "proposal", label: "Proposal", phase: "sales", owner: "Sales", text: "A written offer with scope, price and terms, sent to a buyer who has not decided yet." },
  { id: "nego", label: "Negotiation & contract", phase: "sales", owner: "Sales + buyer procurement", text: "Terms, price, the data-processing annex (AVV) and the security questionnaire. It ends at the signature." },
  { id: "onboard", label: "Onboarding", phase: "after", owner: "Delivery", text: "Kick-off, access, first delivery. It starts after the signature." },
  { id: "support", label: "Support", phase: "after", owner: "Support", text: "Tickets, the service level agreement (SLA), incident handling. This is where the promise made in sales is kept or broken." },
  { id: "renew", label: "Renewal", phase: "after", owner: "Account management", text: "Renewal, extension or the next project. The repeat purchase happens here." },
] as const;

const PHASE_STYLE = {
  pre: { fill: "#ECE6D6", label: "PRE-SALES" },
  sales: { fill: "#FBF0D6", label: "SALES" },
  after: { fill: "#DFEEEB", label: "AFTER-SALES" },
} as const;

function JourneyPhases() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<string>("first");
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
        <title id={`${uid}-t`}>{`The customer journey in three phases`}</title>
        <desc id={`${uid}-d`}>{`Eight touchpoints in three phases. Pre-sales: awareness and first contact. Sales: consultation, proposal, negotiation and contract. After-sales: onboarding, support and renewal. A boundary sits between first contact and consultation, and another at the signature.`}</desc>
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
          { y: TOP + 2 * ROW - 2, text: "Sales starts here: a named buyer contact and a seller are in a scheduled or held conversation." },
          { y: TOP + 5 * ROW - 2, text: "Sales ends here: the signature. After-sales starts after it." },
        ].map((bd) => {
          const ls = wrap(bd.text, 28);
          return ls.map((l, k) => (
            <text key={bd.y + "-" + k} x="372" y={bd.y - 8 - (ls.length - 1 - k) * 15} fontSize="12.5" fill="#A4472A">
              {l}
            </text>
          ));
        })}
      </svg>
      <div aria-live="polite" className="space-y-1 rounded-lg border border-line bg-paper p-4 text-caption">
        <p className="smallcaps">
          {PHASE_STYLE[t.phase].label} · {t.label} · usually owned by {t.owner}
        </p>
        <p className="text-ink">{t.text}</p>
      </div>
      <Insight>
        The two dashed lines don&apos;t track how engaged the buyer feels, they track two concrete tests: does a seller now own a named contact in a scheduled or held conversation, and has the contract been signed. First contact and consultation can look similar from outside — both involve the buyer reaching out — but only consultation puts a seller in a booked meeting, which is what moves a touchpoint from pre-sales into sales.
      </Insight>
    </div>
  );
}

export function CardA2() {
  return (
    <MaterialCard
      id="A2"
      scan="A journey is an ordered list of touchpoints. Sorting a stage into the right phase tells you who owns it and what measures it."
      sources={["lemon2016", "gartner2017"]}
      reasoning={[
        "To sort a stage, ask two questions. (1) By this point, are a named buyer contact and a seller in a scheduled or held conversation? (2) Does this event come after the signature? No to both → pre-sales. Yes to the first only → sales, up to and including the signature itself. Anything after the signature → after-sales.",
        "A booked consultation is sales: a seller now owns a named contact and a date. This is the convention the task uses, so apply it to every stage alike.",
        "Contact details or a download are first contact but still pre-sales: nobody has spoken to the person yet.",
        "The signature is the last sales event, not the first after-sales one. Onboarding, support and renewal are after-sales, and they come after it.",
        "A phase can be empty in a funnel. A funnel counts people up to the signature, so after-sales never appears as a stage; it shows in other numbers, such as the repeat-purchase rate.",
      ]}
    >
      <Diagram label="Customer journey map" caption="Eight touchpoints, three phases and the two boundaries used in this course. Select a touchpoint to read what it covers.">
        <JourneyPhases />
      </Diagram>
      <Bul
        items={[
          <><strong>The framework.</strong> Customer journey mapping (also touchpoint mapping): list every point where buyer and vendor meet, in order, and group them by phase (Lemon &amp; Verhoef, 2016). It is standard practice in CX and B2B sales work, and it is what lets a funnel be read stage by stage.</>,
          <><strong>Pre-sales.</strong> Awareness and first contact. The buyer is researching, mostly without you: Gartner (2017) found buyers spend about 17% of buying time meeting suppliers, and the rest on independent research and internal alignment.</>,
          <><strong>Sales.</strong> Consultation, proposal, negotiation and contract, up to the signature. A German committee often runs several rounds, and the security and data-protection questionnaires sit inside this phase.</>,
          <><strong>After-sales.</strong> Onboarding, support and renewal. In project business this is the stretch most vendors do not staff, and it is where the next purchase is decided.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A3 */

const MECH = ["Trust", "Relevance", "Consistency"] as const;
const PHASES3 = ["Pre-sales", "Sales", "After-sales"] as const;
const CELLS: { key: string; text: string }[][] = [
  [
    { key: "Named references on the site", text: "Case studies from named Mittelstand clients and visible certifications (ISO/IEC 27001) let a buyer check the vendor before anyone talks to them." },
    { key: "A pilot before the contract", text: "A reference call and a paid pilot phase let a committee test the vendor’s ability at low cost; the security officer sees the certificate and the AVV draft." },
    { key: "Incidents handled as promised", text: "An incident is answered inside the agreed response time and explained honestly. This is where ability, benevolence and integrity are seen in use." },
  ],
  [
    { key: "Content by role and sector", text: "A page for the CIO and a page for the plant manager. Relevance here comes from content and from what the visitor chooses to say, not from a tracked profile (see the constraint below)." },
    { key: "An offer built on their process", text: "The proposal restates the buyer’s own problem and figures, and the consultation asks before it pitches." },
    { key: "Reviews report their KPIs", text: "Onboarding and business reviews report the KPI the buyer signed up for, not the vendor’s activity." },
  ],
  [
    { key: "Site = first call", text: "The promise on the website is the promise the seller repeats on the first call. A gap here is noticed by a committee that compares notes." },
    { key: "Same people, same price", text: "The people who consulted are the people who propose; the price in the offer is the price in the contract." },
    { key: "SLA delivered as offered", text: "The account owner at renewal is the one from onboarding, and the service level is delivered as sold. Aligned processes and integrations also raise the switching cost (Burnham et al., 2003)." },
  ],
];

const CONSTRAINT = [
  "Ability, benevolence and integrity (Mayer, Davis & Schoorman, 1995) are what a buying committee tests. In a procurement with six to ten people (Gartner, 2017), the most cautious one sets the pace.",
  "Personalisation at the website is limited. Non-essential cookies and tracking need prior consent (GDPR Art. 6(1)(a) and Art. 7; § 25 TDDDG; EDPB Guidelines 05/2020). Cold e-mail to a business contact needs consent as well (§ 7 UWG). Relevance therefore comes from content by role and sector, and from context the visitor volunteers.",
  "Consistency is a promise-and-delivery test over time (Cialdini, 2021). A promise made in pre-sales and not kept in sales resets trust for the whole committee, and long procurement cycles mean the committee remembers.",
];

function MechanismGrid() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<[number, number]>([0, 1]);
  const c = CELLS[sel[0]][sel[1]];
  const X0 = 112;
  const CW = 148;
  const RH = 62;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 222" className="mx-auto h-auto w-full max-w-[600px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`Three mechanisms across three journey phases`}</title>
        <desc id={`${uid}-d`}>{`A grid of trust, relevance and consistency against pre-sales, sales and after-sales. Each cell names one concrete German B2B IT example. Select a cell to read it.`}</desc>
        {PHASES3.map((p, j) => (
          <text key={p} x={X0 + j * CW + CW / 2 - 2} y="18" textAnchor="middle" fontSize="13" fontWeight="700" fill="#59606A">{p.toUpperCase()}</text>
        ))}
        {MECH.map((m, i) => (
          <g key={m}>
            <text x="4" y={34 + i * RH + RH / 2 + 2} fontSize="15" fontWeight="700" fill="#1F2328">{m}</text>
            {CELLS[i].map((cell, j) => {
              const on = sel[0] === i && sel[1] === j;
              const pick = () => setSel([i, j]);
              const lines = wrap(cell.key, 17);
              return (
                <g
                  key={j}
                  className="hit"
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={`${m}, ${PHASES3[j]}: ${cell.key}`}
                  onClick={pick}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      pick();
                    }
                  }}
                >
                  <rect x={X0 + j * CW} y={28 + i * RH} width={CW - 6} height={RH - 8} rx="8" fill={on ? "#FBF0D6" : "#FFFEFA"} stroke={on ? "#8A5A0B" : "#59606A"} strokeWidth={on ? 2.6 : 1.4} className="hit-shape" />
                  {lines.map((l, k) => (
                    <text key={k} x={X0 + j * CW + 10} y={28 + i * RH + 24 + k * 15 - (lines.length - 1) * 4} fontSize="12.5" fill="#1F2328">{l}</text>
                  ))}
                </g>
              );
            })}
          </g>
        ))}
      </svg>
      <div aria-live="polite" className="space-y-1 rounded-lg border border-line bg-paper p-4 text-caption">
        <p className="smallcaps">
          {MECH[sel[0]]} · {PHASES3[sel[1]]}
        </p>
        <p className="text-ink">{c.text}</p>
      </div>
      <Insight>
        The same three mechanisms recur in every phase, but what proves each one changes with where the buyer stands: pre-sales trust rests on public evidence (references, a certificate) because no one has met yet, while after-sales trust rests on an incident actually being handled as promised. Read a row across, not just a cell alone — a mechanism that looked satisfied in one phase can still be undone in the next.
      </Insight>
    </div>
  );
}

export function CardA3() {
  return (
    <MaterialCard
      id="A3"
      scan="At each touchpoint one mechanism does most of the work, and in German B2B IT each one meets a hard local constraint."
      sources={["mayer1995", "morgan1994", "gartner2017", "burnham2003", "cialdini2021", "gdpr", "tdddg25", "edpb2020", "uwg7"]}
      reasoning={[
        "Let the touchpoint’s job pick the mechanism. Doubt about the vendor → trust. “Is this for us?” → relevance. “Will it be the same later?” → consistency.",
        "Relevance at the website is not tracking. In Germany it rests on content by role and sector and on what the visitor volunteers; a hidden behavioural profile needs consent and is the wrong tool here.",
        "A mechanism can be undone at the next touchpoint: consistency is broken by a promise that the next phase does not keep. Read a leak in a journey as a possible break between two touchpoints, not only as a weakness in one.",
      ]}
    >
      <Diagram label="Mechanisms × phases" caption="Nine concrete examples. Select a cell to read it.">
        <MechanismGrid />
      </Diagram>
      <Bul
        items={[
          <><strong>Trust</strong> is the buyer’s willingness to rely on the vendor. Morgan &amp; Hunt (1994) tie trust and commitment to keeping a relationship. {CONSTRAINT[0]}</>,
          <><strong>Relevance</strong> is the buyer’s sense that the message is about their problem. {CONSTRAINT[1]}</>,
          <><strong>Consistency</strong> is the match between what was promised and what happens next. {CONSTRAINT[2]}</>,
        ]}
      />
      <Callout label="German constraint to remember" tone="rust">
        <p>Do not answer a relevance problem with more tracking. Ask what consent you hold, and use content, context the visitor chose, or a direct conversation instead.</p>
      </Callout>
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A4 */

const EX = [
  { label: "Visitors → Leads", from: 10000, to: 300, ref: 2.5 },
  { label: "Leads → Consultation", from: 300, to: 60, ref: 25 },
];

function KpiLadder() {
  const uid = useId().replace(/:/g, "");
  const f = (n: number) => n.toLocaleString("en-US");
  return (
    <svg viewBox="0 0 560 160" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
      <title id={`${uid}-t`}>{`Worked example: from two counts to a gap in percentage points`}</title>
      <desc id={`${uid}-d`}>{`Alpenwerk GmbH, illustrative. Visitors to leads: 300 divided by 10,000 is 3.0 percent against a reference of 2.5 percent, a gap of plus 0.5 percentage points. Leads to consultation held: 60 divided by 300 is 20.0 percent against 25 percent, a gap of minus 5.0 percentage points.`}</desc>
      <defs>
        <pattern id={`${uid}-h`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="7" height="7" fill="#ECE6D6" />
          <line x1="0" y1="0" x2="0" y2="7" stroke="#59606A" strokeWidth="2.4" />
        </pattern>
      </defs>
      {["Step", "Two counts", "Actual", "Ref", "Gap = actual − ref"].map((h, i) => (
        <text key={h} x={[4, 190, 316, 380, 440][i]} y="16" fontSize="12" fontWeight="700" fill="#59606A">{h.toUpperCase()}</text>
      ))}
      {EX.map((e, i) => {
        const actual = Math.round((e.to / e.from) * 1000) / 10;
        const gap = Math.round((actual - e.ref) * 10) / 10;
        const y = 34 + i * 70;
        return (
          <g key={e.label}>
            <line x1="0" x2="560" y1={y - 8} y2={y - 8} stroke="#D8D1BF" />
            <text x="4" y={y + 18} fontSize="14" fontWeight="600" fill="#1F2328">{e.label}</text>
            <text x="190" y={y + 18} fontSize="14" fill="#1F2328">{`${f(e.to)} ÷ ${f(e.from)}`}</text>
            <text x="316" y={y + 18} fontSize="15" fontWeight="700" fill="#1F2328">{`${actual.toFixed(1)}%`}</text>
            <text x="380" y={y + 18} fontSize="14" fill="#59606A">{`${e.ref.toFixed(1)}%`}</text>
            <rect x="440" y={y + 4} width={Math.abs(gap) * 12 + 2} height="18" rx="2" fill={`url(#${uid}-h)`} stroke="#59606A" strokeWidth="1.2" />
            <text x={440 + Math.abs(gap) * 12 + 8} y={y + 18} fontSize="13.5" fontWeight="600" fill="#1F2328">{`${gap > 0 ? "+" : "−"}${Math.abs(gap).toFixed(1)} pp`}</text>
            <text x="4" y={y + 38} fontSize="12" fill="#59606A">{`Divide this stage by the stage above it, never by visitors.`}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function CardA4() {
  return (
    <MaterialCard
      id="A4"
      scan="Conversion rate, customer value and repurchase rate are the three numbers the two tasks use. Read them the same way each time."
      sources={["gupta2003", "reichheld1990"]}
      reasoning={[
        "Compute each step from its own two counts: this stage ÷ the stage above it × 100. Never divide by the top of the funnel.",
        "Counts fall at every stage by design. The step that loses the most people is not the step with the largest gap: rank the steps by the gap to their benchmark, in percentage points, and take the most negative.",
        "A gap is actual minus benchmark, in percentage points (pp), with its sign. 42.7% against 75% is −32.3 pp, not −43%; a relative percentage answers a different question.",
        "State the cost of a leak as a number you can trace: prospects lost × the funnel’s own downstream conversion (× the contract value if the case gives one). Do not import a figure the case never printed.",
        "A benchmark is a comparison point, not a verdict. A gap tells you where to ask “why here?”; it does not tell you the cause.",
      ]}
    >
      <Diagram label="Worked example · Alpenwerk GmbH (illustrative, read-only)" caption="Case assumption. Two steps of a different company, computed the way Task 1 asks you to read DigitalIT Solutions.">
        <KpiLadder />
      </Diagram>
      <div className="grid gap-3 md:grid-cols-3">
        <Callout label="Conversion rate · gap">
          <p>Conversion = count at this stage ÷ count at the stage above × 100. Gap = actual % − benchmark %, in <strong>percentage points</strong>.</p>
        </Callout>
        <Callout label="Customer value (CLV)">
          <p>
            The gross profit one client is expected to bring over the whole relationship. Simple form: annual gross profit per client × expected years, with expected years ≈ 1 ÷ (1 − retention). At €12,000 a year and 80% retention that is 5 years and €60,000; at 90% it is 10 years and €120,000 (undiscounted; Gupta &amp; Lehmann, 2003, give the discounted form).
          </p>
        </Callout>
        <Callout label="Repurchase rate">
          <p>Existing clients who re-order within a stated window ÷ existing clients. 12 of 40 clients re-ordering within 18 months is 30.0%. The window is part of the definition: state it.</p>
        </Callout>
      </div>
      <Bul
        items={[
          <><strong>Why retention gets its own number.</strong> Reichheld &amp; Sasser (1990) found that cutting defections by 5% raised profits by 25% to 85% across the service industries they studied. A funnel shows how a company wins clients; the repurchase rate shows whether it keeps them.</>,
          <><strong>Cost of a leak, worked (Alpenwerk, Case assumption).</strong> 60 consultations booked, 45 held: 15 prospects fall out. Of every 45 held, 6 sign (13.3%), so the 15 would have brought about 15 × 6 ÷ 45 = <strong>2.0 contracts</strong>. At €50,000 a contract that is about €100,000 of revenue a year.</>,
          <><strong>Boundary.</strong> That figure assumes the lost prospects would have behaved like the ones who were held. It is an estimate to size a leak, not a forecast.</>,
        ]}
      />
    </MaterialCard>
  );
}
