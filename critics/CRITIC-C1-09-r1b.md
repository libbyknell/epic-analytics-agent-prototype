# Blind critique C1-09 (r1b)

| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar / search | traffic lights, sidebar toggle, back/fwd/history, centered purple search, Slackbot icon, help | same set, "Search Brightwater" | ok |
| Left rail | Today/Home/DMs/Activity/Files/To-dos/Agents & tools, + button, moon, avatar (17-18-50) | matches order and labels; single workspace tile "B" instead of multi-app tiles | ok (org variance) |
| Files list pane | All files/Canvases/Lists, Recently viewed, active lavender row, Deleted + Starred | All files/Canvases/Lists, Recently viewed with 2 items; no Deleted/Starred | WARN (minor, sparse) |
| Canvas header | star, title, Generated N ago, Share, Dig Deeper, kebab | star, title, headphone, Share, kebab | ok |
| Canvas body | white page, rounded cards, bold headings, numbered lists | same card anatomy; green "Run Flow" CTA button inside canvas | WARN (canvases rarely hold a native button) |
| Slackbot panel header/tabs | Slackbot + compose/search/kebab/close; Messages/History/Skills/Tasks/+ | identical | ok |
| Slackbot message | avatar, name, time, body, checks | matches; no "Used ..." tool-trace lines or user prompt shown | ok |
| Callouts in message | plain text, gray quote | green tinted "Expected impact" banner, purple-left-bar blockquote | WARN (Slack quote bar is gray; tinted banner not seen in plates) |
| Panel bottom | message list scrolls under composer | text "how often the agent should check the data - daily or" sliced by composer top | WARN (scroll clip, authentic-looking) |
| Composer | Slackbot composer with feedback row in plates | formatting toolbar, "Ask anything", +/Aa/mic/send | ok |

## Other tells (most damning first)
1. Purple left-border blockquote at ~(1520,760-910): real Slack quote bar is gray. Fix: use #DDDDDD bar.
2. Tinted green "Expected impact" strip in the bot message: not in any plate; make it bold plain text or a standard attachment.
3. Green "Run Flow for NorthStar" button inside a canvas card: canvases do not host native action buttons; acceptable only if framed as a work object.
4. Files pane lacks Deleted/Starred sections seen in plate 17-18-50.

## Content check
Numbers consistent: $1.1M upside repeated in card, flow impact, and bot banner; 5 risk items; 6-step flow vs 5 checks in bot (flow adds notify step, plausible as results list differs). No overlaps. Glyphs and fonts clean (Lato-like). No presenter UI.

VERDICT: REAL
SCORE: 7/10, HARD_TELLS: []
