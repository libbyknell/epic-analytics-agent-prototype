# Critic C1-14 r1a (Slack Files canvas + Slackbot panel)

Note: screenshot is actually 3360x1900 (brief said 2912x1800).

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Window chrome/traffic lights, back/fwd/history, purple search bar, Slackbot icon, help | 17-18-50 | Same, "Search Brightwater" | ok |
| Left icon rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools, +, moon, avatar) | 17-18-50 | Matches; Files active as lavender rounded rect; rail has only "B" tile, no app/org tiles | ok (org varies) |
| Files list (All files/Canvases/Lists, Recently viewed, lavender active row) | 17-18-50 | Matches; no Deleted/Starred blocks, gear + plus present | WARN (minor) |
| Canvas header: star, title, "Generated just now", Share, Dig Deeper, kebab | 17-18-50 | Matches anatomy; "Generated just now" vs footer "Generated August 19" | WARN (minor) |
| Canvas body: insight cards, severity pill, 3 metric tiles, bullets, Recommended actions | 17-18-50 | Same anatomy; pills are amber MEDIUM, plate red HIGH | ok |
| Canvas footer "Generated ... 2 sources . AI-generated" | 17-18-50 | Matches | ok |
| Slackbot panel header, tabs (Messages/History/Skills/Tasks/+), close | all three | Matches; real mascot icon, same tab icons | ok |
| Panel scroll top: "Used Sales Data Intelligence . Autonomous Insights" chip clipped under tab divider | 17-18-33 / 17-10-15 | Chip text half-cut by divider | WARN (real scroll clip; plates clip content under header similarly) |
| Panel body: tool-use rows, prose, blue link, bold figures, attribution, report card, share/thumbs | 17-18-50 | Matches structure; attribution reads "Brightwater, Maya Okonkwo . Report" vs plate's "DiscoverAgent Test6 - Matthew Sullivan . Report" | WARN (minor) |
| Composer: formatting toolbar, "Ask anything", + Aa canvas icons, mic, send | 17-12 / 17-10-15 | Matches; toolbar fully active vs faded in plate | ok |

## Other tells (most damning first)
1. Panel top clip (right panel, y~145 of display): the "Used Sales Data Intelligence" row is sliced through its middle by the tab divider. Plates show content scrolling under the header, so this is believable, but a resting scroll on a message boundary is cleaner. Fix: scroll so the first visible line is a full row.
2. "Generated just now" in the canvas header contradicts the footer "Generated August 19 at 8:02 AM CT" and the panel's "newest report (generated Aug 19)". Plate says "Generated 9 days ago". Fix: relative age, or drop it.
3. Attribution line "Brightwater, Maya Okonkwo . Report" - plate shows the user's display name only. Fix: "Maya Okonkwo . Report".
4. Left rail has a single teal "B" workspace tile, no org/app tiles. Org-dependent, not a tell.
5. Files list missing Starred/Deleted sections that appear in the plate; minor.

## Content check
- Numbers consistent: 8:02 AM CT = 13:02 UTC, matches "13:00 UTC". Pill scores 72/68 match MEDIUM. "All 4 insights" matches numbered 03/04 cards visible. Tiles coherent ($2.1M, 58%, 9 days; $3.4M, 33%, 11 days) and bullets match tiles (9 days redlines, decision date moved twice).
- No overlap, no mid-sentence cuts besides the scroll-clipped row. Fonts and icon family (Slack Lato-like, outline icons) match plates. Colors: aubergine sidebar and lavender active row match.
- No presenter/demo UI.

Verdict: highly faithful; only soft tells.

VERDICT: REAL
SCORE: 7/10, HARD_TELLS: []
