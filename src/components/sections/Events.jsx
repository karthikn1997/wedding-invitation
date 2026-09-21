import weddingData from "../../data/weddingData";
import SectionHeading from "../ui/SectionHeading";
import WeddingEventCard from "../WeddingEventCard";
import FloralCorner from "../ui/FloralCorner";

const { events } = weddingData;

export default function Events() {
  return (
    <section id="events" className="bg-paper-deep relative overflow-hidden py-24 sm:py-32" aria-label="Wedding events">
      <FloralCorner position="tl" className="text-gold-600/50" />
      <FloralCorner position="tr" className="text-gold-600/50" />
      <SectionHeading eyebrow="The Celebrations" title="Join us for every moment" subtitle="Four days of ritual, colour and joy. Each event is best enjoyed with you in it." />

      <div className="mx-auto mt-16 grid max-w-6xl gap-8 px-6 sm:mt-24 md:grid-cols-2 lg:gap-10">
        {events.map((event, i) => (
          <WeddingEventCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </section>
  );
}
