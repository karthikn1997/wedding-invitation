import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import weddingData from "../../data/weddingData";
import { formatFullDate, formatNumericDate } from "../../lib/format";
import { EASE, blurIn, fadeUp, inView } from "../../lib/motion";
import RevealText from "../ui/RevealText";
import GoldDivider from "../ui/GoldDivider";
import PetalAnimation from "../ui/PetalAnimation";
import GoldParticles from "../ui/GoldParticles";
import { FloralFrame } from "../ui/FloralCorner";
import { Lotus } from "../ui/Ornaments";

const { bride, groom, couple, thankYou, wedding } = weddingData;

/**
 * The closing. A tall scroll runway with a sticky stage: the thank-you plays while the photograph
 * slowly settles, then — as you reach the end — everything dissolves into the dark, leaving only
 * the couple's monogram and the date.
 */
export default function ThankYou() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const bgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.14, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.7, 0.88], [1, 0]);
  const veil = useTransform(scrollYProgress, [0.68, 0.9], [0, 1]);
  const finaleOpacity = useTransform(scrollYProgress, [0.86, 0.98], [0, 1]);
  const finaleY = useTransform(scrollYProgress, [0.86, 0.98], [24, 0]);

  return (
    <section id="thanks" ref={ref} className="relative bg-maroon-950" style={{ height: reduce ? "auto" : "260svh" }} aria-label="Thank you">
      <div className={`${reduce ? "min-h-[100svh] py-28" : "sticky top-0 h-[100svh]"} relative flex items-center justify-center overflow-hidden`}>
        <motion.img
          src={couple.closingImage}
          alt={couple.closingAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
          style={{ scale: bgScale }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-950/80 via-maroon-950/55 to-maroon-950/90" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgb(36 8 13 / .55), rgb(36 8 13 / .2) 60%, transparent)" }} />

        <PetalAnimation count={12} palette="mixed" seed={81} opacity={0.65} />
        <GoldParticles count={16} sparkles={6} seed={13} />
        <div className="pointer-events-none absolute inset-3 border border-gold-400/35 sm:inset-6" />
        <FloralFrame inset="inset-3 sm:inset-6" size="w-16 sm:w-28 lg:w-36" className="text-gold-300" />

        <motion.div style={reduce ? undefined : { opacity: contentOpacity }} className="relative z-10 flex max-w-2xl flex-col items-center px-8 text-center">
          <RevealText as="h2" text={thankYou.title} stagger={0.2} duration={1.6} wordClassName="text-gold-gradient" className="font-display text-[clamp(4rem,19vw,8.5rem)] leading-none font-light tracking-tight" />

          <GoldDivider className="mt-6 text-gold-400" delay={0.4} />

          <div className="mt-8 space-y-3">
            {thankYou.lines.map((l, i) => (
              <motion.p key={l} {...inView(blurIn(0.3 + i * 0.35))} className={i === 0 ? "font-display text-2xl font-light text-ivory-50 italic sm:text-3xl" : "mx-auto max-w-sm text-[0.95rem] leading-relaxed font-light text-ivory-100/80"}>
                {l}
              </motion.p>
            ))}
          </div>

          <motion.div {...inView(fadeUp(0.9, 20))} className="mt-12 flex flex-col items-center">
            <p className="font-script text-3xl text-gold-200 sm:text-4xl">{thankYou.signoff}</p>
            <p className="mt-2 flex flex-col items-center font-display text-3xl font-light tracking-[0.12em] text-ivory-50 uppercase sm:flex-row sm:gap-4 sm:text-4xl" aria-label={`${bride.name} and ${groom.name}`}>
              <span>{bride.name}</span>
              <span className="font-script text-4xl leading-none text-gold-300 normal-case" aria-hidden="true">
                &amp;
              </span>
              <span>{groom.name}</span>
            </p>
            <p className="eyebrow mt-6 text-gold-300">{formatFullDate(wedding.startsAt)}</p>
          </motion.div>
        </motion.div>

        {/* the fade to dark, and the monogram left behind */}
        {!reduce && (
          <>
            <motion.div style={{ opacity: veil }} className="pointer-events-none absolute inset-0 z-20 bg-maroon-950" />
            <motion.div style={{ opacity: finaleOpacity, y: finaleY }} className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 text-center">
              <Lotus className="h-12 w-12 text-gold-500" />
              <p className="text-gold-gradient font-display text-[clamp(2.6rem,12vw,5rem)] leading-none font-light">
                {bride.name[0]} <span className="font-script">&amp;</span> {groom.name[0]}
              </p>
              <p className="eyebrow text-gold-400">{formatNumericDate(wedding.startsAt)}</p>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
