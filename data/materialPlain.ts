import type { MaterialId } from "@/data/materialIndex";
import { getLang } from "@/lib/lang";

/**
 * The "In plain words" box under each card's scan line: the idea in everyday language, why it matters for the
 * day's case and tasks, and how to read the diagram or interactive below. Written for someone who has never met
 * the topic. Typed as a full Record so a card without an explanation fails the typecheck. Every control and label
 * named in `picture` was checked against the component that draws it.
 */
export type PlainExplain = {
  /** The idea itself, in everyday words. */
  idea: string;
  /** Why the learner should care, tied to the case or the task. */
  why: string;
  /** How to read or use the picture below. Omitted for cards without a diagram to read. */
  picture?: string;
};

export const MATERIAL_PLAIN: Record<MaterialId, PlainExplain> = {
  /* ---------------------------------------------------------------- Materi A (the capstone: six cards, two per level) */
  A1: {
    idea: "Before you decide what to say in a sales conversation, ask why this buyer would act at all. Most buyers have one main reason: they want to feel safe (trust), they want the total cost to be clear (price), they want to see a result (benefit), or they want to keep working with people they know (relationship). Each reason calls for a different action from you, and a different kind of proof.",
    why: "The whole day starts from the buyer's reason. A discount offered to a buyer who is worried about risk gives margin away and leaves the worry exactly where it was; later, the lever you choose for DigitalIT Solutions has to answer a reason too.",
    picture: "The four boxes on the left are the buying motives, and the boxes on the right are the strategy each one calls for. Click a motive: the panel underneath lists the proof that buyer looks for, and adds a note on how it looks in a German company.",
  },
  A2: {
    idea: "A customer journey is the list of moments where a buyer and your company meet, in order. Here they are grouped into three phases: pre-sales, sales (up to and including the signature) and after-sales. A funnel then counts how many people reach each stage, and you read it by the gap between each step and its benchmark, not by the raw counts.",
    why: "Part 1 of the Case File asks where DigitalIT Solutions loses prospects and what that costs. Counts fall at every stage of any funnel, so only the gap in percentage points shows where the real leak is. The phase tests are the same two questions for every stage: is a named contact in a booked or held conversation, and has the contract been signed?",
    picture: "First the journey map: click a touchpoint to read what it covers and who usually owns it, and note the two dashed lines that mark where sales starts and where it ends. Then the worked sort on a different company: click a stage to see why it sits in its phase. Last, the worked example of a funnel step: two counts, the percentage, the reference (ref) and the gap. The hatched bar is the size of the gap.",
  },
  A3: {
    idea: "A lever is one thing you can do to make existing clients order again. This day compares three: a personal account manager, a discount, and a service that adds value on top of the contract. Each answers a different reason a client might leave, and each costs money in a different way. Net impact answers one question: after paying for it, does the lever make money?",
    why: "Part 2 puts a euro figure on all three levers in two client segments. The calculation is always the same four steps (extra orders, times profit per order, minus cost, equals net impact); only how the cost is counted changes, and the result can be negative.",
    picture: "In the first picture each row is one option: the lever on the left, the buying motive it answers in the middle, and how its cost behaves on the right. A solid block means the cost is paid per client, dashed stripes mean it is paid again on every order. Click a row to read more. Below it, read the four boxes from left to right: extra orders, times gross profit, minus cost, equals net impact. The worked example (Alpenwerk, made up) runs the same steps for two levers.",
  },
  A4: {
    idea: "Not every client behaves the same. Project clients place few, large orders and are rarely in contact between projects. Retainer clients place many small orders and are in regular contact. A discount is paid on every order, including the ones that would have come anyway, so the more repeat orders a segment already places, the more a discount costs before it wins a single extra one.",
    why: "In Part 2 the discount wins in one segment and loses in the other, and you have to choose one option for each segment and defend it with a figure. This card gives you the mechanism, so you can explain why and not only read the number.",
    picture: "In the first picture, the bottom is how often a client orders and the side is how large each order is; click a circle to read how levers land on that segment. In the second, two sliders: \u201CUplift in the repeat rate\u201D moves the dotted vertical marker, and \u201CExisting repeat orders\u201D changes how many orders the discount is paid on. The solid line is a lever with a fixed cost per client, the dashed line is the discount; where a line crosses zero it breaks even.",
  },
  A5: {
    idea: "A retention plan is not one action. It is a set of actions, and each one needs a goal above it (what you want to change, by how much, by when) and a KPI below it (the number that shows whether it worked). A one-off fix spends money and then nobody looks at the result; a governed system adds an owner who reads the KPI on a fixed rhythm, and a rule for when to change course.",
    why: "Part 3 gives you four line items and one budget. Each item you fund needs its own KPI, and this card tells you which KPI belongs to which item and why a loop that reads the result makes a cut correctable.",
    picture: "In the first picture each row is one worked chain from Alpenwerk (made up): goal on the left, action in the middle, KPI on the right. Click a row to see what holds it together. In the second, the four boxes on the left form a loop (KPI, review, trigger, act, back to the KPI); the dashed box on the right is a one-off discount campaign, with nothing that reads the result afterwards.",
  },
  A6: {
    idea: "When money is short you need to know three things before you cut. Which actions serve every client for the same cost (a dashboard) and which cost more with every client or order; which one has to start first so that the others can be measured; and who owns each KPI. Governance means one named role acts on the KPI (the owner), looks at it on a fixed schedule (the cadence), and has a written number that decides when to escalate (the trigger).",
    why: "Part 3 asks you to allocate the budget, set the rollout order, say what you cut or postpone, and give every funded KPI an owner, a cadence and a trigger. This card holds the tests for each of those.",
    picture: "First, move the \u201CClients served\u201D slider: the solid line is a system built once for a flat cost, the dashed line is an action that costs the same for each client, and a faint vertical line marks where the two costs are equal. Second, each row of the governance table is one KPI with its owner, cadence and trigger; click a row to read why each is set that way. The role profiles below show what each owner option typically does and can change.",
  },

  /* ---------------------------------------------------------------- Materi B */
  B1: {
    idea: "A lever is one thing you can do to make existing clients order again. This day compares three: a personal account manager, a discount, and a service that adds value on top of the contract. Each one answers a different reason a client might leave (relationship, price, perceived value), and each one costs money in a different way.",
    why: "In Task 2 you put a euro figure on all three, in two client segments. Picking a lever that answers the wrong reason spends the money without touching why clients leave.",
    picture: "Each row is one option: the lever on the left, the buying motive it answers in the middle, and how its cost behaves on the right. A solid block means the cost is paid per client, whatever the orders. Dashed stripes mean the cost is paid again on every order. Click a row to read what the lever is, how its cost is counted and where it fits.",
  },
  B2: {
    idea: "Not every client behaves the same. Project clients place few, large orders and are rarely in contact between projects. Retainer clients place many small orders and are in regular contact. The same lever lands differently on each.",
    why: "Task 2 has one grid that covers both segments. Without this idea the figures look like a surprise: the same discount can pay in one segment and lose money in the other.",
    picture: "Along the bottom is how often a client orders (rare to frequent), and up the side is how large each order is (small to large). The two circles show where the segments sit. Click one to read how levers land on it.",
  },
  B3: {
    idea: "Net impact answers one question: after paying for it, does the lever make money? Count the extra orders it brings, multiply by the profit on each order, and subtract what the lever costs. The result can be negative, and that is a valid answer.",
    why: "This is the calculation behind every cell of the Task 2 grid. Only one step changes from lever to lever: how the cost is counted.",
    picture: "Read the four boxes from left to right: extra orders, times gross profit, minus cost, equals net impact. Only the third box changes between levers. The worked example below (Alpenwerk, made up) runs the same four steps for two levers and shows how the same uplift gives two different verdicts.",
  },
  B4: {
    idea: "A discount is paid on every order, including the ones that would have come anyway. So the more repeat orders a segment already places, the more a discount costs before it wins a single extra order. The break-even is the uplift a discount has to reach just to cover itself.",
    why: "In Task 2 the discount wins in one segment and loses in the other. This card shows the mechanism, so you can explain why and not only read the number.",
    picture: "Two sliders: “Uplift in the repeat rate” moves the dotted vertical marker along the bottom, and “Existing repeat orders” changes how many orders the discount is paid on. The solid line is a lever with a fixed cost per client, and the dashed line is the discount. Where a line crosses the zero line it breaks even. Raise the existing orders and only the dashed line moves.",
  },

  /* ---------------------------------------------------------------- Materi C */
  C1: {
    idea: "A retention plan is not one action. It is a set of actions, and each one needs a goal above it (what you want to change, by how much, by when) and a KPI below it (the number that shows whether it worked). If you cannot write an action in that goal → action → KPI form, it is not ready for money.",
    why: "Task 3 gives you four line items and one budget. Each item you fund needs its own KPI, and this card tells you which KPI belongs to which item.",
    picture: "Each row is one worked chain from Alpenwerk (made up): goal on the left, action in the middle, KPI on the right, with arrows between. Click a row. The panel underneath says what holds the chain together and how it would fail.",
  },
  C2: {
    idea: "A one-off fix spends money and then nobody looks at the result. A governed system does the same action but adds an owner who reads a KPI on a fixed rhythm, and a rule for when to change course. That loop is what makes an action correctable.",
    why: "In Task 3 you must say who owns each funded item and what makes them act. Without the loop, a cut you make cannot be reviewed either.",
    picture: "The four boxes on the left form a loop: KPI, review, trigger, act, and back to the KPI. The dashed box on the right is a one-off discount campaign: a single step and nothing that reads the result afterwards. Click a step of the loop to read what happens there.",
  },
  C3: {
    idea: "Some actions serve every client for the same cost (a dashboard, a booking automation). Others cost more with every client, or with every order. When money is short, you need to know which is which before you cut anything.",
    why: "Task 3 asks you to decide what to fund and what to leave out. Cutting a fixed-cost foundation and narrowing a per-client lever to one segment have different consequences, and the memo has to name them.",
    picture: "Move the “Clients served” slider. The solid line is a system built once for a flat cost. The dashed line is an action that costs the same for each client, so it rises as the client base grows. A faint vertical line marks where the two costs are equal: with fewer clients than that, the system is the dearer of the two.",
  },
  C4: {
    idea: "A KPI without an owner, a rhythm and a trigger is just a number. Governance means three things: one named role acts on the KPI (the owner), looks at it on a fixed schedule (the cadence), and has a written number that decides when to escalate and to whom (the trigger).",
    why: "Block 3.4 of Task 3 asks for exactly these three things for every item you fund, and Block 3.5 asks what you postpone and when you will pick it up.",
    picture: "Each row of the table is one KPI with its owner, its cadence and its trigger. Click a row to read why each of the three is set the way it is, and who the KPI escalates to. Below the table, the role profiles show what each owner option typically does and can change, which is what the owner test is applied to.",
  },
};

/**
 * The German version of the "In plain words" boxes of Route 1 (Materi A). Cards without a German version fall back to English,
 * which is what the optional Routes 2 and 3 use.
 */
export const MATERIAL_PLAIN_DE: Partial<Record<MaterialId, PlainExplain>> = {
  A1: {
    idea: "Bevor Sie entscheiden, was Sie in einem Verkaufsgespräch sagen, fragen Sie: Warum sollte dieser Käufer überhaupt handeln? Die meisten Käufer haben einen Hauptgrund: Sie wollen sich sicher fühlen (Vertrauen), die Gesamtkosten klar sehen (Preis), ein Ergebnis sehen (Nutzen) oder mit Menschen weiterarbeiten, die sie kennen (Beziehung). Jeder Grund verlangt von Ihnen eine andere Maßnahme und eine andere Art von Beleg.",
    why: "Der ganze Tag geht vom Grund des Käufers aus. Ein Rabatt für einen Käufer, der das Risiko fürchtet, verschenkt Marge und lässt die Sorge genau dort, wo sie war; auch der Hebel, den Sie später für DigitalIT Solutions wählen, muss auf einen Grund antworten.",
    picture: "Die vier Felder links sind die Kaufmotive, die Felder rechts die Strategie, die jedes Motiv verlangt. Klicken Sie ein Motiv an: Das Feld darunter listet den Beleg auf, den dieser Käufer sucht, und ergänzt einen Hinweis, wie das in einem deutschen Unternehmen aussieht.",
  },
  A2: {
    idea: "Eine Customer Journey ist die Liste der Momente, in denen ein Käufer und Ihr Unternehmen einander begegnen, der Reihe nach. Hier sind sie in drei Phasen gruppiert: Pre-Sales, Vertrieb (bis einschließlich zur Unterschrift) und After-Sales. Ein Trichter zählt dann, wie viele Personen jede Stufe erreichen, und Sie lesen ihn an der Abweichung jedes Schritts von seinem Benchmark, nicht an den Rohzahlen.",
    why: "Teil 1 der Fallakte fragt, wo DigitalIT Solutions Interessenten verliert und was das kostet. In jedem Trichter fallen die Zahlen von Stufe zu Stufe, deshalb zeigt nur die Abweichung in Prozentpunkten, wo das eigentliche Leck ist. Die Phasentests sind für jede Stufe dieselben zwei Fragen: Führt ein namentlich bekannter Ansprechpartner ein gebuchtes oder geführtes Gespräch, und ist der Vertrag unterzeichnet?",
    picture: "Zuerst die Journey-Karte: Klicken Sie einen Kontaktpunkt an, um zu lesen, was er umfasst und wer ihn meist verantwortet, und beachten Sie die zwei gestrichelten Linien, die markieren, wo der Vertrieb beginnt und wo er mit der Unterschrift endet. Dann die durchgespielte Zuordnung an einem anderen Unternehmen: Klicken Sie eine Stufe an, um zu sehen, warum sie in ihrer Phase liegt. Zuletzt das Rechenbeispiel eines Trichterschritts: zwei Zahlen, der Prozentwert, der Referenzwert (ref) und die Abweichung. Der schraffierte Balken zeigt die Größe der Abweichung.",
  },
  A3: {
    idea: "Ein Hebel ist eine Maßnahme, mit der Sie Bestandskunden dazu bringen, wieder zu bestellen. An diesem Tag werden drei verglichen: ein persönlicher Kundenbetreuer, ein Rabatt und eine Zusatzleistung zum Vertrag. Jeder antwortet auf einen anderen Grund, warum ein Kunde gehen könnte, und jeder kostet auf andere Weise Geld. Der Nettoeffekt beantwortet eine Frage: Macht der Hebel nach Abzug seiner Kosten Geld?",
    why: "Teil 2 bewertet alle drei Hebel in Euro, in zwei Kundensegmenten. Die Rechnung hat immer dieselben vier Schritte (zusätzliche Aufträge, mal Rohertrag pro Auftrag, minus Kosten, gleich Nettoeffekt); nur die Zählweise der Kosten ändert sich, und das Ergebnis kann negativ sein.",
    picture: "Im ersten Bild ist jede Zeile eine Option: links der Hebel, in der Mitte das Kaufmotiv, auf das er antwortet, rechts das Verhalten seiner Kosten. Ein voller Block bedeutet: Die Kosten fallen pro Kunde an. Gestrichelte Streifen bedeuten: Sie fallen bei jedem Auftrag erneut an. Klicken Sie eine Zeile an, um mehr zu lesen. Darunter lesen Sie die vier Kästen von links nach rechts: zusätzliche Aufträge, mal Rohertrag, minus Kosten, gleich Nettoeffekt. Das Rechenbeispiel (Alpenwerk, erfunden) führt dieselben Schritte für zwei Hebel aus.",
  },
  A4: {
    idea: "Nicht jeder Kunde verhält sich gleich. Projektkunden erteilen wenige große Aufträge und sind zwischen den Projekten kaum in Kontakt. Retainer-Kunden erteilen viele kleine Aufträge und sind regelmäßig in Kontakt. Ein Rabatt fällt bei jedem Auftrag an, auch bei denen, die ohnehin gekommen wären. Je mehr Folgeaufträge ein Segment schon erteilt, desto mehr kostet ein Rabatt, bevor er auch nur einen zusätzlichen gewinnt.",
    why: "In Teil 2 gewinnt der Rabatt in einem Segment und verliert im anderen, und Sie müssen für jedes Segment eine Option wählen und mit einer Zahl begründen. Diese Karte gibt Ihnen den Mechanismus, damit Sie erklären können, warum, und nicht nur die Zahl ablesen.",
    picture: "Im ersten Bild steht unten, wie oft ein Kunde bestellt, und an der Seite, wie groß jeder Auftrag ist; klicken Sie einen Kreis an, um zu lesen, wie Hebel in diesem Segment wirken. Im zweiten gibt es zwei Regler: „Steigerung der Wiederkaufsrate“ verschiebt die gepunktete senkrechte Markierung, und „Bestehende Folgeaufträge“ ändert, auf wie viele Aufträge der Rabatt anfällt. Die durchgezogene Linie ist ein Hebel mit festen Kosten pro Kunde, die gestrichelte der Rabatt; wo eine Linie die Nulllinie kreuzt, ist Break-even.",
  },
  A5: {
    idea: "Ein Bindungsplan ist nicht eine einzelne Maßnahme. Er ist eine Menge von Maßnahmen, und jede braucht ein Ziel über sich (was Sie ändern wollen, um wie viel, bis wann) und eine KPI unter sich (die Zahl, die zeigt, ob sie gewirkt hat). Eine einmalige Korrektur gibt Geld aus, und danach schaut niemand aufs Ergebnis; ein gesteuertes System ergänzt einen Owner, der die KPI im festen Rhythmus liest, und eine Regel, wann der Kurs zu ändern ist.",
    why: "Teil 3 gibt Ihnen vier Posten und ein Budget. Jeder Posten, den Sie finanzieren, braucht seine eigene KPI, und diese Karte sagt Ihnen, welche KPI zu welchem Posten gehört und warum eine Schleife, die das Ergebnis liest, eine Kürzung korrigierbar macht.",
    picture: "Im ersten Bild ist jede Zeile eine ausgearbeitete Kette von Alpenwerk (erfunden): links das Ziel, in der Mitte die Maßnahme, rechts die KPI. Klicken Sie eine Zeile an, um zu sehen, was die Kette zusammenhält. Im zweiten bilden die vier Kästen links eine Schleife (KPI, Review, Auslöser, Handeln, zurück zur KPI); der gestrichelte Kasten rechts ist eine einmalige Rabattaktion, mit nichts, das danach das Ergebnis liest.",
  },
  A6: {
    idea: "Wenn Geld knapp ist, müssen Sie vor dem Kürzen drei Dinge wissen. Welche Maßnahmen bedienen jeden Kunden zu denselben Kosten (ein Dashboard) und welche kosten mehr mit jedem Kunden oder Auftrag; welche zuerst starten muss, damit die anderen messbar werden; und wer jede KPI verantwortet. Steuerung heißt: Eine benannte Rolle handelt an der KPI (der Owner), schaut sie in festem Rhythmus an (der Review-Rhythmus) und hat eine geschriebene Zahl, die entscheidet, wann eskaliert wird (der Auslöser).",
    why: "Teil 3 verlangt, das Budget zu verteilen, die Einführungsreihenfolge festzulegen, zu sagen, was Sie streichen oder zurückstellen, und jeder finanzierten KPI einen Owner, einen Rhythmus und einen Auslöser zu geben. Diese Karte enthält die Tests für jeden dieser Punkte.",
    picture: "Bewegen Sie zuerst den Regler „Bediente Kunden“: Die durchgezogene Linie ist ein System, das einmal für feste Kosten gebaut wird, die gestrichelte eine Maßnahme, die für jeden Kunden gleich viel kostet, und eine blasse senkrechte Linie markiert, wo beide Kosten gleich sind. Dann: Jede Zeile der Steuerungstabelle ist eine KPI mit Owner, Rhythmus und Auslöser; klicken Sie eine Zeile an, um zu lesen, warum jedes so gesetzt ist. Die Rollenprofile darunter zeigen, was jede Owner-Option typischerweise tut und ändern kann.",
  },
};

/** The "In plain words" text of a card in the active language. */
export function plainOf(id: MaterialId): PlainExplain {
  return (getLang() === "de" ? MATERIAL_PLAIN_DE[id] : undefined) ?? MATERIAL_PLAIN[id];
}
