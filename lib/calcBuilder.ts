import { CONTRACT_VALUE, STAGE_BY_ID, STEP_BY_ID } from "@/data/funnel";
import type { StepId } from "@/data/funnel";
import { CELL_KEYS, CONTRACT, OPTIONS, SEGMENTS, parseKey } from "@/data/segments";
import type { OptId, SegId } from "@/data/segments";
import { parseAmount } from "@/lib/parseAmount";

/**
 * The "automatic calculator" under a calculation question: the formula split into small labelled parts. The
 * learner types each part (a value read from a printed table or from the funnel); the result is computed live
 * and can be copied into the answer field. On "Check", every part is compared with the value it should hold,
 * and a wrong part names the exact row and part of the row to read, never the value itself. Expected values
 * come from the same constants as the tables, the calculator and the model answers (data/segments.ts,
 * data/funnel.ts), so a builder cannot drift from them.
 */
export type CalcPart = {
  id: string;
  /** Short label shown above the input, e.g. "Clients in the segment". */
  label: string;
  expected: number;
  /** Absolute tolerance; 0 for a value read straight off a table. */
  tolerance?: number;
  /** Where to read it, shown when the part is flagged: the row and which part of it, never the value. */
  clue: string;
};

export type CalcBuilder = {
  parts: CalcPart[];
  /** The result from the part values (all present). */
  compute: (v: Record<string, number>) => number;
  /** The formula with the learner's values in place, for display. */
  show: (v: Record<string, string>) => string;
};

/* ------------------------------------------------------------------ Block 2.1 · one builder per grid cell */

/** The builder for one Option × Segment cell. A and C cost a fixed amount per client; B is a price cut on every repeat order. */
export function cellBuilder(opt: OptId, seg: SegId): CalcBuilder {
  const o = OPTIONS[opt];
  const s = SEGMENTS[seg];
  const optName = `Option ${opt}`;
  const shared: CalcPart[] = [
    {
      id: "clients",
      label: `Clients in ${s.short.toLowerCase()} segment`,
      expected: s.clients,
      clue: "Given · client base: the Clients column, in the row of the segment you are working on. Not the other segment, and not the baseline repeat orders.",
    },
    {
      id: "uplift",
      label: "Uplift (percentage points)",
      expected: o.uplift[seg],
      clue: `Given · the three options: the Uplift ${seg} column, in the ${optName} row. It is a number of percentage points, typed as printed, not as a fraction.`,
    },
    {
      id: "gp",
      label: "Gross profit per order (€)",
      expected: CONTRACT.gp,
      clue: "The line below the client-base table: gross profit per order. It is not the contract price on the same line.",
    },
  ];
  if (o.discount === null) {
    return {
      parts: [
        ...shared,
        {
          id: "cpc",
          label: "Cost per client per year (€)",
          expected: o.costPerClient ?? 0,
          clue: `Given · the three options: Cost / client / yr, in the ${optName} row. It is a cost per client, so it is multiplied by the clients.`,
        },
      ],
      compute: (v) => (v.clients * v.uplift) / 100 * v.gp - v.clients * v.cpc,
      show: (v) => `${v.clients} × ${v.uplift}% × ${v.gp} − ${v.clients} × ${v.cpc}`,
    };
  }
  return {
    parts: [
      ...shared,
      {
        id: "base",
        label: "Baseline repeat orders (last 12 months)",
        expected: s.baseline,
        clue: "Given · client base: Baseline repeat orders, in the row of this segment. These are the orders the segment already places, not the number of clients.",
      },
      {
        id: "price",
        label: "Contract price (€)",
        expected: CONTRACT.price,
        clue: "The line below the client-base table: contract price. It is not the gross profit on the same line; a discount is taken off the price.",
      },
      {
        id: "disc",
        label: "Discount (%)",
        expected: (o.discount ?? 0) * 100,
        clue: `Given · the three options: the percentage in the name of the ${optName} row. It is taken off the repeat order, so it is paid on every one.`,
      },
    ],
    compute: (v) => (v.clients * v.uplift) / 100 * v.gp - (v.base + (v.clients * v.uplift) / 100) * v.price * (v.disc / 100),
    show: (v) => `${v.clients} × ${v.uplift}% × ${v.gp} − (${v.base} + ${v.clients} × ${v.uplift}%) × ${v.price} × ${v.disc}%`,
  };
}

/** Builders for the six cells, keyed by the grid's cell key ("A-P"). */
export const GRID_BUILDERS: Record<string, CalcBuilder> = Object.fromEntries(
  CELL_KEYS.map((k) => {
    const { opt, seg } = parseKey(k);
    return [k, cellBuilder(opt, seg)];
  }),
);

/* ------------------------------------------------------------------ Block 1.4 · the cost of the leak */

/** The figure id the Block 1.4 builder is stored under. */
export const COST_FIGURE = "COST";

/**
 * The cost of the leak at the arrow the learner named in Block 1.3: prospects lost at that arrow × the rate at
 * which the prospects below it reach a signature × the average contract value. Built from the learner's own
 * pick, so its clues never name a stage.
 */
export function costBuilder(step: StepId): CalcBuilder {
  const s = STEP_BY_ID[step];
  const signed = STAGE_BY_ID.signed.count;
  return {
    parts: [
      { id: "above", label: "Count at the stage above the arrow", expected: s.fromCount, clue: "The funnel: the count printed on the bar above the arrow you named in Block 1.3." },
      { id: "below", label: "Count at the stage below the arrow", expected: s.toCount, clue: "The funnel: the count printed on the bar below the arrow you named in Block 1.3." },
      { id: "signed", label: "Contracts signed in the year", expected: signed, clue: "The funnel: the count on the last bar, Contract signed." },
      {
        id: "value",
        label: "Average contract value (€)",
        expected: CONTRACT_VALUE,
        clue: "The case brief above the funnel: the average value of a signed project contract.",
      },
    ],
    compute: (v) => ((v.above - v.below) * v.signed * v.value) / v.below,
    show: (v) => `(${v.above} − ${v.below}) × ${v.signed} ÷ ${v.below} × ${v.value}`,
  };
}

/* ------------------------------------------------------------------ shared helpers */

export const partKey = (figure: string, part: string) => `${figure}.${part}`;

/** Parses every part of a builder; null for a part that is empty or unreadable. */
export function partValues(b: CalcBuilder, figure: string, parts: Record<string, string>): Record<string, number | null> {
  return Object.fromEntries(
    b.parts.map((p) => {
      const raw = (parts[partKey(figure, p.id)] ?? "").trim();
      return [p.id, raw ? parseAmount(raw) : null];
    }),
  );
}

/** The live result, or null while a part is missing. */
export function builderResult(b: CalcBuilder, figure: string, parts: Record<string, string>): number | null {
  const v = partValues(b, figure, parts);
  if (Object.values(v).some((x) => x === null)) return null;
  const r = b.compute(v as Record<string, number>);
  return Number.isFinite(r) ? Math.round(r * 1e6) / 1e6 : null;
}

/** Part keys ("A-P.clients") whose entered value differs from what the row holds. Empty parts are not flagged. */
export function wrongParts(b: CalcBuilder, figure: string, parts: Record<string, string>): string[] {
  const v = partValues(b, figure, parts);
  return b.parts
    .filter((p) => {
      const x = v[p.id];
      return x !== null && Math.abs(x - p.expected) > (p.tolerance ?? 1e-9);
    })
    .map((p) => partKey(figure, p.id));
}

/** True when every part is filled and none is wrong. */
export function allPartsRight(b: CalcBuilder, figure: string, parts: Record<string, string>): boolean {
  const v = partValues(b, figure, parts);
  return Object.values(v).every((x) => x !== null) && wrongParts(b, figure, parts).length === 0;
}

/** The model part values, as strings, for the mentor fill. */
export function modelParts(builders: Partial<Record<string, CalcBuilder>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [fid, b] of Object.entries(builders)) if (b) for (const p of b.parts) out[partKey(fid, p.id)] = String(p.expected);
  return out;
}

/** Part flags for every grid cell, from the learner's parts. */
export function gridPartFlags(parts: Record<string, string>): string[] {
  return CELL_KEYS.flatMap((k) => wrongParts(GRID_BUILDERS[k], k, parts));
}
