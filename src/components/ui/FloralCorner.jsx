import { motion } from "framer-motion";
import { EASE } from "../../lib/motion";

const FLIP = {
  tl: "",
  tr: "scale-x-[-1]",
  bl: "scale-y-[-1]",
  br: "scale-[-1]",
};
const POS = {
  tl: "top-0 left-0",
  tr: "top-0 right-0",
  bl: "bottom-0 left-0",
  br: "bottom-0 right-0",
};

/**
 * Ornamental gold corner: vine border, leaves and a lotus-style flower.
 * `position` mirrors the same drawing into any corner of a `relative` parent.
 * Vines draw themselves on entering the viewport.
 */
export default function FloralCorner({ position = "tl", className = "", size = "w-24 md:w-36", delay = 0, animated = true }) {
  const draw = animated
    ? {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 2.2, ease: EASE, delay },
      }
    : {};

  return (
    <div className={`pointer-events-none absolute ${POS[position]} ${size} aspect-square ${FLIP[position]} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="h-full w-full">
        <motion.path d="M6 108V30Q6 6 30 6H108" {...draw} />
        <motion.path d="M14 84V36Q14 14 36 14H84" strokeWidth=".6" opacity=".7" {...draw} />
        <motion.path d="M22 60V42Q22 22 42 22H60" strokeWidth=".5" opacity=".5" {...draw} />
        {/* flower */}
        <motion.g
          initial={animated ? { scale: 0, rotate: -30, opacity: 0 } : false}
          whileInView={animated ? { scale: 1, rotate: 0, opacity: 1 } : undefined}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.6, ease: EASE, delay: delay + 0.5 }}
          style={{ transformOrigin: "34px 34px", transformBox: "fill-box" }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} cx="34" cy="24" rx="3.6" ry="9" transform={`rotate(${i * 45} 34 34)`} fill="currentColor" fillOpacity=".14" />
          ))}
          <circle cx="34" cy="34" r="4" fill="currentColor" fillOpacity=".5" />
          <circle cx="34" cy="34" r="12" strokeDasharray="1 2.6" />
        </motion.g>
        {/* leaves along the border */}
        {[
          [6, 70, 90],
          [6, 92, 90],
          [70, 6, 0],
          [92, 6, 0],
        ].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="2.4" ry="7" transform={`rotate(${r} ${x} ${y})`} fill="currentColor" fillOpacity=".3" stroke="none" />
        ))}
        <circle cx="6" cy="112" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="112" cy="6" r="1.8" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

/** Convenience: all four corners at once. */
export function FloralFrame({ className = "", size, inset = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${inset} ${className}`} aria-hidden="true">
      {["tl", "tr", "bl", "br"].map((p, i) => (
        <FloralCorner key={p} position={p} size={size} delay={i * 0.15} />
      ))}
    </div>
  );
}
