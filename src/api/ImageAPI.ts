import path from "path";
import ImageModel from "../models/ImageModel";
import { my_request } from "./request";

const IMAGE_BASE_URL = "http://localhost:8089/images";
const API_BASE = process.env.REACT_APP_API_BASE_URL ?? ""; // set in .env if needed or use proxy in dev

// Helper chung để lấy ảnh từ một đường dẫn (duongDan có thể là relative như `/sach/...`)
export async function getImagesFromPath(path: string): Promise<ImageModel[]> {
    // const fullUrl = path.startsWith('http') ? path : `${API_BASE}${path}`;

    try {
        const response = await my_request(path);

        // Spring Data REST trả về key theo tên entity — thử cả 2
        const responseData = response?._embedded?.productImages
            ?? response?._embedded?.productImageList
            ?? [];

        return responseData.map((item: any) => ({
            id: item.id,
            name: item.name,
            url: item.url
                ? `http://localhost:8089/images/${item.url}`
                : "",
            isThumbnail: item.isThumbnail,
            data: item.data,
        } as ImageModel));
    } catch (err: any) {
        console.error('Lỗi khi lấy ảnh từ', path, err);
        throw new Error(`Khong the lay anh: ${err?.message ?? err}`);
    }
}

// Lấy toàn bộ ảnh của một quyển sách (relative path để proxy hoạt động)
export async function getAllImagesByProductId(productId: number): Promise<ImageModel[]> {
    const path = `http://localhost:8089/product_image/search/findByProduct_Id?productId=${productId}`;
    return getImagesFromPath(path);
}

// Lấy 1 ảnh đầu tiên của một quyển sách
export async function getFirstImageByProductId(productId: number): Promise<ImageModel[]> {
    const path = `http://localhost:8089/product_image/search/findByProduct_Id?productId=${productId}&page=0&size=1`;
    return getImagesFromPath(path);
}