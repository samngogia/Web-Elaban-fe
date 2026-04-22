import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API = "http://localhost:8089";

const BlogPage: React.FC = () => {
    const [posts, setPosts]           = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading]   = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCat = searchParams.get("category");

    useEffect(() => {
        Promise.all([
            fetch(`${API}/api/blog/posts${selectedCat ? `?categoryId=${selectedCat}` : ""}`).then(r => r.json()),
            fetch(`${API}/api/blog/categories`).then(r => r.json()),
        ]).then(([postsData, catsData]) => {
            setPosts(Array.isArray(postsData) ? postsData : []);
            setCategories(Array.isArray(catsData) ? catsData : []);
            setIsLoading(false);
        });
    }, [selectedCat]);

    const s: Record<string, React.CSSProperties> = {
        page:      { minHeight: "100vh", background: "#f8f7f4", padding: "40px 0", fontFamily: "sans-serif" },
        container: { maxWidth: 1100, margin: "0 auto", padding: "0 20px" },
        layout:    { display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, alignItems: "start" },
        heading:   { fontSize: 28, fontWeight: 400, marginBottom: 8, color: "#1a1a1a" },
        sub:       { fontSize: 13, color: "#aaa", marginBottom: 32 },
        grid:      { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 },
        card:      { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", overflow: "hidden", transition: "box-shadow 0.2s" },
        img:       { width: "100%", height: 200, objectFit: "cover" as const, background: "#f0ede8" },
        body:      { padding: 20 },
        catBadge:  { display: "inline-block", background: "#f0ede8", color: "#666", padding: "3px 10px", borderRadius: 12, fontSize: 11, marginBottom: 10 },
        title:     { fontSize: 15, fontWeight: 500, color: "#1a1a1a", marginBottom: 8, lineHeight: 1.4 },
        summary:   { fontSize: 13, color: "#888", lineHeight: 1.6, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties,
        meta:      { fontSize: 11, color: "#aaa", display: "flex", justifyContent: "space-between" },
        readMore:  { fontSize: 12, color: "#1a1a1a", textDecoration: "none", fontWeight: 500 },
        sidebar:   { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", padding: 24, position: "sticky" as const, top: 20 },
        sideTitle: { fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", color: "#aaa", marginBottom: 16 },
        catItem:   { display: "block", padding: "8px 0", fontSize: 13, color: "#555", textDecoration: "none", borderBottom: "0.5px solid #f5f5f5", cursor: "pointer" },
        catActive: { color: "#1a1a1a", fontWeight: 500 },
    };

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h2 style={s.heading}>Tin tức & Blog</h2>
                <p style={s.sub}>Xu hướng nội thất, mẹo mua sắm và phong cách sống</p>

                <div style={s.layout}>
                    {/* Danh sách bài viết */}
                    <div>
                        {isLoading ? (
                            <p style={{ color: "#aaa" }}>Đang tải...</p>
                        ) : posts.length === 0 ? (
                            <p style={{ color: "#aaa", fontStyle: "italic" }}>Chưa có bài viết nào.</p>
                        ) : (
                            <div style={s.grid}>
                                {posts.map((post: any) => (
                                    <div key={post.id} style={s.card}>
                                        {post.thumbnail ? (
                                            <img src={post.thumbnail} alt={post.title} style={s.img} />
                                        ) : (
                                            <div style={{ ...s.img, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                                                📰
                                            </div>
                                        )}
                                        <div style={s.body}>
                                            {post.categoryName && (
                                                <span style={s.catBadge}>{post.categoryName}</span>
                                            )}
                                            <div style={s.title}>{post.title}</div>
                                            {post.summary && (
                                                <div style={s.summary}>{post.summary}</div>
                                            )}
                                            <div style={s.meta}>
                                                <span>{post.author} · {post.createdDate ? new Date(post.createdDate).toLocaleDateString("vi-VN") : ""}</span>
                                                <span>👁 {post.viewCount}</span>
                                            </div>
                                            <Link to={`/blog/${post.slug}`} style={{ ...s.readMore, display: "block", marginTop: 12 }}>
                                                Đọc tiếp →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar danh mục */}
                    <div style={s.sidebar}>
                        <div style={s.sideTitle}>DANH MỤC</div>
                        <span
                            style={{ ...s.catItem, ...(!selectedCat ? s.catActive : {}) }}
                            onClick={() => setSearchParams({})}
                        >
                            📋 Tất cả bài viết
                        </span>
                        {categories.map((cat: any) => (
                            <span
                                key={cat.id}
                                style={{ ...s.catItem, ...(selectedCat === String(cat.id) ? s.catActive : {}) }}
                                onClick={() => setSearchParams({ category: String(cat.id) })}
                            >
                                📁 {cat.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;