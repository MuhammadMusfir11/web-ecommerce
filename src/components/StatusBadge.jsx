// Nilai status dari backend belum saya lihat (Order model / AdminOrderController),
// jadi nilai yang tidak dikenal ditampilkan apa adanya. Sesuaikan peta ini kalau perlu.
const MAP = {
  pending: ["Menunggu", "bg-amber-100 text-amber-800"],
  unpaid: ["Belum dibayar", "bg-amber-100 text-amber-800"],
  paid: ["Dibayar", "bg-emerald-100 text-emerald-800"],
  processing: ["Diproses", "bg-accent-soft text-accent-dark"],
  shipped: ["Dikirim", "bg-accent-soft text-accent-dark"],
  completed: ["Selesai", "bg-emerald-100 text-emerald-800"],
  cancelled: ["Dibatalkan", "bg-sale/10 text-sale"],
  canceled: ["Dibatalkan", "bg-sale/10 text-sale"],
};

export default function StatusBadge({ value }) {
  if (!value) return null;
  const hit = MAP[String(value).toLowerCase()];
  const [label, tone] = hit ?? [String(value), "bg-card text-ink/70"];
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{label}</span>;
}