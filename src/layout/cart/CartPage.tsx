import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getCartByUserId, updateCartItem, removeCartItem, clearCart } from "../../api/CartAPI";
import { getFirstImageByProductId } from "../../api/ImageAPI";
import FormatNumber from "../utils/FormatNumber";

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        sellingPrice: number;
        listPrice: number;
    };
    imageUrl?: string;
}

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartId, setCartId]       = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError]         = useState<string | null>(null);

    const getUserId = (): number => {
        const token = localStorage.getItem("token");
        if (!token) return 0;
        const decoded: any = jwtDecode(token);
        return decoded.userId ?? 0;
    };

    useEffect(() => {
        const userId = getUserId();
        if (!userId) {
            setError("Vui lòng đăng nhập để xem giỏ hàng");
            setIsLoading(false);
            return;
        }

        getCartByUserId(userId)
            .then(async (data) => {
                setCartId(data.cartId);
                const items: CartItem[] = data.cartItems.map((item: any) => ({
                    id: item.id,
                    quantity: item.quantity,
                    product: {
                        id: item.productId,
                        name: item.productName,
                        sellingPrice: item.sellingPrice,
                        listPrice: item.listPrice,
                    },
                    imageUrl: "",
                }));

                // Load ảnh song song
                const itemsWithImages = await Promise.all(
                    items.map(async (item) => {
                        try {
                            const images = await getFirstImageByProductId(item.product.id);
                            return { ...item, imageUrl: images[0]?.url ?? "" };
                        } catch {
                            return item;
                        }
                    })
                );

                setCartItems(itemsWithImages);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    const handleQuantityChange = async (cartItemId: number, quantity: number) => {
        if (quantity <= 0) {
            await handleRemove(cartItemId);
            return;
        }
        await updateCartItem(cartItemId, quantity);
        setCartItems(prev =>
            prev.map(item => item.id === cartItemId ? { ...item, quantity } : item)
        );
    };

    const handleRemove = async (cartItemId: number) => {
        await removeCartItem(cartItemId);
        setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    };

    const handleClearCart = async () => {
        await clearCart(getUserId());
        setCartItems([]);
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.sellingPrice * item.quantity, 0
    );

    const s: Record<string, React.CSSProperties> = {
        page: { minHeight: "100vh", background: "#f8f7f4", fontFamily: "'Georgia', serif", padding: "40px 0" },
        container: { maxWidth: 1100, margin: "0 auto", padding: "0 20px" },
        heading: { fontSize: 28, fontWeight: 400, color: "#1a1a1a", marginBottom: 4, letterSpacing: "-0.5px" },
        subheading: { fontSize: 13, color: "#aaa", marginBottom: 32 },
        layout: { display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" },
        tableCard: { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", overflow: "hidden" },
        thead: { background: "#fafaf8", borderBottom: "0.5px solid #e8e5e0" },
        th: { padding: "14px 20px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#aaa", textAlign: "left" as const },
        tr: { borderBottom: "0.5px solid #f0ede8" },
        td: { padding: "20px", verticalAlign: "middle" as const },
        productCell: { display: "flex", alignItems: "center", gap: 16 },
        img: { width: 72, height: 72, objectFit: "cover" as const, borderRadius: 8, background: "#f0ede8", flexShrink: 0 },
        productName: { fontSize: 14, color: "#1a1a1a", fontWeight: 400, lineHeight: 1.4 },
        originalPrice: { fontSize: 12, color: "#bbb", textDecoration: "line-through" as const, marginTop: 2 },
        price: { fontSize: 14, color: "#1a1a1a", fontWeight: 500 },
        qtyWrap: { display: "flex", alignItems: "center", gap: 8, border: "0.5px solid #ddd", borderRadius: 8, padding: "4px 8px", width: "fit-content" as const },
        qtyBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#555", padding: "2px 6px", lineHeight: 1 },
        qtyNum: { fontSize: 14, minWidth: 24, textAlign: "center" as const, color: "#1a1a1a" },
        subtotal: { fontSize: 14, fontWeight: 500, color: "#1a1a1a" },
        removeBtn: { background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 18, padding: 4, lineHeight: 1 },
        actions: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderTop: "0.5px solid #f0ede8" },
        clearBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#888", cursor: "pointer" },
        summaryCard: { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", padding: "24px", position: "sticky" as const, top: 20 },
        summaryTitle: { fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#aaa", marginBottom: 20 },
        summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 12 },
        summaryTotal: { display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 500, color: "#1a1a1a", borderTop: "0.5px solid #eee", paddingTop: 16, marginTop: 4 },
        checkoutBtn: { display: "block", width: "100%", padding: "14px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, cursor: "pointer", marginTop: 20, letterSpacing: "0.03em" },
        continueBtn: { display: "block", width: "100%", padding: "12px", background: "transparent", color: "#888", border: "0.5px solid #ddd", borderRadius: 10, fontSize: 13, cursor: "pointer", marginTop: 10 },
        empty: { textAlign: "center" as const, padding: "80px 20px", background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0" },
        emptyIcon: { fontSize: 48, marginBottom: 16, color: "#ddd" },
        emptyText: { fontSize: 18, color: "#aaa", fontWeight: 400, marginBottom: 24 },
        shopBtn: { display: "inline-block", padding: "12px 32px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, cursor: "pointer", textDecoration: "none" as const },
    };

    if (isLoading) return (
        <div style={s.page}>
            <div style={s.container}>
                <p style={{ color: "#aaa", fontSize: 14 }}>Loading cart...</p>
            </div>
        </div>
    );

    if (error) return (
        <div style={s.page}>
            <div style={s.container}>
                <p style={{ color: "#D85A30", fontSize: 14 }}>{error}</p>
            </div>
        </div>
    );

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h1 style={s.heading}>Giỏ hàng của bạn</h1>
                <p style={s.subheading}>{cartItems.length} sản phẩm{cartItems.length !== 1 ? "s" : ""} trong giỏ hàng của bạn</p>

                {cartItems.length === 0 ? (
                    <div style={s.empty}>
                        <div style={s.emptyIcon}>🛒</div>
                        <p style={s.emptyText}>giỏ hàng đang trống</p>
                        <button style={s.shopBtn} onClick={() => navigate("/")}>
                            Tiếp tục mua hàng
                        </button>
                    </div>
                ) : (
                    <div style={s.layout}>
                        {/* Left — Product table */}
                        <div style={s.tableCard}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead style={s.thead}>
                                    <tr>
                                        <th style={s.th}>Sản phẩm</th>
                                        <th style={s.th}>Giá</th>
                                        <th style={s.th}>Số lượng</th>
                                        <th style={s.th}>Tổng</th>
                                        <th style={s.th}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map(item => (
                                        <tr key={item.id} style={s.tr}>
                                            <td style={s.td}>
                                                <div style={s.productCell}>
                                                    <img
                                                        src={item.imageUrl || "/placeholder.jpg"}
                                                        alt={item.product.name}
                                                        style={s.img}
                                                    />
                                                    <div>
                                                        <div style={s.productName}>{item.product.name}</div>
                                                        {item.product.listPrice > item.product.sellingPrice && (
                                                            <div style={s.originalPrice}>
                                                                {FormatNumber(item.product.listPrice)}đ
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={s.td}>
                                                <span style={s.price}>{FormatNumber(item.product.sellingPrice)}đ</span>
                                            </td>
                                            <td style={s.td}>
                                                <div style={s.qtyWrap}>
                                                    <button style={s.qtyBtn}
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                                                        −
                                                    </button>
                                                    <span style={s.qtyNum}>{item.quantity}</span>
                                                    <button style={s.qtyBtn}
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={s.td}>
                                                <span style={s.subtotal}>
                                                    {FormatNumber(item.product.sellingPrice * item.quantity)}đ
                                                </span>
                                            </td>
                                            <td style={s.td}>
                                                <button style={s.removeBtn}
                                                    onClick={() => handleRemove(item.id)}
                                                    title="Remove">
                                                    ×
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={s.actions}>
                                <button style={s.clearBtn} onClick={handleClearCart}>
                                    Xóa tất cả sản phẩm
                                </button>
                                <button style={s.clearBtn} onClick={() => navigate("/")}>
                                    ← Tiếp tục mua hàng
                                </button>
                            </div>
                        </div>

                        {/* Right — Summary */}
                        <div style={s.summaryCard}>
                            <div style={s.summaryTitle}>Thanh toán</div>

                            {cartItems.map(item => (
                                <div key={item.id} style={s.summaryRow}>
                                    <span style={{ flex: 1, marginRight: 8 }}>
                                        {item.product.name.length > 30
                                            ? item.product.name.slice(0, 30) + "..."
                                            : item.product.name}
                                        {" "}×{item.quantity}
                                    </span>
                                    <span style={{ fontWeight: 500, color: "#1a1a1a" }}>
                                        {FormatNumber(item.product.sellingPrice * item.quantity)}đ
                                    </span>
                                </div>
                            ))}

                            <div style={s.summaryTotal}>
                                <span>Tổng</span>
                                <span>{FormatNumber(subtotal)}đ</span>
                            </div>

                            <button
                                style={s.checkoutBtn}
                                onClick={() => navigate("/checkout", { state: { cartItems } })}
                            >
                                Tiếp tục thanh toán
                            </button>

                            <button style={s.continueBtn} onClick={() => navigate("/")}>
                                Tiếp tục mua hàng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;