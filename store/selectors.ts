import { useStore } from "@/store/useStore";
import type { Persisted } from "@/store/useStore";
import { STEP_BY_ID } from "@/data/funnel";
import type { StepId } from "@/data/funnel";

/**
 * Selectors that later routes quote back to the participant. Plain functions of the store — no React —
 * so Route 2 (and Route 3) can read Route 1's answers without ever depending on them being finished.
 */

/** The stage the participant named as having the largest negative gap (Task 1, Block 1.3). */
export function getWeakestStage(state: Pick<Persisted, "l1"> = useStore.getState()): StepId | null {
  return state.l1.weakest;
}

export function weakestLabel(id: StepId | null): string {
  return id ? STEP_BY_ID[id].label : "";
}

/** The participant's one-sentence cost of the leak (Task 1, Block 1.4). */
export function getLeakSentence(state: Pick<Persisted, "l1"> = useStore.getState()): string {
  return state.l1.sentence.trim();
}
