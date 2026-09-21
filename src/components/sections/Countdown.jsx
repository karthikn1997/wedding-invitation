import { motion } from "framer-motion";
import weddingData from "../../data/weddingData";
import { formatFullDate, formatTime } from "../../lib/format";
import { EASE, fadeUp, inView } from "../../lib/motion";
import SectionHeading from "../ui/SectionHeading";
import CountdownTimer from "../CountdownTimer";
import GoldParticles from "../ui/GoldParticles";
import { SkyLanterns, ShootingStars, DiyaRow } from "../ui/CountdownFX";
import { Gopuram, Mandala, Lotus } from "../ui/Ornaments";

const { wedding } = weddingData;

export default function Countdown() {
  return (
    <section id="countdown" className="relative isolate overflow-hidden bg-maroon-950 pt-24 pb-36 sm:pt-32 sm:pb-44" aria-label="Wedding countdown">
      {/* night sky: deep glow, aurora, slow light rays, mandala */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 38%, rgb(104 23 42 / .65), transparent 70%)" }} />
        <div className="aurora absolute top-[-15%] left-[-10%] h-[65vmin] w-[65vmin] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgb(214 181 107 / .2), transparent 65%)" }} />
        <div className="aurora absolute right-[-12%] bottom-[10%] h-[70vmin] w-[70vmin] rounded-full blur-3xl" style={{ "--au-delay": "-11s", background: "radial-gradient(circle, rgb(217 107 134 / .2), transparent 65%)" }} />
        <div
          className="spin-slow absolute top-[44%] left-1/2 h-[190vmax] w-[190vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            "--spin-dur": "360s",
            background: "repeating-conic-gradient(from 0deg, rgb(240 210 140 / .06) 0deg 3deg, transparent 3deg 12deg)",
            WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 40%)",
            maskImage: "radial-gradient(circle, #000 0%, transparent 40%)",
          }}
        />
        <Mandala className="spin-slow absolute top-1/2 left-1/2 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 text-gold-400/[0.1]" strokeWidth={0.3} />
        {/* the temple, lit from behind */}
        <div className="halo absolute bottom-0 left-1/2 h-[70%] w-[90%] -translate-x-1/2 translate-y-[20%]" style={{ background: "radial-gradient(ellipse at 50% 100%, rgb(240 170 90 / .32), transparent 65%)" }} />
        <Gopuram className="absolute inset-x-0 bottom-0 mx-auto h-[62%] w-auto text-maroon-900/80 drop-shadow-[0_0_22px_rgb(214_181_107/0.35)]" />
      </div>

      <ShootingStars />
      <SkyLanterns count={9} seed={17} />
      <GoldParticles count={14} sparkles={8} seed={41} />

      <SectionHeading eyebrow="Counting the days" title="Until the Muhurtham" tone="dark" />

      <div className="relative mt-14 sm:mt-20">
        <CountdownTimer target={wedding.startsAt} />
      </div>

      <motion.div {...inView(fadeUp(0.3, 16))} className="relative mt-14 flex flex-col items-center gap-3 px-6 text-center sm:mt-20">
        <div className="flex items-center gap-4 text-gold-400" aria-hidden="true">
          <span className="relative h-px w-14 overflow-hidden bg-gold-500/30 sm:w-24">
            <span className="run-x absolute inset-y-0 w-8 bg-linear-to-r from-transparent via-gold-100 to-transparent" />
          </span>
          <Lotus className="h-6 w-6" />
          <span className="relative h-px w-14 overflow-hidden bg-gold-500/30 sm:w-24">
            <span className="run-x absolute inset-y-0 w-8 bg-linear-to-r from-transparent via-gold-100 to-transparent" style={{ animationDelay: "-1.6s" }} />
          </span>
        </div>
        <p className="text-shimmer font-display text-2xl font-light tracking-wide italic sm:text-4xl">{formatFullDate(wedding.startsAt)}</p>
        <motion.p
          className="eyebrow text-gold-300"
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.38em" }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: EASE, delay: 0.4 }}
        >
          {formatTime(wedding.startsAt)} · {wedding.city}
        </motion.p>
      </motion.div>

      <DiyaRow />
    </section>
  );
}
