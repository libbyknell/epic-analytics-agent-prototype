# Blind critic C1-07 r1a (Slack canvas + Slackbot panel)

Note: actual PNG is 3360x1900 (brief said 2912x1800); not a tell.

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar (traffic lights, nav, search "Search Brightwater", Slackbot icon, help) | 17-18-50 / 17-10-15 | same layout, aubergine, centered search pill | ok |
| Left rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools, + , moon, avatar) | 17-18-50 | matches icon family/order; workspace tile "B" instead of app icons (org-variable) | ok |
| Files sidebar (All files/Canvases/Lists, Recently viewed, lavender active row) | 17-18-50 | matches, gear + plus, truncation with ellipsis | ok |
| Canvas header (star, title, Share, kebab) | 16-18-07 / 17-18-50 | headphones icon button present, no info (i) icon, no "Edited/Generated ... ago" text | WARN (minor) |
| Canvas body (title, colored sentences, blue entity links, deal card, flow box) | 16-18-07 | same anatomy, red/green/blue semantics; lacks the small "Generated canvas" breadcrumb line | ok |
| Slackbot panel header + tabs (Messages/History/Skills/Tasks/+) | 17-18-50 | identical | ok |
| KPI box 22% -> 66% | 16-18-07 | same anatomy, red/green | ok |
| Green CTA "Run Pipeline Outlook Analysis Skill" | 16-18-07 | match | ok |
| Message rows, AGENT chip, "Used" chip, canvas file card, "Saved to your Files." | 16-18-07 | match | ok |
| Message timestamps | plates show clock times ("11:45 AM", "Oct 5th at 12:22 PM") | every row says "Just now" | WARN |
| Composer (format toolbar, Ask anything, + Aa etc., mic, send) | 17-10-15 | match | ok |
| Panel top scroll clip under tab bar | 17-10-15 / 17-18-50 | text clipped by tab divider while scrolled | ok (authentic scroll) |

## Other tells (most damning first)
1. Panel timestamps all read "Just now" next to the sender names. Real Slack shows clock times (16-18-07 "11:45 AM", 17-10-15 "Oct 5th at 12:22 PM"). Fix: use "11:45 AM" style stamps. WARN only; "just now" is plausible for a fresh thread.
2. Canvas header lacks the info (i) icon and "Edited just now" label seen in 16-18-07, and adds a headphones/huddle button that real canvas headers do not show there. Fix: replace with info icon + edited label.
3. Canvas missing the small "Generated canvas - ..." breadcrumb line above the H1 (16-18-07). Minor.
4. Bottom of canvas clips "3. Request an executive review meeting" at the pane edge; this is a normal scroll clip, not a tell.

## Content check
- 22% today -> 66% with changes matches canvas text (22% likelihood, 66% raised). $43.7M below $48M target; $48.6M after interventions is above target, consistent. "at least $2.4M" in the clipped panel text matches canvas bullet. Fri, Sep 4 is a real Friday in 2026. Deal risk list (5 items) coherent. No overlaps, no garbled glyphs, no presenter UI.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
