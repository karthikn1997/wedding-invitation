import { motion } from "framer-motion";
import weddingData from "../../data/weddingData";
import { EASE, VIEWPORT } from "../../lib/motion";
import SectionHeading from "../ui/SectionHeading";
import RSVPForm from "../RSVPForm";
import { FloralFrame } from "../ui/FloralCorner";

const { rsvp } = weddingData;

export default function RSVP() {
  return (
    <section id="rsvp" className="bg-paper relative overflow-hidden py-24 sm:py-32" aria-label="RSVP">
      <SectionHeading
        eyebrow="RSVP"
        title={rsvp.heading}
        titleClassName="uppercase tracking-[0.06em] text-[2rem]! sm:text-5xl! md:text-[3.4rem]!"
        subtitle={rsvp.subheading}
      />
      <motion.div
        className="relative mx-auto mt-14 max-w-2xl px-4 sm:mt-20 sm:px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ ...VIEWPORT, amount: 0.1 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <div className="relative rounded-[3px] bg-ivory-50 text-gold-600 shadow-[0_40px_80px_-40px_rgba(58,13,21,0.55)] ring-1 ring-gold-500/45">
          <span className="pointer-events-none absolute inset-2 rounded-[2px] border border-gold-500/25" />
          <FloralFrame size="w-14 sm:w-20" />
          <div className="relative text-cocoa-900">
            <RSVPForm />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
