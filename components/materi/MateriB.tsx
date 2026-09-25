"use client";

import { useId, useState } from "react";
import { Callout, MaterialCard } from "@/components/ui/MaterialCard";
import { Bul, Diagram, Insight } from "@/components/materi/kit";
import { d1, euro, tt } from "@/lib/lang";

const eur = (n: number) => (n < 0 ? "−" : "") + euro(Math.abs(n));

/* ------------------------------------------------------------------ B1 */

const levers = () =>
  [
    {
      id: "A",
      name: tt("Intensified personal account management", "Intensivierte persönliche Kundenbetreuung"),
      short: tt("Account management", "Kundenbetreuung"),
      motive: tt("Relationship · trust", "Beziehung · Vertrauen"),
      shape: "fixed",
      what: tt(
        "A named key account manager, a business review each quarter and early-warning contact before a renewal date. It gives the client a person who knows the estate and is accountable for it.",
        "Ein benannter Key Account Manager, eine Business Review pro Quartal und Frühwarn-Kontakt vor einem Verlängerungstermin. Der Kunde bekommt eine Person, die den Bestand kennt und dafür verantwortlich ist.",
      ),
      cost: tt(
        "A cost per client per year: staff time is spent whether or not the client re-orders.",
        "Ein Kostenblock pro Kunde und Jahr: Die Arbeitszeit fällt an, ob der Kunde erneut bestellt oder nicht.",
      ),
      fits: tt(
        "Where contact is frequent and the client keeps buying from people it knows. In German IT projects the account owner often carries the relationship through several contract cycles.",
        "Wo der Kontakt häufig ist und der Kunde bei Menschen kauft, die er kennt. In deutschen IT-Projekten trägt der Account Owner die Beziehung oft durch mehrere Vertragszyklen.",
      ),
    },
    {
      id: "B",
      name: tt("Discounting", "Rabatt"),
      short: tt("Discount", "Rabatt"),
      motive: tt("Price", "Preis"),
      shape: "perOrder",
      what: tt(
        "A rebate on the repeat order, for example an 8% reduction agreed in a Rahmenvertrag (frame agreement) for the next order.",
        "Ein Nachlass auf den Folgeauftrag, zum Beispiel 8 % Abschlag, vereinbart in einem Rahmenvertrag für den nächsten Auftrag.",
      ),
      cost: tt(
        "Margin given up on every order the discount applies to. It is paid per order, not per client, so it grows with the number of repeat orders.",
        "Marge, die bei jedem Auftrag verschenkt wird, für den der Rabatt gilt. Er fällt pro Auftrag an, nicht pro Kunde, und wächst deshalb mit der Zahl der Folgeaufträge.",
      ),
      fits: tt(
        "Where the reason a client leaves is price. It is a price answer to a price problem.",
        "Wo der Grund für die Abwanderung der Preis ist. Es ist eine Preisantwort auf ein Preisproblem.",
      ),
    },
    {
      id: "C",
      name: tt("Value-added service", "Zusatzleistung"),
      short: tt("Value-added service", "Zusatzleistung"),
      motive: tt("Benefit · perceived value", "Nutzen · wahrgenommener Wert"),
      shape: "fixed",
      what: tt(
        "A service the client values on top of the contract: a security health check, training for the client’s team, a monitoring add-on or an extended hypercare period.",
        "Eine Leistung, die der Kunde zusätzlich zum Vertrag schätzt: ein Security-Health-Check, eine Schulung für das Kundenteam, ein Monitoring-Add-on oder eine verlängerte Hypercare-Phase.",
      ),
      cost: tt(
        "A delivery cost per client per year, again independent of how many orders follow.",
        "Ein Lieferaufwand pro Kunde und Jahr, wiederum unabhängig davon, wie viele Aufträge folgen.",
      ),
      fits: tt(
        "Where the client would stay for a visible, measurable extra result. It answers the benefit motive.",
        "Wo der Kunde für ein sichtbares, messbares Extra bleiben würde. Sie antwortet auf das Nutzenmotiv.",
      ),
    },
  ] as const;

export function LeverMap() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<string>("A");
  const LEVERS = levers();
  const l = LEVERS.find((x) => x.id === sel)!;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 240" className="mx-auto h-auto w-full max-w-[600px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt(`Three retention levers, the motive each answers and how its cost behaves`, `Drei Bindungshebel, das Motiv, auf das jeder antwortet, und das Verhalten seiner Kosten`)}</title>
        <desc id={`${uid}-d`}>
          {tt(
            `Account management answers the relationship motive with a fixed cost per client. Discounting answers the price motive with a cost on every order. A value-added service answers the benefit motive with a fixed cost per client. Select a lever to read more.`,
            `Kundenbetreuung antwortet auf das Beziehungsmotiv mit festen Kosten pro Kunde. Ein Rabatt antwortet auf das Preismotiv mit Kosten bei jedem Auftrag. Eine Zusatzleistung antwortet auf das Nutzenmotiv mit festen Kosten pro Kunde. Wählen Sie einen Hebel, um mehr zu lesen.`,
          )}
        </desc>
        <text x="4" y="14" fontSize="12" fontWeight="700" fill="#59606A">{tt("LEVER", "HEBEL")}</text>
        <text x="216" y="14" fontSize="12" fontWeight="700" fill="#59606A">{tt("MOTIVE IT ANSWERS", "MOTIV, AUF DAS ER ANTWORTET")}</text>
        <text x="412" y="14" fontSize="12" fontWeight="700" fill="#59606A">{tt("HOW THE COST BEHAVES", "WIE SICH DIE KOSTEN VERHALTEN")}</text>
        {LEVERS.map((x, i) => {
          const y = 24 + i * 70;
          const on = x.id === sel;
          const pick = () => setSel(x.id);
          return (
            <g
              key={x.id}
              className="hit"
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`Option ${x.id}: ${x.name}`}
              onClick={pick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick();
                }
              }}
            >
              <rect x="0" y={y} width="200" height="60" rx="8" fill={on ? "#FBF0D6" : "#FFFEFA"} stroke={on ? "#8A5A0B" : "#59606A"} strokeWidth={on ? 2.6 : 1.4} className="hit-shape" />
              <text x="12" y={y + 25} fontSize="17" fontWeight="700" fill="#1F2328">Option {x.id}</text>
              <text x="12" y={y + 46} fontSize="13" fill="#59606A">{x.short}</text>
              <line x1="204" x2="212" y1={y + 30} y2={y + 30} stroke="#59606A" strokeWidth="2" />
              <rect x="214" y={y} width="184" height="60" rx="8" fill={on ? "#DFEEEB" : "#ECE6D6"} stroke="#0F6B6B" strokeWidth={on ? 2.2 : 1} />
              <text x="228" y={y + 35} fontSize="14.5" fontWeight="600" fill="#1F2328">{x.motive}</text>
              {/* cost shape: a fixed block per client, or a stripe per order */}
              {x.shape === "fixed" ? (
                <g>
                  <rect x="412" y={y + 14} width="130" height="32" rx="3" fill="#8B9098" fillOpacity="0.5" stroke="#59606A" />
                  <text x="477" y={y + 35} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#1F2328">{tt("per client", "pro Kunde")}</text>
                </g>
              ) : (
                <g>
                  {[0, 1, 2, 3, 4].map((k) => (
                    <rect key={k} x={412 + k * 27} y={y + 14} width="22" height="32" rx="2" fill="#F6E3DB" stroke="#A4472A" strokeWidth="1.2" strokeDasharray="4 3" />
                  ))}
                  <text x="477" y={y + 58} textAnchor="middle" fontSize="12" fill="#59606A">{tt("per order", "pro Auftrag")}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      <div aria-live="polite" className="space-y-2 rounded-lg border border-line bg-paper p-4 text-caption">
        <p className="smallcaps">
          Option {l.id} · {l.name}
        </p>
        <p><span className="font-semibold text-ink">{tt("What it is. ", "Was es ist. ")}</span>{l.what}</p>
        <p><span className="font-semibold text-ink">{tt("How the cost is counted. ", "Wie die Kosten gezählt werden. ")}</span>{l.cost}</p>
        <p><span className="font-semibold text-ink">{tt("Where it fits. ", "Wofür es passt. ")}</span>{l.fits}</p>
      </div>
      <Insight>
        {tt(
          "The cost shape splits the levers into two families before their price does: Option A and Option C are a block you pay once per client, however many orders follow; Option B is a stripe you pay again on every single order — so a discount is the only lever whose total cost keeps growing the more it succeeds at bringing orders in.",
          "Die Kostenform teilt die Hebel in zwei Familien, noch bevor ihr Preis es tut: Option A und Option C sind ein Block, den Sie einmal pro Kunde zahlen, egal wie viele Aufträge folgen; Option B ist ein Streifen, den Sie bei jedem einzelnen Auftrag erneut zahlen — der Rabatt ist also der einzige Hebel, dessen Gesamtkosten weiter wachsen, je erfolgreicher er Aufträge hereinholt.",
        )}
      </Insight>
    </div>
  );
}

export function CardB1() {
  return (
    <MaterialCard
      id="B1"
      scan="Each lever answers one buying motive. A lever aimed at a different motive spends money without touching the reason."
      sources={["morgan1994", "anderson2006", "reichheld1990", "dick1994"]}
      reasoning={[
        "Map lever to motive: personal account management → relationship and trust; discounting → price; a value-added service → perceived benefit.",
        "Choose by cause, then by cost. Ask why the client would not return, pick the lever that answers that cause, and only then compare the levers in euros.",
        "The three levers cost different things. A and C are a fixed cost per client per year; a discount is margin given up on every order it applies to. So compare them in net euros, not in list price or in the size of the uplift alone.",
        "Take the uplift as printed in the task: it is an assumption you are given, and a good choice should survive it being smaller.",
      ]}
    >
      <Diagram label="Three levers" caption="Select a lever. The dashed stripes mark a cost paid on every order; the solid block is a cost paid per client whatever the orders.">
        <LeverMap />
      </Diagram>
      <Bul
        items={[
          <><strong>From diagnosis to strategy.</strong> Route 1 showed where prospects leak and how weak repeat purchase is. A retention strategy starts from the second finding: why an existing client would place another order, or not.</>,
          <><strong>Why retention is worth the effort.</strong> Reichheld &amp; Sasser (1990) found that cutting defections by 5% raised profits by 25% to 85% across the service industries they studied. Dick &amp; Basu (1994) separate real loyalty (attitude plus behaviour) from repeat purchase that comes from habit or lack of choice, so a lever must reach the attitude to hold.</>,
          <><strong>Value is a claim to prove.</strong> Anderson, Narus &amp; van Rossum (2006) argue that a customer value proposition should state the points of difference the buyer will actually get, in the buyer’s terms. That is the standard a value-added service has to meet.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ B2 */

const segs = () =>
  [
    {
      id: "project",
      name: tt("Project clients", "Projektkunden"),
      short: tt("Project", "Projekt"),
      x: 130,
      y: 66,
      r: 44,
      what: tt(
        "Large, one-off implementations. A client places few orders and each is large.",
        "Große, einmalige Implementierungen. Ein Kunde erteilt wenige Aufträge, jeder ist groß.",
      ),
      how: tt(
        "A repeat order is the next project: rare, decided in a committee and months apart. Personal contact between projects matters, but there is little day-to-day contact to build on. A discount lands on a very large ticket.",
        "Ein Folgeauftrag ist das nächste Projekt: selten, in einem Gremium entschieden und Monate entfernt. Persönlicher Kontakt zwischen den Projekten zählt, aber im Alltag gibt es wenig, worauf man aufbauen kann. Ein Rabatt trifft einen sehr großen Auftragswert.",
      ),
    },
    {
      id: "retainer",
      name: tt("Retainer clients", "Retainer-Kunden"),
      short: tt("Retainer", "Retainer"),
      x: 410,
      y: 190,
      r: 34,
      what: tt(
        "Ongoing, smaller support contracts. A client places many orders and each is small.",
        "Laufende, kleinere Supportverträge. Ein Kunde erteilt viele Aufträge, jeder ist klein.",
      ),
      how: tt(
        "A repeat order is a renewal or an expansion of something already running: frequent, with regular contact. Relationship levers have material to work with, and a price cut applies to every one of many orders.",
        "Ein Folgeauftrag ist eine Verlängerung oder Erweiterung von etwas bereits Laufendem: häufig, mit regelmäßigem Kontakt. Beziehungshebel haben Material, mit dem sie arbeiten können, und eine Preissenkung gilt für jeden von vielen Aufträgen.",
      ),
    },
  ] as const;

export function SegmentMap() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<string>("project");
  const SEGS = segs();
  const s = SEGS.find((x) => x.id === sel)!;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 270" className="mx-auto h-auto w-full max-w-[600px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt(`Two client segments by order frequency and order value`, `Zwei Kundensegmente nach Bestellhäufigkeit und Auftragswert`)}</title>
        <desc id={`${uid}-d`}>
          {tt(
            `Project clients sit at low order frequency and high value per order. Retainer clients sit at high frequency and low value per order. Select a segment to read how levers land on it.`,
            `Projektkunden liegen bei niedriger Bestellhäufigkeit und hohem Wert pro Auftrag. Retainer-Kunden liegen bei hoher Häufigkeit und niedrigem Wert pro Auftrag. Wählen Sie ein Segment, um zu lesen, wie Hebel dort wirken.`,
          )}
        </desc>
        <line x1="50" x2="50" y1="12" y2="240" stroke="#59606A" strokeWidth="1.6" />
        <line x1="50" x2="548" y1="240" y2="240" stroke="#59606A" strokeWidth="1.6" />
        <text x="8" y="130" fontSize="12.5" fill="#59606A" transform="rotate(-90 14 130)" textAnchor="middle">{tt("value per order", "Wert pro Auftrag")}</text>
        <text x="299" y="262" fontSize="12.5" fill="#59606A" textAnchor="middle">{tt("orders per client per year", "Aufträge pro Kunde und Jahr")}</text>
        <text x="54" y="254" fontSize="12" fill="#59606A">{tt("rare", "selten")}</text>
        <text x="548" y="254" fontSize="12" fill="#59606A" textAnchor="end">{tt("frequent", "häufig")}</text>
        <text x="56" y="24" fontSize="12" fill="#59606A">{tt("large", "groß")}</text>
        <text x="56" y="232" fontSize="12" fill="#59606A">{tt("small", "klein")}</text>
        {SEGS.map((x) => {
          const on = x.id === sel;
          const pick = () => setSel(x.id);
          return (
            <g
              key={x.id}
              className="hit"
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={x.name}
              onClick={pick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick();
                }
              }}
            >
              <circle cx={x.x + 60} cy={x.y + 40} r={x.r} fill={on ? "#FBF0D6" : "#DFEEEB"} stroke={on ? "#8A5A0B" : "#0F6B6B"} strokeWidth={on ? 3 : 1.6} className="hit-shape" />
              <text x={x.x + 60} y={x.y + 45} textAnchor="middle" fontSize="14.5" fontWeight="700" fill="#1F2328">{x.short}</text>
            </g>
          );
        })}
      </svg>
      <div aria-live="polite" className="space-y-1 rounded-lg border border-line bg-paper p-4 text-caption">
        <p className="smallcaps">{s.name}</p>
        <p><span className="font-semibold text-ink">{tt("Who. ", "Wer. ")}</span>{s.what}</p>
        <p><span className="font-semibold text-ink">{tt("How levers land. ", "Wie Hebel wirken. ")}</span>{s.how}</p>
      </div>
      <Insight>
        {tt(
          "The same lever lands differently depending on which corner of this chart a segment sits in. A discount is paid on every order, so it costs little against Project's rare, large orders but adds up fast against Retainer's frequent, small ones. A relationship lever needs contact to build on, which Project barely offers between its long gaps and Retainer has in abundance.",
          "Derselbe Hebel wirkt unterschiedlich, je nachdem in welcher Ecke dieser Grafik ein Segment liegt. Ein Rabatt fällt bei jedem Auftrag an, kostet also bei den seltenen, großen Aufträgen der Projektkunden wenig, summiert sich aber schnell bei den häufigen, kleinen der Retainer-Kunden. Ein Beziehungshebel braucht Kontakt, auf dem er aufbauen kann, den Projektkunden zwischen ihren langen Pausen kaum bieten und Retainer-Kunden reichlich haben.",
        )}
      </Insight>
    </div>
  );
}

export function CardB2() {
  return (
    <MaterialCard
      id="B2"
      scan="The same lever can pay in one segment and lose money in another, because segments differ in how often and how much they buy."
      sources={["fader2005", "gupta2003"]}
      reasoning={[
        "Read a segment by its base: its number of clients and its existing repeat orders decide how much a lever can add and how much a discount gives away.",
        "Relationship levers pay where contact is frequent and orders are many; check their fixed cost against the extra orders they bring before you call them a success.",
        "Repeat rate = repeat orders ÷ clients in the segment. An uplift in percentage points of that rate, times the clients, gives the extra orders.",
        "When one lever must run across every segment, add that lever’s net impact over the segments and compare the totals. The best single lever is often no segment’s own best, and the gap between its total and the sum of the local bests is what you give up.",
      ]}
    >
      <Diagram label="Two segments" caption="Select a segment. This is the logic of recency, frequency and value, reduced to the two dimensions this course needs.">
        <SegmentMap />
      </Diagram>
      <Bul
        items={[
          <><strong>RFM-style segmentation.</strong> Score clients by <em>recency</em> (when they last bought), <em>frequency</em> (how often) and <em>monetary value</em> (how much); Fader, Hardie &amp; Lee (2005) show how these three summarise a customer base. You do not need the full model here: frequency and value alone explain why two segments react differently.</>,
          <><strong>Why it matters for a lever.</strong> A lever is a bet on a behaviour. If a segment already buys often, a relationship lever has something to build on and a discount is paid on many orders. If it buys rarely and in large amounts, the same discount is paid on a few very large orders and the relationship lever meets little contact.</>,
          <><strong>Customer value differs too.</strong> Gupta &amp; Lehmann (2003) treat customers as assets valued over their lifetime. A segment’s value depends on both how long it stays and what it brings each year, so one lever is not the best for every asset.</>,
          <><strong>Boundary.</strong> A segment is a working simplification. Inside “retainer” some clients are close to leaving and some are not; the calculation takes the segment average.</>,
        ]}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ B3 */

/** The generic formula chain, computed with the same arithmetic as the task's calculator. */
function netFixed(clients: number, upliftPp: number, gp: number, costPerClient: number) {
  const extra = (clients * upliftPp) / 100;
  return { extra, gain: extra * gp, cost: clients * costPerClient, net: extra * gp - clients * costPerClient };
}
function netDiscount(clients: number, upliftPp: number, gp: number, price: number, disc: number, baseline: number) {
  const extra = (clients * upliftPp) / 100;
  const cost = (baseline + extra) * price * disc;
  return { extra, gain: extra * gp, cost, net: extra * gp - cost };
}

export function FormulaChain() {
  const uid = useId().replace(/:/g, "");
  const boxes = [
    { x: 0, w: 130, top: tt("Extra orders", "Zusätzliche Aufträge"), sub: tt("clients × uplift", "Kunden × Steigerung") },
    { x: 148, w: 130, top: tt("× Gross profit", "× Rohertrag"), sub: tt("price × margin", "Preis × Marge") },
    { x: 296, w: 130, top: tt("− Cost", "− Kosten"), sub: tt("of the option", "der Option") },
    { x: 444, w: 116, top: tt("= Net impact", "= Nettoeffekt"), sub: tt("in € per year", "in € pro Jahr") },
  ];
  return (
    <svg viewBox="0 0 560 92" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
      <title id={`${uid}-t`}>{tt(`Net impact of a retention lever`, `Nettoeffekt eines Bindungshebels`)}</title>
      <desc id={`${uid}-d`}>
        {tt(
          `Extra orders equal clients times the uplift. Multiply by gross profit per order, which is price times margin. Subtract the cost of the option. The result is the net impact in euros per year.`,
          `Zusätzliche Aufträge sind Kunden mal Steigerung. Multiplizieren Sie mit dem Rohertrag pro Auftrag, also Preis mal Marge. Ziehen Sie die Kosten der Option ab. Das Ergebnis ist der Nettoeffekt in Euro pro Jahr.`,
        )}
      </desc>
      {boxes.map((b, i) => (
        <g key={b.x}>
          <rect x={b.x} y="10" width={b.w} height="66" rx="8" fill={i === 3 ? "#FBF0D6" : "#FFFEFA"} stroke={i === 3 ? "#8A5A0B" : "#59606A"} strokeWidth={i === 3 ? 2.4 : 1.4} />
          <text x={b.x + b.w / 2} y="40" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1F2328">{b.top}</text>
          <text x={b.x + b.w / 2} y="60" textAnchor="middle" fontSize="12.5" fill="#59606A">{b.sub}</text>
        </g>
      ))}
    </svg>
  );
}

export function CardB3() {
  const a = netFixed(20, 5, 10000, 1000);
  const d = netDiscount(20, 5, 10000, 40000, 0.05, 4);
  return (
    <MaterialCard
      id="B3"
      scan="Compare levers in euros of net impact: extra orders × gross profit per order − what the lever costs."
      sources={["nagle2018", "gupta2003"]}
      reasoning={[
        "Do the three steps in order and keep the units: extra orders (orders), gross profit per order (€ per order), cost (€). Net impact is the last line, in euros per year.",
        "A negative result is an answer, not an error. When the cost is larger than the extra gross profit the lever loses money, and the note should say so.",
        "For a discount, count the cost on every repeat order in the segment, the ones that already exist and the extra ones: a price cut is paid on all of them, including orders the client would have placed anyway.",
        "For a fixed-cost lever (account management, a value-added service), the cost is clients × the cost per client, whatever the number of orders.",
        "Cite the euro figure. A recommendation is defended by a number from your own grid, and a recommendation with no number scores 0.",
      ]}
    >
      <Diagram label="The unit of comparison" caption="The same four steps for every lever. Only the cost line changes.">
        <FormulaChain />
      </Diagram>
      <Bul
        items={[
          <><strong>Gross profit per repeat order = price × gross margin.</strong> A €40,000 contract at a 25% margin leaves €10,000 of gross profit. That is what one extra order is worth, before the cost of winning it.</>,
          <><strong>Extra orders = clients × uplift.</strong> An uplift is in percentage points of the repeat rate. 20 clients and an uplift of 5 pp is 20 × 0.05 = 1 extra order.</>,
          <><strong>Two shapes of cost.</strong> A fixed cost per client: 20 clients × €1,000 = €20,000. A discount: 5% of €40,000 is €2,000 on every repeat order, so with 4 existing repeat orders and 1 extra one it costs 5 × €2,000 = €10,000.</>,
        ]}
      />
      <Callout label="Worked example · Alpenwerk GmbH (Case assumption, illustrative, read-only)">
        <p>
          Same uplift, two levers. The fixed-cost lever: {a.extra} extra order × €10,000 = {eur(a.gain)}, less {eur(a.cost)} = <strong>{eur(a.net)}</strong>. The discount: {a.extra} extra order × €10,000 = {eur(d.gain)}, less{" "}
          (4 + {d.extra}) × €2,000 = {eur(d.cost)} = <strong>{eur(d.net)}</strong>. Same uplift, different verdicts: what decides it is how the cost is counted.
        </p>
      </Callout>
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ B4 */

const CH = { clients: 20, price: 40000, margin: 0.25, disc: 0.05, costPerClient: 600, umax: 15 };
const GP = CH.price * CH.margin;
const fixedNet = (u: number) => ((CH.clients * u) / 100) * GP - CH.clients * CH.costPerClient;
const discNet = (u: number, base: number) => {
  const e = (CH.clients * u) / 100;
  return e * GP - (base + e) * CH.price * CH.disc;
};
/** Uplift (pp) at which the discount just breaks even, for `base` existing repeat orders. */
export const discBreakEven = (base: number) => (base * CH.price * CH.disc) / (GP - CH.price * CH.disc) / CH.clients * 100;
const fixedBreakEven = (CH.clients * CH.costPerClient) / GP / CH.clients * 100;

export function BreakEvenChart() {
  const uid = useId().replace(/:/g, "");
  const [u, setU] = useState(8);
  const [base, setBase] = useState(10);
  const X0 = 60;
  const X1 = 540;
  const YM = 30000;
  const px = (v: number) => X0 + (v / CH.umax) * (X1 - X0);
  const py = (v: number) => 108 - (Math.max(-YM, Math.min(YM, v)) / YM) * 92;
  const line = (f: (v: number) => number) => [0, CH.umax].map((v) => `${px(v)},${py(f(v))}`).join(" ");
  const fN = fixedNet(u);
  const dN = discNet(u, base);
  const be = discBreakEven(base);
  const pp = tt(" pp", "\u00A0PP");
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 240" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt(`Net impact of a fixed-cost lever and a discount as the uplift grows`, `Nettoeffekt eines Fixkosten-Hebels und eines Rabatts bei wachsender Steigerung`)}</title>
        <desc id={`${uid}-d`}>
          {tt(
            `Illustrative company. Net impact in euros against the repeat-rate uplift in percentage points. The fixed-cost lever starts at minus 12,000 euros. The discount starts at minus the discount on every existing repeat order and rises more slowly. With ${base} existing repeat orders the discount breaks even at ${be.toFixed(1)} percentage points; the fixed-cost lever breaks even at ${fixedBreakEven.toFixed(1)}. At ${u} percentage points the fixed-cost lever nets ${eur(fN)} and the discount nets ${eur(dN)}.`,
            `Fiktives Unternehmen. Nettoeffekt in Euro gegen die Steigerung der Wiederkaufsrate in Prozentpunkten. Der Fixkosten-Hebel beginnt bei minus 12.000 Euro. Der Rabatt beginnt bei minus dem Rabatt auf jeden bestehenden Folgeauftrag und steigt langsamer. Bei ${base} bestehenden Folgeaufträgen erreicht der Rabatt den Break-even bei ${d1(be)} Prozentpunkten; der Fixkosten-Hebel bei ${d1(fixedBreakEven)}. Bei ${u} Prozentpunkten bringt der Fixkosten-Hebel netto ${eur(fN)} und der Rabatt netto ${eur(dN)}.`,
          )}
        </desc>
        <line x1="36" x2="64" y1="12" y2="12" stroke="#2F5D62" strokeWidth="3" />
        <text x="70" y="16" fontSize="13" fontWeight="600" fill="#2F5D62">{tt("Fixed-cost lever", "Fixkosten-Hebel")}</text>
        <line x1="230" x2="258" y1="12" y2="12" stroke="#A4472A" strokeWidth="3" strokeDasharray="7 5" />
        <text x="264" y="16" fontSize="13" fontWeight="600" fill="#A4472A">{tt("Discount", "Rabatt")}</text>
        <line x1={X0} x2={X1} y1={py(0)} y2={py(0)} stroke="#1F2328" strokeWidth="1.4" />
        <line x1={X0} x2={X0} y1="24" y2="202" stroke="#59606A" strokeWidth="1.2" />
        {[-20000, 20000].map((v) => (
          <g key={v}>
            <line x1={X0} x2={X1} y1={py(v)} y2={py(v)} stroke="#D8D1BF" strokeDasharray="3 4" />
            <text x={X0 - 6} y={py(v) + 4} textAnchor="end" fontSize="11.5" fill="#59606A">{eur(v)}</text>
          </g>
        ))}
        <text x={X0 - 6} y={py(0) + 4} textAnchor="end" fontSize="11.5" fill="#59606A">{euro(0)}</text>
        {[0, 5, 10, 15].map((v) => (
          <text key={v} x={px(v)} y="218" textAnchor="middle" fontSize="12" fill="#59606A">{v}{pp}</text>
        ))}
        <text x="300" y="234" textAnchor="middle" fontSize="12.5" fill="#59606A">{tt("repeat-rate uplift, percentage points", "Steigerung der Wiederkaufsrate, Prozentpunkte")}</text>
        <polyline points={line(fixedNet)} fill="none" stroke="#2F5D62" strokeWidth="3" />
        <polyline points={line((v) => discNet(v, base))} fill="none" stroke="#A4472A" strokeWidth="3" strokeDasharray="7 5" />
        <line x1={px(u)} x2={px(u)} y1="24" y2="202" stroke="#8A5A0B" strokeWidth="1.4" strokeDasharray="2 3" />
        <circle cx={px(u)} cy={py(fN)} r="5" fill="#2F5D62" />
        <circle cx={px(u)} cy={py(dN)} r="5" fill="#A4472A" />
      </svg>
      <Insight>
        {fN >= dN
          ? tt(
              `At ${u} pp the fixed-cost lever leads by ${eur(fN - dN)}: it only has to clear ${d1(fixedBreakEven)} pp to turn positive, while the discount — paid on all ${base} existing repeat orders plus the new ones — needs ${d1(be)} pp.`,
              `Bei ${u} PP liegt der Fixkosten-Hebel um ${eur(fN - dN)} vorn: Er muss nur ${d1(fixedBreakEven)} PP erreichen, um positiv zu werden, während der Rabatt — bezahlt auf alle ${base} bestehenden Folgeaufträge plus die neuen — ${d1(be)} PP braucht.`,
            )
          : tt(
              `At ${u} pp the discount leads by ${eur(dN - fN)}: with only ${base} existing repeat orders to discount, it clears its ${d1(be)} pp break-even before the fixed-cost lever clears its own ${d1(fixedBreakEven)} pp.`,
              `Bei ${u} PP liegt der Rabatt um ${eur(dN - fN)} vorn: Bei nur ${base} bestehenden Folgeaufträgen, auf die er gewährt wird, erreicht er seinen Break-even von ${d1(be)} PP, bevor der Fixkosten-Hebel seinen eigenen von ${d1(fixedBreakEven)} PP erreicht.`,
            )}{" "}
        {tt(
          "Drag \"Existing repeat orders\" up and the discount's break-even moves right — the fixed-cost lever's does not, because it is never paid per order.",
          "Ziehen Sie „Bestehende Folgeaufträge“ nach oben, und der Break-even des Rabatts wandert nach rechts — der des Fixkosten-Hebels nicht, weil er nie pro Auftrag gezahlt wird.",
        )}
      </Insight>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-u`} className="text-caption font-semibold">{tt("Uplift in the repeat rate: ", "Steigerung der Wiederkaufsrate: ")}<span className="tnum">{u}{pp}</span></label>
          <p className="text-micro normal-case tracking-normal text-ash">{tt("How many percentage points the lever adds to the repeat rate.", "Um wie viele Prozentpunkte der Hebel die Wiederkaufsrate erhöht.")}</p>
          <input id={`${uid}-u`} type="range" min={0} max={CH.umax} step={1} value={u} onChange={(e) => setU(Number(e.target.value))} className="range-accent" />
        </div>
        <div>
          <label htmlFor={`${uid}-b`} className="text-caption font-semibold">{tt("Existing repeat orders: ", "Bestehende Folgeaufträge: ")}<span className="tnum">{base}</span></label>
          <p className="text-micro normal-case tracking-normal text-ash">{tt("Orders the segment already places. The discount is paid on all of them.", "Aufträge, die das Segment schon erteilt. Der Rabatt fällt auf alle an.")}</p>
          <input id={`${uid}-b`} type="range" min={0} max={12} step={1} value={base} onChange={(e) => setBase(Number(e.target.value))} className="range-accent" />
        </div>
      </div>
    </div>
  );
}

export function CardB4() {
  return (
    <MaterialCard
      id="B4"
      scan="Clients leave for reasons of trust and relationship. A discount pays everyone, including those who would have stayed."
      sources={["burnham2003", "kahneman1979", "samuelson1988", "kahneman1991", "morgan1994", "gustafsson2005", "nagle2018"]}
      reasoning={[
        "Ask what drives the churn before you choose a lever: relationship or trust → account management; perceived value → a value-added service; price → a discount. A discount is the right tool only for the third.",
        "Test a discount by its break-even: extra orders needed = existing repeat orders × the discount per order ÷ (gross profit per order − the discount per order); divide by the clients for the uplift. The more repeat orders a segment already has, the higher the bar.",
        "A lever that wins on the numbers can still be the weak tool. Say what the number rests on (the uplift assumption) and what would break it, rather than defending the figure as fact.",
        "This is an argument from the mechanism, not a rule. Where a segment has few existing repeat orders, a discount can still pay; the calculation, not the slogan, decides.",
      ]}
    >
      <Diagram label="Break-even of a discount against a fixed-cost lever · illustrative company" caption="Case assumption: 20 clients, a €40,000 contract, a 25% margin, a 5% discount, and a fixed lever at €600 per client. Move both sliders.">
        <BreakEvenChart />
      </Diagram>
      <Bul
        items={[
          <><strong>Why price is the wrong lever against relationship churn.</strong> In long-cycle B2B IT, switching means procedural, financial and relational costs (Burnham, Frels &amp; Mahajan, 2003), and people stay with the option they have unless leaving feels safer than staying: loss aversion and status-quo bias (Kahneman &amp; Tversky, 1979; Samuelson &amp; Zeckhauser, 1988; Kahneman, Knetsch &amp; Thaler, 1991). What breaks that hold is a failure of trust or of the relationship, not a slightly higher price. Morgan &amp; Hunt (1994) tie continuity to trust and commitment, and Gustafsson, Johnson &amp; Roos (2005) separate affective commitment (the relationship) from calculative commitment (the economics).</>,
          <><strong>What a discount actually does.</strong> It cuts the price on every repeat order, so it gives margin away on orders that would have come anyway. Whether that pays depends on how many such orders exist: the chart shows the same discount winning when the segment has few and losing when it has many. Nagle &amp; Müller (2018) build pricing decisions on exactly this break-even logic.</>,
          <><strong>Boundary.</strong> The chart is an illustration with invented figures. In the task the uplifts are given, so treat them as assumptions to defend, not as facts.</>,
        ]}
      />
      <Callout label="Read the chart">
        <p>
          Set the existing repeat orders to 2 and the discount breaks even at {discBreakEven(2).toFixed(1)} pp, before the fixed-cost lever. Set them to 10 and it needs {discBreakEven(10).toFixed(1)} pp, well after it. Nothing about the discount changed; the base it is paid on did.
        </p>
      </Callout>
    </MaterialCard>
  );
}

/** The B3 worked example on a different company, as a reusable callout (Case assumption, read-only). */
export function B3WorkedExample() {
  const a = netFixed(20, 5, 10000, 1000);
  const d = netDiscount(20, 5, 10000, 40000, 0.05, 4);
  return (
    <Callout label={tt("Worked example · Alpenwerk GmbH (Case assumption, illustrative, read-only)", "Rechenbeispiel · Alpenwerk GmbH (Fallannahme, zur Veranschaulichung, nur lesbar)")}>
      <p>
        {tt(
          <>
            Same uplift, two levers. The fixed-cost lever: {a.extra} extra order × €10,000 = {eur(a.gain)}, less {eur(a.cost)} = <strong>{eur(a.net)}</strong>. The discount: {a.extra} extra order × €10,000 = {eur(d.gain)}, less (4 + {d.extra}) × €2,000 = {eur(d.cost)} = <strong>{eur(d.net)}</strong>. Same uplift, different verdicts: what decides it is how the cost is counted.
          </>,
          <>
            Gleiche Steigerung, zwei Hebel. Der Fixkosten-Hebel: {a.extra} zusätzlicher Auftrag × {euro(10000)} = {eur(a.gain)}, abzüglich {eur(a.cost)} = <strong>{eur(a.net)}</strong>. Der Rabatt: {a.extra} zusätzlicher Auftrag × {euro(10000)} = {eur(d.gain)}, abzüglich (4 + {d.extra}) × {euro(2000)} = {eur(d.cost)} = <strong>{eur(d.net)}</strong>. Gleiche Steigerung, verschiedene Urteile: Entscheidend ist, wie die Kosten gezählt werden.
          </>,
        )}
      </p>
    </Callout>
  );
}

/** The B4 reading of the break-even chart, as a reusable callout. */
export function B4ReadChart() {
  return (
    <Callout label={tt("Read the chart", "Die Grafik lesen")}>
      <p>
        {tt(
          <>
            Set the existing repeat orders to 2 and the discount breaks even at {discBreakEven(2).toFixed(1)} pp, before the fixed-cost lever. Set them to 10 and it needs {discBreakEven(10).toFixed(1)} pp, well after it. Nothing about the discount changed; the base it is paid on did.
          </>,
          <>
            Stellen Sie die bestehenden Folgeaufträge auf 2, und der Rabatt erreicht seinen Break-even bei {d1(discBreakEven(2))} PP, vor dem Fixkosten-Hebel. Stellen Sie sie auf 10, braucht er {d1(discBreakEven(10))} PP, deutlich danach. Am Rabatt hat sich nichts geändert; die Basis, auf der er gezahlt wird, schon.
          </>,
        )}
      </p>
    </Callout>
  );
}
