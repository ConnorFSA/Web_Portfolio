// Wraps any route that requires admin authentication. if the user is not authenticated they will be redirected to the login page.

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({children}: ProtectedRouteProps) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
}