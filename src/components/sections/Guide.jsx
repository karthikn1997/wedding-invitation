import { Phone } from "lucide-react";
import weddingData from "../../data/weddingData";
import SectionHeading from "../ui/SectionHeading";
import Accordion from "../Accordion";
import EventIcon from "../ui/EventIcon";
import GoldParticles from "../ui/GoldParticles";

const { guide } = weddingData;

/** Renders one guide entry's body text, bullet list and/or contact cards from data. */
function GuideContent({ entry }) {
  return (
    <div className="space-y-4 text-[0.95rem] leading-relaxed font-light text-ivory-100/80">
      {entry.body && <p>{entry.body}</p>}
      {entry.items && (
        <ul className="space-y-2.5">
          {entry.items.map((line) => (
            <li key={line} className="flex gap-3">
              <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500" aria-hidden="true" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
      {entry.contacts && (
        <ul className="space-y-3 pt-1">
          {entry.contacts.map((c) => (
            <li key={c.phone}>
              <a
                href={`tel:${c.phone.replace(/\s+/g, "")}`}
                className="flex min-h-14 items-center gap-4 rounded-lg border border-gold-500/30 px-4 py-3 transition-colors hover:border-gold-400 hover:bg-gold-500/10"
              >
                <Phone size={18} strokeWidth={1.5} className="shrink-0 text-gold-400" aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="eyebrow text-[0.6rem] text-gold-400">{c.label}</span>
                  <span className="font-display text-xl text-ivory-50">{c.name}</span>
                  <span className="text-sm tracking-wide text-ivory-100/80">{c.phone}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Guide() {
  const items = guide.map((entry) => ({
    id: entry.id,
    title: entry.title,
    icon: <EventIcon name={entry.icon} size={20} />,
    content: <GuideContent entry={entry} />,
  }));

  return (
    <section id="guide" className="bg-maroon-lattice relative overflow-hidden py-24 sm:py-32" aria-label="Guest guide">
      <GoldParticles count={8} sparkles={3} seed={71} />
      <SectionHeading eyebrow="Guest Guide" title="Everything you need to know" tone="dark" subtitle="A little help so you can arrive relaxed and simply enjoy the celebrations." />
      <div className="relative mx-auto mt-14 max-w-2xl px-5 sm:mt-20">
        <Accordion items={items} defaultOpen={guide[0]?.id} />
      </div>
    </section>
  );
}
