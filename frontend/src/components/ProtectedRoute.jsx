
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../services/api";

function ProtectedRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    api.get("/auth/get-me")
      .then(() => {
        if (active) setStatus("authenticated");
      })
      .catch(() => {
        if (active) setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return <p className="p-6 text-center">Checking login...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
