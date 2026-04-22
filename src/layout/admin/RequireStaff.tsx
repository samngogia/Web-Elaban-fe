// RequireStaff.tsx — ADMIN hoặc STAFF đều vào được
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RequireStaff: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" />;
    try {
        const decoded: any = jwtDecode(token);
        const roles: string[] = decoded.roles ?? [];
        const hasAccess = roles.some(r =>
            ["ADMIN", "ROLE_ADMIN", "STAFF", "ROLE_STAFF"].includes(r)
        );
        if (!hasAccess) return <Navigate to="/" />;
    } catch { return <Navigate to="/login" />; }
    return <>{children}</>;
};

export default RequireStaff;