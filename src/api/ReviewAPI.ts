import ReviewModel from "../models/ReviewModel";

import { my_request } from "./request";

const API_BASE = process.env.REACT_APP_API_BASE_URL ?? ""; // set in .env if needed or use proxy in dev

// Helper chung để lấy ảnh từ một đường dẫn (duongDan có thể là relative như `/sach/...`)
export async function getReviewsFromPath(path: string): Promise<ReviewModel[]> {
    const fullUrl = path.startsWith('http') ? path : `${API_BASE}${path}`;

    try {
        const response = await my_request(fullUrl);
        const responseData = response?._embedded?.reviews ?? [];

        return responseData.map((item: any) => ({
            reviewId: item.reviewId,
            rating: item.rating,
            content: item.content,
            createdDate: item.createdDate
        } as ReviewModel));
    } catch (err: any) {
        console.error('Lỗi khi lấy Đánh Giá từ', fullUrl, err);
        throw new Error(`Khong the lay DanhGia: ${err?.message ?? err}`);
    }
}

// Lấy toàn bộ ảnh của một quyển sách (relative path để proxy hoạt động)
export async function getAllReviewsByProductId(productId: number): Promise<ReviewModel[]> {
    const path = `http://localhost:8089/reviews/search/findByProduct_Id?productId=${productId}`;
    return getReviewsFromPath(path);
}

// Lấy 1 ảnh đầu tiên của một quyển sách lay1DanhGiaCuaMotQuyenSachTheoMa
export async function getLatestReviewByProductId(productId: number): Promise<ReviewModel[]> {
    const path = `http://localhost:8089/reviews/search/findByProduct_Id?productId=${productId}&sort=reviewId,desc&page=0&size=5`;
    return getReviewsFromPath(path);
}