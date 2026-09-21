import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import weddingData from "../data/weddingData";
import { formatFullDate } from "../lib/format";
import { EASE, SPRING_POP } from "../lib/motion";
import { useActiveSection } from "../hooks/useActiveSection";
import { useScrollLock } from "../hooks/useScrollLock";
import { Mandala } from "./ui/Ornaments";

const { nav, bride, groom, wedding } = weddingData;
const IDS = nav.map((n) => n.id);

/** Smooth-scrolls to a section (works even right after the menu releases the scroll lock). */
const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });

export default function Navigation({ visible }) {
  const active = useActiveSection(IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useScrollLock(menuOpen);

  // desktop pill tucks away while reading downward, returns on scroll-up
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y > prev && y > 240) setHidden(true);
    else if (y < prev) setHidden(false);
  });

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const navigate = useCallback((e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    // wait a beat so the scroll lock is released before scrolling
    setTimeout(() => goTo(id), 60);
  }, []);

  if (!visible) return null;

  const primary = nav.filter((n) => n.primary);
  const monogram = `${groom.name[0]} & ${bride.name[0]}`;

  return (
    <>
      {/* ───── desktop: floating pill ───── */}
      <motion.nav
        aria-label="Primary"
        className="fixed top-5 left-1/2 z-50 hidden -translate-x-1/2 md:block"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: hidden ? 0 : 1, y: hidden ? -24 : 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: hidden ? 0 : 0.4 }}
        style={{ pointerEvents: hidden ? "none" : "auto" }}
      >
        <ul className="flex items-center gap-1 rounded-full bg-maroon-950/70 p-1.5 pr-2 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)] ring-1 ring-gold-500/35 backdrop-blur-md">
          <li>
            <a href="#home" onClick={(e) => navigate(e, "home")} aria-label="Back to top" className="font-script flex h-10 items-center px-4 text-xl whitespace-nowrap text-gold-300">
              {monogram}
            </a>
          </li>
          {primary.map((n) => {
            const on = active === n.id;
            return (
              <li key={n.id} className="relative">
                <a
                  href={`#${n.id}`}
                  onClick={(e) => navigate(e, n.id)}
                  aria-current={on ? "true" : undefined}
                  className={`relative flex h-10 items-center rounded-full px-4 text-[0.68rem] font-medium tracking-[0.22em] uppercase transition-colors duration-500 ${on ? "text-maroon-950" : "text-ivory-100/80 hover:text-gold-200"}`}
                >
                  {on && <motion.span layoutId="nav-active" className="bg-gold-gradient absolute inset-0 rounded-full" transition={{ duration: 0.6, ease: EASE }} />}
                  <span className="relative">{n.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>

      {/* ───── mobile: floating menu button + full-screen sheet ───── */}
      <motion.button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[max(1.25rem,env(safe-area-inset-left))] z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-maroon-900 text-gold-200 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)] ring-1 ring-gold-500/60 md:hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING_POP, delay: 0.4 }}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={menuOpen ? "x" : "m"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }}>
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="bg-maroon-lattice fixed inset-0 z-[55] flex flex-col justify-center overflow-hidden px-8 md:hidden"
            initial={{ clipPath: "circle(0px at 2.75rem calc(100% - 2.75rem))" }}
            animate={{ clipPath: "circle(160% at 2.75rem calc(100% - 2.75rem))" }}
            exit={{ clipPath: "circle(0px at 2.75rem calc(100% - 2.75rem))" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Mandala className="spin-slow pointer-events-none absolute top-1/2 left-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 text-gold-400/[0.09]" strokeWidth={0.25} />
            <p className="font-script mb-6 text-center text-4xl text-gold-300">{monogram}</p>
            <ul className="relative flex flex-col items-center gap-1">
              {nav.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.05 }}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => navigate(e, n.id)}
                    aria-current={active === n.id ? "true" : undefined}
                    className={`flex min-h-12 items-center gap-4 font-display text-[2rem] leading-none font-light sm:text-4xl ${active === n.id ? "text-gold-gradient" : "text-ivory-50"}`}
                  >
                    <span className="eyebrow w-6 text-right text-[0.6rem] text-gold-500/80">{String(i + 1).padStart(2, "0")}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="eyebrow relative mt-8 text-center text-[0.6rem] text-gold-400">{formatFullDate(wedding.startsAt)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
