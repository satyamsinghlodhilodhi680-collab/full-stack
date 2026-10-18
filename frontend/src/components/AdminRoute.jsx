
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../services/api";

function AdminRoute() {
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        let active = true;

        api.get("/auth/get-me")
            .then((response) => {
                const user = response.data.user;

                if (active) {
                    setStatus(
                        user?.role === "admin"
                            ? "admin"
                            : "not-admin"
                    );
                }
            })
            .catch(() => {
                if (active) setStatus("unauthenticated");
            });

        return () => {
            active = false;
        };
    }, []);

    if (status === "checking") {
        return <p className="p-6 text-center">Checking admin access...</p>;
    }

    if (status === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    if (status === "not-admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;
