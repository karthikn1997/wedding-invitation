import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, CalendarDays, Download } from "lucide-react";
import { downloadICS, googleCalendarUrl } from "../lib/calendar";
import { EASE } from "../lib/motion";

/** "Add to Calendar" with a tiny popover: Google Calendar, or an .ics file (Apple / Outlook / Android). */
export default function AddToCalendar({ event, className = "", tone = "light" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => !wrapRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "flex min-h-12 w-full items-center gap-3 px-4 text-left text-[0.72rem] font-medium tracking-[0.14em] uppercase text-ivory-100 transition-colors hover:bg-gold-500/15";

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        className={`btn-ghost w-full ${tone === "dark" ? "btn-ghost-light" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <CalendarPlus size={16} strokeWidth={1.5} aria-hidden="true" />
        Add to Calendar
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            className="absolute right-0 bottom-full left-0 z-30 mb-2 origin-bottom overflow-hidden rounded-xl border border-gold-500/40 bg-maroon-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <a role="menuitem" href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={itemClass} onClick={() => setOpen(false)}>
              <CalendarDays size={16} strokeWidth={1.5} className="text-gold-400" aria-hidden="true" />
              Google Calendar
            </a>
            <button
              role="menuitem"
              type="button"
              className={`${itemClass} border-t border-gold-500/20`}
              onClick={() => {
                downloadICS(event);
                setOpen(false);
              }}
            >
              <Download size={16} strokeWidth={1.5} className="text-gold-400" aria-hidden="true" />
              Apple / Outlook (.ics)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
