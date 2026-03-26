import React, { useState } from "react";
import ProductModel from "../../models/ProductModel";
import { useEffect } from "react";
import CarouselItem from "./CarouselItem";
import { getTop3LatestProducts } from "../../api/ProductApi";
interface CarouselInterface {

}


const Carousel: React.FC = () => {

    const [productList, setProductList] = useState<ProductModel[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    // slides prepared (book + image)
    const [isLoading, setIsLoading] = useState(true);
    const [ErrorMessage, setErrorMessage] = useState<string | null>(null);

    // normalizeImage moved to utils (src/utils/imageUtils)

    useEffect(() => {
        // Gọi API lấy 3 sản phẩm nội thất mới nhất
        getTop3LatestProducts().then(
            response => {
                setProductList(response.result);
                setIsLoading(false);
            }
        ).catch(
            err => {
                setErrorMessage(err.message);
                setIsLoading(false);
            }
        );
    }, []);



    if (ErrorMessage) {
        return <div ><h1>Error: {ErrorMessage}</h1></div>;
    }


    if (isLoading) {
        return (
            <div className="container mt-3 text-center">
                <h1>Đang tải dữ liệu sản phẩm...</h1>
            </div>
        );
    }

    //✅ FIX: Kiểm tra có đủ sách không trước khi render
    if (productList.length === 0) {
        return <div><h1>Không có sách để hiển thị</h1></div>;
    }

    return (
        <div>
            <div id="carouselExampleFade" className="carousel slide carousel-fade">
                <div className="carousel-inner">
                    {/* ✅ FIX: Chỉ render khi sách tồn tại */}
                    {productList[0] && (
                        <div className="carousel-item active" data-bs-interval="10000">
                            <CarouselItem key={0} product={productList[0]} />
                        </div>

                    )}

                    {productList[1] && (
                        <div className="carousel-item" data-bs-interval="10000">
                            <CarouselItem key={1} product={productList[1]} />
                        </div>
                    )}
                    {productList[2] && (
                        <div className="carousel-item" data-bs-interval="10000">
                            <CarouselItem key={2} product={productList[2]} />
                        </div>
                    )}

                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    )


}
export default Carousel;