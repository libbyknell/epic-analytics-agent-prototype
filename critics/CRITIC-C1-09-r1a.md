# Critic C1-09 r1a (blind)

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar / search | 17-18-50, 16-18-43: purple bar, nav arrows, history, search pill, help | Same, "Search Brightwater" | ok |
| Workspace rail | Plates: Today/Home/DMs/Activity/Files/To-dos/Agents & tools; badges on org icons | Same labels, teal "B" tile, no unread badges | ok |
| Files sidebar | All files/Canvases/Lists, Recently viewed, lavender active row | Same; active row lavender; only 2 recents; no "Assigned to you" / "Deleted" | ok (WARN-minor) |
| Canvas header | Star, title, Share, info, kebab; "Edited just now" | Star, title, headphone, Share, kebab | ok |
| Canvas body (deal cards) | Blue deal link, $ right, prob/upside row, risk list, flow box, green Run Flow button | Matches closely; numbered lists instead of bullets | ok |
| Slackbot panel header | Slackbot, compose, kebab, close; Messages/History/Skills tabs | Adds search icon, "Tasks" tab and "+" instead of "More" | ok (different build) |
| Bot message | Mascot avatar, name, time, AGENT chip in 16-18-43 | Name + 8:12 AM, no AGENT chip | WARN |
| Success callout | Green tinted pill "Expected impact..." | Same | ok |
| Quote block | Purple left bar, italic quote | Same | ok |
| Composer | Rich-text toolbar, "Ask anything" | Present; toolbar B/I/U/S, link, lists, code, plus Aa, mic, send | ok |
| Panel scroll clip | Plates also clip text at panel bottom | Last line "...how often the agent should check the data - daily or" is cut by the composer border | WARN |

## Other tells (most damning first)
1. Bottom of panel: a half-clipped text line sits right on the composer top edge (about y=965). Real Slack clips scrolling content under the composer, so it is authentic. It still reads as a sentence cut mid-phrase. Fix: rest the scroll so the last visible line ends cleanly above the composer (as in plate 16-18-43).
2. Missing "AGENT" chip beside Slackbot name. Plate 16-18-43 shows it on the agent reply. Fix: add the chip, or confirm that chip varies by message type.
3. Left panel has only two recents and no "Assigned to you"; plate 16-18-43 lists many recent items. Low risk, since orgs differ.
4. Canvas card numbered list vs plate bullets. This is content, not chrome.

## Content check
- NorthStar $5.2M, 47%, upside $1.1M. The flow impact is $1.1M, which is consistent.
- "Fri, Sep 4" with "17 days remain" and "28 days no exec meeting" is internally consistent.
- Nothing overlaps. The checklist in the panel matches the 5 of 6 flow steps (the sixth, "Notify the sales leader", is a background step), which is plausible.
- No presenter or demo UI visible. Fonts and icons are Slack family.

VERDICT: BUILT
SCORE: 8/10, HARD_TELLS: []
