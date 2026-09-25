"use client";

import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { Bul, Diagram } from "@/components/materi/kit";
import { JourneyPhases, KpiLadder, MotiveLadder, SortExample } from "@/components/materi/MateriA";
import { B3WorkedExample, B4ReadChart, BreakEvenChart, FormulaChain, LeverMap, SegmentMap } from "@/components/materi/MateriB";
import { ChainMap, ControlLoop, GovTable, ScaleChart } from "@/components/materi/MateriC";
import { GOV_TESTS, OWNERS, OWNER_PROFILE, ownerLabel } from "@/data/program";
import { PHASE_PAIR_TESTS, PHASE_TESTS } from "@/data/touchpoints";
import { tt } from "@/lib/lang";

/**
 * Materi A of the Friday day (CLAUDE.md #29): six short cards, two per level, sixty minutes in all. Each card
 * reuses the diagrams of the full Materi B and C (kept for the optional Routes 2 and 3) and carries only the
 * decision rules the Case File uses. Levels: A1 and A2 are Level 1, A3 and A4 are Level 2, A5 and A6 are Level 3.
 * Everything a learner reads here is available in English and German (`tt`).
 */

/* ------------------------------------------------------------------ A1 · Level 1 */

export function CardA1() {
  return (
    <MaterialCard
      id="A1"
      scan={tt(
        "Choose the sales action from the buyer’s motive, not from your product’s feature list.",
        "Wählen Sie die Vertriebsmaßnahme nach dem Motiv des Käufers, nicht nach der Merkmalsliste Ihres Produkts.",
      )}
      sources={["bauer1960", "morgan1994", "anderson2006", "iso27001", "bsic5", "gdpr"]}
      reasoning={tt<string[]>(
        [
          "Name the motive first (trust, price, benefit or relationship), then choose the action and the proof. If you cannot say which motive an action serves, it is a feature pitch.",
          "Match the action to the motive: trust → references, a pilot and compliance proof; price → the total cost made visible; benefit → a value case in the buyer’s own figures; relationship → named, stable contacts and a review rhythm.",
          "An action aimed at a different motive spends effort without touching the reason. A discount answers the price motive only; offered against a trust or relationship motive it gives margin away and leaves the reason in place.",
          "A motive is inferred from evidence, and one observation is not evidence of a motive. State what you saw before you name what it means.",
        ],
        [
          "Benennen Sie zuerst das Motiv (Vertrauen, Preis, Nutzen oder Beziehung), dann wählen Sie Maßnahme und Beleg. Wenn Sie nicht sagen können, welchem Motiv eine Maßnahme dient, ist es ein Merkmals-Pitch.",
          "Ordnen Sie die Maßnahme dem Motiv zu: Vertrauen → Referenzen, ein Pilot und Compliance-Nachweise; Preis → die Gesamtkosten sichtbar gemacht; Nutzen → eine Nutzenrechnung in den eigenen Zahlen des Käufers; Beziehung → benannte, beständige Ansprechpartner und ein Review-Rhythmus.",
          "Eine Maßnahme, die auf ein anderes Motiv zielt, verbraucht Aufwand, ohne den Grund zu berühren. Ein Rabatt antwortet nur auf das Preismotiv; gegen ein Vertrauens- oder Beziehungsmotiv verschenkt er Marge und lässt den Grund bestehen.",
          "Ein Motiv wird aus Belegen erschlossen, und eine einzelne Beobachtung ist kein Beleg für ein Motiv. Sagen Sie, was Sie gesehen haben, bevor Sie benennen, was es bedeutet.",
        ],
      )}
    >
      <Diagram label={tt("Motive → strategy", "Motiv → Strategie")} caption={tt("Select a motive to read the proof that buyer needs.", "Wählen Sie ein Motiv, um den Beleg zu lesen, den dieser Käufer braucht.")}>
        <MotiveLadder />
      </Diagram>
      <Bul
        items={tt(
          [
            <><strong>What it is.</strong> A behaviour-based sales strategy starts from why this buyer would act, the buying <em>motive</em>, and derives the sales action and the proof from it. A feature-led pitch starts from what the product does and hopes the motive matches.</>,
            <><strong>Why it matters in long-cycle IT procurement.</strong> The buyer carries the risk of a wrong choice personally: Bauer (1960) called this perceived risk. Where risk aversion is the motive, the strategy is to build trust: references, a pilot phase and compliance proof, exactly the things a security-minded committee can check.</>,
            <><strong>Trust is built, not asserted.</strong> Morgan &amp; Hunt (1994) found that trust and commitment together carry a business relationship forward. Anderson, Narus &amp; van Rossum (2006) add the value side: a customer value proposition states the points of difference the buyer will actually get.</>,
          ],
          [
            <><strong>Was es ist.</strong> Eine verhaltensbasierte Verkaufsstrategie geht davon aus, warum dieser Käufer handeln würde, dem <em>Kaufmotiv</em>, und leitet daraus Maßnahme und Beleg ab. Ein merkmalsgetriebener Pitch geht davon aus, was das Produkt kann, und hofft, dass das Motiv passt.</>,
            <><strong>Warum das in langen IT-Beschaffungen zählt.</strong> Der Käufer trägt das Risiko einer Fehlentscheidung persönlich: Bauer (1960) nannte das wahrgenommenes Risiko. Ist Risikoaversion das Motiv, lautet die Strategie, Vertrauen aufzubauen: Referenzen, eine Pilotphase und Compliance-Nachweise, genau das, was ein sicherheitsbewusstes Gremium prüfen kann.</>,
            <><strong>Vertrauen wird aufgebaut, nicht behauptet.</strong> Morgan &amp; Hunt (1994) fanden, dass Vertrauen und Bindung zusammen eine Geschäftsbeziehung tragen. Anderson, Narus &amp; van Rossum (2006) ergänzen die Wertseite: Ein Kundennutzenversprechen nennt die Unterschiede, die der Käufer tatsächlich bekommt.</>,
          ],
        )}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A2 · Level 1 */

export function CardA2() {
  const rules = tt<string[]>(
    [
      "To sort a stage, ask two questions. (1) By this point, are a named buyer contact and a seller in a scheduled or held conversation? (2) Does this event come after the signature? No to both → pre-sales. Yes to the first only → sales, up to and including the signature itself. Anything after the signature → after-sales.",
      "A booked consultation is sales: a seller now owns a named contact and a date. Contact details or a download are first contact but still pre-sales: nobody has spoken to the person yet.",
      "The signature is the last sales event, not the first after-sales one. A phase can be empty in a funnel: a funnel counts people up to the signature, so after-sales never appears as a stage; it shows in other numbers, such as the repeat-purchase rate.",
      "Compute each step from its own two counts: this stage ÷ the stage above it × 100. Never divide by the top of the funnel.",
      "Counts fall at every stage by design. The step that loses the most people is not the step with the largest gap: rank the steps by the gap to their benchmark, in percentage points, and take the most negative.",
      "A gap is actual minus benchmark, in percentage points (pp), with its sign. 42.7% against 75% is −32.3 pp, not −43%; a relative percentage answers a different question.",
      "State the cost of a leak as a number you can trace: prospects lost × the funnel’s own downstream conversion (× the contract value if the case gives one). Do not import a figure the case never printed.",
      "A benchmark is a comparison point, not a verdict. A gap tells you where to ask “why here?”; it does not tell you the cause.",
    ],
    [
      "Um eine Stufe zuzuordnen, stellen Sie zwei Fragen. (1) Führen zu diesem Zeitpunkt ein namentlich bekannter Ansprechpartner des Käufers und ein Verkäufer ein geplantes oder geführtes Gespräch? (2) Kommt dieses Ereignis nach der Unterschrift? Zweimal nein → Pre-Sales. Nur die erste Frage ja → Vertrieb, bis einschließlich der Unterschrift selbst. Alles nach der Unterschrift → After-Sales.",
      "Ein gebuchter Beratungstermin gehört zum Vertrieb: Ein Verkäufer hat jetzt einen namentlich bekannten Ansprechpartner und einen Termin. Kontaktdaten oder ein Download sind Erstkontakt, aber noch Pre-Sales: Niemand hat mit der Person gesprochen.",
      "Die Unterschrift ist das letzte Vertriebsereignis, nicht das erste After-Sales-Ereignis. Eine Phase kann in einem Trichter leer sein: Ein Trichter zählt Personen bis zur Unterschrift, deshalb erscheint After-Sales nie als Stufe; es zeigt sich in anderen Zahlen, etwa der Wiederkaufsrate.",
      "Berechnen Sie jeden Schritt aus seinen eigenen zwei Zahlen: diese Stufe ÷ die Stufe darüber × 100. Teilen Sie nie durch die Spitze des Trichters.",
      "Die Zahlen fallen von Stufe zu Stufe von selbst. Der Schritt, der die meisten Personen verliert, ist nicht der Schritt mit der größten Abweichung: Ordnen Sie die Schritte nach der Abweichung von ihrem Benchmark, in Prozentpunkten, und nehmen Sie die negativste.",
      "Eine Abweichung ist Ist minus Benchmark, in Prozentpunkten (PP), mit Vorzeichen. 42,7 % gegenüber 75 % sind −32,3 PP, nicht −43 %; ein relativer Prozentwert beantwortet eine andere Frage.",
      "Nennen Sie die Kosten eines Lecks als Zahl, die Sie nachvollziehen können: verlorene Interessenten × die nachgelagerte Konversion des Trichters (× den Vertragswert, wenn der Fall einen nennt). Übernehmen Sie keine Zahl, die der Fall nie gedruckt hat.",
      "Ein Benchmark ist ein Vergleichspunkt, kein Urteil. Eine Abweichung sagt Ihnen, wo Sie fragen sollten „Warum hier?“; sie nennt nicht die Ursache.",
    ],
  );
  const pairs = PHASE_PAIR_TESTS.slice(0, 2).map((t) => `${t.pair} ${t.test}`);
  return (
    <MaterialCard
      id="A2"
      scan={tt(
        "Sort a stage into the right journey phase, then read the funnel by each step’s gap to its benchmark, in percentage points.",
        "Ordnen Sie eine Stufe der richtigen Journey-Phase zu, und lesen Sie dann den Trichter an der Abweichung jedes Schritts von seinem Benchmark, in Prozentpunkten.",
      )}
      sources={["lemon2016", "gartner2017", "gupta2003", "reichheld1990"]}
      reasoning={[...rules.slice(0, 3), ...pairs, ...rules.slice(3)]}
    >
      <Diagram
        label={tt("Customer journey map", "Customer-Journey-Karte")}
        caption={tt(
          "Eight touchpoints, three phases and the two boundaries used in this course. Select a touchpoint to read what it covers.",
          "Acht Kontaktpunkte, drei Phasen und die zwei Grenzen, die dieser Kurs nutzt. Wählen Sie einen Kontaktpunkt, um zu lesen, was er umfasst.",
        )}
      >
        <JourneyPhases />
      </Diagram>
      <DataTable
        caption={tt("One test question per phase, and what belongs in it", "Eine Testfrage je Phase, und was hineingehört")}
        head={tt(["Phase", "The test question", "What belongs", "What does not"], ["Phase", "Die Testfrage", "Was hineingehört", "Was nicht hineingehört"])}
        rows={PHASE_TESTS.map((t) => [t.name, t.test, t.belongs, t.notBelongs])}
      />
      <Diagram
        label={tt("Worked sort · Alpenwerk GmbH (Case assumption, illustrative, read-only)", "Durchgespielte Zuordnung · Alpenwerk GmbH (Fallannahme, zur Veranschaulichung, nur lesbar)")}
        caption={tt(
          "A different company's stages, sorted with the same tests you will use in Part 1. Select a stage to read why it sits in its phase.",
          "Stufen eines anderen Unternehmens, mit denselben Tests zugeordnet, die Sie in Teil 1 verwenden. Wählen Sie eine Stufe, um zu lesen, warum sie in ihrer Phase liegt.",
        )}
      >
        <SortExample />
      </Diagram>
      <Diagram
        label={tt("Worked example · Alpenwerk GmbH (illustrative, read-only)", "Rechenbeispiel · Alpenwerk GmbH (zur Veranschaulichung, nur lesbar)")}
        caption={tt(
          "Case assumption. Two steps of a different company, computed the way Part 1 asks you to read DigitalIT Solutions.",
          "Fallannahme. Zwei Schritte eines anderen Unternehmens, so berechnet, wie Sie in Teil 1 DigitalIT Solutions lesen sollen.",
        )}
      >
        <KpiLadder />
      </Diagram>
      <div className="grid gap-3 md:grid-cols-3">
        <Callout label={tt("Conversion rate · gap", "Konversionsrate · Abweichung")}>
          <p>
            {tt(
              <>Conversion = count at this stage ÷ count at the stage above × 100. Gap = actual % − benchmark %, in <strong>percentage points</strong>.</>,
              <>Konversion = Zahl dieser Stufe ÷ Zahl der Stufe darüber × 100. Abweichung = Ist-% − Benchmark-%, in <strong>Prozentpunkten</strong>.</>,
            )}
          </p>
        </Callout>
        <Callout label={tt("Customer value (CLV)", "Kundenwert (CLV)")}>
          <p>
            {tt(
              <>The gross profit one client is expected to bring over the whole relationship. Simple form: annual gross profit per client × expected years, with expected years ≈ 1 ÷ (1 − retention). At €12,000 a year and 80% retention that is 5 years and €60,000 (undiscounted; Gupta &amp; Lehmann, 2003).</>,
              <>Der Rohertrag, den ein Kunde über die gesamte Beziehung voraussichtlich bringt. Einfache Form: jährlicher Rohertrag pro Kunde × erwartete Jahre, mit erwarteten Jahren ≈ 1 ÷ (1 − Bindung). Bei 12.000 € im Jahr und 80 % Bindung sind das 5 Jahre und 60.000 € (nicht abgezinst; Gupta &amp; Lehmann, 2003).</>,
            )}
          </p>
        </Callout>
        <Callout label={tt("Repurchase rate", "Wiederkaufsrate")}>
          <p>
            {tt(
              "Existing clients who re-order within a stated window ÷ existing clients. 12 of 40 clients re-ordering within 18 months is 30.0%. The window is part of the definition: state it.",
              "Bestandskunden, die innerhalb eines festgelegten Zeitraums erneut bestellen ÷ Bestandskunden. 12 von 40 Kunden, die innerhalb von 18 Monaten erneut bestellen, sind 30,0 %. Der Zeitraum gehört zur Definition: Nennen Sie ihn.",
            )}
          </p>
        </Callout>
      </div>
      <Bul
        items={tt(
          [
            <><strong>Why retention gets its own number.</strong> Reichheld &amp; Sasser (1990) found that cutting defections by 5% raised profits by 25% to 85% across the service industries they studied. A funnel shows how a company wins clients; the repurchase rate shows whether it keeps them.</>,
            <><strong>Cost of a leak, worked (Alpenwerk, Case assumption).</strong> 60 consultations booked, 45 held: 15 prospects fall out. Of every 45 held, 6 sign (13.3%), so the 15 would have brought about 15 × 6 ÷ 45 = <strong>2.0 contracts</strong>. At €50,000 a contract that is about €100,000 of revenue a year. The figure assumes the lost prospects would have behaved like the ones who were held: an estimate to size a leak, not a forecast.</>,
            <><strong>Buyers research without you.</strong> Gartner (2017) found buyers spend about 17% of buying time meeting suppliers, so much of the journey is pre-sales research you do not see (Lemon &amp; Verhoef, 2016).</>,
          ],
          [
            <><strong>Warum Bindung eine eigene Zahl bekommt.</strong> Reichheld &amp; Sasser (1990) fanden, dass eine um 5 % geringere Abwanderung die Gewinne in den untersuchten Dienstleistungsbranchen um 25 % bis 85 % steigerte. Ein Trichter zeigt, wie ein Unternehmen Kunden gewinnt; die Wiederkaufsrate zeigt, ob es sie hält.</>,
            <><strong>Kosten eines Lecks, durchgerechnet (Alpenwerk, Fallannahme).</strong> 60 Beratungstermine gebucht, 45 geführt: 15 Interessenten fallen heraus. Von je 45 geführten unterzeichnen 6 (13,3 %), die 15 hätten also etwa 15 × 6 ÷ 45 = <strong>2,0 Verträge</strong> gebracht. Bei 50.000 € je Vertrag sind das rund 100.000 € Umsatz pro Jahr. Die Zahl unterstellt, dass sich die verlorenen Interessenten wie die geführten verhalten hätten: eine Schätzung, um ein Leck zu beziffern, keine Prognose.</>,
            <><strong>Käufer recherchieren ohne Sie.</strong> Gartner (2017) fand, dass Käufer etwa 17 % ihrer Kaufzeit mit Lieferanten verbringen, sodass ein großer Teil der Journey Pre-Sales-Recherche ist, die Sie nicht sehen (Lemon &amp; Verhoef, 2016).</>,
          ],
        )}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A3 · Level 2 */

export function CardA3() {
  return (
    <MaterialCard
      id="A3"
      scan={tt(
        "Each lever answers one buying motive. Compare levers in euros of net impact: extra orders × gross profit per order − what the lever costs.",
        "Jeder Hebel antwortet auf ein Kaufmotiv. Vergleichen Sie Hebel im Nettoeffekt in Euro: zusätzliche Aufträge × Rohertrag pro Auftrag − was der Hebel kostet.",
      )}
      sources={["morgan1994", "anderson2006", "reichheld1990", "dick1994", "nagle2018", "gupta2003"]}
      reasoning={tt<string[]>(
        [
          "Map lever to motive: personal account management → relationship and trust; discounting → price; a value-added service → perceived benefit. Choose by cause, then by cost: ask why the client would not return, pick the lever that answers that cause, and only then compare in euros.",
          "The three levers cost different things. A and C are a fixed cost per client per year; a discount is margin given up on every order it applies to. So compare them in net euros, not in list price or in the size of the uplift alone.",
          "Do the three steps in order and keep the units: extra orders (orders), gross profit per order (€ per order), cost (€). Net impact is the last line, in euros per year.",
          "Extra orders = clients × uplift ÷ 100, where the uplift is in percentage points of the repeat rate. Gross profit per order = price × margin.",
          "A negative result is an answer, not an error. When the cost is larger than the extra gross profit the lever loses money, and the note should say so.",
          "For a discount, count the cost on every repeat order in the segment, the ones that already exist and the extra ones: a price cut is paid on all of them, including orders the client would have placed anyway.",
          "For a fixed-cost lever (account management, a value-added service), the cost is clients × the cost per client, whatever the number of orders.",
          "Take the uplift as printed in the task: it is an assumption you are given. Cite the euro figure: a recommendation is defended by a number from your own grid, and a recommendation with no number scores 0.",
        ],
        [
          "Ordnen Sie Hebel und Motiv zu: persönliche Kundenbetreuung → Beziehung und Vertrauen; Rabatt → Preis; Zusatzleistung → wahrgenommener Nutzen. Wählen Sie nach der Ursache, dann nach den Kosten: Fragen Sie, warum der Kunde nicht wiederkäme, wählen Sie den Hebel, der auf diese Ursache antwortet, und vergleichen Sie erst dann in Euro.",
          "Die drei Hebel kosten Unterschiedliches. A und C sind ein fester Kostenblock pro Kunde und Jahr; ein Rabatt ist Marge, die bei jedem Auftrag verschenkt wird, für den er gilt. Vergleichen Sie sie also im Nettoeuro, nicht im Listenpreis und nicht allein an der Größe der Steigerung.",
          "Gehen Sie die drei Schritte der Reihe nach und behalten Sie die Einheiten: zusätzliche Aufträge (Aufträge), Rohertrag pro Auftrag (€ pro Auftrag), Kosten (€). Der Nettoeffekt ist die letzte Zeile, in Euro pro Jahr.",
          "Zusätzliche Aufträge = Kunden × Steigerung ÷ 100, wobei die Steigerung in Prozentpunkten der Wiederkaufsrate angegeben ist. Rohertrag pro Auftrag = Preis × Marge.",
          "Ein negatives Ergebnis ist eine Antwort, kein Fehler. Sind die Kosten größer als der zusätzliche Rohertrag, verliert der Hebel Geld, und die Notiz sollte das sagen.",
          "Bei einem Rabatt zählen Sie die Kosten auf jeden Folgeauftrag im Segment, die bestehenden und die zusätzlichen: Ein Preisnachlass fällt auf alle an, auch auf Aufträge, die der Kunde ohnehin erteilt hätte.",
          "Bei einem Fixkosten-Hebel (Kundenbetreuung, Zusatzleistung) betragen die Kosten Kunden × Kosten pro Kunde, egal wie viele Aufträge folgen.",
          "Nehmen Sie die Steigerung so, wie die Aufgabe sie nennt: Sie ist eine Annahme, die Ihnen vorgegeben ist. Nennen Sie die Euro-Zahl: Eine Empfehlung wird mit einer Zahl aus Ihrem eigenen Raster begründet, und eine Empfehlung ohne Zahl erhält 0 Punkte.",
        ],
      )}
    >
      <Diagram
        label={tt("Three levers", "Drei Hebel")}
        caption={tt(
          "Select a lever. The dashed stripes mark a cost paid on every order; the solid block is a cost paid per client whatever the orders.",
          "Wählen Sie einen Hebel. Die gestrichelten Streifen markieren Kosten, die bei jedem Auftrag anfallen; der volle Block sind Kosten pro Kunde, unabhängig von den Aufträgen.",
        )}
      >
        <LeverMap />
      </Diagram>
      <Diagram
        label={tt("The unit of comparison", "Die Vergleichseinheit")}
        caption={tt("The same four steps for every lever. Only the cost line changes.", "Dieselben vier Schritte für jeden Hebel. Nur die Kostenzeile ändert sich.")}
      >
        <FormulaChain />
      </Diagram>
      <Bul
        items={tt(
          [
            <><strong>Gross profit per repeat order = price × gross margin.</strong> A €40,000 contract at a 25% margin leaves €10,000 of gross profit. That is what one extra order is worth, before the cost of winning it.</>,
            <><strong>Extra orders = clients × uplift.</strong> An uplift is in percentage points of the repeat rate. 20 clients and an uplift of 5 pp is 20 × 0.05 = 1 extra order.</>,
            <><strong>Two shapes of cost.</strong> A fixed cost per client: 20 clients × €1,000 = €20,000. A discount: 5% of €40,000 is €2,000 on every repeat order, so with 4 existing repeat orders and 1 extra one it costs 5 × €2,000 = €10,000.</>,
            <><strong>Why retention is worth the effort.</strong> Reichheld &amp; Sasser (1990) found that cutting defections by 5% raised profits by 25% to 85%. Dick &amp; Basu (1994) separate real loyalty (attitude plus behaviour) from repeat purchase that comes from habit, so a lever must reach the attitude to hold.</>,
          ],
          [
            <><strong>Rohertrag pro Folgeauftrag = Preis × Bruttomarge.</strong> Ein Vertrag über 40.000 € bei 25 % Marge lässt 10.000 € Rohertrag. Das ist, was ein zusätzlicher Auftrag wert ist, vor den Kosten, ihn zu gewinnen.</>,
            <><strong>Zusätzliche Aufträge = Kunden × Steigerung.</strong> Eine Steigerung ist in Prozentpunkten der Wiederkaufsrate. 20 Kunden und eine Steigerung von 5 PP sind 20 × 0,05 = 1 zusätzlicher Auftrag.</>,
            <><strong>Zwei Kostenformen.</strong> Ein fester Betrag pro Kunde: 20 Kunden × 1.000 € = 20.000 €. Ein Rabatt: 5 % von 40.000 € sind 2.000 € bei jedem Folgeauftrag, bei 4 bestehenden Folgeaufträgen und 1 zusätzlichen kostet er also 5 × 2.000 € = 10.000 €.</>,
            <><strong>Warum sich Bindung lohnt.</strong> Reichheld &amp; Sasser (1990) fanden, dass eine um 5 % geringere Abwanderung die Gewinne um 25 % bis 85 % steigerte. Dick &amp; Basu (1994) unterscheiden echte Loyalität (Einstellung plus Verhalten) von Wiederkauf aus Gewohnheit, ein Hebel muss also die Einstellung erreichen, um zu tragen.</>,
          ],
        )}
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
      scan={tt(
        "The same lever can pay in one segment and lose money in another. A discount pays everyone, including those who would have stayed.",
        "Derselbe Hebel kann in einem Segment zahlen und in einem anderen Geld verlieren. Ein Rabatt bezahlt alle, auch die, die geblieben wären.",
      )}
      sources={["fader2005", "gupta2003", "burnham2003", "kahneman1979", "samuelson1988", "kahneman1991", "morgan1994", "gustafsson2005", "nagle2018"]}
      reasoning={tt<string[]>(
        [
          "Read a segment by its base: its number of clients and its existing repeat orders decide how much a lever can add and how much a discount gives away.",
          "Relationship levers pay where contact is frequent and orders are many; check their fixed cost against the extra orders they bring before you call them a success.",
          "Repeat rate = repeat orders ÷ clients in the segment. An uplift in percentage points of that rate, times the clients, gives the extra orders.",
          "When one lever must run across every segment, add that lever’s net impact over the segments and compare the totals. The best single lever is often no segment’s own best, and the gap between its total and the sum of the local bests is what you give up.",
          "Ask what drives the churn before you choose a lever: relationship or trust → account management; perceived value → a value-added service; price → a discount. A discount is the right tool only for the third.",
          "Test a discount by its break-even: extra orders needed = existing repeat orders × the discount per order ÷ (gross profit per order − the discount per order); divide by the clients for the uplift. The more repeat orders a segment already has, the higher the bar.",
          "A lever that wins on the numbers can still be the weak tool. Say what the number rests on (the uplift assumption) and what would break it, rather than defending the figure as fact. This is an argument from the mechanism, not a rule: where a segment has few existing repeat orders, a discount can still pay.",
        ],
        [
          "Lesen Sie ein Segment an seiner Basis: Die Zahl seiner Kunden und seine bestehenden Folgeaufträge bestimmen, wie viel ein Hebel hinzufügen kann und wie viel ein Rabatt verschenkt.",
          "Beziehungshebel zahlen sich aus, wo Kontakt häufig und Aufträge zahlreich sind; prüfen Sie ihre festen Kosten gegen die zusätzlichen Aufträge, die sie bringen, bevor Sie sie einen Erfolg nennen.",
          "Wiederkaufsrate = Folgeaufträge ÷ Kunden im Segment. Eine Steigerung in Prozentpunkten dieser Rate, mal die Kunden, ergibt die zusätzlichen Aufträge.",
          "Muss ein Hebel über alle Segmente laufen, addieren Sie den Nettoeffekt dieses Hebels über die Segmente und vergleichen Sie die Summen. Der beste einzelne Hebel ist oft nicht der beste eines Segments, und die Lücke zwischen seiner Summe und der Summe der lokalen Bestwerte ist das, worauf Sie verzichten.",
          "Fragen Sie, was die Abwanderung treibt, bevor Sie einen Hebel wählen: Beziehung oder Vertrauen → Kundenbetreuung; wahrgenommener Nutzen → eine Zusatzleistung; Preis → ein Rabatt. Ein Rabatt ist nur für Letzteres das richtige Werkzeug.",
          "Prüfen Sie einen Rabatt an seinem Break-even: nötige zusätzliche Aufträge = bestehende Folgeaufträge × Rabatt pro Auftrag ÷ (Rohertrag pro Auftrag − Rabatt pro Auftrag); teilen Sie durch die Kunden für die Steigerung. Je mehr Folgeaufträge ein Segment schon hat, desto höher die Hürde.",
          "Ein Hebel, der nach Zahlen gewinnt, kann trotzdem das schwache Werkzeug sein. Sagen Sie, worauf die Zahl beruht (die Annahme zur Steigerung) und was sie kippen würde, statt die Zahl als Tatsache zu verteidigen. Es ist ein Argument aus dem Mechanismus, keine Regel: Hat ein Segment wenige bestehende Folgeaufträge, kann sich ein Rabatt dennoch lohnen.",
        ],
      )}
    >
      <Diagram
        label={tt("Two segments", "Zwei Segmente")}
        caption={tt(
          "Select a segment. This is the logic of recency, frequency and value, reduced to the two dimensions this course needs.",
          "Wählen Sie ein Segment. Das ist die Logik von Recency, Frequency und Value, auf die zwei Dimensionen reduziert, die dieser Kurs braucht.",
        )}
      >
        <SegmentMap />
      </Diagram>
      <Diagram
        label={tt("Break-even of a discount against a fixed-cost lever · illustrative company", "Break-even eines Rabatts gegenüber einem Fixkosten-Hebel · fiktives Unternehmen")}
        caption={tt(
          "Case assumption: 20 clients, a €40,000 contract, a 25% margin, a 5% discount, and a fixed lever at €600 per client. Move both sliders.",
          "Fallannahme: 20 Kunden, ein Vertrag über 40.000 €, 25 % Marge, 5 % Rabatt und ein fester Hebel zu 600 € pro Kunde. Bewegen Sie beide Regler.",
        )}
      >
        <BreakEvenChart />
      </Diagram>
      <B4ReadChart />
      <Bul
        items={tt(
          [
            <><strong>RFM-style segmentation.</strong> Score clients by <em>recency</em>, <em>frequency</em> and <em>monetary value</em> (Fader, Hardie &amp; Lee, 2005). You do not need the full model: frequency and value alone explain why two segments react differently.</>,
            <><strong>Why price is the wrong lever against relationship churn.</strong> In long-cycle B2B IT, switching means procedural, financial and relational costs (Burnham, Frels &amp; Mahajan, 2003), and people stay with the option they have unless leaving feels safer than staying: loss aversion and status-quo bias (Kahneman &amp; Tversky, 1979; Samuelson &amp; Zeckhauser, 1988; Kahneman, Knetsch &amp; Thaler, 1991). What breaks that hold is a failure of trust or of the relationship, not a slightly higher price (Morgan &amp; Hunt, 1994; Gustafsson, Johnson &amp; Roos, 2005).</>,
            <><strong>What a discount actually does.</strong> It cuts the price on every repeat order, so it gives margin away on orders that would have come anyway. Nagle &amp; Müller (2018) build pricing decisions on exactly this break-even logic. The chart uses invented figures; in the task the uplifts are given, so treat them as assumptions to defend, not as facts.</>,
          ],
          [
            <><strong>RFM-artige Segmentierung.</strong> Bewerten Sie Kunden nach <em>Recency</em>, <em>Frequency</em> und <em>Monetary Value</em> (Fader, Hardie &amp; Lee, 2005). Sie brauchen nicht das volle Modell: Häufigkeit und Wert allein erklären, warum zwei Segmente unterschiedlich reagieren.</>,
            <><strong>Warum Preis das falsche Mittel gegen Beziehungs-Abwanderung ist.</strong> Im langen B2B-IT-Geschäft bedeutet Wechseln prozessuale, finanzielle und beziehungsbezogene Kosten (Burnham, Frels &amp; Mahajan, 2003), und Menschen bleiben bei der Option, die sie haben, außer der Wechsel fühlt sich sicherer an als das Bleiben: Verlustaversion und Status-quo-Verzerrung (Kahneman &amp; Tversky, 1979; Samuelson &amp; Zeckhauser, 1988; Kahneman, Knetsch &amp; Thaler, 1991). Was diesen Halt löst, ist ein Vertrauens- oder Beziehungsbruch, nicht ein etwas höherer Preis (Morgan &amp; Hunt, 1994; Gustafsson, Johnson &amp; Roos, 2005).</>,
            <><strong>Was ein Rabatt tatsächlich tut.</strong> Er senkt den Preis bei jedem Folgeauftrag und verschenkt so Marge auf Aufträge, die ohnehin gekommen wären. Nagle &amp; Müller (2018) bauen Preisentscheidungen genau auf dieser Break-even-Logik auf. Die Grafik nutzt erfundene Zahlen; in der Aufgabe sind die Steigerungen vorgegeben, behandeln Sie sie also als Annahmen, die Sie begründen, nicht als Tatsachen.</>,
          ],
        )}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A5 · Level 3 */

export function CardA5() {
  return (
    <MaterialCard
      id="A5"
      scan={tt(
        "A retention strategy is not one action. It is a set of actions, each tied to a goal above it and a KPI below it, and a system that reads the result.",
        "Eine Bindungsstrategie ist nicht eine einzelne Maßnahme. Sie ist eine Menge von Maßnahmen, jede an ein Ziel über ihr und eine KPI unter ihr gebunden, und ein System, das das Ergebnis liest.",
      )}
      sources={["kaplan1992", "doran1981", "deming1986", "nagle2018"]}
      reasoning={tt<string[]>(
        [
          "Write every funded item as goal → action → KPI (Ziel → Maßnahme → KPI). An item you cannot write that way is not ready to fund: an action with no KPI cannot be governed, and a KPI with no action is a number nobody acts on.",
          "Each item in the task has its own KPI: the lever is judged by the repeat-purchase rate, the funnel fix by the show-up rate, the training by proposal → signed conversion, and the dashboard by the three KPIs being published each month. A retention lever acts on the repeat-purchase rate; the conversion rate is a funnel measure and is not the lever’s target.",
          "A KPI needs a baseline before its action starts. If the action launches first, or with the dashboard, its early months cannot be read. That is the sequencing rule: fund and start the measurement first.",
          "Separate the action from the system. A one-off fix (a discount campaign, a single training day) has no owner, no cadence and no trigger: it spends the money and nobody reads the result. A system adds those three, so the action can be corrected.",
          "A governance plan is part of the funding decision. When you cut an item, the plan must not pretend it is still in place: a KPI that lost its dashboard cannot have a monthly reading; write what replaces it, or say it is unowned.",
          "Prefer a correctable small action to an uncorrectable large one: a partial fix with a trigger teaches you more than a full fix nobody reads.",
        ],
        [
          "Schreiben Sie jeden finanzierten Posten als Ziel → Maßnahme → KPI. Einen Posten, den Sie so nicht schreiben können, ist nicht bereit für Geld: Eine Maßnahme ohne KPI lässt sich nicht steuern, und eine KPI ohne Maßnahme ist eine Zahl, auf die niemand reagiert.",
          "Jeder Posten der Aufgabe hat seine eigene KPI: Der Hebel wird an der Wiederkaufsrate gemessen, die Trichter-Behebung an der Erscheinungsquote, die Schulung an der Konversion Angebot → Unterschrift und das Dashboard daran, dass die drei KPIs jeden Monat veröffentlicht werden. Ein Bindungshebel wirkt auf die Wiederkaufsrate; die Konversionsrate ist eine Trichterkennzahl und nicht das Ziel des Hebels.",
          "Eine KPI braucht einen Ausgangswert, bevor ihre Maßnahme startet. Startet die Maßnahme zuerst oder gleichzeitig mit dem Dashboard, sind ihre ersten Monate nicht lesbar. Das ist die Reihenfolgeregel: Finanzieren und starten Sie zuerst die Messung.",
          "Trennen Sie die Maßnahme vom System. Eine einmalige Korrektur (eine Rabattaktion, ein einzelner Schulungstag) hat keinen Owner, keinen Rhythmus und keinen Auslöser: Sie gibt das Geld aus, und niemand liest das Ergebnis. Ein System ergänzt diese drei, sodass die Maßnahme korrigiert werden kann.",
          "Ein Steuerungsplan gehört zur Finanzierungsentscheidung. Streichen Sie einen Posten, darf der Plan nicht so tun, als bestünde er noch: Eine KPI, die ihr Dashboard verloren hat, kann keine monatliche Messung haben; schreiben Sie, was sie ersetzt, oder dass sie ohne Owner ist.",
          "Bevorzugen Sie eine korrigierbare kleine Maßnahme vor einer nicht korrigierbaren großen: Eine Teillösung mit Auslöser lehrt Sie mehr als eine vollständige, die niemand liest.",
        ],
      )}
    >
      <Diagram
        label="Ziel → Maßnahme → KPI"
        caption={tt(
          "Case assumption: Alpenwerk GmbH, illustrative. Select a row. The same chain is what the Case File asks you to write for DigitalIT Solutions.",
          "Fallannahme: Alpenwerk GmbH, zur Veranschaulichung. Wählen Sie eine Zeile. Dieselbe Kette sollen Sie in der Fallakte für DigitalIT Solutions schreiben.",
        )}
      >
        <ChainMap />
      </Diagram>
      <Diagram
        label={tt("One-off fix against a governed system", "Einmalige Korrektur gegenüber gesteuertem System")}
        caption={tt(
          "The loop on the left is what turns an action into a system. The dashed box on the right is the one-off fix. Select a step.",
          "Die Schleife links macht aus einer Maßnahme ein System. Der gestrichelte Kasten rechts ist die einmalige Korrektur. Wählen Sie einen Schritt.",
        )}
      >
        <ControlLoop />
      </Diagram>
      <Bul
        items={tt(
          [
            <><strong>The framework, named so you can cite it.</strong> <em>Ziel → Maßnahme → KPI</em> (goal → action → metric) is the control logic of this course. It is the same line of sight as Kaplan &amp; Norton’s (1992) scorecard. Doran (1981) asks that a goal be specific, measurable, assignable, realistic and time-related: “raise repeat purchase from 30% to 35% in 18 months” passes; “improve loyalty” does not.</>,
            <><strong>A governed system.</strong> An owner per KPI, a review cadence and an escalation trigger. Deming (1986) called the cycle plan, do, study, act. A cut you can measure is a cut you can reverse; a cut in the dark is a bet you cannot review.</>,
            <><strong>Boundary.</strong> A KPI can be gamed or misread, and a loop costs attention: three KPIs on a monthly rhythm is what a four-month window can carry.</>,
          ],
          [
            <><strong>Das Rahmenwerk, so benannt, dass Sie es zitieren können.</strong> <em>Ziel → Maßnahme → KPI</em> ist die Steuerungslogik dieses Kurses. Es ist dieselbe Sichtlinie wie in der Scorecard von Kaplan &amp; Norton (1992). Doran (1981) verlangt, dass ein Ziel spezifisch, messbar, zuweisbar, realistisch und terminiert ist: „Die Wiederkaufsrate in 18 Monaten von 30 % auf 35 % steigern“ besteht; „Loyalität verbessern“ nicht.</>,
            <><strong>Ein gesteuertes System.</strong> Ein Owner je KPI, ein Review-Rhythmus und ein Eskalations-Auslöser. Deming (1986) nannte den Zyklus Plan, Do, Study, Act. Eine Kürzung, die Sie messen können, können Sie rückgängig machen; eine Kürzung im Dunkeln ist eine Wette, die Sie nicht prüfen können.</>,
            <><strong>Grenze.</strong> Eine KPI kann manipuliert oder missverstanden werden, und eine Schleife kostet Aufmerksamkeit: Drei KPIs im Monatsrhythmus sind das, was ein Vier-Monats-Fenster tragen kann.</>,
          ],
        )}
      />
    </MaterialCard>
  );
}

/* ------------------------------------------------------------------ A6 · Level 3 */

export function CardA6() {
  return (
    <MaterialCard
      id="A6"
      scan={tt(
        "Know which actions scale before you cut, start the measurement first, and give every funded KPI an owner, a cadence and a trigger.",
        "Wissen Sie vor dem Kürzen, was skaliert, starten Sie die Messung zuerst, und geben Sie jeder finanzierten KPI einen Owner, einen Rhythmus und einen Auslöser.",
      )}
      sources={["nagle2018", "brealey2020", "gupta2003", "betrvg87", "kaplan1992", "doran1981"]}
      reasoning={tt<string[]>(
        [
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
        ],
        [
          "Ordnen Sie jeden Posten nach seiner Kostenform. Ein Dashboard oder eine Buchungsautomatisierung wird einmal gebaut und bedient jeden Kunden. Ein Hebel pro Kunde (Optionen A und C) wächst mit der Kundenbasis. Ein Rabatt wächst mit der Zahl der Aufträge.",
          "Hebelwirkung ist der Effekt pro Euro; Skalierung ist, ob die Kosten bei wachsender Basis gleich bleiben. Ein Fundament, das skaliert und alles andere ermöglicht (das Dashboard), wird nicht gestrichen, ohne zu sagen, was dadurch unmessbar wird.",
          "Grenzen Sie ein, bevor Sie streichen. Ein Hebel lässt sich auf ein Segment eingrenzen. Lassen Sie zuerst das Segment weg, in dem der Hebel am wenigsten oder einen Verlust netto bringt: Nutzen Sie die Nettoeffekt-Zahlen aus Ihrem Raster, nicht die Größe des Segments.",
          "Streichen Sie zuerst den Posten mit der schwächsten Evidenz. Ein Posten, dessen Wirkung der Fall nicht beziffert (die Schulung), lässt sich leichter kürzen als einer mit gedruckter Wirkung.",
          "Eine Teillösung ist eine legitime Wahl, wenn Sie die Restlücke nennen. Die Trichter-Behebung hebt die Erscheinungsquote auf 68 %, nicht auf den Benchmark von 75 %: 7 PP bleiben offen, und das Memo sagt es.",
          "Addieren Sie die vier Kosten, bevor Sie entscheiden. Die Unterdeckung ist Arithmetik: Liegt die Summe über dem Budget, nennt die Meldung, welcher Posten oder Umfang die Lücke schließt.",
          "Geben Sie jeder finanzierten KPI drei Dinge: einen Owner (eine Rolle, kein Team), einen Review-Rhythmus und einen Eskalations-Auslöser mit einem Schwellenwert (eine Zahl) und einer benannten Person, an die er geht. „Wir werden es beobachten“ nennt keines der drei.",
          "Wählen Sie den Owner mit dem Owner-Test: Wer kann die Maßnahme, die diese KPI bewegt, diese Woche ändern, ohne jemanden darüber zu fragen? Das ist der Owner, nicht die Person, die nur die Zahl liest. Controlling besitzt die eigene KPI des Dashboards, weil es die Berichte erstellt; es besitzt nicht die Wiederkaufsrate, die es lesen, aber nicht ändern kann.",
          "Fragen Sie zwischen einem Head und einem Teamleiter, ob die KPI der ganzen Funktion oder der Gewohnheit eines Teams gehört. Der Owner sitzt nah an der Maßnahme, und die Person, an die der Auslöser eskaliert, sitzt darüber, eine KPI gehört also nie der Person, an die sie eskaliert.",
          "Wählen Sie den Rhythmus danach, wie schnell sich die KPI bewegt: Ein wöchentlicher Trichterschritt lässt sich wöchentlich lesen; eine Bindungsrate bewegt sich in Monaten. Wählen Sie den Schwellenwert aus einem Ausgangswert, den Sie wirklich haben: Ohne Dashboard gibt es keinen, und der Auslöser lässt sich nicht schreiben.",
          "Wenn Sie kürzen, nennen Sie die Folge in den Begriffen des Materials: welche KPI ungemessen bleibt, welcher Segment-Hebel sich verzögert, welches Leck teilweise offen bleibt. „Wir tun weniger“ ist keine Folge.",
          "Nennen Sie eine Maßnahme, die Sie bewusst zurückstellen, mit einem Wiederaufnahmepunkt: ein Datum oder eine Bedingung („nach drei Monaten Ausgangsdaten“). Ein Memo, das alles finanziert und nichts zurückstellt, hat keinen Zielkonflikt entschieden.",
          "Die Reihenfolge der Einführung ist Teil der Entscheidung. Starten Sie das Dashboard zuerst oder mit dem ersten Posten; ein Hebel, der vor seinem Ausgangswert startet, hat eine nicht messbare erste Phase.",
        ],
      )}
    >
      <Diagram
        label={tt("Cost of a system against a per-client action · illustrative", "Kosten eines Systems gegenüber einer Maßnahme pro Kunde · zur Veranschaulichung")}
        caption={tt(
          "Case assumption: a system built once for €30,000 against an action that costs €800 per client.",
          "Fallannahme: ein einmal gebautes System für 30.000 € gegenüber einer Maßnahme, die 800 € pro Kunde kostet.",
        )}
      >
        <ScaleChart />
      </Diagram>
      <Diagram
        label={tt("Governance table · Alpenwerk GmbH (illustrative, read-only)", "Steuerungstabelle · Alpenwerk GmbH (zur Veranschaulichung, nur lesbar)")}
        caption={tt(
          "Case assumption. One owner, one cadence and one threshold per KPI. Select a row to read why it is set that way.",
          "Fallannahme. Ein Owner, ein Rhythmus und ein Schwellenwert je KPI. Wählen Sie eine Zeile, um zu lesen, warum sie so gesetzt ist.",
        )}
      >
        <GovTable />
      </Diagram>
      <DataTable
        caption={tt("What each owner role typically does and can change (practitioner observation, Case assumption)", "Was jede Owner-Rolle typischerweise tut und ändern kann (Praxisbeobachtung, Fallannahme)")}
        head={tt(["Owner role (Case assumption)", "Typically", "Can change"], ["Owner-Rolle (Fallannahme)", "Typischerweise", "Kann ändern"])}
        rows={OWNERS.map((o) => [ownerLabel(o), OWNER_PROFILE[o].does, OWNER_PROFILE[o].changes])}
      />
      <Callout label={tt("The test questions for a governance row", "Die Testfragen für eine Steuerungszeile")}>
        <ul className="list-disc space-y-1 pl-5">
          {GOV_TESTS.map((t) => (
            <li key={t.name}>
              <strong>{t.name}.</strong> {t.test}
            </li>
          ))}
        </ul>
      </Callout>
      <Bul
        items={tt(
          [
            <><strong>Leverage against scale.</strong> Leverage asks: how much does one euro move the KPI? Scale asks: how many clients does it reach for the same cost? Under a short budget a cut is a ranking decision, and the ranking has to be written down (capital rationing; Brealey, Myers &amp; Allen, 2020).</>,
            <><strong>Postponing is a decision, not an omission.</strong> A postponed measure has a name, a reason and a pickup point. Without the pickup it is a cut. Gupta &amp; Lehmann (2003) value a client over its whole relationship, so an action that keeps clients longer pays back beyond a four-month window.</>,
          ],
          [
            <><strong>Hebelwirkung und Skalierung.</strong> Hebelwirkung fragt: Wie stark bewegt ein Euro die KPI? Skalierung fragt: Wie viele Kunden erreicht er zu denselben Kosten? Unter einem knappen Budget ist eine Kürzung eine Rangentscheidung, und die Rangfolge muss aufgeschrieben werden (Kapitalrationierung; Brealey, Myers &amp; Allen, 2020).</>,
            <><strong>Zurückstellen ist eine Entscheidung, keine Auslassung.</strong> Eine zurückgestellte Maßnahme hat einen Namen, einen Grund und einen Wiederaufnahmepunkt. Ohne diesen ist sie eine Streichung. Gupta &amp; Lehmann (2003) bewerten einen Kunden über seine gesamte Beziehung, eine Maßnahme, die Kunden länger hält, zahlt sich also über ein Vier-Monats-Fenster hinaus aus.</>,
          ],
        )}
      />
      <Callout label={tt("German constraint to remember", "Deutsche Vorgabe, die Sie beachten sollten")} tone="rust">
        <p>
          {tt(
            "A KPI that can be traced to an individual salesperson, such as a per-person conversion rate, is a technical device that monitors performance. Under § 87(1) no. 6 BetrVG the works council (Betriebsrat) co-determines its introduction. Decide whether the dashboard reports per team or per person before it goes live, and involve the works council in the second case.",
            "Eine KPI, die sich einer einzelnen Vertriebsperson zuordnen lässt, etwa eine Konversionsrate pro Person, ist eine technische Einrichtung, die Leistung überwacht. Nach § 87 Abs. 1 Nr. 6 BetrVG hat der Betriebsrat bei ihrer Einführung mitzubestimmen. Entscheiden Sie, ob das Dashboard pro Team oder pro Person berichtet, bevor es live geht, und beziehen Sie im zweiten Fall den Betriebsrat ein.",
          )}
        </p>
      </Callout>
    </MaterialCard>
  );
}
