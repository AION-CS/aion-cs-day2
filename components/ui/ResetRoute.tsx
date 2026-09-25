"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { tt } from "@/lib/lang";


/** Clears one route's state only — the participant strip and the other route stay. Inline two-step confirm. */
export function ResetRoute({ route }: { route: 1 | 2 | 3 }) {
  const reset = useStore((s) => s.resetRoute);
  const [ask, setAsk] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4 print:hidden">
      {!ask ? (
        <button type="button" onClick={() => setAsk(true)} className="btn-ghost btn-sm">
          {tt(`Reset Route ${route}`, `Route ${route} zurücksetzen`)}
        </button>
      ) : (
        <>
          <p className="text-caption text-ink">
            {route === 1
              ? tt(
                  "Clear every answer of the Case File, in all three parts, with every mark and check count? Your name stays. The optional Routes 2 and 3 share the Level 2 and Level 3 answers, so those are cleared too.",
                  "Alle Antworten der Fallakte in allen drei Teilen samt Markierungen und Prüfzählern löschen? Ihr Name bleibt. Die optionalen Routen 2 und 3 nutzen die Antworten der Level 2 und 3 gemeinsam, deshalb werden auch diese gelöscht.",
                )
              : `Clear every Route ${route} answer, mark and check count? Your name and the other routes stay, apart from the answers they share with this one.`}
          </p>
          <button
            type="button"
            onClick={() => {
              reset(route);
              setAsk(false);
              window.scrollTo({ top: 0 });
            }}
            className="btn-primary btn-sm"
          >
            {tt(`Yes, reset Route ${route}`, `Ja, Route ${route} zurücksetzen`)}
          </button>
          <button type="button" onClick={() => setAsk(false)} className="btn-ghost btn-sm">
            {tt("Cancel", "Abbrechen")}
          </button>
        </>
      )}
    </div>
  );
}
