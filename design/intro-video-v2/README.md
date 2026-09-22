# PodiumCall intro video, second version

The one-minute video on the landing page, remade on 22 September 2026 in the redesign's look. It is animated from the real site: the pages play in the video as they are, and the camera, the counters, the clicks and the type are laid over them.

## The narration

The shipped cut uses a new recording in Alexey's voice of the newer script (`script.json`), made on 22 September with the Higgsfield CLI on the user's second account: `audio/alexey-new-en.mp3` and `audio/alexey-new-fr.mp3`, kept in git because they were paid for (2.55 and 2.85 credits). The same takes are on Higgsfield's CDN: [English](https://d8j0ntlcm91z4.cloudfront.net/user_3Jfv7HC9rrNBFEhqokzQF3CCwre/hf_20260922_090706_fc6c6c39-29a5-41e3-b9a4-8d56ec039681.mp3), [French](https://d8j0ntlcm91z4.cloudfront.net/user_3Jfv7HC9rrNBFEhqokzQF3CCwre/hf_20260922_090747_23f907b4-4ca0-46e4-ae69-ebde47b1c8d3.mp3). They were made with:

`higgsfield generate create text2speech_v2 --prompt "$(cat audio/new-en.txt)" --variant elevenlabs --voice_id 7c2133e5-68ab-511f-9aed-9a67664382b1 --voice_type preset --wait`

Then `narrate.py en --script script.json --take audio/alexey-new-en.mp3 --out alexey2-en`, and `node render.cjs en --audio alexey2-en`.

The script talks about championships in general ("Follow the championship that's on now, and the ones still to come"), never the one on at the time, because the site moves from one to the next. The pictures show whichever championship page was live when the video was rendered.

An earlier cut on Alexey's 11 September takes (`script-alexey.json`, the first version's script) still renders with `--audio alexey-en` / `alexey-fr`; it was the fallback before the new recording existed.

It ships with the redesign (`redesign/terra`), not before, because it shows the redesigned pages.

## What is on screen

Every page is the real redesign, loaded from the static snapshot the live site serves. Nothing is mocked up. The video only does things a visitor can do (scroll, press Model rating, open the little i, search, open Send feedback) and animates what is already there: the favourites' ratings count up to their real values, the season chart draws itself, the Results figures count up, and the championship page plays its own arrival.

The order follows Alexey's script (`script-alexey.json`): the title, the dashboard, the top 20 with By points and then Model rating, an athlete's page (Noah Lyles), the little i, search ("Kipyegon"), Results, and Send feedback. Where he says "at the next big athletics championship", the championship page appears with its arrival, which was the Asian Games page when this was made.

The pages' clock is pinned to 22 September 2026, 09:00 in Riyadh, the day before the Asian Games. That is the site exactly as it stood that morning, and it is what the championship page's countdown counts down from. Change it with `--time`.

## How it is built

The pieces, all in this folder:

- `script-alexey.json` holds the recorded script, one entry per sentence, with the part of the video each sentence plays over. `script.json` holds a newer script (not recorded) that gives the championship page a scene of its own.
- `narrate.py` turns a recording into the timings the video follows. For Alexey it cuts his finished take into sentences at the pauses between them (`--take`), then lays them end to end with fixed pauses. It writes `audio/<name>.wav` and `audio/<name>.timing.json`.
- `director.html`, `director.css` and `director.js` are the video itself: a page that holds the real pages in iframes and sets everything for any moment `t`.
- `render.cjs` opens the director in Chrome, steps through the frames and pipes them to ffmpeg.

To rebuild it:

1. Start a dev server of the redesign that reads the static snapshot, on port 8082. It has to be a second one, because `terra-dev` reads the local API instead. In PowerShell: `$env:VITE_STATIC_API='1'; npm run dev -- --port 8082 --strictPort`, from `track-insights-terra`.
2. Cut the takes, with the video venv: `~/.venvs/intro-video/Scripts/python.exe narrate.py en --script script-alexey.json --take <old intro-en.mp4> --out alexey-en`, and the same for `fr`. It prints the pause it chose after each sentence; check a doubtful one against the old video's burned-in captions, which change at the same moments.
3. Check with stills, or a contact sheet of one frame a second:
   `node render.cjs en --audio alexey-en --stills 5,24.5,43`
   `node render.cjs en --audio alexey-en --every 30`
   Set `NODE_PATH` to the global `@playwright/cli/node_modules` first, so `playwright-core` is found.
4. Render: `node render.cjs en --audio alexey-en` writes `out/alexey-en/master-alexey-en.mp4`. It takes about five minutes a language at 6 frames a second.
5. Encode the master for the web and make a poster (see "Publishing" below), then copy them to `public/video/`.

## Publishing

The master is 1080p at CRF 16. For the site, re-encode it smaller:

`ffmpeg -i master-alexey-en.mp4 -c:v libx264 -preset slow -crf 26 -c:a aac -b:a 128k -movflags +faststart intro-en.mp4`

The poster is one frame of it as a JPEG, `intro-en.jpg`. The landing's `intro-video.tsx` reads `/video/intro-{en,fr}.{mp4,jpg}`, so replacing those four files is the whole change.

## Things that went wrong, so they don't again

- TanStack Start's dev server answers every HTML request with the app, so the director can't be served as a page of its own. `render.cjs` opens `/robots.txt`, a static file on the same origin, and writes the director into it with `setContent`. The iframes are then same-origin and the director can reach into them.
- The site's animations run on the page's clock, not the video's. The director pauses every CSS animation in every iframe and sets its `currentTime` from `t`, timed from the start of its scene, or from the click that caused it. Scroll-driven animations are left alone.
- React applies a click a moment after `click()` returns. Anything measured straight after a click reads the old page, which is how the rows' new places once came out unchanged. `__seek` clicks first, waits for the page to settle, and repeats until nothing changes.
- The championship page's arrival is on screen for 1.3 s after the page mounts, long before its scene. An init script keeps a copy of its markup, and the director plays that copy when the scene starts.
- Gliding the 20 rows of the top-20 table to their new order looked like a pile-up: the rows have no background on the unboxed page, and the table's wrapper clips rows that leave it. The video uses the site's own entrance instead, restarted when Model rating is pressed.
- Search reads its index the first time it opens, so the results would come a fetch later than the typing. Setup opens it once to load the index.
- The installed `@playwright/cli` expects a browser build that isn't downloaded. `render.cjs` launches the installed Chrome instead (`PW_CHANNEL` overrides).
- Git Bash heredocs mangle backslashes in Python and sed. Write scripts to files, or edit with the editor.

## Voices tried and turned down

The user chose a free voice before settling on Alexey's existing takes, and heard these, which are recorded here so they aren't offered again: Kokoro's George (English) was liked; Piper's French "mls" men's voices, Kokoro's French woman's voice, and Chatterbox (George's voice cloned into French, and its own voice) were all turned down. The Kokoro and Chatterbox setups are in `~/.venvs/intro-video` and `~/.venvs/chatterbox`, and `narrate.py` can still drive them (`narrate.py en` records the newer script in George's voice).

A new recording in Alexey's voice needs Higgsfield credits, about 6 for both languages. With one, `narrate.py --take` cuts it the same way, and the director follows whichever script its timing file names.
