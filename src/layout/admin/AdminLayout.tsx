import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const s: Record<string, React.CSSProperties> = {
        wrapper: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif" },
        sidebar: {
            width: 240, background: "#1a1a1a", color: "#fff",
            display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0
        },
        logo: { fontSize: 20, fontWeight: 600, padding: "0 24px 24px", borderBottom: "0.5px solid #333", marginBottom: 16 },
        navItem: { display: "block", padding: "12px 24px", color: "#aaa", textDecoration: "none", fontSize: 14, transition: "all 0.15s" },
        navActive: { color: "#fff", background: "#333", borderLeft: "3px solid #fff" },
        main: { flex: 1, background: "#f8f7f4", overflow: "auto" },
        header: { background: "#fff", padding: "16px 32px", borderBottom: "0.5px solid #e8e5e0", display: "flex", justifyContent: "space-between", alignItems: "center" },
        logoutBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 8, padding: "6px 16px", fontSize: 13, cursor: "pointer", color: "#555" },
        content: { padding: 32 },
    };

    const navItems = [
        { to: "/admin",           label: "📊 Thống kê",        end: true },
        { to: "/admin/products",  label: "📦 Sản phẩm" },
        { to: "/admin/orders",    label: "🛒 Đơn hàng" },
        { to: "/admin/categories",label: "🗂 Danh mục" },
        { to: "/admin/users",     label: "👥 Người dùng" },
        { to: "/admin/reviews",   label: "💬 Đánh giá" },
        { to: "/admin/vouchers", label: "🎟 Voucher" },
    ];

    return (
        <div style={s.wrapper}>
            {/* Sidebar */}
            <div style={s.sidebar}>
                <div style={s.logo}>⚡ ElaBan Admin</div>
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        style={({ isActive }) => ({
                            ...s.navItem,
                            ...(isActive ? s.navActive : {})
                        })}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>

            {/* Main */}
            <div style={s.main}>
                <div style={s.header}>
                    <span style={{ fontSize: 14, color: "#888" }}>Admin Dashboard</span>
                    <button style={s.logoutBtn} onClick={handleLogout}>Đăng xuất</button>
                </div>
                <div style={s.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;