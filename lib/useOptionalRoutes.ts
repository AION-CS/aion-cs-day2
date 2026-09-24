"use client";

import { useHydrated, useStore } from "@/store/useStore";

/**
 * Routes 2 and 3 are optional on this day (CLAUDE.md #29): kept in full but listed only after the learner asks. This
 * hook drives every place that lists routes. Hidden is not locked: the URLs always open.
 */
export function useOptionalRoutes() {
  const hydrated = useHydrated();
  const shown = useStore((s) => s.ui.optionalRoutesShown);
  const set = useStore((s) => s.setOptionalRoutes);
  return { shown: hydrated && shown, hydrated, show: () => set(true), hide: () => set(false) };
}
