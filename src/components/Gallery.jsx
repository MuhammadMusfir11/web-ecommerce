import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomIn } from "lucide-react";

function Pic({ src, alt, label, className }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <span className="grid h-full w-full place-items-center font-display text-6xl font-bold text-ink/15">
        {label}
      </span>
    );
  }
  return <img src={src} alt={alt} onError={() => setBroken(true)} className={className} />;
}

export default function Gallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const label = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      {images.length > 1 && (
        <div
          role="tablist"
          aria-label="Foto produk"
          className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
        >
          {images.map((src, i) => (
            <button
              key={src}
              role="tab"
              aria-selected={i === active}
              aria-label={`Foto ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-card transition sm:h-20 sm:w-20 ${
                i === active ? "ring-2 ring-accent" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Pic src={src} alt="" label={label} className="h-full w-full object-contain p-2" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom hanya aktif untuk mouse, di layar sentuh tidak mengganggu */}
      <div
        onPointerEnter={(e) => e.pointerType === "mouse" && setZoom(true)}
        onPointerLeave={() => setZoom(false)}
        onPointerMove={onMove}
        className="relative aspect-square flex-1 overflow-hidden rounded-3xl bg-card lg:cursor-zoom-in"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={images[active]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            <div
              className="h-full w-full transition-transform duration-200 ease-out"
              style={{ transform: zoom ? "scale(2)" : "scale(1)", transformOrigin: origin }}
            >
              <Pic
                src={images[active]}
                alt={name}
                label={label}
                className="object-contain p-4 mix-blend-multiply"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <span className="pointer-events-none absolute right-4 top-4 hidden h-9 w-9 place-items-center rounded-full bg-paper/90 lg:grid">
          <ZoomIn size={17} />
        </span>
      </div>
    </div>
  );
}