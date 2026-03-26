import React, { useEffect, useState } from "react";
import ProductModel from "../../models/ProductModel";
import { getFirstImageByProductId } from "../../api/ImageAPI";
import ImageModel from "../../models/ImageModel";
import FormatNumber from "../../layout/utils/FormatNumber";



interface CarouselItemInterface {
    product: ProductModel;
}

const CarouselItem: React.FC<CarouselItemInterface> = (props) => {

    // const maSach = props.sach.maSach;


    const [imageList, setImageList] = useState<ImageModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const productId = props.product?.id;

    useEffect(() => {

        // ✅ Kiểm tra maSach tồn tại
        if (!productId) {
            setIsLoading(false);
            return;
        }
        //lay1AnhCuaMotQuyenSachTheoMa
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

    //✅ Kiểm tra props.sach SAU hooks
    if (!props.product) {
        return null;
    }

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
    
    // Dòng 63 sửa lại thành:
    const imageData = imageList[0]?.url ? imageList[0].url : "";


    return (
        <div className="d-flex flex-column flex-md-row align-items-center" style={{ minHeight: '220px' }}>
            <div className="text-center">
                {imageData && (
                    <img
                        src={imageData}
                        className="float-end"
                        style={{ width: '160px', height: '200px', objectFit: 'cover' }}
                        alt={props.product.name}
                    />
                )}
            </div>
            <div className="ms-md-4 mt-3 mt-md-0 flex-grow-1 text-start">
                <h5 className="h4 mb-2">{props.product.name}</h5>


                <div className="price mb-0">
                    <span className="original-price me-2">
                        <del>{FormatNumber(props.product.listPrice)}đ</del>
                        {/* //gia niem yet */}
                    </span>
                    <span className="discounted-price text-danger">
                        <strong>{FormatNumber(props.product.sellingPrice)}đ</strong>
                        {/* gia ban */}
                    </span>
                </div>
            </div>
        </div>

    );
}
export default CarouselItem;