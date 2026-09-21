import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import weddingData from "../../data/weddingData";
import SectionHeading from "../ui/SectionHeading";
import GalleryCard from "../GalleryCard";
import Lightbox from "../Lightbox";
import GoldParticles from "../ui/GoldParticles";

const { gallery } = weddingData;

export default function Gallery() {
  const [open, setOpen] = useState(null);

  return (
    <section id="gallery" className="bg-cocoa-lattice relative overflow-hidden py-24 sm:py-32" aria-label="Photo gallery">
      <GoldParticles count={8} sparkles={4} seed={61} />
      <SectionHeading eyebrow="Gallery" title="Moments we treasure" tone="dark" subtitle="Tap any photograph to see it full screen — swipe or use the arrow keys to browse." />

      <ul className="mx-auto mt-16 max-w-6xl columns-2 gap-3 px-4 sm:mt-24 sm:gap-4 md:columns-3 md:px-6 lg:gap-5">
        {gallery.map((item, i) => (
          <GalleryCard key={item.src} item={item} index={i} onOpen={setOpen} />
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && <Lightbox items={gallery} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
