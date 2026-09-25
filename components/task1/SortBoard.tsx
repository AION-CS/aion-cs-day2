"use client";

import { useState } from "react";
import clsx from "clsx";
import { PHASES } from "@/data/funnel";
import type { Phase, StageId } from "@/data/funnel";
import { PHASE_PAIR_TESTS, PHASE_TESTS, TOUCHPOINTS, TOUCHPOINT_BY_ID } from "@/data/touchpoints";
import { sortHolds } from "@/lib/checks";
import { sortKey } from "@/lib/answerKey";
import { IDS } from "@/lib/missing";
import { useStore } from "@/store/useStore";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { RevealHint } from "@/components/ui/RevealHint";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { Gloss } from "@/lib/glossify";
import { UndoRedoControls } from "@/components/ui/UndoRedoControls";
import { tt } from "@/lib/lang";

function Chip({
  id,
  selected,
  dragging,
  clue,
  onSelect,
  onDragStart,
  onDragEnd,
}: {
  id: StageId;
  selected: boolean;
  dragging: boolean;
  clue: string | null;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const t = TOUCHPOINT_BY_ID[id];
  return (
    <div id={IDS.touchpoint(id)} className="space-y-1">
      <button
        type="button"
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={onSelect}
        aria-pressed={selected}
        className={clsx(
          "flex w-full items-center gap-2 rounded-lg border bg-paper px-2.5 py-2 text-left transition-colors",
          selected ? "border-accent bg-accentSoft ring-2 ring-gold anim-pulse" : "border-line hover:border-ash",
          dragging && "is-dragging",
        )}
      >
        <span className="text-caption font-semibold leading-tight">{t.label}</span>
      </button>
      {clue && <p className="fade-in rounded-md border border-gold bg-accentSoft px-2 py-1 text-micro normal-case tracking-normal text-ink">{clue}</p>}
    </div>
  );
}

/**
 * Block 1.1 mechanics: three phase bins, six touchpoints. Native HTML5 drag and drop, or click-to-place
 * (select a touchpoint, then a bin) for touch and keyboard. Every placement is undoable. One set-level check
 * reports only how many placed rows hold, never which ones: with three phases, naming the wrong rows would
 * name the answer.
 */
export function SortBoard() {
  const l1 = useStore((s) => s.l1);
  const place = useStore((s) => s.placeTouchpoint);
  const undo = useStore((s) => s.undoSort);
  const redo = useStore((s) => s.redoSort);
  const checkSort = useStore((s) => s.checkSort);
  const showClue = useStore((s) => s.showSortClue);
  const openReasoning = useStore((s) => s.openReasoning);

  const [selected, setSelected] = useState<StageId | null>(null);
  const [dragging, setDragging] = useState<StageId | null>(null);
  const [over, setOver] = useState<string | null>(null);

  const put = (id: StageId, phase: Phase | null) => {
    place(id, phase);
    setSelected(null);
  };
  const unplaced = TOUCHPOINTS.filter((t) => l1.sort[t.id] === null);
  const res = l1.sortResult;
  const canReveal = l1.sortChecks >= 2;

  const dropOn = (phase: Phase | null) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = (e.dataTransfer.getData("text/plain") || dragging) as StageId | null;
    setOver(null);
    setDragging(null);
    if (id && id in TOUCHPOINT_BY_ID) put(id, phase);
  };
  const dragOn = (key: string) => (e: React.DragEvent) => {
    e.preventDefault();
    setOver(key);
  };
  const chipProps = (id: StageId) => ({
    id,
    selected: selected === id,
    dragging: dragging === id,
    clue: l1.sortClue ? TOUCHPOINT_BY_ID[id].clue : null,
    onSelect: () => setSelected(selected === id ? null : id),
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "move";
      setDragging(id);
    },
    onDragEnd: () => {
      setDragging(null);
      setOver(null);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-ash">
          {tt(
            "Drag a touchpoint into a phase, or select it and then select a phase. Select a placed one to move it again.",
            "Ziehen Sie einen Kontaktpunkt in eine Phase, oder wählen Sie ihn aus und dann eine Phase. Wählen Sie einen bereits zugeordneten aus, um ihn erneut zu verschieben.",
          )}
        </p>
        <UndoRedoControls onUndo={undo} onRedo={redo} undoCount={l1.history.length} redoCount={l1.future.length} />
      </div>

      <div
        onDragOver={dragOn("tray")}
        onDragLeave={() => setOver(null)}
        onDrop={dropOn(null)}
        className={clsx("rounded-lg border border-dashed border-ash/60 bg-mist/60 p-3", over === "tray" && "is-drop-target")}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="smallcaps">{tt("Touchpoints not sorted", "Nicht zugeordnete Kontaktpunkte")} ({unplaced.length})</p>
          {selected && l1.sort[selected] !== null && (
            <button type="button" onClick={() => put(selected, null)} className="btn-ghost btn-sm">
              {tt("Return to this tray", "In dieses Fach zurücklegen")}
            </button>
          )}
        </div>
        {unplaced.length === 0 ? (
          <p className="text-caption text-ash">{tt("Every touchpoint is in a phase.", "Jeder Kontaktpunkt liegt in einer Phase.")}</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {unplaced.map((t) => (
              <Chip key={t.id} {...chipProps(t.id)} />
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {PHASES.map((ph) => {
          const inBin = TOUCHPOINTS.filter((t) => l1.sort[t.id] === ph.id);
          return (
            <div
              key={ph.id}
              onDragOver={dragOn(ph.id)}
              onDragLeave={() => setOver(null)}
              onDrop={dropOn(ph.id)}
              className={clsx("flex min-h-[9rem] flex-col rounded-lg border border-line bg-paper p-2.5", over === ph.id && "is-drop-target")}
            >
              <button
                type="button"
                onClick={() => selected && put(selected, ph.id)}
                aria-label={
                  selected
                    ? tt(`Place ${TOUCHPOINT_BY_ID[selected].label} in ${ph.label}`, `${TOUCHPOINT_BY_ID[selected].label} in ${ph.label} ablegen`)
                    : tt(`${ph.label}. Select a touchpoint first.`, `${ph.label}. Wählen Sie zuerst einen Kontaktpunkt.`)
                }
                className={clsx(
                  "mb-2 rounded-md border px-2 py-1.5 text-left transition-colors",
                  selected ? "border-accent bg-accentSoft hover:bg-gold/30" : "border-transparent bg-mist",
                )}
              >
                <span className="block text-caption font-bold leading-tight">{ph.label}</span>
                <span className="mt-0.5 block text-micro normal-case leading-snug tracking-normal text-ash">{ph.hint}</span>
              </button>
              <div className="space-y-1.5">
                {inBin.map((t) => (
                  <Chip key={t.id} {...chipProps(t.id)} />
                ))}
              </div>
              {inBin.length === 0 && <p className="mt-auto pt-2 text-micro normal-case tracking-normal text-ash">{tt("Empty", "Leer")}</p>}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-start gap-2">
        <RevealHint id="sort-tests" label={tt("Show the test questions", "Testfragen anzeigen")} title={tt("Test questions · taught in Materi A2", "Testfragen · gelehrt in Materi A2")}>
          <div className="space-y-2 text-caption text-ink">
            <p>
              {tt(
                "Ask these of every touchpoint. They repeat the tests from Materi A2; they never say which touchpoint goes where.",
                "Stellen Sie diese Fragen zu jedem Kontaktpunkt. Sie wiederholen die Tests aus Materi A2; sie sagen nie, welcher Kontaktpunkt wohin gehört.",
              )}
            </p>
            <ul className="space-y-1.5">
              {PHASE_TESTS.map((t) => (
                <li key={t.phase}>
                  <span className="font-semibold">{t.name}. </span>
                  <Gloss>{t.test}</Gloss>
                </li>
              ))}
            </ul>
            <p className="smallcaps text-ash">{tt("When two phases both seem to fit", "Wenn zwei Phasen beide zu passen scheinen")}</p>
            <ul className="space-y-1.5">
              {PHASE_PAIR_TESTS.map((t) => (
                <li key={t.pair}>
                  <span className="font-semibold">{t.pair} </span>
                  <Gloss>{t.test}</Gloss>
                </li>
              ))}
            </ul>
            <MaterialRefs refs={["A2"]} lead={tt("Taught in", "Gelehrt in")} />
          </div>
        </RevealHint>
      </div>

      <div className="space-y-3 border-t border-line pt-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => checkSort(sortHolds(l1.sort))} className="btn-primary">
            {tt("Check my sort", "Meine Zuordnung prüfen")}
          </button>
          {!l1.sortClue && (
            <button type="button" onClick={showClue} className="btn-ghost btn-sm border-gold">
              {tt("Show clue", "Hinweis anzeigen")}
            </button>
          )}
          <span className="text-caption text-ash">
            {tt("Checks requested:", "Angeforderte Prüfungen:")} <span className="tnum font-semibold text-ink">{l1.sortChecks}</span>
          </span>
        </div>
        <p className="text-micro normal-case tracking-normal text-ash">
          {tt(
            "A check counts how many placed rows hold. It never says which, because with three phases naming the wrong rows would name the answer.",
            "Eine Prüfung zählt, wie viele zugeordnete Zeilen stimmen. Sie sagt nie welche, denn bei drei Phasen würde das Nennen der falschen Zeilen die Antwort nennen.",
          )}
        </p>
        {res && (
          <p role="status" className="text-caption text-ink">
            {res.placed === 0
              ? tt("Nothing is sorted yet.", "Noch nichts ist zugeordnet.")
              : tt(
                  `${res.holds} of ${res.placed} placed ${res.placed === 1 ? "touchpoint holds" : "touchpoints hold"}.`,
                  `${res.holds} von ${res.placed} zugeordneten ${res.placed === 1 ? "Kontaktpunkt stimmt" : "Kontaktpunkten stimmen"}.`,
                )}
            {res.placed < TOUCHPOINTS.length &&
              tt(` ${TOUCHPOINTS.length - res.placed} not placed yet, so not checked.`, ` ${TOUCHPOINTS.length - res.placed} noch nicht zugeordnet, daher nicht geprüft.`)}
          </p>
        )}
        {l1.sortClue && (
          <p className="text-micro normal-case tracking-normal text-ash">
            {tt(
              "The clue is a test question under every touchpoint, not only under the ones that are off.",
              "Der Hinweis ist eine Testfrage unter jedem Kontaktpunkt, nicht nur unter denen, die nicht stimmen.",
            )}
          </p>
        )}
        {canReveal && !l1.reasoningOpened && (
          <button type="button" onClick={openReasoning} className="btn-ghost btn-sm">
            {tt("Show the reasoning (recorded in your export)", "Begründung anzeigen (wird in Ihrem Export vermerkt)")}
          </button>
        )}
        {l1.reasoningOpened && (
          <ul className="fade-in space-y-1.5 rounded-lg border border-gold bg-accentSoft p-3 text-caption text-ink">
            <li className="smallcaps text-accent">
              {tt(`The reasoning · opened after ${l1.sortChecks} checks`, `Die Begründung · geöffnet nach ${l1.sortChecks} Prüfungen`)}
            </li>
            {TOUCHPOINTS.map((t) => (
              <li key={t.id}>
                <span className="font-semibold">{t.label}:</span> {t.why}
              </li>
            ))}
          </ul>
        )}
      </div>
      <AnswerKey block={sortKey()} />
    </div>
  );
}
