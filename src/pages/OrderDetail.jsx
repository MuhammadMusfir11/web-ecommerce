import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, CircleCheck } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { api } from "../lib/api";
import { formatRupiah } from "../data/products";

const rupiah = (n) => formatRupiah(Number(n));

const dateOf = (iso) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  // Dikirim dari halaman checkout: navigate(`/orders/${order.id}`, { state: { justOrdered: true } })
  const justOrdered = Boolean(location.state?.justOrdered);

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setOrder(null);
    setError(null);
    api(`/orders/${id}`)
      .then((d) => alive && setOrder(d))
      .catch((e) => alive && setError(e));
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <section className="mx-auto max-w-3xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent underline-offset-4 hover:underline"
      >
        <ArrowLeft size={16} /> Semua pesanan
      </Link>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-sale/10 px-5 py-4 text-sm text-sale">
          {error.status === 404 ? "Pesanan tidak ditemukan." : error.message}
        </p>
      )}

      {!order && !error && (
        <div className="mt-6 space-y-3" role="status" aria-label="Memuat pesanan">
          <div className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-ink/5" />
          <div className="h-48 animate-pulse rounded-2xl bg-white ring-1 ring-ink/5" />
        </div>
      )}

      {order && (
        <>
          {justOrdered && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-900 ring-1 ring-emerald-200">
              <CircleCheck size={22} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-display font-bold">Pesanan berhasil dibuat</p>
                <p className="mt-0.5 text-sm">Simpan nomor pesanan di bawah untuk menanyakan status ke toko.</p>
              </div>
            </div>
          )}

          <header className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-bold">{order.order_number}</h1>
              <StatusBadge value={order.status} />
              {order.payment_status && <StatusBadge value={order.payment_status} />}
            </div>
            <p className="mt-1 text-sm text-ink/55">{dateOf(order.created_at)}</p>
          </header>

          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
            <h2 className="font-display text-base font-bold">Barang</h2>
            <ul className="mt-3 divide-y divide-ink/5">
              {order.items.map((it) => (
                <li key={it.id} className="flex justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0">
                  <span className="min-w-0">
                    <span className="block font-medium">{it.product_name}</span>
                    <span className="text-ink/50">
                      {it.quantity} x {rupiah(it.price)}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold">{rupiah(it.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-display text-lg font-bold">
              <span>Total</span>
              <span>{rupiah(order.total_amount)}</span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
            <h2 className="font-display text-base font-bold">Pengiriman</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-ink/50">Penerima</dt>
                <dd className="mt-0.5 font-medium">
                  {order.shipping_name} · {order.shipping_phone}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink/50">Alamat</dt>
                <dd className="mt-0.5 whitespace-pre-line font-medium">{order.shipping_address}</dd>
              </div>
              {order.notes && (
                <div>
                  <dt className="text-xs text-ink/50">Catatan</dt>
                  <dd className="mt-0.5 font-medium">{order.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </>
      )}
    </section>
  );
}