import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import FormatNumber from "../utils/FormatNumber";

const MyOrdersPage: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const getUserId = (): number => {
        const token = localStorage.getItem("token");
        if (!token) return 0;
        const decoded: any = jwtDecode(token);
        return decoded.userId ?? 0;
    };

    
    const userId = getUserId();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:8089/order/my-orders/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                return res.json();
            })
            .then((data) => {
                setOrders(data);
            })
            .catch((err) => {
                console.error("Lỗi tải đơn hàng:", err);

                if (err.message.includes("401")) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [navigate]);

    const getPaymentBadge = (status: string): React.CSSProperties => {
        if (status === "PAID") return { background: "#EAF3DE", color: "#27500A" };
        if (status === "REFUNDED") return { background: "#FCEBEB", color: "#791F1F" };
        return { background: "#FAEEDA", color: "#633806" };
    };

    const getShippingBadge = (status: string): React.CSSProperties => {
        if (status === "DELIVERED") return { background: "#EAF3DE", color: "#27500A" };
        if (status === "CANCELLED") return { background: "#FCEBEB", color: "#791F1F" };
        if (status === "SHIPPING") return { background: "#E6F1FB", color: "#0C447C" };
        return { background: "#f0f0f0", color: "#666" };
    };

    const s: Record<string, React.CSSProperties> = {
        page: { minHeight: "100vh", background: "#f8f7f4", padding: "40px 0", fontFamily: "sans-serif" },
        container: { maxWidth: 800, margin: "0 auto", padding: "0 20px" },
        heading: { fontSize: 24, fontWeight: 400, marginBottom: 24, color: "#1a1a1a" },
        card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", marginBottom: 16, overflow: "hidden" },
        cardHeader: { padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: "0.5px solid #f0ede8" },
        orderId: { fontSize: 14, fontWeight: 500, color: "#1a1a1a" },
        badge: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 },
        cardBody: { padding: "16px 20px" },
        detailRow: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 8 },
        productRow: { display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", borderBottom: "0.5px solid #f5f5f5" },
        total: { display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 500, paddingTop: 12, marginTop: 4 },
        emptyText: { textAlign: "center" as const, color: "#aaa", padding: "60px 0", fontSize: 14 },
        shopBtn: { display: "inline-block", marginTop: 16, padding: "10px 24px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" },
    };

    if (isLoading) return (
        <div style={s.page}>
            <div style={s.container}>
                <p style={{ color: "#aaa", fontSize: 13 }}>Đang tải đơn hàng...</p>
            </div>
        </div>
    );

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h2 style={s.heading}>Đơn hàng của tôi</h2>

                {orders.length === 0 ? (
                    <div style={s.emptyText}>
                        <p>Bạn chưa có đơn hàng nào.</p>
                        <button style={s.shopBtn} onClick={() => navigate("/")}>
                            Mua sắm ngay
                        </button>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} style={s.card}>
                            {/* Header */}
                            <div
                                style={s.cardHeader}
                                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                            >
                                <div>
                                    <span style={s.orderId}>Đơn #{order.id}</span>
                                    <span style={{ fontSize: 12, color: "#aaa", marginLeft: 12 }}>
                                        {new Date(order.createdDate).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <span style={{ ...s.badge, ...getPaymentBadge(order.paymentStatus) }}>
                                        {order.paymentStatus}
                                    </span>
                                    <span style={{ ...s.badge, ...getShippingBadge(order.shippingStatus) }}>
                                        {order.shippingStatus}
                                    </span>
                                    <span style={{ fontSize: 12, color: "#aaa" }}>
                                        {expandedId === order.id ? "▲" : "▼"}
                                    </span>
                                </div>
                            </div>

                            {/* Body — mở rộng khi click */}
                            {expandedId === order.id && (
                                <div style={s.cardBody}>
                                    <div style={s.detailRow}>
                                        <span>Người nhận</span>
                                        <span>{order.fullName}</span>
                                    </div>
                                    <div style={s.detailRow}>
                                        <span>Số điện thoại</span>
                                        <span>{order.phoneNumber}</span>
                                    </div>
                                    <div style={s.detailRow}>
                                        <span>Địa chỉ giao hàng</span>
                                        <span style={{ maxWidth: 300, textAlign: "right" as const }}>
                                            {order.shippingAddress}
                                        </span>
                                    </div>

                                    <div style={{ borderTop: "0.5px solid #f0ede8", margin: "12px 0" }} />

                                    {/* Danh sách sản phẩm */}
                                    {order.orderDetails?.map((detail: any, i: number) => (
                                        <div key={i} style={s.productRow}>
                                            <span>{detail.productName} × {detail.quantity}</span>
                                            <span>{FormatNumber(detail.price * detail.quantity)}đ</span>
                                        </div>
                                    ))}

                                    <div style={s.total}>
                                        <span>Tổng cộng</span>
                                        <span style={{ color: "#d0021b" }}>{FormatNumber(order.totalAmount)}đ</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;