//copy từ SachProps sang

import React, { useEffect, useState } from "react";
import ImageModel from "../../../models/ImageModel";

import { getFirstImageByProductId, getAllImagesByProductId } from "../../../api/ImageAPI";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";


interface ProductImage {
    productId: number;
}

const ProductImage: React.FC<ProductImage> = (props) => {

    const productId: number = props.productId;

    const [imageList, setImageList] = useState<ImageModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        getAllImagesByProductId(productId).then(
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

    // console.log(hinhAnhDangChon.maHinhAnh)


    if (errorMessage) {
        return (
            <div><h1>Lỗi khi tải dữ liệu sản phẩm: {errorMessage}</h1></div>
        );
    }
    if (isLoading) {
        return (
            <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-secondary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-muted" style={{ fontWeight: 500 }}>Đang tải dữ liệu sản phẩm...</h5>
            </div>
        );
    }
    // xóa div col-md-3 bên ngoài đi
    return (
        <div>
            <Carousel showArrows={true} showThumbs={false}>
                {imageList.map((image, index) => {
                    // --- ÁP DỤNG LOGIC CHUẨN HOÁ URL CHO TỪNG ẢNH ---
                    const rawFileName = image.url ?? ""; // (Hoặc image.data tùy vào API của bạn)
                    let safeUrl = "/no-image.png";

                    if (rawFileName && rawFileName !== "") {
                        const actualName = rawFileName.split('/').pop();
                        if (actualName) {
                            const safeFileName = encodeURIComponent(decodeURIComponent(actualName));
                            safeUrl = `http://localhost:8089/images/${safeFileName}`;
                        }
                    }
                    // --------------------------------------------------

                    return (
                        <div key={index}>
                            <img
                                src={safeUrl}
                                className="product-detail-img"
                                alt={`Product image ${index + 1}`}
                                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                            />
                        </div>
                    );
                })}
            </Carousel>
        </div>
    );
}
export default ProductImage;