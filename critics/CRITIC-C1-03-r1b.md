# CRITIC C1-03 r1b (blind)

| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar / search | purple bar, back/fwd/history, "Search <org>", help | same, "Search Brightwater" | ok |
| Workspace rail | Today/Home/DMs/Activity/Files/Agents&tools, + button, moon, avatar | same set, active B tile | ok |
| Sidebar | Threads/Huddles/Recap/Drafts/Directories, Starred, Channels, DMs, Apps, active Salesforce lavender | same, plus Saved, Agents (newer variants) | ok |
| Channel header | star, Salesforce title, tabs Messages/List views | adds bell + kebab, tab icons | ok/WARN (extra icons not in plate) |
| Message + Tableau card | Salesforce APP, "Something I found for you", card with chip, chart, legend, Updated | same anatomy | ok |
| Chart | line chart, target, dashed forecast, band | consistent: $48M line sits at correct y between ticks; 46.4M/43.7M within 41.2-45.8 range text | ok; WARN end labels crowd the dots |
| Thread pane | scrolled to latest, "1 reply" divider, Why did I receive this? | same, divider visible | ok |
| Composer | "Sending messages to this app has been turned off." | same | ok |

## Tells (most damning first)
1. Parent message bullets are clipped under the composer mid-line ("The pattern remains..." half visible) - normal scroll clipping in Slack, WARN at most.
2. Chart end labels "$46.4M"/"$43.7M" nearly touch and overlap the dashed line near the markers. Minor; plate also tight. Fix: nudge labels.
3. No hover toolbar / reply footer visible under parent (plate shows "1 reply" link under parent). Likely below the fold; add if space allows.
4. Date divider "Today / New" not in plate but is genuine Slack anatomy.

Content: numbers consistent (78% likelihood, range 41.2-45.8 below 48 target, 37% stat repeated identically in parent and thread). No overlap or garbled glyphs. Fonts and aubergine match plates.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
