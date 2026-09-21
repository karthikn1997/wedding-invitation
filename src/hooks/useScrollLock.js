import { useEffect } from "react";

/** Locks page scroll while `locked` is true (opening screen, mobile menu, lightbox). */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevBehavior = html.style.scrollBehavior;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevOverflow;
      html.style.scrollBehavior = prevBehavior;
    };
  }, [locked]);
}
