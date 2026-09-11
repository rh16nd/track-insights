# PodiumCall intro video

A one-minute animated walkthrough of the site for people who find it confusing. It lives on the landing page, under the two main buttons. Pressing the card opens a player on top of the page, in English or French depending on the language the site is set to, and it works the same on a phone and on a desktop. Everything on screen is a real screenshot of the live site, and the narration only describes what those screenshots show.

## The finished videos (11 September 2026)

| | Files on the site | Length | Size |
|---|---|---|---|
| English | `public/video/intro-en.mp4`, poster `intro-en.jpg` | 60.7 s | about 7 MB |
| French | `public/video/intro-fr.mp4`, poster `intro-fr.jpg` | 67.1 s | about 8 MB |

Both are landscape, 1920×1080 at 30 fps, H.264 at CRF 27 with AAC audio. The same files are on Higgsfield's CDN ([English](https://d2ol7oe51mr4n9.cloudfront.net/user_3HEO2LhKOM5ucryl5rl5l8E8edH/fb6aaa2e-ac57-4bab-b0e1-566838dc2a38.mp4), [French](https://d2ol7oe51mr4n9.cloudfront.net/user_3HEO2LhKOM5ucryl5rl5l8E8edH/0b2f2308-a0db-4d45-a856-684b419ee327.mp4)), but the site serves its own copies because its CSP only allows media from its own origin.

The screenshots were taken on 11 September, during the Budapest championship. The narration never names a championship, so when the site moves on you can re-run the capture and the render and keep the same narration.

## What the animation does

The site sits in a browser window on a brick-red background with slowly drifting lane lines, and the address bar shows the real path of each page. Between sentences the camera eases in on the part of the page being described. When the narration reaches a control it names ("Model rating", the little i, search, Send feedback), a pointer glides to it, a ring pulses where it clicks, and the screenshot taken after the real click fades in. Moving to another page slides sideways. Moving further down the same page is a real scroll: the renderer finds where the two screenshots overlap, stitches them into one tall page and scrolls through it, with the site's top bar staying put. It opens on a title card and closes on the site's address.

Captions come from the script, not from speech recognition, and are timed with Whisper's word timings. A sentence too wide for one line is split into balanced parts. The split prefers a break after a comma or before words like "at", "and", "pour" or "avant", and never leaves "the" or "de" at the end of a caption.

## How it's built

Everything runs in Higgsfield's cloud sandbox (`sandbox_exec`), which already has Playwright, ffmpeg, Pillow and faster-whisper. Work from `/home/user/anim`.

1. Narration comes from `generate_audio` with `model: text2speech_v2`, `variant: elevenlabs`, `voice_type: preset` and `voice_id: 7c2133e5-68ab-511f-9aed-9a67664382b1` (the voice called Alexey). Submit one language at a time, because two at once hit a 429 rate limit. The takes used here can be downloaded again for free as `en.mp3` ([link](https://d8j0ntlcm91z4.cloudfront.net/user_3HEO2LhKOM5ucryl5rl5l8E8edH/hf_20260911_111335_01aa0c97-4e4e-463b-a9ea-59cac93e25a4.mp3)) and `fr.mp3` ([link](https://d8j0ntlcm91z4.cloudfront.net/user_3HEO2LhKOM5ucryl5rl5l8E8edH/hf_20260911_111928_01233201-ac01-4f0d-b630-1fd0197747e0.mp3)).
2. `export NODE_PATH="$(npm root -g)" && node cap4.cjs` takes 17 screenshots per language at 1440×782 with a device scale of 2 into `cap4/<lang>/`. It also writes a `meta.json` with the position of everything the video zooms to or clicks. It takes about two and a half minutes.
3. `DRY=1 python3 render_anim.py <en|fr>` prints the captions with their timings and widths without rendering anything. Read them before a full render. `FRAMES=scroll` instead renders only the frames around each same-page scroll into `out/<lang>/frames.jpg`, in a few seconds, and prints how the two screenshots were matched.
4. `CRF=27 python3 render_anim.py <en|fr>` writes `out/<lang>/final.mp4`, `poster.jpg` and `qa.jpg`, a 12-frame contact sheet of the moments most likely to go wrong. Each language takes a little over two minutes, and both can run at the same time.
5. `REBURN=1 python3 render_anim.py <en|fr>` reuses `out/<lang>/base.mp4` and only redoes the captions, the final encode, the poster and the contact sheet, in about a minute.

To get a file out of the sandbox, create a slot with `media_upload`, `curl -X PUT` the file to the returned URL, then call `media_confirm`. The finished files go in `public/video/` as `intro-en.mp4`, `intro-fr.mp4`, `intro-en.jpg` and `intro-fr.jpg`.

## What it costs

Only the narration costs credits. Screenshots, rendering and uploads in the sandbox are free, so the animated version cost nothing: it reuses the narration recorded for the earlier static one.

The English take in Alexey's voice cost 2.85 credits and the French take 3.3. An earlier English take in a different voice (Arthur, 2.85) was replaced. Recording the fuller script below costs 8.85 credits for both languages.

## Scripts

The 60-second scripts, exactly as recorded, are the `SCR` dictionary in `render_anim.py`.

### Fuller version: approved, not recorded yet

This one adds the championship page, the country and team pages, and Stats, for about 80 seconds. `cap4.cjs` already captures the extra screens (07 to 11). To render it, swap these into `SCR`, give `BEATS` one sentence index per scene, and add scenes for screens 07 to 11 to `SC`.

English:

> This is PodiumCall. It shows who is most likely to finish in the top three at the next big athletics championship, using real results from World Athletics. Start on the Dashboard. Each card is the athlete our model rates highest in one event. Open Track or Field to see the top 20 in any event. By points ranks them on their best performance this season. Model rating shows who the model thinks will reach the podium. When the two lists disagree, take a closer look. Choose a name to open that athlete's page. You'll see their best marks, their races this year, and their chance of a top-three finish. That's not a chance of winning. Press the little i next to any number to see what it means. When a big championship is on, it gets its own page. It shows how athletes got in, who already has a place, and the model's podium picks. Every country has its own team page too, with its athletes and its best performances this season. If a country has relay teams, they're there too. Stats compares the best performances across every event on World Athletics points, so you can see which events are packed with talent. Use search to find any ranked athlete, or any country. Results shows what we predicted before each championship, and what really happened. Spotted a mistake? Press Send feedback at the bottom of any page.

French:

> Voici PodiumCall. Le site montre qui a le plus de chances de finir dans le top trois du prochain grand championnat d'athlétisme, à partir des vrais résultats de World Athletics. Commencez par le Tableau de bord. Chaque carte montre l'athlète que notre modèle place en tête dans une épreuve. Ouvrez Piste ou Concours pour voir le top 20 de chaque épreuve. Avec Par points, les athlètes sont classés selon leur meilleure performance de la saison. Avec Évaluation du modèle, vous voyez qui, selon le modèle, montera sur le podium. Quand les deux classements ne sont pas d'accord, regardez de plus près. Choisissez un nom pour ouvrir la fiche de l'athlète : ses meilleures marques, ses courses de l'année et sa chance de finir dans le top trois. Pas sa chance de gagner. Appuyez sur le petit i à côté d'un chiffre pour savoir ce qu'il veut dire. Quand un grand championnat a lieu, il a sa propre page. Vous y verrez comment les athlètes se sont qualifiés, qui a déjà sa place, et les pronostics de podium du modèle. Chaque pays a aussi sa page d'équipe, avec ses athlètes et ses meilleures performances de la saison. Si le pays a des équipes de relais, elles y figurent aussi. Stats compare les meilleures performances de toutes les épreuves grâce aux points World Athletics, pour voir quelles épreuves regorgent de talents. La recherche trouve n'importe quel athlète classé, ou n'importe quel pays. Résultats montre ce que nous avions prévu avant chaque championnat, et ce qui s'est vraiment passé. Une erreur ? Appuyez sur Envoyer un retour, en bas de chaque page.

Two accuracy limits shape that wording. The model doesn't rate relay teams, so the script only says relay teams appear on country pages. And the championship page projects 25 of its 28 events (not the two mixed relays or men's hammer), so the script never says "every event".

## Things that went wrong, so they don't again

Each of these produced a wrong screenshot, a wrong frame or a lost afternoon at least once.

- The sandbox can reset between two calls without warning, and everything in it goes. Keep the scripts in this folder, not only in the sandbox. The narration can be downloaded again from the links above.
- Long foreground `sandbox_exec` calls make the connector time out. Run captures and renders as background jobs and read their log.
- The site scrolls smoothly, and a second scroll during the glide cancels the first, which gave two identical screenshots. The capture context uses `reducedMotion: 'reduce'`, and the site's CSS switches smooth scrolling off under it.
- The info tip closes whenever the page scrolls, and clicking it without hovering first toggles it shut. Scroll instantly, hover, then click.
- Model rating is a `role="tab"` with `aria-selected`. The only `aria-pressed` buttons on the page are the EN/FR switch, which an earlier selector kept flipping.
- Sliding one screenshot off and the next one on showed the site's sticky top bar halfway down the frame, like two pages stacked, and a dissolve showed the same heading twice. Same-page moves are now a real scroll through the two screenshots stitched together. They fall back to the dissolve only when the two screenshots don't overlap.
- A 0.3 s crossfade between a table before and after a click showed both tables at once. Real clicks swap instantly, so the fade is 0.16 s.
- Filling each caption up to a fixed number of characters left single words on screen ("means."). Captions are now split by measured width into balanced parts.
- The Higgsfield workflow's caption tools force capital letters, show two words at a time, and turned Whisper hearing "Podium Call" into a stray "call." caption. The render scripts build captions from the script instead.
- Once anything has fetched an uploaded file, overwriting it can leave the old version on the CDN. Upload a changed file to a new slot, or overwrite only files nobody has fetched yet.
- `pkill -f "some text"` inside `sandbox_exec` kills the command itself, because the command line contains that text. Kill by process ID.
- Git Bash on Windows mangles backslashes in heredocs, so anything with a regex belongs in the sandbox or in a file.
- While the desktop app's Browser pane is hidden, CSS animations stay on their first frame and screenshots come back stale. The player's fade-in reads as `opacity: 0` there. That is the pane, not the page, so check the DOM instead of the picture.

## The earlier static version

Before the animated cut there was a static one, with screenshots cut together and no camera moves, in a vertical and a landscape shape. It was built with `capture.cjs`, `render.py` and `reburn.py` from `/home/user/final`. For the vertical shape, remember that on phones the search box stays hidden until the search button is pressed, so select `input[type=search]:visible`.

| | Vertical, 1080×1920 | Landscape, 1920×1080 | Length |
|---|---|---|---|
| English | [en-vertical](https://d2ol7oe51mr4n9.cloudfront.net/user_3HEO2LhKOM5ucryl5rl5l8E8edH/2ac305d9-7d33-4b81-91cf-bc9b181fba4f.mp4) | [en-landscape](https://d2ol7oe51mr4n9.cloudfront.net/user_3HEO2LhKOM5ucryl5rl5l8E8edH/090a824e-a40d-4b55-b124-1c98a1a1c768.mp4) | 56.7 s |
| French | [fr-vertical](https://d2ol7oe51mr4n9.cloudfront.net/user_3HEO2LhKOM5ucryl5rl5l8E8edH/9065c6e1-c4da-4d86-956d-d16e557e029d.mp4) | [fr-landscape](https://d2ol7oe51mr4n9.cloudfront.net/user_3HEO2LhKOM5ucryl5rl5l8E8edH/19897471-97e6-453c-a01b-dd2206e6dd9f.mp4) | 63.1 s |
