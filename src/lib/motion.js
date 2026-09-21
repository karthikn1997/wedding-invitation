/**
 * Animation strategy — one vocabulary for the whole site.
 *  • One cinematic easing (expo-out) for reveals; slow, 0.9–1.6 s.
 *  • Only transform / opacity / clip-path / (rarely) small blur are animated.
 *  • Scroll-triggered reveals fire once; scroll-*linked* effects use useScroll.
 */
export const EASE = [0.22, 1, 0.36, 1]; // expo-out: fast start, long graceful settle
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];
export const SPRING_SOFT = { type: "spring", stiffness: 90, damping: 18, mass: 0.9 };
export const SPRING_POP = { type: "spring", stiffness: 220, damping: 16, mass: 0.7 };

export const DUR = { fast: 0.6, base: 1.1, slow: 1.5, epic: 2.2 };

/** Viewport config shared by every whileInView reveal. */
export const VIEWPORT = { once: true, amount: 0.25, margin: "0px 0px -6% 0px" };

export const fadeUp = (delay = 0, y = 28) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE, delay } },
});

export const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.base, ease: EASE, delay } },
});

export const blurIn = (delay = 0) => ({
  hidden: { opacity: 0, filter: "blur(10px)", y: 12 },
  show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: DUR.slow, ease: EASE, delay } },
});

export const scaleIn = (delay = 0, from = 0.92) => ({
  hidden: { opacity: 0, scale: from },
  show: { opacity: 1, scale: 1, transition: { duration: DUR.slow, ease: EASE, delay } },
});

export const stagger = (gap = 0.12, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Clip-path reveals (image wipes). */
export const CLIP = {
  up: { hidden: "inset(100% 0% 0% 0%)", show: "inset(0% 0% 0% 0%)" },
  down: { hidden: "inset(0% 0% 100% 0%)", show: "inset(0% 0% 0% 0%)" },
  left: { hidden: "inset(0% 100% 0% 0%)", show: "inset(0% 0% 0% 0%)" },
  right: { hidden: "inset(0% 0% 0% 100%)", show: "inset(0% 0% 0% 0%)" },
  center: { hidden: "inset(50% 50% 50% 50%)", show: "inset(0% 0% 0% 0%)" },
};

/** Spread onto a motion element for a standard scroll-in reveal. */
export const inView = (variants) => ({
  variants,
  initial: "hidden",
  whileInView: "show",
  viewport: VIEWPORT,
});
