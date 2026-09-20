"use client";

import { useId } from "react";
import clsx from "clsx";
import { CONTRACT, OPTIONS, OPT_IDS, SEGMENTS, SEG_IDS, calc, fmtEuro, fmtEuroPlain } from "@/data/segments";
import type { OptId, SegId } from "@/data/segments";
import { useJumpTo } from "@/lib/useJumpTo";
import { IDS } from "@/lib/missing";
import { useHydrated, useStore } from "@/store/useStore";

const LOCK_TIP = "Unlocks once you've named the weakest funnel stage in Task 1";

/**
 * The Task 2 instrument: the given data (read-only) and a live calculator for one Option × Segment at a time.
 * It shows the working line by line, so a negative net impact is visibly a cost that outgrew the extra gross
 * profit. It does not fill the grid for the learner: the grid is answered by selecting each combination.
 *
 * The segment selector is a soft lock: it stays visible and disabled (aria-disabled, a tooltip, a LOCKED tag)
 * until Task 1 has named the weakest funnel stage, and clicking it takes you to that field. It is never dead.
 */
export function LeverCalculator() {
  const uid = useId().replace(/:/g, "");
  const hydrated = useHydrated();
  const sel = useStore((s) => s.l2.calcSel);
  const select = useStore((s) => s.selectCalc);
  const unlocked = useStore((s) => s.l1.weakest !== null);
  const jump = useJumpTo();
  const locked = hydrated ? !unlocked : true;

  const result = sel.opt && sel.seg && !locked ? calc(sel.opt, sel.seg) : null;
  const max = result ? Math.max(result.extraGp, result.cost, 1) : 1;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="smallcaps mb-1">Given · client base</p>
          <table className="w-full border-collapse text-caption">
            <caption className="sr-only">Segments, clients and baseline repeat orders</caption>
            <thead>
              <tr className="bg-mist text-left">
                <th scope="col" className="px-3 py-2 text-micro font-semibold uppercase text-ash">Segment</th>
                <th scope="col" className="px-3 py-2 text-right text-micro font-semibold uppercase text-ash">Clients</th>
                <th scope="col" className="px-3 py-2 text-right text-micro font-semibold uppercase text-ash">Baseline repeat orders, last 12 months</th>
              </tr>
            </thead>
            <tbody>
              {SEG_IDS.map((s) => (
                <tr key={s} className="border-t border-line">
                  <td className="px-3 py-2 font-semibold">{SEGMENTS[s].name}</td>
                  <td className="tnum px-3 py-2 text-right">{SEGMENTS[s].clients}</td>
                  <td className="tnum px-3 py-2 text-right">{SEGMENTS[s].baseline}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-caption text-ash">
            Contract price <strong className="text-ink">{fmtEuroPlain(CONTRACT.price)}</strong> · gross margin <strong className="text-ink">{CONTRACT.margin * 100}%</strong> · gross profit per
            order <strong className="text-ink">{fmtEuroPlain(CONTRACT.gp)}</strong>
          </p>
        </div>
        <div>
          <p className="smallcaps mb-1">Given · the three options</p>
          <table className="w-full border-collapse text-caption">
            <caption className="sr-only">Option cost and repeat-rate uplift by segment</caption>
            <thead>
              <tr className="bg-mist text-left">
                <th scope="col" className="px-3 py-2 text-micro font-semibold uppercase text-ash">Option</th>
                <th scope="col" className="px-3 py-2 text-right text-micro font-semibold uppercase text-ash">Cost / client / yr</th>
                <th scope="col" className="px-3 py-2 text-right text-micro font-semibold uppercase text-ash">Uplift P</th>
                <th scope="col" className="px-3 py-2 text-right text-micro font-semibold uppercase text-ash">Uplift R</th>
              </tr>
            </thead>
            <tbody>
              {OPT_IDS.map((o) => (
                <tr key={o} className="border-t border-line align-top">
                  <td className="px-3 py-2 font-semibold">{OPTIONS[o].name}</td>
                  <td className="tnum px-3 py-2 text-right">{OPTIONS[o].costPerClient === null ? "—" : fmtEuroPlain(OPTIONS[o].costPerClient!)}</td>
                  <td className="tnum px-3 py-2 text-right">+{OPTIONS[o].uplift.P} pp</td>
                  <td className="tnum px-3 py-2 text-right">+{OPTIONS[o].uplift.R} pp</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-caption text-ash">The uplift is in percentage points of the segment&apos;s repeat rate (repeat orders ÷ clients). The discount has no per-client cost: it is a price cut on the repeat order.</p>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-paper p-3 md:p-4">
        <p className="smallcaps">Calculator · pick one option and one segment</p>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <div>
            <p id={`${uid}-o`} className="text-caption font-semibold">Option</p>
            <div role="radiogroup" aria-labelledby={`${uid}-o`} className="mt-1 flex flex-wrap gap-2">
              {OPT_IDS.map((o) => (
                <button
                  key={o}
                  type="button"
                  role="radio"
                  aria-checked={sel.opt === o}
                  onClick={() => select({ opt: o as OptId })}
                  className={clsx("btn btn-sm min-h-[40px] border", sel.opt === o ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}
                >
                  {OPTIONS[o].name.split(" · ")[0]} · {OPTIONS[o].short}
                </button>
              ))}
            </div>
          </div>
          <div id="seg-select" title={locked ? LOCK_TIP : undefined}>
            <p id={`${uid}-s`} className="flex flex-wrap items-center gap-2 text-caption font-semibold">
              Segment
              {locked && <span className="rounded border border-ash px-1.5 py-0.5 text-micro font-bold uppercase text-ash">Locked</span>}
            </p>
            <div role="radiogroup" aria-labelledby={`${uid}-s`} className="mt-1 flex flex-wrap gap-2">
              {SEG_IDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={sel.seg === s}
                  aria-disabled={locked}
                  title={locked ? LOCK_TIP : undefined}
                  onClick={() => (locked ? jump(IDS.weakest, "/route-1/") : select({ seg: s as SegId }))}
                  className={clsx(
                    "btn btn-sm min-h-[40px] border",
                    locked ? "cursor-pointer border-dashed border-ash/60 bg-mist/60 text-ash" : sel.seg === s ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
                  )}
                >
                  {SEGMENTS[s].name}
                </button>
              ))}
            </div>
            {locked && (
              <p className="mt-1 text-micro normal-case tracking-normal text-ash">
                {LOCK_TIP}. Select a segment to be taken to that field in Route 1; the rest of this page stays open.
              </p>
            )}
          </div>
        </div>

        <div aria-live="polite" className="mt-4">
          {result && sel.opt && sel.seg ? (
            <div className="fade-in grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] md:items-center">
              <div className="space-y-1.5 text-caption">
                <p className="smallcaps">{OPTIONS[sel.opt].name} · {SEGMENTS[sel.seg].name}</p>
                <dl className="space-y-1.5">
                <Row label="Clients × uplift = extra repeat orders" value={`${result.clients} × ${result.upliftPp}% = ${result.extraOrders} orders`} />
                <Row label="Extra orders × gross profit per order = extra gross profit" value={`${result.extraOrders} × ${fmtEuroPlain(result.gpPerOrder)} = ${fmtEuroPlain(result.extraGp)}`} />
                <Row label="Cost of the option" value={`${result.costBasis} = ${fmtEuroPlain(result.cost)}`} />
                <div className={clsx("flex flex-wrap items-baseline justify-between gap-2 border-t-2 border-ink pt-2", result.net < 0 && "text-rust")}>
                  <dt className="font-semibold">Net impact = extra gross profit − cost</dt>
                  <dd className="tnum text-h3">
                    {fmtEuro(result.net)}
                    {result.net < 0 && <span className="ml-2 rounded border border-rust px-1.5 py-0.5 text-micro font-bold uppercase">Net loss</span>}
                  </dd>
                </div>
                </dl>
              </div>
              <svg viewBox="0 0 240 100" className="mx-auto h-auto w-full max-w-[240px]" role="img" aria-labelledby={`${uid}-bt ${uid}-bd`}>
                <title id={`${uid}-bt`}>{`Extra gross profit against cost`}</title>
                <desc id={`${uid}-bd`}>{`Extra gross profit ${fmtEuroPlain(result.extraGp)}, cost ${fmtEuroPlain(result.cost)}, net impact ${fmtEuro(result.net)}.`}</desc>
                <defs>
                  <pattern id={`${uid}-h`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="7" height="7" fill="#ECE6D6" />
                    <line x1="0" y1="0" x2="0" y2="7" stroke="#59606A" strokeWidth="2.4" />
                  </pattern>
                </defs>
                <text x="0" y="14" fontSize="12" fill="#59606A">Extra gross profit</text>
                <rect x="0" y="20" width={Math.max((result.extraGp / max) * 236, 2)} height="18" rx="2" fill="#2F5D62" className="anim-grow-x" key={`g-${sel.opt}${sel.seg}`} />
                <text x="0" y="62" fontSize="12" fill="#59606A">Cost</text>
                <rect x="0" y="68" width={Math.max((result.cost / max) * 236, 2)} height="18" rx="2" fill={`url(#${uid}-h)`} stroke="#59606A" strokeWidth="1.2" className="anim-grow-x" key={`c-${sel.opt}${sel.seg}`} />
              </svg>
            </div>
          ) : (
            <p className="text-caption text-ash">{locked ? "Pick an option; the segment selector unlocks after Task 1." : "Pick an option and a segment to see the working."}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-line pb-1">
      <dt className="text-ash">{label}</dt>
      <dd className="tnum font-semibold text-ink">{value}</dd>
    </div>
  );
}
