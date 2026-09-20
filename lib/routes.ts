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
};

export const ROUTES: RouteInfo[] = [
  {
    n: 1,
    href: "/route-1/",
    short: "Diagnose",
    title: "Route 1 · Knowledge",
    level: "Level 1 · Knowledge",
    blurb:
      "Read where DigitalIT Solutions loses prospects between the website and the signature, and what its repeat-purchase rate says about retention. Study material, then a Diagnostic Note.",
    plan: [
      { label: "Materi A · Level 1", minutes: 30 },
      { label: "Task 1 · Diagnostic Note", minutes: 15 },
    ],
    built: true,
  },
  {
    n: 2,
    href: "/route-2/",
    short: "Calculate",
    title: "Route 2 · Application",
    level: "Level 2 · Application",
    blurb:
      "Put a euro figure on three retention levers for two client segments, and choose one option per segment. Study material, then a Calculation Note.",
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
    blurb:
      "Decide how a €150,000 budget over four months is spent on retention, and who owns it. Not built yet: the page opens and holds a placeholder.",
    plan: [],
    built: false,
  },
];
