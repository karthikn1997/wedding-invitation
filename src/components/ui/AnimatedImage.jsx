import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { CLIP, EASE, VIEWPORT } from "../../lib/motion";

/**
 * The image primitive for the whole site. Layers, outside → in:
 *   outer    → observes visibility (must NOT be clipped: a fully clip-pathed node never
 *              intersects, so IntersectionObserver would never fire) and hosts the size/radius
 *   clip     → clip-path wipe (reveal), inherits the outer's border-radius
 *   parallax → scroll-linked vertical drift
 *   zoom     → CSS hover zoom (needs a `group` ancestor)
 *   img      → slow "settle" scale on reveal
 *
 * Lazy-loaded by default; pass `priority` for above-the-fold imagery.
 */
export default function AnimatedImage({
  src,
  alt,
  width,
  height,
  className = "",
  imgClassName = "",
  reveal = "up", // up | down | left | right | center | none
  parallax = 0, // px of drift (0 = off)
  hoverZoom = false,
  priority = false,
  delay = 0,
  style,
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-parallax, parallax]);
  const useParallax = parallax > 0 && !reduce;
  const animated = reveal !== "none";
  const clip = CLIP[reveal] || CLIP.up;
  const time = { duration: 1.5, ease: EASE, delay };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={style}
      initial={animated ? "hidden" : false}
      whileInView={animated ? "show" : undefined}
      viewport={{ ...VIEWPORT, amount: 0.15 }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-[inherit]"
        variants={animated ? { hidden: { clipPath: clip.hidden }, show: { clipPath: clip.show, transition: time } } : undefined}
      >
        <motion.div className={useParallax ? "absolute -inset-y-[9%] inset-x-0" : "absolute inset-0"} style={useParallax ? { y } : undefined}>
          <div className={`h-full w-full ${hoverZoom ? "transition-transform duration-[1400ms] ease-[var(--ease-cinema)] group-hover:scale-[1.07]" : ""}`}>
            <motion.img
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              draggable={false}
              className={`h-full w-full object-cover ${imgClassName}`}
              variants={animated ? { hidden: { scale: 1.3 }, show: { scale: 1, transition: { ...time, duration: 2.2 } } } : undefined}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
