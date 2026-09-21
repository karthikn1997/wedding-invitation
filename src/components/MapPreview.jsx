import { motion } from "framer-motion";
import { EASE, SPRING_POP } from "../lib/motion";

/**
 * A stylised, illustrated "map": streets draw themselves, the temple tank glows,
 * and a pin drops onto the venue with a soft pulse. Purely decorative SVG — the
 * real map is one tap away via the button beside it.
 */
export default function MapPreview({ label, landmarks = [] }) {
  const draw = (delay, width = 1) => ({
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 2.2, ease: EASE, delay },
    strokeWidth: width,
  });

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-maroon-900 ring-1 ring-gold-500/40" role="img" aria-label={`Illustrated map showing ${label}`}>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" fill="none" stroke="#c39c47" strokeLinecap="round" aria-hidden="true">
        <defs>
          <radialGradient id="mp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f6e8bf" stopOpacity=".55" />
            <stop offset="100%" stopColor="#f6e8bf" stopOpacity="0" />
          </radialGradient>
          <pattern id="mp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" stroke="#c39c47" strokeOpacity=".07" strokeWidth=".6" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#mp-grid)" stroke="none" />

        {/* temple tank & park */}
        <motion.rect x="238" y="188" width="86" height="52" rx="10" fill="#c39c47" fillOpacity=".12" strokeOpacity=".5" strokeWidth=".8"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 1.2 }} />
        <rect x="248" y="198" width="66" height="32" rx="6" strokeOpacity=".35" strokeWidth=".6" strokeDasharray="2 3" />
        <motion.circle cx="70" cy="70" r="28" fill="#6c7a45" fillOpacity=".18" strokeOpacity=".3" strokeWidth=".6"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 1.4 }} />

        {/* main roads */}
        <motion.path d="M-10 214C70 204 120 180 190 150S330 96 410 84" stroke="#e6cf98" strokeOpacity=".8" {...draw(0.1, 3)} />
        <motion.path d="M150 -10C160 60 176 110 190 150S222 240 216 310" stroke="#e6cf98" strokeOpacity=".65" {...draw(0.4, 2.4)} />
        {/* side streets */}
        <motion.path d="M-10 120C60 122 110 110 160 96S260 60 300 -10" strokeOpacity=".45" {...draw(0.8, 1.4)} />
        <motion.path d="M30 310C60 260 100 230 130 200" strokeOpacity=".4" {...draw(1, 1.2)} />
        <motion.path d="M250 310C262 264 300 236 410 220" strokeOpacity=".4" {...draw(1.1, 1.2)} />
        <motion.path d="M300 20C310 60 340 80 410 60" strokeOpacity=".35" {...draw(1.3, 1)} />
        <motion.path d="M100 150C130 150 160 152 190 150" strokeOpacity=".4" {...draw(1.2, 1)} />

        {/* venue */}
        <circle cx="190" cy="150" r="46" fill="url(#mp-glow)" stroke="none" />
        <motion.circle cx="190" cy="150" r="12" stroke="#f0dca8" strokeWidth="1"
          initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: [0.5, 2.6], opacity: [0.7, 0] }}
          transition={{ duration: 2.6, ease: "easeOut", repeat: Infinity, repeatDelay: 0.4 }}
          style={{ transformOrigin: "190px 150px", transformBox: "view-box" }} />

        {/* compass */}
        <g transform="translate(352 46)" strokeOpacity=".7" strokeWidth=".8">
          <circle r="16" />
          <path d="M0 -13L4 0L0 13L-4 0Z" fill="#c39c47" fillOpacity=".5" />
          <text y="-20" textAnchor="middle" fontSize="8" fill="#e6cf98" stroke="none" fontFamily="DM Sans, sans-serif" letterSpacing="1">N</text>
        </g>
      </svg>

      {/* pin dropping onto the venue (centred on 190/400, 150/300 → 47.5% / 50%) */}
      {/* the observed wrapper never moves (a node translated outside the clipped map would never intersect) */}
      <motion.div
        className="absolute left-[47.5%] top-[50%] -translate-x-1/2 -translate-y-full"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.svg
          width="44"
          height="56"
          viewBox="0 0 44 56"
          aria-hidden="true"
          variants={{ hidden: { y: -120, opacity: 0 }, show: { y: 0, opacity: 1, transition: { ...SPRING_POP, delay: 1.5 } } }}
        >
          <defs>
            <linearGradient id="pin-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6e8bf" />
              <stop offset="1" stopColor="#b58d3c" />
            </linearGradient>
          </defs>
          <path d="M22 54C22 54 3 33 3 20a19 19 0 0 1 38 0c0 13-19 34-19 34z" fill="url(#pin-g)" />
          <circle cx="22" cy="20" r="7.5" fill="#3a0d15" />
          <circle cx="22" cy="20" r="2.6" fill="#f0dca8" />
        </motion.svg>
      </motion.div>

      {/* labels */}
      <motion.p
        className="eyebrow absolute top-[56%] left-[47.5%] mt-2 w-max max-w-[88%] -translate-x-1/2 rounded-md bg-maroon-950/85 px-3 py-1.5 text-center text-[0.52rem] leading-snug tracking-[0.18em] text-gold-200 ring-1 ring-gold-500/40 sm:text-[0.6rem]"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE, delay: 2.1 }}
      >
        {label}
      </motion.p>
      {landmarks.slice(0, 2).map((l, i) => (
        <motion.span
          key={l}
          className="absolute rounded-sm bg-maroon-950/70 px-2 py-1 text-[0.5rem] tracking-[0.12em] text-ivory-100/80 uppercase sm:text-[0.58rem]"
          style={i === 0 ? { left: "6%", bottom: "8%" } : { right: "5%", top: "10%" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 2.4 + i * 0.2 }}
        >
          {l}
        </motion.span>
      ))}
    </div>
  );
}
