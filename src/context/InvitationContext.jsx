import { createContext, useContext } from "react";

/** `opened` flips true the moment the guest taps "Open Invitation" — hero animations key off it. */
export const InvitationContext = createContext({ opened: false });
export const useInvitation = () => useContext(InvitationContext);
