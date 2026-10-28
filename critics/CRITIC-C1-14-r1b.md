# Critic C1-14 r1b (blind)

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar (traffic lights, back/fwd/history, search pill, Slackbot icon, help) | 17-18-50 / 17-10-15: purple bar, search pill, bot icon, ? | Same elements, same positions | ok |
| Left rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools, + , moon, avatar) | Same stack; plates show org app icons at top | Teal "B" workspace tile, no app icons; Files selected with lavender highlight | ok (org-dependent) |
| Files list sidebar | 17-18-50: Files header, gear/+, All files/Canvases/Lists, Recently viewed | Same anatomy; Drive icon on one item | ok |
| Canvas header (star, title, Generated, Share, Dig Deeper, kebab) | 17-18-50 identical set | Matches; title ellipsis absent due to wider pane | ok |
| Canvas body cards (severity pill, KPI tiles, bullets, Recommended actions) | 17-18-50 same anatomy | Matches; clean, no overlap | ok |
| Canvas footer | "Generated ... AI-generated. Review for accuracy." | Matches | ok |
| Slackbot panel header + tabs | Mascot, Slackbot, compose/search/kebab/X; Messages/History/Skills/Tasks/+ | Matches | ok |
| Panel scroll state | Plates start at top with user prompt + "1 reply" | Scrolled mid-thread; "Used Sales Data Intelligence" chip clipped under tab row, prompt not visible | WARN (scroll clip is authentic) |
| Panel message text, "Used ..." tool rows | 17-18-33 same pattern | Matches; tool rows with chevrons | ok |
| Link "Autonomous Insights - Q3 Pipeline" | Plates: blue underlined link | Blue, no underline | WARN (minor) |
| Report work-object card + reactions | Plates: icon-in-square, title, "Report", share/thumbs | Matches | ok |
| Composer | Plates: formatting toolbar, Ask anything, + Aa icons, mic, send | Matches | ok |

## Other tells (most damning first)
1. Panel scrolled so the first visible line is clipped under the tab row and the user's prompt/"1 reply" divider is off-screen. Real Slack does this when a thread overflows (REAL-INDEX ruling); WARN at most. Fix: rest the scroll on the "N replies" divider.
2. Reply link lacks underline (plates show underlined link). Cosmetic.
3. Left rail has no org app icons (plates have Salesforce/Next icons); org-dependent, not a tell.
4. Latest assistant message lacks the Slackbot avatar row header (sender line is clipped/scrolled); consistent with the scroll state.

## Content check
$43.7M modeled vs $48M target, 37% of remaining Commit, 29 days NorthStar, 4 insights: card 03/04 numbers (9 days redlines matches bullet "open for 9 days"; 11 days; 58%/33%) self-consistent. Medium 72/68 pills consistent. No overlap, no mid-phrase cuts (the one clip is a scroll clip). No presenter UI, no garbled glyphs.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
