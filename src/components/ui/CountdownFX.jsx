import { memo, useMemo } from "react";
import { seeded, range } from "../../lib/random";

/** Atmosphere for the countdown night sky. Pure CSS keyframes (transform / opacity only). */

/** Paper sky-lanterns drifting up with a warm glow. ~60% render on phones. */
export const SkyLanterns = memo(function SkyLanterns({ count = 8, seed = 17 }) {
  const items = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, (_, i) => {
      const dur = range(rand, 20, 34);
      return {
        id: i,
        left: range(rand, 3, 94),
        size: range(rand, 22, 46),
        dur,
        delay: -range(rand, 0, dur),
        x: range(rand, -50, 50),
        o: range(rand, 0.55, 0.95),
        hideOnMobile: i >= Math.ceil(count * 0.6),
      };
    });
  }, [count, seed]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((l) => (
        <span
          key={l.id}
          className={`sky-lantern ${l.hideOnMobile ? "max-md:hidden" : ""}`}
          style={{ left: `${l.left}%`, width: l.size, "--l-dur": `${l.dur}s`, "--l-delay": `${l.delay}s`, "--l-x": `${l.x}px`, "--l-o": l.o }}
        >
          <svg viewBox="0 0 40 56" className="block h-auto w-full">
            <defs>
              <radialGradient id={`sl-glow-${l.id}`} cx=".5" cy=".62" r=".7">
                <stop offset="0" stopColor="#fff3c4" />
                <stop offset=".55" stopColor="#f6b95a" />
                <stop offset="1" stopColor="#c9741c" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="30" r="26" fill="#ffb95a" opacity=".16" />
            <path d="M8 10C8 4 32 4 32 10L36 44C36 48 4 48 4 44Z" fill={`url(#sl-glow-${l.id})`} />
            <path d="M8 10C8 4 32 4 32 10" stroke="#8a4a14" strokeWidth="1.4" fill="none" />
            <path d="M14 8 12 46M20 6V47M26 8l2 38" stroke="#8a4a14" strokeWidth=".6" opacity=".4" fill="none" />
            <ellipse cx="20" cy="47" rx="10" ry="2.6" fill="#7a3d0e" />
          </svg>
        </span>
      ))}
    </div>
  );
});

/** A few meteors that streak across now and then. */
export const ShootingStars = memo(function ShootingStars() {
  const stars = [
    { top: "10%", left: "62%", delay: "1s", dur: "9s" },
    { top: "24%", left: "88%", delay: "5.5s", dur: "11s" },
    { top: "6%", left: "34%", delay: "9s", dur: "13s" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((s, i) => (
        <span key={i} className="shooting-star" style={{ top: s.top, left: s.left, "--sh-delay": s.delay, "--sh-dur": s.dur }} />
      ))}
    </div>
  );
});

function Diya({ delay = 0, className = "" }) {
  return (
    <svg viewBox="0 0 40 34" className={className} aria-hidden="true">
      <ellipse className="lamp-halo" cx="20" cy="10" rx="14" ry="12" fill="#ffb84d" opacity=".28" style={{ animationDelay: `${delay}s` }} />
      <g className="flame" style={{ animationDelay: `${delay}s` }}>
        <path d="M20 1c4 5 5 9 0 14-5-5-4-9 0-14z" fill="#fff2cc" />
        <path d="M20 7c2 2.4 2.6 4.6 0 7-2.6-2.4-2-4.6 0-7z" fill="#e39b3a" />
      </g>
      <path d="M4 18c1 8 8 14 16 14s15-6 16-14z" fill="#b58d3c" />
      <path d="M4 18h32" stroke="#f0dca8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** A line of lit diyas along the base of the section. */
export const DiyaRow = memo(function DiyaRow({ count = 11 }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-between px-4 sm:bottom-5 sm:px-[6vw]" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <Diya key={i} delay={-((i * 0.37) % 1.6)} className={`w-5 sm:w-7 ${i % 2 && i !== count - 1 ? "max-sm:hidden" : ""}`} />
      ))}
    </div>
  );
});
