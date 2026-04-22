import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface RequireAdminProps {
    children: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/" />;

    try {
        const decoded: any = jwtDecode(token);
        const roles: string[] = decoded.roles ?? [];
        const isAdmin = roles.some(r => r === "ADMIN" || r === "ROLE_ADMIN");

        if (!isAdmin) return <Navigate to="/" />;

        // Nếu là admin, cho phép hiển thị nội dung bên trong (children)
        return <>{children}</>;
    } catch {
        return <Navigate to="/" />;
    }
};

export default RequireAdmin;