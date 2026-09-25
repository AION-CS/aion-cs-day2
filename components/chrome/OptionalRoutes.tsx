"use client";

import { useEffect } from "react";
import { useOptionalRoutes } from "@/lib/useOptionalRoutes";
import { tt } from "@/lib/lang";

/**
 * The small, quiet button that lists the optional Routes 2 and 3 (CLAUDE.md #29). Not the primary style: it is a
 * convenience for a later day that wants the full material, and it changes only what is listed, never what opens.
 */
export function OptionalRoutesButton() {
  const { shown, show, hide, hydrated } = useOptionalRoutes();
  if (!hydrated) return <div className="min-h-[1.5rem]" />;
  return (
    <button
      type="button"
      aria-pressed={shown}
      onClick={shown ? hide : show}
      className="smallcaps text-ash underline decoration-dotted underline-offset-2 hover:text-accentHi"
    >
      {shown ? "Hide the optional routes" : "Optional · Full Level 2 and 3 routes"}
    </button>
  );
}

/** A one-line notice at the end of Route 1: the same choice, offered where a finished learner is looking. */
export function OptionalRoutesNotice() {
  const { shown, show, hydrated } = useOptionalRoutes();
  if (!hydrated || shown) return null;
  return (
    <p role="note" className="rounded-lg border border-line bg-mist/60 px-3 py-2 text-caption text-ash print:hidden">
      {tt(
        "Want the full Level 2 and Level 3 material on this same case, with its own task and export for each?",
        "Möchten Sie das vollständige Material zu Level 2 und Level 3 an demselben Fall, jeweils mit eigener Aufgabe und eigenem Export?",
      )}{" "}
      <button type="button" onClick={show} className="font-semibold text-ink underline decoration-dotted underline-offset-2">
        {tt("Show the optional routes", "Optionale Routen anzeigen")}
      </button>
      .
    </p>
  );
}

/** Opening Route 2 or Route 3 directly lists them in the navigation from then on: hidden never means locked. */
export function RevealOnVisit() {
  const { hydrated, shown, show } = useOptionalRoutes();
  useEffect(() => {
    if (hydrated && !shown) show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);
  return null;
}
