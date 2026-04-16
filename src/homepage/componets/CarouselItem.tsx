import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductModel from "../../models/ProductModel";
import { getFirstImageByProductId } from "../../api/ImageAPI";
import ImageModel from "../../models/ImageModel";
import FormatNumber from "../../layout/utils/FormatNumber";

interface CarouselItemInterface {
    product: ProductModel;
}

const CarouselItem: React.FC<CarouselItemInterface> = ({ product }) => {
    const navigate = useNavigate();
    const [imageList, setImageList] = useState<ImageModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!product?.id) { setIsLoading(false); return; }
        getFirstImageByProductId(product.id)
            .then(images => { setImageList(images); setIsLoading(false); })
            .catch(() => setIsLoading(false));
    }, [product?.id]);

    if (!product) return null;

    const imageData = imageList[0]?.url ?? "";
    const discount = product.listPrice && product.sellingPrice
        ? Math.round((1 - product.sellingPrice / product.listPrice) * 100)
        : 0;

    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 60px",
            boxSizing: "border-box",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 60,
                maxWidth: 960,
                width: "100%",
            }}>
                {/* Ảnh */}
                <div style={{
                    flex: "0 0 400px",
                    height: 360,
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    position: "relative",
                }}>
                    {isLoading ? (
                        <div style={{
                            width: "100%", height: "100%",
                            background: "rgba(255,255,255,0.1)"
                        }} />
                    ) : (
                        <img
                            src={imageData || "/no-image.png"}
                            alt={product.name}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.5s ease",
                            }}
                        />
                    )}
                    {/* Badge giảm giá */}
                    {discount > 0 && (
                        <div style={{
                            position: "absolute",
                            top: 16, left: 16,
                            background: "#D85A30",
                            color: "#fff",
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 13,
                            fontWeight: 600,
                        }}>
                            -{discount}%
                        </div>
                    )}
                </div>

                {/* Nội dung */}
                <div style={{ flex: 1, color: "#fff" }}>
                    {/* Tag */}
                    <div style={{
                        display: "inline-block",
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(8px)",
                        padding: "4px 14px",
                        borderRadius: 20,
                        fontSize: 12,
                        letterSpacing: "0.08em",
                        marginBottom: 16,
                        border: "0.5px solid rgba(255,255,255,0.3)",
                    }}>
                        ✦ SẢN PHẨM NỔI BẬT
                    </div>

                    {/* Tên sản phẩm */}
                    <h2 style={{
                        fontSize: 28,
                        fontWeight: 600,
                        lineHeight: 1.3,
                        marginBottom: 16,
                        textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}>
                        {product.name}
                    </h2>

                    {/* Thông tin sản phẩm */}
                    {(product.material || product.brand) && (
                        <div style={{
                            display: "flex",
                            gap: 20,
                            marginBottom: 20,
                            fontSize: 13,
                            opacity: 0.85,
                        }}>
                            {product.brand && (
                                <span>🏷 {product.brand}</span>
                            )}
                            {product.material && (
                                <span>🪵 {product.material}</span>
                            )}
                        </div>
                    )}

                    {/* Giá */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: "#FFD580",
                            letterSpacing: "-0.5px",
                        }}>
                            {FormatNumber(product.sellingPrice)}đ
                        </div>
                        {product.listPrice && product.listPrice > (product.sellingPrice ?? 0) && (
                            <div style={{
                                fontSize: 16,
                                opacity: 0.6,
                                textDecoration: "line-through",
                                marginTop: 2,
                            }}>
                                {FormatNumber(product.listPrice)}đ
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            onClick={() => navigate(`/product/${product.id}`)}
                            style={{
                                padding: "12px 28px",
                                background: "#fff",
                                color: "#1a1a1a",
                                border: "none",
                                borderRadius: 30,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                        >
                            Xem chi tiết →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarouselItem;