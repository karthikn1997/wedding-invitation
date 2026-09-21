import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { EASE } from "../../lib/motion";
import { Mandala } from "./Ornaments";
import FlowerCluster from "./Peonies";

/**
 * The hero "set": a carved wooden arch on a damask wall, a deep-burgundy opening, a blush floor and
 * peony bouquets in the corners. Children (the copy) are laid over the opening.
 *
 * The arch head is one SVG (viewBox 400×300, scales with the stage width); the pillars below it are plain
 * divs so the set can be any height. Everything is sized in `cqw` (stage width) so it scales as one piece.
 */

/* Left half of the frame's centre-line: pillar going up, then the arch shoulder, then the crown. */
const PILLAR = [
  [43, 300],
  [43, 174],
];
const SEGS = [
  [[43, 174], [43, 112], [110, 79], [155, 55]],
  [[155, 55], [177, 43], [192, 31], [200, 23]],
];

/* A little carved scroll, drawn twice (shadow + highlight) for a relief look. Local x = along the band. */
const SCROLL =
  "<path d='M-6 7C-6 -1 1 -9 8 -5C11 -3 9 1 6 0'/><path d='M-6 7C-2 10 4 10 7 7'/><path d='M-9 -3C-6 -8 -2 -9 0 -7'/>";
const LEAF = "<path d='M-3 2C0 -4 4 -4 6 0C3 1 0 1 -3 2Z' fill='#3e2412' fill-opacity='.35' stroke='none'/>";
const glyph = (x, y, rot, flip) =>
  `<g transform='translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(1)}) scale(1 ${flip ? -1 : 1})'>` +
  `<g fill='none' stroke='#f3d9a6' stroke-width='.9' stroke-linecap='round' opacity='.55' transform='translate(-.5 -.6)'>${SCROLL}</g>` +
  `<g fill='none' stroke='#3e2412' stroke-width='.9' stroke-linecap='round' opacity='.85'>${SCROLL}${LEAF}</g></g>`;

/** Resample the centre-line at even arc-length steps and drop a scroll at each stop. */
function carve(step = 11) {
  const pts = [];
  for (let i = 0; i <= 40; i++) pts.push([PILLAR[0][0], PILLAR[0][1] + ((PILLAR[1][1] - PILLAR[0][1]) * i) / 40]);
  for (const [p0, p1, p2, p3] of SEGS) {
    for (let i = 1; i <= 80; i++) {
      const t = i / 80;
      const u = 1 - t;
      pts.push([
        u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
      ]);
    }
  }
  let out = "";
  let acc = 0;
  let next = step / 2;
  let k = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    acc += Math.hypot(x1 - x0, y1 - y0);
    if (acc >= next) {
      out += glyph(x1, y1, (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI, k++ % 2);
      next += step;
    }
  }
  return out;
}

const svgUrl = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const PILLAR_TILE = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='22' viewBox='0 0 30 22'>${glyph(15, 5.5, -90, 0)}${glyph(15, 16.5, -90, 1)}</svg>`,
);

/* frame outlines (left/right mirrored around x = 200) */
const OPENING = "M58 300V175C58 125 120 95 162 72C182 61 194 50 200 40C206 50 218 61 238 72C280 95 342 125 342 175V300";
const OUTER = "M28 300V172C28 100 100 62 148 38C172 26 190 16 200 6C210 16 228 26 252 38C300 62 372 100 372 172V300";
const BAND = `${OUTER}L372 300H342V175C342 125 280 95 238 72C218 61 206 50 200 40C194 50 182 61 162 72C120 95 58 125 58 175V300H28Z`;

const HEAD_SVG = "absolute top-0 left-0 block h-auto w-full";

/** The burgundy opening of the arch head, with a soft inner shadow. Sits *behind* the room lighting. */
function ArchBack() {
  return (
    <svg viewBox="0 0 400 300" className={HEAD_SVG} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="hs-open" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f1120" />
          <stop offset="1" stopColor="#4e1728" />
        </linearGradient>
        <clipPath id="hs-clip">
          <path d={`${OPENING}H58Z`} />
        </clipPath>
        <filter id="hs-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path d={`${OPENING}H58Z`} fill="url(#hs-open)" />
      <g clipPath="url(#hs-clip)">
        <path d={OPENING} stroke="#1c0610" strokeWidth="22" opacity=".55" filter="url(#hs-soft)" />
      </g>
    </svg>
  );
}

/** The carved wooden band, drawn over the lighting. */
function ArchFront() {
  const scrolls = useMemo(() => carve(), []);
  return (
    <svg viewBox="0 0 400 300" className={HEAD_SVG} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="hs-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3a465" />
          <stop offset=".5" stopColor="#b17f47" />
          <stop offset="1" stopColor="#a37343" />
        </linearGradient>
      </defs>
      {/* shadow the frame casts on the wall, then the carved wooden band */}
      <path d={OUTER} stroke="#1d0d06" strokeWidth="5" opacity=".45" />
      <path d={BAND} fill="url(#hs-wood)" fillRule="evenodd" />
      <path d={BAND} fill="#5a3a1c" fillOpacity=".12" fillRule="evenodd" />
      <g dangerouslySetInnerHTML={{ __html: scrolls }} />
      <g transform="translate(400 0) scale(-1 1)" dangerouslySetInnerHTML={{ __html: scrolls }} />
      {/* gilded edges: fine rule outside, beaded rule inside */}
      <path d={OUTER} stroke="#e9c885" strokeWidth="1.3" />
      <path d={OPENING} stroke="#4a2c14" strokeWidth="1.6" />
      <path d={OPENING} stroke="#f1d59a" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0.1 5" opacity=".9" transform="translate(0 -3.5)" />
    </svg>
  );
}

const WALL_LATTICE = svgUrl(
  "<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56' fill='none' stroke='#b58a55' stroke-opacity='.16' stroke-width='.8'><path d='M28 4 52 28 28 52 4 28Z'/><path d='M28 16 40 28 28 40 16 28Z'/><circle cx='28' cy='28' r='2.4' fill='#b58a55' fill-opacity='.2' stroke='none'/><circle cx='0' cy='0' r='2' fill='#b58a55' fill-opacity='.14' stroke='none'/><circle cx='56' cy='0' r='2' fill='#b58a55' fill-opacity='.14' stroke='none'/><circle cx='0' cy='56' r='2' fill='#b58a55' fill-opacity='.14' stroke='none'/><circle cx='56' cy='56' r='2' fill='#b58a55' fill-opacity='.14' stroke='none'/></svg>",
);

function HeroStage({ opened, reduce, start = 0.5, children }) {
  const grow = (delay, from, dur = 2.2) => ({
    initial: reduce ? false : { opacity: 0, ...from },
    animate: opened || reduce ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, ...from },
    transition: { duration: dur, ease: EASE, delay: reduce ? 0 : delay },
  });

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#2a1810]" style={{ backgroundImage: WALL_LATTICE }} aria-hidden={undefined}>
      {/* soft vignette over the wall */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 40%, rgb(12 4 2 / .6) 100%)" }} />

      <div className="@container relative mx-auto h-full w-[min(100%,calc(100svh*0.7))] md:mt-14 md:h-[calc(100%-3.5rem)]">
        {/* opening below the arch head */}
        <div
          className="absolute inset-x-[14.5%] top-[calc(75cqw-2px)] bottom-0"
          style={{ background: "linear-gradient(90deg, rgb(28 6 16 / .55), transparent 4cqw calc(100% - 4cqw), rgb(28 6 16 / .55)), linear-gradient(to bottom, #4e1728 0%, #5c1c30 55%, #6b2337 100%)" }}
        />
        <ArchBack />
        {/* light in the room: halo + slowly turning mandala, tucked inside the opening */}
        <motion.div className="pointer-events-none absolute inset-0" {...grow(start + 1.2, {}, 3)}>
          <div className="halo absolute top-[46%] left-1/2 h-[78cqw] w-[78cqw] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgb(226 140 128 / .34) 0%, rgb(190 90 100 / .14) 42%, transparent 70%)" }} />
          <Mandala className="spin-slow absolute top-[46%] left-1/2 h-[58cqw] w-[58cqw] -translate-x-1/2 -translate-y-1/2 text-gold-300/[0.2]" strokeWidth={0.3} />
        </motion.div>

        <ArchFront />
        {/* carved pillars continue the arch down to the floor */}
        {["left", "right"].map((side) => (
          <div
            key={side}
            className={`absolute ${side === "left" ? "left-[7%]" : "right-[7%]"} top-[calc(75cqw-1px)] bottom-0 w-[7.5%]`}
            style={{
              backgroundColor: "#94683c",
              backgroundImage: `${PILLAR_TILE}, linear-gradient(to bottom, rgb(255 226 170 / .12), transparent 30%)`,
              backgroundSize: "100% auto, 100% 100%",
              [side === "left" ? "borderLeft" : "borderRight"]: "0.33cqw solid #e9c885",
              [side === "left" ? "borderRight" : "borderLeft"]: "0.4cqw solid #4a2c14",
            }}
          />
        ))}
        {/* a light sweep drifting across the woodwork */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light">
          <div className="sheen absolute inset-y-0 -left-full w-[60%]" style={{ background: "linear-gradient(100deg, transparent 20%, rgb(255 238 200 / .55) 50%, transparent 80%)" }} />
        </div>

        {/* floor */}
        <div className="pointer-events-none absolute inset-x-[-100vw] bottom-0 h-[13%]">
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #e9adb4 0%, #d9919b 45%, #c67b88 100%)", boxShadow: "0 -14px 26px -6px rgb(18 4 8 / .55)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 45% 90% at 50% 0%, rgb(255 232 226 / .45), transparent 70%)" }} />
        </div>

        {/* peonies */}
        <motion.div className="pointer-events-none absolute bottom-[-1%] -left-[12%] w-[54cqw] origin-bottom-left" {...grow(start + 1.5, { y: 50, scale: 0.86 })}>
          <FlowerCluster seed={11} className="block h-auto w-full" />
        </motion.div>
        <motion.div className="pointer-events-none absolute -right-[12%] bottom-[-1%] w-[54cqw] origin-bottom-right" {...grow(start + 1.8, { y: 50, scale: 0.86 })}>
          <FlowerCluster seed={29} className="block h-auto w-full scale-x-[-1]" />
        </motion.div>

        {children}
      </div>
    </div>
  );
}

export default memo(HeroStage);
