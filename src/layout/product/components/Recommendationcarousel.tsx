import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getFirstImageByProductId } from "../../../api/ImageAPI";
import FormatNumber from "../../utils/FormatNumber";

interface Props {
    productId: number;
    type: "similar" | "bought-together";
}

const RecommendationCarousel: React.FC<Props> = ({ productId, type }) => {
    const [items, setItems] = useState<any[]>([]);
    const [images, setImages] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const CARD_WIDTH = 200;
    const CARD_GAP = 16;
    const VISIBLE = 4;

    const defaultTitle = type === "similar"
        ? "Sản phẩm tương tự"
        : "Khách hàng mua sản phẩm này thường mua cùng";
    const [actualTitle, setActualTitle] = useState(defaultTitle);

    const icon = type === "similar" ? "🔍" : "🛒";

    useEffect(() => {
        if (!productId) return;
        setIsLoading(true);
        setCurrentIndex(0);
        // RESET tiêu đề về mặc định mỗi khi load sản phẩm mới
        setActualTitle(defaultTitle);

        const endpoint = type === "similar"
            ? `http://localhost:8089/api/recommendations/similar/${productId}`
            : `http://localhost:8089/api/recommendations/bought-together/${productId}`;

        fetch(endpoint)
            .then(r => r.json())
            .then(async (data: any) => {
                let productList: any[] = [];

                if (type === "bought-together" && data.items) {
                    productList = data.items;
                    // Nếu Backend báo đây là hàng "đóng thế" (không có apriori)
                    if (data.hasApriori === false) {
                        setActualTitle("Có thể bạn cũng thích");
                    }
                } else {
                    productList = Array.isArray(data) ? data : [];
                }

                if (productList.length === 0) {
                    setItems([]);
                    setIsLoading(false);
                    return;
                }

                setItems(productList);

                // Logic fetch ảnh giữ nguyên như cũ của bạn...
                const imgMap: Record<number, string> = {};
                await Promise.all(productList.map(async (p: any) => {
                    try {
                        const imgs = await getFirstImageByProductId(p.id);
                        imgMap[p.id] = imgs[0]?.url ?? "";
                    } catch { }
                }));
                setImages(imgMap);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [productId, type, defaultTitle]); // Thêm defaultTitle vào dependency

    if (!isLoading && items.length === 0) return null;

    const maxIndex = Math.max(0, items.length - VISIBLE);
    const translateX = currentIndex * (CARD_WIDTH + CARD_GAP);

    const s: Record<string, React.CSSProperties> = {
        wrapper: { margin: "32px 0" },
        header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
        title: { fontSize: 16, fontWeight: 600, color: "#1a1a1a" },
        navBtns: { display: "flex", gap: 8 },
        navBtn: { width: 32, height: 32, borderRadius: "50%", border: "0.5px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 18, lineHeight: 1 },
        outer: { overflow: "hidden" },
        track: { display: "flex", gap: CARD_GAP, transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)", transform: `translateX(-${translateX}px)` },
        card: { minWidth: CARD_WIDTH, maxWidth: CARD_WIDTH, background: "#fff", borderRadius: 10, border: "0.5px solid #e8e5e0", overflow: "hidden", flexShrink: 0 },
        imgBox: { width: "100%", height: 160, overflow: "hidden", background: "#f8f7f4" },
        img: { width: "100%", height: "100%", objectFit: "cover" as const },
        body: { padding: "12px 14px" },
        name: { fontSize: 12, fontWeight: 500, color: "#1a1a1a", marginBottom: 4, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties,
        brand: { fontSize: 11, color: "#aaa", marginBottom: 6 },
        priceRow: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 },
        selling: { fontSize: 14, fontWeight: 600, color: "#d0021b" },
        list: { fontSize: 11, color: "#bbb", textDecoration: "line-through" as const },
        stars: { display: "flex", alignItems: "center", gap: 2, marginBottom: 10 },
        ratingNum: { fontSize: 11, color: "#aaa", marginLeft: 4 },
        viewBtn: { width: "100%", padding: "7px 0", background: "none", border: "0.5px solid #1a1a1a", borderRadius: 6, fontSize: 12, cursor: "pointer", color: "#1a1a1a" },
        dots: { display: "flex", justifyContent: "center", gap: 6, marginTop: 14 },
        dot: { height: 8, borderRadius: 4, border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s" },
        skeletonCard: { minWidth: CARD_WIDTH, background: "#fff", borderRadius: 10, border: "0.5px solid #e8e5e0", overflow: "hidden", flexShrink: 0 },
        skeletonImg: { width: "100%", height: 160, background: "#f0f0f0" },
        skeletonLine: { height: 12, borderRadius: 6, background: "#f0f0f0", marginBottom: 8 },
    };

    if (isLoading) return (
        <div style={s.wrapper}>
            <div style={s.header}>
                <div style={s.title}>{icon} {actualTitle}</div>
            </div>
            <div style={{ display: "flex", gap: CARD_GAP }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={s.skeletonCard}>
                        <div style={s.skeletonImg} />
                        <div style={{ padding: 12 }}>
                            <div style={{ ...s.skeletonLine, width: "80%" }} />
                            <div style={{ ...s.skeletonLine, width: "50%" }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={s.wrapper}>
            {/* Header */}
            <div style={s.header}>
                <div style={s.title}>{icon} {actualTitle}</div>
                {items.length > VISIBLE && (
                    <div style={s.navBtns}>
                        <button
                            style={{ ...s.navBtn, opacity: currentIndex === 0 ? 0.3 : 1 }}
                            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                            disabled={currentIndex === 0}
                        >‹</button>
                        <button
                            style={{ ...s.navBtn, opacity: currentIndex >= maxIndex ? 0.3 : 1 }}
                            onClick={() => setCurrentIndex(i => Math.min(maxIndex, i + 1))}
                            disabled={currentIndex >= maxIndex}
                        >›</button>
                    </div>
                )}
            </div>

            {/* Carousel */}
            <div style={s.outer}>
                <div style={s.track}>
                    {items.map((product: any) => (
                        <div key={product.id} style={s.card}>
                            <Link to={`/product/${product.id}`}>
                                <div style={s.imgBox}>
                                    <img
                                        src={images[product.id] || "/no-image.png"}
                                        alt={product.name}
                                        style={s.img}
                                    />
                                </div>
                            </Link>
                            <div style={s.body}>
                                <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                                    <div style={s.name}>{product.name}</div>
                                </Link>
                                {product.brand && <div style={s.brand}>{product.brand}</div>}
                                <div style={s.priceRow}>
                                    <span style={s.selling}>{FormatNumber(product.sellingPrice)}đ</span>
                                    {product.listPrice > product.sellingPrice && (
                                        <span style={s.list}>{FormatNumber(product.listPrice)}đ</span>
                                    )}
                                </div>
                                {product.avgRating > 0 && (
                                    <div style={s.stars}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span key={star} style={{
                                                color: star <= Math.round(product.avgRating) ? "#f5a623" : "#ddd",
                                                fontSize: 12
                                            }}>★</span>
                                        ))}
                                        <span style={s.ratingNum}>({product.avgRating?.toFixed(1)})</span>
                                    </div>
                                )}
                                <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                                    <button style={s.viewBtn}>Xem chi tiết</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            {items.length > VISIBLE && (
                <div style={s.dots}>
                    {Array.from({ length: maxIndex + 1 }, (_, i) => (
                        <button
                            key={i}
                            style={{ ...s.dot, width: i === currentIndex ? 20 : 8, background: i === currentIndex ? "#1a1a1a" : "#ddd" }}
                            onClick={() => setCurrentIndex(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecommendationCarousel;