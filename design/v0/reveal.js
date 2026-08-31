/* ============================================================
   PodiumCall — reveal.js
   Shared motion layer for every app page. One behaviour per object:
   - scroll-reveal (staggered rise) for the hero band + body blocks
   - count-up for clean numeric figures (skips ranges, units, dates)
   - fill-in for probability meters and score bars
   Fully guarded by prefers-reduced-motion. Maps to a React hook.
   ============================================================ */
(function () {
  "use strict";

  // Respect reduced motion: never hide anything, do nothing.
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };

  /* ---- count a single clean number up from zero, keeping prefix/suffix ---- */
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    if (el.children.length) return;               // preserve unit spans etc.

    var txt = el.textContent.trim();
    if (/[A-Za-z]/.test(txt)) return;             // skip dates / "1 to go" / "6.31m"

    var matches = txt.match(/\d[\d,]*(?:\.\d+)?/g);
    if (!matches || matches.length !== 1) return; // skip ranges like 880–1353

    var numStr = matches[0];
    if (/^0\d/.test(numStr)) return;              // keep padded values like "04"

    var idx = txt.indexOf(numStr);
    var prefix = txt.slice(0, idx);
    var suffix = txt.slice(idx + numStr.length);
    var hasComma = numStr.indexOf(",") >= 0;
    var decimals = (numStr.split(".")[1] || "").length;
    var target = parseFloat(numStr.replace(/,/g, ""));
    if (isNaN(target)) return;

    function fmt(v) {
      var s = decimals ? v.toFixed(decimals) : String(Math.round(v));
      if (hasComma) {
        var parts = s.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        s = parts.join(".");
      }
      return prefix + s + suffix;
    }

    var dur = 1050, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      el.textContent = fmt(target * easeOutCubic(p));
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target);
    }
    el.textContent = fmt(0);
    requestAnimationFrame(step);
  }

  /* ---- animate width-based bars from 0 to their authored width ---- */
  function fillBars(scope) {
    var bars = scope.querySelectorAll(".meter > i, .scorebar-fill");
    for (var i = 0; i < bars.length; i++) {
      var el = bars[i];
      if (el.dataset.filled) continue;
      var w = el.style.width;
      if (!w) continue;
      el.dataset.filled = "1";
      (function (node, target) {
        node.style.transition = "none";
        node.style.width = "0%";
        void node.offsetWidth; // reflow
        node.style.transition = "width .9s cubic-bezier(.2,.7,.2,1)";
        requestAnimationFrame(function () { node.style.width = target; });
      })(el, w);
    }
  }

  /* ---- reveal one block: show it, fill its bars, count its figures ---- */
  function reveal(el) {
    el.classList.add("vis");
    fillBars(el);
    var figs = el.querySelectorAll(".stat b, .pill, .dh-fig b, .callbox .big");
    for (var i = 0; i < figs.length; i++) countUp(figs[i]);
  }

  try {
    /* 1 — hero band (.page-head on app pages, .dossier on the athlete page):
           stagger its rows, then reveal together on load. */
    var head = document.querySelector(".page-head, .dossier");
    if (head) {
      var container = head.querySelector(".wrap-wide") || head.querySelector(".wrap") || head;
      var hero = Array.prototype.slice.call(container.children);
      hero.forEach(function (el, i) {
        el.classList.add("js-reveal");
        el.style.transitionDelay = (i * 0.09) + "s";
      });
      requestAnimationFrame(function () { hero.forEach(reveal); });
    }

    /* 2 — body blocks: every top-level child of the content stack,
           revealed on scroll with a light per-row stagger. */
    var blocks = Array.prototype.slice.call(document.querySelectorAll(".body-region .stack > *"));
    blocks.forEach(function (el, i) {
      el.classList.add("js-reveal");
      el.style.transitionDelay = Math.min(i * 0.05, 0.2) + "s";
    });

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
      blocks.forEach(function (el) { io.observe(el); });
    } else {
      blocks.forEach(reveal);
    }
  } catch (err) {
    // Failsafe: never leave content hidden if anything goes wrong.
    var hidden = document.querySelectorAll(".js-reveal");
    for (var i = 0; i < hidden.length; i++) hidden[i].classList.add("vis");
  }
})();
