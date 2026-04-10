class ReviewAdminModel {
    id: number;
    username: string;
    productName: string;
    rating: number;
    comment: string;
    approved: boolean;
    hidden: boolean;
    adminReply: string;
    reviewDate: string;
    replyDate: string;

    constructor(data: any) {
        this.id = data.id;
        this.username = data.user?.username || data.username;
        this.productName = data.product?.name || data.productName;
        this.rating = data.rating;
        this.comment = data.comment;
        this.approved = data.approved;
        this.hidden = data.hidden;
        this.adminReply = data.adminReply;
        this.reviewDate = data.reviewDate;
        this.replyDate = data.replyDate;
    }
}

export default ReviewAdminModel;