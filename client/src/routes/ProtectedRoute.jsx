import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function ProtectedRoute({ children }) {
  const isAuth = useAuthStore((state) => state.isAuth);
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
}
