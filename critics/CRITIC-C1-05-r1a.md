# Critic C1-05 r1a (blind, Slack + Slackbot panel)

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| macOS title bar, back/fwd/history, "Search <workspace>", Slackbot icon, help | 17-10-15, 17-18-33 | Same layout and icons | ok |
| Left rail (workspace tile, Today/Home/DMs/Activity/Files/To-dos/Agents & tools, +, moon, avatar) | plates | Same icon family and labels; one workspace tile instead of a stack | ok |
| Sidebar (name + gear + compose, Find a conversation, Threads..Directories, Starred, Channels, DMs, Apps) | plates | Same structure, aubergine, lavender active row, bold unread DM with red badge | ok |
| Apps list | plate: Slackbot, Slack | Salesforce, Google Drive, Tableau, Asana; no Slackbot even though the panel is open | WARN (minor) |
| Channel header (star, app icon, name, bell, kebab; tabs Messages / List views) | plates | Matches | ok |
| Unread divider | plate 3: thin red line, "New" at the right end; date pill on a grey line | "Today" pill sits ON the red line, with "New" mid-line (red line, pill, "New", red line) | WARN |
| App message (Salesforce APP, "Just now", bold title, body) | plates: APP badge, clock timestamps | Same anatomy; "Just now" is plausible | ok |
| Embedded Tableau chart card | no plate; 17-18-33 shows a plain-text-only message | Card has a Tableau icon, title, red pill, chart, legend and "Updated on" footer. It is self-consistent | ok |
| Chart data | n/a | Target at $48M plotted correctly. $46.4M and $43.7M endpoints sit at correct heights. Today (Aug 18) lands at about 48/91 of the axis. 78% miss / 22% reach are complementary. Modeled $43.7M lies inside the stated $41.2-45.8M range | ok |
| Bottom of the message list / "Sending messages to this app has been turned off" bar | plates: same bar, list clipped by pane | Matches; last bullet line is half-clipped above the bar, as in the real plate | ok |
| Slackbot panel header (icons, tabs Messages/History/Skills/Tasks/+) | plates | Matches | ok |
| Slackbot message block | plates: no badge next to "Slackbot"; timestamp is "Oct 5th at 11:35 AM"; "Used" chip with a small outline icon | Gray "AGENT" badge next to Slackbot; "Just now" timestamp; chip uses a sparkle icon | WARN |
| In-reply stat card (22% -> 66%) and green "Run ... Skill" button | no plate | Plausible work-object style; button is Slack-green with a play glyph | ok / WARN (unverified) |
| Panel composer (B I U S, link, lists, code; "Ask anything"; + Aa ...; mic; send) | 17-10-15 | Matches | ok |

## Other tells, most damning first
1. Unread divider (center of channel pane, ~y=181). In plate channel-thread-full-desktop-view.jpg the "New" label sits at the right end of the red rule, and the date pill is separate. Here a "Today" pill and a "New" label are both crammed onto one red line. Fix: render the date divider (grey line + pill) and the unread line (red, "New" flush right) as separate rows.
2. "AGENT" badge next to Slackbot. Plates 17-10-15 and 17-18-33 show Slackbot with no badge, only a mascot avatar and timestamp. Only the channel message shows "APP". Likely invented chrome. Fix: remove the badge, or use the exact plate treatment.
3. Chart endpoint labels ($46.4M, $43.7M, "Q3 target $48M") are stacked about 12px apart and nearly touch. This is not an overlap, but it looks crowded. The "Sep (Q-end)" tick is right-aligned to the end rather than at Sep 1, so the x spacing is uneven. Fix: add more vertical spacing between the labels, or put them in a right gutter.
4. Apps section omits Slackbot while the Slackbot panel is open. The plates list Slackbot under Apps. Minor.
5. Timestamps are "Just now" in both panes. Real plates show absolute times. It is believable for a live capture.
6. Green CTA button inside an agent reply has no plate precedent. Slackbot work-object cards usually use the card anatomy from slackbot-thread-pr-card. Unverified, so WARN only.

## Content check
- Numbers consistent: 78% miss vs 22% reach; the range $41.2-45.8M brackets the modeled $43.7M; $48M target line is at the correct y.
- Legend (Actuals solid black, Submitted forecast dashed black, Modeled outlook blue, Projected range light blue band, Q3 target red) matches the marks.
- No overlapping text and no mid-phrase cutoffs. The only clip is the scrolled message list under the disabled-composer bar, which is authentic.
- No presenter or demo UI visible.

Overall: chrome is very close to the real plates. The remaining nits are the "Today"/"New" divider mashup and the AGENT badge, plus the unusually clean, perfectly consistent chart card.

VERDICT: BUILT
SCORE: 7/10, HARD_TELLS: []
