"use client";

import { createContext, useContext } from "react";
import type { MaterialId } from "@/data/materialIndex";

/**
 * The tasks of Levels 2 and 3 are shared by the full Routes 2 and 3 and by the Case File of Route 1. Their "Draws on" chips
 * and their help text name the card that teaches the method: Materi B or C on Routes 2 and 3, the capstone card on Route 1.
 * Route 1 wraps its stages in this provider and every chip and name below follows.
 */
const ALIAS: Partial<Record<MaterialId, MaterialId>> = { B1: "A3", B3: "A3", B2: "A4", B4: "A4", C1: "A5", C2: "A5", C3: "A6", C4: "A6" };

const Ctx = createContext(false);
export const CapstoneRefs = Ctx.Provider;

export function useMateri() {
  const capstone = useContext(Ctx);
  const id = (x: MaterialId): MaterialId => (capstone ? ALIAS[x] ?? x : x);
  return { id, name: (x: MaterialId) => `Materi ${id(x)}` };
}
