import { COLS, COL_LABEL, PHASE_LABEL, ROW_IDS, ROW_LABEL, STEP_BY_ID, cellId } from "@/data/funnel";
import { CONTRACT, OPTIONS, OPT_IDS, SEGMENTS, SEG_IDS, cellKey, fmtEuroPlain } from "@/data/segments";
import { TOUCHPOINTS } from "@/data/touchpoints";
import { COURSE } from "@/lib/routes";
import { esc } from "@/lib/svg";
import { parsePct } from "@/lib/parseAmount";
import { BUDGET, ITEMS, ITEM_IDS, ITEM_KPI, KPI_LABEL, OPT_NAME, SCOPES } from "@/data/program";
import { fundedItems, itemCost, leverNet, leftOpen, remaining, sequenceTruth, totalSpent } from "@/lib/program";
import { parseAmount } from "@/lib/parseAmount";
import type { Persisted } from "@/store/useStore";

/**
 * Each exported note is built here as a self-contained HTML string (inline CSS + inline SVG). The on-screen
 * "Preview of your note" renders this same body, so what the participant reads is what they download. It never
 * prints answer keys, ticks, crosses or scores.
 */

const COURSE_NAME = "Customer Retention & Buying Behaviour in B2B IT Sales";

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

const dateLabel = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function header(title: string, level: string, p: Persisted): string {
  return `
<div class="kicker">${esc(COURSE_NAME)} · ${esc(COURSE.company)}</div>
<h1>${esc(title)}</h1>
<dl class="meta">
  <dt>Course</dt><dd>${esc(COURSE_NAME)} · Day ${COURSE.day}</dd>
  <dt>Position</dt><dd>${esc(level)}</dd>
  <dt>Participant</dt><dd>No. ${esc(p.participant.no.trim() || "—")} · ${esc(p.participant.name.trim() || "—")}</dd>
  <dt>Date</dt><dd>${esc(dateLabel())}</dd>
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
<text x="${(296 + Math.max(w, 1.5)).toFixed(1)}" y="${y + 12}" font-size="11.5" fill="#1F2328" font-family="system-ui,sans-serif">${v === null ? "—" : `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(1)} pp`}</text>`;
  }).join("\n");
  const H = 8 + ROW_IDS.length * rowH;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Gap to the benchmark reference, as you entered it"><title>Gap to the benchmark reference, as you entered it</title>${rows}</svg>`;
}

export function diagnosticBody(p: Persisted): string {
  const { l1 } = p;
  const sortRows = TOUCHPOINTS.map(
    (t) => `<tr><td class="id">${esc(t.label)}</td><td>${l1.sort[t.id] ? esc(PHASE_LABEL[l1.sort[t.id]!]) : "—"}</td></tr>`,
  ).join("");
  const fillRows = ROW_IDS.map(
    (r) =>
      `<tr><td class="id">${esc(ROW_LABEL[r])}</td>${COLS.map((c) => `<td class="num">${esc((l1.fill[cellId(r, c)] ?? "").trim() || "—")}</td>`).join("")}</tr>`,
  ).join("");
  return `${header("Diagnostic Note", "Level 1 · Knowledge", p)}
<h2>The case</h2>
<p>${esc(COURSE.company)} is a mid-size B2B IT services vendor in Germany (project implementations and retainer support contracts). The brief: many leads, few closings, weak retention. Annual funnel: ${esc(
    ["24,000 website visitors", "480 leads", "96 consultations booked", "41 held", "22 proposals", "4 contracts signed"].join(" → "),
  )}. Average contract value ${esc(fmtEuroPlain(CONTRACT.price))} <span class="muted">(Case assumption; the benchmark references are also a Case assumption)</span>.</p>

<h2>1.1 · The six touchpoints, sorted into journey phases</h2>
<table><thead><tr><th>Touchpoint</th><th>Phase</th></tr></thead><tbody>${sortRows}</tbody></table>

<h2>1.2 · The funnel figures, as you read them</h2>
<table><thead><tr><th>Step</th>${COLS.map((c) => `<th class="num">${esc(COL_LABEL[c])}</th>`).join("")}</tr></thead><tbody>${fillRows}</tbody></table>
${gapBarsSvg(p)}
<p class="legend">Bar length = size of the gap you entered. pp = percentage points.</p>

<h2>1.3 · The stage with the largest negative gap</h2>
<p><strong>${l1.weakest ? esc(STEP_BY_ID[l1.weakest].label) : "—"}</strong></p>

<h2>1.4 · What the leak costs</h2>
${para(l1.sentence)}

<div class="foot">Checks requested: ${l1.checks}${l1.reasoningOpened ? " · The sort reasoning was opened after " + l1.sortChecks + " checks." : ""}<br/>Generated ${esc(dateLabel())}.</div>`;
}

export function calculationBody(p: Persisted): string {
  const { l1, l2 } = p;
  const gridRows = OPT_IDS.map(
    (o) =>
      `<tr><td class="id">${esc(OPTIONS[o].name)}</td>${SEG_IDS.map((s) => {
        const k = cellKey(o, s);
        return `<td class="num">${esc((l2.grid[k] ?? "").trim() || "—")}${l2.loss[k] ? `<span class="tag">net loss</span>` : ""}</td>`;
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
  const money = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;

  // 1 · Diagnosis: the learner's own answers from Routes 1 and 2, quoted and never re-asked.
  const uni = l2.uniform;
  const cells = uni ? [parseAmount(l2.grid[cellKey(uni, "P")] ?? ""), parseAmount(l2.grid[cellKey(uni, "R")] ?? "")] : [];
  const uniNet = cells.length === 2 && cells.every((c) => c !== null) ? (cells[0]! + cells[1]!) : null;
  const diagnosis =
    l1.weakest || l1.sentence.trim() || uni
      ? `<blockquote><strong>Where prospects leak (Route 1).</strong> Largest negative gap: ${l1.weakest ? esc(STEP_BY_ID[l1.weakest].label) : "—"}.<br/>${esc(l1.sentence.trim()) || "—"}</blockquote>
<blockquote><strong>The lever chosen for both segments (Route 2).</strong> ${uni ? esc(OPT_NAME[uni]) : "—"}${uniNet !== null ? `, net impact ${esc(money(uniNet).replace("€-", "−€"))} a year per your grid` : ""}.<br/>${esc(l2.tradeoff.trim()) || "—"}</blockquote>`
      : `<p class="muted">Route 1 and Route 2 are not finished, so there is nothing to quote yet. Finish them first; nothing is blocked.</p>`;

  // 2 · Allocation
  const scopeLabel = (id: string) => (id === "lever" ? `${a.leverOpt ? esc(OPT_NAME[a.leverOpt]) : ""} · ${esc(SCOPES.find((s) => s.id === a.leverScope)!.short)}` : "");
  const allocRows = ITEM_IDS.map((id) => {
    const on = funded.includes(id);
    const detail = id === "lever" ? (on ? scopeLabel(id) : "not funded") : on ? "funded in full" : "not funded";
    return `<tr><td class="id">${ITEMS[id].n} · ${esc(ITEMS[id].short)}</td><td>${detail}</td><td class="num">${on ? esc(money(itemCost(a, id))) : "—"}</td><td class="num">${on && r.start[id] !== null ? "month " + r.start[id] : "—"}</td></tr>`;
  }).join("");
  const spent = totalSpent(a);
  const rest = remaining(a);
  const leverLine = a.leverOpt ? ` The lever nets about ${esc(money(leverNet(a.leverOpt, a.leverScope)).replace("€-", "−€"))} a year (Route 2 figures).` : "";

  // 4 · Governance, one row per funded item
  const govRows = funded
    .map((id) => {
      const g = r.gov[id];
      return `<tr><td class="id">${esc(ITEM_KPI[id])}</td><td>${esc(g.owner) || "—"}</td><td>${esc(g.cadence) || "—"}</td><td>${esc(g.trigger.trim()) || "—"}</td></tr>`;
    })
    .join("");

  // 5 · Sequence
  const order = [...funded].filter((i) => r.start[i] !== null).sort((x, y) => r.start[x]! - r.start[y]!);
  const orderText = order.length ? order.map((i) => `${ITEMS[i].short} (month ${r.start[i]})`).join(" → ") : "—";
  const seq = sequenceTruth(a, r.start);
  const warnedText = r.warned === null ? "not recorded" : r.warned ? "yes, it appeared" : "no, it did not appear";
  const seqLine = seq.text ? `<blockquote>${esc(seq.text)}</blockquote>` : "";

  const open = leftOpen(a);
  return `<div class="kicker">${esc(COURSE_NAME)} · ${esc(COURSE.company)}</div>
<h1>Decision Memo</h1>
<dl class="meta">
  <dt>To</dt><dd>Chief Executive Officer, ${esc(COURSE.company)} <span class="muted">[placeholder]</span></dd>
  <dt>From</dt><dd>${esc(name || "—")}, Chief Customer Officer / Sales Manager</dd>
  <dt>Subject</dt><dd>Retention System Rollout — 4-Month Plan</dd>
  <dt>Position</dt><dd>Level 3 · Management decision · Participant No. ${esc(p.participant.no.trim() || "—")}</dd>
  <dt>Date</dt><dd>${esc(dateLabel())}</dd>
</dl>

<h2>1 · Diagnosis</h2>
${diagnosis}

<h2>2 · Allocation of the ${esc(money(BUDGET))} budget</h2>
<table><thead><tr><th>Line item</th><th>Scope</th><th class="num">Cost</th><th class="num">Starts</th></tr></thead><tbody>${allocRows}</tbody></table>
<p><strong>Spent ${esc(money(spent))}</strong> of ${esc(money(BUDGET))}; ${rest >= 0 ? esc(money(rest)) + " remaining" : esc(money(-rest)) + " over budget"}.${leverLine}</p>

<h2>3 · What was cut</h2>
${para(r.cut)}

<h2>4 · Governance</h2>
${funded.length ? `<table><thead><tr><th>KPI</th><th>Owner</th><th>Review cadence</th><th>Escalation trigger</th></tr></thead><tbody>${govRows}</tbody></table>` : "<p>—</p>"}

<h2>5 · Sequence</h2>
<p><strong>Rollout order:</strong> ${esc(orderText)}.</p>
<p><strong>KPI blind-spot warning:</strong> ${esc(warnedText)}${r.warned && r.missingKpi ? "; the KPI that loses its baseline: " + esc(KPI_LABEL[r.missingKpi]) : ""}.</p>${seqLine}

<h2>6 · The measure I postponed</h2>
${para(r.postponed)}
<p><strong>Picked up:</strong> ${esc(r.pickup) || "—"}</p>
<p class="legend">Left open by this allocation: ${open.map((o) => esc(o)).join(" ")}</p>

<div class="foot">Checks requested: ${r.checks}<br/>Generated ${esc(dateLabel())}.</div>`;
}

export function wrapDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
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
