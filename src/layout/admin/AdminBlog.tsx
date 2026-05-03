import React, { useEffect, useState } from "react";

const API = "http://localhost:8089";
const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
});

// MỚI THÊM: Header dành riêng cho việc upload file (không set Content-Type để trình duyệt tự sinh boundary)
const authHeaderForUpload = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const EMPTY_FORM = {
    title: "", summary: "", content: "", thumbnail: "",
    categoryId: "", author: "Admin", isPublished: false,
};

const AdminBlog: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<any>(EMPTY_FORM);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [msg, setMsg] = useState("");

    // MỚI THÊM: State để chứa file ảnh tải lên từ máy và URL xem trước
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const [viewComments, setViewComments] = useState<any[]>([]);
    const [commentPostTitle, setCommentPostTitle] = useState("");
    const [showComments, setShowComments] = useState(false);

    const fetchAll = async () => {
        setIsLoading(true);
        const [postsRes, catsRes] = await Promise.all([
            fetch(`${API}/api/blog/admin/posts`, { headers: authHeader() }),
            fetch(`${API}/api/blog/categories`),
        ]);
        setPosts(await postsRes.json());
        setCategories(await catsRes.json());
        setIsLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    // MỚI THÊM: Reset ảnh khi mở form thêm mới
    const openAdd = () => {
        setEditId(null); setForm(EMPTY_FORM); setMsg(""); setShowForm(true);
        setImageFile(null); setPreviewUrl("");
    };

    // MỚI THÊM: Hiển thị ảnh cũ khi mở form sửa
    const openEdit = (p: any) => {
        setEditId(p.id);
        setForm({
            title: p.title, summary: p.summary ?? "",
            content: p.content ?? "", thumbnail: p.thumbnail ?? "",
            categoryId: p.categoryId ?? "", author: p.author,
            isPublished: p.isPublished,
        });
        setImageFile(null);
        setPreviewUrl(p.thumbnail ?? ""); // Nạp link ảnh cũ vào preview
        setMsg(""); setShowForm(true);
    };

    // MỚI THÊM: Hàm bắt sự kiện khi người dùng chọn file ảnh
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Tạo link ảo để xem trước ảnh
        }
    };

    const handleSave = async () => {
        if (!form.title || !form.content) {
            setMsg("Vui lòng nhập tiêu đề và nội dung!"); return;
        }
        setIsSaving(true);

        try {
            const url = editId ? `${API}/api/blog/admin/posts/${editId}` : `${API}/api/blog/admin/posts`;
            const res = await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: authHeader(),
                body: JSON.stringify({ ...form, categoryId: form.categoryId || null }),
            });

            if (!res.ok) throw new Error("Lỗi lưu thông tin bài viết!");

            // Lấy dữ liệu bài viết vừa lưu (để lấy ID mới nếu là thêm mới)
            const savedPost = await res.json();

            // MỚI THÊM: Logic upload ảnh nếu có file được chọn
            if (imageFile) {
                const postId = editId || savedPost.id;
                const formData = new FormData();
                formData.append("file", imageFile);

                // LƯU Ý: Bạn cần tạo API endpoint này ở Backend Spring Boot (giống phần upload ảnh Product)
                const imgRes = await fetch(`${API}/api/blog/admin/posts/${postId}/upload-thumbnail`, {
                    method: "POST",
                    headers: authHeaderForUpload(), // Không được set Content-Type là application/json
                    body: formData
                });

                if (!imgRes.ok) throw new Error("Lưu bài viết thành công nhưng lỗi khi upload ảnh!");
            }

            setShowForm(false);
            fetchAll();
        } catch (error: any) {
            setMsg(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Xóa bài viết này?")) return;
        await fetch(`${API}/api/blog/admin/posts/${id}`, { method: "DELETE", headers: authHeader() });
        fetchAll();
    };

    const handleTogglePublish = async (id: number) => {
        await fetch(`${API}/api/blog/admin/posts/${id}/toggle-publish`, {
            method: "PATCH", headers: authHeader()
        });
        fetchAll();
    };

    const handleViewComments = async (postSlug: string, title: string) => {
        const res = await fetch(`${API}/api/blog/posts/${postSlug}/comments`);
        const data = await res.json();
        setViewComments(Array.isArray(data) ? data : []);
        setCommentPostTitle(title);
        setShowComments(true);
    };

    const handleDeleteComment = async (id: number, postSlug: string, title: string) => {
        if (!window.confirm("Xóa bình luận này?")) return;
        await fetch(`${API}/api/blog/admin/comments/${id}`, {
            method: "DELETE", headers: authHeader()
        });
        handleViewComments(postSlug, title);
    };

    const s: Record<string, React.CSSProperties> = {
        header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
        addBtn: { background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer" },
        card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", padding: 24 },
        table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
        th: { textAlign: "left" as const, padding: "10px 12px", color: "#aaa", fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", borderBottom: "0.5px solid #eee" },
        td: { padding: "12px", borderBottom: "0.5px solid #f5f5f5", verticalAlign: "middle" as const },
        badge: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 },
        editBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", marginRight: 6 },
        deleteBtn: { background: "none", border: "0.5px solid #ffcdd2", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#d32f2f" },
        overlay: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
        modal: { background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto" as const },
        label: { display: "block", fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 600 },
        input: { width: "100%", padding: "10px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: "border-box" as const },
        textarea: { width: "100%", padding: "10px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: "border-box" as const, minHeight: 200, resize: "vertical" as const },
        thumbnail: { width: "100%", height: 160, objectFit: "cover" as const, borderRadius: 8, marginBottom: 16 },
    };

    return (
        <div>
            <div style={s.header}>
                <h2 style={{ fontSize: 22, fontWeight: 400 }}>Quản lý tin tức</h2>
                <button style={s.addBtn} onClick={openAdd}>+ Viết bài mới</button>
            </div>

            <div style={s.card}>
                {isLoading ? (
                    <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
                        <div className="spinner-border text-secondary mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '15px', fontWeight: 500 }}>
                            Đang tải danh sách bài viết...
                        </p>
                    </div>
                ) : (
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>TIÊU ĐỀ</th>
                                <th style={s.th}>DANH MỤC</th>
                                <th style={s.th}>TÁC GIẢ</th>
                                <th style={s.th}>LƯỢT XEM</th>
                                <th style={s.th}>NGÀY TẠO</th>
                                <th style={s.th}>TRẠNG THÁI</th>
                                <th style={s.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((p: any) => (
                                <tr key={p.id}>
                                    <td style={{ ...s.td, maxWidth: 250 }}>
                                        <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {p.title}
                                        </div>
                                    </td>
                                    <td style={s.td}>{p.categoryName ?? "—"}</td>
                                    <td style={s.td}>{p.author}</td>
                                    <td style={s.td}>{p.viewCount}</td>
                                    <td style={s.td}>
                                        {p.createdDate ? new Date(p.createdDate).toLocaleDateString("vi-VN") : "—"}
                                    </td>
                                    <td style={s.td}>
                                        <span style={{
                                            ...s.badge,
                                            background: p.isPublished ? "#EAF3DE" : "#f0f0f0",
                                            color: p.isPublished ? "#27500A" : "#888"
                                        }}>
                                            {p.isPublished ? "Đã đăng" : "Bản nháp"}
                                        </span>
                                    </td>
                                    <td style={s.td}>
                                        <button style={s.editBtn} onClick={() => openEdit(p)}>Sửa</button>
                                        <button
                                            style={{ ...s.editBtn, color: p.isPublished ? "#633806" : "#27500A" }}
                                            onClick={() => handleTogglePublish(p.id)}
                                        >
                                            {p.isPublished ? "Ẩn" : "Đăng"}
                                        </button>
                                        <button
                                            style={{ ...s.editBtn, marginRight: 6 }}
                                            onClick={() => handleViewComments(p.slug, p.title)}
                                        >
                                            💬
                                        </button>
                                        <button style={s.deleteBtn} onClick={() => handleDelete(p.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div style={s.overlay} onClick={() => setShowForm(false)}>
                    <div style={s.modal} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24 }}>
                            {editId ? "Chỉnh sửa bài viết" : "Viết bài mới"}
                        </h3>

                        {msg && <div style={{ fontSize: 13, padding: "10px 14px", borderRadius: 8, marginBottom: 16, background: "#FCEBEB", color: "#791F1F" }}>{msg}</div>}

                        <label style={s.label}>TIÊU ĐỀ *</label>
                        <input style={s.input} value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            placeholder="Nhập tiêu đề bài viết..." />

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                            <div>
                                <label style={s.label}>DANH MỤC</label>
                                <select style={s.input} value={form.categoryId}
                                    onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={s.label}>TÁC GIẢ</label>
                                <input style={s.input} value={form.author}
                                    onChange={e => setForm({ ...form, author: e.target.value })} />
                            </div>
                        </div>

                        {/* MỚI THÊM: Input chọn ảnh từ thiết bị */}
                        <label style={s.label}>ẢNH THUMBNAIL</label>
                        <input style={s.input} type="file" accept="image/*" onChange={handleImageChange} />
                        {previewUrl && (
                            <img src={previewUrl} alt="thumbnail preview" style={s.thumbnail} />
                        )}

                        <label style={s.label}>TÓM TẮT</label>
                        <textarea style={{ ...s.textarea, minHeight: 80 }} value={form.summary}
                            onChange={e => setForm({ ...form, summary: e.target.value })}
                            placeholder="Mô tả ngắn về bài viết..." />

                        <label style={s.label}>NỘI DUNG *</label>
                        <textarea style={s.textarea} value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            placeholder="Nội dung bài viết (hỗ trợ HTML)..." />

                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                            <input type="checkbox" id="isPublished" checked={form.isPublished}
                                onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                            <label htmlFor="isPublished" style={{ fontSize: 13, cursor: "pointer" }}>
                                Đăng bài ngay
                            </label>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                            <button onClick={() => setShowForm(false)}
                                style={{ background: "none", border: "0.5px solid #ddd", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer" }}>
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="d-flex justify-content-center align-items-center"
                                style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, cursor: "pointer" }}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang lưu...
                                    </>
                                ) : (
                                    "Lưu bài viết"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Các phần khác giữ nguyên (Modal Comments) */}
            {showComments && (
                <>
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 999 }}
                        onClick={() => setShowComments(false)} />
                    <div style={{ position: "fixed", right: 0, top: 0, width: 400, height: "100vh", background: "#fff", borderLeft: "0.5px solid #e8e5e0", padding: 32, overflowY: "auto", zIndex: 1000 }}>
                        <button onClick={() => setShowComments(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>×</button>
                        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Bình luận</h3>
                        <p style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>{commentPostTitle}</p>

                        {viewComments.length === 0 ? (
                            <p style={{ color: "#aaa", fontSize: 13 }}>Chưa có bình luận nào.</p>
                        ) : (
                            viewComments.map((c: any) => (
                                <div key={c.id} style={{ borderBottom: "0.5px solid #f0ede8", paddingBottom: 16, marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={{ fontSize: 13, fontWeight: 500 }}>{c.username}</span>
                                        <span style={{ fontSize: 11, color: "#aaa" }}>
                                            {c.createdDate ? new Date(c.createdDate).toLocaleDateString("vi-VN") : ""}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>{c.content}</p>
                                    <button
                                        style={{ background: "none", border: "0.5px solid #ffcdd2", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", color: "#d32f2f" }}
                                        onClick={() => handleDeleteComment(c.id, "", commentPostTitle)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminBlog;