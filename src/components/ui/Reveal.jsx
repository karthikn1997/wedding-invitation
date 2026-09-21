import { createElement } from "react";
import { motion } from "framer-motion";
import { fadeUp, blurIn, scaleIn, inView } from "../../lib/motion";

const VARIANTS = { up: fadeUp, blur: blurIn, scale: scaleIn };

/** Generic scroll reveal wrapper. `variant` = up | blur | scale */
export default function Reveal({ as = "div", variant = "up", delay = 0, y, className = "", children, ...rest }) {
  const make = VARIANTS[variant] || fadeUp;
  const MotionTag = motion[as] || motion.div;
  return createElement(MotionTag, { className, ...inView(make(delay, y)), ...rest }, children);
}
