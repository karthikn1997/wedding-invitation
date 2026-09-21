import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import weddingData from "../../data/weddingData";
import SectionHeading from "../ui/SectionHeading";
import PlaceCard from "../PlaceCard";
import FloralCorner from "../ui/FloralCorner";

const { places, wedding } = weddingData;
const credits = places.filter((p) => p.credit);

export default function Places() {
  const railRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: railRef });

  const nudge = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * (rail.clientWidth * 0.7), behavior: "smooth" });
  };

  const arrow =
    "flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/55 text-gold-700 transition-colors hover:bg-gold-500/15";

  return (
    <section id="explore" className="bg-paper relative overflow-hidden py-24 sm:py-32" aria-label="Places to explore">
      <FloralCorner position="tr" className="text-gold-600/50" />
      <SectionHeading eyebrow="For our guests" title="Places to explore" subtitle={`Visiting ${wedding.city}? A few of our favourite corners of the city, all within easy reach of the celebrations.`} />

      <div className="relative mt-16 sm:mt-24">
        <div
          ref={railRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-8 [scroll-padding-inline:1.5rem] sm:gap-8 md:px-[max(1.5rem,calc((100vw-72rem)/2))] md:[scroll-padding-inline:max(1.5rem,calc((100vw-72rem)/2))]"
          role="region"
          aria-label="Places to explore — scroll horizontally"
          tabIndex={0}
        >
          {places.map((p, i) => (
            <PlaceCard key={p.id} place={p} index={i} />
          ))}
          <span className="w-2 shrink-0 md:w-16" aria-hidden="true" />
        </div>

        <div className="mx-auto mt-4 flex max-w-6xl items-center gap-6 px-6">
          <div className="h-px flex-1 bg-gold-500/25" aria-hidden="true">
            <motion.div className="h-full origin-left bg-gold-500" style={{ scaleX: scrollXProgress }} />
          </div>
          <div className="hidden gap-3 md:flex">
            <button type="button" className={arrow} onClick={() => nudge(-1)} aria-label="Previous places">
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button type="button" className={arrow} onClick={() => nudge(1)} aria-label="Next places">
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {credits.length > 0 && (
        <p className="mx-auto mt-10 max-w-3xl px-6 text-center text-[0.68rem] leading-relaxed font-light text-cocoa-700/70">
          Photos via Wikimedia Commons:{" "}
          {credits.map((p, i) => (
            <span key={p.id}>
              {i > 0 && " · "}
              <a href={p.credit.source} target="_blank" rel="noopener noreferrer" className="underline decoration-gold-500/40 underline-offset-2 hover:text-gold-700">
                {p.category}
              </a>{" "}
              by {p.credit.author}
              {p.credit.licenseUrl ? (
                <>
                  {" "}
                  (<a href={p.credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-gold-500/40 underline-offset-2 hover:text-gold-700">{p.credit.license}</a>)
                </>
              ) : (
                ` (${p.credit.license})`
              )}
            </span>
          ))}
          .
        </p>
      )}
    </section>
  );
}
