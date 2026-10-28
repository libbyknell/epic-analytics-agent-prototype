# Blind critique C1-02 (r1b)

| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar, back/forward/history, search pill | 17-18-33 | Same layout, purple pill, "Search Brightwater" | ok |
| Workspace rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | 17-18-33 | Same icons and labels; one workspace tile "B", no app badges | ok (org varies) |
| Sidebar (aubergine, Threads/Huddles/Recap/Drafts/Saved/Directories, Starred, Channels, DMs, Apps) | 17-18-33, channel-thread-full | Matches order and icons; rounded-square avatars; red unread pill; active app row is a lavender highlight | ok |
| Channel header: star, Salesforce icon, Messages / List views tabs, bell, kebab | 17-18-33 | Matches | ok |
| Date divider "Today" + red "New" line | channel-thread-full | Matches real Slack | ok |
| Message: Salesforce APP chip, timestamp, hover toolbar (check, eyes, raised hands, emoji-add, reply, forward, save, app, kebab) | 17-18-33 | Matches; toolbar floats top-right | ok |
| Rich card (Tableau header, chart, "Updated on" footer) | slackbot-thread-pr-card anatomy | Rounded-rect, icon-square, bold title, gray subtitle | ok / WARN (chart is very large and fully styled) |
| Chart | no direct plate | Lato-like type, restrained semantic colors | WARN (see below) |
| Composer "Sending messages to this app has been turned off." | real Slack app-DM state | Matches | ok |
| Slackbot right panel | 17-18-33 shows one | Absent here | ok (not a tell) |

## Other tells (most damning first)
1. WARN: end-of-line labels. "$46.4M" and "$43.7M" sit about 12px apart and nearly touch, and the "Q3 target $48M" label sits tight above them. Nothing overlaps, but a native chart would normally nudge labels apart. Fix: add about 4px more vertical separation.
2. WARN: the chart is a complete static chart with a 5-item legend inside a Slack message. Real Slack work objects usually carry a smaller image or key:value rows. It is plausible as an image attachment. Fix: none required.
3. Nit: the active "Salesforce" row highlight is paler than the plate's lavender selection. Minor.
4. Nit: the "New" divider is shown alongside a single message. Fine.

## Content check
- The prose range ($41.2M to $45.8M) contains the modeled outlook end of $43.7M. The $46.4M submitted forecast is outside the range, which is plausible because it is a different series.
- The $48M target line sits correctly relative to the $50M gridline.
- 78% likelihood is consistent across the chip and the text.
- "Today (Aug 18)" matches the "Updated on Aug 18, 2026" footer.
- Legend matches the marks: solid black = Actuals, dashed black = Submitted forecast, blue = Modeled outlook, pale band = Projected range, red = Q3 target.
- No overlap, no clipped text, no garbled glyphs, and no presenter UI.

No hard tells found.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
