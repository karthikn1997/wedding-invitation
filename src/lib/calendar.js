import weddingData from "../data/weddingData";

const toCompactUTC = (iso) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
const escapeICS = (s = "") => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

const fullTitle = (event) => `${event.title} — ${weddingData.bride.name} & ${weddingData.groom.name}`;
const location = (event) => [event.venue, event.address].filter(Boolean).join(", ");
// If an event has no end time, assume a 3-hour window.
const endOf = (event) => event.end || new Date(new Date(event.start).getTime() + 3 * 3600 * 1000).toISOString();

export const googleCalendarUrl = (event) => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: fullTitle(event),
    dates: `${toCompactUTC(event.start)}/${toCompactUTC(endOf(event))}`,
    details: event.description || "",
    location: location(event),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/** Builds an .ics file (Apple Calendar, Outlook, Android) and triggers a download. */
export const downloadICS = (event) => {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}-${toCompactUTC(event.start)}@wedding-invitation`,
    `DTSTAMP:${toCompactUTC(new Date().toISOString())}`,
    `DTSTART:${toCompactUTC(event.start)}`,
    `DTEND:${toCompactUTC(endOf(event))}`,
    `SUMMARY:${escapeICS(fullTitle(event))}`,
    `DESCRIPTION:${escapeICS(event.description || "")}`,
    `LOCATION:${escapeICS(location(event))}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
