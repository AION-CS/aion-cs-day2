"use client";

import { useId, useState } from "react";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { Bul, Diagram, Insight } from "@/components/materi/kit";
import { PHASE_PAIR_TESTS, PHASE_TESTS } from "@/data/touchpoints";
import type { Phase } from "@/data/funnel";
import { Gloss } from "@/lib/glossify";
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

export function MotiveLadder() {
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

export function JourneyPhases() {
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

/* A2 worked sort: a different company's stages, sorted with the tests the task uses. Read-only, Case assumption. */

const SORT_EXAMPLE: { id: string; label: string; phase: Phase; why: string; insight: string }[] = [
  {
    id: "fair",
    label: "Trade-fair visitors",
    phase: "pre",
    why: "Anonymous traffic at a stand. Nobody has told a seller who they are, and no conversation is booked.",
    insight: "Nobody has a name and a date yet, so neither part of the sales test is met.",
  },
  {
    id: "brochure",
    label: "Brochure download with an e-mail address",
    phase: "pre",
    why: "A named person now exists, but no seller has booked or held a conversation with them.",
    insight: "A name alone is not enough: the sales test also needs a booked or held conversation. Compare it with “Workshop date fixed”, where a date exists.",
  },
  {
    id: "datefixed",
    label: "Workshop date fixed with a named contact",
    phase: "sales",
    why: "A name and a date are now in a seller's plan. The sales test is met even though the workshop has not happened yet.",
    insight: "This is the boundary case. What moved it from pre-sales is the date in a seller's plan, not how interested the buyer feels.",
  },
  {
    id: "held",
    label: "Workshop held",
    phase: "sales",
    why: "The seller and the named contact have actually met, and no offer has been made yet.",
    insight: "Still sales: a conversation is held and the contract is not signed.",
  },
  {
    id: "quote",
    label: "Quote in negotiation",
    phase: "sales",
    why: "The buyer is deciding. The contract is not signed.",
    insight: "The buyer's conversation with a seller continues, and the signature has not happened. Both parts of the sales test hold.",
  },
  {
    id: "signed",
    label: "Order signed",
    phase: "sales",
    why: "The signature is the last sales event. Sales ends here; it does not open after-sales.",
    insight: "The boundary sits after the signature, so the signature itself belongs to sales. Only what follows it is after-sales.",
  },
  {
    id: "kickoff",
    label: "Onboarding kick-off",
    phase: "after",
    why: "The signature has already happened. Getting the client started is delivery, which is after-sales.",
    insight: "The only after-sales test is \u201Cdoes it come after the signature?\u201D. Here the answer is yes.",
  },
];

export function SortExample() {
  const [sel, setSel] = useState<string>("datefixed");
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
          <span className="font-semibold">Why it sits here. </span>
          <Gloss>{item.why}</Gloss>
        </p>
        <p className="text-ink">
          <span className="font-semibold">The test that decides it. </span>
          <Gloss>{test.test}</Gloss>
        </p>
      </div>
      <Insight>{item.insight}</Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A4 */

const EX = [
  { label: "Visitors → Leads", from: 10000, to: 300, ref: 2.5 },
  { label: "Leads → Consultation", from: 300, to: 60, ref: 25 },
];

export function KpiLadder() {
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

