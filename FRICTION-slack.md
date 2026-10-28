# FRICTION — slack-shell (Proactive Intelligence build, 2026-10-15)

Kit fixes this project needed. Nothing here was changed in `~/.claude/skills/keynote-prototype/`; each workaround lives in `slack/pi-skin.css` or `_build/gen.py`.

1. **v2 theme is lavender only.** The newer-rail captures (12–14) use the aubergine window and sidebar (#4e104d family). There is no aubergine theme, so `pi-skin.css` re-skins the frame, rail and sidebar, and `#4e104d` needs a palette waiver. Ask: ship `data-theme="v2-aubergine"`.
2. **The newer rail is missing pieces.** There's no To-dos tab, no Saved row in the pinned list, no workspace column (the "B" tile + add) and no Files sidebar (All files / Canvases / Lists / Recently viewed). All were hand-built in the skin.
3. **No canvas or report surface.** Slack Canvas (doc header, Share, H1/byline body) and the Autonomous Insights report (header with Share/Dig Deeper, insight cards, KPI tiles, footer) have no shell or component, so they were hand-built.
4. **`slackbot-color` icon renders blank** through the tinyspeck icon helper. We used the seed's inline Slackbot SVG instead.
5. **The `shell-icon-drift` rule only checks `header`.** Rail, sidebar and panel icons aren't covered, so icon swaps there go unflagged.
6. **False positive in `text-overlap` (r4).** A panel message scrolled under the sticky Slackbot header is clipped by its `overflow` container, yet it's reported as overlapping `div.sk-sb-title`. The rule should intersect with the scroll container's clip rect.
7. **`shell-provenance` region drift** reads 37–86% on every page because the skin restyles the chrome (item 1) and the canvas/report views replace the channel body (item 3). That's expected until 1–3 exist in the kit.
8. **`:visited` link color.** A shell link color without `:visited` turns a demo link green or purple once the anchor has been followed in the same browser profile (we hit it in the canvas). Add `a:visited` next to every link color in the shell CSS.

9. **Critics contradict each other when a screen's plate set lacks the beat's own plate.** For C1-05, a batch-2 critic called the Slackbot "AGENT" chip invented, based on generic plates 17-10-15 and 17-18-33. The beat plate 16-18-43 shows the chip. Batch 1 asked for a "you" chip on every Maya row, but the panel plates (16-18-07) show it only in channel messages. Kit fix: critics-workflow should always pass the beat's own intake plate first, and flag a "remove X" nit as unverified when X appears in any project plate. Lead rule used here: check the nit against the beat plate before changing anything.
