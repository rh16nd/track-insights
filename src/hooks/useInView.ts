import { useEffect, useRef, useState } from "react";

/** Reports whether an element has scrolled into the viewport, then stops
 * watching -- a one-shot trigger for a scroll-reveal entrance, not a live
 * visibility tracker (a list that toggled back out and back in would be a
 * distraction, not a demonstration). IntersectionObserver runs off the main
 * thread, so this is cheaper than a scroll-position listener for something
 * that only needs to fire once. */
export function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
