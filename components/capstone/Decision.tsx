"use client";

import { AnswerBlock } from "@/components/ui/AnswerBlock";
import type { Tier } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { AllocationGrid } from "@/components/task3/AllocationGrid";
import { StartMonths } from "@/components/task3/SequenceBlock";
import { GovernanceRows, PostponedField } from "@/components/task3/MemoFields";
import { allocKey } from "@/lib/answerKey";
import { allocGuide } from "@/lib/mentorGuide";
import { tt } from "@/lib/lang";

type T3 = "3.1" | "3.2";

/**
 * The decision part of the Route 1 Case File (CLAUDE.md #29): two blocks. 3.1 spends the budget and sets the start months
 * (the allocation grid and the rollout order of Route 3, merged); 3.2 says what is cut or postponed and who owns what is
 * funded (Route 3's "what was cut", "governance" and "postponed measure", merged). The answers live in the same slice as
 * Route 3, so work done here carries over to it.
 */
export function DecisionBlocks({ tiers, where }: { tiers?: Partial<Record<T3, Tier>>; where: string }) {
  return (
    <>
      <AnswerBlock
        tier={tiers?.["3.1"]}
        id="block-3-1"
        title={tt("Block 3.1 · Spend the budget and set the start months", "Block 3.1 · Das Budget verteilen und die Startmonate festlegen")}
        kind="OBJECTIVE"
        findIt={tt(
          `${where} → “Budget allocation grid” below. Each line item shows its cost and effect; the bar at the top is the running total against the €150,000. Below the grid, pick a start month for every item you fund.`,
          `${where} → „Budget-Zuteilungsraster“ unten. Jeder Posten zeigt seine Kosten und Wirkung; der Balken oben ist die laufende Summe gegenüber den 150.000 €. Wählen Sie unter dem Raster für jeden finanzierten Posten einen Startmonat.`,
        )}
      >
        <MaterialRefs refs={["C3", "C1"]} />
        <AllocationGrid />
        <div className="space-y-2 border-t border-line pt-3">
          <p className="smallcaps">{tt("Rollout order", "Einführungsreihenfolge")}</p>
          <StartMonths />
        </div>
        <AnswerKey block={allocKey()} />
        <MentorGuide guide={allocGuide()} />
      </AnswerBlock>

      <AnswerBlock
        tier={tiers?.["3.2"]}
        id="block-3-2"
        title={tt("Block 3.2 · What you leave out, and who owns what you fund", "Block 3.2 · Was Sie weglassen, und wer verantwortet, was Sie finanzieren")}
        kind="JUDGED"
        findIt={tt(
          `${where} → your allocation in Block 3.1 and the list “Left open by your allocation” below. Answer beneath it, then set an owner, a cadence and a trigger for each item you funded.`,
          `${where} → Ihre Zuteilung in Block 3.1 und die Liste „Von Ihrer Zuteilung offen gelassen“ unten. Antworten Sie darunter und legen Sie dann für jeden finanzierten Posten einen Owner, einen Rhythmus und einen Auslöser fest.`,
        )}
      >
        <MaterialRefs refs={["C2", "C4"]} />
        <PostponedField />
        <div className="space-y-2 border-t border-line pt-3">
          <p className="smallcaps">{tt("Who owns what you fund", "Wer verantwortet, was Sie finanzieren")}</p>
          <GovernanceRows />
        </div>
      </AnswerBlock>
    </>
  );
}
