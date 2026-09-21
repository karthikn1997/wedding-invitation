import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Clock, MapPin, Navigation } from "lucide-react";
import weddingData from "../../data/weddingData";
import { formatWeekday, formatDayMonth, formatTimeRange } from "../../lib/format";
import { resolveMapsUrl } from "../../lib/maps";
import { EASE, VIEWPORT, blurIn, fadeUp, inView } from "../../lib/motion";
import RevealText from "../ui/RevealText";
import GoldDivider from "../ui/GoldDivider";
import GoldParticles from "../ui/GoldParticles";
import { FloralFrame } from "../ui/FloralCorner";
import { Mandala, Garland } from "../ui/Ornaments";
import AddToCalendar from "../AddToCalendar";

const { events, wedding } = weddingData;
const ceremony = events.find((e) => e.featured) || events[0];

/** The centrepiece: the wedding itself, presented with more scale and drama than any other event. */
export default function Ceremony() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-10%", "10%"]);
  const day = new Date(ceremony.start).toLocaleDateString("en-GB", { day: "numeric", timeZone: weddingData.timezone });
  const year = new Date(ceremony.start).toLocaleDateString("en-GB", { year: "numeric", timeZone: weddingData.timezone });

  return (
    <section id="ceremony" ref={ref} className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-maroon-950 py-28" aria-label="The wedding ceremony">
      {/* <motion.div className="absolute -inset-y-[12%] inset-x-0 -z-20" style={{ y: bgY }}>
        <img src={wedding.ceremonyImage} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </motion.div> */}
      {/* cinematic grade */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-maroon-950/90 via-maroon-950/35 to-maroon-950/95" />
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgb(36 8 13 / .5), rgb(36 8 13 / .78) 100%)" }} />

      <Mandala className="spin-slow pointer-events-none absolute top-1/2 left-1/2 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 text-gold-400/[0.14]" strokeWidth={0.3} />
      <GoldParticles count={16} sparkles={6} seed={51} />
      <Garland className="pointer-events-none absolute inset-x-0 top-0 h-12 w-full opacity-90 sm:h-16" flowers={13} />

      <div className="pointer-events-none absolute inset-3 border border-gold-500/40 sm:inset-6" />
      <FloralFrame inset="inset-3 sm:inset-6" size="w-16 sm:w-28 lg:w-36" className="text-gold-300" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-8 text-center">
        <motion.p {...inView(fadeUp(0, 12))} className="font-script text-2xl text-gold-200 sm:text-4xl">
          With the blessings of the elders
        </motion.p>

        <RevealText
          as="h2"
          text="THE WEDDING CEREMONY"
          stagger={0.16}
          className="mt-5 font-display text-[clamp(2.4rem,11vw,5.6rem)] leading-[1.02] font-light tracking-[0.06em] text-ivory-50"
        />

        <GoldDivider className="mt-8 text-gold-400" width="w-64 md:w-96" delay={0.3} />

        {/* the date, as a monument */}
        <motion.div {...inView(blurIn(0.2))} className="mt-10 flex flex-col items-center">
          <span className="eyebrow text-gold-300">{formatWeekday(ceremony.start)}</span>
          <span className="text-gold-gradient font-display text-[clamp(6rem,30vw,12rem)] leading-[0.85] font-light" style={{ fontVariantNumeric: "lining-nums" }}>
            {day}
          </span>
          <span className="eyebrow mt-2 text-ivory-100">
            {formatDayMonth(ceremony.start).split(" ").slice(1).join(" ")} · {year}
          </span>
        </motion.div>

        <motion.ul {...inView(fadeUp(0.3, 20))} className="mt-10 space-y-3 text-ivory-100">
          <li className="flex items-center justify-center gap-3 text-lg font-light">
            <Clock size={18} strokeWidth={1.25} className="text-gold-400" aria-hidden="true" />
            {formatTimeRange(ceremony.start, ceremony.end)}
          </li>
          <li className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-3 font-display text-2xl">
              <MapPin size={18} strokeWidth={1.25} className="text-gold-400" aria-hidden="true" />
              {ceremony.venue}
            </span>
            <span className="max-w-sm text-sm font-light text-ivory-100/70">{ceremony.address}</span>
          </li>
        </motion.ul>

        <motion.p {...inView(fadeUp(0.4, 16))} className="mt-8 max-w-md text-[0.95rem] leading-relaxed font-light text-ivory-100/75">
          {ceremony.description}
        </motion.p>

        <motion.div
          className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
        >
          <AddToCalendar event={ceremony} tone="dark" className="flex-1" />
          <a href={resolveMapsUrl(ceremony, "directions")} target="_blank" rel="noopener noreferrer" className="btn-gold flex-1" aria-label={`Get directions to ${ceremony.venue}`}>
            <Navigation size={16} strokeWidth={1.75} aria-hidden="true" />
            Directions
          </a>
        </motion.div>
      </div>
    </section>
  );
}
