import { Link } from "react-router-dom";
import { categories } from "../data/products";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm text-white">W</span>
            Wali Cell
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
            Toko HP, laptop, dan aksesori. Harga jelas, spesifikasi lengkap, dan pemesanan yang tidak ribet.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">Kategori</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-paper/60">
            {categories.map((c) => (
              <li key={c}>
                <Link to={`/products?kategori=${c}`} className="transition-colors hover:text-accent">
                  {c}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/products?promo=1" className="transition-colors hover:text-accent">
                Promo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">Kontak</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-paper/60">
            <li>Alamat toko: Kost Rafi Achmad</li>
            <li>WhatsApp: 085971817873</li>
            <li>Jam buka: 12 AM - 24 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-paper/40 sm:px-6">
          © {new Date().getFullYear()} Wali Cell. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}