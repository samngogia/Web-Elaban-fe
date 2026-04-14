import React, { useEffect, useState } from "react";
import {
    getAllOrders,
    updatePaymentStatus,
    updateShippingStatus,
} from "../../api/AdminOrderAPI";

interface OrderDetail {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    fullName: string;
    phoneNumber: string;
    shippingAddress: string;
    paymentStatus: string;
    shippingStatus: string;
    totalAmount: number;
    createdDate: string;
    note?: string;
    orderDetails: OrderDetail[];
}

const AdminOrder: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (err) {
            console.error(err);
            alert("Không thể tải danh sách đơn hàng");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePaymentChange = async (orderId: number, status: string) => {
        try {
            console.log("Token:", localStorage.getItem("token")); // kiểm tra token

            const res = await fetch(
                `http://localhost:8089/admin/orders/${orderId}/payment-status?status=${status}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Response status:", res.status); // kiểm tra status

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            setOrders(prev =>
                prev.map(o => o.id === orderId ? { ...o, paymentStatus: status } : o)
            );
        } catch (err) {
            console.error(err);
            alert("Không thể cập nhật trạng thái thanh toán");
        }
    };


    // Thêm auto-refresh
    useEffect(() => {
        fetchOrders();

        // Tự động reload mỗi 30 giây
        const interval = setInterval(() => {
            fetchOrders();
        }, 30000);

        return () => clearInterval(interval);
    }, []);



    const handleShippingChange = async (
        orderId: number,
        status: string
    ) => {
        try {
            await updateShippingStatus(orderId, status);

            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId
                        ? { ...o, shippingStatus: status }
                        : o
                )
            );
        } catch (err) {
            console.error(err);
            alert("Không thể cập nhật trạng thái giao hàng");
        }
    };

    const s: Record<string, React.CSSProperties> = {
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
        },
        title: {
            fontSize: 22,
            fontWeight: 400,
            margin: 0,
        },
        sub: {
            fontSize: 13,
            color: "#888",
            marginTop: 4,
        },
        card: {
            background: "#fff",
            borderRadius: 12,
            border: "0.5px solid #e8e5e0",
            padding: 24,
            marginBottom: 24,
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
        },
        th: {
            textAlign: "left",
            padding: "10px 12px",
            color: "#aaa",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.06em",
            borderBottom: "0.5px solid #eee",
        },
        td: {
            padding: "12px",
            borderBottom: "0.5px solid #f5f5f5",
            verticalAlign: "middle",
        },
        input: {
            width: "100%",
            padding: "10px 12px",
            border: "0.5px solid #ddd",
            borderRadius: 8,
            fontSize: 13,
            background: "#fff",
            boxSizing: "border-box",
        },
        actionBtn: {
            background: "none",
            border: "0.5px solid #ddd",
            borderRadius: 6,
            padding: "5px 12px",
            fontSize: 12,
            cursor: "pointer",
            color: "#333",
        },
        detailBox: {
            background: "#fafafa",
            border: "0.5px solid #eee",
            borderRadius: 10,
            padding: 16,
            marginTop: 4,
        },
        label: {
            fontSize: 12,
            color: "#888",
            marginBottom: 10,
            fontWeight: 600,
        },
        productRow: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "0.5px solid #f0f0f0",
            fontSize: 13,
        },
        note: {
            marginTop: 16,
            paddingTop: 12,
            borderTop: "0.5px solid #eee",
            fontSize: 13,
            color: "#666",
        },
    };

    return (
        <div>
            <div style={s.header}>
                <div>
                    <h2 style={s.title}>Quản lý đơn hàng</h2>
                    <div style={s.sub}>Theo dõi và cập nhật trạng thái đơn hàng</div>
                    {/* Thêm nút này */}
                    <button
                        style={{
                            background: "none",
                            border: "0.5px solid #ddd",
                            borderRadius: 8,
                            padding: "8px 16px",
                            fontSize: 13,
                            cursor: "pointer"
                        }}
                        onClick={() => fetchOrders()}
                    >
                        🔄 Làm mới
                    </button>
                </div>
            </div>

            <div style={s.card}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    <span style={{ fontSize: 13, color: "#888" }}>
                        {orders.length} đơn hàng
                    </span>
                </div>

                {isLoading ? (
                    <p style={{ color: "#aaa", fontSize: 13 }}>Đang tải...</p>
                ) : (
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>MÃ ĐƠN</th>
                                <th style={s.th}>KHÁCH HÀNG</th>
                                <th style={s.th}>TỔNG TIỀN</th>
                                <th style={s.th}>THANH TOÁN</th>
                                <th style={s.th}>GIAO HÀNG</th>
                                <th style={s.th}>NGÀY TẠO</th>
                                <th style={s.th}></th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <tr>
                                        <td style={s.td}>#{order.id}</td>

                                        <td style={s.td}>
                                            <div style={{ fontWeight: 500 }}>
                                                {order.fullName}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: "#999",
                                                    marginTop: 2,
                                                }}
                                            >
                                                {order.phoneNumber}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: "#999",
                                                    marginTop: 2,
                                                }}
                                            >
                                                {order.shippingAddress}
                                            </div>
                                        </td>

                                        <td style={s.td}>
                                            {order.totalAmount.toLocaleString("vi-VN")}đ
                                        </td>

                                        <td style={s.td}>
                                            <select
                                                style={s.input}
                                                value={order.paymentStatus}
                                                onChange={(e) =>
                                                    handlePaymentChange(
                                                        order.id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="UNPAID">
                                                    Chưa thanh toán
                                                </option>
                                                <option value="PAID">
                                                    Đã thanh toán
                                                </option>
                                            </select>
                                        </td>

                                        <td style={s.td}>
                                            <select
                                                style={s.input}
                                                value={order.shippingStatus}
                                                onChange={(e) =>
                                                    handleShippingChange(
                                                        order.id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="PENDING">
                                                    Chờ xác nhận
                                                </option>
                                                <option value="CONFIRMED">
                                                    Đã xác nhận
                                                </option>
                                                <option value="SHIPPING">
                                                    Đang giao
                                                </option>
                                                <option value="DELIVERED">
                                                    Đã giao
                                                </option>
                                                <option value="CANCELLED">
                                                    Đã hủy
                                                </option>
                                            </select>
                                        </td>

                                        <td style={s.td}>
                                            {new Date(order.createdDate).toLocaleDateString(
                                                "vi-VN"
                                            )}
                                        </td>

                                        <td style={s.td}>
                                            <button
                                                style={s.actionBtn}
                                                onClick={() =>
                                                    setExpandedId(
                                                        expandedId === order.id
                                                            ? null
                                                            : order.id
                                                    )
                                                }
                                            >
                                                {expandedId === order.id
                                                    ? "Ẩn"
                                                    : "Chi tiết"}
                                            </button>
                                        </td>
                                    </tr>

                                    {expandedId === order.id && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                style={{
                                                    ...s.td,
                                                    paddingTop: 0,
                                                    background: "#fff",
                                                }}
                                            >
                                                <div style={s.detailBox}>
                                                    <div style={s.label}>
                                                        SẢN PHẨM TRONG ĐƠN
                                                    </div>

                                                    {order.orderDetails.map((item) => (
                                                        <div
                                                            key={item.productId}
                                                            style={s.productRow}
                                                        >
                                                            <div>
                                                                <div
                                                                    style={{
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    {
                                                                        item.productName
                                                                    }
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        fontSize: 12,
                                                                        color: "#999",
                                                                        marginTop: 2,
                                                                    }}
                                                                >
                                                                    Số lượng: {
                                                                        item.quantity
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div
                                                                style={{
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {(
                                                                    item.price *
                                                                    item.quantity
                                                                ).toLocaleString(
                                                                    "vi-VN"
                                                                )}
                                                                đ
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {order.note && (
                                                        <div style={s.note}>
                                                            <strong>Ghi chú:</strong>{" "}
                                                            {order.note}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminOrder;

