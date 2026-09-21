import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "../hooks/useCountdown";
import { EASE, VIEWPORT, stagger } from "../lib/motion";

/** A single rolling digit: the old number lifts away as the new one rises in. */
function Digit({ value }) {
  return (
    <span className="relative inline-block h-[1.05em] w-[0.6em] overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: "85%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-85%", opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** An arched "mandapam window" holding one unit of time. */
function Unit({ value, label }) {
  const digits = String(value).padStart(2, "0").split("");
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 40, scale: 0.94 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: EASE } } }}
      className="flex flex-col items-center"
    >
      <div className="relative w-full rounded-t-[999px] rounded-b-lg border border-gold-500/45 bg-gradient-to-b from-maroon-800/80 to-maroon-950/90 px-1 pt-7 pb-5 shadow-[inset_0_0_30px_rgba(0,0,0,0.35),0_20px_40px_-20px_rgba(0,0,0,0.6)] sm:pt-12 sm:pb-8">
        <span className="pointer-events-none absolute inset-1 rounded-t-[999px] rounded-b-md border border-gold-500/15" />
        <div
          className="text-gold-gradient flex justify-center font-display text-[clamp(1.9rem,9.4vw,4.6rem)] leading-none font-light"
          style={{ fontVariantNumeric: "lining-nums tabular-nums" }}
          aria-hidden="true"
        >
          {digits.map((d, i) => (
            <Digit key={i} value={d} />
          ))}
        </div>
      </div>
      <p className="eyebrow mt-4 text-[0.56rem] tracking-[0.28em] text-gold-300 sm:mt-5 sm:text-[0.68rem] sm:tracking-[0.36em]">{label}</p>
    </motion.div>
  );
}

/** Live countdown to `target` (ISO string). All timing math lives in useCountdown. */
export default function CountdownTimer({ target, doneMessage = "Today is the day" }) {
  const { days, hours, minutes, seconds, done } = useCountdown(target);

  if (done) {
    return (
      <p className="text-gold-gradient font-display text-5xl font-light italic sm:text-7xl" role="status">
        {doneMessage}
      </p>
    );
  }

  return (
    <motion.div
      role="timer"
      aria-label={`${days} days until the wedding`}
      className="mx-auto grid w-full max-w-3xl grid-cols-4 gap-2.5 px-4 sm:gap-6"
      variants={stagger(0.16)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      <Unit value={days} label="DAYS" />
      <Unit value={hours} label="HOURS" />
      <Unit value={minutes} label="MINUTES" />
      <Unit value={seconds} label="SECONDS" />
    </motion.div>
  );
}
