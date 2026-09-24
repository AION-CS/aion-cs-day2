import type { ReactNode } from "react";

export type BlockKind = "OBJECTIVE" | "JUDGED" | "OBJECTIVE + JUDGED" | "EXPLORATORY";

/**
 * Where a block sits in the Friday Case File (CLAUDE.md #29): Core blocks are required for a complete file, Optional
 * blocks are for whoever has time and are never listed as missing. Minutes are a guide, not a timer.
 */
export type Tier = { level: "core" | "optional"; minutes: number };

export function TierPill({ tier }: { tier: Tier }) {
  return tier.level === "core" ? (
    <span className="pill border-signal/40 bg-signalSoft text-signal" title="Needed for a complete Case File.">
      CORE · about {tier.minutes} min
    </span>
  ) : (
    <span className="pill border-dashed border-ash/60 bg-mist text-ash" title="For whoever has time. Never listed as missing.">
      OPTIONAL · about {tier.minutes} min
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
  return (
    <span className={cls} title={kind === "OBJECTIVE" ? "One answer the file or the tables settle." : kind === "EXPLORATORY" ? "Not graded and not exported." : "Your judgement, defended in your own words."}>
      {kind}
    </span>
  );
}

/** The FIND IT line: exact route + widget name as printed on screen + the exact click. */
export function FindIt({ path, analyse = true }: { path: string; analyse?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-caption text-ash">
        <span className="smallcaps mr-1 text-accent">FIND IT</span>· {path}
      </p>
      {analyse && (
        <p className="text-caption italic text-ash">Analyse in the app. Write your result in the answer area below.</p>
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
  return (
    <section id={id} className="card space-y-3 p-4 md:p-5">
      <header className="flex flex-wrap items-center gap-2">
        <h3>{title}</h3>
        <Pill kind={kind} />
        {tier && <TierPill tier={tier} />}
      </header>
      <FindIt path={findIt} analyse={analyse} />
      <div className="space-y-4 border-t border-line pt-3">{children}</div>
    </section>
  );
}
