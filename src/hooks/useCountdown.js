import { useEffect, useState } from "react";

const compute = (target) => {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: diff === 0,
  };
};

/** Real-time countdown; re-syncs on tab focus so it never drifts after a background pause. */
export function useCountdown(target) {
  const [t, setT] = useState(() => compute(target));

  useEffect(() => {
    const tick = () => setT(compute(target));
    tick();
    const id = setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [target]);

  return t;
}
