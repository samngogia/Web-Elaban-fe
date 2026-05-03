import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentResultPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        const responseCode = searchParams.get("vnp_ResponseCode");
        if (responseCode === "00") {
            setIsSuccess(true);
            // Gọi backend xác nhận
            fetch(`http://localhost:8089/vnpay/payment-return?${searchParams.toString()}`)
                .then(() => {
                    // Đợi 1 giây rồi redirect về trang đơn hàng
                    setTimeout(() => {
                        navigate("/my-orders");
                    }, 2000);
                })
                .catch(console.error);
        } else {
            setIsSuccess(false);
        }
    }, []);

    const s: Record<string, React.CSSProperties> = {
        page: { minHeight: "100vh", background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif" },
        card: { background: "#fff", borderRadius: 16, padding: "48px 56px", textAlign: "center", border: "0.5px solid #e8e5e0", maxWidth: 440, width: "100%" },
        icon: { width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 28 },
        heading: { fontSize: 24, fontWeight: 400, marginBottom: 8 },
        sub: { fontSize: 14, color: "#888", marginBottom: 32 },
        btn: { padding: "12px 32px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, cursor: "pointer" },
    };

    if (isSuccess === null) {
        return (
            <div style={s.page}>
                {/* Lớp bọc bên trong để căn giữa toàn bộ vòng xoay và chữ */}
                <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '50vh' }}>
                    <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h5 className="text-muted" style={{ fontWeight: 500 }}>Đang xử lý...</h5>
                </div>
            </div>
        );
    }

    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={{ ...s.icon, background: isSuccess ? "#f0faf4" : "#FCEBEB" }}>
                    {isSuccess ? "✓" : "✗"}
                </div>
                <h2 style={{ ...s.heading, color: isSuccess ? "#27500A" : "#791F1F" }}>
                    {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
                </h2>
                <p style={s.sub}>
                    {isSuccess
                        ? "Đơn hàng của bạn đã được xác nhận."
                        : "Giao dịch không thành công. Vui lòng thử lại."}
                </p>
                <button style={s.btn} onClick={() => navigate("/")}>
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};
export { };
export default PaymentResultPage;