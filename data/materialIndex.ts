/** One registry for every material card: the rail, the cards and the task chips all read it. */
export type MaterialId = "A1" | "A2" | "A3" | "A4" | "B1" | "B2" | "B3" | "B4";
export type Block = "A" | "B" | "C";

export type MaterialMeta = { id: MaterialId; block: Block; title: string; minutes: number };

/** Materi A and B are 30 minutes each on Day 2 (a Monday half-day). Materi C is built with Route 3. */
export const MATERIALS: MaterialMeta[] = [
  { id: "A1", block: "A", title: "From buying motive to sales action", minutes: 8 },
  { id: "A2", block: "A", title: "The customer journey: three phases, one sorting rule", minutes: 8 },
  { id: "A3", block: "A", title: "Trust, relevance, consistency at each touchpoint", minutes: 8 },
  { id: "A4", block: "A", title: "KPI primer: conversion, customer value, repurchase", minutes: 6 },
  { id: "B1", block: "B", title: "From diagnosis to lever: three ways to retain", minutes: 8 },
  { id: "B2", block: "B", title: "Why segments respond differently", minutes: 7 },
  { id: "B3", block: "B", title: "Gross profit per repeat order: the unit of comparison", minutes: 7 },
  { id: "B4", block: "B", title: "Why a discount is a weak tool against relationship churn", minutes: 8 },
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
  3: [{ id: "route-3-status", label: "Route 3", sub: "Level 3 · Management decision", minutes: 0 }],
};
