"use client";

import { Fragment, useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { setCurrentLang } from "@/lib/lang";
import type { Lang } from "@/lib/lang";
import { useHydrated, useStore } from "@/store/useStore";

/**
 * The German version of Route 1. One language is active at a time, and it is a plain module value, so data files, the
 * export builders and the components all read it the same way: \`tt("English", "Deutsch")\` returns the text of the active
 * language, for a string or for JSX. \`<LangProvider>\` sets it before its children render and remounts them when it
 * changes, so nothing has to subscribe to it and nothing keeps a stale language.
 *
 * Only Route 1 has a German version. On the home page and on the optional Routes 2 and 3 the language is always English,
 * whatever was chosen, and the choice is kept for when Route 1 is opened again. Mentor-only tools (answer keys, worked
 * answers, the mentor bar) stay English: they are for the facilitator, not for the learner.
 */
export type { Lang } from "@/lib/lang";
export { getLang, tt, locale, num, d1, euro, euroSigned } from "@/lib/lang";

/** Only Route 1 is translated. */
export const hasGerman = (pathname: string) => pathname.startsWith("/route-1");

export function LangProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const stored = useStore((s) => s.ui.lang);
  const pathname = usePathname() ?? "";
  const lang: Lang = hydrated && stored === "de" && hasGerman(pathname) ? "de" : "en";
  // Set before the children render (they read it while rendering), and remount them when it changes.
  setCurrentLang(lang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <Fragment key={lang}>{children}</Fragment>;
}

/** EN | DE, shown only where a German version exists. */
export function LangSwitch({ className }: { className?: string }) {
  const pathname = usePathname() ?? "";
  const hydrated = useHydrated();
  const stored = useStore((s) => s.ui.lang);
  const setLang = useStore((s) => s.setLang);
  if (!hasGerman(pathname)) return null;
  const on = hydrated ? stored : "en";
  return (
    <div role="group" aria-label="Language / Sprache" className={className}>
      {(["en", "de"] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={on === l}
          onClick={() => setLang(l)}
          className={
            "min-h-[28px] px-2 text-caption font-semibold transition-colors first:rounded-l-full last:rounded-r-full " +
            (on === l ? "bg-gold text-ink" : "text-paper/80 hover:bg-paper/10 hover:text-paper")
          }
        >
          {l === "en" ? "EN" : "DE"}
        </button>
      ))}
    </div>
  );
}
