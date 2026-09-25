import { ROW_IDS, ROW_LABEL, COLS, COL_LABEL, cellId } from "@/data/funnel";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { CELL_KEYS, SEG_IDS, SEGMENTS, cellLabel } from "@/data/segments";
import { citedGridFigures, citesFunnelFigure } from "@/lib/checks";
import { ITEMS, ITEM_IDS } from "@/data/program";
import { fundedItems, hasThreshold, overBudgetLines } from "@/lib/program";
import type { Persisted } from "@/store/useStore";
import { tt } from "@/lib/lang";

/** DOM ids the missing list points at. One place, so the list and the UI cannot drift. */
export const IDS = {
  participant: "participant-strip",
  touchpoint: (id: string) => `tp-${id}`,
  cell: (id: string) => `cell-${id.replace(".", "-")}`,
  weakest: "weakest-field",
  sentence: "cost-sentence-field",
  exportCase: "export-case",
  exportL1: "export-l1",
  // Route 2
  grid: (k: string) => `grid-${k}`,
  loss: "loss-field",
  rec: (s: string) => `rec-${s}`,
  just: (s: string) => `just-${s}`,
  uniform: "uniform-field",
  tradeoff: "tradeoff-field",
  taskOneQuote: "task1-quote",
  exportL2: "export-l2",
  // Route 3
  allocGrid: "alloc-grid",
  allocTotal: "alloc-total",
  leverPick: "lever-pick",
  start: (i: string) => `start-${i}`,
  seqAnswers: "seq-answers",
  cut: "cut-field",
  gov: (i: string) => `gov-${i}`,
  postponed: "postponed-field",
  pickup: "pickup-field",
  exportL3: "export-l3",
} as const;

export type MissingEntry = { id: string; label: string };

export function participantMissing(p: Persisted): MissingEntry[] {
  return p.participant.name.trim() ? [] : [{ id: IDS.participant, label: tt("Your full name is needed for the file name.", "Ihr vollständiger Name wird für den Dateinamen benötigt.") }];
}

/** Everything still missing from the Task 1 diagnostic note, each with the element to jump to. */
export function l1Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { sort, fill, weakest, sentence } = p.l1;
  for (const t of TOUCHPOINTS) {
    if (sort[t.id] === null) out.push({ id: IDS.touchpoint(t.id), label: tt(`Block 1.1: “${t.label}” is not sorted into a phase.`, `Block 1.1: „${t.label}“ ist keiner Phase zugeordnet.`) });
  }
  for (const r of ROW_IDS) {
    for (const c of COLS) {
      if (!(fill[cellId(r, c)] ?? "").trim()) {
        out.push({ id: IDS.cell(cellId(r, c)), label: tt(`Block 1.2: “${ROW_LABEL[r]}” has no ${COL_LABEL[c].toLowerCase()}.`, `Block 1.2: „${ROW_LABEL[r]}“ hat keinen Eintrag bei ${COL_LABEL[c]}.`) });
      }
    }
  }
  if (!weakest) out.push({ id: IDS.weakest, label: tt("Block 1.3: the stage with the largest negative gap is not named.", "Block 1.3: Die Stufe mit der größten negativen Abweichung ist nicht benannt.") });
  const s = sentence.trim();
  if (!s) out.push({ id: IDS.sentence, label: tt("Block 1.4: the one-sentence cost of the leak is empty.", "Block 1.4: Der Ein-Satz-Kostensatz zum Leck ist leer.") });
  else if (s.length < 30) out.push({ id: IDS.sentence, label: tt("Block 1.4: the sentence needs at least 30 characters.", "Block 1.4: Der Satz braucht mindestens 30 Zeichen.") });
  else if (!citesFunnelFigure(s)) out.push({ id: IDS.sentence, label: tt("Block 1.4: the sentence states no number derived from the funnel.", "Block 1.4: Der Satz nennt keine aus dem Trichter abgeleitete Zahl.") });
  return out;
}

export function l2Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { l2 } = p;
  for (const k of CELL_KEYS) {
    if (!(l2.grid[k] ?? "").trim()) out.push({ id: IDS.grid(k), label: tt(`Block 2.1: net impact for ${cellLabel(k)} is empty.`, `Block 2.1: Der Nettoeffekt für ${cellLabel(k)} ist leer.`) });
  }
  if (!CELL_KEYS.some((k) => l2.loss[k]) && !l2.lossNone) {
    out.push({ id: IDS.loss, label: tt("Block 2.2: mark the cells that show a net loss, or state that none does.", "Block 2.2: Markieren Sie die Zellen mit Nettoverlust, oder geben Sie an, dass keine einen zeigt.") });
  }
  for (const s of SEG_IDS) {
    if (!l2.rec[s]) out.push({ id: IDS.rec(s), label: tt(`Block 2.3: no option chosen for ${SEGMENTS[s].name}.`, `Block 2.3: Für ${SEGMENTS[s].name} ist keine Option gewählt.`) });
    const j = l2.just[s].trim();
    if (!j) out.push({ id: IDS.just(s), label: tt(`Block 2.3: the justification for ${SEGMENTS[s].name} is empty.`, `Block 2.3: Die Begründung für ${SEGMENTS[s].name} ist leer.`) });
    else if (citedGridFigures(j, l2).length === 0) {
      out.push({ id: IDS.just(s), label: tt(`Block 2.3: the justification for ${SEGMENTS[s].name} cites no € figure from your grid.`, `Block 2.3: Die Begründung für ${SEGMENTS[s].name} nennt keine €-Zahl aus Ihrem Raster.`) });
    }
  }
  if (!l2.uniform) out.push({ id: IDS.uniform, label: tt("Block 2.4: no single option chosen for both segments.", "Block 2.4: Keine einzelne Option für beide Segmente gewählt.") });
  const t = l2.tradeoff.trim();
  if (!t) out.push({ id: IDS.tradeoff, label: tt("Block 2.4: the trade-off is empty.", "Block 2.4: Der Zielkonflikt ist leer.") });
  else if (t.length < 40) out.push({ id: IDS.tradeoff, label: tt("Block 2.4: the trade-off needs at least 40 characters.", "Block 2.4: Der Zielkonflikt braucht mindestens 40 Zeichen.") });
  else if (citedGridFigures(t, l2).length === 0) out.push({ id: IDS.tradeoff, label: tt("Block 2.4: the trade-off cites no € figure from your grid.", "Block 2.4: Der Zielkonflikt nennt keine €-Zahl aus Ihrem Raster.") });
  return out;
}

/**
 * What the decision part of the Case File (blocks 3.1 and 3.2) still needs: an allocation inside the budget with a start
 * month for every funded item, what you leave out with a pickup point, and an owner, cadence and trigger for each funded item.
 */
export function decisionMissing(p: Persisted): MissingEntry[] {
  const out: MissingEntry[] = [];
  const r = p.route3;
  const funded = fundedItems(r.alloc);
  if (funded.length === 0) out.push({ id: IDS.allocGrid, label: tt("Block 3.1: no line item is funded.", "Block 3.1: Kein Posten ist finanziert.") });
  const over = overBudgetLines(r.alloc);
  if (over.length > 0) out.push({ id: IDS.allocTotal, label: `Block 3.1: ${over.slice(0, 2).join(" ")}` });
  for (const i of funded) {
    if (r.start[i] === null) {
      out.push({ id: IDS.start(i), label: tt(`Block 3.1: item ${ITEMS[i].n} (${ITEMS[i].short}) has no start month.`, `Block 3.1: Posten ${ITEMS[i].n} (${ITEMS[i].short}) hat keinen Startmonat.`) });
    }
  }
  const post = r.postponed.trim();
  if (!post) out.push({ id: IDS.postponed, label: tt("Block 3.2: what you cut or postpone is empty. It is required.", "Block 3.2: Was Sie streichen oder zurückstellen, ist leer. Es ist Pflicht.") });
  else if (post.length < 30) {
    out.push({ id: IDS.postponed, label: tt("Block 3.2: what you cut or postpone needs at least 30 characters: name it, what it leaves open and why it waits.", "Block 3.2: Was Sie streichen oder zurückstellen, braucht mindestens 30 Zeichen: Nennen Sie es, was es offen lässt und warum es wartet.") });
  }
  if (!r.pickup) out.push({ id: IDS.pickup, label: tt("Block 3.2: no pickup point is chosen for what you postpone.", "Block 3.2: Für das Zurückgestellte ist kein Wiederaufnahmepunkt gewählt.") });
  for (const i of funded) {
    const g = r.gov[i];
    const name = tt(`item ${ITEMS[i].n} (${ITEMS[i].short})`, `Posten ${ITEMS[i].n} (${ITEMS[i].short})`);
    if (!g.owner) out.push({ id: IDS.gov(i), label: tt(`Block 3.2: ${name} has no owner.`, `Block 3.2: ${name} hat keinen Owner.`) });
    if (!g.cadence) out.push({ id: IDS.gov(i), label: tt(`Block 3.2: ${name} has no review cadence.`, `Block 3.2: ${name} hat keinen Review-Rhythmus.`) });
    if (!g.trigger.trim()) out.push({ id: IDS.gov(i), label: tt(`Block 3.2: ${name} has no escalation trigger.`, `Block 3.2: ${name} hat keinen Eskalations-Auslöser.`) });
    else if (g.trigger.trim().length < 12 || !hasThreshold(g.trigger)) {
      out.push({ id: IDS.gov(i), label: tt(`Block 3.2: the trigger for ${name} names no threshold (a number).`, `Block 3.2: Der Auslöser für ${name} nennt keinen Schwellenwert (eine Zahl).`) });
    }
  }
  return out;
}

/**
 * Everything still missing from the Case File of Route 1 (CLAUDE.md #29): the Core blocks 1.3, 1.4, 2.1, 2.3, 3.1 and 3.2, in one
 * list. Optional blocks (1.1, 1.2, 2.2) are never listed, and the Case File has no block 2.4. Each entry jumps to its block.
 */
export function caseMissing(p: Persisted): MissingEntry[] {
  const optional = (l: string) => /^Block (1.1|1.2|2.2):/.test(l);
  const notCase = (m: MissingEntry) => m.id !== IDS.participant && !optional(m.label) && !/^Block 2.4:/.test(m.label);
  return [...participantMissing(p), ...l1Missing(p).filter(notCase), ...l2Missing(p).filter(notCase), ...decisionMissing(p)];
}

/** The grid opens once Route 1 has diagnosed the leak and Route 2 has chosen one option for both segments. */
export const l3Unlocked = (p: Persisted) => p.l1.weakest !== null && p.l2.uniform !== null;

export function l3Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const r = p.route3;
  if (!p.l1.weakest) out.push({ id: IDS.weakest, label: tt("Unlock the grid: name the weakest funnel stage in Route 1 (Block 1.3).", "Raster freischalten: Benennen Sie die schwächste Trichterstufe in Route 1 (Block 1.3).") });
  if (!p.l2.uniform) out.push({ id: IDS.uniform, label: tt("Unlock the grid: choose one option for both segments in Route 2 (Block 2.4).", "Raster freischalten: Wählen Sie eine Option für beide Segmente in Route 2 (Block 2.4).") });
  const funded = fundedItems(r.alloc);
  if (funded.length === 0) out.push({ id: IDS.allocGrid, label: tt("Block 3.1: no line item is funded.", "Block 3.1: Kein Posten ist finanziert.") });
  const over = overBudgetLines(r.alloc);
  if (over.length > 0) out.push({ id: IDS.allocTotal, label: `Block 3.1: ${over.slice(0, 2).join(" ")}` });
  for (const i of funded) {
    if (r.start[i] === null) out.push({ id: IDS.start(i), label: tt(`Block 3.2: item ${ITEMS[i].n} (${ITEMS[i].short}) has no start month.`, `Block 3.2: Posten ${ITEMS[i].n} (${ITEMS[i].short}) hat keinen Startmonat.`) });
  }
  if (r.warned === null) out.push({ id: IDS.seqAnswers, label: tt("Block 3.2: record whether the KPI-blind-spot warning appeared for your sequence.", "Block 3.2: Halten Sie fest, ob für Ihre Reihenfolge der Hinweis auf den KPI-Blindfleck erschien.") });
  else if (r.warned && r.missingKpi === null) out.push({ id: IDS.seqAnswers, label: tt("Block 3.2: name the KPI that loses its baseline.", "Block 3.2: Benennen Sie die KPI, die ihren Ausgangswert verliert.") });
  const cut = r.cut.trim();
  if (!cut) out.push({ id: IDS.cut, label: tt("Block 3.3: what was cut is empty.", "Block 3.3: Was gestrichen wurde, ist leer.") });
  else if (cut.length < 40) out.push({ id: IDS.cut, label: tt("Block 3.3: what was cut needs at least 40 characters: name the item and its consequence.", "Block 3.3: Was gestrichen wurde, braucht mindestens 40 Zeichen: Nennen Sie den Posten und seine Folge.") });
  for (const i of funded) {
    const g = r.gov[i];
    const name = tt(`item ${ITEMS[i].n} (${ITEMS[i].short})`, `Posten ${ITEMS[i].n} (${ITEMS[i].short})`);
    if (!g.owner) out.push({ id: IDS.gov(i), label: tt(`Block 3.4: ${name} has no owner.`, `Block 3.4: ${name} hat keinen Owner.`) });
    if (!g.cadence) out.push({ id: IDS.gov(i), label: tt(`Block 3.4: ${name} has no review cadence.`, `Block 3.4: ${name} hat keinen Review-Rhythmus.`) });
    if (!g.trigger.trim()) out.push({ id: IDS.gov(i), label: tt(`Block 3.4: ${name} has no escalation trigger.`, `Block 3.4: ${name} hat keinen Eskalations-Auslöser.`) });
    else if (g.trigger.trim().length < 12 || !hasThreshold(g.trigger)) out.push({ id: IDS.gov(i), label: tt(`Block 3.4: the trigger for ${name} names no threshold (a number).`, `Block 3.4: Der Auslöser für ${name} nennt keinen Schwellenwert (eine Zahl).`) });
  }
  const post = r.postponed.trim();
  if (!post) out.push({ id: IDS.postponed, label: tt("Block 3.5: the measure you postponed is empty. It is required.", "Block 3.5: Die zurückgestellte Maßnahme ist leer. Sie ist Pflicht.") });
  else if (post.length < 30) out.push({ id: IDS.postponed, label: tt("Block 3.5: the measure you postponed needs at least 30 characters: name it and why it waits.", "Block 3.5: Die zurückgestellte Maßnahme braucht mindestens 30 Zeichen: Nennen Sie sie und warum sie wartet.") });
  if (!r.pickup) out.push({ id: IDS.pickup, label: tt("Block 3.5: no pickup point is chosen for the postponed measure.", "Block 3.5: Für die zurückgestellte Maßnahme ist kein Wiederaufnahmepunkt gewählt.") });
  return out;
}

export { ITEM_IDS };
