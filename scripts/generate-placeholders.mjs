/**
 * Generates lightweight illustrated SVG placeholders into /public/images
 * (plus og.jpg for social previews). Replace any of them with real photos:
 * just drop a .jpg/.webp in /public/images and point weddingData.js at it.
 *
 *   npm run generate:assets
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { seeded, range } from "../src/lib/random.js";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(OUT, { recursive: true });

/* ── palettes ─────────────────────────────────────────────── */
const P = {
  dusk: ["#1d0609", "#5c1727", "#b8514a", "#f0b56b"],
  dawn: ["#2b1230", "#8a3a5a", "#dd8a6a", "#f7d59a"],
  night: ["#0e0406", "#2a0a12", "#4f1425", "#8a4a3a"],
  temple: ["#2a0c12", "#7a2a30", "#d8823f", "#f9d48a"],
  sea: ["#1a1f36", "#6a3a55", "#e08a5c", "#ffd79a"],
  day: ["#f6e3b4", "#efc98a", "#d9985a", "#b5643a"],
  ivory: ["#f6ecd6", "#ead6ad", "#d6b477", "#a97c3a"],
  wine: ["#30070f", "#6b1526", "#a83a44", "#e8a06a"],
};

const svg = (w, h, body, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">` +
  `<defs>${defs}</defs>${body}</svg>`;

const grad = (id, stops, vertical = true) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops
    .map((c, i) => `<stop offset="${(i / (stops.length - 1)).toFixed(2)}" stop-color="${c}"/>`)
    .join("")}</linearGradient>`;
const radial = (id, color, o = 0.9) =>
  `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${o}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;

/* ── building blocks ──────────────────────────────────────── */
const sky = (w, h, pal, id = "sky") => ({ defs: grad(id, pal.slice(0, 4)), body: `<rect width="${w}" height="${h}" fill="url(#${id})"/>` });
const glow = (id, cx, cy, r, color = "#ffd58a", o = 0.85) => ({
  defs: radial(id, color, o),
  body: `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`,
});
const bokeh = (rand, w, h, n, colors = ["#f0d28a", "#f7e6bf", "#e3a96a"]) =>
  Array.from({ length: n }, () => {
    const r = range(rand, 3, 16);
    return `<circle cx="${range(rand, 0, w).toFixed(0)}" cy="${range(rand, 0, h * 0.85).toFixed(0)}" r="${r.toFixed(1)}" fill="${colors[Math.floor(rand() * colors.length)]}" opacity="${range(rand, 0.1, 0.5).toFixed(2)}"/>`;
  }).join("");
const stringLights = (w, y, n = 14, sag = 26) =>
  `<path d="M0 ${y} Q ${w / 2} ${y + sag} ${w} ${y}" fill="none" stroke="#c39c47" stroke-opacity=".6" stroke-width="1.5"/>` +
  Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    const x = t * w;
    const yy = y + 2 * sag * t * (1 - t) * 1; // quadratic bezier y at t (control at y+sag*2 → mid = y+sag)
    return `<circle cx="${x.toFixed(0)}" cy="${(yy + 6).toFixed(0)}" r="5" fill="#ffe2a0"/><circle cx="${x.toFixed(0)}" cy="${(yy + 6).toFixed(0)}" r="14" fill="#ffd58a" opacity=".22"/>`;
  }).join("");

/** Temple gateway silhouette. */
const gopuram = (cx, baseY, height, color) => {
  const s = height / 320;
  let out = `<g transform="translate(${cx - 120 * s} ${baseY - 320 * s}) scale(${s})" fill="${color}">`;
  out += `<path fill-rule="evenodd" d="M8 320V244h224V320h-84v-38a28 28 0 0 0-56 0v38z"/>`;
  for (let i = 0; i < 7; i++) {
    const w = 196 - i * 25;
    const y = 244 - 24 * (i + 1) - i * 3;
    const x = 120 - w / 2;
    out += `<rect x="${x}" y="${y}" width="${w}" height="24"/><rect x="${x - 6}" y="${y + 21}" width="${w + 12}" height="5"/><rect x="${x + 4}" y="${y - 8}" width="9" height="9" rx="1.5"/><rect x="${x + w - 13}" y="${y - 8}" width="9" height="9" rx="1.5"/>`;
  }
  out += `<path d="M92 70c0-22 12-32 28-32s28 10 28 32z"/><rect x="114" y="18" width="12" height="20" rx="3"/><circle cx="120" cy="14" r="5"/><path d="M120 0l3 9h-6z"/></g>`;
  return out;
};

/** Standing figures as silhouettes. kind: groom | bride */
const figure = (x, baseY, s, kind, color = "#160407") => {
  const g = (inner) => `<g transform="translate(${x} ${baseY}) scale(${s})" fill="${color}">${inner}</g>`;
  if (kind === "groom") {
    return g(
      `<circle cx="0" cy="-292" r="21"/>` + // head
        `<path d="M-9 -274h18v16h-18z"/>` + // neck
        `<path d="M-46 -255c0-8 10-13 24-14h44c14 1 24 6 24 14l10 92c1 8-4 12-10 12h-8l-4 110h-24l-4-98h-8l-4 98h-24l-4-110h-8c-6 0-11-4-10-12z"/>` + // kurta + legs
        `<path d="M-46 -255l-30 92 14 4 34-84z"/><path d="M46 -255l30 92-14 4-34-84z"/>` + // arms
        `<path d="M-18 -262l18 40 18-40z" fill="#c39c47" opacity=".7"/>`, // angavastram
    );
  }
  return g(
    `<circle cx="0" cy="-286" r="19"/><circle cx="-2" cy="-306" r="10"/>` + // head + bun
      `<path d="M-8 -268h16v16h-16z"/>` +
      `<path d="M-38 -250c0-8 10-12 22-13h32c12 1 22 5 22 13l6 60c30 20 46 80 52 190h-192c6-110 22-170 52-190z"/>` + // sari body
      `<path d="M22 -258c30 10 44 46 40 92l-14 4c2-34-8-62-30-74z" opacity=".95"/>` + // pallu
      `<path d="M-14 -262q14 20 28 0" fill="none" stroke="#c39c47" stroke-width="3" opacity=".8"/>`,
  );
};

const mandapam = (w, baseY, top, color, inner = "#c39c47") => {
  const cx = w / 2;
  const pw = w * 0.07;
  const span = w * 0.62;
  const left = cx - span / 2;
  const right = cx + span / 2;
  return (
    `<g fill="${color}">` +
    `<rect x="${left - pw / 2}" y="${top + 120}" width="${pw}" height="${baseY - top - 120}"/>` +
    `<rect x="${right - pw / 2}" y="${top + 120}" width="${pw}" height="${baseY - top - 120}"/>` +
    `<path d="M${left - pw} ${top + 130} Q ${cx} ${top - 90} ${right + pw} ${top + 130} L ${right + pw} ${top + 100} Q ${cx} ${top - 130} ${left - pw} ${top + 100}Z"/>` +
    `<rect x="${left - pw * 1.2}" y="${baseY - 14}" width="${span + pw * 2.4}" height="14"/>` +
    `</g>` +
    `<path d="M${left} ${top + 128} Q ${cx} ${top - 70} ${right} ${top + 128}" fill="none" stroke="${inner}" stroke-opacity=".55" stroke-width="2"/>`
  );
};

const waves = (w, y, colors, rand) =>
  colors
    .map((c, i) => {
      const yy = y + i * 34;
      const amp = 10 + i * 4;
      let d = `M0 ${yy}`;
      for (let x = 0; x <= w; x += 80) d += ` Q ${x + 40} ${yy + (i % 2 ? amp : -amp)} ${x + 80} ${yy}`;
      return `<path d="${d} V 2000 H0Z" fill="${c}" opacity="${0.9 - i * 0.05}"/>`;
    })
    .join("");

const diyas = (w, y, n, rand) =>
  Array.from({ length: n }, (_, i) => {
    const x = ((i + 0.5) / n) * w;
    const yy = y + (rand() - 0.5) * 30;
    return (
      `<circle cx="${x.toFixed(0)}" cy="${(yy - 14).toFixed(0)}" r="34" fill="#ffd58a" opacity=".25"/>` +
      `<path d="M${x} ${yy - 30}c8 10 10 18 0 26-10-8-8-16 0-26z" fill="#ffe3a3"/>` +
      `<path d="M${x - 24} ${yy}c2 16 12 24 24 24s22-8 24-24z" fill="#8a3a1f"/>`
    );
  }).join("");

const garlandTop = (w, n, rand, y0 = 0) =>
  `<path d="${Array.from({ length: n }, (_, i) => `${i ? "L" : "M"}${(i / (n - 1)) * w} ${y0 + 20 + Math.sin((i / (n - 1)) * Math.PI) * 30}`).join(" ")}" stroke="#c39c47" stroke-opacity=".6" fill="none"/>` +
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return `<circle cx="${(t * w).toFixed(0)}" cy="${(y0 + 20 + Math.sin(t * Math.PI) * 30).toFixed(0)}" r="${(w * 0.018).toFixed(1)}" fill="${i % 2 ? "#e8b955" : "#dba13b"}"/>`;
  }).join("");

/* ── compose helper ───────────────────────────────────────── */
function compose(w, h, pal, seed, layers) {
  const rand = seeded(seed);
  const s = sky(w, h, pal);
  let defs = s.defs;
  let body = s.body;
  for (const layer of layers) {
    const r = layer({ w, h, rand, pal });
    if (r.defs) defs += r.defs;
    body += r.body;
  }
  return svg(w, h, body, defs);
}
const L = (fn) => fn;
const L_glow = (id, cx, cy, r, color, o) => ({ w, h }) => glow(id, cx(w, h), cy(w, h), r(w, h), color, o);
const L_bokeh = (n, colors) => ({ w, h, rand }) => ({ body: bokeh(rand, w, h, n, colors) });
const L_ground = (y, c0, c1, id = "gr") => ({ w, h }) => ({
  defs: grad(id, [c0, c1]),
  body: `<rect y="${y(h)}" width="${w}" height="${h - y(h)}" fill="url(#${id})"/>`,
});
const L_raw = (fn) => ({ w, h, rand }) => ({ body: fn(w, h, rand) });
const vignette = ({ w, h }) => ({
  defs: `<radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>`,
  body: `<rect width="${w}" height="${h}" fill="url(#vg)"/>`,
});

/* ── portrait busts ───────────────────────────────────────── */
function portrait(kind, seed) {
  const w = 800;
  const h = 1000;
  const bride = kind === "bride";
  const pal = bride ? P.dawn : P.dusk;
  return compose(w, h, pal, seed, [
    L_glow("g1", (w) => w / 2, (w, h) => h * 0.42, (w) => w * 0.62, "#ffd58a", 0.7),
    L_bokeh(26),
    L_raw((w, h) => {
      const cx = w / 2;
      let s = "";
      // shoulders / torso
      s += `<path d="M${cx - 330} ${h}C${cx - 320} ${h - 210} ${cx - 210} ${h - 300} ${cx - 90} ${h - 330}L${cx + 90} ${h - 330}C${cx + 210} ${h - 300} ${cx + 320} ${h - 210} ${cx + 330} ${h}Z" fill="${bride ? "#7a1830" : "#2a1410"}"/>`;
      // neck
      s += `<path d="M${cx - 56} ${h - 400}h112v90c-30 30-82 30-112 0z" fill="#a8703f"/>`;
      // head
      s += `<ellipse cx="${cx}" cy="${h - 520}" rx="118" ry="146" fill="#b47a46"/>`;
      // hair
      if (bride) {
        s += `<path d="M${cx - 128} ${h - 520}c-8-110 52-170 128-170s136 60 128 170c-20-70-60-100-128-100s-108 30-128 100z" fill="#1a0a08"/>`;
        s += `<circle cx="${cx}" cy="${h - 690}" r="6" fill="#c39c47"/><path d="M${cx} ${h - 688}v38" stroke="#c39c47" stroke-width="2"/>`;
        // jasmine garland along the hair
        s += Array.from({ length: 9 }, (_, i) => `<circle cx="${cx - 96 + i * 24}" cy="${h - 640 - Math.sin((i / 8) * Math.PI) * 26}" r="7" fill="#fdf6e4"/>`).join("");
        // necklace
        s += `<path d="M${cx - 96} ${h - 330}Q${cx} ${h - 250} ${cx + 96} ${h - 330}" fill="none" stroke="#e8c777" stroke-width="7"/>`;
        s += `<circle cx="${cx}" cy="${h - 262}" r="12" fill="#f0dca8"/>`;
        // bindi
        s += `<circle cx="${cx}" cy="${h - 566}" r="6" fill="#a11a2c"/>`;
      } else {
        s += `<path d="M${cx - 122} ${h - 540}c-4-80 40-118 122-118s126 38 122 118c-14-44-52-64-122-64s-108 20-122 64z" fill="#150907"/>`;
        // angavastram
        s += `<path d="M${cx - 250} ${h - 300}l250 190 250-190v-30l-250 170-250-170z" fill="#e8c777" opacity=".9"/>`;
        // tilak
        s += `<path d="M${cx} ${h - 590}v26" stroke="#b1252f" stroke-width="7" stroke-linecap="round"/>`;
      }
      return s;
    }),
    vignette,
  ]);
}

/* ── couple scenes ────────────────────────────────────────── */
function coupleScene(w, h, pal, seed, opts = {}) {
  return compose(w, h, pal, seed, [
    L_glow("g1", (w) => w / 2, (w, h) => h * 0.5, (w) => w * 0.75, "#ffd58a", 0.75),
    L_bokeh(34),
    L_raw((w, h) => gopuram(w / 2, h * ((opts.baseY ?? 0.87) - 0.05), h * 0.44, "#1a060b").replace('fill="#1a060b"', 'fill="#1a060b" opacity=".55"')),
    L_raw((w) => stringLights(w, 40, 12, 22)),
    L_ground((h) => h * ((opts.baseY ?? 0.87) - 0.04), "#2a0a12", "#12040a"),
    L_raw((w, h) => {
      const s = (h / 1600) * 1.02;
      return figure(w * 0.4, h * (opts.baseY ?? 0.87), s * (opts.scale ?? 1), "groom") + figure(w * 0.6, h * (opts.baseY ?? 0.87), s * (opts.scale ?? 1), "bride");
    }),
    vignette,
  ]);
}

/* ── generic scenes ───────────────────────────────────────── */
const SCENES = {
  venue: () =>
    compose(1000, 1250, P.temple, 5, [
      L_glow("g1", (w) => w / 2, (w, h) => h * 0.55, (w) => w * 0.7, "#ffd58a", 0.8),
      L_bokeh(30),
      L_raw((w, h) => mandapam(w, h * 0.86, h * 0.2, "#150509") + stringLights(w, 30, 16, 30)),
      L_raw((w, h, r) => diyas(w, h * 0.9, 9, r)),
      L_ground((h) => h * 0.9, "#2a0a12", "#12040a"),
      vignette,
    ]),
  ceremony: () =>
    compose(1600, 1000, P.wine, 8, [
      L_glow("g1", (w) => w / 2, (w, h) => h * 0.62, (w) => w * 0.5, "#ffb95a", 0.85),
      L_bokeh(40, ["#f0d28a", "#e3a96a", "#f7e6bf"]),
      L_raw((w, h) => mandapam(w, h * 0.9, h * 0.1, "#12040a")),
      L_raw((w, h) => {
        const cx = w / 2;
        const y = h * 0.86;
        return (
          `<circle cx="${cx}" cy="${y - 50}" r="120" fill="#ffb95a" opacity=".25"/>` +
          `<path d="M${cx} ${y - 170}c40 60 44 100 0 130-44-30-40-70 0-130z" fill="#ffd58a"/>` +
          `<path d="M${cx} ${y - 120}c20 30 22 50 0 66-22-16-20-36 0-66z" fill="#f08a2c"/>` +
          `<path d="M${cx - 90} ${y - 10}h180l-24 20h-132z" fill="#8a3a1f"/>`
        );
      }),
      vignette,
    ]),
  storyMeet: () =>
    compose(900, 675, P.dusk, 21, [
      L_glow("g1", (w) => w * 0.5, (w, h) => h * 0.4, (w) => w * 0.55, "#ffd58a", 0.65),
      L_bokeh(40),
      L_raw((w) => stringLights(w, 30, 10, 26)),
      L_ground((h) => h * 0.82, "#2a0a12", "#12040a"),
      L_raw((w, h) => figure(w * 0.3, h * 0.9, 0.42, "groom") + figure(w * 0.7, h * 0.9, 0.42, "bride")),
      vignette,
    ]),
  storyCall: () =>
    compose(900, 675, P.dawn, 22, [
      L_glow("g1", (w) => w * 0.7, (w, h) => h * 0.3, (w) => w * 0.5, "#ffe3a3", 0.8),
      L_raw((w, h) => {
        const cup = (x, y) =>
          `<ellipse cx="${x}" cy="${y + 90}" rx="120" ry="20" fill="#1c0a0c" opacity=".5"/><path d="M${x - 78} ${y}h156l-16 90c-3 14-14 22-28 22h-68c-14 0-25-8-28-22z" fill="#f6ecd6"/><path d="M${x + 78} ${y + 18}c34 0 34 44-8 48" fill="none" stroke="#f6ecd6" stroke-width="10"/><ellipse cx="${x}" cy="${y}" rx="78" ry="14" fill="#6b3a1e"/>`;
        const steam = (x, y) => `<path d="M${x} ${y}c-14-24 14-38 0-64M${x + 30} ${y}c-14-24 14-38 0-64" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>`;
        return `<rect y="${h * 0.7}" width="${w}" height="${h * 0.3}" fill="#3a1418"/>` + cup(w * 0.36, h * 0.6) + cup(w * 0.64, h * 0.6) + steam(w * 0.36, h * 0.55) + steam(w * 0.64, h * 0.55);
      }),
      vignette,
    ]),
  storyRing: () =>
    compose(900, 675, P.wine, 23, [
      L_glow("g1", (w) => w * 0.5, (w, h) => h * 0.5, (w) => w * 0.45, "#ffd58a", 0.7),
      L_bokeh(30),
      L_raw((w, h) => {
        const ring = (x) => `<circle cx="${x}" cy="${h * 0.55}" r="86" fill="none" stroke="url(#gold)" stroke-width="18"/><circle cx="${x}" cy="${h * 0.55 - 92}" r="16" fill="#fff4d6"/>`;
        return `<defs>${grad("gold", ["#f6e8bf", "#c39c47", "#8a6a25"])}</defs>` + ring(w * 0.44) + ring(w * 0.58);
      }),
      vignette,
    ]),
  storyMandap: () => SCENES.ceremony().replace(/width="1600" height="1000"/, 'width="900" height="675"'),
  templePlace: () =>
    compose(640, 800, P.temple, 31, [
      L_glow("g1", (w) => w / 2, (w, h) => h * 0.5, (w) => w * 0.8, "#ffd58a", 0.75),
      L_raw((w, h) => gopuram(w / 2, h * 0.98, h * 0.82, "#1a060b")),
      L_bokeh(12),
    ]),
  beachPlace: () =>
    compose(640, 800, P.sea, 32, [
      L_glow("g1", (w) => w / 2, (w, h) => h * 0.5, (w) => w * 0.55, "#ffe3a3", 0.95),
      L_raw((w, h, r) => `<circle cx="${w / 2}" cy="${h * 0.52}" r="60" fill="#fff0c4"/>` + waves(w, h * 0.56, ["#7a4a5e", "#4f3049", "#2f1e3a", "#1a1226"], r)),
    ]),
  fortPlace: () =>
    compose(640, 800, P.dawn, 33, [
      L_glow("g1", (w) => w * 0.7, (w, h) => h * 0.42, (w) => w * 0.5, "#ffe3a3", 0.9),
      L_raw((w, h) => {
        const y = h * 0.62;
        let s = `<rect y="${y}" width="${w}" height="${h - y}" fill="#3a1418"/>`;
        s += `<path d="M0 ${y}` + Array.from({ length: 14 }, (_, i) => `h${w / 14 / 2}v-30h${w / 14 / 2}v30`).join("") + `V${h}H0Z" fill="#2a0c12"/>`;
        s += `<rect x="${w * 0.36}" y="${y - 170}" width="${w * 0.28}" height="170" fill="#2a0c12"/><path d="M${w * 0.34} ${y - 170}` + Array.from({ length: 6 }, () => `h${(w * 0.32) / 12}v-22h${(w * 0.32) / 12}v22`).join("") + `Z" fill="#2a0c12"/>`;
        s += `<path d="M${w * 0.46} ${y}v-70a${w * 0.04} ${w * 0.04} 0 0 1 ${w * 0.08} 0v70z" fill="#0e0406"/><path d="M${w * 0.5} ${y - 170}v-90" stroke="#2a0c12" stroke-width="4"/><path d="M${w * 0.5} ${y - 260}h60v30h-60z" fill="#c39c47" opacity=".8"/>`;
        return s;
      }),
    ]),
  foodPlace: () =>
    compose(640, 800, P.day, 34, [
      L_raw((w, h) => {
        const cx = w / 2;
        const cy = h * 0.52;
        return (
          `<rect width="${w}" height="${h}" fill="#3a1418" opacity=".12"/>` +
          `<circle cx="${cx}" cy="${cy}" r="250" fill="#f6ecd6"/><circle cx="${cx}" cy="${cy}" r="226" fill="none" stroke="#c39c47" stroke-width="3"/>` +
          `<path d="M${cx - 160} ${cy + 40}q160-260 320 0z" fill="#e0a75c"/><path d="M${cx - 160} ${cy + 40}q160-260 320 0" fill="none" stroke="#b5732f" stroke-width="5"/>` +
          [-140, 140].map((dx, i) => `<circle cx="${cx + dx}" cy="${cy + 130 - i * 10}" r="${44 + i * 6}" fill="${i ? "#c14b2e" : "#7a9a52"}"/>`).join("") +
          `<circle cx="${cx}" cy="${cy + 150}" r="34" fill="#f3d9a0"/>`
        );
      }),
    ]),
  shoppingPlace: () =>
    compose(640, 800, P.wine, 35, [
      L_glow("g1", (w) => w / 2, (w, h) => h * 0.4, (w) => w * 0.7, "#ffd58a", 0.5),
      L_bokeh(30),
      L_raw((w, h, r) => {
        const cols = ["#dba13b", "#c97580", "#f3e7cf", "#b1252f", "#7a9a52"];
        let s = `<path d="M0 60Q${w / 2} 150 ${w} 60" stroke="#c39c47" fill="none" stroke-width="2"/>`;
        for (let i = 0; i < 9; i++) {
          const t = (i + 0.5) / 9;
          const x = t * w;
          const y = 60 + Math.sin(t * Math.PI) * 45;
          s += `<path d="M${x - 24} ${y}h48l-24 60z" fill="${cols[i % cols.length]}"/>`;
        }
        // shopfronts
        for (let i = 0; i < 4; i++) {
          const x = i * (w / 4) + 10;
          const ww = w / 4 - 20;
          const hh = 260 + (i % 2) * 70;
          s += `<rect x="${x}" y="${h - hh}" width="${ww}" height="${hh}" fill="#160509"/><rect x="${x + 14}" y="${h - hh + 30}" width="${ww - 28}" height="${hh * 0.4}" fill="#f0b56b" opacity=".85"/>`;
          s += `<path d="M${x + 14} ${h - hh + 30 + hh * 0.4}h${ww - 28}v${hh * 0.34}h-${ww - 28}z" fill="${cols[(i + 1) % cols.length]}" opacity=".85"/>`;
        }
        return s;
      }),
      vignette,
    ]),
  // gallery vignettes
  galHands: (w, h) =>
    compose(w, h, P.ivory, 41, [
      L_raw((w, h) => {
        const cx = w / 2;
        let s = `<path d="M${cx - 120} ${h}V${h * 0.5}c0-60 40-80 60-40l0-90c0-24 40-24 40 0v-30c0-24 40-24 40 0v10c0-22 40-22 40 4v110c40-10 60 20 40 60l-50 110c-10 30-20 40-20 60z" fill="#c68a55"/>`;
        for (let i = 0; i < 26; i++) {
          const x = cx - 40 + (i % 6) * 22;
          const y = h * 0.52 + Math.floor(i / 6) * 34;
          s += `<circle cx="${x}" cy="${y}" r="5" fill="#6b1d10" opacity=".85"/>`;
        }
        s += `<path d="M${cx - 60} ${h * 0.6}c40-40 90-40 140 0" fill="none" stroke="#6b1d10" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 12"/>`;
        return s;
      }),
    ]),
  galLamps: (w, h) =>
    compose(w, h, P.night, 42, [
      L_glow("g1", (w) => w / 2, (w, h) => h * 0.7, (w) => w * 0.7, "#ffb95a", 0.55),
      L_bokeh(40),
      L_raw((w, h, r) => gopuram(w / 2, h * 0.7, h * 0.5, "#160509") + diyas(w, h * 0.86, 7, r)),
    ]),
  galRings: (w, h) => SCENES.storyRing().replace(/width="900" height="675"/, `width="${w}" height="${h}"`),
  galCouple: (w, h, seed, pal) => coupleScene(w, h, pal, seed, { scale: 0.9 }),
};

/* ── manifest ─────────────────────────────────────────────── */
const files = {
  "hero-couple.svg": () => coupleScene(1200, 1600, P.dusk, 1, { baseY: 0.6, scale: 1.05 }),
  "closing-couple.svg": () => coupleScene(1200, 1600, P.dawn, 2, { baseY: 0.62, scale: 1 }),
  "bride.svg": () => portrait("bride", 3),
  "groom.svg": () => portrait("groom", 4),
  "venue.svg": SCENES.venue,
  "ceremony.svg": SCENES.ceremony,
  "story-1.svg": SCENES.storyMeet,
  "story-2.svg": SCENES.storyCall,
  "story-3.svg": SCENES.storyRing,
  "story-4.svg": SCENES.storyMandap,
  "place-temple.svg": SCENES.templePlace,
  "place-beach.svg": SCENES.beachPlace,
  "place-fort.svg": SCENES.fortPlace,
  "place-food.svg": SCENES.foodPlace,
  "place-shopping.svg": SCENES.shoppingPlace,
  "gallery-1.svg": () => coupleScene(800, 1040, P.dusk, 11, { scale: 0.95 }),
  "gallery-2.svg": () => SCENES.galLamps(800, 800),
  "gallery-3.svg": () => SCENES.galRings(800, 1100),
  "gallery-4.svg": () => coupleScene(800, 640, P.dawn, 14, { scale: 0.62 }),
  "gallery-5.svg": () => SCENES.galHands(800, 960),
  "gallery-6.svg": () => portrait("groom", 16).replace('width="800" height="1000"', 'width="800" height="1000"'),
  "gallery-7.svg": () => SCENES.galLamps(800, 720),
  "gallery-8.svg": () => coupleScene(800, 1120, P.wine, 18, { scale: 0.98 }),
};

for (const [name, make] of Object.entries(files)) writeFileSync(join(OUT, name), make());
console.log(`✓ ${Object.keys(files).length} placeholder images → public/images`);

/* ── Open Graph image (JPEG, for WhatsApp / social previews) ─ */
try {
  const { default: sharp } = await import("sharp");
  const og = svg(
    1200,
    630,
    `<rect width="1200" height="630" fill="url(#bg)"/>` +
      `<circle cx="600" cy="315" r="290" fill="none" stroke="#c39c47" stroke-opacity=".5" stroke-width="2"/>` +
      `<circle cx="600" cy="315" r="270" fill="none" stroke="#c39c47" stroke-opacity=".25" stroke-width="1" stroke-dasharray="2 8"/>` +
      `<rect x="24" y="24" width="1152" height="582" fill="none" stroke="#c39c47" stroke-opacity=".55" stroke-width="2"/>` +
      `<text x="600" y="176" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="34" fill="#f0e2bd">Together with their families</text>` +
      `<text x="600" y="330" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="112" fill="url(#gold)">Arjun</text>` +
      `<text x="600" y="400" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="60" fill="#d6b56b">&amp;</text>` +
      `<text x="600" y="500" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="112" fill="url(#gold)">Meenakshi</text>` +
      `<text x="600" y="570" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" letter-spacing="6" fill="#f0e2bd">17 DECEMBER 2026 · CHENNAI</text>`,
    `<radialGradient id="bg" cx=".5" cy=".5" r=".8"><stop offset="0" stop-color="#5a1526"/><stop offset="1" stop-color="#24080d"/></radialGradient>` + grad("gold", ["#f6e8bf", "#d6b56b", "#b58d3c"]),
  );
  await sharp(Buffer.from(og)).jpeg({ quality: 88, mozjpeg: true }).toFile(join(OUT, "og.jpg"));
  console.log("✓ og.jpg");
} catch (e) {
  console.warn("! Skipped og.jpg (sharp unavailable):", e.message);
}
