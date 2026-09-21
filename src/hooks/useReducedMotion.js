import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Dev-only escape hatch: open the site with `?fullmotion` to force full animation even when the
 * OS reports `prefers-reduced-motion: reduce` (handy for testing on machines with animations off).
 * `import.meta.env.DEV` is false in production builds, so real guests are always respected.
 */
export const FORCE_FULL_MOTION = import.meta.env.DEV && typeof window !== "undefined" && new URLSearchParams(window.location.search).has("fullmotion");

if (FORCE_FULL_MOTION) document.documentElement.dataset.motion = "full";

/** Single source of truth for "should this animate?" — always use this, never framer's hook directly. */
export function useReducedMotion() {
  const prefers = useFramerReducedMotion();
  return FORCE_FULL_MOTION ? false : Boolean(prefers);
}
