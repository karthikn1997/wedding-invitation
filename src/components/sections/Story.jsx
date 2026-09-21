import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import weddingData from "../../data/weddingData";
import SectionHeading from "../ui/SectionHeading";
import TimelineItem from "../TimelineItem";
import FloralCorner from "../ui/FloralCorner";

const { story } = weddingData;

export default function Story() {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 55%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.6 });
  const beadTop = useTransform(smooth, [0, 1], ["0%", "100%"]);

  return (
    <section id="story" className="bg-paper relative overflow-hidden py-24 sm:py-32" aria-label="Our story">
      <FloralCorner position="tl" className="text-gold-600/60" />
      <FloralCorner position="tr" className="text-gold-600/60" />
      <SectionHeading eyebrow="Our Story" title="How it all began" subtitle="A few of the moments that brought two lives — and two families — together." />

      <div className="relative mx-auto mt-20 max-w-5xl px-6 sm:mt-28">
        <ol ref={listRef} className="relative flex flex-col gap-24 md:gap-32">
          {/* the thread: a faint track + a gold line that draws with scroll */}
          <div className="pointer-events-none absolute top-6 bottom-6 left-6 w-px -translate-x-1/2 md:left-1/2" aria-hidden="true">
            <div className="absolute inset-0 bg-gold-500/20" />
            <motion.div
              className="absolute inset-0 origin-top bg-gradient-to-b from-gold-500 via-gold-400 to-gold-600"
              style={{ scaleY: reduce ? 1 : smooth }}
            />
            {!reduce && (
              <motion.span
                className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300 shadow-[0_0_18px_6px_rgba(214,181,107,0.6)]"
                style={{ top: beadTop }}
              />
            )}
          </div>

          {story.map((item, i) => (
            <TimelineItem key={item.year} item={item} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
