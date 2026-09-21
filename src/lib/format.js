import weddingData from "../data/weddingData";

const { timezone } = weddingData;

const fmt = (iso, opts) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: timezone, ...opts }).format(new Date(iso));

/** "17 December 2026" */
export const formatDate = (iso) => fmt(iso, { day: "numeric", month: "long", year: "numeric" });
/** "17 December" */
export const formatDayMonth = (iso) => fmt(iso, { day: "numeric", month: "long" });
/** "Thursday" — derived, so it can never contradict the date. */
export const formatWeekday = (iso) => fmt(iso, { weekday: "long" });
/** "9:00 AM" */
export const formatTime = (iso) => fmt(iso, { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase();
/** "9:00 AM – 1:00 PM" */
export const formatTimeRange = (start, end) => (end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start));
/** "THURSDAY, 17 DECEMBER 2026" */
export const formatFullDate = (iso) => `${formatWeekday(iso)}, ${formatDate(iso)}`.toUpperCase();
/** "17 · 12 · 2026" */
export const formatNumericDate = (iso) => {
  const d = fmt(iso, { day: "2-digit", month: "2-digit", year: "numeric" });
  return d.split("/").join(" · ");
};
