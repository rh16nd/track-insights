import { useEffect, useRef, useState } from "react";

/** Animates a number from 0 (or its previous value) up to `target` over
 * `durationMs`, eased out so it settles rather than stopping abruptly. This
 * is a bounded, one-shot animation (runs once per `target` change, then
 * stops re-rendering) -- not a continuous value tied to a live input, so a
 * plain useState/rAF loop is the right tool here (unlike mouse-tracking or
 * drag physics, which should use motion values instead, per the project's
 * animation guidance). Respects prefers-reduced-motion by jumping straight
 * to the target with no intermediate frames.
 *
 * `options` is additive and every field is optional -- `useCountUp(value)`
 * behaves exactly as it always has, animating only when the target CHANGES.
 * The landing podium needs the other mode: count from zero on arrival, and
 * again on demand when Replay is pressed, which the default cannot express
 * because a freshly mounted counter starts already holding its target.
 *   - `from`    counts from this value instead of the previous target.
 *   - `delayMs` holds at the start value first, so several counters can be
 *               staggered against the podium blocks rising beneath them.
 *   - `runKey`  restarts the whole thing whenever it changes. */
export function useCountUp(
  target: number,
  durationMs = 900,
  options: { from?: number; delayMs?: number; runKey?: number } = {},
) {
  const { from: forcedFrom, delayMs = 0, runKey = 0 } = options;
  // Start ON the target when motion is reduced, not just settle there in the
  // effect: with `from: 0` the first paint would otherwise show a real
  // athlete sitting at 0%, and a wrong number for one frame is still a wrong
  // number. Guarded for SSR, where there is no window to ask.
  const [value, setValue] = useState(() => {
    if (forcedFrom === undefined) return target;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return reduced ? target : forcedFrom;
  });
  const prevTarget = useRef(target);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      prevTarget.current = target;
      return;
    }

    const from = forcedFrom ?? prevTarget.current;
    const to = target;
    if (from === to && forcedFrom === undefined) return;
    prevTarget.current = to;

    if (delayMs > 0) setValue(from);
    const start = performance.now() + delayMs;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    function tick(now: number) {
      // Negative until the delay has elapsed, so the counter holds at `from`
      // rather than jumping ahead when it finally starts.
      const elapsed = now - start;
      if (elapsed < 0) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(t);
      setValue(from + (to - from) * eased);
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, durationMs, forcedFrom, delayMs, runKey]);

  return value;
}
