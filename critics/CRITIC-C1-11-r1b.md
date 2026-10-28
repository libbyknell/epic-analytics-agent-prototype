# Critic C1-11 r1b (blind)

| region | plate | screenshot | tier |
|---|---|---|---|
| macOS title bar, back/fwd/history, search pill, help | 17-18-33, 17-10-15 | matches (traffic lights, aubergine, search pill, Slack icon, ?) | ok |
| Workspace rail (avatars, Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | plates | matches structure; rail has only one workspace "B" tile vs several app tiles in plates | ok |
| Sidebar (Threads..Directories, Starred, Channels, DMs, Apps; lavender active row) | plates | matches; photo avatars, badge "8" | ok |
| Channel header + tabs (Messages / List views) | plates | matches | ok |
| App message (Salesforce APP, Just now) | plates | matches; heading/bullets in plain text | ok |
| Inline Tableau chart card | no plate shows a chart inside the message (plates are text-only + Manage Alerts button) | card with title/icon/chart/footer | WARN |
| Chart labels | n/a | "Q3 target $48M" overprints "$46.4M" at right end | HARD |
| Bottom of message list | plates: text clipped by scroll behind composer banner | "The pattern remains..." clipped under the disabled-composer banner | ok (scroll clip) |
| Slackbot panel header, tabs, icons | plates | matches (Messages/History/Skills/Tasks/+) | ok |
| Panel thread (user msg, 1 reply divider, AGENT chip, Used chip, Used 2 tools) | plates | matches closely | ok |
| Panel composer, feedback icons | plates | matches | ok |

## Tells (most damning first)
1. Chart end labels collide: "Q3 target $48M" (red) sits on top of "$46.4M" at about x=1050-1150,y=553-566 (display coords). Real chart renderers avoid this. Fix: offset the target label above the line / left-align it, or move value labels down.
2. An interactive-looking Tableau chart card embedded in a Slack app message has no precedent in the real plates (they show text plus "Manage Alerts"). Plausible as a work object (slackbot-thread-pr-card), but it is the least verified element. Fix: match the work-object card anatomy; keep the chart small.
3. Panel conversation is oddly clean versus plates (no "Used 2 tools" expansion artifacts; text identical in tone). Minor.
4. Date coherence: message says "Just now" and chart "Today (Aug 18)" while the panel message is 8:50 AM; fine.

## Content check
Numbers: 78% likelihood, $41.2M-$45.8M range contains modeled $43.7M; submitted $46.4M is outside the range (above $45.8M) which is a mild inconsistency but defensible. 37% / $10.7M of $28.9M = 37%, ok. $5.2M/28.9M = 18%, ok. Legend matches marks (Actuals solid black, forecast dashed, modeled blue, range band, target red). Only the label overlap breaks layout.

VERDICT: BUILT
SCORE: 6/10, HARD_TELLS: [chart label "Q3 target $48M" overlaps "$46.4M"]
