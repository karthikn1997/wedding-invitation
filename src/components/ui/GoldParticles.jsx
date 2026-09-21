import { memo, useMemo } from "react";
import { SparkleStar } from "./Ornaments";
import { seeded, range } from "../../lib/random";

/**
 * Drifting gold dust + a few twinkling sparkles. CSS keyframes only.
 * Keep `count` small (10–18) — the effect should be felt, not seen.
 */
function GoldParticles({ count = 14, sparkles = 4, seed = 3, className = "", tone = "text-gold-300" }) {
  const { dust, stars } = useMemo(() => {
    const rand = seeded(seed);
    return {
      dust: Array.from({ length: count }, (_, i) => ({
        id: i,
        left: range(rand, 2, 98),
        top: range(rand, 15, 98),
        size: range(rand, 3, 8),
        dur: range(rand, 8, 15),
        delay: -range(rand, 0, 12),
        x: range(rand, -22, 22),
        o: range(rand, 0.35, 0.85),
        hideOnMobile: i >= Math.ceil(count * 0.65),
      })),
      stars: Array.from({ length: sparkles }, (_, i) => ({
        id: i,
        left: range(rand, 6, 94),
        top: range(rand, 8, 92),
        size: range(rand, 9, 15),
        dur: range(rand, 3.5, 6.5),
        delay: -range(rand, 0, 6),
      })),
    };
  }, [count, sparkles, seed]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {dust.map((d) => (
        <span
          key={d.id}
          className={`particle ${d.hideOnMobile ? "max-md:hidden" : ""}`}
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            "--g-dur": `${d.dur}s`,
            "--g-delay": `${d.delay}s`,
            "--g-x": `${d.x}px`,
            "--g-o": d.o,
          }}
        />
      ))}
      {stars.map((s) => (
        <span
          key={s.id}
          className={`sparkle ${tone}`}
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, "--s-dur": `${s.dur}s`, "--s-delay": `${s.delay}s` }}
        >
          <SparkleStar className="block h-full w-full" />
        </span>
      ))}
    </div>
  );
}

export default memo(GoldParticles);
