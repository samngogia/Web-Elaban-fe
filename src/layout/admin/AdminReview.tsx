import React, { useEffect, useState } from "react";

const API = "http://localhost:8089";
const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
});

const AdminReview: React.FC = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending">("pending");

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            // 1. SỬA: Gọi đúng path "allReviews" bạn đã cấu hình trong Repository
            // Lưu ý: Nếu backend có base-path là /api thì thêm vào đầu
            const url = `${API}/reviews/search/allReviews`;

            const res = await fetch(url, { headers: authHeader() });

            if (!res.ok) throw new Error("Không thể lấy dữ liệu");

            const data = await res.json();

            // 2. SỬA: Spring Data REST trả về dữ liệu nằm trong _embedded.reviews
            // Ta dùng toán tử ?. để tránh lỗi nếu dữ liệu trống
            const actualReviews = data._embedded?.reviews || [];

            setReviews(actualReviews);
        } catch (error) {
            console.error("Lỗi fetch admin reviews:", error);
            setReviews([]); // Trả về mảng rỗng nếu lỗi
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, [filter]);

    const handleApprove = async (id: number) => {
        await fetch(`${API}/admin/reviews/${id}/approve`, {
            method: "PUT", headers: authHeader()
        });
        fetchReviews();
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Xóa đánh giá này?")) return;
        await fetch(`${API}/admin/reviews/${id}`, {
            method: "DELETE", headers: authHeader()
        });
        fetchReviews();
    };

    const s: Record<string, React.CSSProperties> = {
        header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
        card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", padding: 24 },
        table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
        th: { textAlign: "left" as const, padding: "10px 12px", color: "#aaa", fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", borderBottom: "0.5px solid #eee" },
        td: { padding: "12px", borderBottom: "0.5px solid #f5f5f5", verticalAlign: "middle" as const },
        approveBtn: { background: "#EAF3DE", color: "#27500A", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", marginRight: 6 },
        deleteBtn: { background: "none", border: "0.5px solid #ffcdd2", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#d32f2f" },
        filterBtn: { padding: "6px 14px", border: "0.5px solid #ddd", borderRadius: 20, fontSize: 12, cursor: "pointer", marginRight: 8, background: "#fff" },
        filterBtnActive: { background: "#1a1a1a", color: "#fff", border: "0.5px solid #1a1a1a" },
        badge: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 },
    };

    return (
        <div>
            <div style={s.header}>
                <h2 style={{ fontSize: 22, fontWeight: 400 }}>Quản lý đánh giá</h2>
            </div>

            <div style={{ marginBottom: 16 }}>
                <button
                    style={{ ...s.filterBtn, ...(filter === "pending" ? s.filterBtnActive : {}) }}
                    onClick={() => setFilter("pending")}
                >
                    Chờ duyệt
                </button>
                <button
                    style={{ ...s.filterBtn, ...(filter === "all" ? s.filterBtnActive : {}) }}
                    onClick={() => setFilter("all")}
                >
                    Tất cả
                </button>
            </div>

            <div style={s.card}>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
                    {reviews.length} đánh giá
                </div>

                {isLoading ? (
                    <p style={{ color: "#aaa", fontSize: 13 }}>Đang tải...</p>
                ) : reviews.length === 0 ? (
                    <p style={{ color: "#aaa", fontSize: 13, fontStyle: "italic" }}>
                        Không có đánh giá nào.
                    </p>
                ) : (
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>SẢN PHẨM</th>
                                <th style={s.th}>NGƯỜI DÙNG</th>
                                <th style={s.th}>NỘI DUNG</th>
                                <th style={s.th}>SAO</th>
                                <th style={s.th}>NGÀY GỬI</th>
                                <th style={s.th}>TRẠNG THÁI</th>
                                <th style={s.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map(review => (
                                <tr key={review.id}>
                                    <td style={s.td}>
                                        <div style={{ fontWeight: 500, fontSize: 12 }}>
                                            {review.productName}
                                        </div>
                                        <div style={{ fontSize: 11, color: "#aaa" }}>
                                            #{review.productId}
                                        </div>
                                    </td>
                                    <td style={s.td}>{review.username}</td>
                                    <td style={{ ...s.td, maxWidth: 250 }}>
                                        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.4 }}>
                                            {review.content}
                                        </div>
                                    </td>
                                    <td style={s.td}>
                                        <div>
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <span key={s} style={{
                                                    color: s <= review.rating ? "#f5a623" : "#ddd",
                                                    fontSize: 14
                                                }}>★</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={s.td}>
                                        {review.createdDate
                                            ? new Date(review.createdDate).toLocaleDateString("vi-VN")
                                            : "—"}
                                    </td>
                                    <td style={s.td}>
                                        <span style={{
                                            ...s.badge,
                                            background: review.approved ? "#EAF3DE" : "#FAEEDA",
                                            color: review.approved ? "#27500A" : "#633806"
                                        }}>
                                            {review.approved ? "Đã duyệt" : "Chờ duyệt"}
                                        </span>
                                    </td>
                                    <td style={s.td}>
                                        {!review.approved && (
                                            <button style={s.approveBtn} onClick={() => handleApprove(review.id)}>
                                                Duyệt
                                            </button>
                                        )}
                                        <button style={s.deleteBtn} onClick={() => handleDelete(review.id)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminReview;