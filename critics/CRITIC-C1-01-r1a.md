# Critic C1-01 r1a (blind, Slack DM view)

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar (traffic lights, back/fwd/history, search "Search Brightwater", Slackbot icon right, help) | 17-10-15 / 16-14-59 | Same layout, same lavender search pill | ok |
| Workspace rail (Today, Home, DMs, Activity, Files, To-dos, Agents & tools, +, moon, avatar w/ presence) | 17-10-15 | Matches item set, order and icon family; no unread dots | ok |
| Sidebar top list (Threads, Huddles, Recap, Drafts & sent, Saved, Directories) | 17-10-15 | Matches | ok |
| Sidebar sections (Starred, Channels, DMs, Apps) | 16-14-59 / 17-10-15 | Section headers are same size/weight as items, no collapse carets | WARN |
| Active DM row | 16-14-59 | Light lavender rounded-rect, matches | ok |
| Unread badges / bold group DM | 16-14-59 | Magenta pills, bold row, matches | ok |
| DM header (star, avatar, name, headphones, kebab) | 16-14-59 | Matches; fewer right-side icons (no bell/search/people) | WARN (minor) |
| Tabs (Messages / Files) | 17-10-15 | Present, authentic style | ok |
| Message list (names, timestamps, date pills "Wednesday, August 12th") | 16-14-59 | Matches; weekday/date is correct for 2026 | ok |
| Own-message "you" tag | 16-14-59 | Maya (self, per bottom-left avatar) has no "you" badge | WARN |
| File card | 16-14-59 | Plate: blue DOC tile + name + "215 KB · Google Docs", narrow card. Screenshot: Drive logo, bordered wide card, larger title | WARN |
| Empty area below messages, no DM intro header | channel plate | Large blank pane with no "beginning of conversation" intro | WARN (minor) |
| Composer (formatting toolbar, placeholder, + Aa emoji @ mic, send+caret) | 16-14-59 | Matches; no video icon, acceptable | ok |
| Window edge / bottom purple sliver | plates | Plausible | ok |

## Other tells (most damning first)
1. File attachment card (x~490-1020, y~390-465 at 2000w). Real plate 16-14-59 shows a blue "DOC" square tile, bold small filename, gray "215 KB · Google Docs", in a compact card. Fix: copy that anatomy and width.
2. Missing "you" badge beside the viewer's own name (Maya Okonkwo). Plate 16-14-59 shows a small gray "you" chip. Fix: add it.
3. Sidebar section headers (Starred, Channels, Direct messages, Apps) render at item size with leading icons; plates show them smaller/muted. Fix: reduce size, add muted weight.
4. Short DM with a big blank pane and no conversation intro. Real Slack tops a DM with an intro block when scrolled to start. Fix: add intro or fill messages.

## Content check
Weekdays match dates (Aug 12/13, 2026). Unread counts consistent (8 badge on 8-person group, 1 on Salesforce). No overlap, no clipping, no garbled glyphs, no presenter UI. Fonts are Lato-like, correct.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
