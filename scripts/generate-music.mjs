/**
 * Synthesises a small, seamlessly-looping placeholder track (veena-like plucks in Raga Mohanam
 * over a soft tanpura drone) into /public/audio. Replace with your own song and update
 * `music.src` in weddingData.js.
 *
 *   npm run generate:assets
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { seeded } from "../src/lib/random.js";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio");
mkdirSync(OUT, { recursive: true });

const SR = 16000;
const DUR = 32; // seconds — every frequency is snapped to a multiple of 1/DUR Hz so the loop is click-free
const N = SR * DUR;
const buf = new Float32Array(N);
const rand = seeded(2026);

const snap = (f) => Math.round(f * DUR) / DUR;
const TWO_PI = Math.PI * 2;

// Tanpura-like drone: Sa – Pa – Sa – Sa, slowly breathing
const drone = [
  [snap(130.81), 0.09],
  [snap(196.0), 0.07],
  [snap(261.63), 0.05],
  [snap(65.41), 0.07],
];
for (let i = 0; i < N; i++) {
  const t = i / SR;
  let v = 0;
  drone.forEach(([f, a], k) => {
    const breathe = 0.65 + 0.35 * Math.sin(TWO_PI * (t / DUR) * (k + 2));
    v += a * breathe * (Math.sin(TWO_PI * f * t) + 0.35 * Math.sin(TWO_PI * f * 2 * t) + 0.15 * Math.sin(TWO_PI * f * 3 * t));
  });
  buf[i] = v * 0.6;
}

// Raga Mohanam (C D E G A) across two octaves
const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
const hz = (semi) => snap(261.63 * 2 ** (semi / 12));

const pluck = (start, f, amp, len = 3.4) => {
  const s0 = Math.floor(start * SR);
  const L = Math.floor(len * SR);
  for (let i = 0; i < L; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 1.7) * Math.min(1, t * 200);
    const v = amp * env * (Math.sin(TWO_PI * f * t) + 0.5 * Math.sin(TWO_PI * f * 2 * t) * Math.exp(-t * 2) + 0.25 * Math.sin(TWO_PI * f * 3.01 * t) * Math.exp(-t * 3.5));
    buf[(s0 + i) % N] += v; // wrap so the tail flows into the start of the loop
  }
};

// a gentle, ascending-and-returning phrase, then a variation
const phrase = [0, 1, 2, 3, 4, 3, 2, 1, 0, 2, 3, 2, 4, 5, 4, 3];
let pos = 0;
let idx = 0;
while (pos < DUR - 0.4) {
  const step = phrase[idx % phrase.length];
  const swing = idx % 4 === 3 ? 0.9 : 0.5;
  pluck(pos, hz(scale[step % scale.length]), 0.16 + rand() * 0.05);
  if (idx % 8 === 0) pluck(pos, hz(scale[step % scale.length] - 12), 0.1, 4.2); // low octave anchor
  pos += 0.5 + swing * 0.5 + (idx % 4 === 3 ? 0.5 : 0);
  idx++;
}

// normalise + write 16-bit PCM WAV
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(buf[i]));
const gain = 0.82 / peak;
const pcm = Buffer.alloc(44 + N * 2);
pcm.write("RIFF", 0);
pcm.writeUInt32LE(36 + N * 2, 4);
pcm.write("WAVEfmt ", 8);
pcm.writeUInt32LE(16, 16);
pcm.writeUInt16LE(1, 20);
pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 2, 28);
pcm.writeUInt16LE(2, 32);
pcm.writeUInt16LE(16, 34);
pcm.write("data", 36);
pcm.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(buf[i] * gain * 32767))), 44 + i * 2);
writeFileSync(join(OUT, "ambient-invitation.wav"), pcm);
console.log(`✓ ambient-invitation.wav (${(pcm.length / 1024 / 1024).toFixed(2)} MB)`);
