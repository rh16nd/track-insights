/* The intro video's director. render.cjs opens a same-origin page, writes
 * director.html into it with the narration timings in window.__TIMING, calls
 * window.__setup() once and then window.__seek(t) for every frame.
 *
 * Every frame is a function of t: the camera, the scroll, the counters, the
 * clicks and the real pages' own CSS animations (paused and set to the right
 * time) all follow from t, so a render comes out the same every time. The
 * pages are the real site in iframes; the video moves the camera over them,
 * animates what is already there, and lays kinetic type and captions on top.
 * Nothing on screen is invented.
 *
 * Two scripts can drive it (timing.script): script-alexey.json, the 60-second
 * script Alexey recorded on 11 September, and script.json, the newer one that
 * gives the championship page its own scene. Moments are found by phrase, not
 * by line number, because the French splits its sentences differently. */
(() => {
  "use strict";
  const W = 1440;
  const H = 810;
  const T = window.__TIMING;
  const LANG = T.lang;
  const PLAN = /alexey/.test(T.script || "") ? "alexey" : "new";

  // ── Phrases looked up in the spoken script to time each action.
  const PHRASES = {
    alexey: {
      en: {
        top3: "top three at", next: "at the next big", real: "using real", card: "Each card", track: "Track",
        field: "Field", top20: "top 20", best: "best performance", model: "Model rating", podium: "reach the podium",
        disagree: "two lists disagree", closer: "take a closer look", name: "Choose a name", marks: "best marks",
        races: "their races", chance: "chance of a top-three", winning: "not a chance of winning",
        littlei: "little i", means: "to see what it means", search: "Use search", notcomp: "even if",
        happened: "really happened", feedback: "Send feedback",
      },
      fr: {
        top3: "top trois du", next: "du prochain grand", real: "à partir des vrais", card: "Chaque carte",
        track: "Piste", field: "Concours", top20: "top 20", best: "meilleure performance",
        model: "Évaluation du modèle", podium: "montera sur le podium", disagree: "deux classements",
        closer: "regardez de plus près", name: "Choisissez un nom", marks: "meilleures marques", races: "ses courses",
        chance: "chance de finir dans le top trois", winning: "Pas sa chance de gagner", littlei: "petit i",
        means: "pour savoir", search: "La recherche", notcomp: "même ceux", happened: "vraiment passé",
        feedback: "Envoyer un retour",
      },
    },
    new: {
      en: {
        top3: "top three at", next: "at the next big", real: "using real", card: "Each card", track: "Track",
        field: "Field", top20: "top 20", best: "best performance", model: "Model rating", podium: "reach the podium",
        name: "Choose a name", marks: "best marks", races: "their races", titles: "titles", own: "its own page",
        chances: "podium chances", ebe: "event by event", happened: "really happened",
        littlei: "little i", means: "to see what it means",
      },
      fr: {
        top3: "top trois du", next: "du prochain grand", real: "à partir des vrais", card: "Chaque carte",
        track: "Piste", field: "Concours", top20: "top 20", best: "meilleure performance",
        model: "Évaluation du modèle", podium: "place sur le podium", name: "Choisissez un nom",
        marks: "meilleures marques", races: "ses courses", titles: "palmarès", own: "sa propre page",
        chances: "chances de podium", ebe: "épreuve par épreuve",
        happened: "vraiment passé", littlei: "petit i", means: "pour savoir",
      },
    },
  }[PLAN][LANG];

  // ── Words on screen, and how the pages name things, in each language.
  const TEXT = {
    en: {
      top3: [["Most", "likely", "to", "finish"], ["in", "the", "*top", "*three"]],
      top3Size: "92px", podiumRight: "120px",
      champ: "At the next big championship",
      real: "Real results from World Athletics",
      last: [["Nothing", "is", "changed"], ["afterwards."]],
      modelTab: /model/i, pointsCol: /^points/i, ratingCol: /model rating/i, honours: /record and ranking/i,
      glance: /at a glance/i, expand: /ultimate/i, searchBtn: /search/i, feedbackBtn: /send feedback/i,
      chancePhrase: /chance of a\s+top-three finish/i, query: "Kipyegon",
    },
    fr: {
      top3: [["Qui", "a", "le", "plus", "de", "chances"], ["de", "finir", "dans", "le", "*top", "*trois"]],
      // Longer than the English: smaller, and the podium further right, so they never overlap.
      top3Size: "78px", podiumRight: "60px",
      champ: "Au prochain grand championnat",
      real: "Les vrais résultats de World Athletics",
      last: [["Rien", "n’est", "modifié"], ["après", "coup."]],
      modelTab: /mod[eè]le/i, pointsCol: /^points/i, ratingCol: /valuation/i, honours: /palmar|classement/i,
      glance: /coup d/i, expand: /ultimate/i, searchBtn: /recherch/i, feedbackBtn: /envoyer un retour/i,
      chancePhrase: /finir dans les trois premiers|chance de finir dans le top\s+trois|trois premiers/i, query: "Kipyegon",
    },
  }[LANG];

  // ── Easing: the animate skill's curves, solved exactly.
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let lo = 0, hi = 1, t = x;
      for (let i = 0; i < 40; i++) {
        const v = sx(t);
        if (Math.abs(v - x) < 1e-6) break;
        if (v < x) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return sy(t);
    };
  }
  const OUT = bezier(0.23, 1, 0.32, 1);      // entering
  const INOUT = bezier(0.77, 0, 0.175, 1);   // moving on screen
  const LINEAR = (x) => Math.min(1, Math.max(0, x));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, start, dur, ease = OUT) => ease(clamp((t - start) / dur));

  /** Keyframed value: [[t, v], ...] eased between neighbours, held outside. */
  function keyed(keys, t, ease = INOUT) {
    keys = keys.filter((k) => k && Number.isFinite(k[0]));
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [t1, v1] = keys[i];
      const [t0, v0] = keys[i - 1];
      if (t <= t1) {
        const k = ease(clamp((t - t0) / (t1 - t0 || 1)));
        if (typeof v0 === "number") return lerp(v0, v1, k);
        const o = {};
        for (const key of Object.keys(v0)) o[key] = lerp(v0[key], v1[key], k);
        return o;
      }
    }
    return keys[keys.length - 1][1];
  }

  // ── Timings from the narration.
  const lines = T.lines;
  function timeIn(i, phrase) {
    const L = lines[i];
    const idx = L.text.toLowerCase().indexOf(phrase.toLowerCase());
    if (idx < 0) return null;
    let pos = 0;
    for (const s of L.segments) {
      const at = L.text.indexOf(s.text, pos);
      const end = at + s.text.length;
      if (idx >= at && idx < end) return s.start + (s.end - s.start) * ((idx - at) / s.text.length);
      pos = end;
    }
    return L.start;
  }
  /** When a phrase is spoken, searching the whole script in order. */
  function cue(key) {
    const phrase = PHRASES[key];
    if (!phrase) return NaN;
    for (let i = 0; i < lines.length; i++) {
      const t = timeIn(i, phrase);
      if (t != null) return t;
    }
    console.warn("cue miss: " + key + " (" + phrase + ")");
    return NaN;
  }
  const first = (scene) => lines.find((l) => l.scene === scene);
  const last = (scene) => [...lines].reverse().find((l) => l.scene === scene);
  const C = { end: T.duration, l1: lines[0].start, l2: lines[1].start };
  for (const key of Object.keys(PHRASES)) C[key] = cue(key);
  for (const scene of ["dashboard", "rankings", "athlete", "info", "search", "championship", "results", "feedback"]) {
    const f = first(scene), l = last(scene);
    // A phrase of the same name ("search", "feedback") keeps its own time.
    if (f) {
      if (!(scene in C)) C[scene] = f.start;
      C[scene + "End"] = l.end;
    }
  }
  const lastLine = lines[lines.length - 1];

  // Scene changes.
  const B = PLAN === "alexey" ? {
    champ: C.next - 0.05,          // a glimpse of the championship page, as it is named
    champOut: C.real - 0.1,
    dash: C.dashboard - 0.55,
    track: C.rankings - 0.6,
    athlete: C.name + 0.45,
    results: C.results - 0.55,
    outro: lastLine.end + 0.55,
  } : {
    dash: C.dashboard - 0.55,
    track: C.rankings - 0.6,
    athlete: C.name + 0.35,
    champ: C.championship - 0.5,
    results: C.results - 0.55,
    outro: lastLine.end + 0.55,
  };

  // ── Stage.
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, parent, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    if (parent) parent.appendChild(n);
    return n;
  };
  const stage = $("#stage");

  // The real pages, one iframe each, loaded up front and kept alive.
  const SHOTS = {
    dash: { src: "/dashboard", born: B.dash, z: 2 },
    track: { src: "/track", born: B.track, z: 3 },
    athlete: { src: "/athlete/men_100m/Noah%20LYLES", born: B.athlete, z: 4 },
    champ: { src: "/championship", born: B.champ, z: 6 },
    results: { src: "/results", born: B.results, z: 7 },
  };
  for (const [key, s] of Object.entries(SHOTS)) {
    s.key = key;
    s.el = el("div", "shot", stage);
    s.el.id = "shot-" + key;
    s.el.style.zIndex = s.z;
    s.cam = el("div", "cam", s.el);
    s.frame = el("iframe", "", s.cam);
    s.frame.src = s.src;
    s.marks = el("div", "layer", s.cam);
    s.reg = new WeakMap();
    s.eventBorn = s.born;
  }
  const S = SHOTS;
  const doc = (s) => s.frame.contentDocument;
  const win = (s) => s.frame.contentWindow;

  /** Pause every CSS animation and transition on a page and set it to where it
   *  should be at t, timed from the shot's start, or from the last thing the
   *  video did on the page (a click) if it appeared after that. Scroll-driven
   *  animations are left to the scroll. */
  function drive(s, t) {
    const d = doc(s);
    if (!d) return;
    for (const a of d.getAnimations()) {
      if (a.timeline && a.timeline !== d.timeline && !(a.timeline instanceof win(s).DocumentTimeline)) continue;
      let born = s.reg.get(a);
      if (born === undefined) {
        // After a click that re-mounts table rows, their entrance would replay
        // under the glide; those land already finished.
        // Anything that appears within half a second of a click is timed from
        // the click; later arrivals (scroll reveals) from when they appear.
        born = t < s.born ? s.born
          : s.instantAfterEvent && s.eventBorn > s.born ? -1e6
          : t - s.eventBorn < 0.5 ? s.eventBorn : t;
        s.reg.set(a, born);
      }
      if (a.playState !== "paused") a.pause();
      a.currentTime = Math.max(0, (t - born) * 1000);
    }
  }

  function scrollTo(s, y) {
    const w = win(s);
    if (w && Math.abs(w.scrollY - y) > 0.5) w.scrollTo({ top: y, left: 0, behavior: "instant" });
  }
  const rect = (node) => node.getBoundingClientRect();
  const center = (r, s) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2, s });

  /** Look at (x, y) at scale s, never past the page's edges. */
  function camTransform(c) {
    const s = Math.max(1, c.s);
    const x = clamp(c.x, W / (2 * s), W - W / (2 * s));
    const y = clamp(c.y, H / (2 * s), H - H / (2 * s));
    return `translate(${W / 2 - x * s}px, ${H / 2 - y * s}px) scale(${s})`;
  }
  const HOME = { x: W / 2, y: H / 2, s: 1 };

  /** Marks laid over a real page: a ring round a control, a wash over text. */
  const mark = (s, cls) => el("div", cls, s.marks);
  function place(m, r, pad, opacity, scale = 1) {
    if (!m || !r) return;
    m.style.left = r.left - pad + "px";
    m.style.top = r.top - pad + "px";
    m.style.width = r.width + pad * 2 + "px";
    m.style.height = r.height + pad * 2 + "px";
    m.style.opacity = opacity;
    m.style.transform = `scale(${scale})`;
  }
  const showFor = (t, at, until) => prog(t, at, 0.3) * (1 - prog(t, until, 0.35));

  /** "63.7%" at k=0.5 -> "31.9%": the first number in a label, counted up. */
  function counted(text, k) {
    const m = text.match(/(\d+(?:[.,]\d+)?)/);
    if (!m) return text;
    const raw = m[1];
    const sep = raw.includes(",") ? "," : ".";
    const dec = raw.includes(sep) ? raw.split(sep)[1].length : 0;
    const v = parseFloat(raw.replace(",", ".")) * k;
    return text.slice(0, m.index) + v.toFixed(dec).replace(".", sep) + text.slice(m.index + raw.length);
  }
  function count(node, t, at, dur = 1.1) {
    if (!node) return;
    if (node.dataset.orig == null) node.dataset.orig = node.textContent;
    const k = prog(t, at, dur);
    const txt = k >= 1 ? node.dataset.orig : counted(node.dataset.orig, k);
    if (node.textContent !== txt) node.textContent = txt;
  }
  /** One rect per line a phrase occupies inside an element, for underlining. */
  function phraseRects(root, re) {
    if (!root) return [];
    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let full = "";
    const nodes = [];
    while (walker.nextNode()) {
      nodes.push([walker.currentNode, full.length]);
      full += walker.currentNode.textContent;
    }
    const m = full.match(re);
    if (!m) return [];
    const range = root.ownerDocument.createRange();
    const locate = (pos) => {
      for (let i = nodes.length - 1; i >= 0; i--) if (pos >= nodes[i][1]) return [nodes[i][0], pos - nodes[i][1]];
      return [nodes[0][0], 0];
    };
    const [a, ao] = locate(m.index);
    const [b, bo] = locate(m.index + m[0].length);
    range.setStart(a, ao);
    range.setEnd(b, Math.min(bo, b.textContent.length));
    // getClientRects gives one rect per text run; merge the runs on each line.
    const rows = [];
    for (const r of range.getClientRects()) {
      if (r.width < 1) continue;
      const line = rows.find((l) => Math.abs(l.top - r.top) < r.height / 2);
      if (line) {
        line.left = Math.min(line.left, r.left);
        line.right = Math.max(line.right, r.right);
        line.bottom = Math.max(line.bottom, r.bottom);
      } else {
        rows.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
      }
    }
    return rows.sort((a, b) => a.top - b.top).map((l) => ({ ...l, width: l.right - l.left, height: l.bottom - l.top }));
  }
  /** React keeps its own value for inputs; set it the way a keystroke would. */
  function typeInto(input, value) {
    if (!input || input.value === value) return;
    const setter = Object.getOwnPropertyDescriptor(input.ownerDocument.defaultView.HTMLInputElement.prototype, "value").set;
    setter.call(input, value);
    input.dispatchEvent(new input.ownerDocument.defaultView.Event("input", { bubbles: true }));
  }

  // ── Kinetic type: words rise out of a mask.
  function kinetic(parent, rows, style) {
    const box = el("div", "kt", parent);
    Object.assign(box.style, style || {});
    const words = [];
    for (const row of rows) {
      const ln = el("span", "ln", box);
      row.forEach((w, i) => {
        const gold = w.startsWith("*");
        words.push(el("span", "w" + (gold ? " gold" : ""), ln, gold ? w.slice(1) : w));
        if (i < row.length - 1) ln.appendChild(document.createTextNode(" "));
      });
    }
    return { box, words };
  }
  function reveal(k, t, at, stagger = 0.06, dur = 0.7, outAt = Infinity) {
    k.words.forEach((w, i) => {
      const a = prog(t, at + i * stagger, dur);
      const o = prog(t, outAt + i * 0.025, 0.45, INOUT);
      w.style.transform = `translateY(${(1 - a) * 105 - o * 105}%)`;
      // "" rather than "visible": a visible child would show through a hidden scene.
      w.style.visibility = a <= 0 || o >= 1 ? "hidden" : "";
    });
  }

  // ── Title.
  const title = el("div", "shot", stage);
  title.id = "title";
  title.style.zIndex = 1;
  const photo = el("div", "photo", title);
  photo.style.backgroundImage = "url(/landing/hero-start-line-2400.webp)";
  el("div", "shade", title);
  const hero = el("div", "hero-word", title);
  hero.style.top = "300px";
  const heroK = kinetic(hero, [["PodiumCall"]], { position: "relative", fontSize: "168px", width: "100%" });
  const brand = el("div", "brand", title);
  brand.innerHTML = '<span class="bars"><i></i><i></i><i></i></span><span>PODIUMCALL</span>';
  Object.assign(brand.style, { left: "56px", top: "48px", height: "26px", fontSize: "22px" });
  const bars = [...brand.querySelectorAll(".bars i")];
  [["var(--gold)", 14], ["var(--terracotta)", 24], ["var(--gold-light)", 18]].forEach(([c, h], i) => {
    bars[i].style.background = c;
    bars[i].style.height = h + "px";
  });
  const top3K = kinetic(title, TEXT.top3, { left: "96px", top: "178px", fontSize: TEXT.top3Size });
  const podium = el("div", "podium", title);
  Object.assign(podium.style, { right: TEXT.podiumRight, top: "180px", height: "260px" });
  const steps = [["2", 150, "var(--gold-light)"], ["1", 210, "var(--gold-strong)"], ["3", 110, "var(--terracotta-light)"]]
    .map(([n, h, c]) => {
      const b = el("b", "", podium, n);
      b.style.height = h + "px";
      b.style.background = c;
      return b;
    });
  const champEyebrow = el("div", "eyebrow", title, TEXT.champ);
  Object.assign(champEyebrow.style, { left: "100px", top: "420px", fontSize: "18px" });
  const faces = el("div", "faces", title);
  faces.style.bottom = "118px";
  const realEyebrow = el("div", "eyebrow", title, TEXT.real);
  Object.assign(realEyebrow.style, { left: "60px", top: "178px", fontSize: "18px", color: "#fff" });
  const realK = kinetic(title, [TEXT.real.split(" ")], { left: "60px", top: "214px", fontSize: "64px", maxWidth: "1300px" });
  realEyebrow.style.display = "none";

  function renderTitle(t) {
    const until = B.dash + 0.05;
    title.style.visibility = t < until ? "visible" : "hidden";
    if (t >= until) return;
    photo.style.transform = `scale(${lerp(1.12, 1.0, prog(t, 0, B.dash, LINEAR))})`;
    photo.style.opacity = prog(t, 0, 1.2);
    reveal(heroK, t, C.l1 - 0.25, 0, 0.9, C.l2 - 0.1);
    const lock = prog(t, C.l2 - 0.2, 0.7);
    brand.style.opacity = lock;
    brand.style.transform = `translateY(${(1 - lock) * 10}px)`;
    bars.forEach((b, i) => { b.style.transform = `scaleY(${lerp(0.15, 1, prog(t, C.l2 - 0.2 + i * 0.08, 0.6))})`; });
    // "most likely to finish in the top three", the podium rising with it.
    const leave = PLAN === "alexey" ? B.champ - 0.3 : C.real - 0.35;
    // The podium needs a second on screen before it goes: with Alexey the
    // championship follows "top three" at once, so the words come in faster.
    const podiumAt = Math.min(C.top3, leave - 1.2);
    reveal(top3K, t, C.l2 + 0.1, Math.max(0.04, (podiumAt - C.l2 - 0.2) / top3K.words.length), 0.7, leave);
    steps.forEach((b, i) => {
      const k = prog(t, podiumAt + [0.12, 0, 0.24][i], 0.8);
      const o = prog(t, leave, 0.5, INOUT);
      b.style.transform = `translateY(${o * 30}px) scaleY(${lerp(0.08, 1, k)})`;
      b.style.opacity = Math.min(k * 3, 1) * (1 - o);
    });
    // In the newer script the championship is only named here, so it is typed.
    champEyebrow.style.display = PLAN === "alexey" ? "none" : "";
    const ce = prog(t, C.next - 0.1, 0.6);
    champEyebrow.style.opacity = ce * (1 - prog(t, C.real - 0.35, 0.45, INOUT));
    champEyebrow.style.transform = `translateY(${(1 - ce) * 14}px)`;
    // "using real results from World Athletics": the athletes, as the site shows them.
    reveal(realK, t, C.real + 0.05, 0.05, 0.7);
    [...faces.children].forEach((f, i) => {
      const k = prog(t, C.real + 0.1 + i * 0.07, 0.8);
      const drift = prog(t, C.real, B.dash + 0.05 - C.real, LINEAR) * -110;
      f.style.transform = `translate(${(1 - k) * 260 + drift}px, ${(1 - k) * 30}px)`;
      f.style.opacity = k;
    });
  }

  // ── Transitions.
  const band = el("div", "", stage);
  band.id = "band";
  const bandParts = ["var(--gold-strong)", "var(--terracotta)", "var(--background)"].map((c) => {
    const i = el("i", "", band);
    i.style.background = c;
    i.style.width = "140%";
    i.style.left = "0";
    return i;
  });
  /** A slanted sweep in the site's colours; the screen is covered at at+0.4. */
  function renderBand(t, at) {
    const on = t > at - 0.05 && t < at + 1.0;
    band.style.visibility = on ? "visible" : "hidden";
    if (!on) return;
    bandParts.forEach((i, n) => {
      const x = keyed([[at + n * 0.05, -150], [at + 0.4, -20], [at + 0.5, -20], [at + 0.95 - n * 0.05, 150]], t);
      i.style.transform = `translateX(${x}%) skewX(-18deg)`;
    });
  }
  const dim = el("div", "", stage);
  dim.id = "dim";
  const lastK = kinetic(stage, TEXT.last, { left: "0", right: "0", top: "280px", fontSize: "96px", textAlign: "center", zIndex: 31 });
  const rule = el("div", "", stage);
  Object.assign(rule.style, { position: "absolute", left: "560px", width: "320px", top: "520px", height: "2px",
    background: "var(--gold-strong)", zIndex: 31, transformOrigin: "0 50%", opacity: 0 });

  // ── End card.
  const outro = el("div", "shot", stage);
  outro.id = "outro";
  const oBrand = el("div", "brand", outro);
  oBrand.innerHTML = brand.innerHTML;
  Object.assign(oBrand.style, { position: "relative", height: "54px", fontSize: "46px" });
  const oBars = [...oBrand.querySelectorAll(".bars i")];
  [["var(--gold)", 30], ["var(--terracotta)", 52], ["var(--gold-light)", 40]].forEach(([c, h], i) => {
    oBars[i].style.background = c;
    oBars[i].style.height = h + "px";
    oBars[i].style.width = "16px";
  });
  const oUrl = el("div", "url", outro, "www.podiumcall.cc");

  // ── Captions, from the script, split where a line is too wide for one.
  const capBox = el("div", "", stage);
  capBox.id = "captions";
  const capSpan = el("span", "", capBox);
  const cues = [];
  lines.forEach((L, i) => {
    if (PLAN === "new" && i === lines.length - 1) return; // set as type on screen instead
    let group = [];
    const flush = () => {
      if (!group.length) return;
      cues.push({ text: group.map((s) => s.text).join(" "), start: group[0].start, end: group[group.length - 1].end });
      group = [];
    };
    for (const s of L.segments) {
      const len = group.reduce((n, g) => n + g.text.length + 1, 0) + s.text.length;
      if (group.length && len > 64) flush();
      group.push(s);
    }
    flush();
  });
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i];
    if (c.text.length <= 72) continue;
    const words = c.text.split(" ");
    let best = 1, bestDiff = Infinity, acc = 0;
    for (let k = 1; k < words.length; k++) {
      acc += words[k - 1].length + 1;
      const diff = Math.abs(acc - c.text.length / 2);
      if (diff < bestDiff) { bestDiff = diff; best = k; }
    }
    const a = words.slice(0, best).join(" "), b = words.slice(best).join(" ");
    const mid = c.start + (c.end - c.start) * (a.length / c.text.length);
    cues.splice(i, 1, { text: a, start: c.start, end: mid }, { text: b, start: mid, end: c.end });
  }
  function renderCaptions(t) {
    const idx = cues.findIndex((c, i) => t >= c.start - 0.05 &&
      t < (cues[i + 1] ? Math.min(cues[i + 1].start - 0.05, c.end + 0.5) : c.end + 0.5));
    if (idx < 0 || t >= B.outro) {
      capSpan.style.opacity = 0;
      return;
    }
    const c = cues[idx];
    if (capSpan.textContent !== c.text) capSpan.textContent = c.text;
    const k = prog(t, c.start - 0.05, 0.18);
    capSpan.style.opacity = k;
    capSpan.style.transform = `translateY(${(1 - k) * 6}px)`;
  }

  // ── The pages. Each scene puts its page in the state t calls for (scroll,
  // camera, clicks, marks); clicks are made idempotent by checking state first.
  const R = {};

  function sceneDash(t) {
    const s = S.dash;
    const strip = s.strip;
    scrollTo(s, keyed([[C.card - 0.1, 0], [C.card + 0.9, s.stripTop]], t));
    s.cam.style.transform = camTransform(keyed([[B.dash, { ...HOME, s: 1.08 }], [B.dash + 1.2, HOME],
      [C.card + 0.9, HOME], [B.track + 0.4, { x: W / 2, y: H / 2 + 20, s: 1.05 }]], t));
    if (s.navDash) place(R.dashRing, rect(s.navDash), 5, showFor(t, C.dashboard - 0.05, C.card - 0.2),
      lerp(0.9, 1, prog(t, C.dashboard - 0.05, 0.4)));
    s.cards.forEach((li, i) => {
      const at = C.card + 0.55 + i * 0.07;
      const k = prog(t, at, 0.7);
      li.style.transform = `translateY(${(1 - k) * 44}px)`;
      li.style.opacity = k;
      count(s.ratings[i], t, at + 0.15, 1.0);
    });
    strip.scrollLeft = keyed([[C.card + 1.9, 0], [B.track + 0.3, s.stripShift]], t);
  }

  function rowTops(s) {
    const out = {};
    for (const tr of doc(s).querySelectorAll("tbody tr")) {
      out[(tr.querySelector("a") || tr).textContent.trim()] = tr.getBoundingClientRect().top + win(s).scrollY;
    }
    return out;
  }
  /** Click By points / Model rating if t calls for the other one. React
   *  applies the click a moment later, so the rows' new places are read in
   *  trackSettled(), after __seek has let the page catch up. */
  function trackEvent(t) {
    const s = S.track;
    const tabs = [...doc(s).querySelectorAll("[role=tab]")];
    const modelTab = tabs.find((b) => TEXT.modelTab.test(b.textContent));
    const pointsTab = tabs.find((b) => b !== modelTab);
    if (!modelTab || !pointsTab) return false;
    const at = C.model + 0.15;
    const want = t >= at;
    if (want === (modelTab.getAttribute("aria-selected") === "true")) return false;
    s.before = rowTops(s);
    (want ? modelTab : pointsTab).click();
    s.eventBorn = want ? at : s.born;
    return true;
  }
  /** After the click: the rows come in again in their new order with the
   *  site's own staggered entrance (restarted, in case React only moved them),
   *  and the rows that moved furthest are noted for "the two lists disagree". */
  function trackSettled() {
    const s = S.track;
    if (!s.before) return;
    for (const tr of doc(s).querySelectorAll("tbody tr")) {
      tr.style.animation = "none";
      void tr.offsetWidth;
      tr.style.animation = "";
    }
    const after = rowTops(s);
    s.flip = {};
    for (const [name, y] of Object.entries(after)) if (s.before[name] != null) s.flip[name] = s.before[name] - y;
    s.before = null;
    // The rows that moved furthest: where "the two lists disagree".
    s.movers = Object.entries(s.flip).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 2).map(([n]) => n);
  }
  function sceneTrack(t) {
    const s = S.track;
    const d = doc(s);
    scrollTo(s, keyed([[C.top20 - 0.5, 0], [C.top20 + 0.6, s.tableTop]], t));
    const rows = [...d.querySelectorAll("tbody tr")];
    const byName = (n) => rows.find((tr) => (tr.querySelector("a") || tr).textContent.trim() === n);
    const lyles = [...d.querySelectorAll("tbody tr a")].find((a) => /LYLES/.test(a.textContent));
    // Camera: the table, then (older script) the rows that disagree, then the name.
    const keys = [[B.track, HOME], [C.top20 + 0.6, HOME]];
    let moverRect = null;
    let moverRects = [];
    if (PLAN === "alexey" && s.movers) {
      moverRects = s.movers.map(byName).filter(Boolean).map(rect);
      if (moverRects.length) {
        const top = Math.min(...moverRects.map((r) => r.top)), bottom = Math.max(...moverRects.map((r) => r.bottom));
        moverRect = { left: moverRects[0].left, top, width: moverRects[0].width, height: bottom - top };
        // The whole row, name to model rating, a little closer.
        const look = { x: moverRect.left + moverRect.width / 2, y: top + (bottom - top) / 2, s: 1.06 };
        keys.push([C.closer - 0.1, HOME], [C.closer + 0.7, look], [C.name - 0.05, look]);
      }
    }
    if (lyles) {
      const r = rect(lyles);
      keys.push([C.name + 0.05, keys[keys.length - 1][1]]);
      keys.push([B.athlete + 0.45, center(r, 2.4)]);
    }
    s.cam.style.transform = camTransform(keyed(keys, t));
    if (lyles) place(R.nameRing, rect(lyles), 7, showFor(t, C.name - 0.1, B.athlete + 0.3), lerp(0.9, 1, prog(t, C.name - 0.1, 0.4)));
    if (s.navTrack) place(R.trackRing, rect(s.navTrack), 5, showFor(t, C.track - 0.05, C.field + 0.5));
    if (s.navField) place(R.fieldRing, rect(s.navField), 5, showFor(t, C.field - 0.05, C.top20 + 0.2));
    const tabsBox = d.querySelector("[role=tab]")?.parentElement;
    if (tabsBox) place(R.tabRing, rect(tabsBox), 6, showFor(t, C.best - 1.2, C.model + 1.0),
      lerp(0.94, 1, prog(t, C.best - 1.2, 0.4)));
    const ths = [...d.querySelectorAll("thead th")];
    const body = d.querySelector("tbody");
    const column = (th, extraLeft = 0) => {
      const a = rect(th), b = rect(body);
      return { left: a.left - extraLeft, top: a.top, width: a.width + extraLeft, height: Math.min(b.bottom, H + 40) - a.top };
    };
    const thP = ths.find((n) => TEXT.pointsCol.test(n.textContent.trim()));
    const thR = ths.find((n) => TEXT.ratingCol.test(n.textContent.trim()));
    if (thP && body) place(R.pointsWash, column(thP), 6, showFor(t, C.best - 0.1, C.model - 0.1));
    if (thR && body) place(R.ratingWash, column(thR, 90), 6, showFor(t, C.podium - 0.3, (C.disagree || B.athlete) - 0.2));
    [R.moverWash, R.moverWash2].forEach((m, i) => place(m, moverRects[i], 3, moverRects[i] ? showFor(t, C.disagree - 0.05 + i * 0.12, C.name - 0.2) : 0));
  }

  /** The little i, then search: opened, and a name typed a letter at a time.
   *  Returns true if it changed anything the page has to catch up with. */
  function athleteEvent(t) {
    const s = S.athlete;
    let changed = false;
    const info = s.infoBtn;
    if (info && Number.isFinite(C.means)) {
      const closeAt = PLAN === "alexey" ? C.search + 0.3 : Infinity;
      const want = t >= C.means - 0.15 && t < closeAt;
      if (want !== (info.getAttribute("aria-expanded") === "true")) {
        info.click();
        s.eventBorn = want ? C.means - 0.15 : C.search + 0.3;
        changed = true;
      }
    }
    const btn = PLAN === "alexey" ? s.searchBtn : null;
    if (btn) {
      const openAt = C.search + 0.35;
      if (t >= openAt) {
        if (!s.searchInput()) {
          btn.click();
          s.eventBorn = openAt;
          return true;
        }
        const n = Math.floor(clamp((t - openAt - 0.35) / 0.1, 0, TEXT.query.length));
        const want = TEXT.query.slice(0, n);
        if (s.searchInput().value !== want) {
          typeInto(s.searchInput(), want);
          changed = true;
        }
      }
    }
    return changed;
  }
  function sceneAthlete(t) {
    const s = S.athlete;
    const d = doc(s);
    const scrollKeys = PLAN === "alexey"
      ? [[C.marks - 0.1, 0], [C.marks + 0.8, s.statsTopA]]
      : [[C.marks - 0.1, 0], [C.marks + 0.8, s.statsTop], [C.titles - 0.15, s.statsTop], [C.titles + 0.7, s.honoursTop],
        [C.littlei - 0.6, s.honoursTop], [C.littlei + 0.2, s.statsTopA]];
    scrollTo(s, keyed(scrollKeys, t));
    const keys = [[B.athlete, { ...HOME, s: 1.06 }], [B.athlete + 1.4, HOME]];
    if (PLAN === "alexey") {
      const box = s.modelBox && rect(s.modelBox);
      const tile = s.infoTile && rect(s.infoTile);
      const tip = d.querySelector("[role=tooltip]");
      if (box) keys.push([C.chance - 0.25, HOME], [C.chance + 0.45, center(box, 1.35)], [C.littlei - 0.35, center(box, 1.35)]);
      if (tile) {
        const r = tip ? { left: Math.min(rect(tip).left, tile.left), top: tile.top, width: 320, height: rect(tip).bottom - tile.top } : tile;
        keys.push([C.littlei + 0.35, center(tile, 1.5)], [C.means + 0.3, center(r, 1.5)], [C.search - 0.2, center(r, 1.5)]);
      }
      if (s.searchBtn) {
        const b = rect(s.searchBtn);
        keys.push([C.search + 0.3, { x: b.left - 120, y: b.top + 150, s: 1.45 }], [B.results + 0.2, { x: b.left - 120, y: b.top + 150, s: 1.45 }]);
      }
      if (box) place(R.boxWash, box, 6, showFor(t, C.chance - 0.1, C.winning - 0.1));
      // "That's not a chance of winning": the words it is a chance of,
      // underlined line by line, drawn across in reading order.
      const rs = phraseRects(s.modelBox, TEXT.chancePhrase);
      const total = rs.reduce((n, r) => n + r.width, 0);
      const k = prog(t, C.winning - 0.05, 0.7, INOUT) * total;
      let done = 0;
      R.underlines.forEach((u, i) => {
        const r = rs[i];
        if (!r) {
          u.style.opacity = 0;
          return;
        }
        const part = clamp((k - done) / r.width);
        done += r.width;
        Object.assign(u.style, { left: r.left + "px", top: r.bottom + 1 + "px", width: r.width + "px",
          transform: `scaleX(${part})`, opacity: part > 0 ? 1 - prog(t, C.littlei - 0.4, 0.3) : 0 });
      });
      if (s.infoBtn) place(R.infoRing, rect(s.infoBtn), 4, showFor(t, C.littlei - 0.05, C.means + 0.4), lerp(0.8, 1, prog(t, C.littlei - 0.05, 0.4)));
      if (s.searchBtn) place(R.searchRing, rect(s.searchBtn), 3, showFor(t, C.search - 0.05, C.search + 0.5), lerp(0.8, 1, prog(t, C.search - 0.05, 0.4)));
      const hit = [...d.querySelectorAll("a, [role=option], li")].find((n) => /KIPYEGON/.test(n.textContent) && n.getBoundingClientRect().width > 0 && n.textContent.length < 120);
      if (hit) place(R.hitWash, rect(hit), 3, showFor(t, C.notcomp - 0.05, B.results + 1));
    }
    if (PLAN === "new" && s.infoTile && Number.isFinite(C.littlei)) {
      const tile = rect(s.infoTile);
      const tip = d.querySelector("[role=tooltip]");
      const r = tip ? { left: Math.min(rect(tip).left, tile.left), top: tile.top, width: 320, height: rect(tip).bottom - tile.top } : tile;
      keys.push([C.littlei + 0.2, HOME], [C.littlei + 0.75, center(tile, 1.5)], [C.means + 0.3, center(r, 1.5)]);
      if (s.infoBtn) place(R.infoRing, rect(s.infoBtn), 4, showFor(t, C.littlei + 0.2, C.means + 0.4), lerp(0.8, 1, prog(t, C.littlei + 0.2, 0.4)));
    }
    s.cam.style.transform = camTransform(keyed(keys, t));
    // The season line draws itself, race by race.
    if (s.path) {
      const k = prog(t, C.races, 1.5, INOUT);
      s.path.style.strokeDasharray = `${s.pathLen}`;
      s.path.style.strokeDashoffset = `${s.pathLen * (1 - k)}`;
      if (s.area) s.area.style.opacity = s.areaOpacity * k;
      for (const [dot, x] of s.dots) dot.style.opacity = prog(t, C.races + 1.5 * inoutInverse(x), 0.35);
      for (const lab of s.labels) lab.style.opacity = prog(t, C.races + 1.2, 0.5);
    }
    const tilesAt = Math.min(C.marks + 0.4, B.athlete + 0.7);
    s.tiles.forEach((tile, i) => {
      const k = prog(t, tilesAt + i * 0.06, 0.6);
      tile.style.transform = `translateY(${(1 - k) * 18}px)`;
      tile.style.opacity = k;
    });
    // "their best marks": the first row, season best to career best.
    const row = s.tiles.slice(0, 3).map(rect);
    if (row.length === 3) {
      const r = { left: row[0].left, top: Math.min(...row.map((x) => x.top)), width: row[2].right - row[0].left, height: Math.max(...row.map((x) => x.height)) };
      place(R.marksWash, r, 8, showFor(t, C.marks - 0.05, C.races - 0.1));
    }
    if (PLAN === "new" && s.titleLine) {
      place(R.honourWash, rect(s.titleLine), 8, prog(t, C.titles + 0.55, 0.8, INOUT) * (1 - prog(t, B.champ - 0.1, 0.2)));
    }
  }
  function inoutInverse(x) {
    let lo = 0, hi = 1;
    for (let i = 0; i < 30; i++) {
      const m = (lo + hi) / 2;
      if (INOUT(m) < x) lo = m; else hi = m;
    }
    return (lo + hi) / 2;
  }

  function sceneChamp(t) {
    const s = S.champ;
    const d = doc(s);
    if (!s.arrivalIn && s.arrivalHTML) {
      d.body.insertAdjacentHTML("beforeend", s.arrivalHTML);
      s.arrivalIn = true;
    }
    if (PLAN === "alexey") {
      scrollTo(s, 0);
      s.cam.style.transform = camTransform(keyed([[B.champ + 0.9, HOME], [B.champOut + 0.4, { x: W / 2 - 100, y: H / 2, s: 1.06 }]], t, LINEAR));
    } else {
      scrollTo(s, keyed([[C.chances - 0.25, 0], [C.chances + 0.75, s.glanceTop], [C.ebe - 0.2, s.glanceTop], [B.results + 0.4, s.glanceTop + 330]], t));
      // The line is about following championships in general, so the camera
      // rests on the page rather than on this one's countdown.
      s.cam.style.transform = camTransform(keyed([[B.champ, HOME], [C.own - 0.2, HOME],
        [C.own + 1.0, { x: W / 2 + 60, y: H / 2 + 30, s: 1.06 }], [C.chances + 0.6, HOME]], t));
      s.tiles.forEach((tile, i) => {
        const at = C.chances + 0.35 + (i % 4) * 0.07 + Math.floor(i / 4) * 0.12;
        const k = prog(t, at, 0.7);
        tile.style.transform = `translateY(${(1 - k) * 40}px)`;
        tile.style.opacity = k;
        count(s.tilePct[i], t, at + 0.1, 1.0);
      });
    }
    // The countdown ticks with the video, from the moment the page appears.
    if (s.digits && s.remain0 != null) {
      const left = Math.max(0, s.remain0 - Math.floor(Math.max(0, t - B.champ)));
      const parts = [Math.floor(left / 86400), Math.floor((left % 86400) / 3600), Math.floor((left % 3600) / 60), left % 60];
      s.digits.forEach((n, i) => {
        const v = String(parts[i]).padStart(2, "0");
        if (n.textContent !== v) n.textContent = v;
      });
    }
  }

  function resultsEvent(t) {
    const s = S.results;
    let changed = false;
    const btn = s.expandBtn;
    if (btn) {
      const want = t >= C.happened + 0.1;
      if (want !== !!s.opened) {
        btn.click();
        s.opened = want;
        s.eventBorn = want ? C.happened + 0.1 : s.born;
        changed = true;
      }
    }
    const fb = s.feedbackBtn;
    if (fb && PLAN === "alexey") {
      const at = C.feedback + 0.8;
      if (t >= at && !doc(s).querySelector("[role=dialog]")) {
        fb.click();
        s.eventBorn = at;
        changed = true;
      }
    }
    return changed;
  }
  function sceneResults(t) {
    const s = S.results;
    const keys = [[C.happened - 0.4, 0], [C.happened + 0.6, s.listTop]];
    if (PLAN === "alexey") keys.push([C.feedback - 0.9, s.listTop], [C.feedback - 0.1, s.footTop()]);
    scrollTo(s, keyed(keys, t));
    s.cam.style.transform = camTransform(keyed([[B.results, { ...HOME, s: 1.05 }], [B.results + 1.3, HOME]], t));
    s.figures.forEach((b, i) => count(b, t, C.results + 0.3 + i * 0.12, 1.3));
    if (s.feedbackBtn && PLAN === "alexey") place(R.fbRing, rect(s.feedbackBtn), 5, showFor(t, C.feedback - 0.05, C.feedback + 0.8), lerp(0.85, 1, prog(t, C.feedback - 0.05, 0.4)));
  }

  // ── Which page is on screen, and how it moves in and out.
  function renderShots(t) {
    const vis = (s, a, b) => {
      s.el.style.visibility = t >= a && t < b ? "visible" : "hidden";
    };
    const push = (from, to, at) => {
      const k = prog(t, at, 0.8, INOUT);
      if (t >= at - 0.1 && t < at + 1) {
        from.el.style.transform = `translateX(${-k * W * 0.3}px)`;
        from.el.style.opacity = 1 - k * 0.6;
      }
      to.el.style.transform = `translateX(${(1 - k) * W}px)`;
      to.el.style.boxShadow = k > 0 && k < 1 ? "-30px 0 60px oklch(0 0 0 / 0.5)" : "none";
    };
    vis(S.dash, B.dash + 0.05, B.track + 0.8);
    vis(S.track, B.track, B.athlete + 0.5);
    if (PLAN === "alexey") {
      vis(S.athlete, B.athlete + 0.1, B.results + 0.8);
      vis(S.champ, B.champ, B.champOut + 0.4);
      S.champ.el.style.opacity = 1 - prog(t, B.champOut, 0.4, INOUT);
      push(S.athlete, S.results, B.results);
    } else {
      vis(S.athlete, B.athlete + 0.1, B.champ);
      vis(S.champ, B.champ, B.results + 0.8);
      push(S.champ, S.results, B.results);
    }
    vis(S.results, B.results, C.end);
    push(S.dash, S.track, B.track);
    // Track zooms into the name while the athlete's page comes up under it.
    const zooming = t > B.athlete;
    S.track.el.style.zIndex = zooming ? 5 : 3;
    S.track.el.style.opacity = zooming ? 1 - prog(t, B.athlete + 0.05, 0.45, INOUT) : S.track.el.style.opacity || 1;
    S.athlete.el.style.opacity = prog(t, B.athlete + 0.1, 0.45, INOUT) * (PLAN === "alexey" && t >= B.results ? 1 - prog(t, B.results, 0.8, INOUT) * 0.6 : 1);
  }

  function renderClosing(t) {
    if (PLAN === "new") {
      const l9 = lastLine.start;
      dim.style.opacity = prog(t, l9 - 0.35, 0.6, INOUT);
      reveal(lastK, t, l9 - 0.1, 0.09, 0.8);
      lastK.box.style.visibility = t > l9 - 0.4 ? "visible" : "hidden";
      const kr = prog(t, l9 + 0.5, 0.9, INOUT);
      rule.style.transform = `scaleX(${kr})`;
      rule.style.opacity = kr > 0 ? 1 : 0;
    } else {
      lastK.box.style.visibility = "hidden";
    }
    const on = t >= B.outro;
    outro.style.visibility = on ? "visible" : "hidden";
    if (!on) return;
    outro.style.opacity = prog(t, B.outro, 0.6, INOUT);
    oBars.forEach((b, i) => { b.style.transform = `scaleY(${lerp(0.15, 1, prog(t, B.outro + 0.3 + i * 0.08, 0.6))})`; });
    const kb = prog(t, B.outro + 0.35, 0.7);
    oBrand.style.opacity = kb;
    oBrand.style.transform = `translateY(${(1 - kb) * 12}px)`;
    const ku = prog(t, B.outro + 0.7, 0.7);
    oUrl.style.opacity = ku;
    oUrl.style.transform = `translateY(${(1 - ku) * 10}px)`;
  }

  // ── Setup: load the pages, wait until each shows its data, then measure.
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function until(fn, what, ms = 60000) {
    const t0 = performance.now();
    for (;;) {
      try {
        if (fn()) return;
      } catch (e) { /* page still loading */ }
      if (performance.now() - t0 > ms) throw new Error("timed out waiting for " + what);
      await sleep(100);
    }
  }
  /** Wait for the images inside the frame. A lazy image outside its scroll
   *  box (the favourites strip past its edge) never loads, and one that has
   *  kept a frame waiting once is not waited for again. */
  const gaveUp = new WeakSet();
  async function imagesIn(s) {
    const imgs = [...doc(s).images].filter((i) => {
      if (i.complete || gaveUp.has(i)) return false;
      const r = i.getBoundingClientRect();
      return r.width > 0 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W;
    });
    await Promise.all(imgs.map((i) => new Promise((r) => {
      i.addEventListener("load", r, { once: true });
      i.addEventListener("error", r, { once: true });
      setTimeout(() => { if (!i.complete) gaveUp.add(i); r(); }, 1500);
    })));
  }
  const scrollTopOf = (s, node, offset) => Math.max(0, Math.round(rect(node).top + win(s).scrollY - offset));

  window.__setup = async () => {
    // Hold every page's animations at their start while the pages load.
    const hold = setInterval(() => Object.values(S).forEach((s) => { try { drive(s, 0); } catch (e) { /* loading */ } }), 40);
    const D = (k) => doc(S[k]);
    await until(() => D("dash").querySelectorAll("ul.favourites-strip li").length >= 8, "dashboard cards");
    await until(() => D("track").querySelectorAll("tbody tr").length >= 20 && D("track").querySelectorAll("[role=tab]").length === 2, "track table");
    await until(() => D("athlete").querySelector("h1") && [...D("athlete").querySelectorAll("svg path")].some((p) => p.getAttribute("stroke") && p.getAttribute("stroke") !== "none" && p.getTotalLength() > 100), "athlete chart");
    await until(() => D("champ").querySelector("[role=timer]") && D("champ").querySelectorAll(".nagoya-tile-card").length >= 12 && win(S.champ).__arrivalHTML, "championship page");
    await until(() => D("results").querySelectorAll("b.page-title.nums").length >= 4, "results figures");
    await document.fonts.ready;
    for (const s of Object.values(S)) await doc(s).fonts.ready;

    // Dashboard.
    const sd = S.dash;
    sd.strip = D("dash").querySelector("ul.favourites-strip");
    sd.cards = [...sd.strip.querySelectorAll(":scope > li")].slice(0, 7);
    sd.ratings = sd.cards.map((li) => [...li.querySelectorAll("span.nums")].find((n) => /%/.test(n.textContent)));
    const head = (sd.strip.closest("section") || sd.strip.parentElement).querySelector("h2") || sd.strip;
    sd.stripTop = scrollTopOf(sd, head, 110);
    sd.stripShift = Math.round((sd.cards[1] ? rect(sd.cards[1]).left - rect(sd.cards[0]).left : 320) * 2);
    sd.navDash = [...D("dash").querySelectorAll("header a")].find((a) => a.getAttribute("href") === "/dashboard");
    R.dashRing = mark(sd, "ring");
    // The title's photos: the favourites the dashboard shows, where they have one.
    const photoOf = (li) => [...li.querySelectorAll("img")].find((i) => !/\/flags\//.test(i.currentSrc || i.src) && i.getBoundingClientRect().width > 120);
    faces.innerHTML = "";
    for (const li of [...sd.strip.querySelectorAll(":scope > li")].filter(photoOf).slice(0, 7)) {
      const img = photoOf(li);
      const name = [...li.querySelectorAll("p, h3, span, div")].map((n) => n.textContent.trim())
        .find((x) => /[A-Z]{2,}/.test(x) && x.length < 40 && !/THROW|VAULT|JUMP|HURDLE|METRES|MEN|\d/.test(x));
      const f = el("figure", "", faces);
      const im = el("img", "", f);
      im.src = img.currentSrc || img.src;
      im.style.objectPosition = getComputedStyle(img).objectPosition;
      if (name) el("figcaption", "", f, name);
    }
    await Promise.all([...faces.querySelectorAll("img")].map((i) => i.decode().catch(() => null)));

    // Track.
    const st = S.track;
    st.tableTop = scrollTopOf(st, D("track").querySelector("h2") || D("track").querySelector("table"), 120);
    st.navTrack = [...D("track").querySelectorAll("header a")].find((a) => a.getAttribute("href") === "/track");
    st.navField = [...D("track").querySelectorAll("header a")].find((a) => a.getAttribute("href") === "/field");
    for (const k of ["trackRing", "fieldRing", "tabRing", "nameRing"]) R[k] = mark(st, "ring");
    for (const k of ["pointsWash", "ratingWash", "moverWash", "moverWash2"]) R[k] = mark(st, "wash");

    // Athlete.
    const sa = S.athlete;
    const ad = D("athlete");
    const paths = [...ad.querySelectorAll("svg path")];
    sa.path = paths.find((p) => p.getAttribute("stroke") && p.getAttribute("stroke") !== "none" && p.getTotalLength() > 100);
    sa.pathLen = sa.path.getTotalLength();
    const svg = sa.path.ownerSVGElement;
    sa.area = paths.find((p) => p !== sa.path && p.ownerSVGElement === svg && (p.getAttribute("stroke") === "none" || !p.getAttribute("stroke")));
    sa.areaOpacity = sa.area ? parseFloat(getComputedStyle(sa.area).opacity) || 1 : 1;
    const bb = sa.path.getBBox();
    sa.dots = [...svg.querySelectorAll("circle")].map((c) => [c, clamp((parseFloat(c.getAttribute("cx")) - bb.x) / (bb.width || 1))]);
    sa.labels = [...svg.querySelectorAll("text")].filter((n) => /^\d/.test(n.textContent.trim()) && !/[A-Z]/.test(n.textContent));
    const statsH = [...ad.querySelectorAll("h2")][0];
    sa.statsTop = scrollTopOf(sa, statsH, 150);
    sa.statsTopA = scrollTopOf(sa, statsH, 330);
    const statsCard = statsH.closest("section") || statsH.parentElement;
    const statsGrid = [...statsCard.querySelectorAll("div.grid")].find((g) => g.children.length >= 6);
    sa.tiles = statsGrid ? [...statsGrid.children].slice(0, 9) : [];
    const honH = [...ad.querySelectorAll("h2")].find((h) => TEXT.honours.test(h.textContent));
    sa.honoursTop = honH ? scrollTopOf(sa, honH, 140) : sa.statsTop + 400;
    sa.titleLine = honH ? [...honH.parentElement.querySelectorAll("p, div")].find((n) => /champion/i.test(n.textContent) && n.textContent.length < 160 && n.children.length < 8) : null;
    sa.modelBox = [...ad.querySelectorAll("div, aside, section")].filter((n) => /PODIUMCALL/i.test(n.textContent) && TEXT.chancePhrase.test(n.textContent) && n.textContent.length < 400)
      .sort((a, b) => a.textContent.length - b.textContent.length)[0] || null;
    sa.infoBtn = statsCard.querySelector("button[aria-expanded]");
    sa.infoTile = sa.infoBtn && statsGrid ? [...statsGrid.children].find((c) => c.contains(sa.infoBtn)) : null;
    sa.searchBtn = [...ad.querySelectorAll("header button, button")].find((b) => TEXT.searchBtn.test(b.getAttribute("aria-label") || ""));
    sa.searchInput = () => [...ad.querySelectorAll("input")].find((i) => i.getBoundingClientRect().width > 0);
    R.boxWash = mark(sa, "wash");
    R.marksWash = mark(sa, "wash");
    R.hitWash = mark(sa, "wash");
    R.honourWash = mark(sa, "wash");
    R.infoRing = mark(sa, "ring");
    R.searchRing = mark(sa, "ring");
    R.underlines = [0, 1, 2].map(() => {
      const u = el("div", "", sa.marks);
      Object.assign(u.style, { position: "absolute", height: "3px", borderRadius: "2px", background: "var(--gold-strong)", transformOrigin: "0 50%", opacity: 0 });
      return u;
    });
    // Search reads an index the first time it opens; open it once now so the
    // results come up as the name is typed, not a fetch later.
    if (PLAN === "alexey" && sa.searchBtn) {
      sa.searchBtn.click();
      await until(() => sa.searchInput(), "search box");
      typeInto(sa.searchInput(), TEXT.query);
      await until(() => /KIPYEGON/.test(ad.body.innerText), "search results");
      typeInto(sa.searchInput(), "");
      ad.dispatchEvent(new (win(sa).KeyboardEvent)("keydown", { key: "Escape", bubbles: true }));
      await sleep(150);
      if (sa.searchInput()) sa.searchBtn.click();
      await sleep(150);
    }

    // Championship.
    const sc = S.champ;
    const cd = D("champ");
    sc.arrivalHTML = win(sc).__arrivalHTML;
    sc.timerBox = cd.querySelector("[role=timer]");
    sc.timerRect = rect(sc.timerBox);
    sc.digits = [...sc.timerBox.querySelectorAll("span.hero-serif")];
    const nums = sc.digits.map((n) => parseInt(n.textContent, 10));
    sc.remain0 = nums.length === 4 && nums.every((n) => !Number.isNaN(n)) ? nums[0] * 86400 + nums[1] * 3600 + nums[2] * 60 + nums[3] : null;
    sc.tiles = [...cd.querySelectorAll(".nagoya-tile-card")].slice(0, 16);
    sc.tilePct = sc.tiles.map((b) => b.querySelector(".nums"));
    const glance = [...cd.querySelectorAll("h2")].find((h) => TEXT.glance.test(h.textContent)) || sc.tiles[0];
    sc.glanceTop = scrollTopOf(sc, glance, 110);

    // Results.
    const sr = S.results;
    const rd = D("results");
    sr.figures = [...rd.querySelectorAll("b.page-title.nums")].slice(0, 4);
    sr.expandBtn = [...rd.querySelectorAll("button")].find((b) => TEXT.expand.test(b.textContent));
    const firstRow = [...rd.querySelectorAll("button")].find((b) => /20\d\d/.test(b.textContent) && b.textContent.length < 140);
    sr.listTop = firstRow ? scrollTopOf(sr, firstRow, 170) : 400;
    sr.feedbackBtn = [...rd.querySelectorAll("button")].find((b) => TEXT.feedbackBtn.test(b.textContent));
    sr.footTop = () => Math.max(0, rd.documentElement.scrollHeight - H);
    R.fbRing = mark(sr, "ring");

    clearInterval(hold);
    // Walk each page once so lazy images load, then back to the top.
    for (const s of Object.values(S)) {
      const w = win(s);
      const hMax = doc(s).documentElement.scrollHeight;
      for (let y = 0; y < Math.min(hMax, 3000); y += 600) {
        w.scrollTo({ top: y, behavior: "instant" });
        await sleep(60);
      }
      w.scrollTo({ top: 0, behavior: "instant" });
    }
    const missing = Object.entries(C).filter(([, v]) => !Number.isFinite(v)).map(([k]) => k);
    return { plan: PLAN, duration: T.duration, scenes: B, cues: Object.fromEntries(Object.entries(C).map(([k, v]) => [k, Math.round(v * 100) / 100])), captions: cues.length, missing,
      found: { modelBox: !!sa.modelBox, infoBtn: !!sa.infoBtn, searchBtn: !!sa.searchBtn, feedbackBtn: !!sr.feedbackBtn, tiles: sa.tiles.length, expand: !!sr.expandBtn } };
  };

  const settle = async () => {
    await sleep(60);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  };

  window.__seek = async (t) => {
    // Clicks and keystrokes first; React applies them a moment later. Repeat
    // until nothing changes, so a frame can open search and type into it.
    for (let pass = 0; pass < 4; pass++) {
      let changed = false;
      if (t >= B.track - 0.1 && t < B.athlete + 0.6) changed = trackEvent(t) || changed;
      if (t >= B.athlete - 0.1 && t < B.results + 1) changed = athleteEvent(t) || changed;
      if (t >= B.results - 0.1) changed = resultsEvent(t) || changed;
      if (!changed) break;
      await settle();
      trackSettled();
    }
    renderTitle(t);
    renderShots(t);
    if (t >= B.dash && t < B.track + 1) sceneDash(t);
    if (t >= B.track - 0.1 && t < B.athlete + 0.6) sceneTrack(t);
    const athleteEnd = PLAN === "alexey" ? B.results + 1 : B.champ + 0.1;
    if (t >= B.athlete - 0.1 && t < athleteEnd) sceneAthlete(t);
    const champEnd = PLAN === "alexey" ? B.champOut + 0.5 : B.results + 1;
    if (t >= B.champ - 0.1 && t < champEnd) sceneChamp(t);
    if (t >= B.results - 0.1) sceneResults(t);
    for (const s of Object.values(S)) drive(s, t);
    renderBand(t, B.dash - 0.4);
    renderClosing(t);
    renderCaptions(t);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await Promise.all(Object.values(S).filter((s) => s.el.style.visibility === "visible").map(imagesIn));
  };
})();
