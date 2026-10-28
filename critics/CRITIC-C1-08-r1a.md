# CRITIC C1-08 r1a (blind)

| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar / traffic lights / nav arrows / history / search | plates show same macOS bar, centered search pill, Slackbot icon right, help | matches ("Search Brightwater") | ok |
| Workspace rail (far left) | plates: stacked workspace tiles + "+" | single "B" teal tile w/ white ring, "+" | ok |
| Left nav (Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | same labels, order, lavender active tile on Files | matches | ok |
| Files sidebar | All files/Canvases/Lists, Recently viewed, lavender active row, truncated titles | matches, ellipsis on "Pipeline Outlook Anal..." | ok |
| Aubergine color / bottom + , moon, avatar w/ presence dot | matches | matches | ok |
| Canvas header | star, title, Share; plate has "Edited" meta and info icon | star, title, headset, Share, kebab | ok (WARN-level variance only) |
| Canvas body (deal cards, risk list, flow box, green CTA) | same anatomy as 16-18 plate, green button, teal metric | matches closely | ok |
| Slackbot pane header/tabs | Slackbot mascot, compose/search/kebab/X, Messages/History/Skills/Tasks/+ | matches exactly | ok |
| Pane scroll top edge | plates scroll cleanly under tab bar | one text line half-clipped under tab divider ("Recovering at least $2.1M...") | WARN |
| Messages / AGENT chip / "Used" tool chip / feedback icons | match plates (AGENT chip, Used chip, share/thumbs) | match | ok |
| Composer | plates: B I U S link lists code, "Ask anything", + Aa icons mic send | matches | ok |
| Stat card 22% -> 66% | no direct plate | clean, red vs green | ok |

## Other tells
1. Pane top clip (WARN): cut line is a normal scroll clip, but the card above it is cropped very tight against the tab rule; real plates show more breathing room. Fix: rest scroll on a message boundary.
2. Left rail has no Slackbot/app tile or badges (plates show badges and several workspace tiles); org-dependent, not a tell.
3. Sidebar avatar at bottom larger than plate; trivial.
4. Everything is crisp and pixel-uniform (2x retina style), no cursor or screen-share artifacts; plates are video grabs, so this is expected, not a tell.

## Content check
- NorthStar: 47% close prob, upside $1.1M, expected impact $1.1M: consistent. 17 days remaining vs 30 days needed: consistent with risk framing. Sep 4 date vs "Just now": harmless demo data.
- Acme upside $800K; "$2.1M" in clipped text vs 1.1M+0.8M=1.9M: text is clipped, "at least $2.1M from high-potential Best Case" is a broader set, not a contradiction.
- No overlap or mid-phrase cuts other than the scroll clip.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
