import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Mail, UserRound } from "lucide-react";
import AuthShell, { GlassAlert, GlassButton, GlassField, PasswordField } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { fieldError, generalError } from "../lib/errors";

export default function Register() {
  const { user, register } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const onChange = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim() });
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Daftar"
      subtitle="Buat akun untuk mulai belanja dan melacak pesanan."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-white underline-offset-4 hover:underline">
            Masuk
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <GlassAlert>{generalError(error)}</GlassAlert>

        <GlassField
          id="name"
          label="Nama lengkap"
          autoComplete="name"
          value={form.name}
          onChange={onChange("name")}
          error={fieldError(error, "name")}
          right={<UserRound size={20} className="mr-1 shrink-0 text-white/90" aria-hidden="true" />}
        />
        <GlassField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={onChange("email")}
          error={fieldError(error, "email")}
          right={<Mail size={20} className="mr-1 shrink-0 text-white/90" aria-hidden="true" />}
        />
        <PasswordField
          id="password"
          label="Password (minimal 8 karakter)"
          autoComplete="new-password"
          value={form.password}
          onChange={onChange("password")}
          error={fieldError(error, "password")}
        />
        <PasswordField
          id="password_confirmation"
          label="Ulangi password"
          autoComplete="new-password"
          value={form.password_confirmation}
          onChange={onChange("password_confirmation")}
        />

        <GlassButton busy={busy}>Buat akun</GlassButton>
      </form>
    </AuthShell>
  );
}