"use client";

import { useId, useState } from "react";
import { FUNNEL, STEPS, REPEAT, WEAKEST, fmtInt, fmtPct, fmtPp } from "@/data/funnel";
import type { StepId } from "@/data/funnel";
import { Insight } from "@/components/materi/kit";
import { wrap } from "@/lib/svg";
import { useInView } from "@/lib/useInView";
import { tt } from "@/lib/lang";

const W = 520;
const BAR_H = 40;
const GAP_H = 58;
const TOP = 8;
const CX = 235;
const MAX_W = 150;
const MIN_W = 22;
const COL_X = 332;
const GAP_SCALE = 120 / 35; // svg units per percentage point

const barW = (count: number) => MIN_W + ((MAX_W - MIN_W) * Math.log10(count / 4)) / Math.log10(24000 / 4);
const yOf = (i: number) => TOP + i * (BAR_H + GAP_H);
const H = yOf(FUNNEL.length - 1) + BAR_H + 10;

/**
 * The graded instrument of Task 1: DigitalIT Solutions' annual funnel, six stages, with the stage-to-stage
 * conversion, its benchmark reference and the gap in percentage points printed at every arrow, and the
 * repeat-purchase rate beneath it. Every printed value is read by the task, so nothing here is decoration.
 *
 * The step with the most negative gap is drawn in rust with a hatch, computed from the data. Nothing on the
 * diagram names it as a problem: that is the learner's finding.
 */
export function FunnelInstrument() {
  const uid = useId().replace(/:/g, "");
  const [ref, seen] = useInView<HTMLDivElement>();
  const [sel, setSel] = useState<StepId | null>(null);
  const step = sel ? STEPS.find((s) => s.id === sel)! : null;

  return (
    <div ref={ref} className="space-y-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="group" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("DigitalIT Solutions annual funnel", "Jahrestrichter von DigitalIT Solutions")}</title>
        <desc id={`${uid}-d`}>
          {tt(
            "Six stages from 24,000 website visitors to 4 signed contracts. At each of the five arrows the conversion rate, its benchmark reference and the gap in percentage points are printed. Select an arrow to read its counts.",
            "Sechs Stufen von 24.000 Website-Besuchern bis zu 4 unterzeichneten Verträgen. An jedem der fünf Pfeile stehen die Konversionsrate, ihr Benchmark und die Abweichung in Prozentpunkten. Wählen Sie einen Pfeil, um seine Zahlen zu lesen.",
          )}
        </desc>
        <defs>
          <pattern id={`${uid}-hg`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill="#ECE6D6" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="#59606A" strokeWidth="2.4" />
          </pattern>
          <pattern id={`${uid}-hr`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill="#F6E3DB" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="#A4472A" strokeWidth="2.8" />
          </pattern>
        </defs>

        {FUNNEL.map((s, i) => {
          const w = barW(s.count);
          const y = yOf(i);
          const lines = wrap(s.label, 16);
          const next = FUNNEL[i + 1];
          return (
            <g key={s.id} id={`funnel-stage-${s.id}`}>
              <rect className="flash-rect" x={0} y={y - 6} width={W} height={BAR_H + 12} rx="6" fill="transparent" stroke="transparent" pointerEvents="none" />
              {lines.map((l, k) => (
                <text key={k} x={146} y={y + BAR_H / 2 + 5 + (k - (lines.length - 1) / 2) * 15} textAnchor="end" fontSize="14" fill="#1F2328">
                  {l}
                </text>
              ))}
              <rect x={CX - w / 2} y={y} width={w} height={BAR_H} rx="3" fill="#2F5D62" className={seen ? "anim-grow-x" : undefined} style={{ animationDelay: `${i * 70}ms` }} />
              <text x={CX} y={y + BAR_H / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#FFFEFA">
                {fmtInt(s.count)}
              </text>
              {next && <Connector w={w} next={barW(next.count)} y={y + BAR_H} h={GAP_H} weakest={STEPS[i].id === WEAKEST} uid={uid} />}
            </g>
          );
        })}

        {STEPS.map((s, i) => {
          const y = yOf(i) + BAR_H;
          const weakest = s.id === WEAKEST;
          const on = sel === s.id;
          const w = Math.abs(s.gap) * GAP_SCALE;
          const pick = () => setSel(on ? null : s.id);
          return (
            <g
              key={s.id}
              className="hit"
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={tt(
                `${s.label}: ${fmtPct(s.actual)}, benchmark reference ${fmtPct(s.bench)}, gap ${fmtPp(s.gap)}`,
                `${s.label}: ${fmtPct(s.actual)}, Benchmark ${fmtPct(s.bench)}, Abweichung ${fmtPp(s.gap)}`,
              )}
              onClick={pick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick();
                }
              }}
            >
              <rect x={COL_X - 6} y={y + 2} width={W - COL_X + 6} height={GAP_H - 4} rx="6" fill={on ? "#FBF0D6" : "transparent"} stroke={on ? "#8A5A0B" : "transparent"} strokeWidth="1.6" className="hit-shape" />
              <text x={COL_X} y={y + 22} fontSize="17" fontWeight="700" fill="#1F2328">
                {fmtPct(s.actual)}
                <tspan fontSize="14" fontWeight="400" fill="#59606A" dx="8">
                  {`ref ${fmtPct(s.bench)}`}
                </tspan>
              </text>
              <rect
                x={COL_X}
                y={y + 32}
                width={Math.max(w, 1.5)}
                height="13"
                rx="2"
                fill={weakest ? `url(#${uid}-hr)` : `url(#${uid}-hg)`}
                stroke={weakest ? "#A4472A" : "#59606A"}
                strokeWidth="1.2"
                className={seen ? "anim-grow-x" : undefined}
                style={{ animationDelay: `${i * 90 + 200}ms` }}
              />
              <text x={COL_X + Math.max(w, 1.5) + 6} y={y + 44} fontSize="14" fontWeight={weakest ? 700 : 400} fill={weakest ? "#A4472A" : "#1F2328"}>
                {fmtPp(s.gap)}
              </text>
            </g>
          );
        })}
      </svg>

      <div aria-live="polite" className="min-h-[3rem] rounded-lg border border-line bg-paper p-3 text-caption">
        {step ? (
          <p>
            <span className="font-semibold">{step.label}:</span> {fmtInt(step.toCount)} {tt("of", "von")} {fmtInt(step.fromCount)} = {fmtPct(step.actual)}. {tt("Benchmark reference", "Benchmark")} {fmtPct(step.bench)};{" "}
            {tt("gap", "Abweichung")} <span className="font-semibold">{fmtPp(step.gap)}</span>.
          </p>
        ) : (
          <p className="text-ash">{tt("Select an arrow (or tab to it and press Enter) to read its two counts.", "Wählen Sie einen Pfeil (oder springen Sie mit Tab hin und drücken Sie Enter), um seine beiden Zahlen zu lesen.")}</p>
        )}
      </div>

      <Insight>
        {step
          ? step.gap < 0
            ? tt(
                `At its own reference of ${fmtPct(step.bench)} this arrow would carry about ${fmtInt(Math.round((step.fromCount * step.bench) / 100))} of the ${fmtInt(step.fromCount)}; it carries ${fmtInt(step.toCount)}. Each arrow is measured against its own reference, which is why gaps can be compared across arrows while raw counts cannot: counts fall at every stage by design.`,
                `Bei seinem eigenen Benchmark von ${fmtPct(step.bench)} würde dieser Pfeil etwa ${fmtInt(Math.round((step.fromCount * step.bench) / 100))} der ${fmtInt(step.fromCount)} tragen; er trägt ${fmtInt(step.toCount)}. Jeder Pfeil wird an seinem eigenen Benchmark gemessen, deshalb lassen sich Abweichungen über Pfeile hinweg vergleichen, Rohzahlen aber nicht: Die Zahlen fallen von Stufe zu Stufe von selbst.`,
              )
            : tt(
                `This arrow keeps up with its own reference of ${fmtPct(step.bench)}: it carries ${fmtInt(step.toCount)} of ${fmtInt(step.fromCount)}, about what the reference would carry. A big fall in counts is normal in a funnel and is not, on its own, a gap.`,
                `Dieser Pfeil hält mit seinem eigenen Benchmark von ${fmtPct(step.bench)} Schritt: Er trägt ${fmtInt(step.toCount)} von ${fmtInt(step.fromCount)}, etwa das, was der Benchmark tragen würde. Ein starker Rückgang der Zahlen ist in einem Trichter normal und für sich allein keine Abweichung.`,
              )
          : tt(
              `Each arrow’s gap is measured against that arrow’s own reference, so arrows can be compared even though the counts differ enormously (24,000 at the top, 4 at the bottom). Select an arrow to see what its gap means in prospects.`,
              `Die Abweichung jedes Pfeils wird an dessen eigenem Benchmark gemessen, sodass sich Pfeile vergleichen lassen, obwohl die Zahlen enorm verschieden sind (24.000 oben, 4 unten). Wählen Sie einen Pfeil, um zu sehen, was seine Abweichung in Interessenten bedeutet.`,
            )}
      </Insight>

      <RepeatPanel seen={seen} uid={uid} />

      <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-caption text-ash" aria-label={tt("Legend", "Legende")}>
        <li className="flex items-center gap-2">
          <svg viewBox="0 0 24 14" className="h-3.5 w-6" aria-hidden>
            <rect width="24" height="14" rx="2" fill="#2F5D62" />
          </svg>
          {tt("Count at the stage", "Zahl der Stufe")}
        </li>
        <li className="flex items-center gap-2">
          <svg viewBox="0 0 24 14" className="h-3.5 w-6" aria-hidden>
            <rect width="24" height="14" rx="2" fill={`url(#${uid}-hg)`} stroke="#59606A" />
          </svg>
          {tt("Gap to the benchmark reference (length = size of the gap)", "Abweichung vom Benchmark (Länge = Größe der Abweichung)")}
        </li>
        <li className="flex items-center gap-2">
          <svg viewBox="0 0 24 14" className="h-3.5 w-6" aria-hidden>
            <rect width="24" height="14" rx="2" fill={`url(#${uid}-hr)`} stroke="#A4472A" />
          </svg>
          {tt("The largest gap on the diagram", "Die größte Abweichung im Diagramm")}
        </li>
      </ul>
      <p className="text-micro normal-case tracking-normal text-ash">
        {tt(
          "Bar widths use a log scale, so 24,000 and 4 fit on one screen. “ref” is the industry reference (Case assumption). pp = percentage points.",
          "Die Balkenbreiten nutzen eine logarithmische Skala, damit 24.000 und 4 auf einen Bildschirm passen. „ref“ ist die Branchenreferenz (Fallannahme). PP = Prozentpunkte.",
        )}
      </p>
    </div>
  );
}

function Connector({ w, next, y, h, weakest, uid }: { w: number; next: number; y: number; h: number; weakest: boolean; uid: string }) {
  const pts = `${CX - w / 2},${y} ${CX + w / 2},${y} ${CX + next / 2},${y + h} ${CX - next / 2},${y + h}`;
  return (
    <polygon
      points={pts}
      fill={weakest ? `url(#${uid}-hr)` : "#8B9098"}
      fillOpacity={weakest ? 1 : 0.28}
      stroke={weakest ? "#A4472A" : "none"}
      strokeWidth="1.4"
    />
  );
}

function RepeatPanel({ seen, uid }: { seen: boolean; uid: string }) {
  const X0 = 20;
  const TW = 480;
  const xa = X0 + (REPEAT.actual / 100) * TW;
  const xb = X0 + (REPEAT.bench / 100) * TW;
  return (
    <div className="rounded-lg border border-line bg-paper p-3">
      <p className="smallcaps">{tt("Beneath the funnel · retention", "Unter dem Trichter · Kundenbindung")}</p>
      <svg viewBox="0 0 520 96" className="mx-auto mt-1 h-auto w-full max-w-[560px]" role="img" aria-labelledby={`${uid}-rt ${uid}-rd`}>
        <title id={`${uid}-rt`}>{tt("Repeat-purchase rate", "Wiederkaufsrate")}</title>
        <desc id={`${uid}-rd`}>
          {tt(
            "Existing clients re-ordering within 18 months: 13.2 percent against an industry reference of 35 percent, a gap of minus 21.8 percentage points.",
            "Bestandskunden, die innerhalb von 18 Monaten erneut bestellen: 13,2 Prozent gegenüber einer Branchenreferenz von 35 Prozent, eine Abweichung von minus 21,8 Prozentpunkten.",
          )}
        </desc>
        <text x={X0} y="18" fontSize="13" fill="#1F2328">
          {tt("Repeat-purchase rate: existing clients re-ordering within 18 months", "Wiederkaufsrate: Bestandskunden mit Folgeauftrag in 18 Monaten")}
        </text>
        <rect x={X0} y="30" width={TW} height="26" rx="3" fill="#ECE6D6" stroke="#D8D1BF" />
        <rect x={xa} y="30" width={xb - xa} height="26" fill={`url(#${uid}-hg)`} stroke="#59606A" strokeWidth="1.2" />
        <rect x={X0} y="30" width={xa - X0} height="26" rx="3" fill="#2F5D62" className={seen ? "anim-grow-x" : undefined} />
        <line x1={xb} x2={xb} y1="24" y2="62" stroke="#1F2328" strokeWidth="2" />
        <text x={X0 + 4} y="48" fontSize="14" fontWeight="700" fill="#FFFEFA">
          {fmtPct(REPEAT.actual)}
        </text>
        <text x={xb + 6} y="78" fontSize="12.5" fill="#59606A">
          {`ref ${fmtPct(REPEAT.bench)}`}
        </text>
        <text x={xa + 8} y="78" fontSize="13" fill="#1F2328">
          {fmtPp(REPEAT.gap)}
        </text>
        <text x={X0} y="90" fontSize="11" fill="#59606A">
          {tt("0%", "0 %")}
        </text>
        <text x={X0 + TW} y="90" textAnchor="end" fontSize="11" fill="#59606A">
          {tt("100%", "100 %")}
        </text>
      </svg>
    </div>
  );
}
