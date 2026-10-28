# Critic C1-12 r1a (blind, power-user view)

Viewed at reduced scale; judged against plates 17-18-33, 17-10-15, 17-18-50.

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Window chrome, traffic lights, back/fwd/history, search pill, help icon | purple title bar, "Search <workspace>" pill, Slackbot icon at right, ? | Same layout, "Search Brightwater" | ok |
| Workspace rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | Same labels, plus extra app/workspace icons on the left | Same labels, one "B" workspace tile | ok (demo org) |
| Sidebar: Threads/Huddles/Recap/Drafts & sent/Saved/Directories, Starred, Channels, DMs, Apps | Same order and icon family | Same, with channels, DMs and unread badge filled in | ok |
| Selected app row (Salesforce, white highlight) | Selected row is a white pill | Matches | ok |
| Channel header: star, cloud icon, name, bell, kebab, Messages / List views tabs | Same | Same | ok |
| Message block: app avatar, "Salesforce APP 8:00 AM", bold title, warning-triangle severity line, "Generated ... UTC", bullets, "Autonomous insights found this for you", Slackbot inline icon, Manage Alerts, "1 reply" | Same structure and wording | Same | ok |
| Date divider ("Today" pill, red "New" line) | Plates have pill dividers | Matches, red New line is real Slack | ok |
| Composer replaced by "Sending messages to this app has been turned off." | Same in 17-10-15 | Matches | ok |
| Right-hand Slackbot panel | Plates show a Slackbot side panel | Not present, though the folder is named "slack-panel" | WARN (scene gap, not a tell) |
| Chart image in message (clipped at top by scroll) | Plates show only text messages | Axis label "Revenue (cumulative, qu" is cut at the top edge by the scroll viewport | WARN |
| Content/data | | See below | HARD |

## Tells, most damning first
1. Data contradiction (HARD). The summary says NorthStar, Acme Retail and Greenline total $10.7M (37% of $28.9M). A later bullet says "Priya Raman owns NorthStar and two other late-stage deals ($9.3M combined)". Those are the same three deals, so $9.3M cannot equal $10.7M. If $9.3M is only the two other deals, the total is $14.5M. NorthStar is $5.2M, so the two others should be $5.5M. Fix: change to "$5.5M combined" or "$10.7M combined". The 37% and 18% math is otherwise correct.
2. Chart clipped under the sticky header (WARN). The y-axis title is cut off mid-word ("qu"). Real Slack would clip like this on scroll, so it is plausible, but it reads as a rendering glitch. Fix: scroll so the chart title or the full axis label is visible, or show the whole chart.
3. Message body is very wide (WARN, nit). Bullets run nearly the full width. Plate 17-10-15 wraps at the same pane width, so this is consistent, but the type looks slightly larger than in the plates (a scale effect).
4. Missing Slackbot panel (WARN, content gap only).

## Content check
- Legend (Actuals solid black, Submitted forecast dashed, Modeled outlook blue, Projected range band, Q3 target red) matches the marks visible.
- The $41.3M after a $2.4M drop is consistent with the model.
- Dates are consistent: updated Aug 18, generated Aug 19, exec review Fri Aug 21 (Aug 21 2026 is a Friday).
- No overlaps. Nothing else is cut off.
- Fonts, icons and the purple sidebar match the plates.

VERDICT: REAL
SCORE: 6/10, HARD_TELLS: [$9.3M "combined" contradicts $10.7M three-deal total]
