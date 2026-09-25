import { BUDGET, FIXED_COST, ITEMS, ITEM_IDS, LEVER_KPI, SCOPES, SHOW_UP, WINDOW_MONTHS, warningText, WARNING_UNFUNDED_TEXT } from "@/data/program";
import type { ItemId, KpiId, Scope } from "@/data/program";
import { NET, OPTIONS, SEGMENTS, SEG_IDS, cellKey, fmtEuroPlain } from "@/data/segments";
import type { OptId, SegId } from "@/data/segments";
import type { Route3State } from "@/store/useStore";
import { d1, tt } from "@/lib/lang";

export type Alloc = Route3State["alloc"];

const segsOf = (scope: Scope): SegId[] => (scope === "both" ? SEG_IDS : [scope]);

/** Upfront cost of the lever. A and C cost a fixed amount per client in scope; the discount costs nothing upfront. */
export function leverCost(opt: OptId | null, scope: Scope): number {
  if (!opt) return 0;
  const per = OPTIONS[opt].costPerClient;
  if (per === null) return 0;
  return segsOf(scope).reduce((s, g) => s + SEGMENTS[g].clients * per, 0);
}

/** Net impact per year (Task 2 figures) of the lever for the segments in scope. */
export function leverNet(opt: OptId | null, scope: Scope): number {
  if (!opt) return 0;
  return segsOf(scope).reduce((s, g) => s + NET[cellKey(opt, g)], 0);
}

export const isFunded = (a: Alloc, id: ItemId): boolean => (id === "lever" ? a.leverOpt !== null : a[id]);

export function itemCost(a: Alloc, id: ItemId): number {
  if (!isFunded(a, id)) return 0;
  return id === "lever" ? leverCost(a.leverOpt, a.leverScope) : FIXED_COST[id];
}

export const totalSpent = (a: Alloc) => ITEM_IDS.reduce((s, id) => s + itemCost(a, id), 0);
export const overBy = (a: Alloc) => Math.max(0, totalSpent(a) - BUDGET);
export const remaining = (a: Alloc) => BUDGET - totalSpent(a);
export const fundedItems = (a: Alloc): ItemId[] => ITEM_IDS.filter((id) => isFunded(a, id));

/**
 * The specific per-item message for an allocation over budget: which single cut or descope brings it back
 * within the €150,000, or, when no single move does, which items to combine. Never a generic "over budget".
 */
export function overBudgetLines(a: Alloc): string[] {
  const over = overBy(a);
  if (over === 0) return [];
  const moves: { text: string; saving: number }[] = [];
  for (const id of fundedItems(a)) {
    const it = ITEMS[id];
    if (id === "lever") {
      moves.push({ text: tt(`cut item 1 (${it.short}) entirely`, `Posten 1 (${it.short}) ganz streichen`), saving: itemCost(a, id) });
      if (a.leverScope === "both") {
        for (const sc of SCOPES.filter((s) => s.id !== "both")) {
          const saving = itemCost(a, id) - leverCost(a.leverOpt, sc.id);
          if (saving > 0) moves.push({ text: tt(`narrow item 1 to ${sc.short}`, `Posten 1 auf ${sc.short} eingrenzen`), saving });
        }
      }
    } else if (itemCost(a, id) > 0) {
      moves.push({ text: tt(`cut item ${it.n} (${it.short})`, `Posten ${it.n} (${it.short}) streichen`), saving: itemCost(a, id) });
    }
  }
  const fixes = moves.filter((m) => m.saving >= over);
  const head = tt(`${fmtEuroPlain(over)} over the ${fmtEuroPlain(BUDGET)} budget.`, `${fmtEuroPlain(over)} über dem Budget von ${fmtEuroPlain(BUDGET)}.`);
  if (fixes.length > 0) {
    return [
      head,
      ...fixes.map((m) =>
        tt(
          `To get within budget you could ${m.text}: saves ${fmtEuroPlain(m.saving)}, leaving ${fmtEuroPlain(BUDGET - (totalSpent(a) - m.saving))} unspent.`,
          `Um im Budget zu bleiben, könnten Sie ${m.text}: spart ${fmtEuroPlain(m.saving)} und lässt ${fmtEuroPlain(BUDGET - (totalSpent(a) - m.saving))} ungenutzt.`,
        ),
      ),
    ];
  }
  const biggest = [...moves].sort((x, y) => y.saving - x.saving)[0];
  return [
    head,
    tt(
      `No single cut or descope closes the gap. Combine at least two, starting with the largest: ${biggest.text} (saves ${fmtEuroPlain(biggest.saving)}).`,
      `Keine einzelne Streichung oder Eingrenzung schließt die Lücke. Kombinieren Sie mindestens zwei, beginnend mit der größten: ${biggest.text} (spart ${fmtEuroPlain(biggest.saving)}).`,
    ),
  ];
}

/** What the allocation leaves open: unfunded items, a descoped lever and the part of the leak the fix does not close. */
export function leftOpen(a: Alloc): string[] {
  const out: string[] = [];
  if (a.leverOpt === null) out.push(tt("Item 1 · the retention lever is not funded: repeat purchase stays untreated in both segments.", "Posten 1 · der Bindungshebel ist nicht finanziert: Der Wiederkauf bleibt in beiden Segmenten unbehandelt."));
  else if (a.leverScope !== "both") {
    const left = a.leverScope === "R" ? SEGMENTS.P.name : SEGMENTS.R.name;
    out.push(tt(`Item 1 · the lever is descoped: ${left} get no lever in this window.`, `Posten 1 · der Hebel ist eingegrenzt: ${left} erhalten in diesem Zeitraum keinen Hebel.`));
  }
  if (!a.fix)
    out.push(
      tt(
        `Item 2 · the funnel-leak fix is not funded: the show-up rate stays at ${SHOW_UP.before}%, ${(SHOW_UP.benchmark - SHOW_UP.before).toFixed(1)} pp below the benchmark.`,
        `Posten 2 · die Trichterleck-Behebung ist nicht finanziert: Die Erscheinungsquote bleibt bei ${d1(SHOW_UP.before)} %, ${d1(SHOW_UP.benchmark - SHOW_UP.before)} PP unter dem Benchmark.`,
      ),
    );
  else
    out.push(
      tt(
        `Item 2 · the fix stops at ${SHOW_UP.after}%: ${SHOW_UP.benchmark - SHOW_UP.after} pp of the gap to the ${SHOW_UP.benchmark}% benchmark stay open.`,
        `Posten 2 · die Behebung endet bei ${SHOW_UP.after} %: ${SHOW_UP.benchmark - SHOW_UP.after} PP der Lücke zum Benchmark von ${SHOW_UP.benchmark} % bleiben offen.`,
      ),
    );
  if (!a.dash) out.push(tt("Item 3 · the KPI dashboard is not funded: conversion rate, CLV and repeat-purchase rate stay unmeasured.", "Posten 3 · das KPI-Dashboard ist nicht finanziert: Konversionsrate, CLV und Wiederkaufsrate bleiben ungemessen."));
  if (!a.train) out.push(tt("Item 4 · the sales training is not funded: selling behaviour stays as it is.", "Posten 4 · die Vertriebsschulung ist nicht finanziert: Das Verkaufsverhalten bleibt, wie es ist."));
  return out;
}

/* ------------------------------------------------------------------ sequence */

export type SeqTruth = {
  /** Start months are not all set yet, so the rule cannot be applied. */
  pending: boolean;
  applies: boolean;
  text: string | null;
};

/**
 * The sequencing rule the widget enforces: when the lever launches before the KPI dashboard (or with it, or
 * without it), there is no baseline for the lever's early months. The dashboard's data starts the month after
 * it starts, so every lever month up to the dashboard's start month is blind.
 */
export function sequenceTruth(a: Alloc, start: Route3State["start"]): SeqTruth {
  if (a.leverOpt === null) return { pending: false, applies: false, text: null };
  if (!a.dash) return { pending: false, applies: true, text: WARNING_UNFUNDED_TEXT() };
  const L = start.lever;
  const D = start.dash;
  if (L === null || D === null) return { pending: true, applies: false, text: null };
  if (L > D) return { pending: false, applies: false, text: null };
  return { pending: false, applies: true, text: warningText(L, Math.min(D, WINDOW_MONTHS), D + 1) };
}

export const TRUE_KPI: KpiId = LEVER_KPI;

/** How many of the two sequence answers hold (the warning yes/no, and the KPI that loses its baseline). */
export function seqHolds(r3: Route3State): number {
  const t = sequenceTruth(r3.alloc, r3.start);
  let n = 0;
  if (r3.warned !== null && r3.warned === t.applies) n++;
  if (t.applies ? r3.missingKpi === TRUE_KPI : r3.warned === false) n++;
  return n;
}

/* ------------------------------------------------------------------ what the memo needs */

export const fundedGov = (a: Alloc): ItemId[] => fundedItems(a);

export const hasThreshold = (s: string) => /\d/.test(s);
