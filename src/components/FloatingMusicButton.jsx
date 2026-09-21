import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { SPRING_POP } from "../lib/motion";

/**
 * Bottom-right music control. The gold disc turns slowly while music plays;
 * the glyph stays upright. Never starts audio by itself — only on tap.
 */
export default function FloatingMusicButton({ playing, unavailable, onToggle, visible, label = "wedding music" }) {
  if (unavailable) return null;
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onToggle}
          aria-pressed={playing}
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
          className="fixed right-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[60] flex h-14 w-14 items-center justify-center rounded-full text-maroon-950 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)] sm:h-16 sm:w-16"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ ...SPRING_POP, delay: 0.4 }}
          whileTap={{ scale: 0.92 }}
        >
          {playing && <span className="absolute inset-0 animate-ping rounded-full bg-gold-400/30 [animation-duration:2.6s]" aria-hidden="true" />}
          <span
            className="spin-slow absolute inset-0 rounded-full bg-gold-gradient ring-1 ring-gold-200/60"
            style={{ "--spin-dur": "7s", animationPlayState: playing ? "running" : "paused" }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 64 64" className="h-full w-full" fill="none" stroke="#5a1526" strokeOpacity=".55">
              <circle cx="32" cy="32" r="29" strokeWidth=".8" strokeDasharray="1.5 3" />
              <circle cx="32" cy="32" r="22" strokeWidth=".7" />
              {Array.from({ length: 8 }, (_, i) => (
                <ellipse key={i} cx="32" cy="12.5" rx="2.4" ry="5" transform={`rotate(${i * 45} 32 32)`} strokeWidth=".7" />
              ))}
            </svg>
          </span>
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-maroon-900 text-gold-200 sm:h-10 sm:w-10">
            {playing ? <Pause size={16} strokeWidth={2} fill="currentColor" /> : <Play size={16} strokeWidth={2} fill="currentColor" className="translate-x-px" />}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
