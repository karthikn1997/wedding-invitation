/**
 * Downloads the "Places to explore" photographs from Wikimedia Commons (openly licensed) and crops
 * them to the card's 4:5 shape → public/images/place-<id>.jpg
 *
 *   node scripts/fetch-place-photos.mjs
 *
 * To use your own photos instead, save them as public/images/place-<id>.jpg (4:5, ~900px wide) and
 * remove the matching `credit` entry in src/data/weddingData.js.
 * Attribution required by the licences is shown in the section (see `credit` in weddingData.js).
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
const UA = "WeddingInvitationBuilder/1.0 (https://commons.wikimedia.org/wiki/Commons:Bots)";

const PHOTOS = [
  { id: "temple", file: "Kapaleeswarar Temple, Mylapore, Chennai.jpg", width: 1200, position: "north" },
  { id: "beach", file: "Sunrise at Marina.jpg", width: 900, position: "centre" },
  { id: "heritage", file: "Fort St. George, Chennai 2.jpg", width: 2500, position: "centre" },
  { id: "food", file: "The South Indian Tiffin(Breakfast).jpg", width: 900, position: "centre" },
  { id: "shopping", file: "Diwali Urban Shopping, Thiyagaraja Nagar, Chennai.jpg", width: 2000, position: "centre" },
];

const api = async (params) => {
  const res = await fetch("https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({ format: "json", ...params }), { headers: { "User-Agent": UA } });
  return res.json();
};

for (const p of PHOTOS) {
  const data = await api({ action: "query", titles: `File:${p.file}`, prop: "imageinfo", iiprop: "url", iiurlwidth: String(p.width) });
  const info = Object.values(data.query.pages)[0].imageinfo[0];
  const buf = Buffer.from(await (await fetch(info.thumburl, { headers: { "User-Agent": UA } })).arrayBuffer());
  const meta = await sharp(buf).metadata();
  const cropW = Math.min(meta.width, Math.floor(meta.height * 0.8));
  const outW = Math.min(900, cropW);
  const outH = Math.round(outW * 1.25);
  await sharp(buf).resize(outW, outH, { fit: "cover", position: p.position }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, `place-${p.id}.jpg`));
  console.log(`✓ place-${p.id}.jpg  ${outW}×${outH}  ← ${p.file}`);
}
