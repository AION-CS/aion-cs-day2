"use client";

import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { Bul, Diagram } from "@/components/materi/kit";
import { JourneyPhases, KpiLadder, MotiveLadder, SortExample } from "@/components/materi/MateriA";
import { B3WorkedExample, B4ReadChart, BreakEvenChart, FormulaChain, LeverMap, SegmentMap } from "@/components/materi/MateriB";
import { ChainMap, ControlLoop, GovTable, ScaleChart } from "@/components/materi/MateriC";
import { GOV_TESTS, OWNERS, OWNER_PROFILE } from "@/data/program";
import { PHASE_PAIR_TESTS, PHASE_TESTS } from "@/data/touchpoints";

/**
 * Materi A of the Friday day (CLAUDE.md #29): six short cards, two per level, sixty minutes in all. Each card
 * reuses the diagrams of the full Materi B and C (kept for the optional Routes 2 and 3) and carries only the
 * decision rules the Case File uses. Levels: A1 and A2 are Level 1, A3 and A4 are Level 2, A5 and A6 are Level 3.
 */

/* ------------------------------------------------------------------ A1 · Level 1 */

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
      <Diagram label="Motive → strategy" caption="Select a motive to read the proof that buyer needs.">
        <MotiveLadder />
      </Diagram>
      <Bul
        items={[
          <><strong>What it is.</strong> A behaviour-based sales strategy starts from why this buyer would act, the buying <em>motive</em>, and derives the sales action and the proof from it. A feature-led pitch starts from what the product does and hopes the motive matches.</>,
          <><strong>Why it matters in long-cycle IT procurement.</strong> The buyer carries the risk of a wrong choice personally: Bauer (1960) called this perceived risk. Where risk aversion is the motive, the strategy is to build trust: references, a pilot phase and compliance proof, exactly the things a security-minded committee can check.</>,
          <><strong>Trust is built, not asserted.</strong> Morgan &amp; Hunt (1994) found that trust and commitment together carry a business relationship forward. Anderson, Narus &amp; van Rossum (2006) add the value side: a customer value proposition states the points of difference the buyer will actually get.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A2 · Level 1 */

export function CardA2() {
  return (
    <MaterialCard
      id="A2"
      scan="Sort a stage into the right journey phase, then read the funnel by each step’s gap to its benchmark, in percentage points."
      sources={["lemon2016", "gartner2017", "gupta2003", "reichheld1990"]}
      reasoning={[
        "To sort a stage, ask two questions. (1) By this point, are a named buyer contact and a seller in a scheduled or held conversation? (2) Does this event come after the signature? No to both → pre-sales. Yes to the first only → sales, up to and including the signature itself. Anything after the signature → after-sales.",
        "A booked consultation is sales: a seller now owns a named contact and a date. Contact details or a download are first contact but still pre-sales: nobody has spoken to the person yet.",
        "The signature is the last sales event, not the first after-sales one. A phase can be empty in a funnel: a funnel counts people up to the signature, so after-sales never appears as a stage; it shows in other numbers, such as the repeat-purchase rate.",
        ...PHASE_PAIR_TESTS.slice(0, 2).map((t) => `${t.pair} ${t.test}`),
        "Compute each step from its own two counts: this stage ÷ the stage above it × 100. Never divide by the top of the funnel.",
        "Counts fall at every stage by design. The step that loses the most people is not the step with the largest gap: rank the steps by the gap to their benchmark, in percentage points, and take the most negative.",
        "A gap is actual minus benchmark, in percentage points (pp), with its sign. 42.7% against 75% is −32.3 pp, not −43%; a relative percentage answers a different question.",
        "State the cost of a leak as a number you can trace: prospects lost × the funnel’s own downstream conversion (× the contract value if the case gives one). Do not import a figure the case never printed.",
        "A benchmark is a comparison point, not a verdict. A gap tells you where to ask “why here?”; it does not tell you the cause.",
      ]}
    >
      <Diagram label="Customer journey map" caption="Eight touchpoints, three phases and the two boundaries used in this course. Select a touchpoint to read what it covers.">
        <JourneyPhases />
      </Diagram>
      <DataTable
        caption="One test question per phase, and what belongs in it"
        head={["Phase", "The test question", "What belongs", "What does not"]}
        rows={PHASE_TESTS.map((t) => [t.name, t.test, t.belongs, t.notBelongs])}
      />
      <Diagram
        label="Worked sort · Alpenwerk GmbH (Case assumption, illustrative, read-only)"
        caption="A different company's stages, sorted with the same tests you will use in Stage 1. Select a stage to read why it sits in its phase."
      >
        <SortExample />
      </Diagram>
      <Diagram label="Worked example · Alpenwerk GmbH (illustrative, read-only)" caption="Case assumption. Two steps of a different company, computed the way Stage 1 asks you to read DigitalIT Solutions.">
        <KpiLadder />
      </Diagram>
      <div className="grid gap-3 md:grid-cols-3">
        <Callout label="Conversion rate · gap">
          <p>Conversion = count at this stage ÷ count at the stage above × 100. Gap = actual % − benchmark %, in <strong>percentage points</strong>.</p>
        </Callout>
        <Callout label="Customer value (CLV)">
          <p>
            The gross profit one client is expected to bring over the whole relationship. Simple form: annual gross profit per client × expected years, with expected years ≈ 1 ÷ (1 − retention). At €12,000 a year and 80% retention that is 5 years and €60,000 (undiscounted; Gupta &amp; Lehmann, 2003).
          </p>
        </Callout>
        <Callout label="Repurchase rate">
          <p>Existing clients who re-order within a stated window ÷ existing clients. 12 of 40 clients re-ordering within 18 months is 30.0%. The window is part of the definition: state it.</p>
        </Callout>
      </div>
      <Bul
        items={[
          <><strong>Why retention gets its own number.</strong> Reichheld &amp; Sasser (1990) found that cutting defections by 5% raised profits by 25% to 85% across the service industries they studied. A funnel shows how a company wins clients; the repurchase rate shows whether it keeps them.</>,
          <><strong>Cost of a leak, worked (Alpenwerk, Case assumption).</strong> 60 consultations booked, 45 held: 15 prospects fall out. Of every 45 held, 6 sign (13.3%), so the 15 would have brought about 15 × 6 ÷ 45 = <strong>2.0 contracts</strong>. At €50,000 a contract that is about €100,000 of revenue a year. The figure assumes the lost prospects would have behaved like the ones who were held: an estimate to size a leak, not a forecast.</>,
          <><strong>Buyers research without you.</strong> Gartner (2017) found buyers spend about 17% of buying time meeting suppliers, so much of the journey is pre-sales research you do not see (Lemon &amp; Verhoef, 2016).</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A3 · Level 2 */

export function CardA3() {
  return (
    <MaterialCard
      id="A3"
      scan="Each lever answers one buying motive. Compare levers in euros of net impact: extra orders × gross profit per order − what the lever costs."
      sources={["morgan1994", "anderson2006", "reichheld1990", "dick1994", "nagle2018", "gupta2003"]}
      reasoning={[
        "Map lever to motive: personal account management → relationship and trust; discounting → price; a value-added service → perceived benefit. Choose by cause, then by cost: ask why the client would not return, pick the lever that answers that cause, and only then compare in euros.",
        "The three levers cost different things. A and C are a fixed cost per client per year; a discount is margin given up on every order it applies to. So compare them in net euros, not in list price or in the size of the uplift alone.",
        "Do the three steps in order and keep the units: extra orders (orders), gross profit per order (€ per order), cost (€). Net impact is the last line, in euros per year.",
        "Extra orders = clients × uplift ÷ 100, where the uplift is in percentage points of the repeat rate. Gross profit per order = price × margin.",
        "A negative result is an answer, not an error. When the cost is larger than the extra gross profit the lever loses money, and the note should say so.",
        "For a discount, count the cost on every repeat order in the segment, the ones that already exist and the extra ones: a price cut is paid on all of them, including orders the client would have placed anyway.",
        "For a fixed-cost lever (account management, a value-added service), the cost is clients × the cost per client, whatever the number of orders.",
        "Take the uplift as printed in the task: it is an assumption you are given. Cite the euro figure: a recommendation is defended by a number from your own grid, and a recommendation with no number scores 0.",
      ]}
    >
      <Diagram label="Three levers" caption="Select a lever. The dashed stripes mark a cost paid on every order; the solid block is a cost paid per client whatever the orders.">
        <LeverMap />
      </Diagram>
      <Diagram label="The unit of comparison" caption="The same four steps for every lever. Only the cost line changes.">
        <FormulaChain />
      </Diagram>
      <Bul
        items={[
          <><strong>Gross profit per repeat order = price × gross margin.</strong> A €40,000 contract at a 25% margin leaves €10,000 of gross profit. That is what one extra order is worth, before the cost of winning it.</>,
          <><strong>Extra orders = clients × uplift.</strong> An uplift is in percentage points of the repeat rate. 20 clients and an uplift of 5 pp is 20 × 0.05 = 1 extra order.</>,
          <><strong>Two shapes of cost.</strong> A fixed cost per client: 20 clients × €1,000 = €20,000. A discount: 5% of €40,000 is €2,000 on every repeat order, so with 4 existing repeat orders and 1 extra one it costs 5 × €2,000 = €10,000.</>,
          <><strong>Why retention is worth the effort.</strong> Reichheld &amp; Sasser (1990) found that cutting defections by 5% raised profits by 25% to 85%. Dick &amp; Basu (1994) separate real loyalty (attitude plus behaviour) from repeat purchase that comes from habit, so a lever must reach the attitude to hold.</>,
        ]}
      />
      <B3WorkedExample />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A4 · Level 2 */

export function CardA4() {
  return (
    <MaterialCard
      id="A4"
      scan="The same lever can pay in one segment and lose money in another. A discount pays everyone, including those who would have stayed."
      sources={["fader2005", "gupta2003", "burnham2003", "kahneman1979", "samuelson1988", "kahneman1991", "morgan1994", "gustafsson2005", "nagle2018"]}
      reasoning={[
        "Read a segment by its base: its number of clients and its existing repeat orders decide how much a lever can add and how much a discount gives away.",
        "Relationship levers pay where contact is frequent and orders are many; check their fixed cost against the extra orders they bring before you call them a success.",
        "Repeat rate = repeat orders ÷ clients in the segment. An uplift in percentage points of that rate, times the clients, gives the extra orders.",
        "When one lever must run across every segment, add that lever’s net impact over the segments and compare the totals. The best single lever is often no segment’s own best, and the gap between its total and the sum of the local bests is what you give up.",
        "Ask what drives the churn before you choose a lever: relationship or trust → account management; perceived value → a value-added service; price → a discount. A discount is the right tool only for the third.",
        "Test a discount by its break-even: extra orders needed = existing repeat orders × the discount per order ÷ (gross profit per order − the discount per order); divide by the clients for the uplift. The more repeat orders a segment already has, the higher the bar.",
        "A lever that wins on the numbers can still be the weak tool. Say what the number rests on (the uplift assumption) and what would break it, rather than defending the figure as fact. This is an argument from the mechanism, not a rule: where a segment has few existing repeat orders, a discount can still pay.",
      ]}
    >
      <Diagram label="Two segments" caption="Select a segment. This is the logic of recency, frequency and value, reduced to the two dimensions this course needs.">
        <SegmentMap />
      </Diagram>
      <Diagram label="Break-even of a discount against a fixed-cost lever · illustrative company" caption="Case assumption: 20 clients, a €40,000 contract, a 25% margin, a 5% discount, and a fixed lever at €600 per client. Move both sliders.">
        <BreakEvenChart />
      </Diagram>
      <B4ReadChart />
      <Bul
        items={[
          <><strong>RFM-style segmentation.</strong> Score clients by <em>recency</em>, <em>frequency</em> and <em>monetary value</em> (Fader, Hardie &amp; Lee, 2005). You do not need the full model: frequency and value alone explain why two segments react differently.</>,
          <><strong>Why price is the wrong lever against relationship churn.</strong> In long-cycle B2B IT, switching means procedural, financial and relational costs (Burnham, Frels &amp; Mahajan, 2003), and people stay with the option they have unless leaving feels safer than staying: loss aversion and status-quo bias (Kahneman &amp; Tversky, 1979; Samuelson &amp; Zeckhauser, 1988; Kahneman, Knetsch &amp; Thaler, 1991). What breaks that hold is a failure of trust or of the relationship, not a slightly higher price (Morgan &amp; Hunt, 1994; Gustafsson, Johnson &amp; Roos, 2005).</>,
          <><strong>What a discount actually does.</strong> It cuts the price on every repeat order, so it gives margin away on orders that would have come anyway. Nagle &amp; Müller (2018) build pricing decisions on exactly this break-even logic. The chart uses invented figures; in the task the uplifts are given, so treat them as assumptions to defend, not as facts.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A5 · Level 3 */

export function CardA5() {
  return (
    <MaterialCard
      id="A5"
      scan="A retention strategy is not one action. It is a set of actions, each tied to a goal above it and a KPI below it, and a system that reads the result."
      sources={["kaplan1992", "doran1981", "deming1986", "nagle2018"]}
      reasoning={[
        "Write every funded item as goal → action → KPI (Ziel → Maßnahme → KPI). An item you cannot write that way is not ready to fund: an action with no KPI cannot be governed, and a KPI with no action is a number nobody acts on.",
        "Each item in the task has its own KPI: the lever is judged by the repeat-purchase rate, the funnel fix by the show-up rate, the training by proposal → signed conversion, and the dashboard by the three KPIs being published each month. A retention lever acts on the repeat-purchase rate; the conversion rate is a funnel measure and is not the lever’s target.",
        "A KPI needs a baseline before its action starts. If the action launches first, or with the dashboard, its early months cannot be read. That is the sequencing rule: fund and start the measurement first.",
        "Separate the action from the system. A one-off fix (a discount campaign, a single training day) has no owner, no cadence and no trigger: it spends the money and nobody reads the result. A system adds those three, so the action can be corrected.",
        "A governance plan is part of the funding decision. When you cut an item, the plan must not pretend it is still in place: a KPI that lost its dashboard cannot have a monthly reading; write what replaces it, or say it is unowned.",
        "Prefer a correctable small action to an uncorrectable large one: a partial fix with a trigger teaches you more than a full fix nobody reads.",
      ]}
    >
      <Diagram label="Ziel → Maßnahme → KPI" caption="Case assumption: Alpenwerk GmbH, illustrative. Select a row. The same chain is what the Case File asks you to write for DigitalIT Solutions.">
        <ChainMap />
      </Diagram>
      <Diagram label="One-off fix against a governed system" caption="The loop on the left is what turns an action into a system. The dashed box on the right is the one-off fix. Select a step.">
        <ControlLoop />
      </Diagram>
      <Bul
        items={[
          <><strong>The framework, named so you can cite it.</strong> <em>Ziel → Maßnahme → KPI</em> (goal → action → metric) is the control logic of this course. It is the same line of sight as Kaplan &amp; Norton’s (1992) scorecard. Doran (1981) asks that a goal be specific, measurable, assignable, realistic and time-related: “raise repeat purchase from 30% to 35% in 18 months” passes; “improve loyalty” does not.</>,
          <><strong>A governed system.</strong> An owner per KPI, a review cadence and an escalation trigger. Deming (1986) called the cycle plan, do, study, act. A cut you can measure is a cut you can reverse; a cut in the dark is a bet you cannot review.</>,
          <><strong>Boundary.</strong> A KPI can be gamed or misread, and a loop costs attention: three KPIs on a monthly rhythm is what a four-month window can carry.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A6 · Level 3 */

export function CardA6() {
  return (
    <MaterialCard
      id="A6"
      scan="Know which actions scale before you cut, start the measurement first, and give every funded KPI an owner, a cadence and a trigger."
      sources={["nagle2018", "brealey2020", "gupta2003", "betrvg87", "kaplan1992", "doran1981"]}
      reasoning={[
        "Classify each line item by its cost shape. A dashboard or a booking automation is built once and serves every client. A per-client lever (Options A and C) grows with the client base. A discount grows with the number of orders.",
        "Leverage is the effect per euro; scale is whether the cost stays flat as the base grows. A foundation that scales and enables the rest (the dashboard) is not cut without saying what becomes unmeasurable.",
        "Descope before you cancel. A lever can be narrowed to one segment. Drop the segment where the lever nets the least, or a loss, first: use the net-impact figures from your grid, not the size of the segment.",
        "Cut the item with the weakest evidence first. An item whose effect the case does not quantify (the training) is easier to defend cutting than one with a printed effect.",
        "A partial fix is a legitimate choice if you state the residual gap. The funnel fix takes the show-up rate to 68%, not to the 75% benchmark: 7 pp stay open, and the memo says so.",
        "Add the four costs before you decide. The shortfall is arithmetic: if the total is over the budget, the message names which item or scope closes the gap.",
        "Give every funded KPI three things: one owner (a role, not a team), a review cadence, and an escalation trigger with a threshold (a number) and a named person it goes to. “We will monitor it” names none of the three.",
        "Pick the owner with the owner test: who can change the action that moves this KPI this week, without asking anyone above? That is the owner, not the person who only reads the number. Controlling owns the dashboard’s own KPI because it produces the reports; it does not own the repeat-purchase rate, which it can read but not change.",
        "Between a head and a team lead, ask whether the KPI belongs to the whole function or to one team’s habit. The owner sits close to the action, and the person the trigger escalates to sits above it, so a KPI is never owned by the person it escalates to.",
        "Choose the cadence by how fast the KPI moves: a weekly funnel step can be read weekly; a retention rate moves in months. Choose the threshold from a baseline you actually have: without the dashboard there is none, and the trigger cannot be written.",
        "When you cut, state the consequence in the material’s terms: which KPI stays unmeasured, which segment’s lever is delayed, which leak stays partly open. “We will do less” is not a consequence.",
        "Name one measure you postpone, on purpose, with a pickup point: a date or a condition (“after three months of baseline”). A memo that funds everything and names nothing postponed has not made a trade-off.",
        "The order of the rollout is part of the decision. Start the dashboard first or with the first item; a lever that starts before its baseline has an unmeasurable first stretch.",
      ]}
    >
      <Diagram label="Cost of a system against a per-client action · illustrative" caption="Case assumption: a system built once for €30,000 against an action that costs €800 per client.">
        <ScaleChart />
      </Diagram>
      <Diagram label="Governance table · Alpenwerk GmbH (illustrative, read-only)" caption="Case assumption. One owner, one cadence and one threshold per KPI. Select a row to read why it is set that way.">
        <GovTable />
      </Diagram>
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
      <Bul
        items={[
          <><strong>Leverage against scale.</strong> Leverage asks: how much does one euro move the KPI? Scale asks: how many clients does it reach for the same cost? Under a short budget a cut is a ranking decision, and the ranking has to be written down (capital rationing; Brealey, Myers &amp; Allen, 2020).</>,
          <><strong>Postponing is a decision, not an omission.</strong> A postponed measure has a name, a reason and a pickup point. Without the pickup it is a cut. Gupta &amp; Lehmann (2003) value a client over its whole relationship, so an action that keeps clients longer pays back beyond a four-month window.</>,
        ]}
      />
      <Callout label="German constraint to remember" tone="rust">
        <p>
          A KPI that can be traced to an individual salesperson, such as a per-person conversion rate, is a technical device that monitors performance. Under § 87(1) no. 6 BetrVG the works council (Betriebsrat) co-determines its introduction. Decide whether the dashboard reports per team or per person before it goes live, and involve the works council in the second case.
        </p>
      </Callout>
    </MaterialCard>
  );
}
