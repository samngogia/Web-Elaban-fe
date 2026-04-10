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
            <div><h1>Đang tải dữ liệu sản phẩm...</h1></div>
        );
    }
    // xóa div col-md-3 bên ngoài đi
    return (
        <div>
            <Carousel showArrows={true} showThumbs={false}>
                {imageList.map((image, index) => (
                    <div key={index}>
                        <img
                            src={image.url ?? ""}
                            className="product-detail-img"
                            alt={`Product image ${index + 1}`}
                            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
export default ProductImage;