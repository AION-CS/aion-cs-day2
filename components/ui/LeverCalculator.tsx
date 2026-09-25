"use client";

import { useId } from "react";
import clsx from "clsx";
import { CONTRACT, OPTIONS, OPT_IDS, SEGMENTS, SEG_IDS, T2_IDS, calc, fmtEuro, fmtEuroPlain } from "@/data/segments";
import { Insight } from "@/components/materi/kit";
import type { OptId, SegId } from "@/data/segments";
import { useJumpTo } from "@/lib/useJumpTo";
import { IDS } from "@/lib/missing";
import { useHydrated, useStore } from "@/store/useStore";
import { num, tt } from "@/lib/lang";
import { useCapstone } from "@/lib/materiAlias";

const LOCK_TIP = () => tt("Unlocks once you've named the weakest funnel stage (Block 1.3)", "Wird freigeschaltet, sobald Sie die schwächste Trichterstufe benannt haben (Block 1.3)");
const n2 = (x: number) => num(x, { maximumFractionDigits: 2 });

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
  const capstone = useCapstone();
  const locked = capstone ? false : hydrated ? !unlocked : true;

  const result = sel.opt && sel.seg && !locked ? calc(sel.opt, sel.seg) : null;
  const max = result ? Math.max(result.extraGp, result.cost, 1) : 1;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="smallcaps mb-1">{tt("Given · client base", "Gegeben · Kundenbasis")}</p>
          <table className="w-full border-collapse text-caption">
            <caption className="sr-only">{tt("Segments, clients and baseline repeat orders", "Segmente, Kunden und Folgeaufträge im Ausgangsjahr")}</caption>
            <thead>
              <tr className="bg-mist text-left">
                <th scope="col" className="px-3 py-2 text-micro font-semibold uppercase text-ash">{tt("Segment", "Segment")}</th>
                <th scope="col" className="px-3 py-2 text-right text-micro font-semibold uppercase text-ash">{tt("Clients", "Kunden")}</th>
                <th scope="col" className="px-3 py-2 text-right text-micro font-semibold uppercase text-ash">{tt("Baseline repeat orders, last 12 months", "Folgeaufträge im Ausgangsjahr, letzte 12 Monate")}</th>
              </tr>
            </thead>
            <tbody>
              {SEG_IDS.map((s) => (
                <tr key={s} id={T2_IDS.seg(s)} className="border-t border-line">
                  <td className="px-3 py-2 font-semibold">{SEGMENTS[s].name}</td>
                  <td className="tnum px-3 py-2 text-right">{SEGMENTS[s].clients}</td>
                  <td className="tnum px-3 py-2 text-right">{SEGMENTS[s].baseline}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p id={T2_IDS.contract} className="mt-2 text-caption text-ash">
            {tt("Contract price", "Vertragspreis")} <strong className="text-ink">{fmtEuroPlain(CONTRACT.price)}</strong> · {tt("gross margin", "Bruttomarge")}{" "}
            <strong className="text-ink">{tt(`${CONTRACT.margin * 100}%`, `${CONTRACT.margin * 100} %`)}</strong> · {tt("gross profit per order", "Rohertrag pro Auftrag")}{" "}
            <strong className="text-ink">{fmtEuroPlain(CONTRACT.gp)}</strong>
          </p>
        </div>
        <div>
          <p className="smallcaps mb-1">{tt("Given · the three options", "Gegeben · die drei Optionen")}</p>
          <table className="w-full border-collapse text-caption">
            <caption className="sr-only">{tt("Option cost and repeat-rate uplift by segment", "Kosten der Option und Steigerung der Wiederkaufsrate je Segment")}</caption>
            <thead>
              <tr className="bg-mist text-left">
                <th scope="col" className="px-3 py-2 text-micro font-semibold uppercase text-ash">{tt("Option", "Option")}</th>
                <th scope="col" className="px-3 py-2 text-right text-micro font-semibold uppercase text-ash">{tt("Cost / client / yr", "Kosten / Kunde / Jahr")}</th>
                <th scope="col" className="px-3 py-2 text-right text-micro font-semibold uppercase text-ash">{tt("Uplift P", "Steigerung P")}</th>
                <th scope="col" className="px-3 py-2 text-right text-micro font-semibold uppercase text-ash">{tt("Uplift R", "Steigerung R")}</th>
              </tr>
            </thead>
            <tbody>
              {OPT_IDS.map((o) => (
                <tr key={o} id={T2_IDS.opt(o)} className="border-t border-line align-top">
                  <td className="px-3 py-2 font-semibold">{OPTIONS[o].name}</td>
                  <td className="tnum px-3 py-2 text-right">{OPTIONS[o].costPerClient === null ? "—" : fmtEuroPlain(OPTIONS[o].costPerClient!)}</td>
                  <td className="tnum px-3 py-2 text-right">+{OPTIONS[o].uplift.P} {tt("pp", "PP")}</td>
                  <td className="tnum px-3 py-2 text-right">+{OPTIONS[o].uplift.R} {tt("pp", "PP")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-caption text-ash">
            {tt(
              "The uplift is in percentage points of the segment's repeat rate (repeat orders ÷ clients). The discount has no per-client cost: it is a price cut on the repeat order.",
              "Die Steigerung ist in Prozentpunkten der Wiederkaufsrate des Segments angegeben (Folgeaufträge ÷ Kunden). Der Rabatt hat keine Kosten pro Kunde: Er ist ein Preisnachlass auf den Folgeauftrag.",
            )}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-paper p-3 md:p-4">
        <p className="smallcaps">{tt("Calculator · pick one option and one segment", "Rechner · wählen Sie eine Option und ein Segment")}</p>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <div>
            <p id={`${uid}-o`} className="text-caption font-semibold">{tt("Option", "Option")}</p>
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
          <div id="seg-select" title={locked ? LOCK_TIP() : undefined}>
            <p id={`${uid}-s`} className="flex flex-wrap items-center gap-2 text-caption font-semibold">
              {tt("Segment", "Segment")}
              {locked && <span className="rounded border border-ash px-1.5 py-0.5 text-micro font-bold uppercase text-ash">{tt("Locked", "Gesperrt")}</span>}
            </p>
            <div role="radiogroup" aria-labelledby={`${uid}-s`} className="mt-1 flex flex-wrap gap-2">
              {SEG_IDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={sel.seg === s}
                  aria-disabled={locked}
                  title={locked ? LOCK_TIP() : undefined}
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
                {LOCK_TIP()}. {tt("Select a segment to be taken to that field; the rest of this page stays open.", "Wählen Sie ein Segment, um zu diesem Feld zu springen; der Rest der Seite bleibt offen.")}
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
                <Row
                  label={tt("Clients × uplift = extra repeat orders", "Kunden × Steigerung = zusätzliche Folgeaufträge")}
                  value={tt(
                    `${result.clients} × ${result.upliftPp}% = ${result.extraOrders} orders`,
                    `${result.clients} × ${n2(result.upliftPp)} % = ${n2(result.extraOrders)} Aufträge`,
                  )}
                />
                <Row
                  label={tt("Extra orders × gross profit per order = extra gross profit", "Zusätzliche Aufträge × Rohertrag pro Auftrag = zusätzlicher Rohertrag")}
                  value={`${n2(result.extraOrders)} × ${fmtEuroPlain(result.gpPerOrder)} = ${fmtEuroPlain(result.extraGp)}`}
                />
                <Row label={tt("Cost of the option", "Kosten der Option")} value={`${result.costBasis} = ${fmtEuroPlain(result.cost)}`} />
                <div className={clsx("flex flex-wrap items-baseline justify-between gap-2 border-t-2 border-ink pt-2", result.net < 0 && "text-rust")}>
                  <dt className="font-semibold">{tt("Net impact = extra gross profit − cost", "Nettoeffekt = zusätzlicher Rohertrag − Kosten")}</dt>
                  <dd className="tnum text-h3">
                    {fmtEuro(result.net)}
                    {result.net < 0 && <span className="ml-2 rounded border border-rust px-1.5 py-0.5 text-micro font-bold uppercase">{tt("Net loss", "Nettoverlust")}</span>}
                  </dd>
                </div>
                </dl>
              </div>
              <svg viewBox="0 0 240 100" className="mx-auto h-auto w-full max-w-[240px]" role="img" aria-labelledby={`${uid}-bt ${uid}-bd`}>
                <title id={`${uid}-bt`}>{tt("Extra gross profit against cost", "Zusätzlicher Rohertrag gegenüber Kosten")}</title>
                <desc id={`${uid}-bd`}>
                  {tt(
                    `Extra gross profit ${fmtEuroPlain(result.extraGp)}, cost ${fmtEuroPlain(result.cost)}, net impact ${fmtEuro(result.net)}.`,
                    `Zusätzlicher Rohertrag ${fmtEuroPlain(result.extraGp)}, Kosten ${fmtEuroPlain(result.cost)}, Nettoeffekt ${fmtEuro(result.net)}.`,
                  )}
                </desc>
                <defs>
                  <pattern id={`${uid}-h`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="7" height="7" fill="#ECE6D6" />
                    <line x1="0" y1="0" x2="0" y2="7" stroke="#59606A" strokeWidth="2.4" />
                  </pattern>
                </defs>
                <text x="0" y="14" fontSize="12" fill="#59606A">{tt("Extra gross profit", "Zusätzlicher Rohertrag")}</text>
                <rect x="0" y="20" width={Math.max((result.extraGp / max) * 236, 2)} height="18" rx="2" fill="#2F5D62" className="anim-grow-x" key={`g-${sel.opt}${sel.seg}`} />
                <text x="0" y="62" fontSize="12" fill="#59606A">{tt("Cost", "Kosten")}</text>
                <rect x="0" y="68" width={Math.max((result.cost / max) * 236, 2)} height="18" rx="2" fill={`url(#${uid}-h)`} stroke="#59606A" strokeWidth="1.2" className="anim-grow-x" key={`c-${sel.opt}${sel.seg}`} />
              </svg>
            </div>
          ) : (
            <p className="text-caption text-ash">{locked
                ? tt("Pick an option; the segment selector unlocks once you have named the weakest funnel stage.", "Wählen Sie eine Option; die Segmentauswahl wird freigeschaltet, sobald Sie die schwächste Trichterstufe benannt haben.")
                : tt("Pick an option and a segment to see the working.", "Wählen Sie eine Option und ein Segment, um die Rechnung zu sehen.")}</p>
          )}
        </div>
        <Insight className="mt-3">{reading(result, sel.opt, sel.seg)}</Insight>
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

/** What the working demonstrates, computed from the selected combination: the reading of the last line, not a restatement of it. */
function reading(r: ReturnType<typeof calc> | null, opt: OptId | null, seg: SegId | null): string {
  if (!r || !opt || !seg) {
    return tt(
      "Fixed-cost options are paid for every client whether or not it re-orders; the discount is paid on every repeat order. Pick an option and a segment and the working shows which of the two outgrows the extra gross profit.",
      "Optionen mit festen Kosten werden für jeden Kunden bezahlt, ob er erneut bestellt oder nicht; der Rabatt wird bei jedem Folgeauftrag bezahlt. Wählen Sie eine Option und ein Segment, und die Rechnung zeigt, welche von beiden den zusätzlichen Rohertrag übersteigt.",
    );
  }
  const discount = OPTIONS[opt].discount !== null;
  if (discount) {
    const orders = r.baseline + r.extraOrders;
    const ord = n2(orders);
    const ex = n2(r.extraOrders);
    return r.net < 0
      ? tt(
          `The discount is paid on all ${Math.round(orders * 100) / 100} repeat orders in this segment: the ${r.baseline} that already exist as well as the ${r.extraOrders} new ones. That costs ${fmtEuroPlain(r.cost)}, more than the ${fmtEuroPlain(r.extraGp)} the new orders bring, so the option loses ${fmtEuroPlain(Math.abs(r.net))} a year here.`,
          `Der Rabatt wird bei allen ${ord} Folgeaufträgen in diesem Segment bezahlt: den ${r.baseline}, die schon bestehen, und den ${ex} neuen. Das kostet ${fmtEuroPlain(r.cost)}, mehr als die ${fmtEuroPlain(r.extraGp)}, die die neuen Aufträge bringen, die Option verliert hier also ${fmtEuroPlain(Math.abs(r.net))} im Jahr.`,
        )
      : tt(
          `The discount is paid on all ${Math.round(orders * 100) / 100} repeat orders in this segment, the ${r.baseline} that already exist and the ${r.extraOrders} new ones, costing ${fmtEuroPlain(r.cost)}. The new orders bring ${fmtEuroPlain(r.extraGp)}, which still covers it, so ${fmtEuroPlain(r.net)} is left. Few existing orders to discount is what makes it pay.`,
          `Der Rabatt wird bei allen ${ord} Folgeaufträgen in diesem Segment bezahlt, den ${r.baseline}, die schon bestehen, und den ${ex} neuen, und kostet ${fmtEuroPlain(r.cost)}. Die neuen Aufträge bringen ${fmtEuroPlain(r.extraGp)}, das deckt es noch, es bleiben also ${fmtEuroPlain(r.net)}. Dass es nur wenige bestehende Aufträge zu rabattieren gibt, macht es rentabel.`,
        );
  }
  return r.net < 0
    ? tt(
        `The cost of ${fmtEuroPlain(r.cost)} is paid for all ${r.clients} clients however many re-order, and it is larger than the ${fmtEuroPlain(r.extraGp)} the extra orders bring: the option loses ${fmtEuroPlain(Math.abs(r.net))} a year here.`,
        `Die Kosten von ${fmtEuroPlain(r.cost)} werden für alle ${r.clients} Kunden bezahlt, egal wie viele erneut bestellen, und sie sind größer als die ${fmtEuroPlain(r.extraGp)}, die die zusätzlichen Aufträge bringen: Die Option verliert hier ${fmtEuroPlain(Math.abs(r.net))} im Jahr.`,
      )
    : tt(
        `The cost of ${fmtEuroPlain(r.cost)} is paid for all ${r.clients} clients however many re-order. The ${r.extraOrders} extra orders bring ${fmtEuroPlain(r.extraGp)}, which covers it, so ${fmtEuroPlain(r.net)} is left.`,
        `Die Kosten von ${fmtEuroPlain(r.cost)} werden für alle ${r.clients} Kunden bezahlt, egal wie viele erneut bestellen. Die ${n2(r.extraOrders)} zusätzlichen Aufträge bringen ${fmtEuroPlain(r.extraGp)}, das deckt sie, es bleiben also ${fmtEuroPlain(r.net)}.`,
      );
}
