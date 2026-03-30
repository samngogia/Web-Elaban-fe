import React, { useEffect, useState } from "react";
import ProductModel from "../../../models/ProductModel";
import { useNavigate } from "react-router-dom";
import ImageModel from "../../../models/ImageModel";

import { getFirstImageByProductId, getAllImagesByProductId } from "../../../api/ImageAPI";

import { Link } from "react-router-dom";
import renderRating from "../../utils/StarRating";
import FormatNumber from "../../utils/FormatNumber";

interface ProductPropsInterface {
    product: ProductModel;
}

const ProductProps: React.FC<ProductPropsInterface> = (props) => {

    const navigate = useNavigate();

    const handleMuaNgay = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập!");
            return;
        }
        const tempCartItems = [{
            id: 0,
            quantity: 1,
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

                        <button type="button" className="btn btn-outline-secondary">
                            Chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductProps;