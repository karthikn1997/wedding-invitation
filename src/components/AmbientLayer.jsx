import PetalAnimation from "./ui/PetalAnimation";

/**
 * A whisper of falling petals over the whole page — a handful only, low opacity,
 * fixed to the viewport so it costs one compositor layer regardless of page length.
 */
export default function AmbientLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[15]" aria-hidden="true" data-ambient>
      <PetalAnimation count={6} palette="mixed" seed={101} opacity={0.4} />
    </div>
  );
}
