import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { EASE } from "../lib/motion";
import { useScrollLock } from "../hooks/useScrollLock";

const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 450;

const slide = {
  enter: (dir) => ({ x: dir * 80, opacity: 0, scale: 1.04 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
  exit: (dir) => ({ x: dir * -80, opacity: 0, scale: 0.98, transition: { duration: 0.4, ease: EASE } }),
};

/**
 * Fullscreen viewer: prev/next buttons, ←/→/Esc keys, swipe on touch, focus kept inside.
 * Mounted only while open (parent passes `index !== null`).
 */
export default function Lightbox({ items, index, onClose, onChange }) {
  const [dir, setDir] = useState(1);
  const closeRef = useRef(null);
  const rootRef = useRef(null);
  const total = items.length;
  const item = items[index];

  useScrollLock(true);

  const go = useCallback(
    (step) => {
      setDir(step);
      onChange((index + step + total) % total);
    },
    [index, total, onChange],
  );

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        // keep focus inside the dialog
        const f = rootRef.current?.querySelectorAll("button");
        if (!f?.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // warm the neighbours so next/prev feel instant
  useEffect(() => {
    [1, -1].forEach((s) => {
      const img = new Image();
      img.src = items[(index + s + total) % total].src;
    });
  }, [index, items, total]);

  const btn =
    "flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/50 bg-maroon-950/60 text-gold-200 backdrop-blur transition-colors hover:bg-gold-500/20";

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery viewer"
      className="fixed inset-0 z-[90] flex flex-col bg-cocoa-950/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
        <p className="eyebrow text-gold-300" aria-live="polite">
          {index + 1} / {total}
        </p>
        <button ref={closeRef} type="button" className={btn} onClick={onClose} aria-label="Close gallery">
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 sm:px-20">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={item.src}
            src={item.src}
            alt={item.alt}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) go(1);
              else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) go(-1);
            }}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full cursor-grab touch-pan-y rounded-[2px] object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-gold-500/30 select-none active:cursor-grabbing"
          />
        </AnimatePresence>

        <button type="button" className={`${btn} absolute top-1/2 left-3 hidden -translate-y-1/2 sm:flex`} onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo">
          <ChevronLeft size={22} strokeWidth={1.5} />
        </button>
        <button type="button" className={`${btn} absolute top-1/2 right-3 hidden -translate-y-1/2 sm:flex`} onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo">
          <ChevronRight size={22} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:justify-center" onClick={(e) => e.stopPropagation()}>
        <button type="button" className={`${btn} sm:hidden`} onClick={() => go(-1)} aria-label="Previous photo">
          <ChevronLeft size={22} strokeWidth={1.5} />
        </button>
        <p className="min-w-0 flex-1 text-center font-display text-base text-ivory-100/85 italic sm:flex-none sm:text-lg">{item.alt}</p>
        <button type="button" className={`${btn} sm:hidden`} onClick={() => go(1)} aria-label="Next photo">
          <ChevronRight size={22} strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  );
}
