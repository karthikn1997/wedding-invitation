// Usage: node scripts/optimize-couple.mjs <source.png>
// Trims transparent margins, resizes and writes public/images/couple-cartoon.webp (keeps alpha).
import sharp from "sharp";
const src = process.argv[2];
if (!src) throw new Error("Pass the source PNG path");
const out = new URL("../public/images/couple-cartoon.webp", import.meta.url);
const trimmed = await sharp(src).trim().toBuffer();
await sharp(trimmed).resize({ width: 1100, height: 1100, fit: "inside" }).webp({ quality: 88, alphaQuality: 92 }).toFile(out.pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const m = await sharp(out.pathname.replace(/^\/([A-Za-z]:)/, "$1")).metadata();
console.log(m.width, "x", m.height);
