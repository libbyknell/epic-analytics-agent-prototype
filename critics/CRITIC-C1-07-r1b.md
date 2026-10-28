# CRITIC C1-07 r1b (blind)

| region | plate | screenshot | tier |
|---|---|---|---|
| Window chrome / traffic lights / nav arrows / history / search bar | 17-10-15, 17-18-50: aubergine bar, centered search pill, Slackbot icon right, help icon | matches | ok |
| Workspace rail (far left) | plates show stacked app/workspace icons with badges | single teal "B" tile + plus | WARN (sparse, plausible for single-workspace org) |
| Left rail nav (Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | same labels/icons/order, Files active lavender | matches | ok |
| Files sidebar (All files, Canvases, Lists, Recently viewed) | 17-18-50 Files view with All files/Canvases/Lists, active row lavender | matches; Canvases/Lists icons equal; Google Drive row icon fine | ok |
| Canvas header (star, title, Share, kebab) | plate has star, title, Share, Dig Deeper, kebab | has headphone icon and Share; fine | ok |
| Canvas body | plate: cards with KPI tiles, bullets, high badges | clean doc, colored text, deal card; bottom clipped mid-line at pane edge (scroll clip) | ok / minor WARN |
| Slackbot panel header/tabs (Messages, History, Skills, Tasks, +) | identical tab set and icons | matches | ok |
| Messages (square avatars, AGENT chip, "Used" pill with sparkle, Just now) | same anatomy | matches | ok |
| Work-object card (Canvas, Saved to your Files) | plate report card: icon square, bold title, gray subtitle | matches | ok |
| Feedback icons, composer toolbar, Ask anything, mic/send | identical | matches | ok |

## Other tells (most damning first)
1. Panel top: text "Recovering at least $2.4M..." is sliced by the tab underline with no fade. Real Slack scroll clips the same way (plate 17-18-50 shows content tight under tabs), so WARN only. Fix: none needed, or rest scroll on a message boundary.
2. Rail shows only one workspace tile; plates show several app icons with badges. Add a couple of app icons for density. Minor.
3. Inline KPI "22% -> 66%" card is custom but plausible as a Slackbot rich block; gray rounded card with colored numbers, no overlap.
4. Timestamps all "Just now" including the earlier Slackbot turn; plates use absolute times, but just-generated is believable.

## Content check
Numbers consistent: 22% red (today) -> 66% green (with changes), matches canvas text (22%, 66%, $43.7M vs $48M, $48.6M). Deal card $5.2M, 47%, $1.1M fine. No overlaps, no garbled glyphs, fonts Lato-like as in plates. No presenter UI.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
