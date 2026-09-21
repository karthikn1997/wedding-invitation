import { Flower2, Hand, Flame, Sparkles, Shirt, Plane, BedDouble, Car, Phone, Siren, Heart } from "lucide-react";

const ICONS = {
  haldi: Flower2,
  mehendi: Hand,
  wedding: Flame,
  reception: Sparkles,
  shirt: Shirt,
  plane: Plane,
  bed: BedDouble,
  car: Car,
  phone: Phone,
  siren: Siren,
  heart: Heart,
};

/** Name → lucide icon. Unknown names fall back to a heart. */
export default function EventIcon({ name, ...props }) {
  const Icon = ICONS[name] || Heart;
  return <Icon strokeWidth={1.25} aria-hidden="true" {...props} />;
}
