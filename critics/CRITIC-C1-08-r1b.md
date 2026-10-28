# Blind critique C1-08 slack-panel (r1b)

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar (traffic lights, sidebar toggle, back/fwd/history, search, Slackbot icon, help) | 17-10-15, 17-18-33 | Same structure; search reads "Search Brightwater" | ok |
| Workspace rail | plates show stacked app icons with badges | Single "B" teal tile plus "+" ; no badges | ok (org-specific) |
| Primary nav (Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | 17-18-50 | Same order, same icon family, Files active as lavender rounded square | ok |
| Files sidebar (All files/Canvases/Lists, Recently viewed, active row light pill) | 17-18-50, 16-18-21 | Matches anatomy; Drive icon row plausible | ok |
| Canvas header (star, title, Share, kebab) | 16-18-21, 17-18-50 | Has headphone button, no "Edited just now" / info icon | ok / minor |
| Canvas body (deal cards, blue links, green upside, flow box, green CTA) | 16-18-21 | Same card anatomy and green CTA; numbered lists rather than bullets | ok |
| Slackbot panel header + tabs (Messages/History/Skills/Tasks/+) | 17-10-15, 17-18-33 | Matches, incl. icons and underline | ok |
| Slackbot messages (square user avatar, AGENT chip, "Used" chip, feedback icons) | 17-10-15 | Matches | ok |
| Panel top edge | plates scroll under header | A half-clipped text line sits right under the tab row | WARN |
| Composer (formatting row, Ask anything, +/Aa/mic/send) | 17-10-15 | Matches | ok |
| Sidebar color | plates deep aubergine | Slightly more magenta/plum | WARN (minor) |

## Other tells
1. Panel top: the line "Recovering at least $2.1M from high-potential Best Case" is sliced through the glyphs under the tab underline. Real Slack scrolls under the header and clips like this, so this is authentic behavior. Fix, if desired: rest the scroll on a message boundary.
2. Sidebar and rail purple is a touch warmer/magenta than the plates. Fix: sample the plate (~#3F0E40-#4A154B family).
3. The 22% -> 66% stat card is the only non-plate anatomy. It is plausible as a Slackbot rich block and has no overlap.

## Content check
- Numbers are consistent: 47%/$1.1M upside, 17 days remaining, 22% -> 66% matches the "with these changes" story. Sep 4 2026 is a Friday, so the date is correct.
- Nothing overlaps. No mid-phrase cuts other than the scroll clip. Truncations use ellipses ("Pipeline Outlook Anal...").
- Fonts are consistent with the Lato-like Slack face. Icons are in the Slack family.

No hard tells found.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
