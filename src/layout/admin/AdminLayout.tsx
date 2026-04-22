import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminLayout: React.FC = () => {
    const navigate = useNavigate(); // Cần cái này để chuyển hướng sau khi logout
    const token = localStorage.getItem("token");
    const roles: string[] = (() => {
        try {
            const d: any = jwtDecode(token ?? "");
            return d.roles ?? [];
        } catch { return []; }
    })();

    const isAdmin = roles.some(r => ["ADMIN", "ROLE_ADMIN"].includes(r));
    const isStaff = roles.some(r => ["STAFF", "ROLE_STAFF"].includes(r));
// --- BỔ SUNG ĐOẠN NÀY ---
   
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // Xóa luôn user nếu có lưu
        navigate("/login"); // Chuyển về trang login
    };
    // ------------------------


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

    const allNavItems = [
        // Chỉ ADMIN
        { to: "/admin/dashboard", label: "📊 Thống kê", adminOnly: true, end: true },
        { to: "/admin/users", label: "👥 Người dùng", adminOnly: true },
        { to: "/admin/vouchers", label: "🎟 Voucher", adminOnly: true },
        // STAFF + ADMIN
        { to: "/admin/products", label: "📦 Sản phẩm", adminOnly: false },
        { to: "/admin/categories", label: "🗂 Danh mục", adminOnly: false },
        { to: "/admin/orders", label: "🛍 Đơn hàng", adminOnly: false },
        { to: "/admin/blog", label: "📰 Tin tức", adminOnly: false },
        { to: "/admin/reviews", label: "⭐ Đánh giá", adminOnly: false },
    ];

    const navItems = allNavItems.filter(item =>
        !item.adminOnly || isAdmin
    );

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