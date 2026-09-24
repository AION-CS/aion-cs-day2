"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";

/** Clears one route's state only — the participant strip and the other route stay. Inline two-step confirm. */
export function ResetRoute({ route }: { route: 1 | 2 | 3 }) {
  const reset = useStore((s) => s.resetRoute);
  const [ask, setAsk] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4 print:hidden">
      {!ask ? (
        <button type="button" onClick={() => setAsk(true)} className="btn-ghost btn-sm">
          Reset Route {route}
        </button>
      ) : (
        <>
          <p className="text-caption text-ink">
            {route === 1
              ? "Clear every answer of the Case File, in all three stages, with every mark and check count? Your name stays. The optional Routes 2 and 3 share the Level 2 and Level 3 answers, so those are cleared too."
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
            Yes, reset Route {route}
          </button>
          <button type="button" onClick={() => setAsk(false)} className="btn-ghost btn-sm">
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
