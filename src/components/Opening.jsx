import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import weddingData from "../data/weddingData";
import { formatFullDate } from "../lib/format";
import { EASE, EASE_IN_OUT } from "../lib/motion";
import RevealText from "./ui/RevealText";
import GoldParticles from "./ui/GoldParticles";
import PetalAnimation from "./ui/PetalAnimation";
import { FloralFrame } from "./ui/FloralCorner";
import { Gopuram, Mandala, Garland, Lotus } from "./ui/Ornaments";

const { bride, groom, invitation, wedding } = weddingData;

/** Reveal timeline (ms from mount): blessing → headline → names → date → CTA. */
const STAGE_TIMES = [350, 1700, 2900, 4200, 5000];
const OPEN_DELAY = 0.55; // doors start swinging after the content has faded
const OPEN_DURATION = 2.3;

/** One leaf of the carved temple door. Purely decorative. */
function Door({ side, opening, reduce, onDone }) {
  const left = side === "left";
  return (
    <motion.div
      className={`absolute top-0 h-full w-1/2 ${left ? "left-0 origin-left" : "right-0 origin-right"}`}
      style={{ backfaceVisibility: "hidden", willChange: "transform" }}
      initial={false}
      // both variants carry the same keys, so switching never spawns a stray instant "cleanup" animation
      variants={{
        closed: { rotateY: 0, opacity: 1 },
        open: reduce ? { rotateY: 0, opacity: 0 } : { rotateY: left ? 104 : -104, opacity: 1 },
      }}
      animate={opening ? "open" : "closed"}
      transition={{ duration: reduce ? 0.6 : OPEN_DURATION, ease: EASE_IN_OUT, delay: OPEN_DELAY }}
      onAnimationComplete={(label) => label === "open" && left && onDone?.()}
    >
      <div
        className="absolute inset-0"
        style={{
          background: left
            ? "linear-gradient(90deg,#3a0d15 0%,#4f1120 55%,#5a1526 100%)"
            : "linear-gradient(270deg,#3a0d15 0%,#4f1120 55%,#5a1526 100%)",
        }}
      />
      {/* carved recessed panels */}
      <div className={`absolute inset-y-[76px] ${left ? "left-4 right-3" : "left-3 right-4"} grid grid-rows-3 gap-3 sm:gap-4`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="relative flex items-center justify-center rounded-[3px] border border-gold-500/25"
            style={{ background: "radial-gradient(ellipse at center, rgb(0 0 0 / .22), rgb(0 0 0 / .05) 70%)", boxShadow: "inset 0 0 28px rgb(0 0 0 / .35)" }}
          >
            <span className="absolute inset-1.5 rounded-[2px] border border-gold-500/15" />
            <Lotus className="h-10 w-10 text-gold-500/25 sm:h-14 sm:w-14" />
          </div>
        ))}
      </div>
      {/* brass studs down the meeting edge */}
      <div
        className={`absolute inset-y-0 w-2.5 ${left ? "right-1" : "left-1"}`}
        style={{ backgroundImage: "radial-gradient(circle, #d6b56b 0 1.6px, transparent 2.2px)", backgroundSize: "100% 22px", opacity: 0.55 }}
      />
      {/* torana garland across the top */}
      <Garland className="absolute inset-x-0 top-0 h-[68px] w-full" flowers={5} />
      {/* darkening as the leaf swings into shadow */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={false}
        animate={{ opacity: opening ? 0.75 : 0 }}
        transition={{ duration: OPEN_DURATION, ease: EASE_IN_OUT, delay: OPEN_DELAY }}
      />
    </motion.div>
  );
}

export default function Opening({ onOpen, onDone }) {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(reduce ? 5 : 0);
  const [opening, setOpening] = useState(false);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (reduce) return undefined;
    const timers = STAGE_TIMES.map((ms, i) => setTimeout(() => setStage((s) => Math.max(s, i + 1)), ms));
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  useEffect(() => {
    if (stage >= 5) ctaRef.current?.focus({ preventScroll: true });
  }, [stage]);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onOpen?.();
  };

  const shown = (n) => stage >= n;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation — open to enter"
      className="fixed inset-0 z-[100] overflow-hidden"
      onClick={() => !opening && stage < 5 && setStage(5)} // tap to skip the intro
    >
      {/* light spilling through the gap as the doors part */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 45% 70% at 50% 50%, rgb(255 226 150 / .95), rgb(214 181 107 / .35) 45%, transparent 75%)" }}
        initial={{ opacity: 0 }}
        animate={opening ? { opacity: [0, 0.85, 0] } : { opacity: 0 }}
        transition={{ duration: OPEN_DURATION + 0.6, ease: EASE_IN_OUT, delay: OPEN_DELAY, times: [0, 0.35, 1] }}
      />

      {/* the doors */}
      <div className="absolute inset-0" style={{ perspective: 1800 }}>
        <Door side="left" opening={opening} reduce={reduce} onDone={onDone} />
        <Door side="right" opening={opening} reduce={reduce} onDone={onDone} />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-400/70 to-transparent" />
      </div>

      {/* invitation content, floating above the closed doors */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        animate={opening ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ pointerEvents: opening ? "none" : "auto" }}
      >
        {/* soft vignette so type stays legible over the carved doors */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 60% at 50% 52%, rgb(36 8 13 / .82), rgb(36 8 13 / .35) 60%, transparent 85%)" }} />
        {/* temple silhouette */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[72%] justify-center text-maroon-950/70"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.4, ease: EASE, delay: 0.1 }}
        >
          <Gopuram className="h-full w-auto max-w-none" />
        </motion.div>
        <Mandala className="spin-slow pointer-events-none absolute top-1/2 left-1/2 h-[125vmin] w-[125vmin] -translate-x-1/2 -translate-y-1/2 text-gold-400/[0.13]" strokeWidth={0.35} />

        <PetalAnimation count={9} palette="marigold" seed={11} opacity={0.6} />
        <GoldParticles count={16} sparkles={5} seed={5} />
        <div className="pointer-events-none absolute inset-3 border border-gold-500/35 sm:inset-5" />
        <FloralFrame inset="inset-3 sm:inset-5" size="w-16 sm:w-28" className="text-gold-400/80" />

        <div className="relative flex flex-col items-center gap-[clamp(0.9rem,2.6svh,1.8rem)]">
          <motion.p
            className="font-display text-[1.05rem] font-light tracking-[0.06em] text-gold-200 italic sm:text-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: shown(1) ? 1 : 0, y: shown(1) ? 0 : 10 }}
            transition={{ duration: 1.6, ease: EASE }}
          >
            {invitation.blessing}
          </motion.p>

          <RevealText
            as="p"
            text={invitation.headline.toUpperCase()}
            active={shown(2)}
            stagger={0.14}
            className="max-w-[19rem] text-[0.78rem] font-medium leading-[2] tracking-[0.4em] text-balance text-ivory-100 sm:max-w-none sm:text-sm"
          />

          <div className="flex flex-col items-center gap-0 leading-[0.92] sm:gap-1 md:flex-row md:gap-8">
            <RevealText
              as="p"
              text={bride.name}
              active={shown(3)}
              duration={1.6}
              wordClassName="text-gold-gradient"
              className="font-display text-[clamp(3.4rem,17vw,7rem)] font-light tracking-tight"
            />
            <motion.span
              className="font-script text-[clamp(2.2rem,9vw,3.6rem)] leading-none text-gold-300"
              initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
              animate={shown(3) ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -12 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.45 }}
              aria-hidden="true"
            >
              &amp;
            </motion.span>
            <RevealText
              as="p"
              text={groom.name}
              active={shown(3)}
              duration={1.6}
              delay={0.6}
              wordClassName="text-gold-gradient"
              className="font-display text-[clamp(3.4rem,17vw,7rem)] font-light tracking-tight"
            />
          </div>

          <motion.p
            className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.32em] text-gold-300 sm:text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: shown(4) ? 1 : 0 }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <span className="h-px w-6 bg-gold-500/70 sm:w-10" />
            {formatFullDate(wedding.startsAt)}
            <span className="h-px w-6 bg-gold-500/70 sm:w-10" />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: shown(5) ? 1 : 0, y: shown(5) ? 0 : 18 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="relative mt-2 sm:mt-4"
            style={{ pointerEvents: shown(5) ? "auto" : "none" }}
          >
            {!reduce && shown(5) && (
              <motion.span
                className="absolute inset-0 rounded-full border border-gold-400/70"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.45, opacity: 0 }}
                transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity }}
                aria-hidden="true"
              />
            )}
            <button
              ref={ctaRef}
              type="button"
              className="btn-gold relative min-h-14 px-9"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              tabIndex={shown(5) ? 0 : -1}
            >
              {invitation.cta}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
