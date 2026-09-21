import { motion } from "framer-motion";
import { EASE, SPRING_POP } from "../../lib/motion";
import { Lotus } from "./Ornaments";

/**
 * Animated ornamental rule: two gold lines draw outward from a lotus
 * that blooms in the centre. Colour comes from `currentColor`.
 */
export default function GoldDivider({ className = "", width = "w-56 md:w-72", delay = 0 }) {
  const line = (dir) => ({
    initial: { scaleX: 0, opacity: 0 },
    whileInView: { scaleX: 1, opacity: 1 },
    viewport: { once: true, amount: 0.8 },
    transition: { duration: 1.6, ease: EASE, delay: delay + 0.25 },
    style: { transformOrigin: dir === "l" ? "right center" : "left center" },
  });

  return (
    <div className={`mx-auto flex items-center justify-center gap-3 text-gold-500 ${width} ${className}`} role="presentation" aria-hidden="true">
      <motion.span {...line("l")} className="h-px flex-1 bg-gradient-to-l from-current to-transparent" />
      <motion.span
        initial={{ scale: 0, rotate: -40, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ ...SPRING_POP, delay }}
        className="block h-7 w-7 shrink-0"
      >
        <Lotus className="h-full w-full" />
      </motion.span>
      <motion.span {...line("r")} className="h-px flex-1 bg-gradient-to-r from-current to-transparent" />
    </div>
  );
}
