import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Kalau ada token tersimpan, tunggu /me selesai dulu sebelum memutuskan user login atau tidak
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    let alive = true;
    api("/me")
      .then((u) => alive && setUser(u))
      .catch((e) => {
        // Token kedaluwarsa atau sudah dicabut
        if (e.status === 401) setToken(null);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api("/login", { method: "POST", body: { email, password } });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (fields) => {
    const data = await api("/register", { method: "POST", body: fields });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api("/logout", { method: "POST" });
    } catch {
      // Token sudah tidak valid di server, tetap keluarkan dari sisi browser
    }
    setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const u = await api("/me");
    setUser(u);
    return u;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      refresh,
    }),
    [user, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}