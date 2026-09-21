import { motion } from "framer-motion";
import weddingData from "../../data/weddingData";
import { EASE, fadeUp, inView } from "../../lib/motion";
import SectionHeading from "../ui/SectionHeading";
import GlowFrame from "../ui/GlowFrame";
import RevealText from "../ui/RevealText";
import GoldParticles from "../ui/GoldParticles";
import { Lotus, Mandala, SparkleStar } from "../ui/Ornaments";

const { bride, groom } = weddingData;

/** One bride/groom block: living frame, glowing role badge, shimmering name, details. */
function PersonCard({ role, person, relation, from, className = "" }) {
  return (
    <article className={`relative ${className}`}>
      <div className="relative">
        <GlowFrame src={person.image} alt={person.alt} from={from} />
        <motion.span
          className="badge-shine eyebrow absolute -bottom-4 left-1/2 z-10 -translate-x-1/2 overflow-hidden rounded-full bg-maroon-900 px-5 py-2 text-[0.62rem] whitespace-nowrap text-gold-300 shadow-[0_0_0_1px_rgba(195,156,71,0.7),0_0_22px_rgba(214,181,107,0.45)]"
          {...inView(fadeUp(0.6, 10))}
        >
          {role}
        </motion.span>
      </div>

      <div className="mt-10 text-center">
        <RevealText as="h3" text={person.name} wordClassName="text-shimmer" className="font-display text-4xl font-light sm:text-5xl" />
        <motion.span
          aria-hidden="true"
          className="mx-auto mt-3 block h-px w-24 origin-center bg-linear-to-r from-transparent via-gold-300 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
        />
        <motion.p {...inView(fadeUp(0.25, 12))} className="mt-3 font-display text-lg text-gold-300 italic">
          {relation}
        </motion.p>
        <motion.p {...inView(fadeUp(0.35, 12))} className="mx-auto mt-1 max-w-xs text-[0.95rem] font-light text-ivory-100/85">
          {person.parents}
        </motion.p>
        <motion.p {...inView(fadeUp(0.45, 12))} className="mx-auto mt-4 max-w-[19rem] text-sm leading-relaxed font-light text-ivory-100/60">
          {person.tagline}
        </motion.p>
      </div>
    </article>
  );
}

/** A hairline with a bead of light running along it. */
function RunLine({ vertical = false }) {
  return (
    <span className={`relative block overflow-hidden ${vertical ? "h-20 w-px max-md:hidden" : "h-px w-16 md:hidden"} bg-gold-500/30`}>
      <span className={`absolute ${vertical ? "run-y inset-x-0 h-8 bg-linear-to-b" : "run-x inset-y-0 w-8 bg-linear-to-r"} from-transparent via-gold-100 to-transparent`} />
    </span>
  );
}

/** The centre piece: a glowing "&" seal with turning rings. */
function LoveSeal() {
  return (
    <motion.div
      aria-hidden="true"
      className="flex items-center justify-center gap-3 md:flex-col md:pt-24"
      {...inView({ hidden: { opacity: 0, scale: 0.5 }, show: { opacity: 1, scale: 1, transition: { duration: 1.6, ease: EASE } } })}
    >
      <RunLine />
      <RunLine vertical />
      <div className="relative grid h-32 w-32 place-items-center sm:h-36 sm:w-36">
        <div className="halo absolute inset-[-30%] rounded-full" style={{ background: "radial-gradient(circle, rgb(240 200 120 / .5) 0%, rgb(217 107 134 / .18) 45%, transparent 70%)" }} />
        <Mandala className="spin-slow absolute inset-0 h-full w-full text-gold-300/60" strokeWidth={0.45} />
        <svg viewBox="0 0 100 100" className="spin-slow spin-rev absolute inset-[9%] h-[82%] w-[82%] text-gold-200" fill="none" style={{ "--spin-dur": "40s" }}>
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth=".6" strokeDasharray="1 4.2" strokeLinecap="round" />
        </svg>
        <div className="relative grid h-[58%] w-[58%] place-items-center rounded-full bg-maroon-900 shadow-[0_0_28px_rgb(240_200_120/0.5),inset_0_0_0_1px_rgb(214_181_107/0.7)]">
          <span className="text-shimmer font-script pb-1 text-5xl leading-none sm:text-6xl">&amp;</span>
        </div>
        {[
          ["-6%", "10%", 14, 0],
          ["92%", "18%", 11, 1.3],
          ["4%", "86%", 12, 2.1],
          ["96%", "80%", 15, 0.6],
        ].map(([l, t, s, d], i) => (
          <span key={i} className="sparkle absolute text-gold-100" style={{ left: l, top: t, width: s, height: s, "--s-dur": "3.2s", "--s-delay": `${-d}s` }}>
            <SparkleStar className="block h-full w-full drop-shadow-[0_0_6px_rgb(255_240_190/0.9)]" />
          </span>
        ))}
      </div>
      <Lotus className="hidden h-7 w-7 text-gold-400 md:block" />
      <RunLine vertical />
      <RunLine />
    </motion.div>
  );
}

export default function Couple() {
  return (
    <section id="couple" className="bg-maroon-lattice relative isolate overflow-hidden py-24 sm:py-32" aria-label="The bride and groom">
      {/* atmosphere: slow light rays, drifting aurora glows, gold dust */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="spin-slow absolute top-[38%] left-1/2 h-[190vmax] w-[190vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            "--spin-dur": "320s",
            background: "repeating-conic-gradient(from 0deg, rgb(240 210 140 / .07) 0deg 4deg, transparent 4deg 15deg)",
            WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 42%)",
            maskImage: "radial-gradient(circle, #000 0%, transparent 42%)",
          }}
        />
        <div className="aurora absolute top-[-10%] left-[-15%] h-[70vmin] w-[70vmin] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgb(214 181 107 / .22), transparent 65%)" }} />
        <div className="aurora absolute right-[-15%] bottom-[5%] h-[75vmin] w-[75vmin] rounded-full blur-3xl" style={{ "--au-delay": "-9s", background: "radial-gradient(circle, rgb(217 107 134 / .22), transparent 65%)" }} />
      </div>
      <GoldParticles count={16} sparkles={8} seed={31} />

      <SectionHeading eyebrow="The Couple" title="Two families, one celebration" tone="dark" />

      <div className="relative mx-auto mt-16 max-w-5xl px-6 sm:mt-24">
        <div className="grid items-start gap-20 md:grid-cols-[1fr_auto_1fr] md:gap-8 lg:gap-14">
          <PersonCard role="The Bride" person={bride} relation="Daughter of" from="left" className="mx-auto w-[82%] max-w-sm justify-self-start md:w-full md:justify-self-end" />
          <LoveSeal />
          <PersonCard role="The Groom" person={groom} relation="Son of" from="right" className="mx-auto w-[82%] max-w-sm justify-self-end md:mt-28 md:w-full md:justify-self-start" />
        </div>
      </div>
    </section>
  );
}
