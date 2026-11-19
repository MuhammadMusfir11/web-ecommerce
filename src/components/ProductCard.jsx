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
    <article className="group flex h-full flex-col rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-ink/5 transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-card">
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
              className="h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
            />
          )}
        </Link>

        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-sale px-2 py-0.5 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
          aria-label="Simpan ke wishlist"
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white"
        >
          <Heart size={16} className={liked ? "fill-sale text-sale" : "text-ink/70"} />
        </motion.button>
      </div>

      <div className="mt-3 flex flex-1 flex-col px-1 pb-1">
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 block min-h-[2.5rem] text-sm font-semibold leading-snug transition-colors hover:text-accent"
        >
          {product.name}
        </Link>
        <p className="mt-0.5 text-xs font-medium text-ink/50">{product.category}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            <p className="font-display text-[15px] font-bold leading-tight">{formatRupiah(product.price)}</p>
            <p className="h-4 text-xs leading-4 text-ink/40 line-through">
              {product.oldPrice ? formatRupiah(product.oldPrice) : "\u00A0"}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => onAdd?.(product)}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-white transition-colors hover:bg-accent-dark"
          >
            <ShoppingBag size={17} />
          </motion.button>
        </div>
      </div>
    </article>
  );
}