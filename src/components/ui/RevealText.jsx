import { createElement, Fragment } from "react";
import { motion } from "framer-motion";
import { EASE, VIEWPORT } from "../../lib/motion";

/**
 * Masked word-by-word text reveal (each word rises out of an overflow mask,
 * un-blurring as it settles).
 *
 *  • Scroll-triggered by default.
 *  • Pass `active` (boolean) to drive it manually — used by the opening & hero.
 *  • Screen readers get the full string via aria-label; the animated spans are hidden.
 */
export default function RevealText({
  text,
  as = "span",
  className = "",
  wordClassName = "", // applied to each animated word — use for gradient text (background-clip must sit on the same element as the glyphs)
  delay = 0,
  stagger = 0.09,
  duration = 1.2,
  blur = true,
  active,
  once = true,
}) {
  const words = text.split(" ");
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word = {
    hidden: { y: "108%", opacity: 0, filter: blur ? "blur(8px)" : "blur(0px)" },
    show: { y: "0%", opacity: 1, filter: "blur(0px)", transition: { duration, ease: EASE } },
  };

  const control =
    active === undefined
      ? { initial: "hidden", whileInView: "show", viewport: { ...VIEWPORT, once, amount: 0.6 } }
      : { initial: "hidden", animate: active ? "show" : "hidden" };

  const MotionTag = motion[as] || motion.span;

  return createElement(
    MotionTag,
    { className, variants: container, "aria-label": text, ...control },
    words.map((w, i) => (
      <Fragment key={i}>
        <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]" aria-hidden="true">
          <motion.span variants={word} className={`inline-block will-change-transform ${wordClassName}`}>
            {w}
          </motion.span>
        </span>
        {i < words.length - 1 ? " " : null}
      </Fragment>
    )),
  );
}
