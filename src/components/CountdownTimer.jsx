import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "../hooks/useCountdown";
import { EASE, VIEWPORT, stagger } from "../lib/motion";

/**
 * Tracks an element's rendered width in px via ResizeObserver.
 * Used instead of CSS container-query units (`cqw`) for the digit font-size: some WebKit builds on
 * iOS fail to size `cqw` text inside this nested aspect-ratio/overflow-hidden ring (the text computes
 * to zero size and disappears), while a plain px value from measured layout is always reliable.
 */
function useWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

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

/**
 * One unit of time as a glowing clock ring:
 *   – the arc drains as time runs out (and swooshes full again when the unit wraps)
 *   – a bead of light rides the tip of the arc
 *   – every change sends a ripple out from the ring
 *   – a dotted outer ring turns slowly; a soft halo breathes behind it
 */
function Unit({ value, label, max, from, to }) {
  const prev = useRef(value);
  const wrapped = value > prev.current;
  useEffect(() => {
    prev.current = value;
  }, [value]);

  const p = Math.min(100, (value / max) * 100);
  const ease = wrapped ? "1.1s cubic-bezier(.22,1,.36,1)" : "1s linear";
  const digits = String(value).padStart(2, "0").split("");
  const id = `cd-${label}`;
  const [ringRef, ringWidth] = useWidth();

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 40, scale: 0.85 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: EASE } } }}
      className="flex w-full flex-col items-center"
    >
      <div ref={ringRef} className="group relative aspect-square w-full max-w-46">
        <div className="halo absolute inset-[-14%] rounded-full" style={{ background: `radial-gradient(circle, ${to}55 0%, ${to}18 45%, transparent 70%)` }} />

        {/* slow dotted outer ring */}
        <svg viewBox="0 0 200 200" className="spin-slow pointer-events-none absolute inset-[-3%] h-[106%] w-[106%]" fill="none" aria-hidden="true" style={{ "--spin-dur": "60s" }}>
          <circle cx="100" cy="100" r="98" stroke={from} strokeOpacity=".55" strokeWidth="1" strokeDasharray="1 5.2" strokeLinecap="round" />
        </svg>

        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90 overflow-visible" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={from} />
              <stop offset="1" stopColor={to} />
            </linearGradient>
          </defs>
          {/* minute-mark ticks + track */}
          <circle cx="100" cy="100" r="94" stroke={from} strokeOpacity=".4" strokeWidth="5" strokeDasharray="0.7 4.4" />
          <circle cx="100" cy="100" r="85" stroke={from} strokeOpacity=".16" strokeWidth="6" />
          {/* the draining arc */}
          <circle
            cx="100"
            cy="100"
            r="85"
            pathLength="100"
            stroke={`url(#${id})`}
            strokeWidth="6"
            strokeLinecap="round"
            style={{ strokeDasharray: `${p} 100`, transition: `stroke-dasharray ${ease}`, filter: `drop-shadow(0 0 5px ${to}cc)` }}
          />
        </svg>

        {/* bead of light riding the arc tip */}
        <div className="absolute inset-0" style={{ transform: `rotate(${p * 3.6}deg)`, transition: `transform ${ease}` }} aria-hidden="true">
          <span
            className="absolute top-[7.5%] left-1/2 h-[7%] w-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            style={{ boxShadow: `0 0 8px 2px #fff, 0 0 18px 6px ${to}, 0 0 34px 12px ${to}88` }}
          />
        </div>

        {/* ripple on every change */}
        <span key={value} className="tick-ripple pointer-events-none absolute inset-[4%] rounded-full border" style={{ borderColor: from }} aria-hidden="true" />

        {/* glass face + rolling digits */}
        <div
          className="absolute inset-[13%] grid place-items-center overflow-hidden rounded-full shadow-[inset_0_0_28px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(214,181,107,0.35)]"
          style={{ background: "radial-gradient(circle at 50% 30%, #6d1f34 0%, #3a0d15 60%, #24080d 100%)" }}
        >
          <div className="glint absolute inset-y-0 left-[-70%] w-[45%] opacity-40" style={{ background: "linear-gradient(100deg, transparent 20%, rgb(255 244 214 / .8) 50%, transparent 80%)" }} aria-hidden="true" />
          <div
            className="text-gold-gradient flex justify-center font-display text-[9vw] leading-none font-light sm:text-[5vw]"
            style={{
              fontVariantNumeric: "lining-nums tabular-nums",
              textShadow: "0 0 12px rgb(240 200 120 / 0.5)",
              // measured px, not `cqw` — some iOS WebKit builds fail to size container-query units inside
              // this nested aspect-ratio/overflow-hidden ring and the text disappears; px always works
              fontSize: ringWidth ? `${ringWidth * 0.31}px` : undefined,
            }}
            aria-hidden="true"
          >
            {digits.map((d, i) => (
              <Digit key={i} value={d} />
            ))}
          </div>
        </div>
      </div>
      <p className="eyebrow mt-5 text-[0.6rem] tracking-[0.3em] text-gold-300 sm:text-[0.68rem] sm:tracking-[0.36em]">{label}</p>
    </motion.div>
  );
}

/** Live countdown to `target` (ISO string). All timing math lives in useCountdown. */
export default function CountdownTimer({ target, doneMessage = "Today is the day" }) {
  const { days, hours, minutes, seconds, done } = useCountdown(target);
  // fix the day-ring's full scale once, at the next multiple of 50 above today's count
  const [daysMax] = useState(() => Math.max(50, Math.ceil((days + 1) / 50) * 50));

  if (done) {
    return (
      <p className="text-shimmer font-display text-center text-5xl font-light italic sm:text-7xl" role="status">
        {doneMessage}
      </p>
    );
  }

  return (
    <div className="relative">
      {/* giant outlined day-count behind the rings */}
      <div className="text-outline-gold pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[min(58vw,26rem)] leading-none font-light opacity-[0.16] select-none" aria-hidden="true" style={{ fontVariantNumeric: "lining-nums" }}>
        {days}
      </div>

      <motion.div
        role="timer"
        aria-label={`${days} days until the wedding`}
        className="relative mx-auto grid w-full max-w-4xl grid-cols-2 justify-items-center gap-x-4 gap-y-10 px-6 sm:grid-cols-4 sm:gap-x-6"
        variants={stagger(0.16)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
      >
        <Unit value={days} max={daysMax} label="DAYS" from="#f6e8bf" to="#d6b56b" />
        <Unit value={hours} max={24} label="HOURS" from="#f7c1c6" to="#e0708a" />
        <Unit value={minutes} max={60} label="MINUTES" from="#ffe9a8" to="#eaa62e" />
        <Unit value={seconds} max={60} label="SECONDS" from="#ffd6dc" to="#e6455f" />
      </motion.div>
    </div>
  );
}
