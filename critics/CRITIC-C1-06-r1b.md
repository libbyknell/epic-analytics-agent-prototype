# CRITIC C1-06 r1b (blind)

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar / search / traffic lights / help | 17-18-50, 16-17-22 | aubergine, back/fwd/history, centered search, Slackbot icon right, ? at far right | ok |
| Workspace rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | 17-18-50 (Today..Agents & tools) | matches labels and icon family, B tile, moon, avatar | ok |
| Sidebar (Threads/Huddles/Recap/..., Starred, Channels, DMs, Apps; lavender active row) | channel-thread plate, index | matches; active row lavender rounded-rect; square-rounded avatars | ok |
| Channel header (star, app logo, Salesforce, bell, kebab; Messages / List views tabs) | channel-thread plate | plausible for app DM page | ok |
| Message body (APP badge, bold prose, Tableau chart card, bullets) | channel-thread plate | anatomy right; "Sending messages ... turned off" footer is genuine app-DM behavior | ok |
| Chart card | 17-18-50 report cards | white card, icon square, title/subtitle, legend, footer "Updated on" | ok (WARN: end labels $46.4M / $43.7M / Q3 target stack tightly) |
| Slackbot panel header/tabs (Messages, History, Skills, Tasks, +) | 17-18-50, 16-17-22 | matches; round-top Messages icon, mascot | ok |
| Panel stat card (22% -> 66%) | 16-17-22 | matches plate exactly (red/green, gray card) | ok |
| Green CTA, thumbs row, AGENT chips, "Used" chip, canvas card, "Saved to your Files." | 16-17-22 | match | ok |
| Panel composer (formatting toolbar, "Ask anything") | none exact | plausible | ok |
| Panel top scroll clip | 16-17-22 | line cut under tab row, no ellipsis | WARN (scrolled-content clip, authentic scroll behavior) |

## Other tells (most damning first)
1. Top of Slackbot panel: "Recovering at least $2.4M ..." is sliced horizontally under the tab underline. Real plate 16-17-22 clips the same way at scroll, so only a WARN. Fix: rest scroll on a message boundary.
2. Main pane bottom: bullet "The pattern remains after accounting..." sliced by the disabled-composer banner. Authentic scroll behavior; fix by resting on a bullet boundary.
3. Chart end labels crowd (Q3 target $48M, $46.4M, $43.7M); tight but not overlapping.
4. Reply says Slackbot "Used Pipeline Outlook Analysis" immediately before "message or canvas?" - matches plate flow.

## Content check
- 22% today vs 78% miss likelihood: consistent (sum 100).
- Projected 41.2M-45.8M vs modeled 43.7M: inside range; submitted forecast 46.4M above range but plausible as a rep submission.
- Line ends near $46M/$44M against $50M axis and $48M target: consistent. "Today (Aug 18)" matches "Updated on Aug 18, 2026".
- Legend entries (Actuals solid black, Submitted dashed, Modeled blue, range band, target red) match marks.
- No overlaps of text over content, no presenter UI, no garbled glyphs.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
