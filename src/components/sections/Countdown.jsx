import { motion } from "framer-motion";
import weddingData from "../../data/weddingData";
import { formatFullDate, formatTime } from "../../lib/format";
import { fadeUp, inView } from "../../lib/motion";
import SectionHeading from "../ui/SectionHeading";
import CountdownTimer from "../CountdownTimer";
import GoldParticles from "../ui/GoldParticles";
import { Gopuram, Mandala } from "../ui/Ornaments";

const { wedding } = weddingData;

export default function Countdown() {
  return (
    <section id="countdown" className="relative isolate overflow-hidden bg-maroon-950 py-24 sm:py-32" aria-label="Wedding countdown">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgb(104 23 42 / .55), transparent 70%)" }} />
      <Mandala className="spin-slow pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 text-gold-400/[0.1]" strokeWidth={0.3} />
      <Gopuram className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 mx-auto h-[62%] w-auto text-maroon-900/70" />
      <GoldParticles count={14} sparkles={6} seed={41} />

      <SectionHeading eyebrow="Counting the days" title="Until the Muhurtham" tone="dark" />

      <div className="relative mt-14 sm:mt-20">
        <CountdownTimer target={wedding.startsAt} />
      </div>

      <motion.div {...inView(fadeUp(0.3, 16))} className="relative mt-14 flex flex-col items-center gap-2 px-6 text-center sm:mt-20">
        <p className="font-display text-2xl font-light tracking-wide text-ivory-50 italic sm:text-3xl">{formatFullDate(wedding.startsAt)}</p>
        <p className="eyebrow text-gold-400">
          {formatTime(wedding.startsAt)} · {wedding.city}
        </p>
      </motion.div>
    </section>
  );
}
