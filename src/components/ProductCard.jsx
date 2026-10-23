import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { formatRupiah } from "../data/products";

export default function ProductCard({ product, onAdd }) {
  const [liked, setLiked] = useState(false);
  const [broken, setBroken] = useState(false);

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-card">
        <Link
          to={`/product/${product.id}`}
          aria-label={`Lihat ${product.name}`}
          className="absolute inset-0"
        >
          {broken ? (
            <span className="grid h-full w-full place-items-center font-display text-5xl font-bold text-ink/15">
              {initials}
            </span>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setBroken(true)}
              className="h-full w-full object-contain p-2 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
              />
          )}
        </Link>

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label="Simpan ke wishlist"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 backdrop-blur transition hover:bg-white"
        >
          <Heart size={17} className={liked ? "fill-accent text-accent" : ""} />
        </motion.button>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs font-medium text-ink/50">{product.category}</p>
        <Link
          to={`/product/${product.id}`}
          className="mt-0.5 line-clamp-2 block min-h-[2.5rem] text-sm font-semibold leading-snug transition-colors hover:text-accent"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="min-w-0">
            <p className="font-display text-base font-bold">{formatRupiah(product.price)}</p>
            <p className="h-4 text-xs leading-4 text-ink/40 line-through">
              {product.oldPrice ? formatRupiah(product.oldPrice) : "\u00A0"}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => onAdd?.(product)}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-accent"
          >
            <ShoppingBag size={17} />
          </motion.button>
        </div>
      </div>
    </article>
  );
}