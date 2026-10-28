# CRITIC C1-11 r2a (blind customer-side review)

Compared against plates 17-10-15, 17-18-33 (Slackbot side panel over Salesforce app DM) and channel-thread-full-desktop-view.

| region | plate | screenshot | tier |
|---|---|---|---|
| macOS traffic lights, back/fwd/history, purple search bar, help icon | present, same layout | matches, Slack logo chip right of search | ok |
| Workspace rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools, +, moon, avatar) | present, multiple app icons in plate | single "B" tile + Home pill; icon family matches | ok |
| Sidebar (Threads..Directories, Starred, Channels, DMs, Apps; lavender active row) | aubergine, lighter active highlight | matches; Salesforce row highlighted lavender; unread badge "8" | ok |
| Channel header (star, Salesforce logo, bell, kebab) + Messages / List views tabs | same | same | ok |
| Message: Salesforce APP, rounded-square avatar, bold title, bullets | same anatomy | same; "Today / New" divider is real-Slack | ok |
| Chart card in message (Tableau icon-in-square, title, subtitle, footer) | plates show text-only insight; PR-card anatomy is white rounded rect, icon square, title, subtitle | follows work-object anatomy | ok |
| Bottom clipped bullet under "Sending messages to this app has been turned off" banner | same banner overlays content | same behavior | ok |
| Slackbot panel header (mascot, compose, search, kebab, X) + Messages/History/Skills/Tasks/+ | same | same | ok |
| Thread: parent, "1 reply" divider, Slackbot AGENT reply, "Used <skill chip>", "Used 2 tools", action row, composer "Ask anything" | same | same, parent visible with divider | ok |
| Chart internals (axes, legend, labels) | n/a | consistent Lato-like type, legend matches marks | ok |

## Other tells (most damning first)
1. WARN, chart card: the Q3 target label sits right on the top of the red line/$50M gridline area and the endpoint labels ($46.4M / $43.7M) hug the right edge. Slightly tight but no overlap. Fix: nudge label 4px up.
2. WARN, thread parent text: "Based on Salesforce, This was helpful" has a capital T after the comma. Real user typing could do this; plate has "Salesforce, this is helpful". Fix: lowercase "this" if it is not intentional.
3. WARN, sidebar: Starred channels and Channels lists fully populated with no "Drag and drop" empty state; plausible for a different org, not a tell.
4. WARN, rail shows only one workspace tile while the plates show a stack of app tiles; org-dependent.
5. Charts embedded in a Slack message body are unusual for the app-message anatomy, but it matches the work-object card pattern, so only a nit.

## Content check
- Aug 18 "Today" marker sits at the correct fraction between the Aug and Sep ticks; series end at end of Sep.
- 37% of $28.9M = $10.7M (ok); NorthStar $5.2M = 18% of $28.9M (ok).
- Forecast $46.4M and modeled $43.7M both under the $48M target, consistent with "below target"; the $41.2M to $45.8M range contains the modeled outlook; the chart's $43.7M is inside it.
- Legend (Actuals solid black, Submitted dashed black, Modeled blue, Projected range light fill, Q3 target red) matches the marks.
- Timestamps 8:05 / 8:50 consistent; no overlapping or mid-phrase cut-offs (the only clip is under the real-style banner).

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
