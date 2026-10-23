import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";

const links = [
  { label: "Semua Produk", href: "/products" },
  { label: "HP", href: "/products?kategori=HP" },
  { label: "Laptop", href: "/products?kategori=Laptop" },
  { label: "Audio", href: "/products?kategori=Audio" },
  { label: "Aksesori", href: "/products?kategori=Aksesori" },
  { label: "Promo", href: "/products?promo=1", highlight: true },
];

const quick = links.filter((l) => l.href.includes("kategori"));

const panelMotion = {
  initial: { opacity: 0, y: -10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
};

function SearchForm({ onDone }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/products?q=${encodeURIComponent(q.trim())}`);
    setQ("");
    onDone?.();
  };

  return (
    <form role="search" onSubmit={submit} className="flex gap-2">
      <label className="flex-1">
        <span className="sr-only">Cari produk</span>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari produk, merek, atau kategori"
          className="h-11 w-full rounded-full border border-ink/10 bg-white px-5 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
        />
      </label>
      <button
        type="submit"
        className="rounded-full bg-ink px-5 text-sm font-semibold text-paper transition hover:bg-accent active:scale-[0.97]"
      >
        Cari
      </button>
    </form>
  );
}

export default function Navbar({ cartCount = 0, onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState(null); // null | "search" | "menu"
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (name) => setPanel((p) => (p === name ? null : name));
  const close = () => setPanel(null);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4">
      {/* Klik di luar panel untuk menutup */}
      {panel && <div className="fixed inset-0 -z-10" onClick={close} aria-hidden="true" />}

      <div
        className={`mx-auto transition-all duration-300 ease-out motion-reduce:transition-none ${
          scrolled ? "mt-2 max-w-4xl" : "mt-4 max-w-6xl"
        }`}
      >
        {/* Pill navbar */}
        <div
          className={`flex h-14 items-center gap-1 rounded-full border border-ink/10 bg-paper/80 pl-5 pr-2 backdrop-blur-xl transition-shadow duration-300 ${
            scrolled ? "shadow-lg shadow-ink/10" : "shadow-sm"
          }`}
        >
          <Link to="/" className="mr-2 flex shrink-0 items-center gap-2 font-display text-lg font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm text-white">W</span>
            Wali Cell
          </Link>

          {/* Menu (laptop) */}
          <nav aria-label="Kategori" className="mx-auto hidden lg:block" onMouseLeave={() => setHovered(null)}>
            <ul className="flex items-center">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    onMouseEnter={() => setHovered(l.label)}
                    onFocus={() => setHovered(l.label)}
                    className={`relative block rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                      l.highlight ? "text-accent" : "text-ink/75 hover:text-ink"
                    }`}
                  >
                    {hovered === l.label && (
                      <motion.span
                        layoutId="nav-hover"
                        transition={{ type: "spring", stiffness: 500, damping: 38 }}
                        className="absolute inset-0 rounded-full bg-ink/[0.06]"
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
            <button
              onClick={() => toggle("search")}
              aria-label="Cari produk"
              aria-expanded={panel === "search"}
              className={`grid h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5 ${
                panel === "search" ? "bg-ink/5" : ""
              }`}
            >
              <Search size={19} />
            </button>

            <button aria-label="Wishlist" className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5 sm:grid">
              <Heart size={19} />
            </button>

            <button
              onClick={onCartClick}
              aria-label={`Keranjang, ${cartCount} barang`}
              className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-ink/5"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 1.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => toggle("menu")}
              aria-label={panel === "menu" ? "Tutup menu" : "Buka menu"}
              aria-expanded={panel === "menu"}
              className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper transition hover:bg-accent lg:hidden"
            >
              {panel === "menu" ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* Panel di bawah pill */}
        <AnimatePresence>
          {panel === "search" && (
            <motion.div
              key="search"
              {...panelMotion}
              className="mt-2 rounded-3xl border border-ink/10 bg-paper/95 p-4 shadow-xl shadow-ink/10 backdrop-blur-xl"
            >
              <SearchForm onDone={close} />
              <div className="mt-3 flex flex-wrap gap-2">
                {quick.map((l) => (
                  <Link
                    key={l.label}
                    to={l.href}
                    className="rounded-full bg-card px-4 py-1.5 text-sm font-medium transition hover:bg-accent hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {panel === "menu" && (
            <motion.div
              key="menu"
              {...panelMotion}
              className="mt-2 rounded-3xl border border-ink/10 bg-paper/95 p-4 shadow-xl shadow-ink/10 backdrop-blur-xl lg:hidden"
            >
              <ul className="grid grid-cols-2 gap-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      onClick={close}
                      className={`block rounded-2xl bg-card px-4 py-3 text-sm font-medium ${
                        l.highlight ? "text-accent" : ""
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}