// Re-derives the Task 2 figures from the briefed inputs and compares them with the pinned results (±€5).
// Run with: npm run verify:calc
const price = 60000, margin = 0.32, gp = price * margin;
const seg = { P: { clients: 14, baseline: 1 }, R: { clients: 24, baseline: 4 } };
const opt = {
  A: { cost: 1500, uplift: { P: 6, R: 12 } },
  B: { disc: 0.08, uplift: { P: 8, R: 3 } },
  C: { cost: 1100, uplift: { P: 7, R: 9 } },
};
const expected = { "A-P": -4872, "C-P": 3416, "B-P": 11328, "A-R": 19296, "C-R": 15072, "B-R": -8832 };
const expectedUniform = { A: 14424, C: 18488, B: 2496 };
const net = (o, s) => {
  const extra = (seg[s].clients * opt[o].uplift[s]) / 100;
  const cost = opt[o].disc !== undefined ? (seg[s].baseline + extra) * price * opt[o].disc : seg[s].clients * opt[o].cost;
  return extra * gp - cost;
};
let bad = 0;
for (const [k, v] of Object.entries(expected)) {
  const got = net(k[0], k[2]);
  const ok = Math.abs(got - v) <= 5;
  if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"} ${k}  got ${got.toFixed(2)}  expected ${v}`);
}
for (const [o, v] of Object.entries(expectedUniform)) {
  const got = net(o, "P") + net(o, "R");
  const ok = Math.abs(got - v) <= 5;
  if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"} all-${o} got ${got.toFixed(2)}  expected ${v}`);
}
process.exit(bad ? 1 : 0);
