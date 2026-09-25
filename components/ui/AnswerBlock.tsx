"use client";

import type { ReactNode } from "react";
import { tt } from "@/lib/lang";
import { useOptionalOpen } from "@/store/useOptionalOpen";


export type BlockKind = "OBJECTIVE" | "JUDGED" | "OBJECTIVE + JUDGED" | "EXPLORATORY";

/**
 * Where a block sits in the Friday Case File (CLAUDE.md #29): Core blocks are required for a complete file, Optional
 * blocks are for whoever has time and are never listed as missing. Minutes are a guide, not a timer.
 */
export type Tier = { level: "core" | "optional"; minutes: number };

export function TierPill({ tier }: { tier: Tier }) {
  return tier.level === "core" ? (
    <span className="pill border-signal/40 bg-signalSoft text-signal" title={tt("Needed for a complete Case File.", "Nötig für eine vollständige Fallakte.")}>
      {tt(`CORE · about ${tier.minutes} min`, `KERN · ca. ${tier.minutes} Min.`)}
    </span>
  ) : (
    <span className="pill border-dashed border-ash/60 bg-mist text-ash" title={tt("For whoever has time. Never listed as missing.", "Für alle, die Zeit haben. Wird nie als fehlend aufgeführt.")}>
      {tt(`OPTIONAL · about ${tier.minutes} min`, `OPTIONAL · ca. ${tier.minutes} Min.`)}
    </span>
  );
}

export function Pill({ kind }: { kind: BlockKind }) {
  if (kind === "OBJECTIVE + JUDGED") {
    return (
      <>
        <Pill kind="OBJECTIVE" />
        <Pill kind="JUDGED" />
      </>
    );
  }
  const cls = kind === "OBJECTIVE" ? "pill-obj" : kind === "EXPLORATORY" ? "pill border-line bg-mist text-ash" : "pill-jdg";
  const label = kind === "OBJECTIVE" ? tt("OBJECTIVE", "OBJEKTIV") : kind === "EXPLORATORY" ? tt("EXPLORATORY", "ERKUNDEND") : tt("JUDGED", "URTEIL");
  const title =
    kind === "OBJECTIVE"
      ? tt("One answer the file or the tables settle.", "Eine Antwort, die der Fall oder die Tabellen entscheiden.")
      : kind === "EXPLORATORY"
        ? tt("Not graded and not exported.", "Nicht bewertet und nicht exportiert.")
        : tt("Your judgement, defended in your own words.", "Ihr Urteil, mit eigenen Worten begründet.");
  return (
    <span className={cls} title={title}>
      {label}
    </span>
  );
}

/** The FIND IT line: exact route + widget name as printed on screen + the exact click. */
export function FindIt({ path, analyse = true }: { path: string; analyse?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-caption text-ash">
        <span className="smallcaps mr-1 text-accent">{tt("FIND IT", "FINDEN")}</span>· {path}
      </p>
      {analyse && (
        <p className="text-caption italic text-ash">{tt("Analyse in the app. Write your result in the answer area below.", "In der App analysieren. Ergebnis im Antwortbereich darunter eintragen.")}</p>
      )}
    </div>
  );
}

/** One answer block: heading + pill, FIND IT line, then a separate blank answer area directly beneath. */
export function AnswerBlock({
  id,
  title,
  kind,
  findIt,
  children,
  analyse = true,
  tier,
}: {
  id?: string;
  title: string;
  kind: BlockKind;
  findIt: string;
  analyse?: boolean;
  children: ReactNode;
  tier?: Tier;
}) {
  const optional = tier?.level === "optional";
  const opened = useOptionalOpen((s) => (id ? !!s.open[id] : true));
  const show = useOptionalOpen((s) => s.show);
  const hide = useOptionalOpen((s) => s.hide);

  // An Optional block starts as one quiet line, so the eye stays on the Core blocks. One click opens it; nothing is locked.
  if (optional && !opened && id) {
    return (
      <div id={id} className="px-1">
        <button
          type="button"
          onClick={() => show(id)}
          aria-expanded={false}
          className="text-left text-micro normal-case tracking-normal text-ash/60 underline decoration-dotted underline-offset-2 hover:text-ash focus-visible:text-ash"
        >
          {tt(
            `Optional, about ${tier!.minutes} min · ${title} · click to show`,
            `Optional, ca. ${tier!.minutes} Min. · ${title} · zum Anzeigen klicken`,
          )}
        </button>
      </div>
    );
  }

  return (
    <section id={id} className="card space-y-3 p-4 md:p-5">
      <header className="flex flex-wrap items-center gap-2">
        <h3>{title}</h3>
        <Pill kind={kind} />
        {tier && <TierPill tier={tier} />}
        {optional && id && (
          <button
            type="button"
            onClick={() => hide(id)}
            className="ml-auto text-micro normal-case tracking-normal text-ash/70 underline decoration-dotted underline-offset-2 hover:text-ash"
          >
            {tt("Hide", "Ausblenden")}
          </button>
        )}
      </header>
      <FindIt path={findIt} analyse={analyse} />
      <div className="space-y-4 border-t border-line pt-3">{children}</div>
    </section>
  );
}
