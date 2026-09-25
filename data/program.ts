import type { OptId } from "@/data/segments";
import { lazyRecord, tt } from "@/lib/lang";

/**
 * Day 2 · Task 3 — the four programme line items and the constraint. Costs and effects are exactly as briefed
 * and are printed on the instrument, never editable. The lever's per-segment scope costs are derived from the
 * per-client costs of Task 2 (38 clients = 14 project + 24 retainer), not invented.
 */
export const BUDGET = 150000;
export const WINDOW_MONTHS = 4;

export type ItemId = "lever" | "fix" | "dash" | "train";
export const ITEM_IDS: ItemId[] = ["lever", "fix", "dash", "train"];

export type Scope = "both" | "P" | "R";
export const SCOPES: { id: Scope; label: string; short: string }[] = [
  { id: "both", get label() { return tt("Both segments", "Beide Segmente"); }, get short() { return tt("both segments", "beide Segmente"); } },
  { id: "R", get label() { return tt("Retainer clients only", "Nur Retainer-Kunden"); }, get short() { return tt("Retainer clients only", "nur Retainer-Kunden"); } },
  { id: "P", get label() { return tt("Project clients only", "Nur Projektkunden"); }, get short() { return tt("Project clients only", "nur Projektkunden"); } },
];

export const ITEMS: Record<ItemId, { id: ItemId; n: number; name: string; short: string; what: string; effect: string }> = {
  lever: {
    id: "lever",
    n: 1,
    get name() {
      return tt("Retention lever roll-out", "Einführung des Bindungshebels");
    },
    get short() {
      return tt("Retention lever", "Bindungshebel");
    },
    get what() {
      return tt(
        "The lever you favoured in Part 2, or another of the three. Options A and C are a cost per client; the discount (B) costs nothing upfront and is paid from margin on every repeat order.",
        "Der Hebel, den Sie in Teil 2 favorisiert haben, oder einer der beiden anderen. Die Optionen A und C sind ein Kostenblock pro Kunde; der Rabatt (B) kostet vorab nichts und wird bei jedem Folgeauftrag aus der Marge bezahlt.",
      );
    },
    get effect() {
      return tt(
        "Net impact per year from your Part 2 calculation, for the segments in scope.",
        "Nettoeffekt pro Jahr aus Ihrer Berechnung in Teil 2, für die betroffenen Segmente.",
      );
    },
  },
  fix: {
    id: "fix",
    n: 2,
    get name() {
      return tt("Funnel-leak fix at Booked → Held", "Behebung des Trichterlecks bei Gebucht → Durchgeführt");
    },
    get short() {
      return tt("Funnel-leak fix", "Trichterleck-Behebung");
    },
    get what() {
      return tt(
        "A CRM booking automation with a reminder workflow, and one dedicated coordinator for the quarter.",
        "Eine CRM-Buchungsautomatisierung mit Erinnerungs-Workflow und ein eigener Koordinator für das Quartal.",
      );
    },
    get effect() {
      return tt(
        "Lifts the show-up rate from 42.7% to 68%. Not the full 75% benchmark: a full fix is not affordable either, so 7 percentage points of the gap stay open.",
        "Hebt die Erscheinungsquote von 42,7 % auf 68 %. Nicht auf den vollen Benchmark von 75 %: Auch eine vollständige Behebung ist nicht bezahlbar, sodass 7 Prozentpunkte der Lücke offen bleiben.",
      );
    },
  },
  dash: {
    id: "dash",
    n: 3,
    get name() {
      return tt("KPI and governance dashboard", "KPI- und Steuerungs-Dashboard");
    },
    get short() {
      return tt("KPI dashboard", "KPI-Dashboard");
    },
    get what() {
      return tt(
        "Conversion rate, customer value (CLV) and repeat-purchase rate, tracked monthly. No baseline KPI tracking exists today.",
        "Konversionsrate, Kundenwert (CLV) und Wiederkaufsrate, monatlich erfasst. Bisher gibt es kein KPI-Tracking als Ausgangsbasis.",
      );
    },
    get effect() {
      return tt(
        "Required for any of the control-logic reporting the memo describes. The dashboard produces data, not revenue.",
        "Voraussetzung für jedes Reporting nach der Steuerungslogik, die das Memo beschreibt. Das Dashboard liefert Daten, keinen Umsatz.",
      );
    },
  },
  train: {
    id: "train",
    n: 4,
    get name() {
      return tt("Sales team training in behaviour-based selling", "Vertriebsschulung zu verhaltensbasiertem Verkaufen");
    },
    get short() {
      return tt("Sales training", "Vertriebsschulung");
    },
    get what() {
      return tt("A two-day workshop and one month of coaching.", "Ein zweitägiger Workshop und ein Monat Coaching.");
    },
    get effect() {
      return tt(
        "Not quantified in the case data: it is a judgement call, defended in words.",
        "In den Falldaten nicht beziffert: Es ist eine Ermessensentscheidung, die in Worten begründet wird.",
      );
    },
  },
};

export const FIXED_COST: Record<Exclude<ItemId, "lever">, number> = { fix: 58000, dash: 39000, train: 21000 };
export const SHOW_UP = { before: 42.7, after: 68, benchmark: 75 };

/** KPIs the dashboard reports. The lever acts on the repeat-purchase rate. */
export type KpiId = "conversion" | "clv" | "repeat";
export const KPIS: { id: KpiId; label: string }[] = [
  { id: "conversion", get label() { return tt("Conversion rate", "Konversionsrate"); } },
  { id: "clv", get label() { return tt("Customer value (CLV)", "Kundenwert (CLV)"); } },
  { id: "repeat", get label() { return tt("Repeat-purchase rate", "Wiederkaufsrate"); } },
];
export const KPI_LABEL: Record<KpiId, string> = lazyRecord({
  conversion: () => tt("Conversion rate", "Konversionsrate"),
  clv: () => tt("Customer value (CLV)", "Kundenwert (CLV)"),
  repeat: () => tt("Repeat-purchase rate", "Wiederkaufsrate"),
});
export const LEVER_KPI: KpiId = "repeat";

/** The KPI each funded item is governed by. */
export const ITEM_KPI: Record<ItemId, string> = lazyRecord({
  lever: () => tt("Repeat-purchase rate", "Wiederkaufsrate"),
  fix: () => tt("Show-up rate (Booked → Held)", "Erscheinungsquote (Gebucht → Durchgeführt)"),
  dash: () => tt("Dashboard reporting: the three KPIs published each month", "Dashboard-Reporting: die drei KPIs, die jeden Monat veröffentlicht werden"),
  train: () => tt("Conversion rate, Proposal → Signed", "Konversionsrate, Angebot → Unterschrift"),
});

export const OWNERS = [
  "Chief Customer Officer / Sales Manager",
  "Head of Sales",
  "Key account manager",
  "CRM coordinator",
  "Head of Delivery",
  "Controlling",
  "Sales team lead",
];
export const CADENCES = ["Weekly", "Fortnightly", "Monthly", "Quarterly"];
export const PICKUPS = [
  "Month 5, straight after this window",
  "After three months of dashboard baseline",
  "Next quarter’s budget round",
  "Next half-year",
];

/**
 * The owner, cadence and pickup options are stored as their English text (a stable key), and shown through these
 * labels, so a learner who switches language keeps every choice.
 */
const OWNER_DE: Record<string, string> = {
  "Chief Customer Officer / Sales Manager": "Chief Customer Officer / Vertriebsleitung",
  "Head of Sales": "Head of Sales",
  "Key account manager": "Key Account Manager",
  "CRM coordinator": "CRM-Koordinator",
  "Head of Delivery": "Head of Delivery",
  Controlling: "Controlling",
  "Sales team lead": "Teamleiter Vertrieb",
};
const CADENCE_DE: Record<string, string> = { Weekly: "Wöchentlich", Fortnightly: "Zweiwöchentlich", Monthly: "Monatlich", Quarterly: "Vierteljährlich" };
const PICKUP_DE: Record<string, string> = {
  "Month 5, straight after this window": "Monat 5, direkt nach diesem Zeitraum",
  "After three months of dashboard baseline": "Nach drei Monaten Dashboard-Ausgangsdaten",
  "Next quarter’s budget round": "Budgetrunde des nächsten Quartals",
  "Next half-year": "Nächstes Halbjahr",
};
export const ownerLabel = (o: string) => tt(o, OWNER_DE[o] ?? o);
export const cadenceLabel = (c: string) => tt(c, CADENCE_DE[c] ?? c);
export const pickupLabel = (p: string) => tt(p, PICKUP_DE[p] ?? p);

/** The printed warning. `first` is the first month with baseline data; `from`–`to` are the blind months. */
export const warningText = (from: number, to: number, first: number) =>
  tt(
    `No baseline KPI data exists before month ${first} — the lever’s impact for ${from === to ? `month ${from}` : `months ${from}–${to}`} will be unmeasurable.`,
    `Vor Monat ${first} liegen keine KPI-Ausgangsdaten vor — die Wirkung des Hebels in ${from === to ? `Monat ${from}` : `den Monaten ${from}–${to}`} ist nicht messbar.`,
  );
export const WARNING_UNFUNDED_TEXT = () =>
  tt(
    "No baseline KPI data exists in this window — the lever’s impact will be unmeasurable throughout.",
    "In diesem Zeitraum liegen keine KPI-Ausgangsdaten vor — die Wirkung des Hebels ist durchgehend nicht messbar.",
  );

export const OPT_NAME: Record<OptId, string> = lazyRecord({
  A: () => tt("Option A · personal account management", "Option A · persönliche Kundenbetreuung"),
  B: () => tt("Option B · discount", "Option B · Rabatt"),
  C: () => tt("Option C · value-added service", "Option C · Zusatzleistung"),
});

/* ------------------------------------------------------------------ owners, cadences and pickups (taught in Materi C4) */

/** What each owner option typically decides and does. A practitioner observation for a company of this kind (Case assumption). Taught in C4. */
export const OWNER_PROFILE: Record<string, { does: string; changes: string }> = {
  "Chief Customer Officer / Sales Manager": {
    get does() {
      return tt(
        "Answers for retention and sales results across the whole company, owns the budget and is the top escalation point.",
        "Verantwortet Kundenbindung und Vertriebsergebnisse im ganzen Unternehmen, besitzt das Budget und ist die oberste Eskalationsstelle.",
      );
    },
    get changes() {
      return tt(
        "Priorities and money. Not a workflow or a client relationship day to day.",
        "Prioritäten und Geld. Keinen Arbeitsablauf und keine Kundenbeziehung im Tagesgeschäft.",
      );
    },
  },
  "Head of Sales": {
    get does() {
      return tt(
        "Answers for the funnel and the sales team’s results. The escalation point above the coordinators and team leads.",
        "Verantwortet den Trichter und die Ergebnisse des Vertriebsteams. Die Eskalationsstelle über den Koordinatoren und Teamleitern.",
      );
    },
    get changes() {
      return tt("The sales process, targets and how the funnel is staffed.", "Den Vertriebsprozess, die Ziele und die Besetzung des Trichters.");
    },
  },
  "Key account manager": {
    get does() {
      return tt(
        "Runs the relationship with a group of existing clients: business reviews, early-warning contact before a renewal.",
        "Betreut die Beziehung zu einer Gruppe von Bestandskunden: Business Reviews, Frühwarn-Kontakt vor einer Verlängerung.",
      );
    },
    get changes() {
      return tt("How often and how the existing client is visited and served.", "Wie oft und wie der Bestandskunde besucht und betreut wird.");
    },
  },
  "CRM coordinator": {
    get does() {
      return tt("Runs the booking system, the reminders and the data in it.", "Betreibt das Buchungssystem, die Erinnerungen und die Daten darin.");
    },
    get changes() {
      return tt("The booking workflow, day to day.", "Den Buchungsablauf im Tagesgeschäft.");
    },
  },
  "Head of Delivery": {
    get does() {
      return tt(
        "Answers for project delivery and for support after go-live.",
        "Verantwortet die Projektumsetzung und den Support nach dem Go-live.",
      );
    },
    get changes() {
      return tt("Staffing and service levels of delivery and support.", "Besetzung und Service-Level von Umsetzung und Support.");
    },
  },
  Controlling: {
    get does() {
      return tt("Produces the figures and checks their quality.", "Erstellt die Zahlen und prüft ihre Qualität.");
    },
    get changes() {
      return tt(
        "The reporting. Not what sales, account managers or coordinators do.",
        "Das Reporting. Nicht, was Vertrieb, Kundenbetreuer oder Koordinatoren tun.",
      );
    },
  },
  "Sales team lead": {
    get does() {
      return tt(
        "Leads a group of sellers day to day and runs their coaching.",
        "Führt eine Gruppe von Verkäufern im Tagesgeschäft und übernimmt ihr Coaching.",
      );
    },
    get changes() {
      return tt("How the team sells and what it is coached on.", "Wie das Team verkauft und worauf es gecoacht wird.");
    },
  },
};

/** The test questions for a governance row, in the order a learner should ask them. Taught in C4; repeated on request in Block 3.4. */
export const GOV_TESTS: { name: string; test: string }[] = [
  {
    get name() {
      return tt("Owner", "Owner");
    },
    get test() {
      return tt(
        "Who can change the action that moves this KPI this week, without asking anyone above? The owner is that person, not the person who only reads the number.",
        "Wer kann die Maßnahme, die diese KPI bewegt, diese Woche ändern, ohne jemanden darüber zu fragen? Der Owner ist diese Person, nicht die Person, die nur die Zahl liest.",
      );
    },
  },
  {
    get name() {
      return tt("Owner · Head of Sales or team lead", "Owner · Head of Sales oder Teamleiter");
    },
    get test() {
      return tt(
        "Does the KPI belong to the whole sales function or to one team? A function-wide KPI sits with the head; a team’s own habit sits with its lead.",
        "Gehört die KPI zur gesamten Vertriebsfunktion oder zu einem Team? Eine funktionsweite KPI liegt beim Leiter der Funktion; die Gewohnheit eines einzelnen Teams beim Teamleiter.",
      );
    },
  },
  {
    get name() {
      return tt("Owner · Controlling or the action’s owner", "Owner · Controlling oder der Verantwortliche der Maßnahme");
    },
    get test() {
      return tt(
        "Does the person change the number, or only report it? Only a KPI that is itself the report (reporting delivered on time) belongs to the person who produces the report.",
        "Ändert die Person die Zahl, oder berichtet sie sie nur? Nur eine KPI, die selbst der Bericht ist (Reporting pünktlich geliefert), gehört der Person, die den Bericht erstellt.",
      );
    },
  },
  {
    get name() {
      return tt("Cadence", "Rhythmus");
    },
    get test() {
      return tt(
        "How often does the thing behind the KPI actually happen and move? Read it that often, and no more often than a change can show.",
        "Wie oft geschieht und bewegt sich das, was hinter der KPI steht? Lesen Sie sie so oft, aber nicht öfter, als sich eine Veränderung zeigen kann.",
      );
    },
  },
  {
    get name() {
      return tt("Trigger", "Auslöser");
    },
    get test() {
      return tt(
        "Which number, read at which interval, ends the debate about whether to act? Write the threshold and the name of the person it goes to.",
        "Welche Zahl, in welchem Intervall gelesen, beendet die Diskussion, ob gehandelt wird? Schreiben Sie den Schwellenwert und den Namen der Person, an die sie geht.",
      );
    },
  },
];

/** The owner and cadence the model answer gives each item, with the reason. Used by the answer key and the mentor guide. */
export const GOV_EXPECT: Record<ItemId, { owner: string; cadence: string; ownerWhy: string; cadenceWhy: string }> = {
  lever: {
    owner: "Key account manager",
    cadence: "Monthly",
    ownerWhy: "The repeat-purchase rate is moved by how existing clients are served, which is the key account manager’s work. Controlling reads it but cannot change it.",
    cadenceWhy: "Repeat purchase moves in months, so a monthly reading avoids reacting to noise.",
  },
  fix: {
    owner: "CRM coordinator",
    cadence: "Weekly",
    ownerWhy: "The show-up rate is moved by the booking workflow and reminders, which the coordinator runs and can change at once.",
    cadenceWhy: "Consultations are booked every week, so a week already shows whether the reminders work.",
  },
  dash: {
    owner: "Controlling",
    cadence: "Monthly",
    ownerWhy: "The dashboard’s own KPI is that the three KPIs are published on time. Controlling produces them, so it can change whether they are late.",
    cadenceWhy: "The dashboard reports monthly, so its own delivery is read monthly.",
  },
  train: {
    owner: "Sales team lead",
    cadence: "Monthly",
    ownerWhy: "The conversion from proposal to signed moves with how the team sells, which the team lead coaches. It is the team’s habit, not the whole function’s.",
    cadenceWhy: "A selling habit shows in conversions over weeks and months, so a monthly reading is the fastest that means something.",
  },
};

export const CADENCE_WHY: Record<string, string> = {
  Weekly: "Right for a KPI whose event happens every week, such as bookings. Too frequent for one that moves in months: it reads noise.",
  Fortnightly: "Between the two. Defensible for a KPI with a weekly event and a slow reaction, but it delays a fix that is not working.",
  Monthly: "Right for a KPI that is reported monthly or moves in months (retention, conversion after coaching, the dashboard itself).",
  Quarterly: "Too slow inside a four-month window: only one reading would fall in it, so a trigger could never fire in time.",
};

export const PICKUP_WHY: Record<string, string> = {
  "Month 5, straight after this window": "Defensible only if the postponed item needs no baseline. Picks up before any KPI reading exists, so it cannot rest on evidence.",
  "After three months of dashboard baseline": "The best fit when the postponed item is judged by a KPI: three months of baseline is what makes its effect readable. It is also a condition, not only a date.",
  "Next quarter’s budget round": "A real decision point with money attached. Fine when the item needs new budget, weaker when it needs evidence first.",
  "Next half-year": "So far away that it reads as a cut. A pickup that late is barely a pickup.",
};
export const PICKUP_MODEL = "After three months of dashboard baseline";
