import { motion } from "framer-motion";
import { CalendarDays, Clock, ExternalLink, MapPin } from "lucide-react";
import weddingData from "../../data/weddingData";
import { formatFullDate, formatTimeRange } from "../../lib/format";
import { resolveMapsUrl } from "../../lib/maps";
import { fadeUp, inView } from "../../lib/motion";
import SectionHeading from "../ui/SectionHeading";
import AnimatedImage from "../ui/AnimatedImage";
import RevealText from "../ui/RevealText";
import MapPreview from "../MapPreview";
import FloralCorner from "../ui/FloralCorner";

const { wedding, events } = weddingData;
const ceremony = events.find((e) => e.featured) || events[0];

export default function Venue() {
  const mapsHref = resolveMapsUrl(wedding, "view");
  return (
    <section id="venue" className="bg-paper relative overflow-hidden py-24 sm:py-32" aria-label="Wedding venue">
      <FloralCorner position="tl" className="text-gold-600/50" />
      <SectionHeading eyebrow="The Venue" title="Where we'll gather" />

      <div className="mx-auto mt-16 grid max-w-6xl items-center gap-12 px-6 sm:mt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* photograph: an arched mandapam window */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="pointer-events-none absolute -inset-3 rounded-t-[999px] rounded-b-md border border-gold-500/45" />
          <AnimatedImage
            src={wedding.image}
            alt={wedding.imageAlt}
            width={1000}
            height={1250}
            reveal="up"
            parallax={20}
            className="aspect-[4/5] rounded-t-[999px] rounded-b-md shadow-[0_40px_70px_-35px_rgba(58,13,21,0.6)]"
          />
        </div>

        <div className="text-center lg:text-left">
          <RevealText as="h3" text={wedding.venue} className="font-display text-4xl leading-tight font-light text-maroon-900 sm:text-5xl" />

          <motion.ul {...inView(fadeUp(0.2, 20))} className="mt-8 space-y-5 text-cocoa-900">
            <li className="flex flex-col items-center gap-2 lg:flex-row lg:items-start lg:gap-4">
              <MapPin size={20} strokeWidth={1.25} className="shrink-0 text-gold-700 lg:mt-1" aria-hidden="true" />
              <address className="text-[0.98rem] leading-relaxed font-light not-italic">{wedding.address}</address>
            </li>
            <li className="flex flex-col items-center gap-2 lg:flex-row lg:items-start lg:gap-4">
              <CalendarDays size={20} strokeWidth={1.25} className="shrink-0 text-gold-700 lg:mt-1" aria-hidden="true" />
              <span className="text-[0.98rem] font-light">{formatFullDate(wedding.startsAt)}</span>
            </li>
            <li className="flex flex-col items-center gap-2 lg:flex-row lg:items-start lg:gap-4">
              <Clock size={20} strokeWidth={1.25} className="shrink-0 text-gold-700 lg:mt-1" aria-hidden="true" />
              <span className="text-[0.98rem] font-light">{formatTimeRange(ceremony.start, ceremony.end)}</span>
            </li>
          </motion.ul>

          <motion.div {...inView(fadeUp(0.35, 24))} className="mt-10">
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="group block" aria-label={`View ${wedding.venue} on Google Maps (opens in a new tab)`}>
              <MapPreview label={wedding.venue} landmarks={wedding.landmarks} />
            </a>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6 w-full sm:w-auto">
              View on Google Maps
              <ExternalLink size={15} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
