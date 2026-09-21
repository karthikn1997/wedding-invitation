import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { EASE, SPRING_POP, VIEWPORT, fadeUp, inView } from "../lib/motion";
import AnimatedImage from "./ui/AnimatedImage";
import { Lotus } from "./ui/Ornaments";

/**
 * One chapter of the story. On mobile the thread runs down the left and every card
 * sits to its right; from md up the cards alternate around a centred thread.
 */
export default function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yearY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [50, -50]);
  const right = index % 2 === 1; // desktop side
  const wipe = right ? "right" : "left";

  return (
    <li ref={ref} className="relative grid pl-16 md:grid-cols-2 md:gap-x-24 md:pl-0">
      {/* node on the thread */}
      <motion.span
        className="absolute top-8 left-6 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-ivory-50 text-gold-600 shadow-[0_0_0_1px_rgba(195,156,71,0.6),0_0_28px_rgba(195,156,71,0.35)] md:left-1/2"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={VIEWPORT}
        transition={SPRING_POP}
        aria-hidden="true"
      >
        <Lotus className="h-6 w-6" />
      </motion.span>

      <div className={`relative ${right ? "md:col-start-2" : "md:col-start-1"} md:row-start-1`}>
        {/* floating outlined year */}
        <motion.span
          style={{ y: yearY }}
          className={`text-outline-gold pointer-events-none absolute -top-10 z-0 font-display text-[6.5rem] leading-none font-light select-none md:-top-14 md:text-[9rem] ${
            right ? "left-0 md:-left-4" : "left-0 md:right-0 md:left-auto"
          }`}
          aria-hidden="true"
        >
          {item.year}
        </motion.span>

        <div className="relative z-10 pt-16 md:pt-20">
          <div className="relative">
            <AnimatedImage
              src={item.image}
              alt={item.alt}
              width={900}
              height={675}
              reveal={wipe}
              parallax={14}
              hoverZoom
              className="group aspect-[4/3] rounded-sm shadow-[0_24px_50px_-24px_rgba(58,13,21,0.55)]"
            />
            <motion.span
              className="pointer-events-none absolute -inset-2 rounded-sm border border-gold-500/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.6, ease: EASE, delay: 0.5 }}
            />
          </div>
          <motion.h3 {...inView(fadeUp(0.2, 18))} className="mt-7 font-display text-3xl font-light text-maroon-900 sm:text-4xl">
            {item.title}
          </motion.h3>
          <motion.p {...inView(fadeUp(0.3, 18))} className="mt-3 max-w-md text-[0.95rem] leading-relaxed font-light text-cocoa-700">
            {item.text}
          </motion.p>
        </div>
      </div>
    </li>
  );
}
