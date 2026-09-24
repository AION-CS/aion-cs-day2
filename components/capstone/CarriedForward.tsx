"use client";

import { STEP_BY_ID } from "@/data/funnel";
import { OPT_NAME } from "@/data/program";
import { IDS } from "@/lib/missing";
import { useJumpTo } from "@/lib/useJumpTo";
import { useHydrated, useStore } from "@/store/useStore";

/**
 * The handover between stages (CLAUDE.md #29): what the learner produced in the earlier stage, quoted back in one
 * small panel, never a second case brief. When the earlier stage is empty it says so plainly and offers the
 * reference position, a clearly labelled stand-in filled only where the learner has not answered, so a later stage
 * can be worked on its own. Nothing here gates anything.
 */
export function CarriedForward({ stage }: { stage: 2 | 3 }) {
  const hydrated = useHydrated();
  const l1 = useStore((s) => s.l1);
  const l2 = useStore((s) => s.l2);
  const apply = useStore((s) => s.applyReference);
  const jump = useJumpTo();
  if (!hydrated) return <div id={`carried-${stage}`} className="min-h-[4rem]" />;

  const sentence = l1.sentence.trim();
  const missing1 = !l1.weakest || !sentence;
  const missing2 = !l2.uniform || !l2.tradeoff.trim();
  const needsRef = stage === 2 ? missing1 : missing1 || missing2;
  const usedRef = l1.refPosition || (stage === 3 && l2.refPosition);

  return (
    <aside id={`carried-${stage}`} className="space-y-2 rounded-lg border border-line bg-mist/60 p-3 text-caption">
      <div className="flex flex-wrap items-center gap-2">
        <p className="smallcaps">Carried forward · from {stage === 2 ? "Stage 1" : "Stages 1 and 2"}</p>
        {usedRef && <span className="pill border-dashed border-ash bg-paper text-ash">Reference position, not your answer</span>}
      </div>
      <div className="space-y-1 text-ink">
        <p>
          <span className="font-semibold">Stage 1 · the leak.</span>{" "}
          {l1.weakest ? (
            <>
              Largest negative gap: <strong>{STEP_BY_ID[l1.weakest].label}</strong>.
            </>
          ) : (
            <span className="text-ash">You have not named the stage yet (Block 1.3).</span>
          )}
        </p>
        {sentence && <blockquote className="border-l-4 border-gold bg-accentSoft px-3 py-1.5">{sentence}</blockquote>}
        {!sentence && <p className="text-ash">You have not written the cost sentence yet (Block 1.4).</p>}
        {stage === 3 && (
          <>
            <p>
              <span className="font-semibold">Stage 2 · the option for both segments.</span>{" "}
              {l2.uniform ? (
                <strong>{OPT_NAME[l2.uniform]}</strong>
              ) : (
                <span className="text-ash">You have not chosen one option for both segments yet (Block 2.4).</span>
              )}
            </p>
            {l2.tradeoff.trim() && <blockquote className="border-l-4 border-gold bg-accentSoft px-3 py-1.5">{l2.tradeoff.trim()}</blockquote>}
          </>
        )}
      </div>
      {needsRef && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-2">
          <p className="min-w-0 flex-1 text-ash">
            {stage === 2 ? "Stage 1 is not finished, so there is nothing to build on yet." : "Stage 1 or Stage 2 is not finished, so the memo has nothing to quote yet."} Nothing here is blocked: finish it, or start from the reference position and
            change any of it.
          </p>
          <button type="button" onClick={() => apply(stage)} className="btn-ghost btn-sm">
            Use the reference position
          </button>
          <button type="button" onClick={() => jump(l1.weakest ? (stage === 3 && !l2.uniform ? IDS.uniform : IDS.sentence) : IDS.weakest, "/route-1/")} className="btn-ghost btn-sm">
            Go to the block
          </button>
        </div>
      )}
    </aside>
  );
}
