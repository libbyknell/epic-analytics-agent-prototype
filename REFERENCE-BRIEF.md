# Demo Request: Tableau Proactive Intelligence in Slack

| | |
|---|---|
| **Requested by** | Product Marketing (Tableau Proactive Intelligence launch) |
| **Build team** | Tableau Q Branch |
| **Format** | Launch demo video, about 5 minutes, presenter-narrated |
| **Story date ("today")** | **Tuesday, August 18, 2026, 8:05 AM CT.** The last three beats happen the next morning, Wed Aug 19. |
| **Data** | `DATA-CANON.md` is the only source of values. If a value isn't there, it doesn't go on screen. |

## 1. Story

A sales leader starts her day. Without opening Tableau or asking anything, Slack tells her the quarter is likely to miss target. She sees why she's being told, finds the best recovery path, runs the fix from inside Slack, and sets an agent to follow up. She gives feedback, and the next morning a new insight already reflects it.

**Leave believing:**
1. Tableau doesn't wait for you to ask. The answer, the reasoning and the action come to Slack.
2. It's a forecast, not a threshold alert.
3. It explains why it's interrupting you.
4. Knowing leads to doing: recommended actions run from the notification.
5. It follows through, and your feedback makes it more personal.

## 2. Company and people (all fictional)

- **Brightwater Software**, enterprise B2B software. Slack workspace "Brightwater". Wordmark text only, teal `#0F6E7A`, no logo image.
- **Goal:** $48M Q3 revenue. **Deals:** NorthStar (hero), Acme Retail Group, Greenline Energy.
- **Maya Okonkwo**, VP of Sales (hero, signed in everywhere).
- Names only: Nora Castellan (starting DM), Theo Lindqvist (notified on the monitor), Priya Raman (NorthStar AE), Marcus Webb (procurement owner), Elena Vasquez (legal owner).

## 3. Surfaces

Slack desktop only, newer left rail (Today, Home, DMs, Activity, Files, To-dos, Agents & tools). Salesforce app message (text-only alert since 2026-10-23; originally a Tableau chart card), thread panel, **Slackbot side panel** (Messages / History / Skills / Tasks / +), Slack Canvas, and an Autonomous Insights report. All features are Pilot.

**Open before the demo starts:** Slack, in the DM with Nora Castellan.

## 4. Flow

| Beats | One-liner |
|---|---|
| C0-01 | Cold open, verbal |
| C1-01 … C1-10 | Notification, why me, recovery path, canvas, run flow, assign the monitor agent (Day 1) |
| C1-11 … C1-14 | Give feedback (Day 1), new insight shaped by it, newest-insights report (Day 2) |

## 5. The script

"Say" is verbatim from the script. "See" is the end state of the screen.

**C0-01: Cold open (verbal)**
- **Say:** "In the next five minutes, you'll watch a sales leader go from 'we might miss our quarterly target' to increasing our chance of hitting it 3x. There's a shift I want you to see: Tableau doesn't wait for you to ask questions. It brings you the answer, the reasoning, and the recommended action, all inside Slack."

**C1-01: Set the scene**
- **Do:** Point at the Salesforce app in Apps.
- **Say:** "This is Slack, but picture this same experience in Teams, in a browser, in ChatGPT. I'm focusing on Slack today. I'm a sales leader starting my day. I haven't opened Tableau. I haven't built a dashboard. I haven't even asked a question. Tableau's been analyzing my business overnight, and this is what it surfaces."
- **See:** DM with Nora Castellan (history in DC §3). Sidebar Apps: **Salesforce** (bold, red "1" badge), Google Drive, Tableau, Asana.

**C1-02: Open the notification**
- **Do:** Click **Salesforce** in Apps.
- **Say:** "Q3 revenue is likely to land below our $48M target, 78% chance of missing. But notice what this isn't: it's not a threshold alert saying 'revenue is down.' Tableau modeled my current pipeline against how similar opportunities have historically closed, and projected where the quarter is actually headed. Not what happened, where we're going."
- **See:** Message from **Salesforce** (APP): "Something I found for you", bold headline, body with the range, the 78% line, the **Q3 Revenue Outlook** Tableau card (chip, chart, legend, footer), four bullets, "1 reply". Hover toolbar includes the Slackbot icon. Copy and chart data: DC §4, §5. **Changed 2026-10-23:** the alert is now text-only in the real Proactive Alert format (headline, ⚠️ High-severity insight, four bullets, Recommended actions (PM copy), "Autonomous insights found this for you.", Manage Alerts), per the PM recording and the alert screenshot; no chart card. Charts appear only in the canvas report.

**C1-03: Why this, why now**
- **Do:** Click "1 reply". Highlight the first bullet.
- **Say:** "Fair question: out of everything happening in my business, why this? Tableau explains: it prioritizes signals using my business context, my $48M goal, the strength of the evidence, and whether I still have time to act. It's seen this pattern before: late-stage deals without executive engagement convert at a much lower rate. That's not a one-off observation, it's a repeated pattern, which is why it's confident enough to interrupt my morning. And it learns: the signals I act on get stronger over time, the ones I ignore fade."
- **See:** Thread panel with the reply "Why did I receive this?" (DC §6).

**C1-04: Ask what could improve the outlook**
- **Do:** Close the thread. Hover the notification, click the Slackbot icon, choose **"What could most improve the outlook?"**
- **Say:** "Knowing isn't the goal, doing is. Each message has recommended actions that I can kick off follow-ups with Slackbot right from the notification."
- **Prompt:** `What could most improve the outlook?`
- **See:** "Suggested prompts" menu: "What could most improve the outlook?" (highlighted), "Provide feedback to improve this insight", "Schedule an agent to monitor this situation", "Write your own prompt".

**C1-05: Slackbot gives the recovery path**
- **See:** Slackbot panel opens. Slackbot (AGENT) answer with the "Used Sales Data Intelligence — Q3 scenario modeling" line, the **22% → 66%** tile and the green button **Run Pipeline Outlook Analysis Skill** (DC §7).

**C1-06: Run the skill, choose canvas**
- **Do:** Click the button, then type `canvas` when asked.
- **Prompt:** `canvas`
- **See:** Slackbot asks "message or canvas?", then confirms and shows a canvas card "Pipeline Outlook Analysis, Maya Okonkwo (you) · Canvas", "Saved to your Files." (DC §7).

**C1-07: The canvas**
- **Do:** Open the canvas. Left nav switches to Files.
- **See:** Canvas "Q3 Pipeline Outlook" with summary, three-bullet recovery path and "Deals that need attention" cards (DC §8, §9). Slackbot panel stays docked. Scrollable.

**C1-08: Recommended action on NorthStar**
- **Do:** Scroll to the NorthStar card and point at the risk reasons, then the flow box.
- **Say:** "It's telling me to focus on NorthStar, flagged as one of the strongest recovery paths. Resolving its blockers is worth an estimated $1.1M in upside. Tableau's already identified why it's at risk: declining procurement activity, no recent executive engagement, legal review hasn't started. Now I can run an executive deal review, bring the right people together, create tasks, assign owners to each blocker."
- **See:** NorthStar card, grey **Executive Deal Review Flow** box and green button **Run Flow for NorthStar** (DC §9, §10).

**C1-09: Run the flow**
- **Do:** Click **Run Flow for NorthStar**.
- **See:** Slackbot panel: "**Executive Deal Review Flow ran successfully**", five green checks, the "You'll be notified…" line and the green $1.1M callout (DC §10). Directly below it, Slackbot's monitor offer (DC §11).

**C1-10: Close the loop (assign the monitor agent)**
- **Do:** Reply to the monitor offer.
- **Say:** "Last thing I care about: did the action I take work? I set an alert on this opportunity to keep me updated if there are any changes in stage or blockers for NorthStar. Tableau checks every morning and reports back, so I never have to remember to follow up."
- **Prompt:** `yes daily for me and @Theo Lindqvist`
- **See:** Purple **Agent assigned** chip and confirmation (DC §11).

**C1-11: Give feedback**
- **Do:** Go back to the notification. Hover, Slackbot icon, choose **"Provide feedback to improve this insight"**. A "Based on Salesforce," chip appears in the composer. Type the feedback.
- **Say:** "I'm also able to give the agent feedback to make it even more personalized and relevant to me. If I tell Slackbot, 'This was helpful, but next time focus on high-risk, over-concentrated pipeline, or flag a direct report who needs coaching,' that feedback is logged and shapes my next report."
- **Prompt:** `This was helpful, but next time focus on high-risk, over-concentrated pipeline, or flag a direct report who needs coaching.`
- **See:** Slackbot (AGENT) "Used Sales Data Intelligence — Autonomous Insights", short working lines, collapsed "Used 2 tools" row, then the confirmation that feedback was logged (DC §12). Thumbs up / down under the reply.

**C1-12: A new insight shaped by the feedback**
- **Do:** Cut to the next morning (Wed Aug 19, 8:00 AM). A new message from the Salesforce app arrives. Open it.
- **See:** Second message in the Salesforce app: bold title, "⚠️ High-severity insight", "Generated 19 Aug 2026 at 13:00 UTC", four bullets, "Autonomous insights found this for you.", "For more, click Slackbot in this message and ask for your newest insights.", **Manage Alerts** button (DC §13).

**C1-13: Ask for the newest insights**
- **Do:** Hover the new message, click the Slackbot icon, type the prompt. (Alternate wording: `Generate a new report`.)
- **Say:** "The proactive notification sends only my single highest-priority insight, so I'm not overwhelmed. If I want more, I ask Slackbot for my newest insights. It pulls the rest of my insights generated autonomously by Tableau Agent, surfacing it as a Slack surface, each insight with recommended actions."
- **Prompt:** `Give me my newest insights`
- **See:** Slackbot panel with visible tool steps, "Created report: Autonomous Insights — Q3 Pipeline", a headline summary, an offer to dig deeper and a **Report** card (DC §14).

**C1-14: Open the report**
- **Do:** Click the report link or card. Left nav switches to Files. Scroll insights 01 to 04.
- **See:** Report "Autonomous Insights — Q3 Pipeline (Generated Aug 19)", "Generated just now", buttons **Share** and **Dig Deeper**, four numbered insight cards (title, severity badge, three KPI tiles, bullets, Recommended actions) (DC §15).
- **Say (ending line):** "That's the full loop: surfaced without asking, prioritized by what matters to me, turned into action, and followed through to results, all without leaving Slack. And every interaction makes it smarter and more personal to me. The more I engage, the better it gets at telling me what to act on."

## 6. Demo reset

Delete the generated canvas and report, the three tasks, the #deal-northstar-q3 channel, the meeting request, the monitor agent, the logged feedback and the Aug 19 message. Mark the Salesforce app message unread again.
