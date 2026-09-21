import { motion } from "framer-motion";
import { Clock, MapPin, Navigation } from "lucide-react";
import { EASE, VIEWPORT } from "../lib/motion";
import { formatDate, formatTimeRange, formatWeekday } from "../lib/format";
import { resolveMapsUrl } from "../lib/maps";
import EventIcon from "./ui/EventIcon";
import AddToCalendar from "./AddToCalendar";

/** One celebration as an ivory invitation card. Animated by the parent's stagger (variants). */
export default function WeddingEventCard({ event, index = 0 }) {
  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ ...VIEWPORT, amount: 0.12 }}
      variants={{
        hidden: { opacity: 0, y: 56, clipPath: "inset(12% 0% 0% 0%)" },
        // staggered across the row on wide screens, sequential-by-scroll on phones
        show: { opacity: 1, y: 0, clipPath: "inset(-10% -10% -10% -10%)", transition: { duration: 1.4, ease: EASE, delay: (index % 2) * 0.25 } },
      }}
      className="group relative flex flex-col rounded-[3px] bg-ivory-50 p-8 text-center shadow-[0_30px_60px_-30px_rgba(58,13,21,0.45)] ring-1 ring-gold-500/35 transition-[transform,box-shadow] duration-700 ease-[var(--ease-cinema)] hover:-translate-y-1.5 hover:shadow-[0_40px_70px_-28px_rgba(163,127,47,0.55)] sm:p-10"
    >
      <span className="pointer-events-none absolute inset-2 rounded-[2px] border border-gold-500/25 transition-colors duration-700 group-hover:border-gold-500/55" />

      <div className="relative mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-maroon-900 text-gold-300 shadow-[0_0_0_4px_var(--color-ivory-50),0_0_0_5px_rgba(195,156,71,0.6)] transition-transform duration-700 group-hover:scale-105">
        <EventIcon name={event.icon} size={28} />
      </div>

      <h3 className="mt-6 font-display text-[1.9rem] leading-tight font-normal tracking-wide text-maroon-900 uppercase sm:text-[2.1rem]">{event.title}</h3>

      <p className="eyebrow mt-4 text-[0.66rem] text-gold-700">{formatWeekday(event.start)}</p>
      <p className="mt-1 font-display text-2xl text-maroon-800 italic">{formatDate(event.start)}</p>

      <span className="mx-auto my-5 block h-px w-14 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <ul className="space-y-2.5 text-[0.92rem] text-cocoa-900">
        <li className="flex items-center justify-center gap-2.5">
          <Clock size={15} strokeWidth={1.5} className="shrink-0 text-gold-700" aria-hidden="true" />
          <span>{formatTimeRange(event.start, event.end)}</span>
        </li>
        <li className="flex items-start justify-center gap-2.5">
          <MapPin size={15} strokeWidth={1.5} className="mt-1 shrink-0 text-gold-700" aria-hidden="true" />
          <span className="text-left">
            <span className="font-medium">{event.venue}</span>
            <span className="block text-[0.82rem] font-light text-cocoa-700">{event.address}</span>
          </span>
        </li>
      </ul>

      <p className="mx-auto mt-5 max-w-xs text-[0.9rem] leading-relaxed font-light text-cocoa-700">{event.description}</p>

      <div className="relative mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
        <AddToCalendar event={event} className="flex-1" />
        <a
          href={resolveMapsUrl(event, "directions")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost flex-1 bg-maroon-900 !text-gold-200 hover:!bg-maroon-800"
          aria-label={`Get directions to ${event.venue}`}
        >
          <Navigation size={16} strokeWidth={1.5} aria-hidden="true" />
          Directions
        </a>
      </div>
    </motion.article>
  );
}
