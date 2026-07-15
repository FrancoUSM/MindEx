import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getSession } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (session.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
