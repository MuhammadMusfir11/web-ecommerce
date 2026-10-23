import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCart } from "../context/CartContext";

// Muncul 3 detik setiap ada produk masuk keranjang
export default function Toast({ onOpenCart }) {
  const { lastAdded } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [lastAdded]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex justify-center px-4">
      <AnimatePresence>
        {visible && lastAdded && (
          <motion.div
            key={lastAdded.key}
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex max-w-full items-center gap-3 rounded-full bg-ink py-2 pl-2.5 pr-2 text-sm text-paper shadow-xl"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-white">
              <Check size={15} />
            </span>
            <span className="truncate">{lastAdded.product.name} masuk keranjang</span>
            <button
              onClick={() => {
                setVisible(false);
                onOpenCart();
              }}
              className="shrink-0 rounded-full bg-paper px-3.5 py-1.5 font-semibold text-ink transition hover:bg-accent hover:text-white"
            >
              Lihat
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}