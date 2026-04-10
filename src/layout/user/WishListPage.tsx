import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getFirstImageByProductId } from "../../api/ImageAPI";
import FormatNumber from "../utils/FormatNumber";

const API = "http://localhost:8089";

const WishListPage: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<any[]>([]);
    const [images, setImages] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    const getUserId = (): number => {
        const token = localStorage.getItem("token");
        if (!token) return 0;
        const decoded: any = jwtDecode(token);
        return decoded.userId ?? 0;
    };

    const fetchWishList = async () => {
        const userId = getUserId();
        if (!userId) { navigate("/login"); return; }

        const res = await fetch(`${API}/api/wishlist/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
        setIsLoading(false);

        // Load ảnh song song
        const imageMap: Record<number, string> = {};
        await Promise.all(data.map(async (item: any) => {
            try {
                const imgs = await getFirstImageByProductId(item.productId);
                imageMap[item.productId] = imgs[0]?.url ?? "";
            } catch { }
        }));
        setImages(imageMap);
    };

    useEffect(() => { fetchWishList(); }, []);

    const handleRemove = async (productId: number) => {
        const userId = getUserId();
        await fetch(`${API}/api/wishlist/remove?userId=${userId}&productId=${productId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setItems(prev => prev.filter(i => i.productId !== productId));
    };

    const handleAddToCart = async (productId: number) => {
        const userId = getUserId();

        try {
            const res = await fetch(
                `${API}/cart/add?userId=${userId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        productId,
                        quantity: 1
                    })
                }
            );

            if (!res.ok) {
                const message = await res.text();
                throw new Error(message);
            }

            alert("Đã thêm vào giỏ hàng!");
        } catch (err: any) {
            alert(err.message || "Không thể thêm vào giỏ hàng!");
        }
    };

    const s: Record<string, React.CSSProperties> = {
        page: { minHeight: "100vh", background: "#f8f7f4", padding: "40px 0", fontFamily: "sans-serif" },
        container: { maxWidth: 900, margin: "0 auto", padding: "0 20px" },
        heading: { fontSize: 24, fontWeight: 400, marginBottom: 24, color: "#1a1a1a" },
        grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 },
        card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", overflow: "hidden" },
        img: { width: "100%", height: 200, objectFit: "cover" as const },
        body: { padding: 16 },
        name: { fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 8, lineHeight: 1.4 },
        price: { fontSize: 16, fontWeight: 500, color: "#d0021b", marginBottom: 4 },
        origPrice: { fontSize: 12, color: "#aaa", textDecoration: "line-through" as const, marginBottom: 12 },
        btnRow: { display: "flex", gap: 8 },
        cartBtn: { flex: 1, background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 12, cursor: "pointer" },
        removeBtn: { background: "none", border: "0.5px solid #ffcdd2", borderRadius: 8, padding: "8px 12px", fontSize: 12, cursor: "pointer", color: "#d32f2f" },
        emptyWrap: { textAlign: "center" as const, padding: "80px 0" },
        emptyText: { fontSize: 16, color: "#aaa", marginBottom: 20 },
        shopBtn: { display: "inline-block", padding: "10px 28px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" },
    };

    if (isLoading) return (
        <div style={s.page}>
            <div style={s.container}>
                <p style={{ color: "#aaa", fontSize: 13 }}>Đang tải...</p>
            </div>
        </div>
    );

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h2 style={s.heading}>Sản phẩm yêu thích ({items.length})</h2>

                {items.length === 0 ? (
                    <div style={s.emptyWrap}>
                        <p style={s.emptyText}>Bạn chưa có sản phẩm yêu thích nào.</p>
                        <button style={s.shopBtn} onClick={() => navigate("/")}>
                            Khám phá sản phẩm
                        </button>
                    </div>
                ) : (
                    <div style={s.grid}>
                        {items.map(item => (
                            <div key={item.id} style={s.card}>
                                <Link to={`/product/${item.productId}`}>
                                    <img
                                        src={images[item.productId] || "/no-image.png"}
                                        alt={item.productName}
                                        style={s.img}
                                    />
                                </Link>
                                <div style={s.body}>
                                    <Link to={`/product/${item.productId}`}
                                        style={{ textDecoration: "none" }}>
                                        <div style={s.name}>{item.productName}</div>
                                    </Link>
                                    <div style={s.price}>{FormatNumber(item.sellingPrice)}đ</div>
                                    {item.listPrice > item.sellingPrice && (
                                        <div style={s.origPrice}>{FormatNumber(item.listPrice)}đ</div>
                                    )}
                                    <div style={s.btnRow}>
                                        <button style={s.cartBtn}
                                            onClick={() => handleAddToCart(item.productId)}>
                                            Thêm vào giỏ
                                        </button>
                                        <button style={s.removeBtn}
                                            onClick={() => handleRemove(item.productId)}>
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishListPage;