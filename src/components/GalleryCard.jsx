import { Expand } from "lucide-react";
import AnimatedImage from "./ui/AnimatedImage";

const WIPES = ["up", "left", "down", "right"];

/** A single masonry tile. Ratio is reserved from data so lazy images never shift the layout. */
export default function GalleryCard({ item, index, onOpen }) {
  return (
    <li className="mb-3 break-inside-avoid sm:mb-4">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`Open photo ${index + 1}: ${item.alt}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[2px] text-left ring-1 ring-gold-500/25 transition-shadow duration-700 hover:shadow-[0_0_50px_-12px_rgba(214,181,107,0.55)]"
      >
        <AnimatedImage
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          reveal={WIPES[index % WIPES.length]}
          delay={(index % 3) * 0.12}
          hoverZoom
          className="w-full"
          style={{ aspectRatio: `${item.width} / ${item.height}` }}
        />
        <span className="pointer-events-none absolute inset-2 border border-gold-300/0 transition-colors duration-700 group-hover:border-gold-300/60" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-700 group-hover:opacity-100 max-md:opacity-100 max-md:from-black/45">
          <span className="font-display text-sm text-ivory-50 italic">{String(index + 1).padStart(2, "0")}</span>
          <Expand size={16} strokeWidth={1.5} className="text-gold-300" aria-hidden="true" />
        </span>
      </button>
    </li>
  );
}
