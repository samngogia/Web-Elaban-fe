import React, { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import ProductModel from "../../models/ProductModel";
import ImageModel from "../../models/ImageModel";
import { getProductById } from "../../api/ProductApi";
import renderRating from "../utils/StarRating";
import FormatNumber from "../utils/FormatNumber";
import ProductReview from "./components/ProductReview";
import ProductImage from "./components/ProductImage";
import { jwtDecode } from "jwt-decode";
// Thêm import ở đầu file

import { getFirstImageByProductId } from "../../api/ImageAPI";
import RecommendationCarousel from "./components/Recommendationcarousel";



const ProductDetail: React.FC = () => {


    const navigate = useNavigate();
    //lay ma product tu URL
    const { productId } = useParams();

    const productIdNumber = parseInt(productId + '') || 0;
    //khai báo
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<ProductModel | null>(null);
    const [imageList, setImageList] = useState<ImageModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const [isWishlisted, setIsWishlisted] = useState(false);


    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [recImages, setRecImages] = useState<Record<number, string>>({});



    // Kiểm tra khi load trang
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || productIdNumber === 0) {
            setIsWishlisted(false);
            return;
        }

        try {
            const decoded: any = jwtDecode(token);
            console.log("decoded token:", decoded);

            const userId = decoded.userId || decoded.id || decoded.sub;

            if (!userId) return;

            fetch(
                `http://localhost:8089/api/wishlist/check?userId=${userId}&productId=${productIdNumber}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
                .then((r) => r.json())
                .then((data) => setIsWishlisted(data))
                .catch(() => { });
        } catch (error) {
            console.error("Token invalid", error);
        }
    }, [productIdNumber]);


    useEffect(() => {
        if (productIdNumber === 0) {
            setErrorMessage("Mã sản phẩm không hợp lệ");
            setIsLoading(false);
            return;
        }

        getProductById(productIdNumber)
            .then((product) => {
                setProduct(product);
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setIsLoading(false);
            });
    }, [productIdNumber]);




    useEffect(() => {
        fetch(`http://localhost:8089/api/recommendations/${productIdNumber}`)
            .then(r => r.json())
            .then(async (data: any[]) => {
                setRecommendations(data);
                // Load ảnh song song
                const imgMap: Record<number, string> = {};
                await Promise.all(data.map(async (p: any) => {
                    try {
                        const imgs = await getFirstImageByProductId(p.id);
                        imgMap[p.id] = imgs[0]?.url ?? "";
                    } catch { }
                }));
                setRecImages(imgMap);
            })
            .catch(() => { });
    }, [productIdNumber]);



    const increaseQuantity = () => {
        const availableQuantity = (product && product.quantity ? product?.quantity : 0);
        if (quantity < availableQuantity) {
            setQuantity(quantity + 1);
            // availableQuantity : số lượng hiện tại
        }

    }
    // Sửa lại logic giảm: Cho phép giảm xuống đến 1
    const reduceQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value);
        const stockQuantity = (product && product.quantity ? product.quantity : 0);
        if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= stockQuantity) {
            setQuantity(newQuantity);
        }
        // stockQuanity : soluongTonkho

    }




    const handleMuaNgay = () => {
        console.log("handleMuaNgay called"); // thêm dòng này đầu tiên
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập!");
            return;
        }
        console.log("token ok:", token.substring(0, 20)); // xem token

        const tempCartItems = [{
            id: 0,
            quantity: quantity,
            product: product
        }];

        // Lưu vào sessionStorage thay vì navigate state
        sessionStorage.setItem("checkoutItems", JSON.stringify(tempCartItems));

        // Kiểm tra đã lưu chưa
        console.log("Saved to sessionStorage:", sessionStorage.getItem("checkoutItems"));

        navigate("/checkout");
    };




    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
            navigate("/login");
            return;
        }

        try {
            const decoded: any = jwtDecode(token);
            const userId = decoded.userId || decoded.id || decoded.sub;

            if (!userId) {
                alert("Không lấy được thông tin người dùng!");
                return;
            }

            const response = await fetch(
                `http://localhost:8089/cart/add?userId=${userId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        productId: productIdNumber,
                        quantity: quantity,
                    }),
                }
            );

            if (response.ok) {
                window.dispatchEvent(new Event("cartUpdated"));
                alert("Đã thêm vào giỏ hàng!");
            } else {
                const text = await response.text();
                console.log(text);
                alert("Thêm vào giỏ hàng thất bại!");
            }
        } catch (error) {
            console.error("Cart Error:", error);
            alert("Có lỗi xảy ra khi kết nối đến server!");
        }
    };



    const handleToggleWishlist = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Vui lòng đăng nhập!");
            navigate("/login");
            return;
        }

        try {
            const decoded: any = jwtDecode(token);
            console.log("decoded token:", decoded);

            const userId = decoded.userId || decoded.id || decoded.sub;

            if (!userId) {
                alert("Không lấy được userId từ token");
                return;
            }

            const url = isWishlisted
                ? `http://localhost:8089/api/wishlist/remove?userId=${userId}&productId=${productIdNumber}`
                : `http://localhost:8089/api/wishlist/add?userId=${userId}&productId=${productIdNumber}`;

            const response = await fetch(url, {
                method: isWishlisted ? "DELETE" : "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("wishlist status:", response.status);

            if (response.status === 401) {
                alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                const text = await response.text();
                console.log(text);
                alert("Không thể cập nhật yêu thích");
                return;
            }

            setIsWishlisted(!isWishlisted);
        } catch (e) {
            console.error(e);
            alert("Có lỗi xảy ra khi kết nối đến server!");
        }
    };


    if (isLoading) {

        return (
            <div className="container mt-5">
                <h2 className="text-center">Đang tải thông tin sản phẩm...</h2>
            </div>
        );
    }
    if (errorMessage) {
        return (
            <div className="container mt-5">
                <h2 className="text-center text-danger">Lỗi: {errorMessage}</h2>
            </div>
        );
    }


    if (!product) {
        return (
            <div className="container mt-5">
                <h2 className="text-center text-danger">Sản phẩm không tồn tại</h2>
            </div>
        );
    }

    return (

        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-10 mx-auto">
                    <div className="card shadow p-4">

                        <div className="row">
                            {/* ẢNH */}
                            <div className="col-md-4 text-center">
                                <ProductImage productId={productIdNumber} />
                            </div>
                            <div className="col-md-5">
                                <h2 className="fw-bold">{product.name}</h2>

                                <div className="mb-2">
                                    {renderRating(product.avgRating || 0)}
                                </div>

                                <h4 className="text-danger fw-bold">
                                    {FormatNumber(product.sellingPrice)}đ
                                </h4>
                                {/* Thông tin chi tiết */}
                                <table className="table table-borderless table-sm">
                                    <tbody>
                                        {product.brand && (
                                            <tr>
                                                <td className="text-muted" style={{ width: '45%' }}>Thương hiệu</td>
                                                <td>{product.brand}</td>
                                            </tr>
                                        )}
                                        {product.material && (
                                            <tr>
                                                <td className="text-muted">Chất liệu</td>
                                                <td>{product.material}</td>
                                            </tr>
                                        )}
                                        {product.dimensions && (
                                            <tr>
                                                <td className="text-muted">Kích thước</td>
                                                <td>{product.dimensions}</td>
                                            </tr>
                                        )}
                                        {product.quantity && (
                                            <tr>
                                                <td className="text-muted">Còn lại</td>
                                                <td>{product.quantity} sản phẩm</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* MUA HÀNG */}
                            <div className="col-md-3">
                                <div className="border rounded p-3">

                                    <p className="fw-bold">Số lượng</p>

                                    <div className="d-flex align-items-center mb-3">
                                        <button className="btn btn-outline-secondary" onClick={reduceQuantity}>-</button>

                                        <input
                                            className="form-control text-center mx-2"
                                            type="number"
                                            value={quantity}
                                            min={1}
                                            onChange={handleQuantityChange}
                                        />

                                        <button className="btn btn-outline-secondary" onClick={increaseQuantity}>+</button>
                                    </div>

                                    {product.sellingPrice && (
                                        <div className="mb-3 text-center">
                                            <small className="text-muted">Tổng tiền</small>
                                            <h5 className="text-success fw-bold">
                                                {FormatNumber(quantity * product.sellingPrice)}đ
                                            </h5>
                                        </div>
                                    )}

                                    <button
                                        className="btn btn-danger w-100 mb-2"
                                        onClick={handleMuaNgay}
                                    >
                                        Mua ngay
                                    </button>

                                    <button
                                        onClick={handleToggleWishlist}
                                        style={{
                                            background: "none",
                                            border: "0.5px solid #ddd",
                                            borderRadius: 8,
                                            padding: "10px 14px",
                                            fontSize: 18,
                                            cursor: "pointer",
                                            color: isWishlisted ? "#d32f2f" : "#aaa",
                                        }}
                                        title={isWishlisted ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                                    >
                                        {isWishlisted ? "♥" : "♡"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-dark w-100"
                                        onClick={handleAddToCart}
                                    >
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* Đường kẻ ngăn cách trên */}
                    <hr />

                    {/* Phần hiển thị nội dung HTML từ Database */}
                    {product && product.description ? (
                        <div
                            className="product-description-wrapper text-muted mb-3"
                            style={{ lineHeight: '1.6', fontSize: '15px' }} // Thêm một chút style cho dễ đọc
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    ) : (
                        <div className="text-muted mb-3 italic">
                            <p>Đang cập nhật nội dung mô tả sản phẩm...</p>
                        </div>
                    )}

                    {/* Đường kẻ ngăn cách dưới */}
                    <hr />


                    {/* ĐÁNH GIÁ */}
                    <div className="card shadow mt-4 p-3">
                        <h4>Đánh giá sản phẩm</h4>
                        <ProductReview productId={productIdNumber} />
                    </div>

                    {/* ===== THÊM VÀO ĐÂY ===== */}
                    <RecommendationCarousel
                        productId={productIdNumber}
                        type="similar"
                    />

                    <RecommendationCarousel
                        productId={productIdNumber}
                        type="bought-together"
                    />

                    {recommendations.length > 0 && (
                        <div className="card shadow mt-4 p-4">
                            <h4 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>
                                Có thể bạn cũng thích
                            </h4>
                            <div className="row">
                                {recommendations.slice(0, 4).map(p => (
                                    <div key={p.id} className="col-md-3 mb-3">
                                        <div className="card h-100" style={{ border: "0.5px solid #e8e5e0", borderRadius: 10 }}>
                                            <Link to={`/product/${p.id}`}>
                                                <img
                                                    src={recImages[p.id] || "/no-image.png"}
                                                    alt={p.name}
                                                    style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: "10px 10px 0 0" }}
                                                />
                                            </Link>
                                            <div className="p-3">
                                                <Link to={`/product/${p.id}`} style={{ textDecoration: "none", color: "#1a1a1a" }}>
                                                    <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>
                                                        {p.name}
                                                    </p>
                                                </Link>
                                                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                                    <span style={{ fontSize: 15, fontWeight: 600, color: "#d0021b" }}>
                                                        {FormatNumber(p.sellingPrice)}đ
                                                    </span>
                                                    {p.listPrice > p.sellingPrice && (
                                                        <span style={{ fontSize: 11, color: "#aaa", textDecoration: "line-through" }}>
                                                            {FormatNumber(p.listPrice)}đ
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default ProductDetail;
