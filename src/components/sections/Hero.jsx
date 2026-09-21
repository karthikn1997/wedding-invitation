import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import weddingData from "../../data/weddingData";
import { formatFullDate } from "../../lib/format";
import { EASE } from "../../lib/motion";
import { useInvitation } from "../../context/InvitationContext";
import RevealText from "../ui/RevealText";
import PetalAnimation from "../ui/PetalAnimation";
import GoldParticles from "../ui/GoldParticles";
import HeroStage from "../ui/HeroStage";

const { bride, groom, couple, invitation, wedding } = weddingData;

// Everything in the hero is choreographed relative to the doors opening (~0.55 s → 2.9 s).
const T = { image: 0.5, kicker: 1.9, names: 2.2, date: 3.4, cue: 4.2, couple: 2.9 };

export default function Hero() {
  const { opened } = useInvitation();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-14%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const state = opened ? "show" : "hidden";

  return (
    <section id="home" ref={ref} className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-maroon-950" aria-label="Home">
      {/* cinematic reveal: the set blooms outward from the door seam */}
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: reduce ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)" }}
        animate={{ clipPath: opened ? "circle(150% at 50% 50%)" : reduce ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)" }}
        transition={{ duration: 3, ease: EASE, delay: T.image }}
      >
        <HeroStage opened={opened} reduce={reduce} start={T.image} />
      </motion.div>

      <PetalAnimation count={12} palette="mixed" seed={21} opacity={0.7} />
      <GoldParticles count={18} sparkles={5} seed={9} />

      {/* copy: sits inside the arch, in a box that tracks the stage width */}
      <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute inset-0 z-10 flex justify-center">
        <div className="@container relative h-full w-[min(100%,calc(100svh*0.7))] md:mt-14 md:h-[calc(100%-3.5rem)]">
          <div className="absolute inset-x-[16%] top-[30cqw] bottom-[calc(min(88cqw,42%)+3%)] flex flex-col items-center justify-center text-center">
            <motion.p
              className="font-script text-[max(1.15rem,5.4cqw)] leading-tight text-gold-200"
              initial="hidden"
              animate={state}
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 1.6, ease: EASE, delay: T.kicker } } }}
            >
              {invitation.heroKicker}
            </motion.p>

            <h1 className="mt-[1.5cqw] flex flex-col items-center leading-[0.92]" aria-label={`${groom.name} and ${bride.name}`}>
              <RevealText
                text={groom.name}
                active={opened}
                delay={T.names}
                duration={1.6}
                wordClassName="text-gold-gradient"
                className="font-display text-[max(2.4rem,10.5cqw)] font-light tracking-tight"
              />
              <motion.span
                aria-hidden="true"
                className="font-script text-[max(1.3rem,6cqw)] leading-none text-gold-300"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={opened ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                transition={{ duration: 1.4, ease: EASE, delay: T.names + 0.5 }}
              >
                &amp;
              </motion.span>
              <RevealText
                text={bride.name}
                active={opened}
                delay={T.names + 0.7}
                duration={1.6}
                wordClassName="text-gold-gradient"
                className="font-display text-[max(2.4rem,10.5cqw)] font-light tracking-tight"
              />
            </h1>

            <motion.p
              className="mt-[3cqw] text-[max(0.62rem,2.3cqw)] font-medium tracking-[0.26em] text-ivory-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: opened ? 1 : 0 }}
              transition={{ duration: 1.6, ease: EASE, delay: T.date }}
            >
              {formatFullDate(wedding.startsAt)}
            </motion.p>
            <motion.span
              aria-hidden="true"
              className="my-[1.6cqw] block h-px w-[14cqw] bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: opened ? 1 : 0, scaleX: opened ? 1 : 0 }}
              transition={{ duration: 1.4, ease: EASE, delay: T.date + 0.2 }}
            />
            <motion.p
              className="text-[max(0.58rem,2cqw)] font-light tracking-[0.2em] text-balance text-ivory-100/75 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: opened ? 1 : 0 }}
              transition={{ duration: 1.6, ease: EASE, delay: T.date + 0.2 }}
            >
              {wedding.venue} · {wedding.city}
            </motion.p>
          </div>
          {/* the couple, standing on the floor in front of the bouquets */}
          <motion.div
            className="pointer-events-none absolute bottom-[2.5%] left-1/2 aspect-square h-[min(88cqw,42%)] -translate-x-1/2"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={opened ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.94 }}
            transition={{ duration: 2, ease: EASE, delay: T.couple }}
          >
            <img
              src={couple.heroCartoon}
              alt={couple.heroCartoonAlt}
              width="1100"
              height="1100"
              fetchPriority="high"
              decoding="async"
              className="float-soft h-full w-full object-contain drop-shadow-[0_12px_16px_rgb(28_4_12/0.45)]"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* the couple now stands where the scroll cue used to be, so the cue is kept for assistive tech only */}
      <a href="#message" className="sr-only focus:not-sr-only focus:absolute focus:bottom-3 focus:left-1/2 focus:z-20 focus:-translate-x-1/2 focus:rounded-full focus:bg-ivory-50 focus:px-4 focus:py-2 focus:text-sm focus:text-maroon-900">
        Scroll to explore the invitation
      </a>
    </section>
  );
}
