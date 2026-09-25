"use client";

import { AnswerBlock } from "@/components/ui/AnswerBlock";
import type { Tier } from "@/components/ui/AnswerBlock";
import { FunnelInstrument } from "@/components/ui/FunnelInstrument";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { SortBoard } from "@/components/task1/SortBoard";
import { FillTable } from "@/components/task1/FillTable";
import { CostSentence, WeakestPick } from "@/components/task1/WeakestBlock";
import { tt } from "@/lib/lang";

type T1 = "1.1" | "1.2" | "1.3" | "1.4";

/** The read-only funnel every Part 1 block reads from. */
export function Task1Instrument() {
  return (
    <section id="funnel-instrument" className="card space-y-3 p-4 md:p-5" aria-labelledby="funnel-h">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="funnel-h">{tt("DigitalIT Solutions · annual funnel", "DigitalIT Solutions · Jahrestrichter")}</h3>
        <span className="text-caption text-ash">{tt("Read-only · every figure printed here is used below", "Nur lesbar · jede hier gedruckte Zahl wird unten verwendet")}</span>
      </div>
      <FunnelInstrument />
    </section>
  );
}

/** Part 1 · Diagnose: the four answer blocks of Task 1. Block 1.1 to 1.4 keep their numbers wherever they are placed. */
export function Task1Blocks({ tiers, where = "Route 1 → Case File" }: { tiers?: Partial<Record<T1, Tier>>; where?: string }) {
  return (
    <>
      <AnswerBlock
        id="block-1-1"
        title={tt("Block 1.1 · Sort the six touchpoints into journey phases", "Block 1.1 · Ordnen Sie die sechs Kontaktpunkte den Journey-Phasen zu")}
        kind="OBJECTIVE"
        tier={tiers?.["1.1"]}
        findIt={tt(
          `${where} → “DigitalIT Solutions · annual funnel”. The six stages, top to bottom, are the six touchpoints. Answer in the phase board below.`,
          `${where} → „DigitalIT Solutions · Jahrestrichter“. Die sechs Stufen von oben nach unten sind die sechs Kontaktpunkte. Antworten Sie im Phasen-Board unten.`,
        )}
      >
        <MaterialRefs refs={["A2"]} />
        <SortBoard />
      </AnswerBlock>

      <AnswerBlock
        id="block-1-2"
        title={tt("Block 1.2 · Write down what the funnel prints", "Block 1.2 · Notieren Sie, was der Trichter ausweist")}
        kind="OBJECTIVE"
        tier={tiers?.["1.2"]}
        findIt={tt(
          `${where} → “DigitalIT Solutions · annual funnel”. Beside each arrow: the conversion (large), “ref” (the benchmark) and the gap bar with its pp value. The repeat-purchase rate is the bar beneath the funnel. Answer in the table below.`,
          `${where} → „DigitalIT Solutions · Jahrestrichter“. Neben jedem Pfeil: die Konversion (groß), „ref“ (der Benchmark) und der Abweichungsbalken mit seinem PP-Wert. Die Wiederkaufsrate ist der Balken unter dem Trichter. Antworten Sie in der Tabelle unten.`,
        )}
      >
        <MaterialRefs refs={["A2"]} />
        <FillTable />
      </AnswerBlock>

      <AnswerBlock
        id="block-1-3"
        title={tt("Block 1.3 · Name the stage with the largest negative gap", "Block 1.3 · Benennen Sie die Stufe mit der größten negativen Abweichung")}
        kind="OBJECTIVE"
        tier={tiers?.["1.3"]}
        findIt={tt(
          `${where} → “DigitalIT Solutions · annual funnel” → the gap bars beside the arrows. Answer below.`,
          `${where} → „DigitalIT Solutions · Jahrestrichter“ → die Abweichungsbalken neben den Pfeilen. Antworten Sie unten.`,
        )}
      >
        <MaterialRefs refs={["A2"]} />
        <WeakestPick />
      </AnswerBlock>

      <AnswerBlock
        id="block-1-4"
        title={tt("Block 1.4 · What does the leak cost?", "Block 1.4 · Was kostet das Leck?")}
        kind="JUDGED"
        tier={tiers?.["1.4"]}
        findIt={tt(
          `${where} → “DigitalIT Solutions · annual funnel” → the two counts either side of the arrow you named in Block 1.3, and the counts further down the funnel.`,
          `${where} → „DigitalIT Solutions · Jahrestrichter“ → die beiden Zahlen beidseits des Pfeils, den Sie in Block 1.3 benannt haben, und die Zahlen weiter unten im Trichter.`,
        )}
      >
        <MaterialRefs refs={["A2"]} />
        <CostSentence />
      </AnswerBlock>
    </>
  );
}
