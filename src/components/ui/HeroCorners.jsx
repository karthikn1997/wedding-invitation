import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { EASE } from "../../lib/motion";
import { Mandala } from "./Ornaments";

/**
 * Festive dressing for the two upper corners of the hero wall (mirrored):
 *   a corner mandala turning slowly, hanging marigold strings, a glowing brass lantern,
 *   two swags of twinkling fairy lights — plus a couple of butterflies drifting across the wall.
 * Entrances are framer-motion (once); everything ambient is CSS transform/opacity keyframes.
 * It sits *behind* the arch, so on phones only the corner triangles beside the arch show.
 */

const STRINGS = [
  { x: 24, len: 170 },
  { x: 58, len: 270 },
  { x: 92, len: 200 },
  { x: 126, len: 340 },
  { x: 168, len: 130 },
  { x: 206, len: 240 },
];
const LANTERN = { x: 262, chain: 120 };

const quad = (p0, c, p2, t) => {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p2[1]];
};
const SWAGS = [
  { p0: [-10, 2], c: [150, 122], p2: [300, 54], n: 9 },
  { p0: [-10, 58], c: [110, 196], p2: [232, 128], n: 7 },
];
const BULB_COLORS = ["#ffd98a", "#ffb3b8", "#fff1cf", "#ffc46b"];

function MarigoldString({ x, len }) {
  const blooms = [];
  for (let k = 0, y = 16; y < len; k++, y += 13) {
    if (k % 6 === 5) {
      blooms.push(<circle key={k} cx={x} cy={y} r="5" fill="#d96b86" />, <circle key={`c${k}`} cx={x} cy={y} r="2.4" fill="#f3a3b4" />);
    } else if (k % 4 === 3) {
      blooms.push(<ellipse key={k} cx={x} cy={y} rx="3.4" ry="6.5" fill="#5f7d47" transform={`rotate(${k % 8 === 3 ? 25 : -25} ${x} ${y})`} />);
    } else {
      const alt = k % 2;
      blooms.push(
        <circle key={k} cx={x} cy={y} r="6.6" fill={alt ? "#f0b73f" : "#e89a2a"} />,
        <circle key={`c${k}`} cx={x} cy={y} r="3.4" fill={alt ? "#e89a2a" : "#c9741c"} />,
      );
    }
  }
  return (
    <g>
      <line x1={x} y1="0" x2={x} y2={len} stroke="#c39c47" strokeWidth=".9" opacity=".8" />
      {blooms}
      {/* tassel */}
      <circle cx={x} cy={len + 4} r="3.6" fill="#e6cf98" />
      <path d={`M${x - 3} ${len + 7}l-2 16M${x} ${len + 7}v20M${x + 3} ${len + 7}l2 16`} stroke="#e6cf98" strokeWidth="1.1" strokeLinecap="round" />
    </g>
  );
}

function Lantern() {
  return (
    <g>
      <circle className="lamp-halo" cx="0" cy="78" r="58" fill="url(#hc-glow)" />
      <path d="M-14 51L0 37L14 51Z" fill="url(#hc-brass)" />
      <rect x="-15" y="50" width="30" height="50" rx="9" fill="url(#hc-brass)" />
      <path d="M-9 58Q0 47 9 58V92H-9Z" fill="url(#hc-window)" />
      <g className="flame">
        <path d="M0 68c5 7 6 12 0 18-6-6-5-11 0-18z" fill="#fff2cc" />
        <path d="M0 76c2.6 3 3.2 6 0 9-3.2-3-2.6-6 0-9z" fill="#f2a03a" />
      </g>
      <path d="M-9 58V92M0 52V96M9 58V92" stroke="#7d5a1c" strokeWidth=".9" opacity=".7" />
      <path d="M-17 100H17L11 108H-11Z" fill="url(#hc-brass)" />
      <circle cx="0" cy="112" r="3.2" fill="#e6cf98" />
      <path d="M-2 114l-1.5 14M0 115v16M2 114l1.5 14" stroke="#e6cf98" strokeWidth="1.1" strokeLinecap="round" />
    </g>
  );
}

function Corner({ side, opened, reduce, start }) {
  const flip = side === "right";
  const lights = useMemo(
    () =>
      SWAGS.map((s) => ({
        d: `M${s.p0[0]} ${s.p0[1]}Q${s.c[0]} ${s.c[1]} ${s.p2[0]} ${s.p2[1]}`,
        bulbs: Array.from({ length: s.n }, (_, i) => {
          const [x, y] = quad(s.p0, s.c, s.p2, (i + 0.5) / s.n);
          return { x, y, color: BULB_COLORS[i % BULB_COLORS.length], delay: -((i * 0.83 + (flip ? 0.4 : 0)) % 3.2) };
        }),
      })),
    [flip],
  );
  const drop = (delay, from, dur = 2) => ({
    initial: reduce ? false : { y: from, opacity: 0 },
    animate: opened || reduce ? { y: 0, opacity: 1 } : { y: from, opacity: 0 },
    transition: { duration: dur, ease: EASE, delay: reduce ? 0 : delay },
  });

  return (
    <div className={`pointer-events-none absolute top-0 ${flip ? "right-0 -scale-x-100" : "left-0"} w-[clamp(120px,26vw,420px)]`}>
      {/* corner mandala */}
      <motion.div
        className="absolute -top-[28%] -left-[45%] aspect-square w-[95%]"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: opened || reduce ? 1 : 0 }}
        transition={{ duration: 3, ease: EASE, delay: reduce ? 0 : start + 0.8 }}
      >
        <Mandala className="spin-slow h-full w-full text-gold-300/[0.3]" strokeWidth={0.4} />
        <Mandala className="spin-slow spin-rev absolute inset-[16%] h-[68%] w-[68%] text-gold-200/[0.22]" strokeWidth={0.5} />
      </motion.div>

      <svg viewBox="0 0 300 560" className="relative block h-auto w-full overflow-visible" aria-hidden="true" fill="none">
        <defs>
          <linearGradient id="hc-brass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9a7428" />
            <stop offset=".45" stopColor="#f0dca8" />
            <stop offset="1" stopColor="#a67f2e" />
          </linearGradient>
          <radialGradient id="hc-window" cx=".5" cy=".7" r=".8">
            <stop offset="0" stopColor="#ffe6a3" />
            <stop offset="1" stopColor="#e3893a" />
          </radialGradient>
          <radialGradient id="hc-glow">
            <stop offset="0" stopColor="#ffc46b" stopOpacity=".55" />
            <stop offset="1" stopColor="#ffc46b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hc-bulb">
            <stop offset="0" stopColor="#fff3d0" stopOpacity=".95" />
            <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* hanging marigold strings */}
        {STRINGS.map((s, i) => (
          <motion.g key={s.x} {...drop(start + 1 + i * 0.14, -(s.len + 40), 2.2)}>
            <g className="string-sway" style={{ transformOrigin: `${s.x}px 0px`, "--ss-dur": `${5 + i * 0.7}s`, "--ss-delay": `${-i * 0.9}s` }}>
              <MarigoldString {...s} />
            </g>
          </motion.g>
        ))}

        {/* brass lantern */}
        <motion.g {...drop(start + 1.8, -260, 2.6)}>
          <g className="lamp-swing" style={{ transformOrigin: `${LANTERN.x}px 0px`, "--ls-delay": flip ? "-1.6s" : "0s" }}>
            <g transform={`translate(${LANTERN.x} 0)`}>
              <line x1="0" y1="0" x2="0" y2={LANTERN.chain} stroke="#c39c47" strokeWidth="1.1" />
              <g transform={`translate(0 ${LANTERN.chain})`}>
                <Lantern />
              </g>
            </g>
          </g>
        </motion.g>

        {/* fairy lights */}
        <motion.g
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: opened || reduce ? 1 : 0 }}
          transition={{ duration: 2, ease: EASE, delay: reduce ? 0 : start + 1.4 }}
        >
          {lights.map((s, i) => (
            <g key={i}>
              <path d={s.d} stroke="#a37f2f" strokeWidth="1.2" opacity=".85" />
              {s.bulbs.map((b, j) => (
                <g key={j}>
                  <line x1={b.x} y1={b.y} x2={b.x} y2={b.y + 5} stroke="#a37f2f" strokeWidth=".9" />
                  <circle className="bulb-glow" cx={b.x} cy={b.y + 9} r="11" fill="url(#hc-bulb)" style={{ animationDelay: `${b.delay}s` }} />
                  <circle cx={b.x} cy={b.y + 9} r="3.4" fill={b.color} />
                </g>
              ))}
            </g>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}

function Butterfly({ className = "", style }) {
  return (
    <div className={`butterfly pointer-events-none absolute max-md:hidden ${className}`} style={style} aria-hidden="true">
      <svg viewBox="0 0 40 30" className="block h-full w-full overflow-visible">
        <g className="wing" style={{ transformOrigin: "20px 15px" }}>
          <path d="M20 15C14 2 3 0 2 8c-1 6 8 9 18 7z" fill="#f2a3b4" />
          <path d="M20 15C15 22 6 30 4 23c-1-4 6-9 16-8z" fill="#f0b73f" />
          <path d="M20 15C26 2 37 0 38 8c1 6-8 9-18 7z" fill="#f2a3b4" />
          <path d="M20 15C25 22 34 30 36 23c1-4-6-9-16-8z" fill="#f0b73f" />
        </g>
        <path d="M20 9v13" stroke="#3e2412" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function HeroCorners({ opened, reduce, start = 0.5 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Corner side="left" opened={opened} reduce={reduce} start={start} />
      <Corner side="right" opened={opened} reduce={reduce} start={start} />
      <Butterfly className="h-7 w-9" style={{ left: "5%", top: "52%", "--bf-dur": "19s", "--bf-x": "9vw", "--bf-y": "-8vh" }} />
      <Butterfly className="h-6 w-8" style={{ right: "6%", top: "38%", "--bf-dur": "23s", "--bf-x": "-8vw", "--bf-y": "9vh", animationDelay: "-7s" }} />
    </div>
  );
}

export default memo(HeroCorners);
