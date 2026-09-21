import { motion } from "framer-motion";
import weddingData from "../../data/weddingData";
import { EASE, VIEWPORT, fadeUp, inView } from "../../lib/motion";
import SectionHeading from "../ui/SectionHeading";
import AnimatedImage from "../ui/AnimatedImage";
import RevealText from "../ui/RevealText";
import GoldParticles from "../ui/GoldParticles";
import { Lotus } from "../ui/Ornaments";

const { bride, groom } = weddingData;

/** Arch-framed portrait card — used for both bride and groom (no duplication). */
function PersonCard({ role, person, relation, className = "" }) {
  return (
    <article className={`group relative ${className}`}>
      <div className="relative">
        {/* offset gold arch outline that draws in behind the photo */}
        <motion.div
          className="pointer-events-none absolute -inset-2.5 rounded-t-[999px] rounded-b-md border border-gold-500/55 transition-colors duration-700 group-hover:border-gold-300"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.8, ease: EASE, delay: 0.3 }}
        />
        <div className="relative rounded-t-[999px] rounded-b-md transition-shadow duration-700 group-hover:shadow-[0_0_70px_-12px_rgba(214,181,107,0.6)]">
          <AnimatedImage
            src={person.image}
            alt={person.alt}
            width={800}
            height={1000}
            reveal="up"
            parallax={16}
            hoverZoom
            className="aspect-[4/5] rounded-t-[999px] rounded-b-md"
          />
        </div>
        {/* role medallion */}
        <motion.span
          className="eyebrow absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-maroon-900 px-5 py-2 text-[0.62rem] text-gold-300 shadow-[0_0_0_1px_rgba(195,156,71,0.55)]"
          {...inView(fadeUp(0.6, 10))}
        >
          {role}
        </motion.span>
      </div>

      <div className="mt-10 text-center">
        <RevealText as="h3" text={person.name} className="font-display text-4xl font-light text-ivory-50 sm:text-5xl" />
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

export default function Couple() {
  return (
    <section id="couple" className="bg-maroon-lattice relative overflow-hidden py-24 sm:py-32" aria-label="The bride and groom">
      <GoldParticles count={10} sparkles={4} seed={31} />
      <SectionHeading eyebrow="The Couple" title="Two families, one celebration" tone="dark" />

      <div className="relative mx-auto mt-16 max-w-5xl px-6 sm:mt-24">
        <div className="grid items-start gap-20 md:grid-cols-[1fr_auto_1fr] md:gap-8 lg:gap-14">
          <PersonCard role="The Bride" person={bride} relation="Daughter of" className="mx-auto w-[82%] max-w-sm justify-self-start md:w-full md:justify-self-end" />

          <motion.div
            aria-hidden="true"
            className="flex items-center justify-center gap-4 self-center text-gold-400 md:flex-col md:pt-24"
            {...inView({ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { duration: 1.6, ease: EASE } } })}
          >
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500 md:h-20 md:w-px md:bg-gradient-to-b" />
            <span className="font-script text-6xl leading-none text-gold-gradient sm:text-7xl">&amp;</span>
            <Lotus className="hidden h-8 w-8 md:block" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500 md:h-20 md:w-px md:bg-gradient-to-t" />
          </motion.div>

          <PersonCard role="The Groom" person={groom} relation="Son of" className="mx-auto w-[82%] max-w-sm justify-self-end md:mt-28 md:w-full md:justify-self-start" />
        </div>
      </div>
    </section>
  );
}
