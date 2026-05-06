
import ProductModel from "../models/ProductModel";
import { my_request } from "./request";
import React from "react";

// =====================

export interface ResultInterface {
    result: ProductModel[];
    totalPages: number;
    totalProduct: number;
}

async function fetchProductList(path: string): Promise<ResultInterface> {

    const result: ProductModel[] = [];

    //Gọi phương thức request
    const response = await my_request(path);


    // ✅ Kiểm tra response có dữ liệu không ------------
    if (!response) {
        console.error("Response is null or undefined");
        return {
            result: [],
            totalPages: 0,
            totalProduct: 0
        };
    }
    //Xử lý dữ liệu trả về
    const responseData = response._embedded?.products ||
        response._embedded?.products;
    //được theemm//---------------------
    if (!responseData || responseData.length === 0) {
        console.warn("No products found in response");
        return {
            result: [],
            totalPages: response.page?.totalPages || 0,
            totalProduct: response.page?.totalElements || 0
        };
    }

    console.log("Response Data:", responseData); // Debug log


    //lấy thông tin trang 
    const totalPages: number = response.page.totalPages;
    const totalProduct: number = response.page.totalElements;



    for (const key in responseData) {
        result.push({
            id: responseData[key].id,
            avgRating: responseData[key].avgRating,
            brand: responseData[key].brand,
            description: responseData[key].description,
            dimensions: responseData[key].dimensions,
            listPrice: responseData[key].listPrice,
            material: responseData[key].material,
            name: responseData[key].name,
            quantity: responseData[key].quantity,
            sellingPrice: responseData[key].sellingPrice

        });
    }

    return { result: result, totalPages: totalPages, totalProduct: totalProduct };
}
export async function getAllProducts(
    currentPage: number = 0,
    size: number = 8,
    minPrice?: number,
    maxPrice?: number,
    sortBy: string = "id",
    sortDir: string = "desc"
): Promise<ResultInterface> {
    let path = `http://localhost:8089/products/search/findByActiveTrue?sort=${sortBy},${sortDir}&size=${size}&page=${currentPage}`;
    if (minPrice !== undefined) path += `&minPrice=${minPrice}`;
    if (maxPrice !== undefined) path += `&maxPrice=${maxPrice}`;
    return fetchProductList(path);
}
export async function getTop3LatestProducts(): Promise<ResultInterface> {
    //xác định  endpoint
    const path = `http://localhost:8089/products/search/findByActiveTrue?sort=id,desc&page=0&size=3`;
    return fetchProductList(path);// fetchProductList là tên mới của layDanhSachSach

}

export async function searchProducts(keyword: string, page: number = 0, size: number = 8, categoryId: number = 0): Promise<ResultInterface> {
    let path: string = `http://localhost:8089/products/search/findByActiveTrue?sort=id,desc&page=${page}&size=${size}`; 

    if (keyword !== '' && categoryId == 0) {
        // CẬP NHẬT TÊN HÀM: findByNameContainingAndActiveTrue (Và đổi tham số productName thành name cho khớp Backend)
        path = `http://localhost:8089/products/search/findByNameContainingAndActiveTrue?name=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
    } else if (keyword === '' && categoryId > 0) {
        // CẬP NHẬT TÊN HÀM: findByCategories_Id
        path = `http://localhost:8089/products/search/findByCategories_Id?categoryId=${categoryId}&page=${page}&size=${size}`;
    } else if (keyword !== '' && categoryId > 0) {
        // CẬP NHẬT TÊN HÀM: findByNameContainingAndCategories_IdAndActiveTrue
        path = `http://localhost:8089/products/search/findByNameContainingAndCategories_IdAndActiveTrue?name=${encodeURIComponent(keyword)}&id=${categoryId}&page=${page}&size=${size}`;
    }

    return fetchProductList(path);
}



export async function getProductById(productId: number): Promise<ProductModel | null> {
    // TRẢ LẠI NHƯ CŨ, KHÔNG THÊM findByActiveTrue VÀO ĐÂY
    const path = `http://localhost:8089/products/${productId}`;

    let result: ProductModel;
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Gặp lỗi trong quá trinh tải sản phẩm với mã ${productId}`);
        }
        
        const productData = await response.json();
        
        // (Tùy chọn) Nếu bạn muốn chặn đứng không cho xem chi tiết khi sản phẩm đã bị ẩn:
        if (productData.active === false) {
             console.warn("Sản phẩm này đã bị ẩn!");
             return null; 
        }

        if (productData) {
            return {
                id: productData.id,
                avgRating: productData.avgRating,
                brand: productData.brand,
                description: productData.description,
                dimensions: productData.dimensions,
                listPrice: productData.listPrice,
                material: productData.material,
                name: productData.name,
                quantity: productData.quantity,
                sellingPrice: productData.sellingPrice
            };
        } else {
            throw new Error(`Không tìm thấy sản phẩm`);
        }
    } catch (error) {
        console.error("Error in getProductById:", error);
        return null;
    }
}



export async function filterProducts(
    page: number = 0,
    size: number = 8,
    name: string = "",
    minPrice?: number,
    maxPrice?: number,
    sortBy: string = "id",
    sortDir: string = "desc",
    categoryId?: number
): Promise<ResultInterface> {
    let path = "";

    if (categoryId && categoryId > 0) {
        // GỌI THẲNG TÊN HÀM findByCategoryAndPrice
        path = `http://localhost:8089/products/search/findByCategoryAndPrice` +
               `?categoryId=${categoryId}` +
               `&page=${page}&size=${size}&sort=${sortBy},${sortDir}`;
    } else {
        // GỌI THẲNG TÊN HÀM findByFilter
        path = `http://localhost:8089/products/search/findByFilter` +
               `?name=${encodeURIComponent(name)}` +
               `&page=${page}&size=${size}&sort=${sortBy},${sortDir}`;
    }

    if (minPrice !== undefined) path += `&minPrice=${minPrice}`;
    if (maxPrice !== undefined) path += `&maxPrice=${maxPrice}`;

    return fetchProductList(path);
}