/**
 * ─────────────────────────────────────────────────────────────
 *  WEDDING DATA — the single source of truth.
 *  Edit this file and the whole invitation updates.
 *  Nothing wedding-specific is hardcoded inside components.
 *
 *  • Dates are ISO-8601 with the venue's UTC offset (India = +05:30).
 *    Weekday / month / time text is *derived*, never typed by hand.
 *  • Images live in /public/images. The bundled .svg files are
 *    placeholders — drop in your own .jpg/.webp and update the paths.
 *  • Distances in `places` are illustrative placeholders.
 * ─────────────────────────────────────────────────────────────
 */

const TZ_OFFSET = "+05:30";
const at = (date, time) => `${date}T${time}:00${TZ_OFFSET}`;

export const weddingData = {
  /* ── Site / SEO ─────────────────────────────────────────── */
  site: {
    // Set to your deployed URL so WhatsApp / social previews use an absolute og:image.
    url: "",
    ogImage: "/images/og.jpg",
    description:
      "Together with their families, Meenakshi & Arjun invite you to celebrate their wedding on 17 December 2026 in Chennai.",
  },
  timezone: "Asia/Kolkata",
  locale: "en-IN",

  /* ── The couple ─────────────────────────────────────────── */
  bride: {
    name: "Meenakshi",
    parents: "Mr. & Mrs. Subramanian Iyer",
    tagline: "A quiet light, a bright laugh, and the kindest heart we know.",
    image: "/images/bride.png",
    alt: "Portrait of the bride",
  },
  groom: {
    name: "Arjun",
    parents: "Mr. & Mrs. Rajesh Krishnan",
    tagline: "Steady, gentle, and forever making the ordinary feel like a celebration.",
    image: "/images/groom.png",
    alt: "Portrait of the groom",
  },
  couple: {
    heroImage: "/images/hero-couple.svg",
    heroAlt: "The couple standing together under a temple archway",
    // Cartoon couple standing in the hero arch (transparent WebP). Replace with your own illustration.
    heroCartoon: "/images/couple-cartoon.png",
    heroCartoonAlt: "Illustration of the bride and groom in traditional red and gold, holding hands",
    closingImage: "/images/closing-couple.svg",
    closingAlt: "The couple at golden hour",
  },

  /* ── Opening / invitation copy ──────────────────────────── */
  invitation: {
    blessing: "With the blessings of our families",
    headline: "We are getting married",
    cta: "Open Invitation",
    heroKicker: "Together with their families",
  },

  /* ── The wedding itself ─────────────────────────────────── */
  wedding: {
    startsAt: at("2026-12-17", "09:00"), // drives the countdown + hero date
    venue: "Sri Venkateswara Kalyana Mandapam",
    address: "24, Kutchery Road, Mylapore, Chennai, Tamil Nadu 600004",
    city: "Chennai",
    // Paste a Google Maps share link here. If empty, a search link is built from venue + address.
    mapsUrl: "",
    image: "/images/ceremony.png",
    imageAlt: "The wedding venue lit at dusk",
    ceremonyImage: "/images/ceremony.png", // full-bleed backdrop for "The Wedding Ceremony"
    landmarks: ["Kapaleeshwarar Temple · 0.9 km", "Mylapore Tank · 1.2 km", "Marina Beach · 3.4 km"],
  },

  /* ── Message ────────────────────────────────────────────── */
  message: {
    lines: [
      "Two hearts,",
      "one beautiful journey,",
      "and a lifetime of memories waiting to be created.",
    ],
    signature: "— Meenakshi & Arjun",
  },

  /* ── Our story ──────────────────────────────────────────── */
  story: [
    {
      year: "2020",
      title: "First Meeting",
      text: "A crowded family wedding, a shared plate of sweets, and a conversation that refused to end.",
      image: "/images/story-1.png",
      alt: "A memory from the day they first met",
    },
    {
      year: "2021",
      title: "First Conversation",
      text: "Long calls across two cities. Filter coffee, bad jokes, and the slow discovery of home in a voice.",
      image: "/images/story-2.png",
      alt: "Two cups of filter coffee on a balcony",
    },
    {
      year: "2023",
      title: "A Beautiful Beginning",
      text: "Two families met, two hearts said yes, and the rest of the world quietly made room for us.",
      image: "/images/story-3.png",
      alt: "The couple on their engagement day",
    },
    {
      year: "2026",
      title: "Forever Begins",
      text: "Under the mandapam, before the ones we love most, we take the seven steps together.",
      image: "/images/story-4.png",
      alt: "The couple beneath a floral mandapam",
    },
  ],

  /* ── Events ─────────────────────────────────────────────── */
  // icon → one of: haldi | mehendi | wedding | reception  (see components/ui/EventIcon.jsx)
  events: [
    {
      id: "haldi",
      title: "Haldi",
      icon: "haldi",
      start: at("2026-12-12", "10:00"),
      end: at("2026-12-12", "13:00"),
      venue: "Meenakshi Illam",
      address: "12, Ramakrishna Mutt Road, Mylapore, Chennai 600004",
      description:
        "A morning of turmeric, laughter and blessings from the elders — come dressed in soft yellows.",
      mapsUrl: "",
    },
    {
      id: "mehendi",
      title: "Mehendi",
      icon: "mehendi",
      start: at("2026-12-13", "16:00"),
      end: at("2026-12-13", "20:00"),
      venue: "The Courtyard at Alwarpet",
      address: "8, C.P. Ramaswamy Road, Alwarpet, Chennai 600018",
      description:
        "An evening of henna, music and sweets beneath fairy lights. Henna artists will be on hand for guests.",
      mapsUrl: "",
    },
    {
      id: "wedding",
      title: "Wedding Ceremony",
      icon: "wedding",
      featured: true,
      start: at("2026-12-17", "09:00"),
      end: at("2026-12-17", "13:00"),
      venue: "Sri Venkateswara Kalyana Mandapam",
      address: "24, Kutchery Road, Mylapore, Chennai, Tamil Nadu 600004",
      description:
        "The muhurtham at 9:00 AM — the sacred fire, the seven steps, the thali. Followed by a traditional lunch.",
      mapsUrl: "",
    },
    {
      id: "reception",
      title: "Reception",
      icon: "reception",
      start: at("2026-12-18", "18:30"),
      end: at("2026-12-18", "22:30"),
      venue: "The Grand Ballroom, Hotel Crown",
      address: "Cathedral Road, Gopalapuram, Chennai 600086",
      description:
        "An evening of dinner, music and dancing to celebrate the newly married couple.",
      mapsUrl: "",
    },
  ],

  /* ── Gallery ─────────────────────────────────────────────── */
  // width/height = intrinsic ratio, used to reserve space (no layout jumps).
  gallery: [
    { src: "/images/gallery-1.svg", alt: "Bride and groom holding hands at sunset", width: 800, height: 1040 },
    { src: "/images/gallery-2.svg", alt: "A quiet moment beneath jasmine garlands", width: 800, height: 800 },
    { src: "/images/gallery-3.svg", alt: "Wedding rings resting on silk", width: 800, height: 1100 },
    { src: "/images/gallery-4.svg", alt: "The couple laughing together", width: 800, height: 640 },
    { src: "/images/gallery-5.svg", alt: "Bride's hands adorned with henna", width: 800, height: 960 },
    { src: "/images/gallery-6.svg", alt: "Groom adjusting his angavastram", width: 800, height: 1000 },
    { src: "/images/gallery-7.svg", alt: "Temple lamps glowing at dusk", width: 800, height: 720 },
    { src: "/images/gallery-8.svg", alt: "The couple walking through a garden", width: 800, height: 1120 },
  ],

  /* ── Places to explore ───────────────────────────────────── */
  places: [
    {
      id: "temple",
      category: "Temple",
      title: "Kapaleeshwarar Temple",
      description: "A 7th-century Shiva temple with a soaring, sculpted gopuram — beautiful at dawn.",
      distance: "0.9 km",
      image: "/images/place-temple.svg",
      alt: "The gopuram of a South Indian temple",
      query: "Kapaleeshwarar Temple, Mylapore, Chennai",
    },
    {
      id: "beach",
      category: "Beach",
      title: "Marina Beach",
      description: "One of the longest urban beaches in the world. Go at sunrise, or for evening sundal.",
      distance: "3.4 km",
      image: "/images/place-beach.svg",
      alt: "Waves rolling onto Marina Beach at sunrise",
      query: "Marina Beach, Chennai",
    },
    {
      id: "heritage",
      category: "Heritage",
      title: "Fort St. George",
      description: "The 1644 fort that gave Chennai its beginning, now a museum of the city's story.",
      distance: "6.8 km",
      image: "/images/place-fort.svg",
      alt: "The ramparts of a historic fort",
      query: "Fort St. George, Chennai",
    },
    {
      id: "food",
      category: "Famous Food",
      title: "Mylapore Tiffin Trail",
      description: "Crisp dosai, ghee pongal and a proper filter coffee — the neighbourhood's morning ritual.",
      distance: "0.6 km",
      image: "/images/place-food.svg",
      alt: "A South Indian tiffin plate with dosa and chutneys",
      query: "Mylapore famous tiffin restaurants, Chennai",
    },
    {
      id: "shopping",
      category: "Shopping",
      title: "T. Nagar & Pondy Bazaar",
      description: "Silk sarees, gold jewellery and temple-town bargains — a shopper's paradise.",
      distance: "5.1 km",
      image: "/images/place-shopping.svg",
      alt: "A busy street of silk and jewellery shops",
      query: "Pondy Bazaar, T. Nagar, Chennai",
    },
  ],

  /* ── Guest guide ─────────────────────────────────────────── */
  guide: [
    {
      id: "dress",
      icon: "shirt",
      title: "Dress Code",
      body: "Traditional attire is warmly encouraged — silk sarees, dhotis and kurtas, lehengas and sherwanis.",
      items: [
        "Haldi — soft yellows and pastels",
        "Mehendi — greens, corals and festive colours",
        "Wedding — rich silks in jewel tones (please avoid black and white)",
        "Reception — formal or Indo-western",
      ],
    },
    {
      id: "travel",
      icon: "plane",
      title: "Travel Information",
      body: "Chennai International Airport (MAA) is about 40 minutes from the venue; Chennai Central is 20 minutes away.",
      items: [
        "App-based cabs are available around the clock",
        "Pickups from the airport and station can be arranged — let us know your arrival time in the RSVP message",
        "December is pleasant: expect 22–29°C",
      ],
    },
    {
      id: "stay",
      icon: "bed",
      title: "Accommodation",
      body: "Blocks of rooms are held for our guests at the properties below. Please mention the wedding when booking.",
      items: [
        "Hotel Crown, Gopalapuram — 2.6 km from the venue",
        "The Mylapore Residency — 0.8 km from the venue",
        "Room blocks are held until 15 November 2026",
      ],
    },
    {
      id: "parking",
      icon: "car",
      title: "Parking",
      body: "Complimentary valet parking is available at every event.",
      items: [
        "The mandapam has basement parking for around 120 cars",
        "For larger groups, shuttles run from Kutchery Road every 15 minutes",
      ],
    },
    {
      id: "contact",
      icon: "phone",
      title: "Contact Information",
      body: "For anything at all, our families will be delighted to help.",
      contacts: [
        { label: "Bride's family", name: "Mr. Subramanian Iyer", phone: "+91 98400 12345" },
        { label: "Groom's family", name: "Mr. Rajesh Krishnan", phone: "+91 98410 67890" },
      ],
    },
    {
      id: "emergency",
      icon: "siren",
      title: "Emergency Contact",
      body: "On the day of the celebrations, our coordination desk is available around the clock.",
      contacts: [{ label: "Wedding helpdesk", name: "Coordinator — Priya", phone: "+91 98420 24680" }],
    },
  ],

  /* ── RSVP ────────────────────────────────────────────────── */
  rsvp: {
    heading: "We would love to celebrate with you",
    subheading: "Kindly let us know by 15 November 2026",
    // Connect a backend later: set to a URL that accepts a JSON POST (see src/lib/rsvp.js).
    // While empty, responses are only saved in this browser (localStorage) for testing.
    endpoint: "",
    maxGuests: 10,
    meals: [
      { value: "veg", label: "Vegetarian" },
      { value: "jain", label: "Jain" },
      { value: "non-veg", label: "Non-vegetarian" },
    ],
  },

  /* ── Music ───────────────────────────────────────────────── */
  music: {
    // Replace with your own track (mp3/ogg). The bundled file is a small generated placeholder.
    src: "/audio/ambient-invitation.wav",
    title: "Wedding music",
    // Starts only from the user's "Open Invitation" tap (a user gesture), never on page load.
    playOnOpen: true,
    volume: 0.5,
  },

  /* ── Thank you ───────────────────────────────────────────── */
  thankYou: {
    title: "Thank You",
    lines: ["For being a part of our journey.", "Your presence will make our celebration even more special."],
    signoff: "With Love,",
  },

  /* ── Navigation ──────────────────────────────────────────── */
  // `primary` items show in the desktop pill; every item shows in the mobile menu.
  nav: [
    { id: "home", label: "Home", primary: true },
    { id: "story", label: "Story", primary: true },
    { id: "countdown", label: "Countdown" },
    { id: "events", label: "Events", primary: true },
    { id: "gallery", label: "Gallery", primary: true },
    { id: "venue", label: "Venue", primary: true },
    { id: "explore", label: "Explore" },
    { id: "guide", label: "Guest Guide" },
    { id: "rsvp", label: "RSVP", primary: true },
  ],
};

export default weddingData;
