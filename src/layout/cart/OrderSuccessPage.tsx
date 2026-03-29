import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormatNumber from "../utils/FormatNumber";

const OrderSuccessPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    const styles: Record<string, React.CSSProperties> = {
        page: {
            minHeight: "100vh",
            background: "#f8f7f4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Georgia', serif",
        },
        card: {
            background: "#fff",
            borderRadius: 16,
            padding: "48px 56px",
            textAlign: "center",
            border: "0.5px solid #e8e5e0",
            maxWidth: 480,
            width: "100%",
        },
        icon: {
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#f0faf4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: 28,
        },
        heading: {
            fontSize: 24,
            fontWeight: 400,
            color: "#1a1a1a",
            marginBottom: 8,
        },
        subtext: {
            fontSize: 14,
            color: "#888",
            marginBottom: 32,
        },
        row: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            color: "#555",
            marginBottom: 10,
            textAlign: "left" as const,
        },
        value: {
            fontWeight: 500,
            color: "#1a1a1a",
        },
        divider: {
            borderTop: "0.5px solid #f0ede8",
            margin: "20px 0",
        },
        btn: {
            display: "block",
            width: "100%",
            padding: "13px",
            background: "#1a1a1a",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 14,
            cursor: "pointer",
            marginBottom: 10,
        },
        btnOutline: {
            display: "block",
            width: "100%",
            padding: "13px",
            background: "transparent",
            color: "#1a1a1a",
            border: "0.5px solid #ddd",
            borderRadius: 10,
            fontSize: 14,
            cursor: "pointer",
        },
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.icon}>✓</div>
                <h2 style={styles.heading}>Order placed!</h2>
                <p style={styles.subtext}>
                    Thank you for your purchase. We'll process your order shortly.
                </p>

                {order && (
                    <>
                        <div style={styles.row}>
                            <span>Order ID</span>
                            <span style={styles.value}>#{order.orderId}</span>
                        </div>
                        <div style={styles.row}>
                            <span>Total amount</span>
                            <span style={styles.value}>{FormatNumber(order.totalAmount)}đ</span>
                        </div>
                        <div style={styles.row}>
                            <span>Payment status</span>
                            <span style={styles.value}>{order.paymentStatus}</span>
                        </div>
                        <div style={styles.row}>
                            <span>Shipping status</span>
                            <span style={styles.value}>{order.shippingStatus}</span>
                        </div>
                    </>
                )}

                <div style={styles.divider} />

                <button style={styles.btn} onClick={() => navigate("/")}>
                    Continue shopping
                </button>
                <button style={styles.btnOutline} onClick={() => navigate("/orders")}>
                    View my orders
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessPage;