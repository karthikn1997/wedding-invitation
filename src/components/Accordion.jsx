import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { EASE, VIEWPORT } from "../lib/motion";

/**
 * Single-open accordion. Each item: { id, title, icon (node), content (node) }.
 * Panel height animates smoothly; state is exposed with aria-expanded / aria-controls.
 */
export default function Accordion({ items, defaultOpen = null }) {
  const [openId, setOpenId] = useState(defaultOpen);
  const base = useId();

  return (
    <div className="divide-y divide-gold-500/30 border-y border-gold-500/30">
      {items.map((item, i) => {
        const open = openId === item.id;
        const panelId = `${base}-${item.id}-panel`;
        const buttonId = `${base}-${item.id}-btn`;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 1, ease: EASE, delay: i * 0.06 }}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="group flex min-h-[4.5rem] w-full items-center gap-4 py-3 text-left"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${
                    open ? "border-gold-400 bg-gold-500/20 text-gold-300" : "border-gold-500/40 text-gold-400 group-hover:border-gold-400"
                  }`}
                >
                  {item.icon}
                </span>
                <span className={`flex-1 font-display text-[1.6rem] leading-tight font-light transition-colors duration-500 sm:text-3xl ${open ? "text-gold-200" : "text-ivory-50"}`}>
                  {item.title}
                </span>
                <motion.span animate={{ rotate: open ? 135 : 0 }} transition={{ duration: 0.6, ease: EASE }} className="flex h-9 w-9 shrink-0 items-center justify-center text-gold-400">
                  <Plus size={22} strokeWidth={1.25} aria-hidden="true" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { duration: 0.7, ease: EASE }, opacity: { duration: 0.5, ease: EASE, delay: open ? 0.1 : 0 } }}
                  className="overflow-hidden"
                >
                  <div className="pr-2 pb-7 pl-[3.75rem] sm:pl-[3.75rem]">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
