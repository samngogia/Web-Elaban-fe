//copy từ SachProps sang
import React, { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { getAllReviewsByProductId, getLatestReviewByProductId } from "../../../api/ReviewAPI";

import renderRating from "../../utils/StarRating";

interface ProductReview {
    productId: number;
}

const ProductReview: React.FC<ProductReview> = (props) => {

    const productId: number = props.productId;

    const [reviewList, setReviewList] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        getLatestReviewByProductId(productId).then(
            (reviews) => {
                setReviewList(reviews);
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
    return (
        <div className="container mt-2 mb-2">
            <h4> Danh gia san pham: </h4>
            {
                reviewList.map((review, index) => {
                    return (
                        <div className="row " key={review.reviewId}>
                            <div className="col-4 text-end">
                                <p>{ renderRating(Number(review.rating) || 0) }</p>
                            </div>
                            <div className="col-8">
                                <p>{review.content}</p>
                            </div>
                        </div>
                    ) 
                })
            }
        </div >
    );
}
export default ProductReview;