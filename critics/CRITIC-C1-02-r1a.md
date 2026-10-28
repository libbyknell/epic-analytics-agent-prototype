# Blind critique C1-02 r1a (Slack, Salesforce app DM, Brightwater workspace)

Screenshot is 3360x1900 on disk (brief said 2912x1800). It shows a Salesforce app message with a Tableau work-object card. The Slackbot side panel the folder name implies is not shown.

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Window chrome (traffic lights, back/fwd/history, search bar, Slackbot icon, help) | 16-15-09, 17-10-15 | Same layout; "Search Brightwater" | ok |
| Workspace rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools, +, moon, photo avatar) | 17-10-15 | Same icon family and labels; a single teal "B" tile instead of app tiles | ok (org-variant) |
| Sidebar nav (Threads, Huddles, Recap, Drafts & sent, Saved, Directories) | 17-10-15 | Present; no "Unreads" row and no "Starred" empty-state text | ok |
| Starred / Channels / DMs / Apps sections | 16-15-09 | Same structure; "Ana Duarte, Le..." with red 8 badge (as in the plate's "8" group DM); Apps lists Salesforce/Google Drive/Tableau/Asana | ok |
| Active item highlight | REAL-INDEX | Light lavender rounded rect on Salesforce | ok |
| Channel header (star, SF cloud, "Salesforce", bell, kebab) | 16-15-09 | Matches; Messages / List views tabs with the correct icons | ok |
| Date divider "Today" and "New" line | channel-thread jpg | Pill plus crimson New line | ok |
| Hover toolbar (check, eyes, raised hands, emoji-add, reply, forward, bookmark, Slackbot, more) | 16-15-09 | Present and plausible | ok |
| Message header (SF avatar, bold name, APP tag, "Just now") | 16-15-09 | Matches | ok |
| Work-object card (Tableau icon tile, title, subtitle, pink chip, chart, legend, "Updated on" footer) | 16-15-09 | Same anatomy | ok |
| Chart end labels ($48M target, $46.4M, $43.7M) | 16-15-09 | Tight stacking, glyphs do not overlap; the plate is equally tight | WARN (minor) |
| Bullets, "1 reply" row | 16-15-09 | Matches | ok |
| Disabled composer banner | 16-15-09 | Same text and styling | ok |

## Other tells (most damning first)
1. Chart y-axis runs $0 to $50M. The forecast and outlook lines are squeezed into the top ~10% of the plot, so the 78% miss story is hard to read. The plate's axis started at $30M. This is a design choice, not a contradiction, so WARN only. Fix: start the axis near $25-30M, as the plate does.
2. Chart end labels sit very close. The $46.4M and $43.7M labels have about 0 px gap, and the Q3 target label is just above. The plate has the same crowding. Fix: add 2-3 px of vertical separation.
3. The sidebar has no Unreads row, no unread bolding other than the group DM, and no "Starred" empty state. Orgs vary, so this is not a tell.
4. The filename says "slack-panel" but no Slackbot panel is visible. This is a content mismatch only, not a tell.

## Content check
- The 78% likelihood is consistent between the chip and the body text.
- The range is $41.2M-$45.8M with a $48M target, so it is below target. The modeled outlook ends at $43.7M, inside the range. The submitted forecast of $46.4M is outside the range, which the plate also does.
- The "Today (Aug 18)" marker matches "Updated on Aug 18, 2026". The x positions are linear in days: Jul 1 to Aug 1 is 162 px, and Aug 1 to Aug 18 is 89 px, about 5.2 px per day.
- The legend (Actuals, Submitted forecast, Modeled outlook, Projected range, Q3 target) matches the marks and colors.
- Nothing is cut off and nothing overlaps. Fonts are Lato-like, consistent with the plates.
- "Three opportunities represent 37%" is a plain fact, not contradicted by anything else on screen.
- No presenter or demo UI is visible.

Overall this is indistinguishable at a glance from the plates. Only the chart axis choice and the tight end labels are minor nits.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
