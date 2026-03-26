import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import ProductModel from "../../models/ProductModel";
import ImageModel from "../../models/ImageModel";
import { getProductById } from "../../api/ProductApi";
import renderRating from "../utils/StarRating";
import FormatNumber from "../utils/FormatNumber";
import ProductReview from "./components/ProductReview";
import ProductImage from "./components/ProductImage";



const ProductDetail: React.FC = () => {

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


    const increaseQuantity  = () => {
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

    }
    const handleThemVaoGioHang = () => {


    }

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

                            {/* THÔNG TIN */}
                            <div className="col-md-5">
                                <h2 className="fw-bold">{product.name}</h2>

                                <div className="mb-2">
                                    {renderRating(product.avgRating || 0)}
                                </div>

                                <h4 className="text-danger fw-bold">
                                    {FormatNumber(product.sellingPrice)}đ
                                </h4>

                                <hr />

                                <div
                                    className="mo-ta-ngan text-muted"
                                    dangerouslySetInnerHTML={{ __html: product. description + '' }}
                                />
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
