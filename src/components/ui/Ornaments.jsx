/**
 * Hand-built SVG motifs. All use `currentColor` so a parent's text colour tints them,
 * and are purely decorative (aria-hidden).
 */

/** Layered rangoli / kolam-style mandala. Stroke only. */
export function Mandala({ className = "", strokeWidth = 0.5 }) {
  const ring = (n, rx, ry, cy) =>
    Array.from({ length: n }, (_, i) => (
      <ellipse key={`${n}-${i}`} cx="100" cy={cy} rx={rx} ry={ry} transform={`rotate(${(i * 360) / n} 100 100)`} />
    ));
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="98" />
      <circle cx="100" cy="100" r="94" strokeDasharray="0.8 3.2" />
      {ring(32, 3.2, 10, 14)}
      {ring(24, 5, 15, 33)}
      {ring(16, 7, 19, 58)}
      {ring(12, 8, 15, 78)}
      <circle cx="100" cy="100" r="40" />
      <circle cx="100" cy="100" r="30" strokeDasharray="1 2.4" />
      {ring(8, 6, 14, 84)}
      <circle cx="100" cy="100" r="9" />
      <circle cx="100" cy="100" r="3" fill="currentColor" />
    </svg>
  );
}

/** A South-Indian gopuram (temple gateway tower) silhouette. Filled. */
export function Gopuram({ className = "" }) {
  const tiers = Array.from({ length: 7 }, (_, i) => i);
  const baseTop = 244;
  return (
    <svg viewBox="0 0 240 320" fill="currentColor" className={className} aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      {/* gateway base with arched entrance */}
      <path
        fillRule="evenodd"
        d={`M8 320V${baseTop}h224V320h-84v-38a28 28 0 0 0-56 0v38z`}
      />
      {tiers.map((i) => {
        const w = 196 - i * 25;
        const h = 24;
        const y = baseTop - h * (i + 1) - i * 3;
        const x = 120 - w / 2;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} />
            <rect x={x - 6} y={y + h - 3} width={w + 12} height={5} />
            {/* corner shrine pods */}
            <rect x={x + 4} y={y - 8} width="9" height="9" rx="1.5" />
            <rect x={x + w - 13} y={y - 8} width="9" height="9" rx="1.5" />
          </g>
        );
      })}
      {/* barrel roof + kalasam finials */}
      <path d="M92 70c0-22 12-32 28-32s28 10 28 32z" />
      <rect x="114" y="18" width="12" height="20" rx="3" />
      <circle cx="120" cy="14" r="5" />
      <path d="M120 0l3 9h-6z" />
      {[96, 144].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="52" r="3.5" />
          <path d={`M${cx} 42l2.5 6h-5z`} />
        </g>
      ))}
    </svg>
  );
}

/** Eight-petal lotus, filled — used as a divider centrepiece and section ornament. */
export function Lotus({ className = "" }) {
  const petal = (angle, len, w) => (
    <path
      key={`${angle}-${len}`}
      d={`M50 50 C${50 - w} ${50 - len * 0.45} ${50 - w * 0.6} ${50 - len} 50 ${50 - len} C${50 + w * 0.6} ${50 - len} ${50 + w} ${50 - len * 0.45} 50 50Z`}
      transform={`rotate(${angle} 50 50)`}
    />
  );
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} aria-hidden="true">
      <g opacity="0.55">{[-90, -60, 60, 90].map((a) => petal(a, 36, 13))}</g>
      <g opacity="0.8">{[-45, 45].map((a) => petal(a, 42, 14))}</g>
      {petal(0, 46, 15)}
      <circle cx="50" cy="52" r="3" opacity="0.9" />
    </svg>
  );
}

/** Four-point sparkle star. */
export function SparkleStar({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c.8 6.6 4.4 10.7 12 12-7.6 1.3-11.2 5.4-12 12-.8-6.6-4.4-10.7-12-12C7.6 10.7 11.2 6.6 12 0z" />
    </svg>
  );
}

/** Single petal shape for falling petals. */
export function PetalShape({ className = "", color = "#c97580" }) {
  return (
    <svg viewBox="0 0 20 28" className={className} aria-hidden="true">
      <path d="M10 0C17 6 20 13 15 21 13 25 11 27 10 28 9 27 7 25 5 21 0 13 3 6 10 0Z" fill={color} />
      <path d="M10 3C10 10 10 18 10 26" stroke="rgb(255 255 255 / .28)" strokeWidth=".6" fill="none" />
    </svg>
  );
}

/** A sagging marigold torana (garland) with mango-leaf pendants — spans its container's width. */
export function Garland({ className = "", flowers = 9 }) {
  const w = 400;
  const items = Array.from({ length: flowers }, (_, i) => {
    const t = i / (flowers - 1);
    return { x: 14 + t * (w - 28), y: 16 + Math.sin(t * Math.PI) * 22, alt: i % 2 };
  });
  const path = items.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} 84`} className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d={path} fill="none" stroke="#c39c47" strokeWidth="1" opacity=".7" />
      {items.map((p, i) => (
        <g key={i}>
          <path d={`M${p.x} ${p.y + 6}c-5 8-5 16 0 26 5-10 5-18 0-26z`} fill="#6c7a45" opacity=".85" />
          <circle cx={p.x} cy={p.y} r="7.5" fill={p.alt ? "#e8b955" : "#dba13b"} />
          <circle cx={p.x} cy={p.y} r="4.4" fill={p.alt ? "#dba13b" : "#c98a2a"} />
          <circle cx={p.x} cy={p.y} r="1.6" fill="#8a5a17" />
          {i % 3 === 1 && <circle cx={p.x} cy={p.y + 38} r="2.6" fill="#c97580" />}
        </g>
      ))}
    </svg>
  );
}

/** Hanging temple bell / diya lamp (used in the opening). */
export function Diya({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <path d="M32 6c5 7 7 12 0 20-7-8-5-13 0-20z" fill="#f6e8bf" opacity=".95" />
      <path d="M32 14c2 3 3 6 0 9-3-3-2-6 0-9z" fill="#e39b3a" />
      <path d="M8 34c2 12 12 20 24 20s22-8 24-20z" fill="currentColor" />
      <path d="M6 34h52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
