import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Shoppers only. Guests are sent to login and returned afterwards.
export default function UserRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <p className="p-10 text-center">Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return children;
}
