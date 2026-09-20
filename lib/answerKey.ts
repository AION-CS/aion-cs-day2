import { STEPS, WEAKEST, fmtPct, fmtPp, STEP_BY_ID } from "@/data/funnel";
import { PHASE_LABEL } from "@/data/funnel";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { LOCAL_BEST, LOCAL_BEST_TOTAL, NET, OPTIONS, OPT_IDS, SEGMENTS, UNIFORM, UNIFORM_BEST, cellKey, fmtEuro, fmtEuroPlain } from "@/data/segments";
import type { SegId } from "@/data/segments";

/**
 * Mentor-only answer keys for the exercises where the learner picks from fixed options. Each key gives the
 * expected answer and a reason per option — including why each rejected option is rejected — plus a teaching
 * note wherever more than one answer defends. Never exported and never shown to a learner.
 */
export type AnswerKeyOption = { label: string; expected: boolean; why: string };
export type AnswerKeyBlock = { title: string; expected: string; options: AnswerKeyOption[]; teachingNote?: string };

export function sortKey(): AnswerKeyBlock {
  return {
    title: "Block 1.1 · MECE sort",
    expected: TOUCHPOINTS.map((t) => `${t.label} → ${PHASE_LABEL[t.truth]}`).join(" · "),
    options: TOUCHPOINTS.flatMap((t) => [
      { label: `${t.label} → ${PHASE_LABEL[t.truth]}`, expected: true, why: t.why },
      ...(Object.entries(t.rejected) as [keyof typeof PHASE_LABEL, string][]).map(([ph, why]) => ({
        label: `${t.label} → ${PHASE_LABEL[ph]}`,
        expected: false,
        why,
      })),
    ]),
    teachingNote:
      "“Consultation booked” is the boundary case. The convention taught in A2 is that sales starts at a scheduled conversation with a named buyer contact; a learner who files it under pre-sales and defends it by the buyer not yet having met anyone is reasoning, not guessing, but the note keeps the convention. After-sales stays empty: the funnel ends at the signature, so the retention half of the story is the repeat-purchase line beneath it.",
  };
}

export function weakestKey(): AnswerKeyBlock {
  const w = STEP_BY_ID[WEAKEST];
  return {
    title: "Block 1.3 · Largest negative gap",
    expected: `${w.label} (${fmtPct(w.actual)} against ${fmtPct(w.bench)}, ${fmtPp(w.gap)})`,
    options: STEPS.map((s) => ({
      label: s.label,
      expected: s.id === WEAKEST,
      why:
        s.id === WEAKEST
          ? `Actual ${fmtPct(s.actual)} against a benchmark of ${fmtPct(s.bench)}: a gap of ${fmtPp(s.gap)}, the most negative of the five.`
          : `Gap ${fmtPp(s.gap)}. ${
              s.id === "leads"
                ? "This step loses the most people (24,000 → 480), but it sits exactly on its 2.0% benchmark; counts fall at every stage by design."
                : s.id === "signed"
                  ? "The second-largest gap, and the one closest to revenue, but not the largest."
                  : "Below its benchmark, but by a smaller margin than the step named as the answer."
            }`,
    })),
    teachingNote:
      "The trap is reading the funnel by counts. Visitors → Leads loses the most people and is on benchmark; Contract signed is closest to revenue and second-worst. Only the gap against the benchmark, in percentage points, ranks the steps.",
  };
}

export function recommendationKey(seg: SegId): AnswerKeyBlock {
  const best = LOCAL_BEST[seg];
  return {
    title: `Block 2.3 · Recommendation for ${SEGMENTS[seg].name}`,
    expected: `Option ${best} (${fmtEuro(NET[cellKey(best, seg)])})`,
    options: OPT_IDS.map((o) => {
      const net = NET[cellKey(o, seg)];
      return {
        label: OPTIONS[o].name,
        expected: o === best,
        why:
          o === best
            ? `Highest net impact in the segment at ${fmtEuro(net)}.`
            : net < 0
              ? `Shows a net loss of ${fmtEuro(net)}: its cost is larger than the extra gross profit it brings.`
              : `Positive at ${fmtEuro(net)} but ${fmtEuroPlain(NET[cellKey(best, seg)] - net)} below the best option in this segment.`,
      };
    }),
    teachingNote:
      seg === "P"
        ? "B wins the project segment on the numbers, and it is the answer the grid supports. It is also the most assumption-dependent: it rests on the +8 pp uplift, and the material (B4) says a discount is weak against relationship-driven churn. A learner who picks C (+€3,416) and says why, citing the figure and the risk to the uplift, defends a real position. Do not accept either choice without a cited figure."
        : "A wins the retainer segment. B is the trap: the discount is paid on all 4 existing repeat orders as well as the 0.72 extra ones it creates, and its +3 pp uplift cannot cover that, so it loses €8,832. C is a defensible second (+€15,072) if the learner argues against the fixed cost of account management; the grid does not support B.",
  };
}

export function uniformKey(): AnswerKeyBlock {
  return {
    title: "Block 2.4 · One option across both segments",
    expected: `Option ${UNIFORM_BEST} (${fmtEuro(UNIFORM[UNIFORM_BEST])} in total)`,
    options: OPT_IDS.map((o) => ({
      label: OPTIONS[o].name,
      expected: o === UNIFORM_BEST,
      why:
        o === UNIFORM_BEST
          ? `Largest total across both segments: ${fmtEuro(NET[cellKey(o, "P")])} + ${fmtEuro(NET[cellKey(o, "R")])} = ${fmtEuro(UNIFORM[o])}.`
          : `${fmtEuro(NET[cellKey(o, "P")])} + ${fmtEuro(NET[cellKey(o, "R")])} = ${fmtEuro(UNIFORM[o])}, ${fmtEuroPlain(UNIFORM[UNIFORM_BEST] - UNIFORM[o])} below the best single option. ${
              o === "B" ? "The gain in project clients is cancelled by the loss in retainer clients." : "Its loss in project clients outweighs the retainer gain."
            }`,
    })),
    teachingNote: `The trap is picking each segment's local winner (B for project, A for retainer). That is not one strategy: it is two, and it totals ${fmtEuroPlain(LOCAL_BEST_TOTAL)}. Running C everywhere totals ${fmtEuroPlain(UNIFORM[UNIFORM_BEST])}, so the price of one strategy is ${fmtEuroPlain(LOCAL_BEST_TOTAL - UNIFORM[UNIFORM_BEST])}: ${fmtEuroPlain(NET[cellKey("B", "P")] - NET[cellKey("C", "P")])} left in project clients and ${fmtEuroPlain(NET[cellKey("A", "R")] - NET[cellKey("C", "R")])} in retainer clients. Check that the learner names both amounts, not only the letter.`,
  };
}
