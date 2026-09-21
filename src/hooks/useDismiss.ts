import { useEffect } from "react";
import type { RefObject } from "react";

/** Close an open menu or panel on Escape or a press outside `inside`, the way
 * the landing's menu and the site's menu both behave. On Escape, focus goes
 * back to `returnTo` (the button that opened it), so a keyboard reader is not
 * left on a control that just vanished. */
export function useDismiss(
  open: boolean,
  close: () => void,
  inside: RefObject<HTMLElement | null>,
  returnTo?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      returnTo?.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!inside.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close, inside, returnTo]);
}
