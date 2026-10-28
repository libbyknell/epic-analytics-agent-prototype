# CAPABILITIES — Tableau Proactive Intelligence in Slack

Target release: Pilot (per DEMO-BRIEF §3, "All features are Pilot")  ·  Ledger last verified: 2026-10-15  ·  Verified by: build lead (Claude)

Evidence base: the 14 enablement captures in `_intake/…/Proactive Intelligence Demo Prototype/` (layout and labels only; another org's data) plus DEMO-BRIEF / DATA-CANON. No shipping source was available for the Proactive Intelligence surfaces, so nothing new is rated SHIPPED.

## Summary
| Class | Count |
|---|---|
| SHIPPED | 9 (Slack chrome and standard Slack features) |
| GATED (Pilot, seen in captures) | 13 |
| IN-FLIGHT (Pilot, no capture; layout written by us) | 2 |
| VISION (approved) | 0 |
| UNKNOWN | 1 |

## Beats
| Beat | UI element | Real label (from captures) | Class | Gate / release | Evidence | Notes |
|---|---|---|---|---|---|---|
| all | Slack desktop, newer rail (Today/Home/DMs/Activity/Files/To-dos/Agents & tools) | as listed | SHIPPED | GA Slack | captures 12–14; kit `chrome/slack-shell` | To-dos tab, Saved row and the workspace column were added in the project skin (see FRICTION-slack.md) |
| C1-01 | DM, Apps section, unread badge | — | SHIPPED | GA Slack | capture 1 | |
| C1-02 | Salesforce app proactive alert (text only, no chart; changed 2026-10-23 per PM recording) | headline, "⚠️ High-severity insight", Recommended actions, "Manage Alerts" (no date stamp) | GATED | Pilot | PM recording 2026-10-23, alert screenshot | Same format as C2 n2 |
| C1-02 | Hover toolbar with Slackbot icon | — | GATED | Pilot | captures 2, 4 | |
| C1-03 | "Why did I receive this?" reply in thread | as DC §6 | GATED | Pilot | capture 3 | |
| C1-04 | Suggested prompts menu (4 items) | "What could most improve the outlook?" … "Write your own prompt" | GATED | Pilot | capture 4 | |
| C1-05 | Slackbot panel (Messages/History/Skills/Tasks/+), AGENT badge, "Used Sales Data Intelligence…" | as DC §7 | GATED | Pilot | captures 5, 12–14 | |
| C1-05 | 22% → 66% tile, skill button | "Run Pipeline Outlook Analysis Skill" | GATED | Pilot | capture 5 | |
| C1-06 | Skill run, message-or-canvas ask, canvas card | "Saved to your Files." | GATED | Pilot | capture 6 | Ask/confirm copy written by us (BRIEF-GAPS-BUILD #1) |
| C1-07/08 | Slack canvas "Pipeline Outlook Analysis" | as DC §8–9 | GATED | Pilot (canvas itself SHIPPED) | captures 7–8 | |
| C1-09 | "Run Flow for NorthStar", Executive Deal Review Flow result | "Executive Deal Review Flow ran successfully" | GATED | Pilot | captures 9–10 | Flow runs in Salesforce; scripted |
| C1-10 | Monitor agent assignment | "Agent assigned" | GATED | Pilot | capture 11 | |
| C1-11 | Feedback via Slackbot ("Provide feedback to improve this insight") | as DC §12 | GATED | Pilot | capture 12 | |
| C1-12 | Text-format insight shaped by feedback ("Based on your feedback:") | as DC §13 | IN-FLIGHT | Pilot | none (BRIEF-GAPS #7) | Format copied from capture 13 |
| C1-12 | Whether the product prefixes "Based on your feedback:" | — | UNKNOWN | — | BRIEF-GAPS #7 | PMM to confirm |
| C1-13 | "Give me my newest insights" → report link card | as DC §14 | GATED | Pilot | capture 13 | |
| C1-14 | Autonomous Insights report surface (cards, Share, Dig Deeper) | as DC §15 | GATED | Pilot | capture 14 | Dig Deeper not clicked |
| C1-14 | Report insights 01–04 and scores 94/89/72/68 | — | IN-FLIGHT | Pilot | BRIEF-GAPS #9 | Content ours, layout from capture 14 |

## Approvals for non-SHIPPED rows
| Beat | Class | Approved by | Date | Talk-track caveat |
|---|---|---|---|---|
| all | GATED / IN-FLIGHT | DEMO-BRIEF (PMM) says "All features are Pilot" | 2026-10-14 | Say "in pilot"; don't promise GA dates |

## Limits & data constraints honoured
- Every on-screen value comes from DATA-CANON.md; nothing is reused from the captures (another org).
- No live backend: all agent replies are scripted (`demo-flow` think/stream).
