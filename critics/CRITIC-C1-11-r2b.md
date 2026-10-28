# Critic C1-11 r2b (blind)

| region | plate | screenshot | tier |
|---|---|---|---|
| macOS title bar / back-fwd-history / search pill / help | search pill, help icon, app badge | matches | ok |
| Left rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | same labels, icons | matches; rail shows only workspace tile "B" (plates show app icons) | ok/WARN |
| Sidebar (Threads..Directories, Starred, Channels, DMs, Apps) | same anatomy | matches; active app row lavender highlight | ok |
| Channel header + Messages/List views tabs | same | matches | ok |
| Salesforce APP message | plain text insights, Manage Alerts button, "1 reply" | adds rich Tableau chart card, no Manage Alerts/reply link | WARN |
| Slackbot panel header/tabs | Messages/History/Skills/Tasks/+ | matches | ok |
| Panel thread (user msg, 1 reply, Slackbot AGENT, Used chip, Used 2 tools) | same | matches closely | ok |
| Composer + "Sending messages ... turned off" bar | same | matches | ok |

## Other tells
1. Embedded chart card in the Salesforce app message is not seen in any plate (plates are text-only). Location: center pane. Fix: confirm the card anatomy against slackbot-thread-pr-card.jpg or drop it. WARN.
2. Left rail lacks app icons (Salesforce/Slackbot) that the plates show. Minor.
3. Panel user message: "Based on Salesforce, This was helpful" has a stray capital T, and the user avatar is a photo where the plate uses a generic avatar. Nit.
4. Message text clipped at the bottom behind the "turned off" bar, which is how the plates scroll; not a tell.

## Content check
Chart: $46.4M submitted and $43.7M modeled vs $48M target is consistent with the "$41.2M-$45.8M, below $48M" text. The Today (Aug 18) marker sits correctly on the x axis. Legend matches the marks. The 37% / $10.7M of $28.9M figures and NorthStar $5.2M (18%) are consistent. Nothing overlaps.

VERDICT: REAL
SCORE: 8/10, HARD_TELLS: []
