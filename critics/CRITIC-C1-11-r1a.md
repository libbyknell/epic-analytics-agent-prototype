# Blind critique C1-11 (r1a): Slack channel + Slackbot panel

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar, traffic lights, nav arrows, history, search pill, help | all plates: purple bar, "Search <ws>" pill, Slackbot icon, ? | matches, plus Slackbot icon right of search | ok |
| Workspace rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | 17-10-15 plate shows same labels | same labels and icons; only "B" tile + "+" (fewer app tiles) | ok |
| Sidebar aubergine, lavender active row, Starred/Channels/DMs/Apps sections | real plates | matches; square rounded avatars, red unread badge "8" | ok |
| Channel header (star, app logo, bold name, bell, kebab; Messages / List views tabs) | 17-10-15, 17-18-33 | matches | ok |
| Date divider "Today v" with red "New" line | desktop-view plate (red New line) | matches | ok |
| App message (Salesforce APP, "Just now", bold headline, bullets) | 17-18-33 | matches anatomy | ok |
| Tableau work-object card (icon tile, bold title, gray subtitle, footer "Updated on") | slackbot-thread-pr-card anatomy | matches | ok |
| Chart inside card | no plate has an inline chart | "Q3 target $48M" label collides with "$46.4M" label and endpoint marker | WARN/HARD (small overlap) |
| Bottom "Sending messages to this app has been turned off." banner | 17-10-15, 17-18-33 | matches; message text clipped behind banner as scrolled | ok |
| Slackbot side panel header (mascot, title, compose/search/kebab/X; Messages/History/Skills/Tasks/+) | 17-10-15 | matches, icons same family | ok |
| Panel thread (parent, "1 reply", Slackbot reply, Used chip, "Used 2 tools", reaction row) | 17-10-15 | matches; extra "AGENT" tag and "you" tag not seen in plates | WARN (minor) |
| Composer (formatting toolbar, "Ask anything", +, Aa, mic, send) | 17-10-15 | matches | ok |

## Other tells, most damning first
1. Chart end-of-line labels (about x=1050-1150, y=550-590 in the 2000px view). "Q3 target $48M" sits on top of the "$46.4M" label and touches the black endpoint marker. A live chart would collision-avoid or place them apart. Fix: move the target label left/above the line, or right-align it above the red rule with 8px clearance.
2. "AGENT" tag beside Slackbot in the panel. None of the three real panel plates show it. Real plates show the plain "Slackbot" name. Fix: remove it, or confirm it exists in a current build.
3. Chart x-axis: "Aug" label sits at about 25% of the axis while "Today (Aug 18)" is at about 46%, and Aug 1 would be at about 33%. The labels read as month centers, not month starts. Minor.
4. Panel parent message shows "Maya Okonkwo you 8:50 AM". The plate shows a similar layout, but there is no timestamp date and no hover toolbar. Not a tell.

## Content check
- 37% of $28.9M = $10.7M, which is consistent. $5.2M / $28.9M = 18%, which is consistent.
- Modeled $43.7M sits inside the "$41.2M to $45.8M" range text. Both are below the $48M target, so the headline "below target" is consistent. The submitted forecast ($46.4M) is also below $48M.
- Legend (Actuals solid black, Submitted dashed, Modeled blue, range band, target red) matches the marks.
- No cut-off mid-phrase text except the message scrolled under the composer banner, which the real plates also show.

## Verdict
Very convincing chrome and typography. The only clear tells are the overlapping end labels in the chart and the extra AGENT tag.

VERDICT: BUILT
SCORE: 7/10, HARD_TELLS: [chart "Q3 target $48M" label overlaps "$46.4M" endpoint label/marker]
