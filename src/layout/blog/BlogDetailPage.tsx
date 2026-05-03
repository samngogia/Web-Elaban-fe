import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = "http://localhost:8089";

const BlogDetailPage: React.FC = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Thêm state
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [commentMsg, setCommentMsg] = useState("");
    const [commentError, setCommentError] = useState(false);

    const fetchComments = () => {
        fetch(`${API}/api/blog/posts/${slug}/comments`)
            .then(r => r.json())
            .then(data => setComments(Array.isArray(data) ? data : []));
    };

    useEffect(() => {
        if (!slug) return;
        fetch(`${API}/api/blog/posts/${slug}`)
            .then(r => r.json())
            .then(data => { setPost(data); setIsLoading(false); })
            .catch(() => setIsLoading(false));
        fetchComments();
    }, [slug]);


    // Thêm vào useEffect fetch post


    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        const token = localStorage.getItem("token");
        if (!token) {
            setCommentMsg("Vui lòng đăng nhập để bình luận!");
            setCommentError(true);
            return;
        }
        setIsPosting(true);
        try {
            const res = await fetch(`${API}/api/blog/posts/${slug}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });
            if (res.ok) {
                setNewComment("");
                setCommentMsg("");
                fetchComments();
            } else {
                const text = await res.text();
                setCommentMsg(text); setCommentError(true);
            }
        } catch {
            setCommentMsg("Lỗi kết nối!"); setCommentError(true);
        } finally { setIsPosting(false); }
    };

    const s: Record<string, React.CSSProperties> = {
        page: { minHeight: "100vh", background: "#f8f7f4", padding: "40px 0", fontFamily: "sans-serif" },
        container: { maxWidth: 760, margin: "0 auto", padding: "0 20px" },
        back: { fontSize: 13, color: "#888", textDecoration: "none", display: "inline-block", marginBottom: 24 },
        thumbnail: { width: "100%", height: 400, objectFit: "cover" as const, borderRadius: 12, marginBottom: 32 },
        catBadge: { display: "inline-block", background: "#f0ede8", color: "#666", padding: "4px 12px", borderRadius: 12, fontSize: 12, marginBottom: 16 },
        title: { fontSize: 32, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 16 },
        meta: { fontSize: 13, color: "#aaa", marginBottom: 32, paddingBottom: 24, borderBottom: "0.5px solid #e8e5e0" },
        content: { fontSize: 15, color: "#333", lineHeight: 1.8 },
    };

    if (isLoading) return (
        <div style={s.page}>
            <div style={s.container}>
                <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
                    <div className="spinner-border text-secondary mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted" style={{ fontSize: '15px', fontWeight: 500 }}>
                        Đang tải nội dung...
                    </p>
                </div>
            </div>
        </div>
    );

    if (!post) return (
        <div style={s.page}><div style={s.container}><p style={{ color: "#d32f2f" }}>Không tìm thấy bài viết.</p></div></div>
    );
    return (
        <div style={s.page}>
            <div style={s.container}>
                <Link to="/blog" style={s.back}>← Quay lại Blog</Link>

                {post.categoryName && <div style={s.catBadge}>{post.categoryName}</div>}
                <h1 style={s.title}>{post.title}</h1>
                <div style={s.meta}>
                    Bởi <strong>{post.author}</strong> · {post.createdDate ? new Date(post.createdDate).toLocaleDateString("vi-VN") : ""} · 👁 {post.viewCount} lượt xem
                </div>

                {post.thumbnail && (
                    <img src={post.thumbnail} alt={post.title} style={s.thumbnail} />
                )}

                <div
                    style={s.content}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
                {/* Bình luận */}
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: "0.5px solid #e8e5e0" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24 }}>
                        Bình luận ({comments.length})
                    </h3>

                    {/* Form gửi bình luận */}
                    <div style={{ background: "#fafaf8", borderRadius: 10, padding: 20, marginBottom: 28, border: "0.5px solid #e8e5e0" }}>
                        <textarea
                            style={{ width: "100%", padding: "10px 14px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, resize: "vertical" as const, minHeight: 80, boxSizing: "border-box" as const, marginBottom: 10 }}
                            placeholder="Viết bình luận của bạn..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            {commentMsg && (
                                <span style={{ fontSize: 12, color: commentError ? "#d32f2f" : "#27500A" }}>
                                    {commentMsg}
                                </span>
                            )}
                            <button
                                onClick={handlePostComment}
                                disabled={isPosting}
                                style={{ marginLeft: "auto", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, cursor: "pointer" }}
                                className="d-flex align-items-center"
                            >
                                {isPosting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang gửi...
                                    </>
                                ) : (
                                    "Gửi bình luận"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Danh sách bình luận */}
                    {comments.length === 0 ? (
                        <p style={{ color: "#aaa", fontSize: 13, fontStyle: "italic" }}>
                            Chưa có bình luận nào. Hãy là người đầu tiên!
                        </p>
                    ) : (
                        comments.map((c: any) => (
                            <div key={c.id} style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e8e5e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 500, color: "#666", flexShrink: 0 }}>
                                    {c.username?.[0]?.toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{ fontSize: 13, fontWeight: 500 }}>{c.username}</span>
                                        <span style={{ fontSize: 11, color: "#aaa" }}>
                                            {c.createdDate ? new Date(c.createdDate).toLocaleDateString("vi-VN") : ""}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, background: "#fff", padding: "10px 14px", borderRadius: 8, border: "0.5px solid #f0ede8" }}>
                                        {c.content}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;