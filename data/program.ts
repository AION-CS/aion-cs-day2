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
