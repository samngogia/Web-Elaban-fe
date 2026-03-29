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
import { addToCart } from "../../api/CartAPI";



const ProductDetail: React.FC = () => {


    const navigate = useNavigate();
    //lay ma product tu URL
    const { productId } = useParams();

    let productIdNumber: number = 0;
    try {
        productIdNumber = parseInt(productId + '');
        if (Number.isNaN(productIdNumber)) {
            productIdNumber = 0;
        }
    } catch (error) {
        productIdNumber = 0;
        console.error("Lỗi chuyển đổi productId thành số:", error);
    }

    //khai báo

    const [product, setProduct] = useState<ProductModel | null>(null);
    const [imageList, setImageList] = useState<ImageModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);


    const increaseQuantity = () => {
        const availableQuantity = (product && product.quantity ? product?.quantity : 0);
        if (quantity < availableQuantity) {
            setQuantity(quantity + 1);
            // availableQuantity : số lượng hiện tại
        }

    }
    const reduceQuantity = () => {
        if (quantity > 2) {
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
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập!");
            return;
        }

        const tempCartItems = [{
            id: 0,
            quantity: quantity,
            product: product
        }];

        navigate("/checkout", { state: { cartItems: tempCartItems } });
    };




    // xử lý nút thêm giỏ hàng
    const handleThemVaoGioHang = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập!");
            return;
        }

        const decoded: any = jwtDecode(token);
        console.log("Decoded token:", decoded); // xem token có gì

        const userId = decoded.userId;
        console.log("UserId:", userId);

        if (!userId) {
            alert("Không lấy được thông tin người dùng!");
            return;
        }

        try {
            await addToCart(Number(userId), productIdNumber, quantity);
            alert("Đã thêm vào giỏ hàng!");
        } catch (err: any) {
            alert(err.message);
        }
    };

    useEffect(() => {
        //Gọi API để lấy thông tin sách theo mã sách
        //Giả sử bạn có hàm layproductTheoMa(productId: number): Promise<ProductModel>
        getProductById(productIdNumber)
            .then((product) => {
                setProduct(product);
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setIsLoading(false);
            })
    }, [productId]);


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
                                        className="btn btn-outline-dark w-100"
                                        onClick={handleThemVaoGioHang}
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
                </div>
            </div>
        </div>
    )
}
export default ProductDetail;
