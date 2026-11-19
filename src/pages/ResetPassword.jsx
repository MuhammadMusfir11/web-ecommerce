import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthShell, { GlassAlert, GlassButton, PasswordField } from "../components/AuthShell";
import { api } from "../lib/api";
import { fieldError, generalError } from "../lib/errors";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [form, setForm] = useState({ password: "", password_confirmation: "" });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const onChange = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await api("/reset-password", { method: "POST", body: { token, email, ...form } });
      setMessage(data.message);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  // Tautan tidak lengkap: arahkan minta tautan baru
  if (!token || !email) {
    return (
      <AuthShell
        title="Tautan tidak valid"
        subtitle="Tautan reset password ini tidak lengkap atau sudah rusak."
        footer={
          <Link to="/forgot-password" className="font-semibold text-white underline-offset-4 hover:underline">
            Minta tautan baru
          </Link>
        }
      />
    );
  }

  // Berhasil
  if (message) {
    return (
      <AuthShell title="Password diubah" subtitle={message}>
        <Link
          to="/login"
          className="grid h-14 w-full place-items-center rounded-2xl bg-gradient-to-r from-[#4f93e0] to-[#1d4ed8] text-base font-semibold text-white shadow-lg shadow-black/20 transition hover:brightness-110"
        >
          Masuk sekarang
        </Link>
      </AuthShell>
    );
  }

  // Error pada email atau token ditampilkan sebagai pesan umum karena kolomnya tidak terlihat
  const linkError = fieldError(error, "email") || fieldError(error, "token") || generalError(error);

  return (
    <AuthShell title="Password baru" subtitle={`Buat password baru untuk ${email}.`}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <GlassAlert>{linkError}</GlassAlert>

        <PasswordField
          id="password"
          label="Password baru (minimal 8 karakter)"
          autoComplete="new-password"
          value={form.password}
          onChange={onChange("password")}
          error={fieldError(error, "password")}
        />
        <PasswordField
          id="password_confirmation"
          label="Ulangi password baru"
          autoComplete="new-password"
          value={form.password_confirmation}
          onChange={onChange("password_confirmation")}
        />

        <GlassButton busy={busy}>Simpan password</GlassButton>

        <p className="text-center text-sm text-white/85">
          Tautan kedaluwarsa?{" "}
          <Link to="/forgot-password" className="font-semibold text-white underline-offset-4 hover:underline">
            Minta tautan baru
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}