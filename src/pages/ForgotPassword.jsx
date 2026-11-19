import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthShell, { GlassAlert, GlassButton, GlassField } from "../components/AuthShell";
import { api } from "../lib/api";
import { fieldError, generalError } from "../lib/errors";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const data = await api("/forgot-password", { method: "POST", body: { email: email.trim() } });
      setMessage(data.message);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Lupa password"
      subtitle="Masukkan email akun Anda. Kami kirim tautan untuk membuat password baru."
      footer={
        <Link to="/login" className="font-semibold text-white underline-offset-4 hover:underline">
          Kembali ke halaman masuk
        </Link>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <GlassAlert>{generalError(error)}</GlassAlert>
        <GlassAlert tone="success">{message}</GlassAlert>

        <GlassField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldError(error, "email")}
          right={<Mail size={20} className="mr-1 shrink-0 text-white/90" aria-hidden="true" />}
        />

        <GlassButton busy={busy}>Kirim tautan reset</GlassButton>
      </form>
    </AuthShell>
  );
}