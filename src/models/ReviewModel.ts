class ReviewModel {
    reviewId: number; //Mã đánh giá
    content?: string; //Nội dung
    rating?: number; // Xếp Hạng
    createdDate?: string; // Tương ứng với created_date
    productId?: number;   // ID của sản phẩm nội thất được đánh giá
    userId?: number;      // ID của người dùng đánh giá

    constructor(
        reviewId: number,
        content: string,
        rating: number,
        createdDate: string,
        productId: number,
        userId: number
    ) {
        this.reviewId = reviewId;
        this.content = content;
        this.rating = rating;
        this.createdDate = createdDate;
        this.productId = productId;
        this.userId = userId;
    }
}
export default ReviewModel;