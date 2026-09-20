/** Lowercase ASCII, spaces to "-", diacritics stripped (ü → u, ß → ss). */
export function slug(input: string): string {
  return input
    .trim()
    .replace(/ß/g, "ss")
    .replace(/æ/gi, "ae")
    .replace(/ø/gi, "o")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TaskSlug = "l1-diagnostic" | "l2-calculation" | "l3-memo";

/** `{no}-{name}-day2-{task}` — e.g. `1-muchson-day2-l1-diagnostic`. The leading number is the Participant No. */
export function exportName(no: string, name: string, task: TaskSlug): string {
  const n = String(no).trim() || "0";
  return `${n}-${slug(name) || "participant"}-day2-${task}`;
}
