import React, { useEffect, useState } from "react";
import FormatNumber from "../utils/FormatNumber";

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const fetchStats = async () => {
            try {
                const res = await fetch("http://localhost:8089/admin/dashboard/stats", { headers });

                if (!res.ok) throw new Error(`Stats HTTP ${res.status}`);

                const text = await res.text();
                setStats(text ? JSON.parse(text) : null);
            } catch (err) {
                console.error("Lỗi stats:", err);
            }
        };

        const fetchRecentOrders = async () => {
            try {
                const res = await fetch("http://localhost:8089/admin/dashboard/recent-orders", { headers });

                if (!res.ok) throw new Error(`Recent orders HTTP ${res.status}`);

                const text = await res.text();
                setRecentOrders(text ? JSON.parse(text) : []);
            } catch (err) {
                console.error("Lỗi recent orders:", err);
                setRecentOrders([]);
            }
        };

        const fetchRevenue = async () => {
            try {
                const res = await fetch(
                    "http://localhost:8089/admin/dashboard/revenue-by-month?year=2026",
                    { headers }
                );

                if (!res.ok) throw new Error(`Revenue HTTP ${res.status}`);

                const text = await res.text();
                setRevenueData(text ? JSON.parse(text) : []);
            } catch (err) {
                console.error("Lỗi revenue:", err);
                setRevenueData([]);
            }
        };

        fetchStats();
        fetchRecentOrders();
        fetchRevenue();
    }, [token]);

    const s: Record<string, React.CSSProperties> = {
        grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 },
        card: { background: "#fff", borderRadius: 12, padding: "20px 24px", border: "0.5px solid #e8e5e0" },
        label: { fontSize: 12, color: "#aaa", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 },
        value: { fontSize: 28, fontWeight: 500, color: "#1a1a1a" },
        section: { background: "#fff", borderRadius: 12, padding: 24, border: "0.5px solid #e8e5e0", marginBottom: 24 },
        sectionTitle: { fontSize: 14, fontWeight: 600, marginBottom: 20, color: "#1a1a1a" },
        table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
        th: { textAlign: "left" as const, padding: "8px 12px", color: "#aaa", fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", borderBottom: "0.5px solid #eee" },
        td: { padding: "12px", borderBottom: "0.5px solid #f5f5f5", color: "#333" },
        badge: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 },
    };

    const getBadgeStyle = (status: string): React.CSSProperties => {
        if (status === "PAID") return { ...s.badge, background: "#EAF3DE", color: "#27500A" };
        if (status === "PENDING") return { ...s.badge, background: "#FAEEDA", color: "#633806" };
        return { ...s.badge, background: "#f0f0f0", color: "#666" };
    };

    if (!stats) return <div>Loading...</div>;

    return (
        <div>
            <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Dashboard</h2>

            {/* Metric cards */}
            <div style={s.grid4}>
                {[
                    { label: "Tổng đơn hàng", value: stats.totalOrders },
                    { label: "Doanh thu", value: `${FormatNumber(stats.totalRevenue)}đ` },
                    { label: "Sản phẩm", value: stats.totalProducts },
                    { label: "Người dùng", value: stats.totalUsers },
                ].map((item, i) => (
                    <div key={i} style={s.card}>
                        <div style={s.label}>{item.label}</div>
                        <div style={s.value}>{item.value}</div>
                    </div>
                ))}
            </div>

            {/* Doanh thu theo tháng */}
            <div style={s.section}>
                <div style={s.sectionTitle}>Doanh thu theo tháng (2026)</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160 }}>
                    {Array.from({ length: 12 }, (_, i) => {
                        const month = revenueData.find(d => d.month === i + 1);
                        const revenue = month?.revenue ?? 0;
                        const maxRevenue =
                            revenueData.length > 0
                                ? Math.max(...revenueData.map((d) => d.revenue), 1)
                                : 1;
                        const height = Math.round((revenue / maxRevenue) * 120);
                        return (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <div style={{ width: "100%", height, background: revenue > 0 ? "#1a1a1a" : "#f0f0f0", borderRadius: 4, minHeight: 4 }} />
                                <span style={{ fontSize: 10, color: "#aaa" }}>T{i + 1}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Đơn hàng gần đây */}
            <div style={s.section}>
                <div style={s.sectionTitle}>Đơn hàng gần đây</div>
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={s.th}>ID</th>
                            <th style={s.th}>Tổng tiền</th>
                            <th style={s.th}>Thanh toán</th>
                            <th style={s.th}>Giao hàng</th>
                            <th style={s.th}>Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map(order => (
                            <tr key={order.id}>
                                <td style={s.td}>#{order.id}</td>
                                <td style={s.td}>{FormatNumber(order.totalAmount)}đ</td>
                                <td style={s.td}>
                                    <span style={getBadgeStyle(order.paymentStatus)}>
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td style={s.td}>
                                    <span style={getBadgeStyle(order.shippingStatus)}>
                                        {order.shippingStatus}
                                    </span>
                                </td>
                                <td style={s.td}>
                                    {new Date(order.createdDate).toLocaleDateString("vi-VN")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;