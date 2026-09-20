"use client";

import { useId } from "react";
import { BUDGET, ITEMS } from "@/data/program";
import { fmtEuroPlain } from "@/data/segments";
import { fundedItems, itemCost, overBy, totalSpent } from "@/lib/program";
import type { Route3State } from "@/store/useStore";

const W = 560;
const X0 = 8;
const X1 = 552;
const H = 108;

/**
 * The budget bar of the allocation grid: one segment per funded line item, drawn to scale against the
 * €150,000 budget line. An amount beyond the budget is drawn as an amber hatch, so the over-cap part is read
 * by pattern and label, not by colour. Each item has its own pattern and its number inside the segment.
 */
export function BudgetBar({ alloc }: { alloc: Route3State["alloc"] }) {
  const uid = useId().replace(/:/g, "");
  const total = totalSpent(alloc);
  const over = overBy(alloc);
  const max = Math.max(BUDGET, total) * 1.04;
  const x = (v: number) => X0 + (v / max) * (X1 - X0);
  const funded = fundedItems(alloc);
  let acc = 0;
  const segs = funded.map((id) => {
    const c = itemCost(alloc, id);
    const s = { id, from: acc, to: acc + c };
    acc += c;
    return s;
  });
  const fills: Record<string, string> = {
    lever: "#2F5D62",
    fix: "#8B9098",
    dash: `url(#${uid}-dots)`,
    train: `url(#${uid}-stripe)`,
  };
  const dark = (id: string) => id === "lever";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
      <title id={`${uid}-t`}>{`Budget allocation against the 150,000 euro budget`}</title>
      <desc id={`${uid}-d`}>
        {`${funded.length} of 4 line items funded, ${fmtEuroPlain(total)} spent of ${fmtEuroPlain(BUDGET)}${over > 0 ? `, ${fmtEuroPlain(over)} over budget` : ""}.`}
      </desc>
      <defs>
        <pattern id={`${uid}-dots`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#DFEEEB" />
          <circle cx="4" cy="4" r="1.8" fill="#0F6B6B" />
        </pattern>
        <pattern id={`${uid}-stripe`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
          <rect width="8" height="8" fill="#ECE6D6" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#59606A" strokeWidth="2.4" />
        </pattern>
        <pattern id={`${uid}-over`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="7" height="7" fill="#FBF0D6" />
          <line x1="0" y1="0" x2="0" y2="7" stroke="#8A5A0B" strokeWidth="2.8" />
        </pattern>
      </defs>
      <rect x={X0} y="30" width={X1 - X0} height="34" rx="3" fill="#ECE6D6" stroke="#D8D1BF" />
      {segs.map((s) => {
        const w = x(s.to) - x(s.from);
        return (
          <g key={s.id}>
            <rect x={x(s.from)} y="30" width={Math.max(w, 0.5)} height="34" fill={fills[s.id]} stroke="#1F2328" strokeWidth="1" className="anim-grow-x" />
            {w > 22 && (
              <text x={x(s.from) + w / 2} y="52" textAnchor="middle" fontSize="15" fontWeight="700" fill={dark(s.id) ? "#FFFEFA" : "#1F2328"} stroke={dark(s.id) ? "none" : "#FFFEFA"} strokeWidth="3" paintOrder="stroke">
                {ITEMS[s.id].n}
              </text>
            )}
          </g>
        );
      })}
      {over > 0 && <rect x={x(BUDGET)} y="30" width={x(total) - x(BUDGET)} height="34" fill={`url(#${uid}-over)`} stroke="#8A5A0B" strokeWidth="1.6" />}
      <line x1={x(BUDGET)} x2={x(BUDGET)} y1="18" y2="76" stroke="#1F2328" strokeWidth="2.2" />
      <text x={x(BUDGET)} y="13" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1F2328">
        Budget {fmtEuroPlain(BUDGET)}
      </text>
      {[0, 50000, 100000].map((v) => (
        <text key={v} x={x(v) + (v === 0 ? 2 : 0)} y="92" textAnchor={v === 0 ? "start" : "middle"} fontSize="12" fill="#59606A">
          {fmtEuroPlain(v)}
        </text>
      ))}
      <text x={x(BUDGET)} y="92" textAnchor="middle" fontSize="12" fill="#59606A">
        {fmtEuroPlain(BUDGET)}
      </text>
      {over > 0 && (
        <text x={Math.min(x(total), X1)} y="104" textAnchor="end" fontSize="13" fontWeight="700" fill="#8A5A0B">
          {`${fmtEuroPlain(over)} over`}
        </text>
      )}
    </svg>
  );
}
