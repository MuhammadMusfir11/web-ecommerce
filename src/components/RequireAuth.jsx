import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Dipakai sebagai layout route:
// <Route element={<RequireAuth />}> ... </Route>
// <Route element={<RequireAuth admin />}> ... </Route>
export default function RequireAuth({ admin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center" role="status" aria-label="Memuat">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}