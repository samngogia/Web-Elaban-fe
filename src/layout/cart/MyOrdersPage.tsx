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
        if (status === "PAID") return { background: "#e6f4ea", color: "#2e7d32" };
        if (status === "REFUNDED") return { background: "#fdecea", color: "#c62828" };
        return { background: "#fff4e5", color: "#ef6c00" };
    };

    const getShippingBadge = (status: string): React.CSSProperties => {
        if (status === "DELIVERED") return { background: "#e6f4ea", color: "#2e7d32" };
        if (status === "CANCELLED") return { background: "#fdecea", color: "#c62828" };
        if (status === "SHIPPING") return { background: "#e3f2fd", color: "#1565c0" };
        return { background: "#eeeeee", color: "#666" };
    };

    const s: Record<string, React.CSSProperties> = {
        page: {
            minHeight: "100vh",
            background: "#f5f6fa",
            padding: "40px 0",
            fontFamily: "Inter, sans-serif"
        },
        container: {
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 16px"
        },
        heading: {
            fontSize: 26,
            fontWeight: 600,
            marginBottom: 24,
            color: "#222"
        },
        card: {
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            marginBottom: 16,
            overflow: "hidden",
            transition: "all 0.25s ease"
        },
        cardHeader: {
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            borderBottom: "1px solid #f1f1f1"
        },
        orderId: {
            fontSize: 15,
            fontWeight: 600,
            color: "#111"
        },
        date: {
            fontSize: 12,
            color: "#888",
            marginTop: 4
        },
        badge: {
            padding: "4px 12px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.3px"
        },
        cardBody: {
            padding: "16px 20px",
            background: "#fafafa"
        },
        detailRow: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            marginBottom: 6,
            color: "#444"
        },
        productRow: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            padding: "10px 0",
            borderBottom: "1px dashed #eee"
        },
        total: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            fontWeight: 600,
            paddingTop: 12
        },
        totalPrice: {
            color: "#e53935"
        },
        emptyText: {
            textAlign: "center",
            color: "#999",
            padding: "60px 0",
            fontSize: 14
        },
        shopBtn: {
            marginTop: 16,
            padding: "10px 24px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13
        }
    };

    if (isLoading) return (
        <div style={s.page}>
            <div style={s.container}>
                {/* Dùng Flexbox để căn giữa spinner và text theo chiều dọc */}
                <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
                    <div className="spinner-border text-secondary mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted" style={{ fontSize: '15px', fontWeight: 500 }}>
                        Đang tải đơn hàng...
                    </p>
                </div>
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
                        <div
                            key={order.id}
                            style={s.card}
                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                        >
                            {/* Header */}
                            <div
                                style={s.cardHeader}
                                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                            >
                                <div>
                                    <div style={s.orderId}>Đơn hàng #{order.id}</div>
                                    <div style={s.date}>
                                        {new Date(order.createdDate).toLocaleDateString("vi-VN")}
                                    </div>
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

                            {/* Body */}
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
                                        <span style={{ maxWidth: 300, textAlign: "right" }}>
                                            {order.shippingAddress}
                                        </span>
                                    </div>

                                    <div style={{ borderTop: "1px solid #eee", margin: "12px 0" }} />

                                    {order.orderDetails?.map((detail: any, i: number) => (
                                        <div key={i} style={s.productRow}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <img
                                                    src={
                                                        detail.image?.startsWith("http")
                                                            ? detail.image
                                                            : `http://localhost:8089/images/${detail.image}`
                                                    }
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                        borderRadius: 8,
                                                        objectFit: "cover"
                                                    }}
                                                    alt=""
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{detail.productName}</div>
                                                    <div style={{ color: "#888", fontSize: 12 }}>Số lượng: {detail.quantity}</div>
                                                </div>
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{FormatNumber(detail.price * detail.quantity)}đ</span>
                                        </div>
                                    ))}

                                    <div style={s.total}>
                                        <span>Tổng cộng</span>
                                        <span style={s.totalPrice}>
                                            {FormatNumber(order.totalAmount)}đ
                                        </span>
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