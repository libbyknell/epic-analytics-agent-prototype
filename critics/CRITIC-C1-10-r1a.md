# Critic C1-10 r1a: Slack canvas + Slackbot panel

Plates used: 2026-10-14_17-18-33, 17-10-15, 17-18-50 (Slackbot panel + Files/canvas), channel-thread-full-desktop-view.jpg, and the kit shell reference. The screenshot file is 3360x1900, not the 2912x1800 stated in the brief.

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| macOS title/search bar | traffic lights, sidebar toggle, back/fwd/history, centered "Search <ws>", Slack icon at right, help "?" | matches; Slack icon and "?" present | ok |
| Far-left workspace rail | several org/app tiles with badges | single "B" teal tile and "+" (org-specific) | ok |
| Nav rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | same labels, Files highlighted as lavender tile | matches, bottom +/moon/avatar match | ok |
| Files sidebar | "Files" gear +, All files/Canvases/Lists, Recently viewed, lavender active row | matches; Drive icon on a recent item is plausible | ok |
| Canvas header | star, title, "Generated N days ago", Share, Dig Deeper, kebab | star, title, headset, Share, kebab (no generated stamp) | ok |
| Canvas body | bordered card, 02/HIGH pill, metric tiles, bullets, "Recommended actions" | card with blue title, KPI line, numbered lists, nested gray "flow" box with green CTA | WARN |
| Slackbot panel header/tabs | logo, "Slackbot", compose/search/kebab/X, Messages/History/Skills/Tasks/+ | matches icon family and layout | ok |
| Panel messages | name, "Oct 5th at 11:35 AM" stamp, tool-use lines, quote not seen | purple-bar italic blockquote, "you" chip, bold "Agent assigned" header with purple icon | WARN |
| Panel composer | formatting toolbar, "Ask anything", + Aa icons, mic, send | matches | ok |
| Bottom edge | scrolled content clipped at window edge | canvas "What to do next" clipped at window edge (scroll) | ok |

## Tells, most damning first
1. WARN: Purple left-bar italic blockquote (about x1523,y150-300 and again y710-860). Slack's quote bar is a neutral gray and it does not italicize. No real plate shows a purple-barred quote in the panel. Fix: gray bar, roman text. This is the likeliest giveaway to a daily user.
2. WARN: "you" chip beside "Maya Okonkwo". Plates show the sender name plus a stamp only (for example "DiscoverAgent Test6 - Matthew Sullivan Oct 5th at 11:35 AM"). Slack has no "you" badge. Also the stamps are bare "8:14 AM" while plates use "Oct 5th at ...". Fix: remove the chip, use the date-form stamp.
3. WARN: "Agent assigned" row with a purple icon, set as a bold heading under the Slackbot name. Plates show Slackbot responses as a plain "Used <tool>" line, then prose. Fix: use the "Used ..." tool-line style, or plain bold prose.
4. WARN: Canvas content is not the plate anatomy. Plates use a bordered card per insight with a numbered tag, severity pill and metric tiles. Here the layout is a link-colored title with inline KPI text, and a dark-green "Run Flow" button inside a gray box. Slack canvas has no such button, though embedded workflow blocks are conceivable. Body text is large relative to plate density. Fix: tile the KPIs and use the plate's pill and card styling.
5. Minor: no "Generated ... / AI accuracy" footer and no "Dig Deeper", which the plate canvas has. This is a different canvas type, so it is not a tell.

## Content check
The numbers agree: 47% probability, $1.1M upside, "Expected impact ... $1.1M", $5.2M deal. "Fri, Sep 4" is a real Friday in 2026. The "17 days remain" and "28 days" claims are plausible. Nothing overlaps, and the only cut-offs are scroll clips at the pane edges. Glyphs and fonts (Lato-like) match. There is no presenter UI. The brand colors match (aubergine rail, Slackbot mascot, blue links).

VERDICT: BUILT
SCORE: 6/10, HARD_TELLS: []
