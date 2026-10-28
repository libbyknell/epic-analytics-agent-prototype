# Critic C1-04 r1a (blind, Slack Salesforce app message with Tableau chart card)

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar / search | 17-18-33, channel-thread: traffic lights, sidebar toggle, back/fwd/history, centered purple search | matches; right-edge help icon and Slackbot icon present | ok |
| Workspace rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | 17-18-33 same labels and order | matches; B tile with outline | ok |
| Sidebar (aubergine, Find a conversation, Threads..Directories, Starred, Channels, DMs, Apps) | same anatomy; active item lavender rounded rect | matches; Salesforce active row lavender | ok |
| Sidebar density/sizes | plate text ~14px relative to 1414 wide | looks slightly larger, but this is a 2x-scale canvas | ok |
| Channel header (star, Salesforce icon, name, Messages / List views tabs) | 17-18-33 identical | matches; bell and kebab on right | ok |
| Day divider + red New line | channel-thread plate: Today pill, red New line | matches | ok |
| Message header (Salesforce APP chip, "Just now", bold headline) | 17-18-33: app chip, timestamp, bold headline | matches | ok |
| Hover toolbar (check, eyes, hands, add-reaction, comment, forward, bookmark, Slackbot icon, kebab) | 17-18-33 toolbar has similar set with Slackbot-style icon | consistent | ok |
| Suggested prompts popover | no plate shows it open | Slackbot icon header, 3 prompts + "Write your own prompt", blue selected row | WARN |
| Chart card (Tableau work-object card) | slackbot-thread-pr-card anatomy: icon-square, bold title, gray subtitle | matches anatomy; footer "Updated on" | ok |
| Chart marks/legend | n/a | legend (Actuals, Submitted forecast, Modeled outlook, Projected range, Q3 target) matches marks | ok |
| Chart end labels | n/a | $46.4M and $43.7M stacked with about 0 px gap; markers nearly touch | WARN |
| Bullets / reply link | 17-18-33 "1 reply" blue link w/ app avatar | matches | ok |
| Footer | real Slack disabled-composer text | "Sending messages to this app has been turned off." | ok |

## Other tells (most damning first)
1. Popover covers body text (about x 1550-1970, y 240-480 in the 2000px view). The first paragraph breaks at "projected to finish between **$41.2M" with the range's upper bound hidden under the popup. It is an overlay, so it is natural for a live menu, but as a still it reads as an element covering content and a cut-off sentence. Real Slack popovers anchor to the toolbar and would normally sit on top, so this is borderline. Fix: shorten the paragraph so the range ends before the popup edge, or shift the popover below the toolbar so it only covers whitespace to the right of a wrapped line.
2. Hover toolbar and open popover are shown with the message hover background but no hover highlight on the message row beyond a faint gray strip. Minor. Fix: apply the light gray hover to the full message row.
3. Chart end labels "$46.4M" / "$43.7M" are stacked tightly and the circles touch the target line label area ("Q3 target $48M" sits right above). Reads cramped but not overlapping. Fix: offset labels by 4-6 px more.
4. Body text is a touch larger than the plates relative to the sidebar. Minor.

## Content check
- Axis: $0-$50M cumulative; Today (Aug 18) dashed line at about 52% across Jul-Sep, consistent with day count.
- Target $48M line sits just under $50M gridline, correct. Ends 46.4 and 43.7 are both below 48, consistent with the "finish below target" headline and "78% likelihood of missing".
- The visible range "$41.2M..." is hidden, so it cannot be checked against 43.7 and 46.4 ends. If the range is $41.2M-$46.4M the 43.7M modeled point sits inside, fine.
- Legend matches marks: dashed black forecast, solid blue modeled, light blue band, red target.
- No garbled glyphs; Lato-like font matches plates. No presenter UI.

VERDICT: REAL
SCORE: 7/10, HARD_TELLS: [suggested-prompts popover cuts sentence mid-phrase after "$41.2M" (borderline, overlay)]
