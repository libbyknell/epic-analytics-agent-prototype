export const meta = {
  name: 'critics-r3-calibrated',
  description: 'Blind real-or-built critics (2 per screen), with a neutral prior and plates as ground truth',
  phases: [{ title: 'Critics' }],
}
// args: [{ slug, round, shot, outDir, shellRef, plates: [abs paths], sections }]
const K = '/Users/jdemby/.claude/skills/keynote-prototype/assets/fidelity'
const PERSONAS = {
  a: 'a customer-side power user who has used this exact Salesforce product daily for 3 years',
  b: 'a senior UX engineer who pixel-diffs UI for a living',
}
const jobs = []
for (const p of args) for (const s of ['a', 'b']) jobs.push({ ...p, s })
const res = await parallel(jobs.map(j => () => agent(
`You are ${PERSONAS[j.s]}. You are a BLIND critic. You did not make this screenshot, and you don't know whether it is a genuine product capture or a hand-built HTML prototype. Judge it on the evidence; don't assume either answer.

Screenshot (2912x1800 canvas): ${j.shot}
Real plates (GROUND TRUTH, genuine product captures): ${j.plates.join(', ')}
Kit shell reference (a hand-built rendering, NOT ground truth): ${j.shellRef}
Surface checklist: the ${j.sections} section(s) of ${K}/plates/REAL-INDEX.md. Read only that section, plus the files above. Don't read any other files on disk.

Calibration rules (binding):
- The real plates outrank the shell reference. A difference from the shell reference is only a tell if the real plates agree with the shell reference on that point. Different page types legitimately carry different chrome. For example, some app pages have no global search row, and nav tabs and avatars vary by org.
- Not tells: canvas padding or letterbox bars around the screen; softness, blur or JPEG artifacts from resampling; marketing frames; fictional company or person names; whether the content fits any story; ordinary real-product quirks such as an ellipsis truncation, a clipped legend at a breakpoint, odd demo-org data, or empty states.
- HARD tells are limited to:
  - something that contradicts the real plates (wrong brand color, invented chrome, wrong wordmark, wrong icon family)
  - broken layout: overlapping text, a sentence cut off mid-phrase with no ellipsis, an element covering content
  - garbled glyphs or wrong-genre fonts
  - data that contradicts itself (a mark vs. its label, a sparkline direction vs. its delta, a total vs. its parts)
  - presenter or demo UI inside the product
- Score anchors for "Would a customer believe this is a live product screenshot?":
  - 9–10: indistinguishable from the real plates
  - 7–8: believable, with only minor nits
  - 4–6: one or more clear tells
  - 1–3: obviously built or broken

Steps:
1. Compare it region by region with the best-matching real plate(s). Make a table with columns: region | plate | screenshot | tier (ok/WARN/HARD).
2. List the other tells, most damning first. For each, give its location, what the real product does (cite the plate), and a fix.
3. Check the content: the numbers are consistent, legends match the marks, and nothing overlaps or is cut off.
4. Use the Read tool to view images. You may run python3 with PIL through Bash to crop, zoom or sample pixels as evidence. Don't modify any files except the output file.

Write the critique to ${j.outDir}/CRITIC-${j.slug}-${j.round}${j.s}.md. The second-to-last line must be exactly "VERDICT: REAL" or "VERDICT: BUILT" (your best guess; nothing else on that line). The LAST line must be exactly: SCORE: N/10, HARD_TELLS: [comma-separated short descriptions, or empty]
Return those last two lines as your final answer.`,
  { label: `${j.slug}-${j.round}${j.s}`, phase: 'Critics', agentType: 'general-purpose' })))
return jobs.map((j, i) => `${j.slug}-${j.round}${j.s}: ${res[i]}`)
