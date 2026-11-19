import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ClipboardList, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { fieldError, generalError } from "../lib/errors";

const inputCls = (err) =>
  `mt-1.5 h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:ring-4 ${
    err ? "border-sale focus:ring-sale/15" : "border-ink/10 focus:border-accent focus:ring-accent/15"
  }`;

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs text-sale">
          {error}
        </span>
      )}
    </label>
  );
}

export default function Account() {
  const { user, refresh, logout } = useAuth();
  const navigate = useNavigate();

  const empty = { current_password: "", password: "", password_confirmation: "" };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  // Segarkan data user dari server saat halaman dibuka
  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const onChange = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const data = await api("/change-password", { method: "POST", body: form });
      setMessage(data.message);
      setForm(empty);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const onLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const initial = (user.name || "?").trim().charAt(0).toUpperCase();

  return (
    <section className="mx-auto max-w-3xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Akun saya</h1>

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent text-xl font-bold text-white">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold">{user.name}</p>
          <p className="truncate text-sm text-ink/60">{user.email}</p>
          {user.role === "admin" && (
            <span className="mt-1.5 inline-block rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold text-accent-dark">
              Admin
            </span>
          )}
        </div>
      </div>

      <Link
        to="/orders"
        className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5 transition hover:shadow-md"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
          <ClipboardList size={20} />
        </span>
        <span className="flex-1 text-sm font-semibold">Pesanan saya</span>
        <ChevronRight size={20} className="text-ink/40" />
      </Link>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-6 space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5 sm:p-6"
      >
        <h2 className="font-display text-lg font-bold">Ganti password</h2>

        {generalError(error) && (
          <p role="alert" className="rounded-xl bg-sale/10 px-4 py-3 text-sm text-sale">
            {generalError(error)}
          </p>
        )}
        {message && (
          <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </p>
        )}

        <Field label="Password saat ini" error={fieldError(error, "current_password")}>
          <input
            type="password"
            autoComplete="current-password"
            value={form.current_password}
            onChange={onChange("current_password")}
            className={inputCls(fieldError(error, "current_password"))}
          />
        </Field>
        <Field label="Password baru (minimal 8 karakter)" error={fieldError(error, "password")}>
          <input
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={onChange("password")}
            className={inputCls(fieldError(error, "password"))}
          />
        </Field>
        <Field label="Ulangi password baru">
          <input
            type="password"
            autoComplete="new-password"
            value={form.password_confirmation}
            onChange={onChange("password_confirmation")}
            className={inputCls(false)}
          />
        </Field>

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark active:scale-[0.97] disabled:opacity-60"
        >
          {busy ? "Menyimpan..." : "Simpan password"}
        </button>
        <p className="text-xs text-ink/50">Perangkat lain akan otomatis keluar setelah password diganti.</p>
      </form>

      <button
        onClick={onLogout}
        className="mt-6 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-sale transition hover:bg-sale/10"
      >
        <LogOut size={18} /> Keluar
      </button>
    </section>
  );
}