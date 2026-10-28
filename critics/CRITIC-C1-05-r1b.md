# Critic C1-05 r1b (blind)

Read from the downscaled view only (2000px wide display of the 3360x1900 file). No crops or pixel sampling.

| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar, back/forward/history, search "Search Brightwater", help icon | 17-10-15, 17-18-50 | Matches: aubergine bar, centered lighter search pill, bot icon, ? at right | ok |
| Left rail (Today, Home, DMs, Activity, Files, To-dos, Agents & tools, +, moon, avatar) | 17-10-15 | Same order and icons. Only a "B" workspace tile, with no app dock icons. This varies by org. | ok |
| Sidebar (Threads, Huddles, Recap, Drafts & sent, Saved, Directories, Starred, Channels, DMs, Apps) | 17-10-15, channel-thread plate | Aubergine with lavender selected row. Sections are plausible. Group DM has a red unread badge "8". | ok |
| Channel header (star, Salesforce logo, bell, kebab; Messages / List views tabs) | 17-10-15 | Matches. Tab and header sizes are slightly larger than the plate, which is a scale difference only. | ok |
| Today / New divider | channel plate | Red "New" line with Today pill. Plausible. | ok |
| App message "Salesforce APP Just now" with bold headline and embedded Tableau card | 17-10-15 | Same anatomy: logo avatar, APP chip, bold heading. Tableau card follows the work-object anatomy (icon square, title, gray subtitle, footer "Updated on..."). | ok |
| Chart in card | n/a (no plate chart) | End labels "$48M / $46.4M / $43.7M" are stacked tightly on the right edge. Legend is wrapped to two rows. Series are drawn consistently. | WARN |
| Disabled composer banner "Sending messages to this app has been turned off." | 17-10-15 | Matches. Text is clipped under the banner, as in the plate, with a partial line visible. | ok |
| Slackbot panel header, tabs (Messages, History, Skills, Tasks, +), icons | 17-10-15, 17-18-50 | Matches, including the mascot logo, compose, search, kebab and close. | ok |
| Panel thread (user message, "1 reply", Slackbot AGENT chip, Used chip) | 17-10-15 | Same structure. The user avatar is a photo; the plates use a green default avatar, which varies by user. | ok |
| Metric card (22% -> 66%) and green CTA "Run ... Skill" | none | Custom card. The CTA is a solid green Slack-style button. No plate counterpart. | WARN |
| Feedback icons (share, thumbs) and composer ("Ask anything", toolbar, Aa, mic, send) | 17-10-15 | Matches. | ok |

## Other tells, most damning first
1. Chart end labels crowd the right edge (about x=1050-1150, y=550-585 in the displayed image). "Q3 target $48M", "$46.4M" and "$43.7M" nearly touch, and the marker circles sit on the text. This is not a true overlap, but it is the busiest part of the image and reads as hand-placed. Fix: give the right margin more room and stagger the labels.
2. The chart is a very clean, designed visual. Real Tableau/Slack unfurls normally show a screenshot-like image with a rendered Tableau toolbar or mark labels. The plates contain no comparable embedded chart, so this is unverifiable. It is a WARN, not a tell.
3. The "Today (Aug 18)" marker and the "Updated on Aug 18, 2026" footer sit beside "Just now" timestamps. The 2026 dates are consistent with each other, but "Aug 18" differs from the October plate dates. This is story content and not a tell.
4. The message-body and panel text are crisp at the same scale. The panel's "22% -> 66%" card uses red and green numerals, a Tableau-style language inside Slack. The plates do not show this, so it is a mild WARN.

## Content check
- Numbers are consistent: the 41.2M-45.8M range brackets the modeled outlook of 43.7M, and the submitted forecast of 46.4M sits just under the 48M target.
- The 78% likelihood matches the callout in the chart.
- The "Three opportunities represent 37%" and similar bullets are not contradicted by anything.
- The legend (Actuals, Submitted forecast, Modeled outlook, Projected range, Q3 target) matches the marks.
- Nothing overlaps. The truncated final bullet is hidden behind the disabled-composer banner, as in the plate.

Overall the screenshot is indistinguishable from the real chrome at a glance. It carries a few WARN items and no HARD tells.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
