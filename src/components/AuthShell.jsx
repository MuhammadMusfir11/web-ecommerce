import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

// Lapisan paling atas: foto latar opsional. Taruh file di public/login-bg.jpg.
// Kalau file tidak ada, lapisan di bawahnya (langit dan bukit salju dari gradasi) yang tampil.
const BG =
  "url(/login-bg.jpg), " +
  "radial-gradient(130% 55% at 15% 108%, #f7fbff 0 55%, transparent 56%), " +
  "radial-gradient(110% 50% at 90% 112%, #dbe7f7 0 55%, transparent 56%), " +
  "linear-gradient(to bottom, #6f8fd0 0%, #a6b3dc 40%, #f0c3ad 68%, #d2e0f2 100%)";

export function GlassField({ id, label, error, right, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div
        className={`flex h-14 items-center rounded-2xl border bg-white/10 pr-3 transition focus-within:bg-white/20 ${
          error ? "border-red-300" : "border-white/50 focus-within:border-white"
        }`}
      >
        <input
          id={id}
          placeholder={label}
          aria-invalid={error ? "true" : undefined}
          style={{ outline: "none" }}
          className="h-full min-w-0 flex-1 bg-transparent px-5 text-[15px] text-white placeholder:text-white/75"
          {...props}
        />
        {right}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 px-2 text-xs text-red-100">
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordField({ label, error, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <GlassField
      label={label}
      error={error}
      type={show ? "text" : "password"}
      right={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/90 transition hover:bg-white/15"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      }
      {...props}
    />
  );
}

export function GlassButton({ busy, children, ...props }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="h-14 w-full rounded-2xl bg-gradient-to-r from-[#4f93e0] to-[#1d4ed8] text-base font-semibold text-white shadow-lg shadow-black/20 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
      {...props}
    >
      {busy ? "Memproses..." : children}
    </button>
  );
}

export function GlassAlert({ tone = "error", children }) {
  if (!children) return null;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-2xl px-4 py-3 text-sm ${
        tone === "error" ? "bg-red-500/25 text-red-50" : "bg-emerald-400/25 text-emerald-50"
      }`}
    >
      {children}
    </p>
  );
}

export default function AuthShell({ title, subtitle, children, footer }) {
  // Halaman ini layar penuh, jadi padding bawah untuk bottom nav tidak dipakai
  useEffect(() => {
    const prev = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "0px";
    return () => {
      document.body.style.paddingBottom = prev;
    };
  }, []);

  return (
    <div
      className="grid min-h-dvh place-items-center px-4 py-10"
      style={{ backgroundImage: BG, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-[#1e3a6e]/45 p-7 text-white shadow-2xl backdrop-blur-2xl sm:p-9">
        <h1 className="font-display text-4xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] text-white/85">{subtitle}</p>}

        <div className="mt-7">{children}</div>

        {footer && <p className="mt-6 text-center text-sm text-white/85">{footer}</p>}
        <p className="mt-5 text-center text-xs text-white/70">
          <Link to="/" className="underline-offset-4 hover:underline">
            Kembali ke toko Wali Cell
          </Link>
        </p>
      </div>
    </div>
  );
}