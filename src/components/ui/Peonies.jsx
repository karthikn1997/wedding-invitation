import { memo, useMemo } from "react";
import { seeded, range } from "../../lib/random";

/**
 * Hand-drawn peony bouquet with baby's-breath sprays and leaves, as one SVG.
 * `FlowerCluster` is meant to sit in a bottom corner; mirror it with `scale-x-[-1]` for the other side.
 * The sprays sway gently (CSS, transform only).
 */

const VARIANTS = {
  a: { outer: ["#f2a9b3", "#fde9e8"], inner: ["#d8607a", "#f2a0b0"] },
  b: { outer: ["#f7c1c6", "#fff1ee"], inner: ["#e88fa0", "#f9cdd2"] },
  c: { outer: ["#ec93a3", "#fbd7da"], inner: ["#c9506c", "#ee92a6"] },
};
const RINGS = [
  { n: 9, s: 1.35, off: 0 },
  { n: 8, s: 1.08, off: 22 },
  { n: 7, s: 0.82, off: 9 },
  { n: 6, s: 0.55, off: 30 },
  { n: 5, s: 0.3, off: 12 },
];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");

function Defs() {
  return (
    <defs>
      <path id="pe-petal" d="M0 0C-14 -6 -18 -22 -8 -30C-4 -33 -1 -31 0 -29C1 -31 4 -33 8 -30C18 -22 14 -6 0 0Z" />
      {Object.entries(VARIANTS).flatMap(([v, c]) =>
        RINGS.map((_, i) => {
          const t = i / (RINGS.length - 1);
          return (
            <linearGradient key={`${v}${i}`} id={`pg-${v}-${i}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={mix(c.outer[0], c.inner[0], t)} />
              <stop offset="1" stopColor={mix(c.outer[1], c.inner[1], t)} />
            </linearGradient>
          );
        }),
      )}
      <linearGradient id="pe-leaf" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#3b5230" />
        <stop offset="1" stopColor="#7d9a5c" />
      </linearGradient>
      <linearGradient id="pe-leaf2" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#2f4527" />
        <stop offset="1" stopColor="#5f7d47" />
      </linearGradient>
    </defs>
  );
}

function Peony({ x, y, s = 1, rot = 0, v = "a", squash = 0.94 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} ${s * squash})`}>
      {RINGS.map((r, ri) =>
        Array.from({ length: r.n }, (_, i) => (
          <use
            key={`${ri}-${i}`}
            href="#pe-petal"
            transform={`rotate(${r.off + (i * 360) / r.n}) scale(${r.s})`}
            fill={`url(#pg-${v}-${ri})`}
            stroke="rgb(150 50 80 / .28)"
            strokeWidth=".45"
          />
        )),
      )}
      <circle r="3.4" fill="#f4cf63" />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={Math.cos((i * 2 * Math.PI) / 9) * 3.6} cy={Math.sin((i * 2 * Math.PI) / 9) * 3.6} r=".9" fill="#e9a93a" />
      ))}
    </g>
  );
}

const Leaf = ({ x, y, rot, s = 1, tone = "pe-leaf" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 0C11 -14 11 -34 0 -54C-11 -34 -11 -14 0 0Z" fill={`url(#${tone})`} stroke="rgb(30 50 25 / .35)" strokeWidth=".5" />
    <path d="M0 -2V-48" stroke="rgb(235 245 200 / .35)" strokeWidth=".6" />
  </g>
);

/** Baby's-breath: a curved stem with side twigs that end in tiny white blossoms. */
function buildSprays(seed) {
  const rand = seeded(seed);
  return Array.from({ length: 8 }, (_, i) => {
    const bx = range(rand, 25, 175);
    const by = 372;
    const a = range(rand, -0.6, 0.5) + (bx < 90 ? -0.1 : 0.12);
    const len = range(rand, 140, 265);
    const ex = bx + Math.sin(a) * len;
    const ey = by - Math.cos(a) * len;
    const bend = range(rand, -40, 40);
    const cx = (bx + ex) / 2 + bend;
    const cy = (by + ey) / 2;
    const at = (t) => {
      const u = 1 - t;
      return [u * u * bx + 2 * u * t * cx + t * t * ex, u * u * by + 2 * u * t * cy + t * t * ey];
    };
    const twigs = [0.4, 0.55, 0.7, 0.85, 1].map((t, k) => {
      const [px, py] = at(t);
      const side = k % 2 ? 1 : -1;
      const ang = a + side * range(rand, 0.45, 0.95);
      const tl = t === 1 ? 0 : range(rand, 22, 42);
      const tx = px + Math.sin(ang) * tl;
      const ty = py - Math.cos(ang) * tl;
      const dots = Array.from({ length: t === 1 ? 6 : 4 }, () => ({
        x: tx + range(rand, -7, 7),
        y: ty + range(rand, -7, 7),
        r: range(rand, 1.4, 2.7),
      }));
      return { px, py, tx, ty, dots };
    });
    return {
      id: i,
      bx,
      by,
      d: `M${bx} ${by}Q${cx} ${cy} ${ex} ${ey}`,
      twigs,
      dur: range(rand, 6, 10),
      delay: -range(rand, 0, 8),
    };
  });
}

function FlowerCluster({ seed = 11, className = "" }) {
  const sprays = useMemo(() => buildSprays(seed), [seed]);
  return (
    <svg viewBox="0 0 320 400" className={`overflow-visible ${className}`} aria-hidden="true" fill="none">
      <Defs />
      {/* baby's-breath sprays */}
      {sprays.map((s) => (
        <g key={s.id} className="flower-sway" style={{ transformOrigin: `${s.bx}px ${s.by}px`, "--fs-dur": `${s.dur}s`, "--fs-delay": `${s.delay}s` }}>
          <path d={s.d} stroke="#7a8c58" strokeWidth=".9" strokeLinecap="round" />
          {s.twigs.map((t, k) => (
            <g key={k}>
              <path d={`M${t.px} ${t.py}L${t.tx} ${t.ty}`} stroke="#7a8c58" strokeWidth=".6" strokeLinecap="round" />
              {t.dots.map((d, j) => (
                <circle key={j} cx={d.x} cy={d.y} r={d.r} fill="#fffaf0" opacity=".96" />
              ))}
            </g>
          ))}
        </g>
      ))}

      {/* leaves */}
      <g>
        <Leaf x={58} y={372} rot={-58} s={1.35} tone="pe-leaf2" />
        <Leaf x={30} y={330} rot={-32} s={1.15} />
        <Leaf x={20} y={286} rot={-14} s={1.0} tone="pe-leaf2" />
        <Leaf x={120} y={372} rot={-14} s={1.25} />
        <Leaf x={100} y={372} rot={22} s={1.3} tone="pe-leaf2" />
        <Leaf x={170} y={380} rot={62} s={1.15} />
        <Leaf x={150} y={378} rot={38} s={1.0} tone="pe-leaf2" />
        <Leaf x={80} y={300} rot={-8} s={0.9} />
      </g>

      {/* peonies, back to front */}
      <Peony x={112} y={262} s={0.72} rot={12} v="b" />
      <Peony x={36} y={258} s={0.98} rot={-20} v="a" />
      <Peony x={168} y={352} s={0.62} rot={30} v="c" />
      <Peony x={126} y={334} s={1.02} rot={-8} v="b" />
      <Peony x={60} y={322} s={1.28} rot={6} v="a" />
      <Peony x={22} y={362} s={0.7} rot={40} v="c" />
    </svg>
  );
}

export default memo(FlowerCluster);
