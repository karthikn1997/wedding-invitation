import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { EASE } from "../../lib/motion";
import { seeded, range } from "../../lib/random";

export const HEART_PATH = "M16 28C16 28 2 19 2 9.5 2 4.5 6 1 10 1c2.6 0 4.8 1.4 6 3.6C17.2 2.4 19.4 1 22 1c4 0 8 3.5 8 8.5C30 19 16 28 16 28z";

export function HeartShape({ className = "", color = "#d96b86" }) {
  return (
    <svg viewBox="0 0 32 29" className={className} aria-hidden="true">
      <path d={HEART_PATH} fill={color} />
      <path d="M8 6c1.4-1.8 3.6-2.2 5-1.2" stroke="rgb(255 255 255 / .55)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Hearts drifting up the whole section. CSS keyframes only; ~60% render on phones. */
export const FloatingHearts = memo(function FloatingHearts({ count = 16, seed = 5 }) {
  const hearts = useMemo(() => {
    const rand = seeded(seed);
    const colors = ["#d96b86", "#c9506c", "#f2a3b4", "#82233a", "#e6cf98", "#ffffff"];
    return Array.from({ length: count }, (_, i) => {
      const dur = range(rand, 11, 20);
      return {
        id: i,
        left: range(rand, 2, 96),
        size: range(rand, 14, 40),
        dur,
        delay: -range(rand, 0, dur),
        x: range(rand, -60, 60),
        o: range(rand, 0.35, 0.8),
        color: colors[Math.floor(rand() * colors.length)],
        hideOnMobile: i >= Math.ceil(count * 0.6),
      };
    });
  }, [count, seed]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className={`heart-float ${h.hideOnMobile ? "max-md:hidden" : ""}`}
          style={{ left: `${h.left}%`, width: h.size, "--h-dur": `${h.dur}s`, "--h-delay": `${h.delay}s`, "--h-x": `${h.x}px`, "--h-o": h.o }}
        >
          <HeartShape color={h.color} className="block h-auto w-full" />
        </span>
      ))}
    </div>
  );
});

/* ── paper streamers hanging from the top corners ─────────────────────────── */
const RIBBONS = [
  { x: 16, len: 330, amp: 9, wl: 78, c: "#82233a", hi: "#c9506c" },
  { x: 42, len: 230, amp: 8, wl: 60, c: "#d6b56b", hi: "#f6e8bf" },
  { x: 68, len: 300, amp: 10, wl: 88, c: "#d96b86", hi: "#f7c2cc" },
  { x: 96, len: 190, amp: 7, wl: 54, c: "#6c7a45", hi: "#a9bd7c" },
  { x: 122, len: 260, amp: 9, wl: 70, c: "#e8a72e", hi: "#f8d987" },
];
const wave = (r, phase) => {
  const pts = [];
  for (let y = 0; y <= r.len; y += 6) pts.push(`${(r.x + Math.sin(y / r.wl * Math.PI * 2 + phase) * r.amp * Math.min(1, y / 40)).toFixed(1)} ${y}`);
  return "M" + pts.join("L");
};

export const Streamers = memo(function Streamers({ side = "left", reduce = false }) {
  const flip = side === "right";
  return (
    <div className={`pointer-events-none absolute top-0 ${flip ? "right-0 -scale-x-100" : "left-0"} w-[clamp(84px,17vw,210px)]`} aria-hidden="true">
      <svg viewBox="0 0 150 380" className="block h-auto w-full overflow-visible" fill="none" strokeLinecap="round">
        {RIBBONS.map((r, i) => {
          const d = wave(r, i * 1.3 + (flip ? 1 : 0));
          return (
            <g key={i} className="streamer-sway" style={{ transformOrigin: `${r.x}px 0px`, "--st-dur": `${5 + i * 0.6}s`, "--st-delay": `${-i * 0.8}s` }}>
              <motion.path
                d={d}
                stroke={r.c}
                strokeWidth="8"
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 2.4, ease: EASE, delay: 0.3 + i * 0.18 }}
              />
              <motion.path
                d={d}
                stroke={r.hi}
                strokeWidth="2"
                strokeOpacity=".7"
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 2.4, ease: EASE, delay: 0.3 + i * 0.18 }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
});

/** Party popper. Points up-and-right; mirror it for the right-hand corner. */
export const Popper = memo(function Popper({ className = "" }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="pp-body" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#82233a" />
          <stop offset="1" stopColor="#d96b86" />
        </linearGradient>
      </defs>
      <path d="M6 76 46 16 66 36Z" fill="url(#pp-body)" />
      <path d="M16 62 33 40M26 70 44 50M12 70 22 56" stroke="#f0dca8" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M46 16 66 36" stroke="#f0dca8" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="56" cy="26" rx="14" ry="5.5" transform="rotate(45 56 26)" fill="#3a0d15" />
      <path d="M60 14c4-8 10-8 12-14M66 22c8-2 10-8 14-9M52 12c0-6 4-9 3-13" stroke="#e8a72e" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
});
