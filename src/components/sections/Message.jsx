import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useInView } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import weddingData from "../../data/weddingData";
import { EASE, SPRING_POP } from "../../lib/motion";
import Confetti from "../ui/Confetti";
import { FloatingHearts, Streamers, Popper } from "../ui/LoveDecor";

const { lines, signature } = weddingData.message;
const { bride, groom } = weddingData;

/** Words pop in one by one with a little spring and tilt. */
function PopLine({ text, index, total }) {
  const last = index === total - 1;
  const first = index === 0;
  const words = text.split(" ");
  return (
    <motion.p
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.8 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 + index * 0.35 } } }}
      className={`font-display tracking-tight ${
        first
          ? "text-[3.4rem] leading-none font-medium sm:text-7xl md:text-8xl"
          : last
            ? "mx-auto max-w-[17ch] text-[1.7rem] leading-[1.25] font-light text-maroon-800 italic sm:max-w-[24ch] sm:text-4xl"
            : "text-[2.1rem] leading-[1.1] font-light text-maroon-900 sm:text-5xl md:text-6xl"
      }`}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <motion.span
            className={`inline-block will-change-transform ${first ? "text-rose-gradient" : ""}`}
            variants={{
              hidden: { opacity: 0, y: 34, scale: 0.6, rotate: i % 2 ? 6 : -6 },
              show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { ...SPRING_POP, stiffness: 180, damping: 13 } },
            }}
          >
            {w}
          </motion.span>{" "}
        </Fragment>
      ))}
    </motion.p>
  );
}

export default function Message() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const confetti = useRef(null);
  const heartRef = useRef(null);
  const popperL = useRef(null);
  const popperR = useRef(null);
  const leftCtl = useAnimationControls();
  const rightCtl = useAnimationControls();
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });
  const [taps, setTaps] = useState(0);

  const relCenter = (el, fx = 0.5, fy = 0.5) => {
    const s = sectionRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - s.left + r.width * fx, y: r.top - s.top + r.height * fy };
  };

  const recoil = (ctl) => ctl.start({ scale: [1, 1.28, 0.94, 1], rotate: [0, -9, 4, 0], transition: { duration: 0.6, ease: EASE } });

  /** Both poppers fire toward the middle, then a second, lighter volley and a shower from the top. */
  const celebrate = useCallback(() => {
    const c = confetti.current;
    if (!c || !popperL.current || !popperR.current) return;
    const { h } = c.size();
    const power = Math.min(30, Math.max(19, h * 0.03));
    const volley = (count) => {
      const l = relCenter(popperL.current, 0.7, 0.3);
      const r = relCenter(popperR.current, 0.3, 0.3);
      c.burst({ ...l, angle: -58, spread: 42, power, count });
      c.burst({ ...r, angle: -122, spread: 42, power, count });
      recoil(leftCtl);
      recoil(rightCtl);
    };
    const small = window.matchMedia("(max-width: 640px)").matches;
    volley(small ? 34 : 60);
    setTimeout(() => volley(small ? 20 : 36), 650);
    c.rain(small ? 30 : 60, 2400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (inView && !reduce) celebrate();
  }, [inView, reduce, celebrate]);

  const tapHeart = () => {
    setTaps((n) => n + 1);
    if (reduce || !confetti.current) return;
    const p = relCenter(heartRef.current);
    confetti.current.burst({ ...p, angle: -90, spread: 360, power: 13, count: 46, hearts: true });
    if (taps % 3 === 2) celebrate();
  };

  return (
    <section
      id="message"
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-28 sm:py-32"
      style={{ background: "linear-gradient(180deg, #c98590 0%, #efbcc5 12%, #fbe3e7 34%, #fdeff1 60%, #f7d6dc 100%)" }}
      aria-label="Our message to you"
    >
      {/* soft light behind the heart + a giant faint heart as watermark */}
      <div className="pointer-events-none absolute top-[30%] left-1/2 -z-10 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgb(255 255 255 / .75) 0%, rgb(255 236 240 / .35) 45%, transparent 70%)" }} />
      <svg viewBox="0 0 200 180" className="heartbeat pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]" aria-hidden="true">
        <path d="M100 172C100 172 12 112 12 55C12 26 34 8 60 8c17 0 32 9 40 24C108 17 123 8 140 8c26 0 48 18 48 47 0 57-88 117-88 117z" fill="#82233a" />
      </svg>

      <FloatingHearts count={16} seed={5} />
      <Streamers side="left" reduce={reduce} />
      <Streamers side="right" reduce={reduce} />

      {/* party poppers in the bottom corners */}
      {[
        [popperL, leftCtl, "left-3 bottom-24 sm:left-10"],
        [popperR, rightCtl, "right-3 bottom-24 -scale-x-100 sm:right-10"],
      ].map(([ref, ctl, pos], i) => (
        <div key={i} ref={ref} className={`pointer-events-none absolute z-[5] w-16 sm:w-24 ${pos}`}>
          <motion.div animate={ctl} style={{ transformOrigin: "10% 90%" }}>
            <Popper className="block h-auto w-full drop-shadow-[0_6px_8px_rgb(80_20_40/0.3)]" />
          </motion.div>
        </div>
      ))}

      <blockquote className="relative z-10 flex flex-col items-center gap-4 text-center sm:gap-6">
        <motion.span
          className="eyebrow text-maroon-700"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1, ease: EASE }}
        >
          A note from us
        </motion.span>

        {/* the heart: draws itself, fills, beats, and ripples outward. Tap for a burst of love. */}
        <motion.button
          ref={heartRef}
          type="button"
          onClick={tapHeart}
          aria-label="Celebrate with a burst of confetti"
          whileTap={reduce ? undefined : { scale: 0.88 }}
          className="relative -my-2 cursor-pointer rounded-full"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {[0, 0.9, 1.8].map((d) => (
            <svg key={d} viewBox="0 0 200 180" className="heart-ripple pointer-events-none absolute inset-0 h-full w-full overflow-visible" style={{ "--hr-delay": `${d}s` }} aria-hidden="true" fill="none">
              <path d="M100 172C100 172 12 112 12 55C12 26 34 8 60 8c17 0 32 9 40 24C108 17 123 8 140 8c26 0 48 18 48 47 0 57-88 117-88 117z" stroke="#c9506c" strokeWidth="2.5" />
            </svg>
          ))}
          <div className="heartbeat relative w-[9.5rem] sm:w-52">
            <svg viewBox="0 0 200 180" className="block h-auto w-full overflow-visible drop-shadow-[0_14px_22px_rgb(130_35_58/0.4)]" aria-hidden="true">
              <defs>
                <linearGradient id="hm-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f0708c" />
                  <stop offset=".55" stopColor="#c9405e" />
                  <stop offset="1" stopColor="#8c2440" />
                </linearGradient>
              </defs>
              <motion.path
                d="M100 172C100 172 12 112 12 55C12 26 34 8 60 8c17 0 32 9 40 24C108 17 123 8 140 8c26 0 48 18 48 47 0 57-88 117-88 117z"
                fill="url(#hm-fill)"
                stroke="#e6cf98"
                strokeWidth="2"
                initial={reduce ? false : { pathLength: 0, fillOpacity: 0 }}
                whileInView={{ pathLength: 1, fillOpacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ pathLength: { duration: 1.8, ease: EASE }, fillOpacity: { duration: 1, delay: 1.5 } }}
              />
              <path d="M34 50c2-14 14-24 30-24" stroke="rgb(255 255 255 / .55)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="46" cy="70" r="3.5" fill="rgb(255 255 255 / .55)" />
            </svg>
            <motion.span
              className="font-script absolute inset-0 flex items-center justify-center pb-[10%] text-[1.8rem] text-ivory-50 drop-shadow-[0_2px_4px_rgb(90_15_35/0.5)] sm:text-[2.6rem]"
              initial={reduce ? false : { opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ ...SPRING_POP, delay: 2 }}
              aria-hidden="true"
            >
              {bride.name[0]} &amp; {groom.name[0]}
            </motion.span>
          </div>
        </motion.button>
        <motion.span
          className="eyebrow -mt-1 text-[0.6rem] tracking-[0.3em] text-maroon-600/80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 3, duration: 1.4 }}
          aria-hidden="true"
        >
          {taps ? "With all our love ♥" : "Tap the heart"}
        </motion.span>

        {lines.map((l, i) => (
          <PopLine key={l} text={l} index={i} total={lines.length} />
        ))}

        <motion.footer
          className="font-script mt-1 text-3xl text-maroon-700 sm:text-5xl"
          initial={{ opacity: 0, y: 14, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4, ease: EASE, delay: 1.6 }}
        >
          {signature}
        </motion.footer>
      </blockquote>

      <Confetti ref={confetti} className="z-20" />
    </section>
  );
}
