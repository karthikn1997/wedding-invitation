# Wedding Invitation

A cinematic, mobile-first digital wedding invitation — React + Vite + Tailwind CSS v4 + Framer Motion + Lucide.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## Make it yours — one file

**Everything wedding-specific lives in [`src/data/weddingData.js`](src/data/weddingData.js).**
Names, parents, dates, events, venue, story, gallery, places, guest guide, RSVP options, music, nav.

| To change… | Edit |
| --- | --- |
| Names, parents, taglines | `bride`, `groom` |
| Wedding date/time + countdown target | `wedding.startsAt` (ISO with UTC offset, e.g. `2026-12-17T09:00:00+05:30`) |
| Events (Haldi, Mehendi…) | `events[]` — start/end ISO, venue, address, description |
| Google Maps link | `wedding.mapsUrl` (blank → auto-built from venue + address) |
| Photos | drop files in `public/images/` and update the paths |
| Music | `music.src` (mp3/ogg) — plays only after the guest taps **Open Invitation** or the music button |
| RSVP backend | `rsvp.endpoint` (JSON `POST`), or edit `src/lib/rsvp.js` |

Weekdays and month names are **derived from the dates** (never typed), so they can't contradict each other.
(17 Dec 2026 is a Thursday.)

### Placeholders
Images and music are generated placeholders. Regenerate with `npm run generate:assets`, or just replace the files.
For social/WhatsApp previews, replace `public/images/og.jpg` (1200×630) and set `site.url` in the data file
so `og:image` is absolute.

## Architecture

```
src/
  data/weddingData.js        ← single source of truth
  lib/                       motion presets, date formatting, maps, calendar (.ics), rsvp transport
  hooks/                     countdown, scroll lock, active section, music, reduced-motion
  components/
    ui/                      GoldDivider · FloralCorner · PetalAnimation · GoldParticles ·
                             SectionHeading · AnimatedImage · RevealText · Reveal · Ornaments
    sections/                Hero · Message · Couple · Story · Countdown · Events · Ceremony ·
                             Venue · Gallery · Places · Guide · RSVP · ThankYou
    Opening · Navigation · CountdownTimer · WeddingEventCard · TimelineItem · GalleryCard ·
    Lightbox · Accordion · PlaceCard · MapPreview · AddToCalendar · RSVPForm ·
    FloatingMusicButton · AmbientLayer
```

### Animation strategy
- One vocabulary in `lib/motion.js`: expo-out easing, 0.9–1.6 s durations, shared reveal variants.
- Only `transform`, `opacity`, `clip-path` and (sparingly) small blur are animated.
- Scroll-**triggered** reveals fire once (`whileInView`); scroll-**linked** effects (message lines, timeline thread, parallax, closing fade) use `useScroll`.
- Falling petals / gold dust / sparkles are pure CSS keyframes (no JS per frame) and thinned on phones.
- The hero renders *behind* the entrance doors, so opening the invitation reveals a live scene.
- Reduced motion: `MotionConfig reducedMotion="user"` + a CSS media query. The opening shows instantly, sticky scroll scenes become static, ambient effects are hidden.

### Dev shortcuts (stripped from production builds)
- `/?skip` — jump past the entrance
- `/?fullmotion` — force full animation even if your OS has animations turned off
