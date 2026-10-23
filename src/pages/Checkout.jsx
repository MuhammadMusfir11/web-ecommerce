import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Check, Landmark, QrCode, ShoppingBag, Store, Truck, Wallet } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../data/products";

const shipping = [
  { id: "reguler", label: "Reguler", note: "Estimasi 2-4 hari", price: 15000, icon: Truck },
  { id: "express", label: "Express", note: "Estimasi 1-2 hari", price: 35000, icon: Truck },
  { id: "ambil", label: "Ambil di toko", note: "Siap diambil hari ini", price: 0, icon: Store },
];

const payments = [
  { id: "transfer", label: "Transfer bank", note: "BCA, BRI, Mandiri", icon: Landmark },
  { id: "qris", label: "QRIS", note: "Semua aplikasi e-wallet", icon: QrCode },
  { id: "ewallet", label: "E-wallet", note: "GoPay, OVO, DANA", icon: Wallet },
  { id: "cod", label: "Bayar di tempat (COD)", note: "Bayar saat barang diterima", icon: Banknote },
];

const stepLabels = ["Data diri", "Pengiriman", "Pembayaran"];

const emptyForm = {
  nama: "",
  hp: "",
  email: "",
  kurir: "reguler",
  alamat: "",
  kota: "",
  pos: "",
  catatan: "",
  bayar: "",
};

// Validasi per langkah. Hasilnya objek error, kosong berarti lolos.
const validators = [
  (f) => {
    const e = {};
    if (f.nama.trim().length < 3) e.nama = "Isi nama lengkap (minimal 3 huruf)";
    if (!/^(\+62|62|0)8\d{8,11}$/.test(f.hp.replace(/[\s-]/g, "")))
      e.hp = "Nomor HP belum benar, contoh: 081234567890";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Format email belum benar";
    return e;
  },
  (f) => {
    const e = {};
    if (f.kurir !== "ambil") {
      if (f.alamat.trim().length < 10) e.alamat = "Tulis alamat lengkap (jalan, nomor, RT/RW)";
      if (!f.kota.trim()) e.kota = "Isi kota atau kabupaten";
      if (!/^\d{5}$/.test(f.pos)) e.pos = "Kode pos harus 5 angka";
    }
    return e;
  },
  (f) => {
    const e = {};
    if (!f.bayar) e.bayar = "Pilih metode pembayaran";
    return e;
  },
];

const inputCls = (err) =>
  `mt-1.5 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:ring-4 ${
    err
      ? "border-accent focus:ring-accent/15"
      : "border-ink/10 focus:border-accent focus:ring-accent/15"
  }`;

function Field({ label, optional, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">
        {label}
        {optional && <span className="ml-1 font-normal text-ink/40">(opsional)</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs text-accent">
          {error}
        </span>
      )}
    </label>
  );
}

function Option({ checked, onClick, icon: Icon, title, note, right }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
        checked
          ? "border-accent bg-accent/5 ring-2 ring-accent/20"
          : "border-ink/10 bg-white hover:border-ink/30"
      }`}
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors ${
          checked ? "bg-accent text-white" : "bg-card"
        }`}
      >
        <Icon size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-ink/60">{note}</span>
      </span>
      {right && <span className="shrink-0 text-sm font-semibold">{right}</span>}
    </button>
  );
}

function Stepper({ step }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Langkah checkout">
      {stepLabels.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <span
              aria-current={active ? "step" : undefined}
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors duration-300 ${
                done ? "bg-accent text-white" : active ? "bg-ink text-paper" : "bg-card text-ink/50"
              }`}
            >
              {done ? <Check size={16} /> : i + 1}
            </span>
            <span
              className={`text-sm font-medium ${active ? "" : "hidden text-ink/50 sm:inline"}`}
            >
              {label}
            </span>
            {i < stepLabels.length - 1 && (
              <span className="h-0.5 flex-1 overflow-hidden rounded bg-ink/10">
                <motion.span
                  className="block h-full bg-accent"
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Summary({ items, subtotal, ongkir, total }) {
  return (
    <aside className="rounded-3xl bg-card p-5 sm:p-6 lg:sticky lg:top-28">
      <h2 className="font-display text-lg font-bold">Ringkasan pesanan</h2>
      <ul className="mt-4 space-y-3">
        {items.map(({ product, qty }) => (
          <li key={product.id} className="flex justify-between gap-3 text-sm">
            <span className="min-w-0">
              <span className="line-clamp-2 font-medium">{product.name}</span>
              <span className="text-ink/50">
                {qty} x {formatRupiah(product.price)}
              </span>
            </span>
            <span className="shrink-0 font-semibold">{formatRupiah(product.price * qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink/60">Subtotal</dt>
          <dd>{formatRupiah(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink/60">Ongkos kirim</dt>
          <dd>{ongkir === 0 ? "Gratis" : formatRupiah(ongkir)}</dd>
        </div>
        <div className="flex justify-between pt-2 font-display text-lg font-bold">
          <dt>Total</dt>
          <dd>{formatRupiah(total)}</dd>
        </div>
      </dl>
    </aside>
  );
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-ink/10 py-3 first:border-t-0 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-xs text-ink/50">{label}</p>
        <p className="mt-0.5 text-sm font-medium">{value}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-sm font-semibold text-accent underline-offset-4 hover:underline"
      >
        Ubah
      </button>
    </div>
  );
}

function Success({ order }) {
  const kurir = shipping.find((s) => s.id === order.form.kurir);
  const bayar = payments.find((p) => p.id === order.form.bayar);

  return (
    <section className="mx-auto max-w-3xl px-4 pb-10 pt-8 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <motion.svg viewBox="0 0 52 52" className="h-24 w-24 text-accent" fill="none" aria-hidden="true">
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.path
            d="M15 27l8 8 15-17"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
          />
        </motion.svg>

        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Pesanan berhasil dibuat
        </h1>
        <p className="mt-3 text-ink/60">
          Terima kasih, {order.form.nama.split(" ")[0]}. Nomor pesananmu:
        </p>
        <p className="mt-2 rounded-full bg-card px-5 py-2 font-display text-lg font-bold tracking-wide">
          {order.no}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 px-5 py-4 text-sm">
        <span className="font-semibold">Ini simulasi.</span> Tidak ada pembayaran atau pengiriman
        sungguhan yang diproses.
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-card p-6 text-sm">
          <h2 className="font-display text-lg font-bold">Detail pesanan</h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-xs text-ink/50">Penerima</dt>
              <dd className="font-medium">
                {order.form.nama} · {order.form.hp}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink/50">Pengiriman</dt>
              <dd className="font-medium">
                {kurir.label}
                {kurir.id !== "ambil" && (
                  <span className="block font-normal text-ink/60">
                    {order.form.alamat}, {order.form.kota} {order.form.pos}
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink/50">Pembayaran</dt>
              <dd className="font-medium">{bayar.label}</dd>
            </div>
          </dl>
        </div>

        <Summary
          items={order.items}
          subtotal={order.subtotal}
          ongkir={order.ongkir}
          total={order.total}
        />
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="rounded-full bg-ink px-7 py-3.5 text-center text-sm font-semibold text-paper transition hover:bg-accent active:scale-[0.97]"
        >
          Kembali ke beranda
        </Link>
        <Link
          to="/products"
          className="rounded-full border border-ink/15 px-7 py-3.5 text-center text-sm font-semibold transition hover:border-ink/40 active:scale-[0.97]"
        >
          Belanja lagi
        </Link>
      </div>
    </section>
  );
}

export default function Checkout() {
  const { items, total: subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  const kurir = shipping.find((s) => s.id === form.kurir);
  const ongkir = kurir.price;
  const total = subtotal + ongkir;

  const pick = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => (er[key] ? { ...er, [key]: undefined } : er));
  };
  const onText = (key) => (e) => pick(key, e.target.value);
  const onDigits = (key) => (e) => pick(key, e.target.value.replace(/\D/g, "").slice(0, 5));

  const next = () => {
    const e = validators[step](form);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => s + 1);
  };

  const placeOrder = () => {
    const e = validators[2](form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const no = "WC-" + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(10 + Math.random() * 90);
    setOrder({ no, items, subtotal, ongkir, total, form: { ...form } });
    clear();
    window.scrollTo(0, 0);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (step < 2) next();
    else placeOrder();
  };

  if (order) return <Success order={order} />;

  if (items.length === 0) {
    return (
      <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-card">
          <ShoppingBag size={34} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Belum ada yang dibeli</h1>
        <p className="mt-3 max-w-sm text-ink/60">Tambahkan produk ke keranjang dulu sebelum checkout.</p>
        <Link
          to="/products"
          className="mt-8 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark active:scale-[0.97]"
        >
          Lihat produk
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>

      <div className="mt-6 max-w-2xl">
        <Stepper step={step} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <form onSubmit={onSubmit} noValidate>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-5"
            >
              {step === 0 && (
                <>
                  <h2 className="font-display text-xl font-bold">Data diri</h2>
                  <Field label="Nama lengkap" error={errors.nama}>
                    <input
                      value={form.nama}
                      onChange={onText("nama")}
                      autoComplete="name"
                      placeholder="Nama penerima"
                      className={`${inputCls(errors.nama)} h-12`}
                    />
                  </Field>
                  <Field label="Nomor HP" error={errors.hp}>
                    <input
                      value={form.hp}
                      onChange={onText("hp")}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="081234567890"
                      className={`${inputCls(errors.hp)} h-12`}
                    />
                  </Field>
                  <Field label="Email" optional error={errors.email}>
                    <input
                      value={form.email}
                      onChange={onText("email")}
                      type="email"
                      autoComplete="email"
                      placeholder="nama@email.com"
                      className={`${inputCls(errors.email)} h-12`}
                    />
                  </Field>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="font-display text-xl font-bold">Pengiriman</h2>
                  <div role="radiogroup" aria-label="Metode pengiriman" className="space-y-3">
                    {shipping.map((s) => (
                      <Option
                        key={s.id}
                        checked={form.kurir === s.id}
                        onClick={() => pick("kurir", s.id)}
                        icon={s.icon}
                        title={s.label}
                        note={s.note}
                        right={s.price === 0 ? "Gratis" : formatRupiah(s.price)}
                      />
                    ))}
                  </div>

                  {form.kurir === "ambil" ? (
                    <p className="rounded-2xl bg-card px-5 py-4 text-sm text-ink/70">
                      Kamu akan mengambil pesanan langsung di toko Wali Cell. Tidak perlu mengisi alamat.
                    </p>
                  ) : (
                    <>
                      <Field label="Alamat lengkap" error={errors.alamat}>
                        <textarea
                          value={form.alamat}
                          onChange={onText("alamat")}
                          rows={3}
                          autoComplete="street-address"
                          placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                          className={`${inputCls(errors.alamat)} py-3`}
                        />
                      </Field>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Kota / Kabupaten" error={errors.kota}>
                          <input
                            value={form.kota}
                            onChange={onText("kota")}
                            autoComplete="address-level2"
                            className={`${inputCls(errors.kota)} h-12`}
                          />
                        </Field>
                        <Field label="Kode pos" error={errors.pos}>
                          <input
                            value={form.pos}
                            onChange={onDigits("pos")}
                            inputMode="numeric"
                            autoComplete="postal-code"
                            placeholder="5 angka"
                            className={`${inputCls(errors.pos)} h-12`}
                          />
                        </Field>
                      </div>
                      <Field label="Catatan untuk kurir" optional>
                        <input
                          value={form.catatan}
                          onChange={onText("catatan")}
                          placeholder="Contoh: titip di satpam"
                          className={`${inputCls(false)} h-12`}
                        />
                      </Field>
                    </>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-display text-xl font-bold">Pembayaran</h2>
                  <div role="radiogroup" aria-label="Metode pembayaran" className="space-y-3">
                    {payments.map((p) => (
                      <Option
                        key={p.id}
                        checked={form.bayar === p.id}
                        onClick={() => pick("bayar", p.id)}
                        icon={p.icon}
                        title={p.label}
                        note={p.note}
                      />
                    ))}
                  </div>
                  {errors.bayar && (
                    <p role="alert" className="text-xs text-accent">
                      {errors.bayar}
                    </p>
                  )}

                  <div className="rounded-2xl border border-ink/10 bg-white p-5">
                    <ReviewRow
                      label="Penerima"
                      value={`${form.nama} · ${form.hp}`}
                      onEdit={() => setStep(0)}
                    />
                    <ReviewRow
                      label="Pengiriman"
                      value={
                        kurir.id === "ambil"
                          ? "Ambil di toko"
                          : `${kurir.label}: ${form.alamat}, ${form.kota} ${form.pos}`
                      }
                      onEdit={() => setStep(1)}
                    />
                  </div>

                  <p className="text-xs text-ink/50">
                    Ini simulasi, jadi tidak ada pembayaran sungguhan yang diproses.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-full border border-ink/15 px-7 py-3.5 text-sm font-semibold transition hover:border-ink/40 active:scale-[0.97]"
              >
                Kembali
              </button>
            ) : (
              <Link
                to="/cart"
                className="rounded-full border border-ink/15 px-7 py-3.5 text-center text-sm font-semibold transition hover:border-ink/40 active:scale-[0.97]"
              >
                Ke keranjang
              </Link>
            )}
            <button
              type="submit"
              className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-dark active:scale-[0.97]"
            >
              {step < 2 ? "Lanjut" : `Buat pesanan · ${formatRupiah(total)}`}
            </button>
          </div>
        </form>

        <Summary items={items} subtotal={subtotal} ongkir={ongkir} total={total} />
      </div>
    </section>
  );
}