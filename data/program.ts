import type { OptId } from "@/data/segments";

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
  { id: "both", label: "Both segments", short: "both segments" },
  { id: "R", label: "Retainer clients only", short: "Retainer clients only" },
  { id: "P", label: "Project clients only", short: "Project clients only" },
];

export const ITEMS: Record<ItemId, { id: ItemId; n: number; name: string; short: string; what: string; effect: string }> = {
  lever: {
    id: "lever",
    n: 1,
    name: "Retention lever roll-out",
    short: "Retention lever",
    what: "The lever you chose in Route 2, or another of the three. Options A and C are a cost per client; the discount (B) costs nothing upfront and is paid from margin on every repeat order.",
    effect: "Net impact per year from your Route 2 calculation, for the segments in scope.",
  },
  fix: {
    id: "fix",
    n: 2,
    name: "Funnel-leak fix at Booked → Held",
    short: "Funnel-leak fix",
    what: "A CRM booking automation with a reminder workflow, and one dedicated coordinator for the quarter.",
    effect: "Lifts the show-up rate from 42.7% to 68%. Not the full 75% benchmark: a full fix is not affordable either, so 7 percentage points of the gap stay open.",
  },
  dash: {
    id: "dash",
    n: 3,
    name: "KPI and governance dashboard",
    short: "KPI dashboard",
    what: "Conversion rate, customer value (CLV) and repeat-purchase rate, tracked monthly. No baseline KPI tracking exists today.",
    effect: "Required for any of the control-logic reporting the memo describes. The dashboard produces data, not revenue.",
  },
  train: {
    id: "train",
    n: 4,
    name: "Sales team training in behaviour-based selling",
    short: "Sales training",
    what: "A two-day workshop and one month of coaching.",
    effect: "Not quantified in the case data: it is a judgement call, defended in words.",
  },
};

export const FIXED_COST: Record<Exclude<ItemId, "lever">, number> = { fix: 58000, dash: 39000, train: 21000 };
export const SHOW_UP = { before: 42.7, after: 68, benchmark: 75 };

/** KPIs the dashboard reports. The lever acts on the repeat-purchase rate. */
export type KpiId = "conversion" | "clv" | "repeat";
export const KPIS: { id: KpiId; label: string }[] = [
  { id: "conversion", label: "Conversion rate" },
  { id: "clv", label: "Customer value (CLV)" },
  { id: "repeat", label: "Repeat-purchase rate" },
];
export const KPI_LABEL: Record<KpiId, string> = { conversion: "Conversion rate", clv: "Customer value (CLV)", repeat: "Repeat-purchase rate" };
export const LEVER_KPI: KpiId = "repeat";

/** The KPI each funded item is governed by. */
export const ITEM_KPI: Record<ItemId, string> = {
  lever: "Repeat-purchase rate",
  fix: "Show-up rate (Booked → Held)",
  dash: "Dashboard reporting: the three KPIs published each month",
  train: "Conversion rate, Proposal → Signed",
};

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

/** The printed warning. `first` is the first month with baseline data; `from`–`to` are the blind months. */
export const warningText = (from: number, to: number, first: number) =>
  `No baseline KPI data exists before month ${first} — the lever’s impact for ${from === to ? `month ${from}` : `months ${from}–${to}`} will be unmeasurable.`;
export const WARNING_UNFUNDED = "No baseline KPI data exists in this window — the lever’s impact will be unmeasurable throughout.";

export const OPT_NAME: Record<OptId, string> = { A: "Option A · personal account management", B: "Option B · discount", C: "Option C · value-added service" };

/* ------------------------------------------------------------------ owners, cadences and pickups (taught in Materi C4) */

/** What each owner option typically decides and does. A practitioner observation for a company of this kind (Case assumption). Taught in C4. */
export const OWNER_PROFILE: Record<string, { does: string; changes: string }> = {
  "Chief Customer Officer / Sales Manager": {
    does: "Answers for retention and sales results across the whole company, owns the budget and is the top escalation point.",
    changes: "Priorities and money. Not a workflow or a client relationship day to day.",
  },
  "Head of Sales": {
    does: "Answers for the funnel and the sales team’s results. The escalation point above the coordinators and team leads.",
    changes: "The sales process, targets and how the funnel is staffed.",
  },
  "Key account manager": {
    does: "Runs the relationship with a group of existing clients: business reviews, early-warning contact before a renewal.",
    changes: "How often and how the existing client is visited and served.",
  },
  "CRM coordinator": {
    does: "Runs the booking system, the reminders and the data in it.",
    changes: "The booking workflow, day to day.",
  },
  "Head of Delivery": {
    does: "Answers for project delivery and for support after go-live.",
    changes: "Staffing and service levels of delivery and support.",
  },
  Controlling: {
    does: "Produces the figures and checks their quality.",
    changes: "The reporting. Not what sales, account managers or coordinators do.",
  },
  "Sales team lead": {
    does: "Leads a group of sellers day to day and runs their coaching.",
    changes: "How the team sells and what it is coached on.",
  },
};

/** The test questions for a governance row, in the order a learner should ask them. Taught in C4; repeated on request in Block 3.4. */
export const GOV_TESTS: { name: string; test: string }[] = [
  { name: "Owner", test: "Who can change the action that moves this KPI this week, without asking anyone above? The owner is that person, not the person who only reads the number." },
  { name: "Owner · Head of Sales or team lead", test: "Does the KPI belong to the whole sales function or to one team? A function-wide KPI sits with the head; a team’s own habit sits with its lead." },
  { name: "Owner · Controlling or the action’s owner", test: "Does the person change the number, or only report it? Only a KPI that is itself the report (reporting delivered on time) belongs to the person who produces the report." },
  { name: "Cadence", test: "How often does the thing behind the KPI actually happen and move? Read it that often, and no more often than a change can show." },
  { name: "Trigger", test: "Which number, read at which interval, ends the debate about whether to act? Write the threshold and the name of the person it goes to." },
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
