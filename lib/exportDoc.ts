import { COLS, COL_LABEL, PHASE_LABEL, ROW_IDS, ROW_LABEL, STEP_BY_ID, cellId } from "@/data/funnel";
import { CONTRACT, OPTIONS, OPT_IDS, SEGMENTS, SEG_IDS, cellKey, fmtEuroPlain } from "@/data/segments";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { COURSE } from "@/lib/routes";
import { esc } from "@/lib/svg";
import { parsePct } from "@/lib/parseAmount";
import { BUDGET, ITEMS, ITEM_IDS, ITEM_KPI, KPI_LABEL, OPT_NAME, SCOPES, cadenceLabel, ownerLabel, pickupLabel } from "@/data/program";
import { fundedItems, itemCost, leverNet, leftOpen, remaining, sequenceTruth, totalSpent } from "@/lib/program";
import { parseAmount } from "@/lib/parseAmount";
import type { Persisted } from "@/store/useStore";
import { euro, getLang, num, tt } from "@/lib/lang";

/**
 * Each exported note is built here as a self-contained HTML string (inline CSS + inline SVG). The on-screen
 * "Preview of your note" renders this same body, so what the participant reads is what they download. It never
 * prints answer keys, ticks, crosses or scores.
 */

const courseName = () => tt("Customer Retention & Buying Behaviour in B2B IT Sales", "Kundenbindung & Kaufverhalten im B2B-IT-Vertrieb");
/** A euro amount in the active language; a negative amount keeps a proper minus sign. */
const moneyIn = (n: number) => (n < 0 ? tt(`−€${num(Math.round(-n))}`, `−${num(Math.round(-n))}\u00A0€`) : euro(n));

export const DOC_CSS = `
.doc{font-family:Georgia,Cambria,"Times New Roman",serif;color:#1F2328;background:#FFFEFA;line-height:1.5;font-size:14px}
.doc *{box-sizing:border-box}
.doc h1{font-size:22px;margin:0 0 4px;font-weight:600}
.doc h2{font-size:15px;margin:22px 0 8px;padding-bottom:4px;border-bottom:1px solid #D8D1BF;font-weight:600;letter-spacing:.01em}
.doc .meta{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;margin:12px 0 4px;font-family:system-ui,sans-serif;font-size:12.5px}
.doc .meta dt{color:#59606A}.doc .meta dd{margin:0}
.doc .kicker{font-family:system-ui,sans-serif;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A5A0B}
.doc table{width:100%;border-collapse:collapse;font-size:12.5px;font-family:system-ui,sans-serif}
.doc th{text-align:left;font-weight:600;color:#59606A;border-bottom:1px solid #59606A;padding:4px 8px 4px 0;font-size:11px;letter-spacing:.04em;text-transform:uppercase}
.doc td{border-bottom:1px solid #ECE6D6;padding:6px 8px 6px 0;vertical-align:top}
.doc td.num{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.doc td.id{font-weight:700}
.doc table{table-layout:auto}.doc td,.doc th{overflow-wrap:anywhere}
.doc blockquote{margin:6px 0;padding:6px 12px;border-left:3px solid #D99A2B;background:#FBF0D6}
.doc .box{border:1px solid #D8D1BF;padding:8px 12px;margin:8px 0;background:#fff}
.doc .muted{color:#59606A}
.doc .tag{display:inline-block;border:1px dashed #A4472A;color:#A4472A;border-radius:99px;padding:0 8px;font-family:system-ui,sans-serif;font-size:11px;margin-left:6px}
.doc .foot{margin-top:26px;padding-top:8px;border-top:1px solid #59606A;font-family:system-ui,sans-serif;font-size:12px;color:#59606A}
.doc .legend{font-family:system-ui,sans-serif;font-size:11.5px;color:#59606A;margin:4px 0 0}
.doc svg{display:block;margin:8px 0}
@media print{.doc{font-size:12px}.doc h2{break-after:avoid}.doc table,.doc svg,.doc blockquote{break-inside:avoid}}
`;

const dateLabel = () => new Date().toLocaleDateString(tt("en-GB", "de-DE"), { day: "numeric", month: "long", year: "numeric" });

function header(title: string, level: string, p: Persisted): string {
  return `
<div class="kicker">${esc(courseName())} · ${esc(COURSE.company)}</div>
<h1>${esc(title)}</h1>
<dl class="meta">
  <dt>${tt("Course", "Kurs")}</dt><dd>${esc(courseName())} · ${tt("Day", "Tag")} ${COURSE.day}</dd>
  <dt>${tt("Position", "Stufe")}</dt><dd>${esc(level)}</dd>
  <dt>${tt("Participant", "Teilnehmer/in")}</dt><dd>${esc(p.participant.name.trim() || "—")}</dd>
  <dt>${tt("Date", "Datum")}</dt><dd>${esc(dateLabel())}</dd>
</dl>`;
}

const para = (s: string) => `<blockquote>${esc(s.trim()) || "—"}</blockquote>`;

/** A bar per funnel step from the participant's own gap entries, as an inline SVG. */
function gapBarsSvg(p: Persisted): string {
  const W = 560;
  const rowH = 26;
  const rows = ROW_IDS.map((r, i) => {
    const v = parsePct(p.l1.fill[cellId(r, "gap")] ?? "");
    const y = 8 + i * rowH;
    const w = v === null ? 0 : (Math.abs(v) / 35) * 200;
    return `<text x="0" y="${y + 13}" font-size="11.5" fill="#1F2328" font-family="system-ui,sans-serif">${esc(ROW_LABEL[r])}</text>
<rect x="290" y="${y}" width="${Math.max(w, 1.5).toFixed(1)}" height="14" fill="#ECE6D6" stroke="#59606A"/>
<text x="${(296 + Math.max(w, 1.5)).toFixed(1)}" y="${y + 12}" font-size="11.5" fill="#1F2328" font-family="system-ui,sans-serif">${v === null ? "—" : `${v > 0 ? "+" : v < 0 ? "−" : ""}${num(Math.abs(v), { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${tt("pp", "PP")}`}</text>`;
  }).join("\n");
  const H = 8 + ROW_IDS.length * rowH;
  const gapTitle = tt("Gap to the benchmark reference, as you entered it", "Abweichung vom Benchmark, so wie Sie sie eingetragen haben");
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(gapTitle)}"><title>${esc(gapTitle)}</title>${rows}</svg>`;
}

export function calculationBody(p: Persisted): string {
  const { l1, l2 } = p;
  const gridRows = OPT_IDS.map(
    (o) =>
      `<tr><td class="id">${esc(OPTIONS[o].name)}</td>${SEG_IDS.map((s) => {
        const k = cellKey(o, s);
        return `<td class="num">${esc((l2.grid[k] ?? "").trim() || "—")}${l2.loss[k] ? `<span class="tag">${tt("net loss", "Nettoverlust")}</span>` : ""}</td>`;
      }).join("")}</tr>`,
  ).join("");
  const recRows = SEG_IDS.map(
    (s) => `<h2>2.3 · ${esc(SEGMENTS[s].name)}</h2>
<p><strong>${l2.rec[s] ? esc(OPTIONS[l2.rec[s]!].name) : "—"}</strong></p>${para(l2.just[s])}`,
  ).join("\n");
  const lossLine = l2.lossNone ? "You stated that no cell shows a net loss." : "Cells marked as a net loss are tagged in the grid above.";
  return `${header("Calculation Note", "Level 2 · Application", p)}
<h2>Where this starts</h2>
<p>Task 1 found the largest negative gap at <strong>${l1.weakest ? esc(STEP_BY_ID[l1.weakest].label) : "—"}</strong>.</p>
${l1.sentence.trim() ? para(l1.sentence) : ""}
<p class="muted">Inputs as briefed: contract price ${esc(fmtEuroPlain(CONTRACT.price))}, gross margin ${CONTRACT.margin * 100}%, gross profit per order ${esc(fmtEuroPlain(CONTRACT.gp))}. Project clients ${SEGMENTS.P.clients} (baseline repeat orders ${SEGMENTS.P.baseline}), retainer clients ${SEGMENTS.R.clients} (baseline ${SEGMENTS.R.baseline}).</p>

<h2>2.1 · Net impact per option and segment (€ per year)</h2>
<table><thead><tr><th>Option</th>${SEG_IDS.map((s) => `<th class="num">${esc(SEGMENTS[s].name)}</th>`).join("")}</tr></thead><tbody>${gridRows}</tbody></table>
<p class="legend">2.2 · ${esc(lossLine)}</p>

${recRows}

<h2>2.4 · One option across both segments</h2>
<p><strong>${l2.uniform ? esc(OPTIONS[l2.uniform].name) : "—"}</strong></p>${para(l2.tradeoff)}

<div class="foot">Checks requested: ${l2.checks}<br/>Generated ${esc(dateLabel())}.</div>`;
}

/** The Level 3 memo. The on-screen live preview and the exported file are both built by this function. */
export function memoBody(p: Persisted): string {
  const { l1, l2, route3: r } = p;
  const name = p.participant.name.trim();
  const a = r.alloc;
  const funded = fundedItems(a);
  const money = moneyIn;

  // 1 · Diagnosis: the learner's own answers from Routes 1 and 2, quoted and never re-asked.
  const uni = l2.uniform;
  const cells = uni ? [parseAmount(l2.grid[cellKey(uni, "P")] ?? ""), parseAmount(l2.grid[cellKey(uni, "R")] ?? "")] : [];
  const uniNet = cells.length === 2 && cells.every((c) => c !== null) ? (cells[0]! + cells[1]!) : null;
  const diagnosis =
    l1.weakest || l1.sentence.trim() || uni
      ? `<blockquote><strong>${tt("Where prospects leak (Route 1).", "Wo Interessenten verloren gehen (Route 1).")}</strong> ${tt("Largest negative gap:", "Größte negative Abweichung:")} ${l1.weakest ? esc(STEP_BY_ID[l1.weakest].label) : "—"}.<br/>${esc(l1.sentence.trim()) || "—"}</blockquote>
<blockquote><strong>${tt("The lever chosen for both segments (Route 2).", "Der für beide Segmente gewählte Hebel (Route 2).")}</strong> ${uni ? esc(OPT_NAME[uni]) : "—"}${uniNet !== null ? tt(`, net impact ${esc(money(uniNet))} a year per your grid`, `, Nettoeffekt ${esc(money(uniNet))} im Jahr laut Ihrem Raster`) : ""}.<br/>${esc(l2.tradeoff.trim()) || "—"}</blockquote>`
      : `<p class="muted">${tt("Route 1 and Route 2 are not finished, so there is nothing to quote yet. Finish them first; nothing is blocked.", "Route 1 und Route 2 sind nicht abgeschlossen, es gibt also noch nichts zu zitieren. Schließen Sie sie zuerst ab; nichts ist gesperrt.")}</p>`;

  // 2 · Allocation
  const scopeLabel = (id: string) => (id === "lever" ? `${a.leverOpt ? esc(OPT_NAME[a.leverOpt]) : ""} · ${esc(SCOPES.find((s) => s.id === a.leverScope)!.short)}` : "");
  const allocRows = ITEM_IDS.map((id) => {
    const on = funded.includes(id);
    const detail = id === "lever" ? (on ? scopeLabel(id) : tt("not funded", "nicht finanziert")) : on ? tt("funded in full", "voll finanziert") : tt("not funded", "nicht finanziert");
    return `<tr><td class="id">${ITEMS[id].n} · ${esc(ITEMS[id].short)}</td><td>${detail}</td><td class="num">${on ? esc(money(itemCost(a, id))) : "—"}</td><td class="num">${on && r.start[id] !== null ? tt("month ", "Monat ") + r.start[id] : "—"}</td></tr>`;
  }).join("");
  const spent = totalSpent(a);
  const rest = remaining(a);
  const leverLine = a.leverOpt ? tt(` The lever nets about ${esc(money(leverNet(a.leverOpt, a.leverScope)))} a year (Route 2 figures).`, ` Der Hebel bringt netto etwa ${esc(money(leverNet(a.leverOpt, a.leverScope)))} im Jahr (Zahlen aus Route 2).`) : "";

  // 4 · Governance, one row per funded item
  const govRows = funded
    .map((id) => {
      const g = r.gov[id];
      return `<tr><td class="id">${esc(ITEM_KPI[id])}</td><td>${(g.owner && esc(ownerLabel(g.owner))) || "—"}</td><td>${(g.cadence && esc(cadenceLabel(g.cadence))) || "—"}</td><td>${esc(g.trigger.trim()) || "—"}</td></tr>`;
    })
    .join("");

  // 5 · Sequence
  const order = [...funded].filter((i) => r.start[i] !== null).sort((x, y) => r.start[x]! - r.start[y]!);
  const orderText = order.length ? order.map((i) => `${ITEMS[i].short} (${tt("month", "Monat")} ${r.start[i]})`).join(" → ") : "—";
  const seq = sequenceTruth(a, r.start);
  const warnedText = r.warned === null ? tt("not recorded", "nicht erfasst") : r.warned ? tt("yes, it appeared", "ja, er ist erschienen") : tt("no, it did not appear", "nein, er ist nicht erschienen");
  const seqLine = seq.text ? `<blockquote>${esc(seq.text)}</blockquote>` : "";

  const open = leftOpen(a);
  return `<div class="kicker">${esc(courseName())} · ${esc(COURSE.company)}</div>
<h1>${tt("Decision Memo", "Entscheidungs-Memo")}</h1>
<dl class="meta">
  <dt>${tt("To", "An")}</dt><dd>${tt("Chief Executive Officer", "Geschäftsführung (CEO)")}, ${esc(COURSE.company)} <span class="muted">[${tt("placeholder", "Platzhalter")}]</span></dd>
  <dt>${tt("From", "Von")}</dt><dd>${esc(name || "—")}, ${tt("Chief Customer Officer / Sales Manager", "Chief Customer Officer / Vertriebsleiter")}</dd>
  <dt>${tt("Subject", "Betreff")}</dt><dd>${tt("Retention System Rollout — 4-Month Plan", "Einführung des Bindungssystems — Vier-Monats-Plan")}</dd>
  <dt>${tt("Position", "Stufe")}</dt><dd>${tt("Level 3 · Management decision", "Level 3 · Managemententscheidung")}</dd>
  <dt>${tt("Date", "Datum")}</dt><dd>${esc(dateLabel())}</dd>
</dl>

<h2>1 · ${tt("Diagnosis", "Diagnose")}</h2>
${diagnosis}

<h2>2 · ${tt(`Allocation of the ${esc(money(BUDGET))} budget`, `Verteilung des Budgets von ${esc(money(BUDGET))}`)}</h2>
<table><thead><tr><th>${tt("Line item", "Posten")}</th><th>${tt("Scope", "Umfang")}</th><th class="num">${tt("Cost", "Kosten")}</th><th class="num">${tt("Starts", "Start")}</th></tr></thead><tbody>${allocRows}</tbody></table>
<p><strong>${tt(`Spent ${esc(money(spent))}`, `Ausgegeben ${esc(money(spent))}`)}</strong> ${tt("of", "von")} ${esc(money(BUDGET))}; ${rest >= 0 ? esc(money(rest)) + tt(" remaining", " verbleibend") : esc(money(-rest)) + tt(" over budget", " über dem Budget")}.${leverLine}</p>

<h2>3 · ${tt("What was cut", "Was gestrichen wurde")}</h2>
${para(r.cut)}

<h2>4 · ${tt("Governance", "Steuerung")}</h2>
${funded.length ? `<table><thead><tr><th>KPI</th><th>Owner</th><th>${tt("Review cadence", "Review-Rhythmus")}</th><th>${tt("Escalation trigger", "Eskalations-Auslöser")}</th></tr></thead><tbody>${govRows}</tbody></table>` : "<p>—</p>"}

<h2>5 · ${tt("Sequence", "Reihenfolge")}</h2>
<p><strong>${tt("Rollout order:", "Einführungsreihenfolge:")}</strong> ${esc(orderText)}.</p>
<p><strong>${tt("KPI blind-spot warning:", "Hinweis auf den KPI-Blindfleck:")}</strong> ${esc(warnedText)}${r.warned && r.missingKpi ? tt("; the KPI that loses its baseline: ", "; die KPI, die ihren Ausgangswert verliert: ") + esc(KPI_LABEL[r.missingKpi]) : ""}.</p>${seqLine}

<h2>6 · ${tt("The measure I postponed", "Die Maßnahme, die ich zurückgestellt habe")}</h2>
${para(r.postponed)}
<p><strong>${tt("Picked up:", "Wiederaufnahme:")}</strong> ${(r.pickup && esc(pickupLabel(r.pickup))) || "—"}</p>
<p class="legend">${tt("Left open by this allocation:", "Von dieser Zuteilung offen gelassen:")} ${open.map((o) => esc(o)).join(" ")}</p>

<div class="foot">${tt("Checks requested:", "Angeforderte Prüfungen:")} ${r.checks}<br/>${tt("Generated", "Erstellt am")} ${esc(dateLabel())}.</div>`;
}

export function wrapDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="${getLang()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>body{margin:0;background:#F3EFE4}.sheet{max-width:820px;margin:0 auto;padding:36px 40px;background:#FFFEFA}@media print{body{background:#fff}.sheet{padding:0;max-width:none}@page{margin:16mm}}${DOC_CSS}</style>
</head><body><div class="sheet"><div class="doc">${body}</div></div></body></html>`;
}

export function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Opens the same document in a new window and prints it (no PDF library). Falls back to a hidden frame if pop-ups are blocked. */
export function printDocument(title: string, html: string) {
  const win = window.open("", "_blank");
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.document.title = title;
    win.focus();
    window.setTimeout(() => win.print(), 250);
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(iframe);
  const w = iframe.contentWindow;
  if (!w) return iframe.remove();
  w.document.open();
  w.document.write(html);
  w.document.close();
  window.setTimeout(() => {
    w.focus();
    w.print();
    window.setTimeout(() => iframe.remove(), 1000);
  }, 250);
}

/* ------------------------------------------------------------------ the Case File (Route 1, CLAUDE.md #29) */

/**
 * The Case File: one document in three parts (Diagnosis, Calculation, Decision), built here for both the on-screen preview
 * and the download. Optional blocks (1.1, 1.2, 2.2) appear only if the learner filled them in.
 * It never prints answer keys, ticks, crosses or scores.
 */
export function caseFileBody(p: Persisted): string {
  const { l1, l2, route3: r } = p;
  const a = r.alloc;
  const funded = fundedItems(a);
  const money = moneyIn;
  // Part 1 · Diagnosis
  const sorted = TOUCHPOINTS.some((t) => l1.sort[t.id]);
  const sortRows = TOUCHPOINTS.map(
    (t) => `<tr><td class="id">${esc(t.label)}</td><td>${l1.sort[t.id] ? esc(PHASE_LABEL[l1.sort[t.id]!]) : "—"}</td></tr>`,
  ).join("");
  const filled = ROW_IDS.some((row) => COLS.some((c) => (l1.fill[cellId(row, c)] ?? "").trim()));
  const fillRows = ROW_IDS.map(
    (row) => `<tr><td class="id">${esc(ROW_LABEL[row])}</td>${COLS.map((c) => `<td class="num">${esc((l1.fill[cellId(row, c)] ?? "").trim() || "—")}</td>`).join("")}</tr>`,
  ).join("");
  const part1 = `<h2>${tt("Part 1 · Diagnosis", "Teil 1 · Diagnose")}</h2>
${sorted ? `<h2>${tt("1.1 · The six touchpoints, sorted into journey phases", "1.1 · Die sechs Kontaktpunkte, den Journey-Phasen zugeordnet")}</h2>
<table><thead><tr><th>${tt("Touchpoint", "Kontaktpunkt")}</th><th>Phase</th></tr></thead><tbody>${sortRows}</tbody></table>` : ""}
${filled ? `<h2>${tt("1.2 · The funnel figures, as you read them", "1.2 · Die Trichterzahlen, wie Sie sie gelesen haben")}</h2>
<table><thead><tr><th>${tt("Step", "Schritt")}</th>${COLS.map((c) => `<th class="num">${esc(COL_LABEL[c])}</th>`).join("")}</tr></thead><tbody>${fillRows}</tbody></table>
${gapBarsSvg(p)}
<p class="legend">${tt("Bar length = size of the gap you entered. pp = percentage points.", "Balkenlänge = Größe der Abweichung, die Sie eingetragen haben. PP = Prozentpunkte.")}</p>` : ""}
<h2>${tt("1.3 · The stage with the largest negative gap", "1.3 · Die Stufe mit der größten negativen Abweichung")}</h2>
<p><strong>${l1.weakest ? esc(STEP_BY_ID[l1.weakest].label) : "—"}</strong></p>
<h2>${tt("1.4 · What the leak costs", "1.4 · Was das Leck kostet")}</h2>
${para(l1.sentence)}`;

  // Part 2 · Calculation
  const gridRows = OPT_IDS.map(
    (o) =>
      `<tr><td class="id">${esc(OPTIONS[o].name)}</td>${SEG_IDS.map((s) => {
        const k = cellKey(o, s);
        return `<td class="num">${esc((l2.grid[k] ?? "").trim() || "—")}${l2.loss[k] ? `<span class="tag">${tt("net loss", "Nettoverlust")}</span>` : ""}</td>`;
      }).join("")}</tr>`,
  ).join("");
  const lossAnswered = l2.lossNone || Object.values(l2.loss).some(Boolean);
  const recs = SEG_IDS.map(
    (s) => `<h2>2.3 · ${esc(SEGMENTS[s].name)}</h2>
<p><strong>${l2.rec[s] ? esc(OPTIONS[l2.rec[s]!].name) : "—"}</strong></p>${para(l2.just[s])}`,
  ).join("\n");
  const part2 = `<h2>${tt("Part 2 · Calculation", "Teil 2 · Berechnung")}</h2>
<p class="muted">${tt(
    `Inputs as briefed: contract price ${esc(fmtEuroPlain(CONTRACT.price))}, gross margin ${CONTRACT.margin * 100}%, gross profit per order ${esc(fmtEuroPlain(CONTRACT.gp))}. Project clients ${SEGMENTS.P.clients} (baseline repeat orders ${SEGMENTS.P.baseline}), retainer clients ${SEGMENTS.R.clients} (baseline ${SEGMENTS.R.baseline}).`,
    `Eingaben laut Fallbeschreibung: Vertragspreis ${esc(fmtEuroPlain(CONTRACT.price))}, Bruttomarge ${CONTRACT.margin * 100} %, Rohertrag pro Auftrag ${esc(fmtEuroPlain(CONTRACT.gp))}. Projektkunden ${SEGMENTS.P.clients} (Folgeaufträge im Ausgangsjahr ${SEGMENTS.P.baseline}), Retainer-Kunden ${SEGMENTS.R.clients} (Ausgangsjahr ${SEGMENTS.R.baseline}).`,
  )}</p>
<h2>${tt("2.1 · Net impact per option and segment (€ per year)", "2.1 · Nettoeffekt je Option und Segment (€ pro Jahr)")}</h2>
<table><thead><tr><th>Option</th>${SEG_IDS.map((s) => `<th class="num">${esc(SEGMENTS[s].name)}</th>`).join("")}</tr></thead><tbody>${gridRows}</tbody></table>
${lossAnswered ? `<p class="legend">2.2 · ${esc(l2.lossNone ? tt("You stated that no cell shows a net loss.", "Sie haben angegeben, dass keine Zelle einen Nettoverlust zeigt.") : tt("Cells marked as a net loss are tagged in the grid above.", "Zellen, die Sie als Nettoverlust markiert haben, sind im Raster oben gekennzeichnet."))}</p>` : ""}
${recs}`;

  // Part 3 · Decision
  const scopeLabel = `${a.leverOpt ? esc(OPT_NAME[a.leverOpt]) : ""} · ${esc(SCOPES.find((s) => s.id === a.leverScope)!.short)}`;
  const allocRows = ITEM_IDS.map((id) => {
    const on = funded.includes(id);
    const detail = id === "lever" ? (on ? scopeLabel : tt("not funded", "nicht finanziert")) : on ? tt("funded in full", "voll finanziert") : tt("not funded", "nicht finanziert");
    return `<tr><td class="id">${ITEMS[id].n} · ${esc(ITEMS[id].short)}</td><td>${detail}</td><td class="num">${on ? esc(money(itemCost(a, id))) : "—"}</td><td class="num">${on && r.start[id] !== null ? tt("month ", "Monat ") + r.start[id] : "—"}</td></tr>`;
  }).join("");
  const spent = totalSpent(a);
  const rest = remaining(a);
  const leverLine = a.leverOpt ? tt(` The lever nets about ${esc(money(leverNet(a.leverOpt, a.leverScope)))} a year (the figures of Part 2).`, ` Der Hebel bringt netto etwa ${esc(money(leverNet(a.leverOpt, a.leverScope)))} im Jahr (die Zahlen aus Teil 2).`) : "";
  const order = [...funded].filter((i) => r.start[i] !== null).sort((x, y) => r.start[x]! - r.start[y]!);
  const orderText = order.length ? order.map((i) => `${ITEMS[i].short} (${tt("month", "Monat")} ${r.start[i]})`).join(" → ") : "—";
  const seq = sequenceTruth(a, r.start);
  const govRows = funded
    .map((id) => {
      const g = r.gov[id];
      return `<tr><td class="id">${esc(ITEM_KPI[id])}</td><td>${(g.owner && esc(ownerLabel(g.owner))) || "—"}</td><td>${(g.cadence && esc(cadenceLabel(g.cadence))) || "—"}</td><td>${esc(g.trigger.trim()) || "—"}</td></tr>`;
    })
    .join("");
  const part3 = `<h2>${tt("Part 3 · Decision", "Teil 3 · Entscheidung")}</h2>
<h2>${tt(`3.1 · Spending the ${esc(money(BUDGET))} budget, and when each item starts`, `3.1 · Das Budget von ${esc(money(BUDGET))} verteilen, und wann jeder Posten startet`)}</h2>
<table><thead><tr><th>${tt("Line item", "Posten")}</th><th>${tt("Scope", "Umfang")}</th><th class="num">${tt("Cost", "Kosten")}</th><th class="num">${tt("Starts", "Start")}</th></tr></thead><tbody>${allocRows}</tbody></table>
<p><strong>${tt(`Spent ${esc(money(spent))}`, `Ausgegeben ${esc(money(spent))}`)}</strong> ${tt("of", "von")} ${esc(money(BUDGET))}; ${rest >= 0 ? esc(money(rest)) + tt(" remaining", " verbleibend") : esc(money(-rest)) + tt(" over budget", " über dem Budget")}.${leverLine}</p>
<p><strong>${tt("Rollout order:", "Einführungsreihenfolge:")}</strong> ${esc(orderText)}.</p>${seq.text ? `<blockquote>${esc(seq.text)}</blockquote>` : ""}
<h2>${tt("3.2 · What I cut or postpone, and who owns what I fund", "3.2 · Was ich streiche oder zurückstelle, und wer verantwortet, was ich finanziere")}</h2>
${para(r.postponed)}
<p><strong>${tt("Picked up:", "Wiederaufnahme:")}</strong> ${(r.pickup && esc(pickupLabel(r.pickup))) || "—"}</p>
<p class="legend">${tt("Left open by this allocation:", "Von dieser Zuteilung offen gelassen:")} ${leftOpen(a).map((o) => esc(o)).join(" ")}</p>
${funded.length ? `<table><thead><tr><th>KPI</th><th>Owner</th><th>${tt("Review cadence", "Review-Rhythmus")}</th><th>${tt("Escalation trigger", "Eskalations-Auslöser")}</th></tr></thead><tbody>${govRows}</tbody></table>` : "<p>—</p>"}`;

  return `${header(tt("Case File", "Fallakte"), tt("Levels 1 to 3 · Route 1 capstone", "Level 1 bis 3 · Route 1 Capstone"), p)}
<h2>${tt("The case", "Der Fall")}</h2>
<p>${tt(
    `${esc(COURSE.company)} is a mid-size B2B IT services vendor in Germany (project implementations and retainer support contracts). The brief: many leads, few closings, weak retention. Annual funnel: ${esc(
      ["24,000 website visitors", "480 leads", "96 consultations booked", "41 held", "22 proposals", "4 contracts signed"].join(" → "),
    )}. Average contract value ${esc(fmtEuroPlain(CONTRACT.price))} <span class="muted">(Case assumption; the benchmark references are also a Case assumption)</span>. ${SEGMENTS.P.clients + SEGMENTS.R.clients} clients: ${SEGMENTS.P.clients} project and ${SEGMENTS.R.clients} retainer. Budget ${esc(money(BUDGET))} over four months.`,
    `${esc(COURSE.company)} ist ein mittelgroßer B2B-IT-Dienstleister in Deutschland (Projektimplementierungen und Retainer-Supportverträge). Der Auftrag: viele Leads, wenige Abschlüsse, schwache Kundenbindung. Jahrestrichter: ${esc(
      ["24.000 Website-Besucher", "480 Leads", "96 gebuchte Beratungen", "41 geführt", "22 Angebote", "4 unterzeichnete Verträge"].join(" → "),
    )}. Durchschnittlicher Vertragswert ${esc(fmtEuroPlain(CONTRACT.price))} <span class="muted">(Fallannahme; auch die Benchmark-Referenzen sind eine Fallannahme)</span>. ${SEGMENTS.P.clients + SEGMENTS.R.clients} Kunden: ${SEGMENTS.P.clients} Projekt- und ${SEGMENTS.R.clients} Retainer-Kunden. Budget ${esc(money(BUDGET))} über vier Monate.`,
  )}</p>

${part1}

${part2}

${part3}

<div class="foot">${tt(`Checks requested: Diagnose ${l1.checks}, Calculate ${l2.checks}, Decide ${r.checks}`, `Angeforderte Prüfungen: Diagnose ${l1.checks}, Berechnen ${l2.checks}, Entscheiden ${r.checks}`)}${l1.reasoningOpened ? tt(" · The sort reasoning was opened after " + l1.sortChecks + " checks.", " · Die Begründung zur Zuordnung wurde nach " + l1.sortChecks + " Prüfungen geöffnet.") : ""}<br/>${tt("Generated", "Erstellt am")} ${esc(dateLabel())}.</div>`;
}
