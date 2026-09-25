"use client";

import { create } from "zustand";

/**
 * Which Optional blocks of the Case File the learner has opened. Optional blocks start collapsed to one quiet line so the
 * eye stays on the Core blocks. Session-only, never persisted: the answers inside are persisted as usual, only the
 * open/closed state is not.
 */
type OptionalOpenState = {
  open: Record<string, boolean>;
  show: (id: string) => void;
  hide: (id: string) => void;
};

export const useOptionalOpen = create<OptionalOpenState>()((set) => ({
  open: {},
  show: (id) => set((s) => ({ open: { ...s.open, [id]: true } })),
  hide: (id) => set((s) => ({ open: { ...s.open, [id]: false } })),
}));

/** Opens an Optional block by its element id (a no-op for any other id), so a jump to it never lands on a closed block. */
export const openOptionalBlock = (id: string) => useOptionalOpen.getState().show(id);
