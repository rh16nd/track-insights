/* Render the intro video frame by frame.
 *
 *   node render.cjs en                      whole video -> out/en/intro-en.mp4
 *   node render.cjs fr --stills 5,14,28.5   PNG stills at those seconds -> out/fr/still-*.png
 *   node render.cjs en --every 15           every 15th frame only, as a contact sheet
 *   node render.cjs en --stills 9.8 --poster  a still without captions, for the poster
 *   node render.cjs en --from 20 --to 32    part of it, for checking
 *
 * Needs: the redesign's dev server reading the static snapshot on --base
 * (default http://localhost:8082, started with VITE_STATIC_API=1), the
 * narration from narrate.py in audio/, playwright-core (NODE_PATH pointing at
 * the global @playwright/cli's node_modules) and ffmpeg (FFMPEG, or the one
 * imageio-ffmpeg installed in ~/.venvs/intro-video).
 *
 * The pages' clock is pinned to 22 September 2026, 09:00 in Nagoya-minus-six
 * (Riyadh) time: the site exactly as it stood the day before the Asian Games,
 * which is what the countdown on the championship page counts from. */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");
const { chromium } = require("playwright-core");

const HERE = __dirname;
const argv = process.argv.slice(2);
const lang = argv[0];
if (!["en", "fr"].includes(lang)) throw new Error("usage: node render.cjs <en|fr> [options]");
const opt = (name, dflt) => {
  const i = argv.indexOf("--" + name);
  return i < 0 ? dflt : argv[i + 1];
};
const BASE = opt("base", "http://localhost:8082");
const FPS = 30;
const SCALE = Number(opt("scale", "2"));
const FROZEN_AT = new Date(opt("time", "2026-09-22T09:00:00+03:00"));
const FFMPEG = process.env.FFMPEG ||
  path.join(os.homedir(), ".venvs", "intro-video", "Lib", "site-packages", "imageio_ffmpeg", "binaries", "ffmpeg-win-x86_64-v7.1.exe");
const STEM = opt("audio", lang);
const OUT = path.join(HERE, "out", STEM);
fs.mkdirSync(OUT, { recursive: true });

const timing = JSON.parse(fs.readFileSync(path.join(HERE, "audio", `${STEM}.timing.json`), "utf8"));
const html = fs.readFileSync(path.join(HERE, "director.html"), "utf8")
  .replace("{{LANG}}", lang)
  .replace("{{CSS}}", () => fs.readFileSync(path.join(HERE, "director.css"), "utf8"))
  .replace("{{TIMING}}", () => JSON.stringify(timing))
  .replace("{{JS}}", () => fs.readFileSync(path.join(HERE, "director.js"), "utf8"));

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || "chrome" });
  const context = await browser.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: SCALE });
  await context.clock.setFixedTime(FROZEN_AT);
  await context.addInitScript((lng) => {
    try {
      localStorage.setItem("podiumcall:welcome:v1", "1");
      localStorage.setItem("podiumcall:lang", lng);
    } catch (e) { /* storage blocked */ }
    // The championship page's arrival is on screen for 1.3s after it mounts;
    // keep a copy so the video can play it when the page's turn comes.
    new MutationObserver((records) => {
      for (const r of records) for (const n of r.addedNodes) {
        if (n.nodeType !== 1 || window.__arrivalHTML) continue;
        const a = n.matches(".arrival") ? n : n.querySelector && n.querySelector(".arrival");
        if (a) window.__arrivalHTML = a.outerHTML;
      }
    }).observe(document, { childList: true, subtree: true });
  }, lang);
  const page = await context.newPage();
  page.on("pageerror", (e) => console.error("page error:", e.message));
  page.on("console", (m) => { if (m.type() === "warning" && /cue miss/.test(m.text())) console.warn(m.text()); });
  await page.goto(BASE + "/robots.txt");
  await page.setContent(html, { waitUntil: "load" });
  const t0 = Date.now();
  const info = await page.evaluate(() => window.__setup());
  console.log(`set up in ${((Date.now() - t0) / 1000).toFixed(0)}s:`, JSON.stringify(info));

  const shoot = () => page.screenshot({ type: "jpeg", quality: 93, animations: "allow", caret: "initial" });

  const stills = opt("stills", null);
  // --poster: stills without captions, for the landing's poster frame.
  if (argv.includes("--poster")) await page.evaluate(() => { document.getElementById("captions").style.display = "none"; });
  if (stills) {
    for (const t of stills.split(",").map(Number).sort((a, b) => a - b)) {
      await page.evaluate((x) => window.__seek(x), t);
      await page.screenshot({ path: path.join(OUT, `still-${t.toFixed(2)}.png`), type: "png", animations: "allow" });
      console.log("still", t);
    }
    await browser.close();
    return;
  }

  const from = Number(opt("from", "0"));
  const to = Math.min(Number(opt("to", String(info.duration))), info.duration);
  const every = Number(opt("every", "1"));
  const first = Math.round(from * FPS), last = Math.round(to * FPS);

  if (every > 1) {
    const dir = path.join(OUT, "sheet");
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    let n = 0;
    for (let f = first; f < last; f += every) {
      await page.evaluate((x) => window.__seek(x), f / FPS);
      fs.writeFileSync(path.join(dir, `f${String(n++).padStart(4, "0")}.jpg`), await shoot());
    }
    await new Promise((res, rej) => {
      const p = spawn(FFMPEG, ["-y", "-loglevel", "error", "-framerate", "1", "-i", path.join(dir, "f%04d.jpg"),
        "-vf", "scale=480:-1,tile=6x" + Math.ceil(n / 6), "-frames:v", "1", path.join(OUT, "sheet.jpg")], { stdio: "inherit" });
      p.on("exit", (c) => (c ? rej(new Error("ffmpeg " + c)) : res()));
    });
    console.log(`sheet: ${n} frames, one every ${(every / FPS).toFixed(2)}s from ${from}s`);
    await browser.close();
    return;
  }

  const master = path.join(OUT, from === 0 && to === info.duration ? `master-${STEM}.mp4` : `part-${from}-${to}.mp4`);
  const ff = spawn(FFMPEG, [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-c:v", "mjpeg", "-framerate", String(FPS), "-i", "-",
    "-ss", String(from), "-t", String(to - from), "-i", path.join(HERE, "audio", `${STEM}.wav`),
    "-vf", "scale=1920:1080:flags=lanczos:out_range=tv:out_color_matrix=bt709,format=yuv420p",
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-c:v", "libx264", "-preset", "medium", "-crf", "16",
    "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", master,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const tStart = Date.now();
  for (let f = first; f < last; f++) {
    await page.evaluate((x) => window.__seek(x), f / FPS);
    const buf = await shoot();
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if ((f - first) % 150 === 0) {
      const done = f - first + 1, rate = done / ((Date.now() - tStart) / 1000);
      console.log(`frame ${f}/${last} (${(f / FPS).toFixed(1)}s), ${rate.toFixed(1)} fps, ${((last - f) / rate / 60).toFixed(1)} min left`);
    }
  }
  ff.stdin.end();
  await new Promise((res) => ff.on("exit", res));
  console.log("wrote", master);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
