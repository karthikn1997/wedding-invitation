import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import weddingData from "./data/weddingData";
import { InvitationContext } from "./context/InvitationContext";
import { useMusic } from "./hooks/useMusic";
import { useScrollLock } from "./hooks/useScrollLock";
import { useDocumentMeta } from "./hooks/useDocumentMeta";
import { FORCE_FULL_MOTION } from "./hooks/useReducedMotion";

import Opening from "./components/Opening";
import Navigation from "./components/Navigation";
import AmbientLayer from "./components/AmbientLayer";
import FloatingMusicButton from "./components/FloatingMusicButton";

import Hero from "./components/sections/Hero";
import Message from "./components/sections/Message";
import Couple from "./components/sections/Couple";
import Story from "./components/sections/Story";
import Countdown from "./components/sections/Countdown";
import Events from "./components/sections/Events";
import Ceremony from "./components/sections/Ceremony";
import Venue from "./components/sections/Venue";
import Gallery from "./components/sections/Gallery";
import Places from "./components/sections/Places";
import Guide from "./components/sections/Guide";
import RSVP from "./components/sections/RSVP";
import ThankYou from "./components/sections/ThankYou";

const { music } = weddingData;

export default function App() {
  // dev-only shortcut (stripped from production builds): /?skip jumps past the entrance
  const skip = import.meta.env.DEV && new URLSearchParams(window.location.search).has("skip");
  const [opened, setOpened] = useState(skip); // tapped "Open Invitation"
  const [entered, setEntered] = useState(skip); // doors finished — overlay removed
  const player = useMusic(music);

  useDocumentMeta();
  useScrollLock(!entered);

  const handleOpen = useCallback(() => {
    setOpened(true);
    // the tap is a user gesture, so audio is allowed to start here (and only here)
    if (music.playOnOpen) player.play();
  }, [player]);

  const ctx = useMemo(() => ({ opened }), [opened]);

  return (
    <MotionConfig reducedMotion={FORCE_FULL_MOTION ? "never" : "user"}>
      <InvitationContext.Provider value={ctx}>
        {/* inert keeps keyboard / screen-reader focus on the entrance until it's gone */}
        <main inert={!entered}>
          <Hero />
          <Message />
          <Couple />
          <Story />
          <Countdown />
          {/* <Events /> */}
          <Ceremony />
          <Venue />
          <Gallery />
          <Places />
          <Guide />
          {/* <RSVP /> */}
          <ThankYou />
        </main>

        {entered && <AmbientLayer />}
        <Navigation visible={entered} />
        <FloatingMusicButton visible={entered} playing={player.playing} unavailable={player.unavailable} onToggle={player.toggle} label={music.title} />

        <AnimatePresence>{!entered && <Opening key="opening" onOpen={handleOpen} onDone={() => setEntered(true)} />}</AnimatePresence>
      </InvitationContext.Provider>
    </MotionConfig>
  );
}
