import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { EASE } from "../../lib/motion";
import AnimatedImage from "./AnimatedImage";
import { SparkleStar } from "./Ornaments";

/**
 * A portrait in a living arch frame:
 *   • pulsing warm aura behind it
 *   • a gold border whose light slowly rotates (conic gradient inside an overflow-hidden arch)
 *   • two comets of light chasing around the border
 *   • a jewel at the apex, twinkling stars around the edge
 *   • a glint that sweeps across the photograph every few seconds
 *   • pointer-driven 3D tilt + moving glare (mouse only; off for reduced motion)
 */

const ARCH = "M1 124V50A49 49 0 0 1 99 50V124Z";
const STARS = [
  { l: "-5%", t: "22%", s: 16, d: 0 },
  { l: "101%", t: "40%", s: 12, d: 1.4 },
  { l: "12%", t: "-3%", s: 11, d: 2.2 },
  { l: "92%", t: "8%", s: 15, d: 0.7 },
  { l: "-3%", t: "74%", s: 11, d: 2.9 },
  { l: "102%", t: "86%", s: 14, d: 1.9 },
];

export default function GlowFrame({ src, alt, from = "left", className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = { stiffness: 110, damping: 15, mass: 0.6 };
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), spring);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), spring);
  const gx = useTransform(mx, (v) => v * 100);
  const gy = useTransform(my, (v) => v * 100);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgb(255 246 214 / .38), transparent 55%)`;

  const move = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const leave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const dir = from === "left" ? -1 : 1;

  return (
    <motion.div
      className={`group relative ${className}`}
      style={{ perspective: 900 }}
      initial={reduce ? false : { opacity: 0, x: 70 * dir, rotate: 4 * dir, scale: 0.92 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.6, ease: EASE }}
    >
      <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative">
        {/* aura */}
        <div
          className="aura pointer-events-none absolute -inset-[14%] rounded-t-[999px] rounded-b-[40%] blur-2xl transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: "radial-gradient(ellipse at 50% 45%, rgb(240 200 120 / .55), rgb(217 107 134 / .28) 55%, transparent 75%)" }}
        />

        {/* rotating gold border */}
        <div className="relative overflow-hidden rounded-t-[999px] rounded-b-md p-[4px] shadow-[0_18px_50px_-10px_rgb(0_0_0/0.6)]">
          <div
            className="spin-slow absolute -inset-[60%]"
            style={{ "--spin-dur": "8s", background: "conic-gradient(from 0deg, #6f4f14, #f7e9c0, #c39c47, #6f4f14, #efd9a0, #b58d3c, #fff6d6, #6f4f14)" }}
          />
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[5px] bg-maroon-950">
            <AnimatedImage src={src} alt={alt} width={800} height={1000} reveal="up" parallax={16} hoverZoom className="aspect-[4/5] rounded-t-[999px] rounded-b-[5px]" />
            {/* glint sweeping across the photograph */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light">
              <div className="glint absolute inset-y-[-10%] -left-[60%] w-[45%]" style={{ background: "linear-gradient(100deg, transparent 15%, rgb(255 244 214 / .95) 50%, transparent 85%)" }} />
            </div>
            {!reduce && <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: glare }} />}
            {/* inner vignette + rim light */}
            <div className="pointer-events-none absolute inset-0 rounded-t-[999px] shadow-[inset_0_0_30px_rgb(36_8_13/0.55),inset_0_0_0_1px_rgb(255_240_200/0.25)]" />
          </div>
        </div>

        {/* comets of light chasing around the border */}
        <svg viewBox="0 0 100 125" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden="true">
          <path className="comet" d={ARCH} pathLength="100" stroke="#fff6d6" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 46" />
        </svg>

        {/* offset outline with beads */}
        <div className="pointer-events-none absolute -inset-2.5 rounded-t-[999px] rounded-b-lg border border-dashed border-gold-400/45 transition-colors duration-700 group-hover:border-gold-200" />

        {/* jewel at the apex */}
        <div className="pointer-events-none absolute -top-[13px] left-1/2 -translate-x-1/2" aria-hidden="true">
          <div className="gem relative h-[18px] w-[18px] rotate-45 rounded-[3px] bg-gradient-to-br from-[#fff6d6] via-[#e6455f] to-[#82233a] shadow-[0_0_14px_3px_rgb(240_120_140/0.7)] ring-1 ring-gold-300" />
        </div>

        {/* twinkling stars around the edge */}
        {STARS.map((s, i) => (
          <span key={i} className="sparkle pointer-events-none absolute text-gold-200" style={{ left: s.l, top: s.t, width: s.s, height: s.s, "--s-dur": "3.6s", "--s-delay": `${-s.d}s` }} aria-hidden="true">
            <SparkleStar className="block h-full w-full drop-shadow-[0_0_6px_rgb(255_240_190/0.9)]" />
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
