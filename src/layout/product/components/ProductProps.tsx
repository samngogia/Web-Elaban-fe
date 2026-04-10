import React, { useEffect, useState } from "react";
import ProductModel from "../../../models/ProductModel";
import { useNavigate } from "react-router-dom";
import ImageModel from "../../../models/ImageModel";

import { getFirstImageByProductId, getAllImagesByProductId } from "../../../api/ImageAPI";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import renderRating from "../../utils/StarRating";
import FormatNumber from "../../utils/FormatNumber";
import { addToCart } from "../../../api/CartAPI";
 
interface ProductPropsInterface {
    product: ProductModel;
}

const ProductProps: React.FC<ProductPropsInterface> = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);



    const navigate = useNavigate();

    const handleThemVaoGioHang = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập!");
            return;
        }
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;
        if (!userId) {
            alert("Không lấy được thông tin người dùng!");
            return;
        }
        try {
            await addToCart(Number(userId), productId, quantity);
            alert("Đã thêm vào giỏ hàng!");
            setShowModal(false);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleMuaNgay = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập!");
            return;
        }
        const tempCartItems = [{
            id: 0,
            quantity: quantity,
            product: props.product
        }];
        sessionStorage.setItem("checkoutItems", JSON.stringify(tempCartItems));
        console.log("SET sessionStorage:", sessionStorage.getItem("checkoutItems")); // thêm dòng này

        navigate("/checkout");
    };

    const productId = props.product.id;

    const [imageList, setImageList] = useState<ImageModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        getFirstImageByProductId(productId).then(
            (images: ImageModel[]) => {
                setImageList(images);
                setIsLoading(false);
            }
        ).catch(
            (error: Error) => {
                setErrorMessage(error.message);
                setIsLoading(false);
            }
        );
    }, [productId]
    );


    if (errorMessage) {
        return (
            <div><h1>Lỗi khi tải dữ liệu sản phẩm: {errorMessage}</h1></div>
        );
    }
    if (isLoading) {
        return (
            <div><h1>Đang tải dữ liệu sản phẩm...</h1></div>
        );
    }
    // const duLieuAnh = danhproductAnh[0]?.duLieuAnh ?? doremonImg;

    // const originalPrice = props.product.giaNiemYet ?? '0';
    // const discountedPrice = props.product.giaBan ?? originalPrice;

    const imageData = imageList[0]?.url ?? imageList[0]?.data ?? "/no-image.png";
    return (
        <>

            <div className="col-md-3 mt-2">
                <div className="card">
                    <Link to={`/product/${props.product.id}`}>
                        <img
                            src={
                                imageData && imageData !== ""
                                    ? imageData
                                    : "/no-image.png"
                            }
                            className="card-img-top"
                            alt={props.product.name}
                            style={{ height: '200px', objectFit: 'cover' }}
                        />
                    </Link>


                    <div className="card-body">

                        <Link to={`/product/${props.product.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                            <h5 className="card-title">{props.product.name}</h5>
                        </Link>
                        <div className="price mb-3">
                            <span className="original-price me-2 text-end">
                                <del>{FormatNumber(props.product.listPrice)}đ</del>
                            </span>
                            <span className="discounted-price text-danger text-end">
                                <strong>{FormatNumber(props.product.sellingPrice)}đ</strong>
                            </span>
                        </div>

                        <div className="btn-group w-100" role="group">
                            <div className="col-6">
                                {renderRating(props.product.avgRating ? props.product.avgRating : 0)}
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleMuaNgay}
                            >
                                Mua ngay
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowModal(true)}
                            >
                                Xem nhanh
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Xem nhanh */}
            {
                showModal && (
                    <div
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.5)', zIndex: 9999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            style={{
                                background: '#fff', borderRadius: 12, padding: 32,
                                maxWidth: 700, width: '90%', position: 'relative',
                                display: 'flex', gap: 24
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Nút đóng */}
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    position: 'absolute', top: 12, right: 16,
                                    background: 'none', border: 'none', fontSize: 24,
                                    cursor: 'pointer', color: '#555'
                                }}
                            >×</button>

                            {/* Ảnh */}
                            <div style={{ flex: '0 0 280px' }}>
                                <img
                                    src={imageData !== "" ? imageData : "/no-image.png"}
                                    alt={props.product.name}
                                    style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 8 }}
                                />
                            </div>

                            {/* Thông tin */}
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontWeight: 600, marginBottom: 8 }}>{props.product.name}</h4>

                                <div style={{ marginBottom: 12 }}>
                                    {renderRating(props.product.avgRating ?? 0)}
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <span style={{ fontSize: 22, fontWeight: 700, color: '#d0021b' }}>
                                        {FormatNumber(props.product.sellingPrice)}đ
                                    </span>
                                    <span style={{ marginLeft: 10, color: '#aaa', textDecoration: 'line-through', fontSize: 14 }}>
                                        {FormatNumber(props.product.listPrice)}đ
                                    </span>
                                </div>

                                {props.product.brand && (
                                    <p style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
                                        <b>Thương hiệu:</b> {props.product.brand}
                                    </p>
                                )}
                                {props.product.material && (
                                    <p style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
                                        <b>Chất liệu:</b> {props.product.material}
                                    </p>
                                )}
                                {props.product.dimensions && (
                                    <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
                                        <b>Kích thước:</b> {props.product.dimensions}
                                    </p>
                                )}

                                {/* Số lượng */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    >−</button>
                                    <span style={{ minWidth: 32, textAlign: 'center' }}>{quantity}</span>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => setQuantity(q => q + 1)}
                                    >+</button>
                                </div>

                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button className="btn btn-danger" onClick={handleThemVaoGioHang}>
                                        Thêm vào giỏ
                                    </button>
                                    <Link
                                        to={`/product/${props.product.id}`}
                                        className="btn btn-outline-dark"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default ProductProps;