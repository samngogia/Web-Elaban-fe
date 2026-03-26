import React, { useEffect, useState } from "react";
import ProductModel from "../../models/ProductModel";
import ProductProps from "./components/ProductProps"; // Đổi tên SachProps
import { getAllProducts, searchProducts } from "../../api/ProductApi"; // Đổi tên hàm API
import { Pagination } from "../utils/Pagination"; // Sử dụng Pagination đã đổi tên

interface ProductListProps {
    searchKeyword: string; // Đổi từ tuKhoaTimKiem
    categoryId: number; // Đổi từ maTheLoai
}

const ProductList = ({ searchKeyword, categoryId }: ProductListProps) => {
    const [products, setProducts] = useState<ProductModel[]>([]); // Đổi từ danhSachQuyenSach
    const [loading, setLoading] = useState<boolean>(true); // Đổi từ dangTaiDuLieu
    const [error, setError] = useState<string | null>(null); // Đổi từ baoLoi
    const [currentPage, setCurrentPage] = useState(1); // Đổi từ trangHienTai
    const [totalPages, setTotalPages] = useState(0); // Đổi từ tongSoTrang

    // 1. Reset về trang 1 khi từ khóa hoặc thể loại thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword, categoryId]);

    // 2. Gọi API để lấy dữ liệu sản phẩm nội thất
    useEffect(() => {
        setLoading(true);
        if (searchKeyword === '' && categoryId === 0) {
            getAllProducts(currentPage - 1).then(
                result => {
                    setProducts(result.result);
                    setTotalPages(result.totalPages);
                    setLoading(false);
                }
            ).catch(
                err => {
                    setError(err.message);
                    setLoading(false);
                }
            );
        } else {
            searchProducts(searchKeyword, currentPage - 1, 8, categoryId).then(
                result => {
                    setProducts(result.result);
                    setTotalPages(result.totalPages);
                    setLoading(false);
                }
            ).catch(
                err => {
                    setError(err.message);
                    setLoading(false);
                }
            );
        }
    }, [currentPage, searchKeyword, categoryId]);

    const handlePaginate = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div className="container mt-5"><h1>Loading products...</h1></div>;
    }

    if (error) {
        return <div className="container mt-5"><h1>Error: {error}</h1></div>;
    }

    return (
        <div className="container">
            <div className="row mt-4 mb-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductProps key={product.id} product={product} />
                    ))
                ) : (
                    <div className="container mt-5">
                        <h4 className="text-center">No products found matching your search.</h4>
                    </div>
                )}
            </div>
            
            {/* Sử dụng Component Pagination đã Tây hóa */}
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                paginate={handlePaginate} 
            />
        </div>
    );
}

export default ProductList;