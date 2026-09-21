import { memo, useMemo } from "react";
import { PetalShape } from "./Ornaments";
import { seeded, range } from "../../lib/random";

const PALETTES = {
  rose: ["#c97580", "#b45a68", "#e2a3a8", "#f3e7cf"],
  marigold: ["#dba13b", "#e8b955", "#c98a2a", "#f3e7cf"],
  mixed: ["#c97580", "#dba13b", "#f3e7cf", "#e2a3a8", "#e8b955"],
};

/**
 * Falling petals — pure CSS (transform/opacity keyframes), zero JS per frame.
 * Negative delays mean petals are already mid-air on mount. On phones only ~60%
 * of them render. Place inside a `relative` container up to ~one viewport tall.
 */
function PetalAnimation({ count = 10, palette = "mixed", seed = 7, className = "", opacity = 0.75 }) {
  const petals = useMemo(() => {
    const rand = seeded(seed);
    const colors = PALETTES[palette] || PALETTES.mixed;
    return Array.from({ length: count }, (_, i) => {
      const dur = range(rand, 15, 28);
      return {
        id: i,
        left: range(rand, 0, 100),
        size: range(rand, 9, 18),
        dur,
        delay: -range(rand, 0, dur),
        sway: range(rand, -70, 70),
        spin: range(rand, 160, 420),
        color: colors[Math.floor(rand() * colors.length)],
        hideOnMobile: i >= Math.ceil(count * 0.6),
      };
    });
  }, [count, palette, seed]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className={`petal ${p.hideOnMobile ? "max-md:hidden" : ""}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            "--p-dur": `${p.dur}s`,
            "--p-delay": `${p.delay}s`,
            "--p-sway": `${p.sway}px`,
            "--p-spin": `${p.spin}deg`,
            "--p-o": opacity,
          }}
        >
          <PetalShape color={p.color} className="block h-auto w-full" />
        </span>
      ))}
    </div>
  );
}

export default memo(PetalAnimation);
