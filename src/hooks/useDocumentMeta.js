import { useEffect } from "react";
import weddingData from "../data/weddingData";

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

/** Keeps <title> and social metadata in sync with weddingData so index.html never drifts from the config. */
export function useDocumentMeta() {
  useEffect(() => {
    const { bride, groom, site } = weddingData;
    const title = `Wedding Invitation | ${bride.name} & ${groom.name}`;
    const abs = (p) => (site.url ? new URL(p, site.url).toString() : p);
    document.title = title;
    setMeta('meta[name="description"]', "content", site.description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", site.description);
    setMeta('meta[property="og:image"]', "content", abs(site.ogImage));
    if (site.url) {
      const og = document.createElement("meta");
      og.setAttribute("property", "og:url");
      og.setAttribute("content", site.url);
      document.head.appendChild(og);
    }
  }, []);
}
