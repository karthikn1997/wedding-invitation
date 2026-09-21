import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import weddingData from "../../data/weddingData";
import { FloralFrame } from "../ui/FloralCorner";
import GoldDivider from "../ui/GoldDivider";
import { Mandala } from "../ui/Ornaments";

const { lines, signature } = weddingData.message;

/** One scrubbed line: fades / un-blurs / rises as scroll progress crosses its window. */
function Line({ text, index, total, progress, reduce }) {
  const span = 0.62 / total; // reveal windows share the first ~62% of the scroll
  const start = 0.06 + index * span;
  const end = start + span * 1.15;
  const opacity = useTransform(progress, [start, end], [0.08, 1]);
  const y = useTransform(progress, [start, end], [26, 0]);
  const blur = useTransform(progress, [start, end], [8, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <motion.p
      style={reduce ? undefined : { opacity, y, filter }}
      className={`font-display font-light tracking-tight text-maroon-900 ${
        index === total - 1 ? "mx-auto max-w-[15ch] text-[2.1rem] leading-[1.18] italic sm:max-w-[20ch] sm:text-5xl md:text-6xl" : "text-[2.6rem] leading-[1.1] sm:text-6xl md:text-7xl"
      }`}
    >
      {text}
    </motion.p>
  );
}

export default function Message() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const mandalaRotate = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const tail = useTransform(scrollYProgress, [0.68, 0.86], [0, 1]);

  return (
    <section id="message" ref={ref} className="bg-paper relative" style={{ height: reduce ? "auto" : "230svh" }} aria-label="Our message to you">
      <div className={`${reduce ? "py-32" : "sticky top-0 h-[100svh]"} relative flex items-center justify-center overflow-hidden`}>
        <motion.div style={{ rotate: mandalaRotate }} className="pointer-events-none absolute top-1/2 left-1/2 h-[135vmin] w-[135vmin] -translate-x-1/2 -translate-y-1/2 text-gold-600/[0.11]">
          <Mandala className="h-full w-full" strokeWidth={0.3} />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 text-gold-600/70">
          <FloralFrame inset="inset-3 sm:inset-8" size="w-20 sm:w-32 lg:w-40" />
        </div>

        <blockquote className="relative z-10 flex flex-col items-center gap-5 px-8 text-center sm:gap-7">
          <span className="eyebrow text-gold-700">A note from us</span>
          {lines.map((l, i) => (
            <Line key={l} text={l} index={i} total={lines.length} progress={scrollYProgress} reduce={reduce} />
          ))}
          <motion.div style={reduce ? undefined : { opacity: tail }} className="mt-4 flex flex-col items-center gap-5">
            <GoldDivider className="text-gold-600" />
            <footer className="font-script text-3xl text-gold-700 sm:text-4xl">{signature}</footer>
          </motion.div>
        </blockquote>
      </div>
    </section>
  );
}
