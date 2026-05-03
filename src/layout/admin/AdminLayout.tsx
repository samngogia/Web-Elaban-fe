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
        wrapper: { 
            display: "flex", 
            height: "100vh", // 1. Đổi minHeight thành height
            overflow: "hidden", // 2. Khóa cuộn của toàn bộ trang web
            fontFamily: "sans-serif" 
        },
        sidebar: {
            width: 240, 
            background: "#1a1a1a", 
            color: "#fff",
            display: "flex", 
            flexDirection: "column", 
            padding: "24px 0", 
            flexShrink: 0,
            height: "100vh", // 3. Set cứng chiều cao bằng màn hình
            boxSizing: "border-box", // 4. Giữ padding không làm tràn layout
            overflowY: "auto" // 5. Nếu thêm nhiều menu quá thì thanh bên tự có thanh cuộn riêng
        },
        logo: { fontSize: 20, fontWeight: 600, padding: "0 24px 24px", borderBottom: "0.5px solid #333", marginBottom: 16 },
        navItem: { display: "block", padding: "12px 24px", color: "#aaa", textDecoration: "none", fontSize: 14, transition: "all 0.15s" },
        navActive: { color: "#fff", background: "#333", borderLeft: "3px solid #fff" },
        main: { 
            flex: 1, 
            background: "#f8f7f4", 
            overflowY: "auto", // 6. Cho phép bên phải cuộn độc lập
            height: "100vh",
            boxSizing: "border-box"
        },
        header: { background: "#fff", padding: "16px 32px", borderBottom: "0.5px solid #e8e5e0", display: "flex", justifyContent: "space-between", alignItems: "center" },
        logoutBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 8, padding: "6px 16px", fontSize: 13, cursor: "pointer", color: "#555" },
        content: { padding: 32 },
    };

    const allNavItems = [
        // Chỉ ADMIN
        { to: "/admin/dashboard", label: "Thống kê", icon: "bi-bar-chart-fill", adminOnly: true, end: true },
        { to: "/admin/users", label: "Người dùng", icon: "bi-people-fill", adminOnly: true },
        { to: "/admin/vouchers", label: "Voucher", icon: "bi-ticket-perforated-fill", adminOnly: true },
        
        // STAFF + ADMIN
        { to: "/admin/products", label: "Sản phẩm", icon: "bi-box-seam-fill", adminOnly: false },
        { to: "/admin/categories", label: "Danh mục", icon: "bi-tags-fill", adminOnly: false },
        { to: "/admin/orders", label: "Đơn hàng", icon: "bi-bag-check-fill", adminOnly: false },
        { to: "/admin/blog", label: "Tin tức", icon: "bi-newspaper", adminOnly: false },
        { to: "/admin/reviews", label: "Đánh giá", icon: "bi-star-fill", adminOnly: false },
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
                        <i className={`bi ${item.icon}`} style={{ marginRight: '10px', fontSize: '1.1rem' }}></i>
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