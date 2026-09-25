/** Day 2 route registry — Customer Retention & Buying Behaviour in B2B IT Sales, Module 1. One route per level. */

export const COURSE = {
  title: "Applying Behaviour-Based Sales Strategy and Systematic Customer Retention",
  site: "Retention Lab · Day 2",
  module: "Module 1, Day 2 of 2",
  day: 2,
  company: "DigitalIT Solutions GmbH",
} as const;

export type RouteInfo = {
  n: 1 | 2 | 3;
  href: string;
  short: string;
  title: string;
  level: string;
  blurb: string;
  plan: { label: string; minutes: number }[];
  built: boolean;
  /** Kept for a longer day but not listed until the learner asks (CLAUDE.md #29). Never locked: the URL always opens. */
  optional?: boolean;
};

export const ROUTES: RouteInfo[] = [
  {
    n: 1,
    href: "/route-1/",
    short: "Capstone",
    title: "Route 1 · Capstone",
    level: "Levels 1 to 3 · one case",
    blurb:
      "One complete case in under two hours: find where DigitalIT Solutions loses prospects, put a euro figure on three ways to keep clients, and decide how a €150,000 budget is spent. Study material, then one task that ends in a Case File.",
    plan: [
      { label: "Materi A · six cards, Levels 1 to 3", minutes: 60 },
      { label: "Task · Case File, one task", minutes: 50 },
    ],
    built: true,
  },
  {
    n: 2,
    href: "/route-2/",
    short: "Calculate",
    title: "Route 2 · Application",
    level: "Level 2 · Application",
    optional: true,
    blurb:
      "The full Level 2 material and task on the same case: put a euro figure on three retention levers for two client segments, and choose one option per segment. Study material, then a Calculation Note.",
    plan: [
      { label: "Materi B · Level 2", minutes: 30 },
      { label: "Task 2 · Calculation Note", minutes: 15 },
    ],
    built: true,
  },
  {
    n: 3,
    href: "/route-3/",
    short: "Decide",
    title: "Route 3 · Management decision",
    level: "Level 3 · Management decision",
    optional: true,
    blurb:
      "The full Level 3 material and task on the same case: decide how a €150,000 budget over four months is spent on retention, and who owns it. Study material, then a Decision Memo that assembles itself beside your answers.",
    plan: [
      { label: "Materi C · Level 3", minutes: 30 },
      { label: "Task 3 · Decision Memo", minutes: 15 },
    ],
    built: true,
  },
];
