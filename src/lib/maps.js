const enc = encodeURIComponent;

/** Google Maps search for a free-text query. */
export const searchUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${enc(query)}`;

/** Turn-by-turn directions to a destination. */
export const directionsUrl = (destination) =>
  `https://www.google.com/maps/dir/?api=1&destination=${enc(destination)}`;

/**
 * Prefer an explicitly configured link; otherwise build one from venue + address.
 * `mode` = "view" opens the place, "directions" starts navigation.
 */
export const resolveMapsUrl = ({ mapsUrl, venue, address }, mode = "view") => {
  if (mapsUrl) return mapsUrl;
  const query = [venue, address].filter(Boolean).join(", ");
  return mode === "directions" ? directionsUrl(query) : searchUrl(query);
};
