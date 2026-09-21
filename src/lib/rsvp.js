import weddingData from "../data/weddingData";

const STORAGE_KEY = "wedding-rsvp-responses";

/**
 * RSVP transport — the ONLY place that knows how responses are delivered.
 *
 * To connect a backend, set `rsvp.endpoint` in weddingData.js to a URL that
 * accepts a JSON POST (Google Apps Script, Formspree, Supabase edge function,
 * your own API…). Or replace the body of this function entirely.
 *
 * payload: { name, phone, guests, attending, meal, message, submittedAt }
 * Resolves on success, throws on failure.
 */
export async function submitRSVP(payload) {
  const body = { ...payload, submittedAt: new Date().toISOString() };
  const { endpoint } = weddingData.rsvp;

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`RSVP request failed (${res.status})`);
    return res.headers.get("content-type")?.includes("json") ? res.json() : { ok: true };
  }

  // Demo mode: no backend configured — keep responses locally so the flow can be tested.
  await new Promise((r) => setTimeout(r, 1100));
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, body]));
  } catch {
    /* storage unavailable (private mode) — ignore in demo */
  }
  return { ok: true, demo: true };
}
