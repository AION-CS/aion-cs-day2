"use client";

import { AnswerBlock } from "@/components/ui/AnswerBlock";
import type { Tier } from "@/components/ui/AnswerBlock";
import { FunnelInstrument } from "@/components/ui/FunnelInstrument";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { SortBoard } from "@/components/task1/SortBoard";
import { FillTable } from "@/components/task1/FillTable";
import { CostSentence, WeakestPick } from "@/components/task1/WeakestBlock";

type T1 = "1.1" | "1.2" | "1.3" | "1.4";

/** The read-only funnel every Stage 1 block reads from. */
export function Task1Instrument() {
  return (
    <section id="funnel-instrument" className="card space-y-3 p-4 md:p-5" aria-labelledby="funnel-h">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="funnel-h">DigitalIT Solutions · annual funnel</h3>
        <span className="text-caption text-ash">Read-only · every figure printed here is used below</span>
      </div>
      <FunnelInstrument />
    </section>
  );
}

/** Stage 1 · Diagnose: the four answer blocks of Task 1. Block 1.1 to 1.4 keep their numbers wherever they are placed. */
export function Task1Blocks({ tiers, where = "Route 1 → Stage 1" }: { tiers?: Partial<Record<T1, Tier>>; where?: string }) {
  return (
    <>
      <AnswerBlock
        id="block-1-1"
        title="Block 1.1 · Sort the six touchpoints into journey phases"
        kind="OBJECTIVE"
        tier={tiers?.["1.1"]}
        findIt={`${where} → “DigitalIT Solutions · annual funnel”. The six stages, top to bottom, are the six touchpoints. Answer in the phase board below.`}
      >
        <MaterialRefs refs={["A2"]} />
        <SortBoard />
      </AnswerBlock>

      <AnswerBlock
        id="block-1-2"
        title="Block 1.2 · Write down what the funnel prints"
        kind="OBJECTIVE"
        tier={tiers?.["1.2"]}
        findIt={`${where} → “DigitalIT Solutions · annual funnel”. Beside each arrow: the conversion (large), “ref” (the benchmark) and the gap bar with its pp value. The repeat-purchase rate is the bar beneath the funnel. Answer in the table below.`}
      >
        <MaterialRefs refs={["A2"]} />
        <FillTable />
      </AnswerBlock>

      <AnswerBlock
        id="block-1-3"
        title="Block 1.3 · Name the stage with the largest negative gap"
        kind="OBJECTIVE"
        tier={tiers?.["1.3"]}
        findIt={`${where} → “DigitalIT Solutions · annual funnel” → the gap bars beside the arrows. Answer below.`}
      >
        <MaterialRefs refs={["A2"]} />
        <WeakestPick />
      </AnswerBlock>

      <AnswerBlock
        id="block-1-4"
        title="Block 1.4 · What does the leak cost?"
        kind="JUDGED"
        tier={tiers?.["1.4"]}
        findIt={`${where} → “DigitalIT Solutions · annual funnel” → the two counts either side of the arrow you named in Block 1.3, and the counts further down the funnel.`}
      >
        <MaterialRefs refs={["A2"]} />
        <CostSentence />
      </AnswerBlock>
    </>
  );
}
