# 鴨媽媽回家 — handoff notes

Single-file mobile web game (`index.html`, ~2500 lines, no build step). Traditional Chinese UI, portrait, one-finger play.
Live at https://mochachen1225-create.github.io/ducks/ (GitHub Pages serves the `gh-pages` branch).

## Deploy
Work on `claude/lucid-bell-ojmt4h` (the repo's default branch). After a change:
```
git push origin claude/lucid-bell-ojmt4h
git push origin claude/lucid-bell-ojmt4h:gh-pages   # publishes the site (1–2 min)
```

## Owner's preferences (keep these)
- Reply in Traditional Chinese, concise. The owner tests on a phone.
- Never write personal information (names, family members, emails) into repo files.
- After every change, update NOTES.md (add a line at the top of 更新紀錄 and adjust the other sections). README.md covers intro, how to play and asset sources.
- No external images/audio, no AI/server. Only external resource: Google Font "Huninn" (粉圓) with system fallback.
- Look: clean layered paper-cut (剪紙) style — kraft/construction-paper palette (`C` object), soft shadows, no emoji as graphics.
- Ducklings: side view, black-bean eyes, each with an accessory (`ACC`). Player picks 鴨媽媽 or 鴨爸爸 (`ROLE`, `who()` for {me}/{mate}/{call} text).

## Code map (search these names)
- World: x 0–360, y grows downward, progress p = -y. River `bankL/bankR`, fork `FORK_A/B` + `islandHW`, waterfall `WF_START/WF_END/WF_X` + `wfBumps`. `rollWorld()` randomises fork position, river shape and waterfall spits each game.
- Sprites: inline SVG via `P()` → rasterised in `makeSprite` (grain + baked shadow); draw with `spr()`.
- Hazards: classes `Rocks Eagle Rapids Logs Whirl Carp Boat Kid Bags Fisher`, scheduled by `buildSchedule()`; `SPATIAL` ones never overlap. Static: `ForkRapids`, `ForkRocks`, `Litter` (ambient trash).
- Endings: home (`TITLES` random lines), mama over waterfall (`startMamaFall`, THE END), time limit `TIME_LIMIT`=120 s (`startTimeUp`). `resultLines()` is the single source for result/share texts. Share image: `makeShareImage()`.
- Sound: `Snd` (Web Audio). Adaptive music in `schedule()` driven by `Snd.setMood`; separate music/SFX toggles.
- Debug: `?ts=4` speeds up time; `window.__duck` exposes state.

## Testing
`node tools/bot.js 4 5` (needs Playwright + Chromium) plays 5 games automatically and prints ducks saved and loss reasons. It's a rough balance check, not a real player.
