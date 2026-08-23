import { useEffect, useRef, useState } from "react";

/** Animates a number from 0 (or its previous value) up to `target` over
 * `durationMs`, eased out so it settles rather than stopping abruptly. This
 * is a bounded, one-shot animation (runs once per `target` change, then
 * stops re-rendering) -- not a continuous value tied to a live input, so a
 * plain useState/rAF loop is the right tool here (unlike mouse-tracking or
 * drag physics, which should use motion values instead, per the project's
 * animation guidance). Respects prefers-reduced-motion by jumping straight
 * to the target with no intermediate frames. */
export function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      prevTarget.current = target;
      return;
    }

    const from = prevTarget.current;
    const to = target;
    if (from === to) return;
    prevTarget.current = to;

    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    function tick(now: number) {
      const elapsed = now - start;
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
  }, [target, durationMs]);

  return value;
}
