/** One registry for every material card: the rail, the cards and the task chips all read it. */
export type MaterialId = "A1" | "A2" | "A3" | "A4" | "B1" | "B2" | "B3" | "B4" | "C1" | "C2" | "C3" | "C4";
export type Block = "A" | "B" | "C";

export type MaterialMeta = { id: MaterialId; block: Block; title: string; minutes: number };

/** Materi A, B and C are 30 minutes each on Day 2 (a Monday half-day). */
export const MATERIALS: MaterialMeta[] = [
  { id: "A1", block: "A", title: "From buying motive to sales action", minutes: 8 },
  { id: "A2", block: "A", title: "The customer journey: three phases, one sorting rule", minutes: 8 },
  { id: "A3", block: "A", title: "Trust, relevance, consistency at each touchpoint", minutes: 8 },
  { id: "A4", block: "A", title: "KPI primer: conversion, customer value, repurchase", minutes: 6 },
  { id: "B1", block: "B", title: "From diagnosis to lever: three ways to retain", minutes: 8 },
  { id: "B2", block: "B", title: "Why segments respond differently", minutes: 7 },
  { id: "B3", block: "B", title: "Gross profit per repeat order: the unit of comparison", minutes: 7 },
  { id: "B4", block: "B", title: "Why a discount is a weak tool against relationship churn", minutes: 8 },
  { id: "C1", block: "C", title: "From one lever to a system: goal → action → KPI", minutes: 8 },
  { id: "C2", block: "C", title: "A one-off fix against a governed system", minutes: 7 },
  { id: "C3", block: "C", title: "Leverage and scale: what moves one deal, what moves the base", minutes: 7 },
  { id: "C4", block: "C", title: "Governance: owner, cadence, trigger", minutes: 8 },
];

export const MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map((m) => [m.id, m])) as Record<MaterialId, MaterialMeta>;
export const materialAnchorId = (id: MaterialId) => `mat-${id}`;

/** Section anchors per route page, in reading order. */
export type RailSection = { id: string; label: string; sub: string; minutes: number };
export const SECTIONS: Record<1 | 2 | 3, RailSection[]> = {
  1: [
    { id: "materi-a", label: "Materi A", sub: "Level 1 · Knowledge", minutes: 30 },
    { id: "task-1", label: "Task 1", sub: "Diagnostic Note", minutes: 15 },
  ],
  2: [
    { id: "materi-b", label: "Materi B", sub: "Level 2 · Application", minutes: 30 },
    { id: "task-2", label: "Task 2", sub: "Calculation Note", minutes: 15 },
  ],
  3: [
    { id: "materi-c", label: "Materi C", sub: "Level 3 · Management decision", minutes: 30 },
    { id: "task-3", label: "Task 3", sub: "Decision Memo", minutes: 15 },
  ],
};
