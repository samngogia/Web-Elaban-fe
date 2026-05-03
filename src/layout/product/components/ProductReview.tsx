import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import renderRating from "../../utils/StarRating";



interface ProductReviewProps {
    productId: number;
}

const ProductReview: React.FC<ProductReviewProps> = ({ productId }) => {
    const [reviewList, setReviewList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [rating, setRating] = useState<number>(5);
    const [content, setContent] = useState("");
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState("");
    const [isError, setIsError] = useState(false);

    const getUserId = (): number => {
        const token = localStorage.getItem("token");
        if (!token) return 0;
        try {
            const decoded: any = jwtDecode(token);
            return decoded.userId ?? 0;
        } catch { return 0; }
    };

    const fetchReviews = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Đổi /api/reviews thành /reviews
            const response = await fetch(
                `http://localhost:8089/reviews/search/findByProduct_IdOrderByCreatedDateDesc?productId=${productId}`
            );
            const responseText = await response.text();
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            if (!responseText.trim()) { setReviewList([]); return; }
            const data = JSON.parse(responseText);
            setReviewList(data._embedded?.reviews ?? []);
        } catch (err: any) {
            setError(err.message);
            setReviewList([]);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => { fetchReviews(); }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = getUserId();
        if (!userId) {
            setSubmitMsg("Vui lòng đăng nhập để đánh giá!");
            setIsError(true);
            return;
        }
        if (!content.trim()) {
            setSubmitMsg("Vui lòng nhập nội dung đánh giá!");
            setIsError(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("http://localhost:8089/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ productId, userId, rating, content })
            });
            const text = await res.text();
            if (res.ok) {
                setSubmitMsg("Đánh giá của bạn đã được đăng!");  // đổi message
                setIsError(false);
                setContent("");
                setRating(5);
                fetchReviews(); // reload luôn
            } else {
                setSubmitMsg(text);
                setIsError(true);
            }
        } catch (err: any) {
            setSubmitMsg("Lỗi kết nối!");
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const s: Record<string, React.CSSProperties> = {
        section: { marginTop: 32 },
        title: { fontSize: 16, fontWeight: 500, marginBottom: 20 },
        formCard: { background: "#fafaf8", borderRadius: 10, padding: 20, marginBottom: 24, border: "0.5px solid #e8e5e0" },
        formTitle: { fontSize: 14, fontWeight: 500, marginBottom: 16 },
        starRow: { display: "flex", gap: 4, marginBottom: 16 },
        star: { fontSize: 28, cursor: "pointer", transition: "transform 0.1s" },
        textarea: { width: "100%", padding: "10px 14px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, resize: "vertical" as const, minHeight: 80, boxSizing: "border-box" as const, marginBottom: 12 },
        submitBtn: { background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, cursor: "pointer" },
        msg: { fontSize: 13, padding: "8px 12px", borderRadius: 8, marginTop: 10 },
        reviewItem: { borderBottom: "0.5px solid #f0ede8", paddingBottom: 16, marginBottom: 16 },
        reviewer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
        name: { fontSize: 13, fontWeight: 500 },
        date: { fontSize: 11, color: "#aaa" },
        reviewText: { fontSize: 13, color: "#555", lineHeight: 1.6 },
        noReview: { fontSize: 13, color: "#aaa", fontStyle: "italic" },
    };

    return (
        <div style={s.section}>
            <div style={s.title}>Đánh giá sản phẩm ({reviewList.length})</div>

            {/* Form viết đánh giá */}
            <div style={s.formCard}>
                <div style={s.formTitle}>Viết đánh giá của bạn</div>
                <form onSubmit={handleSubmit}>
                    {/* Chọn số sao */}
                    <div style={s.starRow}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                style={{
                                    ...s.star,
                                    color: star <= (hoverRating || rating) ? "#f5a623" : "#ddd",
                                    transform: star <= (hoverRating || rating) ? "scale(1.15)" : "scale(1)"
                                }}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                ★
                            </span>
                        ))}
                        <span style={{ fontSize: 13, color: "#888", marginLeft: 8, alignSelf: "center" }}>
                            {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"][hoverRating || rating]}
                        </span>
                    </div>

                    <textarea
                        style={s.textarea}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />

                    <button type="submit" style={s.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Đang gửi...
                            </>
                        ) : (
                            "Gửi đánh giá"
                        )}
                    </button>

                    {submitMsg && (
                        <div style={{
                            ...s.msg,
                            background: isError ? "#FCEBEB" : "#EAF3DE",
                            color: isError ? "#791F1F" : "#27500A"
                        }}>
                            {submitMsg}
                        </div>
                    )}
                </form>
            </div>

            {/* Danh sách đánh giá */}
            {isLoading ? (
                <div className="d-flex justify-content-center py-4">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <p style={{ color: "#d32f2f", fontSize: 13 }}>{error}</p>
            ) : reviewList.length === 0 ? (
                <p style={s.noReview}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
            ) : (
                reviewList.map((review, index) => (
                    <div key={review.id ?? index} style={s.reviewItem}>
                        <div style={s.reviewer}>
                            <span style={s.name}>
                                {review.user?.username ?? "Ẩn danh"}
                            </span>
                            <span style={s.date}>
                                {review.createdDate
                                    ? new Date(review.createdDate).toLocaleDateString("vi-VN")
                                    : ""}
                            </span>
                        </div>
                        <div style={{ marginBottom: 6 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <span key={s} style={{ color: s <= review.rating ? "#f5a623" : "#ddd", fontSize: 16 }}>★</span>
                            ))}
                        </div>
                        <div style={s.reviewText}>{review.content}</div>
                    </div>
                ))
            )}

        </div>


    );
};

export default ProductReview;