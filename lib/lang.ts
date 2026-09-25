/**
 * The active language as a plain module value (no React, no store), so data files, the export builders and the
 * components can all read it: `tt("English", "Deutsch")` returns the text of the active language, for a string or for
 * JSX. `<LangProvider>` (lib/i18n.tsx) sets it before its children render and remounts them when it changes.
 */
export type Lang = "en" | "de";

let current: Lang = "en";

export const getLang = (): Lang => current;
export const setCurrentLang = (l: Lang) => {
  current = l;
};

/** The text of the active language. Works for strings and for JSX. */
export function tt<T>(en: T, de: T): T {
  return current === "de" ? de : en;
}

/** The locale for numbers: German writes 1.234,5. */
export const locale = () => (current === "de" ? "de-DE" : "en-US");

/** A number in the active language's format. */
export const num = (n: number, opts?: Intl.NumberFormatOptions) => n.toLocaleString(locale(), opts);

/** One decimal place: 42.7 in English, 42,7 in German. */
export const d1 = (n: number) => num(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Euros: €60,000 in English, 60.000 € in German (with a no-break space). */
export const euro = (n: number) => (current === "de" ? `${num(Math.round(n))}\u00A0€` : `€${num(Math.round(n))}`);

/** Euros with a sign: +€3,416 / −€4,872 in English, +3.416 € / −4.872 € in German. A zero has no sign. */
export const euroSigned = (n: number) => {
  const sign = n < 0 ? "−" : n > 0 ? "+" : "";
  return current === "de" ? `${sign}${num(Math.abs(Math.round(n)))}\u00A0€` : `${sign}€${num(Math.abs(Math.round(n)))}`;
};

/** An object whose string properties are read lazily, so a value chosen with `tt` follows the language at read time. */
export function lazyRecord<K extends string>(defs: Record<K, () => string>): Record<K, string> {
  const o = {} as Record<K, string>;
  for (const k of Object.keys(defs) as K[]) Object.defineProperty(o, k, { get: defs[k], enumerable: true });
  return o;
}
