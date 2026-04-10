import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // Nên thêm thư viện này để báo trạng thái


interface ReviewItem {
    id: number;
    content: string;
    rating: number;
    createdDate: string;
    hidden: boolean;
    approved: boolean;
    adminReply: string;
    replyDate?: string;
    user?: { username: string };
    product?: { name: string };
}

const AdminReview: React.FC = () => {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

    const token = localStorage.getItem("token");
    const API_BASE = "http://localhost:8089/admin/reviews";

    // 1. Fetch dữ liệu
    const loadReviews = async () => {
        // Nếu không có token, đừng gọi API làm gì cho phí công
        if (!token) {
            setLoading(false);
            toast.error("Vui lòng đăng nhập!");
            return;
        }


        try {
            setLoading(true);

            console.log("TOKEN =", token);

            const response = await fetch(API_BASE, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // NẾU LỖI (401, 403, 500...) THÌ DỪNG LẠI NGAY
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setReviews(data);
        } catch (error: any) {
            console.error("Fetch error:", error);
        // Quan trọng: Không set lại một state nào đó gây render lại vòng lặp ở đây
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadReviews(); }, []);

    // 2. Các hàm xử lý Action (Approve, Hide, Reply)
    const handleAction = async (id: number, endpoint: string, method: string = "PUT", body?: any) => {
        try {
            const response = await fetch(`${API_BASE}/${id}/${endpoint}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: body ? JSON.stringify(body) : null,
            });

            if (response.ok) {
                toast.success("Thực hiện thao tác thành công!");
                loadReviews();
            } else {
                toast.error("Thao tác thất bại!");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi!");
        }
    };

    // 3. Logic lọc dữ liệu (Optimize với useMemo)
    const filteredReviews = useMemo(() => {
        return reviews.filter((r) => {
            const matchSearch = (r.content + r.user?.username + r.product?.name)
                .toLowerCase().includes(search.toLowerCase());

            if (statusFilter === "pending") return matchSearch && !r.approved;
            if (statusFilter === "approved") return matchSearch && r.approved;
            if (statusFilter === "hidden") return matchSearch && !r.hidden;
            if (statusFilter === "replied") return matchSearch && !!r.adminReply;
            return matchSearch;
        });
    }, [reviews, search, statusFilter]);

    return (
        <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <ToastContainer position="top-right" autoClose={2000} />

            {/* Header & Stats */}
            <div className="mb-4 d-flex justify-content-between align-items-end">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Quản lý đánh giá</h2>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
                            <li className="breadcrumb-item active">Reviews</li>
                        </ol>
                    </nav>
                </div>
                <div className="text-end">
                    <span className="badge bg-white text-dark shadow-sm p-2 px-3 border">
                        Tổng số: <strong>{reviews.length}</strong> đánh giá
                    </span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-3">
                    <div className="row g-3">
                        <div className="col-md-7">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Tìm theo sản phẩm, khách hàng hoặc nội dung..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="d-flex gap-2">
                                <select className="form-select w-100" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="pending">Chờ duyệt</option>
                                    <option value="approved">Đã duyệt</option>
                                    <option value="hidden">Đã ẩn</option>
                                    <option value="replied">Đã phản hồi</option>
                                </select>
                                <button className="btn btn-outline-secondary" onClick={loadReviews}>
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="card border-0 shadow-sm rounded-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Khách hàng / SP</th>
                                <th>Đánh giá</th>
                                <th style={{ width: '30%' }}>Nội dung & Phản hồi</th>
                                <th>Trạng thái</th>
                                <th className="text-center pe-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Đang tải...</td></tr>
                            ) : filteredReviews.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-5">Không tìm thấy đánh giá nào.</td></tr>
                            ) : (
                                filteredReviews.map((item) => (
                                    <tr key={item.id}>
                                        <td className="ps-4">
                                            <div className="fw-bold text-primary">{item.user?.username}</div>
                                            <div className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>
                                                {item.product?.name}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-warning fw-bold">
                                                {item.rating} <i className="bi bi-star-fill small"></i>
                                            </div>
                                            <div className="text-muted" style={{ fontSize: '11px' }}>
                                                {new Date(item.createdDate).toLocaleDateString("vi-VN")}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="mb-2 p-2 rounded bg-light" style={{ fontSize: '0.9rem' }}>
                                                {item.content}
                                            </div>
                                            {item.adminReply ? (
                                                <div className="p-2 rounded border-start border-4 border-primary bg-white small">
                                                    <strong className="text-primary">Admin:</strong> {item.adminReply}
                                                </div>
                                            ) : (
                                                <div className="input-group input-group-sm mt-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Nhập phản hồi..."
                                                        value={replyText[item.id] || ""}
                                                        onChange={(e) => setReplyText({ ...replyText, [item.id]: e.target.value })}
                                                    />
                                                    <button className="btn btn-primary" onClick={() => handleAction(item.id, "reply", "PUT", { reply: replyText[item.id] })}>
                                                        Gửi
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column gap-1">
                                                <span className={`badge ${item.approved ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} border`}>
                                                    {item.approved ? "Đã duyệt" : "Chờ duyệt"}
                                                </span>
                                                <span className={`badge ${item.hidden ? 'bg-info-subtle text-info' : 'bg-danger-subtle text-danger'} border`}>
                                                    {item.hidden ? "Đang hiện" : "Đã ẩn"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-center pe-4">
                                            <div className="btn-group shadow-sm">
                                                {!item.approved && (
                                                    <button className="btn btn-sm btn-outline-success" onClick={() => handleAction(item.id, "approve")}>
                                                        Duyệt
                                                    </button>
                                                )}
                                                <button
                                                    className={`btn btn-sm ${item.hidden ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                                                    onClick={() => handleAction(item.id, item.hidden ? "hide" : "show")}
                                                >
                                                    {item.hidden ? "Ẩn" : "Hiện"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReview;