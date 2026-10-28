# Tableau Proactive Intelligence in Slack — clickable demo (local only)

Story: DEMO-BRIEF.md · every value: DATA-CANON.md · build choices: BRIEF-GAPS-BUILD.md · feature status: CAPABILITIES.md

## Run it

Option A (no install): double-click `index.html` and click **Start the demo**. Everything is local files, with no network calls.

Option B (local server, recommended on stage): Node.js is the only requirement.
1. Once per laptop: double-click `Install to Desktop.command`. This drops Start/Stop Demos launchers on the Desktop.
2. Double-click **Start Demos**. This serves the project at http://localhost:8091/ and writes a URL sheet plus a Chrome bookmarks file to the Desktop.
3. Open http://localhost:8091/ and click **Start the demo**. Keep the Terminal window open; **Stop Demos** (or Ctrl-C) ends it.

Browser: Chrome at 1680x950 (or full screen on a 16:10 display). The pages were gated at that size.

## Presenting

| Key / click | Does |
|---|---|
| Click the real UI element (nothing is highlighted; see the table below) | next beat |
| → / PageDown | advance the beats that have no click (C1-08 canvas scroll, C1-14 report scroll); during an animation it hurries it |
| ← / PageUp | back one beat |
| Shift+R | restart the scene |
| ` (backtick) | backstage beat list; Esc closes it |
| `?beat=C1-07` on a scene URL | jump straight to a beat |

Day 1 is `slack/scene-day1.html` (C1-01 … C1-11). After C1-11, → goes to `slack/scene-day2.html` (C1-12 … C1-14).

| Beat | Click |
|---|---|
| C1-01 | (load) DM with Nora; click **Salesforce** in Apps |
| C1-02 → 03 | **1 reply** |
| C1-03 → 04 | close the thread (×), then the Slackbot icon in the message's hover toolbar |
| C1-04 → 05 | **What could most improve the outlook?** |
| C1-05 → 06 | **Run Pipeline Outlook Analysis Skill** ("canvas" self-types) |
| C1-06 → 07 | the **Pipeline Outlook Analysis** canvas card |
| C1-07 → 08 | → (scrolls to NorthStar) |
| C1-08 → 09 | **Run Flow for NorthStar** |
| C1-09 → 10 | the Slackbot composer (the reply self-types) |
| C1-10 → 11 | **Home** in the rail, the Slackbot icon, then **Provide feedback to improve this insight** |
| C1-12 | (Day 2 load) click **Salesforce** |
| C1-12 → 13 | the new insight, then its Slackbot icon ("Give me my newest insights" self-types) |
| C1-13 → 14 | the report card or link; → scrolls the report |

Static stills for every beat are in `slack/C1-NN-slack-panel.html`.

## Rebuild

The pages are generated. Edit `_build/gen.py` (markup and flow) or `slack/pi-skin.css`, then run:

    cd /tmp && python3 -I "<project>/_build/gen.py" "<project>"
    bash "<project>/gate-all.sh"
