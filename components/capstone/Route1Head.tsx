"use client";

import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { tt } from "@/lib/lang";

/** The heading and the suggested-order banner of Route 1, in the active language. */
export function Route1Head() {
  return (
    <>
      <header className="space-y-1">
        <p className="smallcaps text-accent">{tt("Route 1 · Levels 1 to 3 · Capstone", "Route 1 · Level 1 bis 3 · Capstone")}</p>
        <h1>{tt("From the leak to the decision, in one case", "Vom Leck zur Entscheidung, in einem Fall")}</h1>
      </header>
      <SuggestedOrderBanner
        routeKey="r1"
        text={tt(
          "Materi A → the Case File, one task in three parts (Diagnose, Calculate, Decide). Every section stays open, so you can start anywhere.",
          "Materi A → die Fallakte, eine Aufgabe in drei Teilen (Diagnostizieren, Berechnen, Entscheiden). Jeder Abschnitt bleibt offen, Sie können also überall beginnen.",
        )}
      />
    </>
  );
}
