import { motion } from "framer-motion";
import { fadeUp, inView } from "../../lib/motion";
import RevealText from "./RevealText";
import GoldDivider from "./GoldDivider";

/**
 * Standard section opener: eyebrow → serif title → divider → optional subtitle.
 * `tone="dark"` = for maroon/cocoa backgrounds (light text); `"light"` = for ivory backgrounds.
 */
export default function SectionHeading({ eyebrow, title, subtitle, tone = "light", className = "", titleClassName = "", as = "h2", divider = true }) {
  const dark = tone === "dark";
  return (
    <header className={`mx-auto max-w-2xl px-6 text-center ${className}`}>
      {eyebrow && (
        <motion.p {...inView(fadeUp(0, 14))} className={`eyebrow mb-4 ${dark ? "text-gold-400" : "text-gold-700"}`}>
          {eyebrow}
        </motion.p>
      )}
      <RevealText
        as={as}
        text={title}
        className={`font-display text-[2.6rem] leading-[1.05] font-light tracking-tight sm:text-5xl md:text-6xl ${
          dark ? "text-ivory-50" : "text-maroon-900"
        } ${titleClassName}`}
      />
      {divider && <GoldDivider className={`mt-6 ${dark ? "text-gold-400" : "text-gold-600"}`} delay={0.2} />}
      {subtitle && (
        <motion.p
          {...inView(fadeUp(0.15, 16))}
          className={`mx-auto mt-6 max-w-md text-[0.95rem] leading-relaxed font-light ${dark ? "text-ivory-100/75" : "text-cocoa-700"}`}
        >
          {subtitle}
        </motion.p>
      )}
    </header>
  );
}
