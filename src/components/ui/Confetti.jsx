import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Party-paper confetti on a single <canvas> that fills its (relative) parent.
 * Imperative API via ref:  burst({ x, y, angle, spread, power, count, hearts })  ·  rain(count, ms)
 * The animation loop only runs while particles are alive, then stops completely.
 * Coordinates are CSS pixels relative to the parent's top-left; `angle` is in degrees (-90 = straight up).
 */

const COLORS = ["#c39c47", "#e6cf98", "#f0b73f", "#82233a", "#c9506c", "#f2a3b4", "#ffffff", "#6c7a45"];
const HEART = typeof Path2D !== "undefined" ? new Path2D("M16 28C16 28 2 19 2 9.5 2 4.5 6 1 10 1c2.6 0 4.8 1.4 6 3.6C17.2 2.4 19.4 1 22 1c4 0 8 3.5 8 8.5C30 19 16 28 16 28z") : null;
const HEART_COLORS = ["#d96b86", "#c9506c", "#f2a3b4", "#e6455f", "#ffffff"];

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function make(x, y, angle, spread, power, hearts) {
  const a = ((angle + (Math.random() - 0.5) * spread) * Math.PI) / 180;
  const v = power * rnd(0.5, 1.1);
  const r = Math.random();
  const shape = hearts && r < 0.5 ? "heart" : r < 0.55 ? "heart" : r < 0.72 ? "streamer" : r < 0.84 ? "circle" : "rect";
  return {
    x,
    y,
    vx: Math.cos(a) * v,
    vy: Math.sin(a) * v,
    rot: rnd(0, 360),
    vr: rnd(-9, 9),
    ph: rnd(0, 6.28),
    vp: rnd(0.12, 0.3),
    shape,
    color: shape === "heart" ? pick(HEART_COLORS) : pick(COLORS),
    w: shape === "streamer" ? rnd(3.5, 5.5) : shape === "heart" ? rnd(9, 17) : rnd(6, 11),
    h: shape === "streamer" ? rnd(18, 40) : rnd(8, 15),
    drag: rnd(0.955, 0.972),
    age: 0,
    life: rnd(170, 300),
  };
}

const Confetti = forwardRef(function Confetti({ className = "" }, ref) {
  const canvasRef = useRef(null);
  const parts = useRef([]);
  const raf = useRef(0);
  const last = useRef(0);
  const box = useRef({ w: 0, h: 0 });
  const timers = useRef([]);

  const draw = (ctx) => {
    const { w, h } = box.current;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts.current) {
      const fade = p.age > p.life - 30 ? Math.max(0, (p.life - p.age) / 30) : 1;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === "heart" && HEART) {
        const s = p.w / 32;
        ctx.scale(s * Math.cos(p.ph) * 0.5 + s * 0.6, s);
        ctx.translate(-16, -14);
        ctx.fill(HEART);
      } else if (p.shape === "circle") {
        ctx.scale(1, Math.abs(Math.cos(p.ph)) * 0.7 + 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, 6.283);
        ctx.fill();
      } else {
        ctx.scale(1, Math.cos(p.ph)); // paper flutter: flips edge-on and back
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }
  };

  const tick = (t) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const f = Math.min(2.5, (t - (last.current || t)) / 16.67) || 1;
    last.current = t;
    const { h } = box.current;
    parts.current = parts.current.filter((p) => {
      p.age += f;
      p.vx *= p.drag ** f;
      p.vy = p.vy * p.drag ** f + 0.24 * f;
      p.ph += p.vp * f;
      p.x += (p.vx + Math.sin(p.ph * 0.5) * 0.7) * f;
      p.y += p.vy * f;
      p.rot += p.vr * f;
      return p.age < p.life && p.y < h + 60;
    });
    draw(ctx);
    if (parts.current.length) raf.current = requestAnimationFrame(tick);
    else {
      raf.current = 0;
      last.current = 0;
      ctx.clearRect(0, 0, box.current.w, box.current.h);
    }
  };

  const start = () => {
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  useImperativeHandle(ref, () => ({
    burst({ x, y, angle = -90, spread = 60, power = 24, count = 60, hearts = false }) {
      for (let i = 0; i < count; i++) parts.current.push(make(x, y, angle, spread, power, hearts));
      start();
    },
    rain(count = 60, ms = 1800) {
      for (let i = 0; i < count; i++) {
        timers.current.push(
          setTimeout(() => {
            const p = make(rnd(0, box.current.w), -14, 90, 40, 3, false);
            parts.current.push(p);
            start();
          }, (i / count) * ms),
        );
      }
    },
    size: () => box.current,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = parent.getBoundingClientRect();
      box.current = { w: width, h: height };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
});

export default Confetti;
