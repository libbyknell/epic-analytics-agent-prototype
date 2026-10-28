# Critic C1-06 r1a (blind customer-side review)

## Region table
| region | plate | screenshot | tier |
|---|---|---|---|
| Title bar (traffic lights, sidebar toggle, back/fwd/history, centered purple search, help ?) | 17-18-50, channel-thread-full | Same arrangement; search pill, Slackbot-icon at right, ? | ok |
| Far-left rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools, + , moon, avatar) | 17-18-50 (Today, Home, DMs, Activity, Files, To-dos, Agents & tools) | Matches labels/order; workspace tile "B" selected with outline | ok |
| Aubergine sidebar, lavender active row | channel-thread-full, 17-18-50 | Salesforce row lavender highlight, bold-ish workspace name, sections Starred/Channels/Direct messages/Apps | ok |
| Sidebar top nav (Threads, Huddles, Recap, Drafts & sent, Saved, Directories) | channel-thread-full (Threads, Drafts, Directories); index notes Recap item | Plausible newer superset | ok |
| Square rounded DM avatars, "8" group badge | plate DM list | Matches | ok |
| Channel header (star, app icon, name, bell, kebab; tabs Messages / List views) | channel-thread-full tabs with icon + underline | Matches pattern | ok |
| App message (Salesforce APP chip, Just now) | plate message anatomy | Matches | ok |
| Embedded Tableau chart card (white rounded card, icon square, title/subtitle, footer "Updated on...") | slackbot-thread-pr-card anatomy | Matches card anatomy | ok |
| Chart legend vs marks | n/a | 5 legend entries all present as marks; dashed forecast, blue modeled, shaded range, red target | ok |
| Bottom of channel pane: "Sending messages to this app has been turned off." | n/a | Text runs under/behind the banner, cut mid-line at "The pattern remains after accounting for region..." | WARN |
| Slackbot panel header (icon, title, compose/search/kebab/close; tabs Messages/History/Skills/Tasks/+) | 17-18-50 identical | Identical | ok |
| Panel top: scrolled-under text "Recovering at least $2.4M from high-potential Best Case" clipped by tab strip | 17-18-50 is scrolled content too | Clipped at top edge, no fade | WARN (real scroll behavior) |
| Agent vs human messages (AGENT chip, mascot square vs photo avatar) | 17-18-50 | Matches | ok |
| "Used Pipeline Outlook Analysis" tool chip, canvas card, "Saved to your Files." | 17-18-50 (Used ... rows, Report card) | Matches | ok |
| Composer (formatting toolbar, "Ask anything", mic/send) | 17-18-50 panel | Plausible | ok |

## Other tells (most damning first)
1. Bottom of main channel: body text visibly continues beneath the disabled-composer banner, with the last line half-cropped. Real Slack clips the list at the footer boundary; it does not render text under a floating pill. Fix: end scroll on a full line or give the footer an opaque bar with a top border so the clip is clean. Low severity (scroll cut, not sentence-cut-with-no-context).
2. Message heading "Something I found for you" followed by a bold title with no separation is slightly unusual hierarchy; can't confirm against plates. Nit only.
3. Chart end-labels "$46.4M" / "$43.7M" sit very tight to the dots and "Q3 target $48M" label but do not overlap. Nit.
4. Panel top clip under the tabs: authentic scroll, WARN only.

## Content check
- Range text $41.2M to $45.8M brackets the modeled $43.7M; both below $48M target: consistent. 78% likelihood chip matches body text.
- 22% -> 66% tile: consistent with "Probability of reaching the Q3 target".
- Today (Aug 18) marker placed correctly between Aug and Sep ticks; cumulative curve rises monotonically; target line at $48M sits just under the $50M gridline.
- Maya Okonkwo / canvas / "Saved to your Files" flow is coherent. No overlaps, no garbled glyphs, fonts are correct Slack Lato-like.
- No presenter/demo UI visible.

Verdict: very convincing; only soft clipping tells.

VERDICT: BUILT
SCORE: 8/10, HARD_TELLS: []
