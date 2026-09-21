import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Minus, Plus } from "lucide-react";
import weddingData from "../data/weddingData";
import { submitRSVP } from "../lib/rsvp";
import { EASE, SPRING_POP } from "../lib/motion";
import PetalAnimation from "./ui/PetalAnimation";
import GoldParticles from "./ui/GoldParticles";
import { Lotus } from "./ui/Ornaments";

const { rsvp } = weddingData;

const INITIAL = { name: "", phone: "", attending: "yes", guests: 1, meal: rsvp.meals[0]?.value ?? "", message: "" };

const validate = (v) => {
  const errors = {};
  if (v.name.trim().length < 2) errors.name = "Please tell us your name.";
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) errors.phone = "Please enter a valid phone number.";
  return errors;
};

const labelClass = "eyebrow mb-1 block text-[0.64rem] text-gold-700";
const inputClass =
  "w-full border-0 border-b border-gold-500/50 bg-transparent px-0 py-3 font-display text-[1.35rem] text-maroon-900 placeholder:text-cocoa-700/40 transition-colors focus:border-gold-700 focus:outline-none focus:ring-0 aria-[invalid=true]:border-rose-700";

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error && (
        <motion.p id={`${id}-error`} role="alert" className="mt-1.5 text-[0.8rem] text-rose-800" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          {error}
        </motion.p>
      )}
    </div>
  );
}

/** Big tappable choice card (radio semantics). */
function Choice({ checked, onChange, name, value, children }) {
  return (
    <label
      className={`relative flex min-h-14 cursor-pointer items-center justify-center rounded-lg border px-3 py-3 text-center text-[0.9rem] transition-all duration-500 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-400 ${
        checked ? "border-maroon-900 bg-maroon-900 text-gold-200 shadow-[0_10px_24px_-10px_rgba(58,13,21,0.6)]" : "border-gold-500/45 text-maroon-900 hover:border-gold-600 hover:bg-gold-500/10"
      }`}
    >
      <input type="radio" className="sr-only" name={name} value={value} checked={checked} onChange={onChange} />
      {children}
    </label>
  );
}

function Success({ name, attending, onReset }) {
  return (
    <motion.div
      key="success"
      className="relative flex min-h-[26rem] flex-col items-center justify-center overflow-hidden px-6 py-14 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      role="status"
    >
      <PetalAnimation count={14} palette="rose" seed={91} className="opacity-90" />
      <GoldParticles count={12} sparkles={5} seed={17} tone="text-gold-600" />
      <div className="relative">
        <motion.span className="absolute inset-0 rounded-full border border-gold-500/60" initial={{ scale: 0.6, opacity: 0.8 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 2, ease: "easeOut", delay: 0.6 }} />
        <svg viewBox="0 0 100 100" className="h-28 w-28" fill="none" aria-hidden="true">
          <motion.circle cx="50" cy="50" r="46" stroke="#c39c47" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: EASE }} />
          <motion.circle cx="50" cy="50" r="40" stroke="#c39c47" strokeWidth=".6" strokeDasharray="1 3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} />
          <motion.path d="M32 52l14 14 24-30" stroke="#86651f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.7 }} />
        </svg>
      </div>
      <motion.h3 className="mt-7 font-display text-4xl font-light text-maroon-900 sm:text-5xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 1 }}>
        {attending ? "Thank you" : "We'll miss you"}, {name.split(" ")[0]}
      </motion.h3>
      <motion.p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed font-light text-cocoa-700" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 1.2 }}>
        {attending ? "Your RSVP is confirmed. We can't wait to celebrate with you." : "Thank you for letting us know. You'll be in our hearts on the day."}
      </motion.p>
      <motion.button type="button" onClick={onReset} className="btn-ghost mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
        Add another response
      </motion.button>
    </motion.div>
  );
}

/** RSVP form. Delivery is delegated to lib/rsvp.js — swap that module to connect a backend. */
export default function RSVPForm() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState("");

  const attending = values.attending === "yes";
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const setGuests = (n) => setValues((v) => ({ ...v, guests: Math.min(rsvp.maxGuests, Math.max(1, n)) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0] === "name" ? "rsvp-name" : "rsvp-phone")?.focus();
      return;
    }
    setStatus("submitting");
    setSubmitError("");
    try {
      await submitRSVP({
        name: values.name.trim(),
        phone: values.phone.trim(),
        attending,
        guests: attending ? values.guests : 0,
        meal: attending ? values.meal : null,
        message: values.message.trim(),
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setSubmitError("Something went wrong sending your RSVP. Please try again in a moment.");
    }
  };

  const reset = () => {
    setValues(INITIAL);
    setErrors({});
    setStatus("idle");
  };

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <Success key="success" name={values.name} attending={attending} onReset={reset} />
      ) : (
        <motion.form key="form" onSubmit={onSubmit} noValidate className="space-y-8 p-7 sm:p-12" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
          <Field id="rsvp-name" label="Your name" error={errors.name}>
            <input id="rsvp-name" name="name" type="text" autoComplete="name" required placeholder="Full name" value={values.name} onChange={set("name")} className={inputClass} aria-invalid={!!errors.name} aria-describedby={errors.name ? "rsvp-name-error" : undefined} />
          </Field>

          <Field id="rsvp-phone" label="Phone number" error={errors.phone}>
            <input id="rsvp-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+91 98765 43210" value={values.phone} onChange={set("phone")} className={inputClass} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "rsvp-phone-error" : undefined} />
          </Field>

          <fieldset>
            <legend className={labelClass}>Will you attend?</legend>
            <div className="mt-2 grid grid-cols-2 gap-3" role="radiogroup">
              <Choice name="attending" value="yes" checked={attending} onChange={set("attending")}>
                Joyfully attending
              </Choice>
              <Choice name="attending" value="no" checked={!attending} onChange={set("attending")}>
                Regretfully declining
              </Choice>
            </div>
          </fieldset>

          <AnimatePresence initial={false}>
            {attending && (
              <motion.div key="attending-fields" className="space-y-8 overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}>
                <div className="pt-1">
                  <span id="guests-label" className={labelClass}>
                    Number of guests
                  </span>
                  <div className="mt-2 flex items-center gap-5" role="group" aria-labelledby="guests-label">
                    <button type="button" onClick={() => setGuests(values.guests - 1)} disabled={values.guests <= 1} aria-label="Fewer guests" className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/55 text-maroon-900 transition-colors hover:bg-gold-500/15 disabled:opacity-35">
                      <Minus size={18} strokeWidth={1.5} />
                    </button>
                    <span className="w-10 text-center font-display text-4xl text-maroon-900" aria-live="polite" style={{ fontVariantNumeric: "lining-nums" }}>
                      {values.guests}
                    </span>
                    <button type="button" onClick={() => setGuests(values.guests + 1)} disabled={values.guests >= rsvp.maxGuests} aria-label="More guests" className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/55 text-maroon-900 transition-colors hover:bg-gold-500/15 disabled:opacity-35">
                      <Plus size={18} strokeWidth={1.5} />
                    </button>
                    <span className="text-[0.8rem] font-light text-cocoa-700">including you</span>
                  </div>
                </div>

                <fieldset>
                  <legend className={labelClass}>Meal preference</legend>
                  <div className="mt-2 grid gap-3 sm:grid-cols-3" role="radiogroup">
                    {rsvp.meals.map((m) => (
                      <Choice key={m.value} name="meal" value={m.value} checked={values.meal === m.value} onChange={set("meal")}>
                        {m.label}
                      </Choice>
                    ))}
                  </div>
                </fieldset>
              </motion.div>
            )}
          </AnimatePresence>

          <Field id="rsvp-message" label="A message for the couple (optional)">
            <textarea id="rsvp-message" name="message" rows={3} placeholder="Blessings, wishes, or anything we should know…" value={values.message} onChange={set("message")} className={`${inputClass} resize-none text-[1.15rem]`} />
          </Field>

          {status === "error" && (
            <p role="alert" className="rounded-md border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {submitError}
            </p>
          )}

          <div className="pt-2 text-center">
            <button type="submit" className="btn-gold w-full sm:w-auto sm:min-w-64" disabled={status === "submitting"}>
              {status === "submitting" ? (
                <>
                  <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  <Lotus className="h-4 w-4" />
                  Confirm RSVP
                </>
              )}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
