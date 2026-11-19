import { Link } from "react-router-dom";
import {
  Smartphone,
  Laptop as LaptopIcon,
  Headphones,
  Plug,
  LayoutGrid,
  ShieldCheck,
  RotateCcw,
  Headset,
  BadgeCheck,
} from "lucide-react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { categories, products, formatRupiah } from "../data/products";

// Ikon dan warna per kategori
const categoryStyle = {
  HP: { icon: Smartphone, tone: "bg-accent-soft text-accent" },
  Laptop: { icon: LaptopIcon, tone: "bg-sage text-emerald-700" },
  Audio: { icon: Headphones, tone: "bg-blush text-rose-600" },
  Aksesori: { icon: Plug, tone: "bg-sand text-amber-700" },
};

// Teks bar kepercayaan: ubah sesuai kebijakan toko yang sebenarnya
const trust = [
  { icon: ShieldCheck, title: "Pembayaran aman", note: "Data transaksi terlindungi" },
  { icon: RotateCcw, title: "Garansi produk", note: "Sesuai ketentuan toko" },
  { icon: Headset, title: "Bantuan pelanggan", note: "Tanya stok dan spesifikasi" },
  { icon: BadgeCheck, title: "Produk asli", note: "Harga tertera jelas" },
];

const discountOf = (p) => Math.round((1 - p.price / p.oldPrice) * 100);

function SectionHeader({ title, to }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      {to && (
        <Link
          to={to}
          className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-accent shadow-sm ring-1 ring-ink/5 transition hover:bg-accent-soft"
        >
          Lihat semua
        </Link>
      )}
    </div>
  );
}

function PromoCard({ title, note, to, tone, product }) {
  return (
    <Link
      to={to}
      className={`flex min-h-32 w-[78%] shrink-0 snap-start items-center justify-between gap-2 overflow-hidden rounded-2xl p-4 sm:w-[46%] lg:w-auto ${tone}`}
    >
      <div className="min-w-0">
        <h3 className="font-display text-base font-bold">{title}</h3>
        <p className="mt-1 text-sm text-ink/70">{note}</p>
        <span className="mt-3 inline-block text-sm font-semibold text-accent">Lihat sekarang</span>
      </div>
      {product && (
        <img
          src={product.image}
          alt=""
          loading="lazy"
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="h-24 w-24 shrink-0 object-contain mix-blend-multiply"
        />
      )}
    </Link>
  );
}

export default function Home({ onAddToCart }) {
  const deals = products.filter((p) => p.oldPrice);
  const dealIds = new Set(deals.map((p) => p.id));
  const recommended = [
    ...products.filter((p) => p.featured),
    ...products.filter((p) => !p.featured),
  ]
    .filter((p) => !dealIds.has(p.id))
    .slice(0, 8);

  const pick = (cat) =>
    products.find((p) => p.category === cat && p.featured) ?? products.find((p) => p.category === cat);
  const cheapest = (cat) => Math.min(...products.filter((p) => p.category === cat).map((p) => p.price));

  const promoCards = [
    deals.length > 0 && {
      title: "Promo",
      note: `Diskon hingga ${Math.max(...deals.map(discountOf))}%`,
      to: "/products?promo=1",
      tone: "bg-blush",
      product: deals[0],
    },
    {
      title: "Laptop",
      note: `Mulai ${formatRupiah(cheapest("Laptop"))}`,
      to: "/products?kategori=Laptop",
      tone: "bg-sage",
      product: pick("Laptop"),
    },
    {
      title: "Audio",
      note: `Mulai ${formatRupiah(cheapest("Audio"))}`,
      to: "/products?kategori=Audio",
      tone: "bg-sand",
      product: pick("Audio"),
    },
  ].filter(Boolean);

  return (
    <>
      <Hero onAddToCart={onAddToCart} />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:space-y-10 lg:py-8">
        {/* Kategori */}
        <section aria-label="Kategori" className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink/5 sm:p-6">
          <ul className="grid grid-cols-5 gap-2 sm:gap-4">
            {categories.map((c) => {
              const { icon: Icon, tone } = categoryStyle[c];
              return (
                <li key={c}>
                  <Link
                    to={`/products?kategori=${c}`}
                    className="group flex flex-col items-center gap-2 text-center"
                  >
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-full transition-transform group-active:scale-95 sm:h-16 sm:w-16 ${tone}`}
                    >
                      <Icon size={26} strokeWidth={1.8} />
                    </span>
                    <span className="text-xs font-semibold sm:text-sm">{c}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <Link to="/products" className="group flex flex-col items-center gap-2 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-card transition-transform group-active:scale-95 sm:h-16 sm:w-16">
                  <LayoutGrid size={26} strokeWidth={1.8} />
                </span>
                <span className="text-xs font-semibold sm:text-sm">Semua</span>
              </Link>
            </li>
          </ul>
        </section>

        {/* Kartu promo: geser di HP, tiga kolom di laptop */}
        <section
          aria-label="Promo"
          className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0"
        >
          {promoCards.map((c) => (
            <PromoCard key={c.title} {...c} />
          ))}
        </section>

        {/* Diskon */}
        {deals.length > 0 && (
          <section aria-label="Diskon">
            <SectionHeader title="Diskon untuk Anda" to="/products?promo=1" />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {deals.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={onAddToCart} />
              ))}
            </div>
          </section>
        )}

        {/* Rekomendasi */}
        <section aria-label="Rekomendasi">
          <SectionHeader title="Rekomendasi untuk Anda" to="/products" />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {recommended.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={onAddToCart} />
            ))}
          </div>
        </section>

        {/* Bar kepercayaan */}
        <section
          aria-label="Layanan toko"
          className="grid grid-cols-2 gap-4 rounded-3xl bg-accent-soft p-5 sm:p-6 lg:grid-cols-4"
        >
          {trust.map(({ icon: Icon, title, note }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-accent shadow-sm">
                <Icon size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{title}</p>
                <p className="mt-0.5 text-xs text-ink/60">{note}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
