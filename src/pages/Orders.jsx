import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ClipboardList } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { api } from "../lib/api";
import { formatRupiah } from "../data/products";

const dateOf = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function Orders() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setData(null);
    setError(null);
    api(`/orders?page=${page}`)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e));
    return () => {
      alive = false;
    };
  }, [page]);

  return (
    <section className="mx-auto max-w-3xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Pesanan saya</h1>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-sale/10 px-5 py-4 text-sm text-sale">
          {error.message}
        </p>
      )}

      {!data && !error && (
        <div className="mt-6 space-y-3" role="status" aria-label="Memuat pesanan">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white ring-1 ring-ink/5" />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="mt-10 flex flex-col items-center rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-ink/5">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent">
            <ClipboardList size={28} />
          </span>
          <p className="mt-5 font-display text-lg font-semibold">Belum ada pesanan</p>
          <p className="mt-2 text-sm text-ink/60">Pesanan yang kamu buat akan muncul di sini.</p>
          <Link
            to="/products"
            className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >
            Belanja sekarang
          </Link>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <ul className="mt-6 space-y-3">
            {data.data.map((o) => (
              <li key={o.id}>
                <Link
                  to={`/orders/${o.id}`}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5 transition hover:shadow-md sm:p-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-sm font-bold">{o.order_number}</p>
                      <StatusBadge value={o.status} />
                    </div>
                    <p className="mt-1 text-xs text-ink/55">
                      {dateOf(o.created_at)} · {o.items_count} barang
                    </p>
                    <p className="mt-2 font-display text-base font-bold">
                      {formatRupiah(Number(o.total_amount))}
                    </p>
                  </div>
                  <ChevronRight size={20} className="shrink-0 text-ink/40" />
                </Link>
              </li>
            ))}
          </ul>

          {data.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={data.current_page <= 1}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-ink/5 transition hover:bg-accent-soft disabled:opacity-40 disabled:hover:bg-white"
              >
                Sebelumnya
              </button>
              <span className="text-sm text-ink/60">
                Halaman {data.current_page} dari {data.last_page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.current_page >= data.last_page}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-ink/5 transition hover:bg-accent-soft disabled:opacity-40 disabled:hover:bg-white"
              >
                Berikutnya
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}