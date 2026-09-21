import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { searchUrl } from "../lib/maps";
import { EASE, VIEWPORT } from "../lib/motion";
import AnimatedImage from "./ui/AnimatedImage";

/** Editorial destination card for the horizontal "Places to explore" rail. */
export default function PlaceCard({ place, index }) {
  return (
    <motion.article
      className="group w-[76vw] max-w-[21rem] shrink-0 snap-start sm:w-80"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ ...VIEWPORT, amount: 0.2 }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      <div className="relative">
        <AnimatedImage
          src={place.image}
          alt={place.alt}
          width={640}
          height={800}
          reveal="up"
          parallax={12}
          hoverZoom
          className="aspect-[4/5] rounded-t-[999px] rounded-b-sm shadow-[0_30px_50px_-28px_rgba(58,13,21,0.6)]"
        />
        <span className="text-outline-gold pointer-events-none absolute -bottom-6 -left-1 font-display text-7xl leading-none font-light select-none" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="eyebrow absolute top-5 right-4 rounded-full bg-maroon-950/75 px-3 py-1.5 text-[0.58rem] text-gold-200 backdrop-blur">{place.category}</span>
      </div>

      <div className="pt-9 pl-1">
        <h3 className="font-display text-[1.75rem] leading-tight font-normal text-maroon-900">{place.title}</h3>
        <p className="mt-2 text-[0.9rem] leading-relaxed font-light text-cocoa-700">{place.description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-gold-500/30 pt-4">
          <span className="flex items-center gap-1.5 text-[0.78rem] font-medium tracking-wide text-gold-700">
            <MapPin size={14} strokeWidth={1.5} aria-hidden="true" />
            {place.distance} away
          </span>
          <a
            href={searchUrl(place.query)}
            target="_blank"
            rel="noopener noreferrer"
            className="-mr-2 inline-flex min-h-11 items-center gap-1.5 px-2 text-[0.7rem] font-medium tracking-[0.2em] text-maroon-800 uppercase transition-colors hover:text-gold-700"
            aria-label={`Explore ${place.title} on Google Maps`}
          >
            Explore
            <ArrowUpRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
