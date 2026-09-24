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

export const LOCK_TIP_3 = "Unlocks once you've diagnosed the leak and chosen a lever in Routes 1 and 2";

/** Hook shared by the grid and the sequence block: is the grid open, and where does a click on it go while it is not. */
export function useL3Lock() {
  const p = usePersisted();
  const hydrated = useHydrated();
  const jump = useJumpTo();
  const locked = hydrated ? !l3Unlocked(p) : true;
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
    <div id={IDS.allocGrid} className="space-y-4" title={locked ? LOCK_TIP_3 : undefined}>
      {locked && (
        <div role="note" className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-ash bg-mist/60 p-3 text-caption text-ink">
          <span className="rounded border border-ash px-1.5 py-0.5 text-micro font-bold uppercase text-ash">Locked</span>
          <span className="min-w-0 flex-1">
            {LOCK_TIP_3}. Every control below still shows its cost; selecting one takes you to the field that opens it. Nothing else on this page is blocked.
          </span>
          <button type="button" onClick={go} className="btn-ghost btn-sm">
            Take me there
          </button>
        </div>
      )}

      <div id={IDS.allocTotal} className="space-y-2 rounded-lg border border-line bg-paper p-3">
        <div className="grid gap-2 text-center sm:grid-cols-3">
          <Figure label="Budget, four months" value={fmtEuroPlain(BUDGET)} />
          <Figure label="Allocated" value={fmtEuroPlain(spent)} />
          <Figure label={over > 0 ? "Over budget" : "Remaining"} value={fmtEuroPlain(over > 0 ? over : remaining(a))} warn={over > 0} />
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
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-micro normal-case tracking-normal text-ash" aria-label="Legend">
          <li>1 solid · 2 grey · 3 dots · 4 stripes</li>
          <li>Amber hatch = the part above the budget line</li>
        </ul>
      </div>

      {/* Item 1 · the lever */}
      <fieldset id={IDS.leverPick} className="space-y-3 rounded-lg border border-line bg-paper p-3">
        <legend className="px-1 text-caption font-semibold">
          {ITEMS.lever.n} · {ITEMS.lever.name}
        </legend>
        <p className="text-caption text-ash">{ITEMS.lever.what}</p>
        <div role="radiogroup" aria-label="Lever option" className="grid gap-2 md:grid-cols-4">
          <Stop label="Not funded" sub="€0" on={a.leverOpt === null} locked={locked} onClick={guard(() => setAlloc({ leverOpt: null }))} />
          {OPT_IDS.map((o: OptId) => (
            <Stop
              key={o}
              label={OPT_NAME[o]}
              sub={`${o === "B" ? "€0 upfront · paid from margin" : fmtEuroPlain(leverCost(o, a.leverScope))} · nets ${fmtEuro(leverNet(o, a.leverScope))} a year`}
              tag={chosen === o ? "Your Route 2 choice" : undefined}
              on={a.leverOpt === o}
              locked={locked}
              onClick={guard(() => setAlloc({ leverOpt: o }))}
            />
          ))}
        </div>
        <div>
          <p className="text-caption font-semibold">Scope</p>
          <div role="radiogroup" aria-label="Lever scope" className="mt-1 flex flex-wrap gap-2">
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
            The costs and the net impact follow your Route 2 figures for the segments in scope. The cost of Options A and C is a cost per client (38 clients: 14 project, 24 retainer).
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
              <span className="font-semibold">Effect. </span>
              {ITEMS[id].effect}
              {id === "fix" && ` (${SHOW_UP.before}% → ${SHOW_UP.after}%, against the ${SHOW_UP.benchmark}% benchmark.)`}
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
              {on ? "◐ Funded in full" : "○ Not funded"} · {fmtEuroPlain(FIXED_COST[id])}
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
    return "Nothing is funded yet. The three fixed prices never change; only the lever moves, because Options A and C are priced per client (so their cost follows the scope you pick) and the discount costs nothing upfront but is paid from margin on every repeat order, outside this budget.";
  }
  if (over > 0) {
    return `${fmtEuroPlain(over)} over the budget. The funnel fix, the dashboard and the training have fixed prices, so only two moves change the total: leave an item out, or narrow the lever\u2019s scope. The message above names the moves that close the gap.`;
  }
  const rest = remaining(a);
  const open = [!a.fix && "the funnel leak", !a.dash && "the KPI measurement", !a.train && "the selling behaviour", a.leverOpt === null && "repeat purchase"].filter(Boolean);
  return `${fmtEuroPlain(spent)} of ${fmtEuroPlain(BUDGET)} is allocated and ${fmtEuroPlain(rest)} is left.${
    a.leverOpt === "B" ? " The lever costs nothing upfront, so it fits, but the discount is paid from margin on every repeat order and that cost is outside this budget." : ""
  }${open.length ? ` What you leave unfunded stays open (${open.join(", ")}): Block 3.3 and Block 3.5 ask you to say what that costs and when you come back to it.` : " Everything is funded, so Block 3.3 asks what you did not buy and what that leaves exposed."}`;
}
