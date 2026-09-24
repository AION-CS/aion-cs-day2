"use client";

import { useId, useState } from "react";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { Bul, Diagram, Insight } from "@/components/materi/kit";
import { GOV_TESTS, OWNERS, OWNER_PROFILE } from "@/data/program";

const eur = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;

/* ------------------------------------------------------------------ C1 */

const CHAINS = [
  {
    id: "repeat",
    goal: "Raise repeat purchase from 30% to 35% in 18 months",
    action: "A value-added service for retainer clients",
    kpi: "Repeat-purchase rate",
    note: "The goal names a number and a date. The KPI is the same number the goal is written in, so the action can be judged by it.",
  },
  {
    id: "showup",
    goal: "Halve the gap between booked and held consultations",
    action: "A reminder workflow and one coordinator",
    kpi: "Show-up rate (held ÷ booked)",
    note: "The KPI is a funnel step the buyer has already shown the gap in. Without a baseline you cannot say the gap halved.",
  },
  {
    id: "selling",
    goal: "Sell on the buyer’s motive at the proposal stage",
    action: "A workshop and a month of coaching",
    kpi: "Conversion, proposal → signed",
    note: "A behaviour is hard to measure directly, so it is tied to the conversion it should move. The effect is slow and easy to over-claim.",
  },
] as const;

function ChainMap() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<string>("repeat");
  const c = CHAINS.find((x) => x.id === sel)!;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 232" className="mx-auto h-auto w-full max-w-[600px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`Goal, action, KPI: three worked chains`}</title>
        <desc id={`${uid}-d`}>{`Three rows, each a goal (Ziel), an action (Maßnahme) and a KPI. Select a row to read what holds it together.`}</desc>
        {["ZIEL · GOAL", "MASSNAHME · ACTION", "KPI · METRIC"].map((h, i) => (
          <text key={h} x={[4, 200, 396][i]} y="14" fontSize="12" fontWeight="700" fill="#59606A">
            {h}
          </text>
        ))}
        {CHAINS.map((x, i) => {
          const y = 24 + i * 68;
          const on = x.id === sel;
          const pick = () => setSel(x.id);
          const cols = [
            { x: 0, t: x.id === "repeat" ? ["Repeat purchase", "30% → 35%"] : x.id === "showup" ? ["Halve the", "show-up gap"] : ["Sell on motive", "at proposal"] },
            { x: 196, t: x.id === "repeat" ? ["Value-added", "service"] : x.id === "showup" ? ["Reminders +", "coordinator"] : ["Workshop +", "coaching"] },
            { x: 392, t: x.id === "repeat" ? ["Repeat-purchase", "rate"] : x.id === "showup" ? ["Show-up rate", "held ÷ booked"] : ["Proposal → signed", "conversion"] },
          ];
          return (
            <g
              key={x.id}
              className="hit"
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${x.goal}; ${x.action}; ${x.kpi}`}
              onClick={pick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick();
                }
              }}
            >
              {cols.map((col, k) => (
                <g key={k}>
                  <rect x={col.x} y={y} width="164" height="58" rx="8" fill={on ? (k === 2 ? "#DFEEEB" : "#FBF0D6") : k === 2 ? "#ECE6D6" : "#FFFEFA"} stroke={on ? "#8A5A0B" : "#59606A"} strokeWidth={on ? 2.6 : 1.4} className={k === 0 ? "hit-shape" : undefined} />
                  <text x={col.x + 12} y={y + 25} fontSize="14.5" fontWeight="700" fill="#1F2328">{col.t[0]}</text>
                  <text x={col.x + 12} y={y + 44} fontSize="14" fill="#1F2328">{col.t[1]}</text>
                  {k < 2 && <path d={`M${col.x + 168} ${y + 29} h24`} stroke="#59606A" strokeWidth="2.2" markerEnd={`url(#${uid}-ar)`} />}
                </g>
              ))}
            </g>
          );
        })}
        <defs>
          <marker id={`${uid}-ar`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#59606A" />
          </marker>
        </defs>
      </svg>
      <div aria-live="polite" className="space-y-1 rounded-lg border border-line bg-paper p-4 text-caption">
        <p className="smallcaps">Goal → action → KPI</p>
        <p><span className="font-semibold text-ink">Goal. </span>{c.goal}.</p>
        <p><span className="font-semibold text-ink">Action. </span>{c.action}.</p>
        <p><span className="font-semibold text-ink">KPI. </span>{c.kpi}.</p>
        <p className="text-ash">{c.note}</p>
      </div>
      <Insight>
        The same three-column shape holds for a rate, a funnel gap and a sales behaviour alike — what makes a chain work is not the goal&apos;s subject, it is that the KPI on the right reads the exact number the goal on the left is written in. Where that number is missing (no baseline, no direct measure), the note names the specific way the chain would fail, not just that it might.
      </Insight>
    </div>
  );
}

export function CardC1() {
  return (
    <MaterialCard
      id="C1"
      scan="A retention strategy is not one action. It is a set of actions, each tied to a goal above it and a KPI below it."
      sources={["kaplan1992", "doran1981"]}
      reasoning={[
        "Write every funded item as goal → action → KPI (Ziel → Maßnahme → KPI). An item you cannot write that way is not ready to fund: an action with no KPI cannot be governed, and a KPI with no action is a number nobody acts on.",
        "Each item in the task has its own KPI: the lever is judged by the repeat-purchase rate, the funnel fix by the show-up rate, the training by proposal → signed conversion, and the dashboard by the three KPIs being published each month.",
        "A KPI needs a baseline before its action starts. If the action launches first, or with the dashboard, its early months cannot be read. That is the sequencing rule: fund and start the measurement first.",
        "Match the KPI to what the action acts on. A retention lever acts on the repeat-purchase rate; the conversion rate is a funnel measure and is not the lever’s target.",
      ]}
    >
      <Diagram label="Ziel → Maßnahme → KPI" caption="Case assumption: Alpenwerk GmbH, illustrative. Select a row. The same chain is what the Decision Memo asks you to write for DigitalIT Solutions.">
        <ChainMap />
      </Diagram>
      <Bul
        items={[
          <><strong>The framework, named so you can cite it.</strong> <em>Ziel → Maßnahme → KPI</em> (goal → action → metric) is the control logic of this course. It is the same line of sight as Kaplan &amp; Norton’s (1992) scorecard, which keeps objectives, measures, targets and initiatives together, so that what you do is tied to what you measure.</>,
          <><strong>A goal has to be checkable.</strong> Doran (1981) asks that a goal be specific, measurable, assignable, realistic and time-related. “Raise repeat purchase from 30% to 35% in 18 months” passes; “improve loyalty” does not.</>,
          <><strong>Why this comes before the budget.</strong> A budget is spread over actions. If the KPI that judges an action is not measured, the money buys something nobody can evaluate, and the cut you make later cannot be defended.</>,
          <><strong>Boundary.</strong> A KPI can be gamed or misread. It tells you where to look, not why; the trigger in Materi C4 is what turns a reading into a decision.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ C2 */

const LOOP = [
  { id: "kpi", label: "KPI", sub: "read", text: "The owner reads the KPI against its baseline and its target, on a fixed day." },
  { id: "review", label: "Review", sub: "cadence", text: "A review at a fixed cadence (weekly, monthly, quarterly) decides whether the reading is a signal or noise. The cadence matches how fast the KPI moves." },
  { id: "trigger", label: "Trigger", sub: "threshold", text: "A threshold written in advance, for example “below 60% for two months”. Crossing it is not a debate about whether to act; it is the rule that says who acts." },
  { id: "act", label: "Act", sub: "escalate", text: "The action changes, is escalated to a named person, or is stopped. The next reading shows whether the change worked, and the loop starts again." },
] as const;

function ControlLoop() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<string>("trigger");
  const n = LOOP.find((x) => x.id === sel)!;
  const pos = [
    { x: 70, y: 40 },
    { x: 270, y: 40 },
    { x: 270, y: 150 },
    { x: 70, y: 150 },
  ];
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 250" className="mx-auto h-auto w-full max-w-[600px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`A governed system is a loop`}</title>
        <desc id={`${uid}-d`}>{`Four steps in a loop: KPI, review, trigger, act. On the right, a one-off fix is a single step with no loop. Select a step to read it.`}</desc>
        <defs>
          <marker id={`${uid}-ar`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#59606A" />
          </marker>
        </defs>
        <path d="M200 66 H262" stroke="#59606A" strokeWidth="2.2" markerEnd={`url(#${uid}-ar)`} fill="none" />
        <path d="M336 92 V142" stroke="#59606A" strokeWidth="2.2" markerEnd={`url(#${uid}-ar)`} fill="none" />
        <path d="M262 176 H200" stroke="#59606A" strokeWidth="2.2" markerEnd={`url(#${uid}-ar)`} fill="none" />
        <path d="M136 142 V92" stroke="#59606A" strokeWidth="2.2" markerEnd={`url(#${uid}-ar)`} fill="none" />
        {LOOP.map((s, i) => {
          const on = s.id === sel;
          const pick = () => setSel(s.id);
          return (
            <g
              key={s.id}
              className="hit"
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${s.label}: ${s.sub}`}
              onClick={pick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick();
                }
              }}
            >
              <rect x={pos[i].x - 66} y={pos[i].y} width="132" height="52" rx="8" fill={on ? "#FBF0D6" : "#FFFEFA"} stroke={on ? "#8A5A0B" : "#59606A"} strokeWidth={on ? 2.6 : 1.4} className="hit-shape" />
              <text x={pos[i].x} y={pos[i].y + 23} textAnchor="middle" fontSize="16" fontWeight="700" fill="#1F2328">{s.label}</text>
              <text x={pos[i].x} y={pos[i].y + 42} textAnchor="middle" fontSize="13" fill="#59606A">{s.sub}</text>
            </g>
          );
        })}
        {/* the one-off fix: a single step, nothing that returns */}
        <text x="430" y="30" fontSize="12" fontWeight="700" fill="#59606A">A ONE-OFF FIX</text>
        <rect x="430" y="40" width="122" height="52" rx="8" fill="#F6E3DB" stroke="#A4472A" strokeWidth="1.6" strokeDasharray="5 4" />
        <text x="491" y="63" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1F2328">Discount</text>
        <text x="491" y="82" textAnchor="middle" fontSize="13" fill="#1F2328">campaign</text>
        <path d="M491 96 V146" stroke="#A4472A" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        <text x="491" y="168" textAnchor="middle" fontSize="13" fill="#A4472A">then nothing reads it</text>
      </svg>
      <div aria-live="polite" className="space-y-1 rounded-lg border border-line bg-paper p-4 text-caption">
        <p className="smallcaps">
          {n.label} · {n.sub}
        </p>
        <p className="text-ink">{n.text}</p>
      </div>
      <Insight>
        Click around the loop and it always returns to KPI — that return arrow is the whole point: Act changes something, and the next reading of KPI is what shows whether the change worked. The one-off fix on the right also has an outcome (revenue), but no step is scheduled to read it again, so a discount campaign that fails looks identical to one that works — nothing comes back to tell them apart.
      </Insight>
    </div>
  );
}

export function CardC2() {
  return (
    <MaterialCard
      id="C2"
      scan="A discount campaign is an action. A governed system is what makes an action correctable."
      sources={["deming1986", "nagle2018"]}
      reasoning={[
        "Separate the action from the system. A one-off fix (a discount campaign, a single training day) has no owner, no cadence and no trigger: it spends the money and nobody reads the result. A system adds those three, so the action can be corrected.",
        "A governance plan is part of the funding decision. An action funded with no way to read its KPI is unmeasurable, so say who reads what, how often, and at which threshold it escalates.",
        "When you cut an item, the governance plan must not pretend it is still in place. A KPI that lost its dashboard cannot have a monthly reading; write what replaces it, or say it is unowned.",
        "Prefer a correctable small action to an uncorrectable large one: a partial fix with a trigger teaches you more than a full fix nobody reads.",
      ]}
    >
      <Diagram label="One-off fix against a governed system" caption="The loop on the left is what turns an action into a system. The dashed box on the right is the one-off fix. Select a step.">
        <ControlLoop />
      </Diagram>
      <Bul
        items={[
          <><strong>The discussion prompt, compressed.</strong> Is a discount campaign a strategy? It is one action, aimed at price. It has no owner, no cadence and no threshold, so after the campaign nobody can say whether it worked, and the price cut has been paid on every order (see B4).</>,
          <><strong>A governed system.</strong> An owner per KPI, a review cadence and an escalation trigger. Deming (1986) called the cycle plan, do, study, act: you study the reading and change what you do, then read again.</>,
          <><strong>Why the loop matters when money is short.</strong> A cut you can measure is a cut you can reverse: if the reading crosses the trigger, you know to fund the postponed item. A cut in the dark is a bet you cannot review.</>,
          <><strong>Boundary.</strong> A loop costs attention. Too many KPIs and too short a cadence turn governance into reporting; three KPIs on a monthly rhythm is what a four-month window can carry.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ C3 */

const SC = { fixed: 30000, perClient: 800, max: 80 };

function ScaleChart() {
  const uid = useId().replace(/:/g, "");
  const [n, setN] = useState(38);
  const X0 = 56;
  const X1 = 540;
  const YM = 80000;
  const px = (v: number) => X0 + (v / SC.max) * (X1 - X0);
  const py = (v: number) => 190 - (v / YM) * 166;
  const cross = SC.fixed / SC.perClient;
  const per = SC.perClient * n;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 240" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`Cost of a fixed-cost system and a per-client action as the client base grows`}</title>
        <desc id={`${uid}-d`}>{`Illustrative. A system built once costs a flat ${eur(SC.fixed)}. An action that costs ${eur(SC.perClient)} per client rises with the client base and equals the system at ${cross.toFixed(1)} clients. At ${n} clients the per-client action costs ${eur(per)}.`}</desc>
        <line x1={X0} x2={X1} y1={py(0)} y2={py(0)} stroke="#59606A" strokeWidth="1.4" />
        <line x1={X0} x2={X0} y1="20" y2={py(0)} stroke="#59606A" strokeWidth="1.2" />
        {[0, 40000, 80000].map((v) => (
          <g key={v}>
            <line x1={X0} x2={X1} y1={py(v)} y2={py(v)} stroke="#D8D1BF" strokeDasharray="3 4" />
            <text x={X0 - 6} y={py(v) + 4} textAnchor="end" fontSize="11.5" fill="#59606A">{eur(v)}</text>
          </g>
        ))}
        {[0, 20, 40, 60, 80].map((v) => (
          <text key={v} x={px(v)} y="210" textAnchor="middle" fontSize="12" fill="#59606A">{v}</text>
        ))}
        <text x="298" y="230" textAnchor="middle" fontSize="12.5" fill="#59606A">clients served</text>
        <polyline points={`${px(0)},${py(SC.fixed)} ${px(SC.max)},${py(SC.fixed)}`} fill="none" stroke="#2F5D62" strokeWidth="3" />
        <polyline points={`${px(0)},${py(0)} ${px(SC.max)},${py(SC.perClient * SC.max)}`} fill="none" stroke="#A4472A" strokeWidth="3" strokeDasharray="7 5" />
        <line x1={px(cross)} x2={px(cross)} y1="20" y2={py(0)} stroke="#D8D1BF" strokeWidth="1.4" strokeDasharray="2 3" />
        <line x1={px(n)} x2={px(n)} y1="20" y2={py(0)} stroke="#8A5A0B" strokeWidth="1.4" strokeDasharray="2 3" />
        <circle cx={px(n)} cy={py(SC.fixed)} r="5" fill="#2F5D62" />
        <circle cx={px(n)} cy={py(per)} r="5" fill="#A4472A" />
        <line x1="70" x2="98" y1="12" y2="12" stroke="#2F5D62" strokeWidth="3" />
        <text x="104" y="16" fontSize="13" fontWeight="600" fill="#2F5D62">Built once (fixed)</text>
        <line x1="270" x2="298" y1="12" y2="12" stroke="#A4472A" strokeWidth="3" strokeDasharray="7 5" />
        <text x="304" y="16" fontSize="13" fontWeight="600" fill="#A4472A">Per client</text>
      </svg>
      <Insight>
        {n < cross
          ? `Below ${cross.toFixed(1)} clients the fixed system is still the pricier option at ${eur(SC.fixed)} — you're paying for capacity the client base hasn't grown into yet, while the per-client action costs only ${eur(per)}.`
          : `Past ${cross.toFixed(1)} clients the per-client action has overtaken the system: at ${n} clients it costs ${eur(per)} and keeps climbing €${SC.perClient} at a time, while the system's ${eur(SC.fixed)} never moves.`}{" "}
        The system only pays for itself once there is a big enough base to spread its fixed cost across; below the crossover, a per-client action is the cheaper choice on cost alone.
      </Insight>
      <div>
        <label htmlFor={`${uid}-n`} className="text-caption font-semibold">Clients served: <span className="tnum">{n}</span></label>
        <p className="text-micro normal-case tracking-normal text-ash">Move it to see where the two costs cross.</p>
        <input id={`${uid}-n`} type="range" min={0} max={SC.max} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="range-accent" />
      </div>
    </div>
  );
}

export function CardC3() {
  return (
    <MaterialCard
      id="C3"
      scan="Some actions scale across the client base, some only move one deal. When the budget is short, know which is which before you cut."
      sources={["nagle2018", "brealey2020", "gupta2003"]}
      reasoning={[
        "Classify each line item by its cost shape (the shapes from Materi B). A dashboard or a booking automation is built once and serves every client. A per-client lever (Options A and C) grows with the client base. A discount grows with the number of orders.",
        "Leverage is the effect per euro; scale is whether the cost stays flat as the base grows. A foundation that scales and enables the rest (the dashboard) is not cut without saying what becomes unmeasurable.",
        "Descope before you cancel. A lever can be narrowed to one segment. Drop the segment where the lever nets the least, or a loss, first: use the net-impact figures from your Route 2 grid, not the size of the segment.",
        "Cut the item with the weakest evidence first. An item whose effect the case does not quantify (the training) is easier to defend cutting than one with a printed effect.",
        "A partial fix is a legitimate choice if you state the residual gap. The funnel fix takes the show-up rate to 68%, not to the 75% benchmark: 7 pp stay open, and the memo says so.",
        "Add the four costs before you decide. The shortfall is arithmetic: if the total is over the budget, the message names which item or scope closes the gap.",
      ]}
    >
      <Diagram label="Cost of a system against a per-client action · illustrative" caption="Case assumption: a system built once for €30,000 against an action that costs €800 per client. The reference to Project and Retainer clients is the same as in Route 2.">
        <ScaleChart />
      </Diagram>
      <Bul
        items={[
          <><strong>Leverage against scale.</strong> Leverage asks: how much does one euro move the KPI? Scale asks: how many clients does it reach for the same cost? An action can have high leverage in one segment and reach only that segment.</>,
          <><strong>Project against Retainer, again.</strong> A lever for retainer clients reaches 24 clients and one for project clients reaches 14, but what matters is what it nets in each: in Route 2 the same option nets very different amounts in the two segments, so the segment to descope is the one where it nets least.</>,
          <><strong>Capital rationing.</strong> When the budget cannot fund every worthwhile item, the opportunity cost of each euro is what the next-best item would have returned (Brealey, Myers &amp; Allen, 2020). A cut is then a ranking decision, and the ranking has to be written down.</>,
          <><strong>Customer value is the long view.</strong> Gupta &amp; Lehmann (2003) value a client over its whole relationship, so an action that keeps clients longer pays back beyond a four-month window; that is why postponing it needs a pickup point and not just a “later”.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ C4 */

const GOV = [
  {
    id: "repeat",
    kpi: "Repeat-purchase rate",
    owner: "Head of Account Management",
    cadence: "Monthly",
    trigger: "Below 28% for two months",
    to: "Managing director",
    ownerWhy: "The repeat-purchase rate is moved by how existing clients are served, and account management runs that. Controlling could read the same number but could not change it.",
    cadenceWhy: "A retention KPI moves slowly, so a monthly reading and a two-month rule avoid reacting to noise.",
    triggerWhy: "“Below 28% for two months” names a number and a length of time, so nobody has to argue whether a dip is noise. It goes to the managing director because only they can re-fund or stop the lever.",
  },
  {
    id: "showup",
    kpi: "Show-up rate",
    owner: "CRM coordinator",
    cadence: "Weekly",
    trigger: "Below 60% two weeks running",
    to: "Head of Sales",
    ownerWhy: "The show-up rate is moved by the booking workflow and its reminders, which the coordinator runs and can change at once.",
    cadenceWhy: "A funnel step that is booked every week can be read every week, and a fix that is not working shows quickly.",
    triggerWhy: "“Below 60% two weeks running” is a number and a length of time. It goes to the Head of Sales, who can change the process the coordinator cannot.",
  },
  {
    id: "dash",
    kpi: "Dashboard reporting",
    owner: "Controlling",
    cadence: "Monthly",
    trigger: "A KPI more than 5 working days late",
    to: "Chief Financial Officer",
    ownerWhy: "Here the KPI is the reporting itself, and Controlling produces the reports. It is the one case where the person who reads the numbers is the right owner.",
    cadenceWhy: "The dashboard’s own KPI is that it delivers. If it is late, every other KPI is late.",
    triggerWhy: "“More than 5 working days late” is a number a calendar can check. It goes to the Chief Financial Officer because late reporting is a failure of the finance process.",
  },
] as const;

function GovTable() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<string>("repeat");
  const g = GOV.find((x) => x.id === sel)!;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 220" className="mx-auto h-auto w-full max-w-[600px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{`A governance table: owner, cadence and trigger per KPI`}</title>
        <desc id={`${uid}-d`}>{`Three KPIs, each with one owner, a review cadence and an escalation trigger with a threshold. Select a row to read why.`}</desc>
        {["KPI", "OWNER", "CADENCE", "TRIGGER (THRESHOLD)"].map((h, i) => (
          <text key={h} x={[8, 150, 300, 380][i]} y="16" fontSize="11.5" fontWeight="700" fill="#59606A">
            {h}
          </text>
        ))}
        {GOV.map((x, i) => {
          const y = 26 + i * 64;
          const on = x.id === sel;
          const pick = () => setSel(x.id);
          return (
            <g
              key={x.id}
              className="hit"
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`${x.kpi}, owner ${x.owner}, ${x.cadence}, trigger ${x.trigger}`}
              onClick={pick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick();
                }
              }}
            >
              <rect x="0" y={y} width="560" height="56" rx="8" fill={on ? "#FBF0D6" : "#FFFEFA"} stroke={on ? "#8A5A0B" : "#59606A"} strokeWidth={on ? 2.6 : 1.4} className="hit-shape" />
              <text x="8" y={y + 34} fontSize="14" fontWeight="700" fill="#1F2328">{x.kpi.length > 16 ? x.kpi.split(" ").slice(0, 2).join(" ") : x.kpi}</text>
              <text x="150" y={y + 24} fontSize="13" fill="#1F2328">{x.owner.length > 18 ? x.owner.slice(0, x.owner.lastIndexOf(" ", 18)) : x.owner}</text>
              {x.owner.length > 18 && <text x="150" y={y + 42} fontSize="13" fill="#1F2328">{x.owner.slice(x.owner.lastIndexOf(" ", 18) + 1)}</text>}
              <text x="300" y={y + 34} fontSize="13.5" fontWeight="600" fill="#1F2328">{x.cadence}</text>
              <text x="380" y={y + 24} fontSize="12.5" fill="#1F2328">{x.trigger.length > 24 ? x.trigger.slice(0, x.trigger.lastIndexOf(" ", 24)) : x.trigger}</text>
              {x.trigger.length > 24 && <text x="380" y={y + 42} fontSize="12.5" fill="#1F2328">{x.trigger.slice(x.trigger.lastIndexOf(" ", 24) + 1)}</text>}
            </g>
          );
        })}
      </svg>
      <div aria-live="polite" className="space-y-1 rounded-lg border border-line bg-paper p-4 text-caption">
        <p className="smallcaps">{g.kpi} · escalates to {g.to}</p>
        <p className="text-ink">
          <span className="font-semibold">Why this owner. </span>
          {g.ownerWhy}
        </p>
        <p className="text-ink">
          <span className="font-semibold">Why this cadence. </span>
          {g.cadenceWhy}
        </p>
        <p className="text-ink">
          <span className="font-semibold">Why this trigger. </span>
          {g.triggerWhy}
        </p>
      </div>
      <Insight>
        {g.id === "dash"
          ? "Controlling owns this row because the KPI is the report itself. The same role would be the wrong owner of the repeat-purchase row: the owner is the person who can change what moves the KPI, not the person who reads the number."
          : g.id === "showup"
            ? "The owner is the coordinator because the workflow is theirs to change; the cadence is weekly because bookings happen every week; and the trigger escalates to the person with authority the coordinator lacks. Owner, cadence and trigger each answer their own question."
            : "The owner is the person who can change how clients are served; the cadence is monthly because retention moves in months; and the trigger names a number and a length of time. Match the cadence to the KPI's own speed, not to one company-wide rhythm."}
      </Insight>
    </div>
  );
}

export function CardC4() {
  return (
    <MaterialCard
      id="C4"
      scan="A KPI with no owner, no cadence and no escalation trigger is just a number nobody acts on."
      sources={["betrvg87", "kaplan1992", "doran1981"]}
      reasoning={[
        "Give every funded KPI three things: one owner (a role, not a team), a review cadence, and an escalation trigger with a threshold (a number) and a named person it goes to. “We will monitor it” names none of the three.",
        "Pick the owner with the owner test: who can change the action that moves this KPI this week, without asking anyone above? That is the owner, not the person who only reads the number. Controlling owns the dashboard’s own KPI because it produces the reports; it does not own the repeat-purchase rate, which it can read but not change.",
        "Between a head and a team lead, ask whether the KPI belongs to the whole function or to one team’s habit. The owner sits close to the action, and the person the trigger escalates to sits above it, so a KPI is never owned by the person it escalates to.",
        "Choose the cadence by how fast the KPI moves: a weekly funnel step can be read weekly; a retention rate moves in months. Choose the threshold from a baseline you actually have: without the dashboard there is none, and the trigger cannot be written.",
        "Tie governance to what you funded. A plan that names KPIs for an item you cut is not neutral: it hides the cut. Write who owns what you kept, and say what is unowned because you cut it.",
        "When you cut, state the consequence in the material’s terms: which KPI stays unmeasured, which segment’s lever is delayed, which leak stays partly open. “We will do less” is not a consequence.",
        "Name one measure you postpone, on purpose, with a pickup point: a date or a condition (“after three months of baseline”). A memo that funds everything and names nothing postponed has not made a trade-off.",
        "The order of the rollout is part of the decision. Start the dashboard first or with the first item; a lever that starts before its baseline has an unmeasurable first stretch.",
      ]}
    >
      <Diagram label="Governance table · Alpenwerk GmbH (illustrative, read-only)" caption="Case assumption. One owner, one cadence and one threshold per KPI. Select a row to read why it is set that way.">
        <GovTable />
      </Diagram>
      <Bul
        items={[
          <><strong>Who controls what.</strong> The owner acts on the KPI; the person it escalates to decides when the owner cannot. A KPI with two owners has none. The cadence is a promise to look; the trigger is a promise to act.</>,
          <><strong>Scorecard logic.</strong> Kaplan &amp; Norton (1992) tie each measure to an objective and a target; Doran (1981) asks that a goal be assignable to someone. Governance is that assignment made concrete.</>,
          <><strong>Postponing is a decision, not an omission.</strong> A postponed measure has a name, a reason and a pickup point. Without the pickup it is a cut.</>,
        ]}
      />
      <DataTable
        caption="What each owner role typically does and can change (practitioner observation, Case assumption)"
        head={["Owner role (Case assumption)", "Typically", "Can change"]}
        rows={OWNERS.map((o) => [o, OWNER_PROFILE[o].does, OWNER_PROFILE[o].changes])}
      />
      <Callout label="The test questions for a governance row">
        <ul className="list-disc space-y-1 pl-5">
          {GOV_TESTS.map((t) => (
            <li key={t.name}>
              <strong>{t.name}.</strong> {t.test}
            </li>
          ))}
        </ul>
      </Callout>
      <Callout label="German constraint to remember" tone="rust">
        <p>
          A KPI that can be traced to an individual salesperson, such as a per-person conversion rate, is a technical device that monitors performance. Under § 87(1) no. 6 BetrVG the works council (Betriebsrat) co-determines its introduction. Decide whether the dashboard reports per team or per person before it goes live, and involve the works council in the second case.
        </p>
      </Callout>
    </MaterialCard>
  );
}
