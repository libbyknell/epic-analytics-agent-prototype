# Blind critique C1-12 (r1b)

Screenshot: slack/_gate/C1-12/C1-12-slack-panel/screenshot.png (3360x1900; the task said 2912x1800, but the file is 3360x1900).
Plates compared: 17-18-33, 17-10-15, 17-18-50 (Slackbot panel and Salesforce app DM), channel-thread-full-desktop-view.jpg.

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar (traffic lights, sidebar toggle, back/forward/history, search pill, help) | Aubergine bar, translucent search pill, right-hand Slackbot icon (17-18-33) | Same layout. No Slackbot icon at the right of the search pill. | ok (WARN: the pill is slightly lighter than the plate) |
| Left rail (Today, Home, DMs, Activity, Files, To-dos, Agents & tools) | Same labels and order, with workspace and app icons stacked above | Workspace "B" tile plus "+" only. Labels and order match. | ok |
| Sidebar nav (Threads ... Directories) | Same | Same | ok |
| Starred / Channels / DMs / Apps sections | Section headers with icon and no caret; Apps lists Slackbot and Slack | Apps lists Salesforce, Google Drive, Tableau, Asana. Unread bold DM "Ana Duarte, Le..." with a red "8" badge. | ok (WARN: the sidebar has more channels and apps than any plate, which is org data) |
| Active item highlight | Light lavender rounded-rect (17-10-15) | Same | ok |
| Channel header (star, Salesforce logo, name, Messages / List views tabs, bell, kebab) | Same | Same | ok |
| Message anatomy (APP chip, bold headline, warning emoji "High-severity insight", Generated ..., bullets, "Autonomous insights found this for you", inline Slackbot icon, Manage Alerts, "1 reply") | Same | Same | ok |
| Date divider ("Today" pill) and red "New" line | "Today" pill centered; "New" label at the far right end of a thin red line (channel-thread jpg) | "Today" pill and "New" sit side by side in the middle of the line | WARN |
| Embedded chart card inside the bot message | No plate shows a chart card in this message type | Chart card with legend, "Updated on Aug 18, 2026" footer, and a y-axis title clipped by the scroll edge | WARN |
| Top message footer | Every insight message ends with the "Autonomous insights found this for you / Slackbot ... / Manage Alerts" block (17-18-33, 17-10-15) | Bullets go straight to "1 reply" with no footer | WARN |
| Disabled composer banner ("Sending messages to this app has been turned off.") | Same, grey rounded bar | Same | ok |
| Slackbot side panel | Open in all three plates | Absent. The file is named "slack-panel", but the panel is not in the frame. | WARN (check intent) |

## Other tells, most damning first
1. **Top message has no footer.** Location: the upper message, where the bullets are followed directly by "1 reply".
   - Real plates: every Autonomous Insights message carries the "Autonomous insights found this for you. For more, click Slackbot..." text and the Manage Alerts button (17-18-33, 17-10-15).
   - This is the scroll-clipped message, so it could be legitimate if the chart is in the middle of the message. But the bullets that follow the chart read as the end of the message.
   - Fix: add the footer and button, or scroll so the clipped message ends where the real template ends.
2. **Chart inside a Slack bot message.**
   - The chart is a crisp card, but the real plates show text-only insights with reports opened in Files or a Slackbot panel. It is not wrong, but it is unproven by the plates.
   - The y-axis title "Revenue (cumulative, qu" is cut by the scroll edge. The scroll clip is authentic, so this is not a hard tell.
   - Fix: none required, or use a thumbnail with a "View report" attachment as the plates do.
3. **"Today" / "New" divider.** Real Slack puts "New" at the far right and "Today" as a centered pill, with a thin line for each. Here they sit together. Fix: split them.
4. **Slackbot side panel missing**, if the panel is the subject of this shot. The title-bar Slackbot icon is also absent.
5. **Sizing.** Body text is large relative to plates sharing the same width, so the screenshot reads as a retina capture. This is consistent with a 3360 px capture and is not a tell.

## Content checks
- 10.7 / 28.9 = 37.0%, which matches the headline and the bullet.
- 5.2 / 28.9 = 18.0%, which matches the bullet.
- Weekdays: Aug 19, 2026 is a Wednesday and Aug 21 is a Friday, so "Fri, Aug 21" is consistent.
- Modeled outlook ($41.3M) sits below the submitted forecast in the chart. This is consistent with a $2.4M drop.
- The legend matches the marks, except that the Q3 target line is out of view. No overlap. No mid-phrase cut-offs, other than the scroll-clipped chart axis title.
- No presenter UI. Fonts are Lato-like, as in the plates. Icons come from the correct Slack family.

Overall: believable. The sidebar, rail, header, message anatomy and banner match the plates. The remaining nits are the missing footer on the top message, the divider layout, and the absent panel.

VERDICT: BUILT
SCORE: 7/10, HARD_TELLS: []
