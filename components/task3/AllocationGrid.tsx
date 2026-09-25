"use client";

import clsx from "clsx";
import { BUDGET, FIXED_COST, ITEMS, OPT_NAME, SCOPES, SHOW_UP } from "@/data/program";
import { OPT_IDS, fmtEuro, fmtEuroPlain } from "@/data/segments";
import type { OptId } from "@/data/segments";
import { IDS, l3Unlocked } from "@/lib/missing";
import { leverCost, leverNet, overBudgetLines, overBy, remaining, totalSpent } from "@/lib/program";
import { useJumpTo } from "@/lib/useJumpTo";
import { usePersisted } from "@/store/usePersisted";
import { useHydrated, useStore } from "@/store/useStore";
import { BudgetBar } from "@/components/ui/BudgetBar";
import { Insight } from "@/components/materi/kit";
import { tt } from "@/lib/lang";
import { useCapstone } from "@/lib/materiAlias";

export const LOCK_TIP_3 = () =>
  tt(
    "Unlocks once you've named the weakest funnel stage (Block 1.3) and chosen one option for both segments (Block 2.4)",
    "Wird freigeschaltet, sobald Sie die schwächste Trichterstufe benannt (Block 1.3) und eine Option für beide Segmente gewählt haben (Block 2.4)",
  );

/** Hook shared by the grid and the sequence block: is the grid open, and where does a click on it go while it is not. */
export function useL3Lock() {
  const p = usePersisted();
  const hydrated = useHydrated();
  const jump = useJumpTo();
  const capstone = useCapstone();
  const locked = capstone ? false : hydrated ? !l3Unlocked(p) : true;
  const go = () => {
    if (!p.l1.weakest) jump(IDS.weakest, "/route-1/");
    else jump(IDS.uniform, "/route-2/");
  };
  return { locked, go };
}

/**
 * Block 3.1 — the constraint check. Four line items with their costs and effects printed and fixed. Every
 * control is a discrete stop (fund or not; for the lever, an option and a scope), never a free drag, so the
 * result stays gradable. A live running total and the budget bar show spent against remaining. While the grid
 * is locked every control stays visible and clicking one takes you to the field that unlocks it.
 */
export function AllocationGrid() {
  const a = useStore((s) => s.route3.alloc);
  const setAlloc = useStore((s) => s.setAlloc);
  const chosen = useStore((s) => s.l2.uniform);
  const { locked, go } = useL3Lock();

  const spent = totalSpent(a);
  const over = overBy(a);
  const lines = overBudgetLines(a);
  const guard = (fn: () => void) => () => (locked ? go() : fn());

  return (
    <div id={IDS.allocGrid} className="space-y-4" title={locked ? LOCK_TIP_3() : undefined}>
      {locked && (
        <div role="note" className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-ash bg-mist/60 p-3 text-caption text-ink">
          <span className="rounded border border-ash px-1.5 py-0.5 text-micro font-bold uppercase text-ash">{tt("Locked", "Gesperrt")}</span>
          <span className="min-w-0 flex-1">
            {LOCK_TIP_3()}.{" "}
            {tt(
              "Every control below still shows its cost; selecting one takes you to the field that opens it. Nothing else on this page is blocked.",
              "Jedes Bedienelement unten zeigt weiterhin seine Kosten; ein Klick darauf führt Sie zu dem Feld, das es öffnet. Nichts anderes auf dieser Seite ist gesperrt.",
            )}
          </span>
          <button type="button" onClick={go} className="btn-ghost btn-sm">
            {tt("Take me there", "Dorthin springen")}
          </button>
        </div>
      )}

      <div id={IDS.allocTotal} className="space-y-2 rounded-lg border border-line bg-paper p-3">
        <div className="grid gap-2 text-center sm:grid-cols-3">
          <Figure label={tt("Budget, four months", "Budget, vier Monate")} value={fmtEuroPlain(BUDGET)} />
          <Figure label={tt("Allocated", "Zugeteilt")} value={fmtEuroPlain(spent)} />
          <Figure label={over > 0 ? tt("Over budget", "Über dem Budget") : tt("Remaining", "Verbleibend")} value={fmtEuroPlain(over > 0 ? over : remaining(a))} warn={over > 0} />
        </div>
        <BudgetBar alloc={a} />
        <Insight>{reading(a, spent, over)}</Insight>
        {lines.length > 0 && (
          <div role="alert" className="space-y-1 rounded-md border border-gold bg-accentSoft p-3 text-caption text-ink">
            <p className="font-semibold">{lines[0]}</p>
            {lines.slice(1).map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        )}
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-micro normal-case tracking-normal text-ash" aria-label={tt("Legend", "Legende")}>
          <li>{tt("1 solid · 2 grey · 3 dots · 4 stripes", "1 voll · 2 grau · 3 Punkte · 4 Streifen")}</li>
          <li>{tt("Amber hatch = the part above the budget line", "Bernsteinfarbene Schraffur = der Teil über der Budgetlinie")}</li>
        </ul>
      </div>

      {/* Item 1 · the lever */}
      <fieldset id={IDS.leverPick} className="space-y-3 rounded-lg border border-line bg-paper p-3">
        <legend className="px-1 text-caption font-semibold">
          {ITEMS.lever.n} · {ITEMS.lever.name}
        </legend>
        <p className="text-caption text-ash">{ITEMS.lever.what}</p>
        <div role="radiogroup" aria-label={tt("Lever option", "Option des Hebels")} className="grid gap-2 md:grid-cols-4">
          <Stop label={tt("Not funded", "Nicht finanziert")} sub={fmtEuroPlain(0)} on={a.leverOpt === null} locked={locked} onClick={guard(() => setAlloc({ leverOpt: null }))} />
          {OPT_IDS.map((o: OptId) => (
            <Stop
              key={o}
              label={OPT_NAME[o]}
              sub={tt(
                `${o === "B" ? "€0 upfront · paid from margin" : fmtEuroPlain(leverCost(o, a.leverScope))} · nets ${fmtEuro(leverNet(o, a.leverScope))} a year`,
                `${o === "B" ? `${fmtEuroPlain(0)} vorab · aus der Marge bezahlt` : fmtEuroPlain(leverCost(o, a.leverScope))} · netto ${fmtEuro(leverNet(o, a.leverScope))} im Jahr`,
              )}
              tag={chosen === o ? tt("Your Route 2 choice", "Ihre Wahl aus Route 2") : undefined}
              on={a.leverOpt === o}
              locked={locked}
              onClick={guard(() => setAlloc({ leverOpt: o }))}
            />
          ))}
        </div>
        <div>
          <p className="text-caption font-semibold">{tt("Scope", "Umfang")}</p>
          <div role="radiogroup" aria-label={tt("Lever scope", "Umfang des Hebels")} className="mt-1 flex flex-wrap gap-2">
            {SCOPES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={a.leverScope === s.id}
                aria-disabled={locked}
                onClick={guard(() => setAlloc({ leverScope: s.id }))}
                className={clsx(
                  "btn btn-sm min-h-[40px] border",
                  locked ? "border-dashed border-ash/60 bg-mist/60 text-ash" : a.leverScope === s.id ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-micro normal-case tracking-normal text-ash">
            {tt(
              "The costs and the net impact follow your net-impact figures (Block 2.1) for the segments in scope. The cost of Options A and C is a cost per client (38 clients: 14 project, 24 retainer).",
              "Die Kosten und der Nettoeffekt folgen Ihren Zahlen aus der Berechnung (Block 2.1) für die Segmente im Umfang. Die Kosten der Optionen A und C sind Kosten pro Kunde (38 Kunden: 14 Projekt, 24 Retainer).",
            )}
          </p>
        </div>
      </fieldset>

      {(["fix", "dash", "train"] as const).map((id) => {
        const on = a[id];
        return (
          <fieldset key={id} className="space-y-2 rounded-lg border border-line bg-paper p-3">
            <legend className="px-1 text-caption font-semibold">
              {ITEMS[id].n} · {ITEMS[id].name}
            </legend>
            <p className="text-caption text-ash">{ITEMS[id].what}</p>
            <p className="text-caption text-ink">
              <span className="font-semibold">{tt("Effect. ", "Wirkung. ")}</span>
              {ITEMS[id].effect}
              {id === "fix" &&
                tt(
                  ` (${SHOW_UP.before}% → ${SHOW_UP.after}%, against the ${SHOW_UP.benchmark}% benchmark.)`,
                  ` (${SHOW_UP.before} % → ${SHOW_UP.after} %, gegenüber dem Benchmark von ${SHOW_UP.benchmark} %.)`,
                )}
            </p>
            <button
              type="button"
              aria-pressed={on}
              aria-disabled={locked}
              onClick={guard(() => setAlloc({ [id]: !a[id] }))}
              className={clsx(
                "btn btn-sm min-h-[40px] border",
                locked ? "border-dashed border-ash/60 bg-mist/60 text-ash" : on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
              )}
            >
              {on ? tt("◐ Funded in full", "◐ Voll finanziert") : tt("○ Not funded", "○ Nicht finanziert")} · {fmtEuroPlain(FIXED_COST[id])}
            </button>
          </fieldset>
        );
      })}
    </div>
  );
}

function Figure({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={clsx("rounded-md border px-3 py-2", warn ? "border-gold bg-accentSoft" : "border-line bg-canvas/50")}>
      <p className="smallcaps">{label}</p>
      <p className={clsx("tnum text-h3", warn && "text-accent")}>{value}</p>
    </div>
  );
}

function Stop({ label, sub, tag, on, locked, onClick }: { label: string; sub: string; tag?: string; on: boolean; locked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      aria-disabled={locked}
      onClick={onClick}
      className={clsx(
        "rounded-lg border px-3 py-2 text-left transition-colors",
        locked ? "border-dashed border-ash/60 bg-mist/60 text-ash" : on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
      )}
    >
      <span className="block text-caption font-semibold leading-tight">{label}</span>
      <span className="mt-0.5 block text-micro normal-case tracking-normal">{sub}</span>
      {tag && <span className="mt-1 inline-block rounded border border-accent/50 bg-accentSoft px-1.5 py-0.5 text-micro font-bold uppercase text-accent">{tag}</span>}
    </button>
  );
}

/** What the current allocation demonstrates: which costs move with the choice, and what the total leaves open. */
function reading(a: ReturnType<typeof useStore.getState>["route3"]["alloc"], spent: number, over: number): string {
  if (spent === 0 && a.leverOpt === null) {
    return tt(
      "Nothing is funded yet. The three fixed prices never change; only the lever moves, because Options A and C are priced per client (so their cost follows the scope you pick) and the discount costs nothing upfront but is paid from margin on every repeat order, outside this budget.",
      "Noch ist nichts finanziert. Die drei festen Preise ändern sich nie; nur der Hebel bewegt sich, denn die Optionen A und C werden pro Kunde bepreist (ihre Kosten folgen also dem gewählten Umfang), und der Rabatt kostet vorab nichts, wird aber bei jedem Folgeauftrag aus der Marge bezahlt, außerhalb dieses Budgets.",
    );
  }
  if (over > 0) {
    return tt(
      `${fmtEuroPlain(over)} over the budget. The funnel fix, the dashboard and the training have fixed prices, so only two moves change the total: leave an item out, or narrow the lever\u2019s scope. The message above names the moves that close the gap.`,
      `${fmtEuroPlain(over)} über dem Budget. Die Trichter-Behebung, das Dashboard und die Schulung haben feste Preise, es gibt also nur zwei Wege, die Summe zu ändern: einen Posten weglassen oder den Umfang des Hebels eingrenzen. Die Meldung oben nennt die Wege, die die Lücke schließen.`,
    );
  }
  const rest = remaining(a);
  const open = [
    !a.fix && tt("the funnel leak", "das Trichter-Leck"),
    !a.dash && tt("the KPI measurement", "die KPI-Messung"),
    !a.train && tt("the selling behaviour", "das Verkaufsverhalten"),
    a.leverOpt === null && tt("repeat purchase", "der Wiederkauf"),
  ].filter(Boolean);
  return tt(
    `${fmtEuroPlain(spent)} of ${fmtEuroPlain(BUDGET)} is allocated and ${fmtEuroPlain(rest)} is left.${
      a.leverOpt === "B" ? " The lever costs nothing upfront, so it fits, but the discount is paid from margin on every repeat order and that cost is outside this budget." : ""
    }${open.length ? ` What you leave unfunded stays open (${open.join(", ")}): Block 3.3 and Block 3.5 ask you to say what that costs and when you come back to it.` : " Everything is funded, so Block 3.3 asks what you did not buy and what that leaves exposed."}`,
    `${fmtEuroPlain(spent)} von ${fmtEuroPlain(BUDGET)} sind zugeteilt, ${fmtEuroPlain(rest)} bleiben übrig.${
      a.leverOpt === "B" ? " Der Hebel kostet vorab nichts und passt daher hinein, aber der Rabatt wird bei jedem Folgeauftrag aus der Marge bezahlt, und diese Kosten liegen außerhalb dieses Budgets." : ""
    }${open.length ? ` Was Sie nicht finanzieren, bleibt offen (${open.join(", ")}): Block 3.3 und Block 3.5 verlangen, dass Sie sagen, was das kostet und wann Sie darauf zurückkommen.` : " Alles ist finanziert, Block 3.3 fragt daher, was Sie nicht gekauft haben und was dadurch ungeschützt bleibt."}`,
  );
}
