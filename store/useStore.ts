"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STAGE_IDS, ROW_IDS, COLS, cellId } from "@/data/funnel";
import type { Phase, StageId, StepId } from "@/data/funnel";
import { CELL_KEYS } from "@/data/segments";
import type { OptId, SegId } from "@/data/segments";
import { KEY_L1, KEY_L2, KEY_L3 } from "@/data/mentorKey";
import { ITEM_IDS } from "@/data/program";
import type { ItemId, KpiId, Scope } from "@/data/program";

export const STORAGE_KEY = "cs-d2-v1";
const HISTORY_CAP = 100;

export type SortMap = Record<StageId, Phase | null>;

/** Route 1 · Level 1 — the Diagnostic Note. */
export type L1State = {
  /** Block 1.1 */
  sort: SortMap;
  history: SortMap[];
  future: SortMap[];
  sortChecks: number;
  /** Last set-level check: how many placed rows hold. Cleared by the next placement. */
  sortResult: { holds: number; placed: number } | null;
  sortClue: boolean;
  /** Recorded in the export: the reasoning was opened after two genuine checks. */
  reasoningOpened: boolean;
  /** Block 1.2 — keyed "held.actual" */
  fill: Record<string, string>;
  fillFlagged: string[];
  fillClue: Record<string, boolean>;
  /** Block 1.3 */
  weakest: StepId | null;
  weakestFlagged: boolean;
  weakestClue: boolean;
  /** Block 1.4 */
  sentence: string;
  sentenceFlagged: boolean;
  sentenceClue: boolean;
  /** Every check requested in Route 1, printed in the export footer. */
  checks: number;
};

/** Route 2 · Level 2 — the Calculation Note. */
export type L2State = {
  /** The calculator's current selection. */
  calcSel: { opt: OptId | null; seg: SegId | null };
  /** Block 2.1 — keyed "A-P" */
  grid: Record<string, string>;
  gridFlagged: string[];
  gridClue: Record<string, boolean>;
  /** Block 2.2 */
  loss: Record<string, boolean>;
  lossNone: boolean;
  lossResult: { holds: number } | null;
  lossClue: boolean;
  /** Block 2.3 */
  rec: Record<SegId, OptId | null>;
  just: Record<SegId, string>;
  /** Block 2.4 */
  uniform: OptId | null;
  uniformFlagged: boolean;
  uniformClue: boolean;
  tradeoff: string;
  checks: number;
};

export type GovRow = { owner: string; cadence: string; trigger: string };

/** Route 3 · Level 3 — the Decision Memo. */
export type Route3State = {
  /** Block 3.1 — what is funded, and the lever's option and scope. */
  alloc: { leverOpt: OptId | null; leverScope: Scope; fix: boolean; dash: boolean; train: boolean };
  /** Block 3.2 — the month (1–4) each funded item starts. */
  start: Record<ItemId, number | null>;
  /** The learner's recorded answers about the KPI-blind-spot warning. */
  warned: boolean | null;
  missingKpi: KpiId | null;
  seqResult: { holds: number } | null;
  seqClue: boolean;
  /** Block 3.3 */
  cut: string;
  /** Block 3.4 — one row per funded item. */
  gov: Record<ItemId, GovRow>;
  /** Block 3.5 */
  postponed: string;
  pickup: string;
  checks: number;
};

export type Persisted = {
  participant: { name: string };
  ui: { bannerDismissed: Record<string, boolean>; sectionsRead: Record<string, boolean> };
  l1: L1State;
  l2: L2State;
  route3: Route3State;
};

type Session = {
  mentorUnlocked: boolean;
  /** Bumped by a reset so components holding local state remount clean. */
  resetCount: number;
};

type Actions = {
  setParticipant: (patch: Partial<Persisted["participant"]>) => void;
  dismissBanner: (routeKey: string) => void;
  toggleRead: (cardId: string, value?: boolean) => void;

  // Route 1
  placeTouchpoint: (id: StageId, phase: Phase | null) => void;
  undoSort: () => void;
  redoSort: () => void;
  checkSort: (result: { holds: number; placed: number }) => void;
  showSortClue: () => void;
  openReasoning: () => void;
  setFill: (cell: string, value: string) => void;
  checkFill: (flagged: string[]) => void;
  showFillClue: (cell: string) => void;
  setWeakest: (id: StepId | null) => void;
  checkWeakest: (flagged: boolean) => void;
  showWeakestClue: () => void;
  setSentence: (t: string) => void;
  checkSentence: (flagged: boolean) => void;
  showSentenceClue: () => void;

  // Route 2
  selectCalc: (patch: Partial<L2State["calcSel"]>) => void;
  setGrid: (key: string, value: string) => void;
  checkGrid: (flagged: string[]) => void;
  showGridClue: (key: string) => void;
  toggleLoss: (key: string) => void;
  setLossNone: (v: boolean) => void;
  checkLoss: (holds: number) => void;
  showLossClue: () => void;
  setRec: (seg: SegId, opt: OptId | null) => void;
  setJust: (seg: SegId, t: string) => void;
  setUniform: (opt: OptId | null) => void;
  checkUniform: (flagged: boolean) => void;
  showUniformClue: () => void;
  setTradeoff: (t: string) => void;

  // Route 3
  setAlloc: (patch: Partial<Route3State["alloc"]>) => void;
  setStart: (item: ItemId, month: number | null) => void;
  setWarned: (v: boolean) => void;
  setMissingKpi: (k: KpiId) => void;
  checkSeq: (holds: number) => void;
  showSeqClue: () => void;
  setCut: (t: string) => void;
  setGov: (item: ItemId, patch: Partial<GovRow>) => void;
  setPostponed: (t: string) => void;
  setPickup: (v: string) => void;

  setMentorUnlocked: (v: boolean) => void;
  mentorFill: () => void;
  resetRoute: (route: 1 | 2 | 3 | null) => void;
};

const emptySort = (): SortMap => Object.fromEntries(STAGE_IDS.map((id) => [id, null])) as SortMap;
const emptyFill = (): Record<string, string> =>
  Object.fromEntries(ROW_IDS.flatMap((r) => COLS.map((c) => [cellId(r, c), ""])));

const emptyL1 = (): L1State => ({
  sort: emptySort(),
  history: [],
  future: [],
  sortChecks: 0,
  sortResult: null,
  sortClue: false,
  reasoningOpened: false,
  fill: emptyFill(),
  fillFlagged: [],
  fillClue: {},
  weakest: null,
  weakestFlagged: false,
  weakestClue: false,
  sentence: "",
  sentenceFlagged: false,
  sentenceClue: false,
  checks: 0,
});

const emptyL2 = (): L2State => ({
  calcSel: { opt: null, seg: null },
  grid: Object.fromEntries(CELL_KEYS.map((k) => [k, ""])),
  gridFlagged: [],
  gridClue: {},
  loss: Object.fromEntries(CELL_KEYS.map((k) => [k, false])),
  lossNone: false,
  lossResult: null,
  lossClue: false,
  rec: { P: null, R: null },
  just: { P: "", R: "" },
  uniform: null,
  uniformFlagged: false,
  uniformClue: false,
  tradeoff: "",
  checks: 0,
});

const emptyGov = (): Record<ItemId, GovRow> =>
  Object.fromEntries(ITEM_IDS.map((i) => [i, { owner: "", cadence: "", trigger: "" }])) as Record<ItemId, GovRow>;

const emptyRoute3 = (): Route3State => ({
  alloc: { leverOpt: null, leverScope: "both", fix: false, dash: false, train: false },
  start: { lever: null, fix: null, dash: null, train: null },
  warned: null,
  missingKpi: null,
  seqResult: null,
  seqClue: false,
  cut: "",
  gov: emptyGov(),
  postponed: "",
  pickup: "",
  checks: 0,
});

const emptyPersisted = (): Persisted => ({
  participant: { name: "" },
  ui: { bannerDismissed: {}, sectionsRead: {} },
  l1: emptyL1(),
  l2: emptyL2(),
  route3: emptyRoute3(),
});

const pushCapped = <T,>(list: T[], item: T) => [...list, item].slice(-HISTORY_CAP);

export const useStore = create<Persisted & Session & Actions>()(
  persist(
    (set) => ({
      ...emptyPersisted(),
      mentorUnlocked: false,
      resetCount: 0,

      setParticipant: (patch) => set((s) => ({ participant: { ...s.participant, ...patch } })),
      dismissBanner: (routeKey) =>
        set((s) => ({ ui: { ...s.ui, bannerDismissed: { ...s.ui.bannerDismissed, [routeKey]: true } } })),
      toggleRead: (cardId, value) =>
        set((s) => ({
          ui: { ...s.ui, sectionsRead: { ...s.ui.sectionsRead, [cardId]: value ?? !s.ui.sectionsRead[cardId] } },
        })),

      // --- Route 1 · Task 1 --------------------------------------------------
      placeTouchpoint: (id, phase) =>
        set((s) => {
          const before = s.l1.sort;
          if (before[id] === phase) return {};
          return {
            l1: {
              ...s.l1,
              sort: { ...before, [id]: phase },
              history: pushCapped(s.l1.history, before),
              future: [],
              sortResult: null,
            },
          };
        }),
      undoSort: () =>
        set((s) => {
          const prev = s.l1.history[s.l1.history.length - 1];
          if (!prev) return {};
          return {
            l1: { ...s.l1, sort: prev, history: s.l1.history.slice(0, -1), future: pushCapped(s.l1.future, s.l1.sort), sortResult: null },
          };
        }),
      redoSort: () =>
        set((s) => {
          const next = s.l1.future[s.l1.future.length - 1];
          if (!next) return {};
          return {
            l1: { ...s.l1, sort: next, history: pushCapped(s.l1.history, s.l1.sort), future: s.l1.future.slice(0, -1), sortResult: null },
          };
        }),
      checkSort: (result) =>
        set((s) => ({ l1: { ...s.l1, checks: s.l1.checks + 1, sortChecks: s.l1.sortChecks + 1, sortResult: result } })),
      showSortClue: () => set((s) => ({ l1: { ...s.l1, sortClue: true } })),
      openReasoning: () => set((s) => ({ l1: { ...s.l1, reasoningOpened: true } })),
      setFill: (cell, value) =>
        set((s) => ({
          l1: { ...s.l1, fill: { ...s.l1.fill, [cell]: value }, fillFlagged: s.l1.fillFlagged.filter((f) => f !== cell) },
        })),
      checkFill: (flagged) => set((s) => ({ l1: { ...s.l1, checks: s.l1.checks + 1, fillFlagged: flagged, fillClue: {} } })),
      showFillClue: (cell) => set((s) => ({ l1: { ...s.l1, fillClue: { ...s.l1.fillClue, [cell]: true } } })),
      setWeakest: (id) => set((s) => ({ l1: { ...s.l1, weakest: id, weakestFlagged: false, weakestClue: false } })),
      checkWeakest: (flagged) =>
        set((s) => ({ l1: { ...s.l1, checks: s.l1.checks + 1, weakestFlagged: flagged, weakestClue: false } })),
      showWeakestClue: () => set((s) => ({ l1: { ...s.l1, weakestClue: true } })),
      setSentence: (t) => set((s) => ({ l1: { ...s.l1, sentence: t, sentenceFlagged: false } })),
      checkSentence: (flagged) =>
        set((s) => ({ l1: { ...s.l1, checks: s.l1.checks + 1, sentenceFlagged: flagged, sentenceClue: false } })),
      showSentenceClue: () => set((s) => ({ l1: { ...s.l1, sentenceClue: true } })),

      // --- Route 2 · Task 2 --------------------------------------------------
      selectCalc: (patch) => set((s) => ({ l2: { ...s.l2, calcSel: { ...s.l2.calcSel, ...patch } } })),
      setGrid: (key, value) =>
        set((s) => ({ l2: { ...s.l2, grid: { ...s.l2.grid, [key]: value }, gridFlagged: s.l2.gridFlagged.filter((f) => f !== key) } })),
      checkGrid: (flagged) => set((s) => ({ l2: { ...s.l2, checks: s.l2.checks + 1, gridFlagged: flagged, gridClue: {} } })),
      showGridClue: (key) => set((s) => ({ l2: { ...s.l2, gridClue: { ...s.l2.gridClue, [key]: true } } })),
      toggleLoss: (key) =>
        set((s) => ({
          l2: { ...s.l2, loss: { ...s.l2.loss, [key]: !s.l2.loss[key] }, lossNone: false, lossResult: null },
        })),
      setLossNone: (v) =>
        set((s) => ({
          l2: {
            ...s.l2,
            lossNone: v,
            loss: v ? Object.fromEntries(CELL_KEYS.map((k) => [k, false])) : s.l2.loss,
            lossResult: null,
          },
        })),
      checkLoss: (holds) => set((s) => ({ l2: { ...s.l2, checks: s.l2.checks + 1, lossResult: { holds } } })),
      showLossClue: () => set((s) => ({ l2: { ...s.l2, lossClue: true } })),
      setRec: (seg, opt) => set((s) => ({ l2: { ...s.l2, rec: { ...s.l2.rec, [seg]: opt } } })),
      setJust: (seg, t) => set((s) => ({ l2: { ...s.l2, just: { ...s.l2.just, [seg]: t } } })),
      setUniform: (opt) => set((s) => ({ l2: { ...s.l2, uniform: opt, uniformFlagged: false, uniformClue: false } })),
      checkUniform: (flagged) =>
        set((s) => ({ l2: { ...s.l2, checks: s.l2.checks + 1, uniformFlagged: flagged, uniformClue: false } })),
      showUniformClue: () => set((s) => ({ l2: { ...s.l2, uniformClue: true } })),
      setTradeoff: (t) => set((s) => ({ l2: { ...s.l2, tradeoff: t } })),

      // --- Route 3 · Task 3 --------------------------------------------------
      setAlloc: (patch) =>
        set((s) => {
          const alloc = { ...s.route3.alloc, ...patch };
          // an item that is no longer funded has no start month
          const start = { ...s.route3.start };
          if (alloc.leverOpt === null) start.lever = null;
          if (!alloc.fix) start.fix = null;
          if (!alloc.dash) start.dash = null;
          if (!alloc.train) start.train = null;
          return { route3: { ...s.route3, alloc, start, seqResult: null } };
        }),
      setStart: (item, month) =>
        set((s) => ({ route3: { ...s.route3, start: { ...s.route3.start, [item]: month }, seqResult: null } })),
      setWarned: (v) => set((s) => ({ route3: { ...s.route3, warned: v, seqResult: null } })),
      setMissingKpi: (k) => set((s) => ({ route3: { ...s.route3, missingKpi: k, seqResult: null } })),
      checkSeq: (holds) => set((s) => ({ route3: { ...s.route3, checks: s.route3.checks + 1, seqResult: { holds } } })),
      showSeqClue: () => set((s) => ({ route3: { ...s.route3, seqClue: true } })),
      setCut: (t) => set((s) => ({ route3: { ...s.route3, cut: t } })),
      setGov: (item, patch) =>
        set((s) => ({ route3: { ...s.route3, gov: { ...s.route3.gov, [item]: { ...s.route3.gov[item], ...patch } } } })),
      setPostponed: (t) => set((s) => ({ route3: { ...s.route3, postponed: t } })),
      setPickup: (v) => set((s) => ({ route3: { ...s.route3, pickup: v } })),

      // --- session / mentor / reset ------------------------------------------
      setMentorUnlocked: (v) => set({ mentorUnlocked: v }),

      // Mentor autofill: every model answer in Routes 1, 2 and 3, plus the participant name if it is
      // empty, so each note can be exported straight away.
      mentorFill: () =>
        set((s) => {
          const l1 = emptyL1();
          l1.sort = { ...KEY_L1.sort };
          l1.fill = { ...KEY_L1.fill };
          l1.weakest = KEY_L1.weakest;
          l1.sentence = KEY_L1.sentence;
          const l2 = emptyL2();
          l2.grid = { ...KEY_L2.grid };
          l2.loss = { ...KEY_L2.loss };
          l2.rec = { ...KEY_L2.rec };
          l2.just = { ...KEY_L2.just };
          l2.uniform = KEY_L2.uniform;
          l2.tradeoff = KEY_L2.tradeoff;
          l2.calcSel = { opt: "A", seg: "P" };
          const participant = { name: s.participant.name.trim() ? s.participant.name : "Mentor Check" };
          const route3 = emptyRoute3();
          route3.alloc = { ...KEY_L3.alloc };
          route3.start = { ...KEY_L3.start };
          route3.warned = KEY_L3.warned;
          route3.missingKpi = KEY_L3.missingKpi;
          route3.cut = KEY_L3.cut;
          route3.gov = Object.fromEntries(ITEM_IDS.map((i) => [i, { ...KEY_L3.gov[i] }])) as Record<ItemId, GovRow>;
          route3.postponed = KEY_L3.postponed;
          route3.pickup = KEY_L3.pickup;
          return { participant, l1, l2, route3, resetCount: s.resetCount + 1 };
        }),

      // One route's state only (Route 1 = Materi A + Task 1, Route 2 = Materi B + Task 2). The participant strip stays.
      resetRoute: (route) =>
        set((s) => {
          const prefix = route === 1 ? "A" : route === 2 ? "B" : "C";
          const keep = (k: string) => (route === null ? false : !k.startsWith(prefix));
          const sectionsRead = Object.fromEntries(Object.entries(s.ui.sectionsRead).filter(([k]) => keep(k)));
          const bannerDismissed = { ...s.ui.bannerDismissed };
          if (route === null) for (const k of Object.keys(bannerDismissed)) delete bannerDismissed[k];
          else delete bannerDismissed[`r${route}`];
          return {
            l1: route === null || route === 1 ? emptyL1() : s.l1,
            l2: route === null || route === 2 ? emptyL2() : s.l2,
            route3: route === null || route === 3 ? emptyRoute3() : s.route3,
            ui: { bannerDismissed, sectionsRead },
            resetCount: s.resetCount + 1,
          };
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 3,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      // Session-only flags (mentor unlock, reset counter) never persist.
      partialize: (s) => ({ participant: s.participant, ui: s.ui, l1: s.l1, l2: s.l2, route3: s.route3 }),
      // Any change to the persisted shape bumps `version` and adds a step here; `merge` below then fills
      // every field an older blob lacks from the defaults. v1 -> v2: Route 3 (the Decision Memo) gained its
      // state; a v1 blob carries an empty route3, which merge fills from the defaults. v2 -> v3: the typed
      // participant number was dropped (the file number now comes from the route), so it is removed here.
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<Persisted> & { participant?: { no?: string; name?: string } };
        return { ...p, participant: { name: p.participant?.name ?? "" } } as Persisted;
      },
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Persisted>;
        const base = emptyPersisted();
        return {
          ...current,
          participant: { name: p.participant?.name ?? base.participant.name },
          ui: {
            sectionsRead: { ...base.ui.sectionsRead, ...p.ui?.sectionsRead },
            bannerDismissed:
              p.ui && typeof p.ui.bannerDismissed === "object" && p.ui.bannerDismissed !== null ? { ...p.ui.bannerDismissed } : {},
          },
          l1: {
            ...base.l1,
            ...p.l1,
            sort: { ...base.l1.sort, ...p.l1?.sort },
            fill: { ...base.l1.fill, ...p.l1?.fill },
            history: Array.isArray(p.l1?.history) ? p.l1.history : [],
            future: Array.isArray(p.l1?.future) ? p.l1.future : [],
            fillFlagged: Array.isArray(p.l1?.fillFlagged) ? p.l1.fillFlagged : [],
            fillClue: { ...p.l1?.fillClue },
          },
          l2: {
            ...base.l2,
            ...p.l2,
            calcSel: { ...base.l2.calcSel, ...p.l2?.calcSel },
            grid: { ...base.l2.grid, ...p.l2?.grid },
            loss: { ...base.l2.loss, ...p.l2?.loss },
            rec: { ...base.l2.rec, ...p.l2?.rec },
            just: { ...base.l2.just, ...p.l2?.just },
            gridFlagged: Array.isArray(p.l2?.gridFlagged) ? p.l2.gridFlagged : [],
            gridClue: { ...p.l2?.gridClue },
          },
          route3: {
            ...base.route3,
            ...p.route3,
            alloc: { ...base.route3.alloc, ...p.route3?.alloc },
            start: { ...base.route3.start, ...p.route3?.start },
            gov: Object.fromEntries(
              ITEM_IDS.map((i) => [i, { ...base.route3.gov[i], ...p.route3?.gov?.[i] }]),
            ) as Record<ItemId, GovRow>,
          },
        };
      },
    },
  ),
);

/**
 * The store is created with `skipHydration`, so the server render and the first client paint both see the
 * defaults (no hydration mismatch). <StoreHydrator/> reads localStorage once after mount. This hook reports
 * when it has finished, for UI that must not flash a default (a dismissed banner, a read mark).
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    if (useStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}

export function rehydrateStore() {
  return useStore.persist.rehydrate();
}

