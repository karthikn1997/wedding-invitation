import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Background music controller. The <audio> element is created lazily on the first
 * user gesture (never on load) and fades in gently. `src` is configurable in weddingData.
 */
export function useMusic({ src, volume = 0.5 }) {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(!src);

  const ensure = useCallback(() => {
    if (audioRef.current || !src) return audioRef.current;
    const a = new Audio();
    a.src = src;
    a.loop = true;
    a.preload = "none";
    a.addEventListener("play", () => setPlaying(true));
    a.addEventListener("pause", () => setPlaying(false));
    a.addEventListener("error", () => {
      setUnavailable(true);
      setPlaying(false);
    });
    audioRef.current = a;
    return a;
  }, [src]);

  const fadeTo = useCallback((target, ms = 1800) => {
    const a = audioRef.current;
    if (!a) return;
    clearInterval(fadeRef.current);
    const start = a.volume;
    const t0 = performance.now();
    fadeRef.current = setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / ms);
      a.volume = Math.max(0, Math.min(1, start + (target - start) * p));
      if (p >= 1) clearInterval(fadeRef.current);
    }, 60);
  }, []);

  const play = useCallback(async () => {
    const a = ensure();
    if (!a) return;
    try {
      a.volume = 0;
      await a.play();
      fadeTo(volume);
    } catch {
      /* autoplay blocked or file missing — the button stays available to retry */
    }
  }, [ensure, fadeTo, volume]);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    clearInterval(fadeRef.current);
    a.pause();
  }, []);

  const toggle = useCallback(() => (audioRef.current && !audioRef.current.paused ? pause() : play()), [pause, play]);

  useEffect(
    () => () => {
      clearInterval(fadeRef.current);
      audioRef.current?.pause();
    },
    [],
  );

  return { playing, unavailable, play, pause, toggle };
}
