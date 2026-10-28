# Blind critic: C1-13 Slack Salesforce channel + Slackbot panel (r1a)

## 1. Region comparison
| region | plate | screenshot | tier |
|---|---|---|---|
| macOS title bar, back/fwd/history, search "Search Brightwater", Slackbot icon, help | 17-10-15, 17-18-33 | Same layout and controls, aubergine bar | ok |
| Workspace rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools, + , moon, avatar) | 17-18-33 | Same items and order. Single workspace tile "B" with a ring instead of the multi-app stack (org-dependent) | ok |
| Sidebar (Threads..Directories, Starred, Channels, DMs, Apps) | 17-10-15, channel-thread-full | Aubergine, lavender active row, photo DM avatars, "8" group chip with pink badge, app icons. Matches | ok |
| Channel header (star, SF logo, "Salesforce", bell, kebab) | 17-18-33 | Bell sits in a bordered box. Plates show an unbordered bell. The kit shell shows bordered, so the plates are not decisive | WARN (minor) |
| Tabs (Messages / List views) | 17-10-15 | Identical | ok |
| Message list (Salesforce APP, timestamp, bold headline, warning-sign "High-severity insight", Generated UTC, bullets, "Autonomous insights found this for you", Slackbot inline icon, Manage Alerts, "1 reply", disabled-composer bar) | 17-18-33 / 17-10-15 | Same anatomy, typography and copy pattern | ok |
| Today / New divider | 17-18-33 | Pill with chevron and a red "New" line, as in the plates | ok |
| Embedded chart card legend, scrolled under the tab bar | n/a | Legend and "Updated on Aug 18, 2026" footer are visible and the top of the chart is scrolled off. This is natural scroll clipping | ok/WARN |
| Slackbot panel header (mascot, title, compose, search, kebab, X) and tabs (Messages/History/Skills/Tasks/+) | 17-18-33, 17-18-50 | Matches | ok |
| Slackbot panel body (reasoning text, "Used ... from Tableau Next" tool lines, "Created report", blue link, bold stats, "Brightwater, Maya Okonkwo · Report", report card, share/thumbs) | 17-18-33 | Same structure. The top tool-pill line "Used Sales Data Intelligence - Autonomous Insights" is sliced in half by the tab-row boundary | WARN |
| Panel composer (format toolbar, "Ask anything", + Aa, mic, send) | 17-10-15 | Matches | ok |

## 2. Other tells, most damning first
1. Slackbot panel top: the "Used Sales Data Intelligence - Autonomous Insights" pill row is cut through its middle by the tab separator. The text is half-visible, with no fade or ellipsis. The plates (12, 13) show real scroll clipping beneath the tab row, so this is probably authentic scroll behaviour. Fix: rest the scroll so the pane begins on a full line.
2. Bell button in the channel header has a bordered square. The plates show it unbordered. Plate evidence is weak because the kit shell shows the border. Fix: match the plate if it is a simple change.
3. Data nit: "Priya Raman owns NorthStar and two other late-stage deals ($9.3M combined)" sits next to "$5.2M NorthStar" and a $10.7M three-deal total. It reads as consistent only if Priya's deals differ from the 3 deals in the first bullet. A sharp reader may stumble, but it is not a clear contradiction.
4. Chart card in the channel is scrolled so the legend is the only part visible. It looks natural.

## 3. Content check
- 10.7 / 28.9 = 37%. OK.
- 5.2 / 28.9 = 18%. OK.
- 43.7 - 2.4 = 41.3. OK.
- Fri Aug 21, 2026 is a Friday. OK.
- Panel text ($48M target, 29 days, 37%) matches the channel message.
- Generated Aug 19 13:00 UTC matches the 8:00 AM post. The chart footer says "Updated Aug 18", which is plausible for an older message.
- No overlaps. The only cut-off text is scroll clipping.

I see no wrong brand color, invented chrome, glyph garbling, or presenter UI. The overall impression is a believable live Slack capture.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
