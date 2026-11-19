import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthShell, { GlassAlert, GlassButton, GlassField, PasswordField } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { fieldError, generalError } from "../lib/errors";

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // Sudah login: langsung ke halaman tujuan
  if (user) return <Navigate to={from} replace />;

  const onChange = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(form.email.trim(), form.password);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Masuk"
      subtitle="Selamat datang kembali, silakan masuk ke akun Anda."
      footer={
        <>
          Belum punya akun?{" "}
          <Link to="/register" className="font-semibold text-white underline-offset-4 hover:underline">
            Daftar
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <GlassAlert>{generalError(error)}</GlassAlert>

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
          label="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={onChange("password")}
          error={fieldError(error, "password")}
        />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-white/90 underline-offset-4 hover:underline">
            Lupa password?
          </Link>
        </div>

        <GlassButton busy={busy}>Masuk</GlassButton>
      </form>
    </AuthShell>
  );
}