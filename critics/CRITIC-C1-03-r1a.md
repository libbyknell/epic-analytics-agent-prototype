# Critic C1-03 r1a (blind, Slack channel + thread panel)

Note: the file is 3360x1900, not the stated 2912x1800. Not a tell.

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar, traffic lights, back/fwd/history, search "Search Brightwater", help | 17-10-15, 17-18-50 | Same layout; tinted search pill and help icon match | ok |
| Left rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools, + , moon, avatar) | 17-10-15 | Same order and labels. Only one workspace tile ("B") vs several app tiles; this varies by org | ok |
| Sidebar (Find a conversation, Threads/Huddles/Recap/Drafts/Saved/Directories, Starred, Channels, DMs, Apps) | 17-10-15, full-desktop jpg | Aubergine, lavender active row, line icons, bold unread DM with count badge. Matches | ok |
| Channel header (star, Salesforce logo, bell, kebab; Messages / List views tabs) | 17-10-15 | Identical anatomy | ok |
| Date divider ("Today" pill + red "New" line) | full-desktop jpg (New line at right) | "Today" pill mid-row with "New" label inline. Slightly different composition, but plausible | WARN (minor) |
| App message (Salesforce APP, "Just now", bold headline, bullets) | 17-10-15 | Same app-message anatomy and Lato-like type | ok |
| Embedded Tableau chart card | no direct plate (PR work-object card is the closest) | Card anatomy (icon-in-square, title, subtitle, footer) fits the index. Chart is clean and consistent | ok |
| Chart end labels ($46.4M / $43.7M / Q3 target $48M) | n/a | Labels stacked with almost no gap; "Q3 target $48M" sits right at the line end | WARN (minor) |
| Message bottom edge under the disabled composer | 17-10-15 | A half line of the last bullet ("The pattern remains...") shows, sliced, directly above the box. Real Slack also clips scrolling content at the composer, but here it is cut mid-glyph with no breathing room | WARN |
| Disabled composer "Sending messages to this app has been turned off." | 17-10-15 | Same text and gray box | ok |
| Thread pane header ("Thread", kebab, X) | 17-18-50 and 17-10-15 (Slackbot header) | Thread header is standard Slack; the Slackbot header is for a different surface | ok |
| Thread overflow (parent scrolled above fold, "1 reply" divider visible, reply visible) | REAL-INDEX ruling | Matches the ruling: the divider is visible and the parent card is clipped at the top, which is authentic | ok |
| Thread reply ("Why did I receive this?" + bullets) | 17-10-15 | Same anatomy | ok |

## Other tells (most damning first)
1. Sliced last bullet above the composer, around (480-1190, 1033) in the displayed view. The real product clips scrolled content at the composer boundary, but it is cut mid-glyph, so it reads as a layout seam. Fix: rest the scroll on a line boundary, or add a soft fade or padding above the composer.
2. Chart end labels crowd each other at the right edge (~x1050-1150, y550-585). Real Tableau labels would be collision-nudged. Fix: add 4-6px more vertical separation, or right-align the target label above the line.
3. The "Today / New" divider differs from the plate, where "New" is flush right and the "Today" pill sits in its own row. Low confidence; real Slack varies. Fix: match the plate arrangement.
4. The same insight text appears in the channel and the thread parent. This is authentic for app threads, so it is a non-issue.

## Content check
- The range ($41.2M-$45.8M) brackets the modeled outlook ($43.7M), and both sit below the $48M target. Consistent.
- The submitted forecast ($46.4M) is also below the target. The dashed line ends below the red line, as drawn.
- The legend matches the marks: Actuals solid black, Submitted forecast dashed, Modeled outlook blue, Projected range light-blue band, Q3 target red.
- "Today (Aug 18)" lies at about 53% of the Jul-Sep axis and the actuals end at about $27M. Consistent.
- "Updated on Aug 18, 2026" is consistent in the card and in the thread parent.
- Bullets in the thread parent match the channel bullets.
- No overlapping text other than the tight chart labels; no garbled glyphs.
- No presenter or demo UI.

VERDICT: BUILT
SCORE: 8/10, HARD_TELLS: []
