import React, { useEffect, useState } from "react";
import ProductModel from "../../models/ProductModel";
import ProductProps from "./components/ProductProps";
import { filterProducts, ResultInterface } from "../../api/ProductApi";
import { Pagination } from "../utils/Pagination";

interface ProductListProps {
    searchKeyword: string;
    categoryId: number;
}

const ProductList = ({ searchKeyword, categoryId }: ProductListProps) => {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Bộ lọc
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("id,desc");
    const [appliedMin, setAppliedMin] = useState<number | undefined>(undefined);
    const [appliedMax, setAppliedMax] = useState<number | undefined>(undefined);
    const [appliedSort, setAppliedSort] = useState<string>("id,desc");
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => { setCurrentPage(1); }, [searchKeyword, categoryId]);

    useEffect(() => {
        setLoading(true);
        const [sortField, sortDir] = appliedSort.split(",");

        filterProducts(
            currentPage - 1,
            8,
            searchKeyword,
            appliedMin,
            appliedMax,
            sortField,
            sortDir,
            categoryId > 0 ? categoryId : undefined
        ).then((result: ResultInterface) => {   // thêm type
            setProducts(result.result);
            setTotalPages(result.totalPages);
            setLoading(false);
        }).catch((err: any) => {                // thêm type
            setError(err.message);
            setLoading(false);
        });
    }, [currentPage, searchKeyword, categoryId, appliedMin, appliedMax, appliedSort]);

    const handleApplyFilter = () => {
        setAppliedMin(minPrice ? Number(minPrice) : undefined);
        setAppliedMax(maxPrice ? Number(maxPrice) : undefined);
        setAppliedSort(sortBy);
        setCurrentPage(1);
        setShowFilter(false);
    };

    const handleResetFilter = () => {
        setMinPrice("");
        setMaxPrice("");
        setSortBy("id,desc");
        setAppliedMin(undefined);
        setAppliedMax(undefined);
        setAppliedSort("id,desc");
        setCurrentPage(1);
    };

    const isFiltered = appliedMin !== undefined || appliedMax !== undefined || appliedSort !== "id,desc";

    const s: Record<string, React.CSSProperties> = {
        filterBar: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 8px", flexWrap: "wrap" as const, gap: 8 },
        filterBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 8, padding: "7px 16px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
        filterBtnActive: { border: "0.5px solid #1a1a1a", background: "#1a1a1a", color: "#fff" },
        sortSelect: { padding: "7px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, cursor: "pointer" },
        panel: { background: "#fff", border: "0.5px solid #e8e5e0", borderRadius: 12, padding: 20, marginBottom: 20 },
        panelTitle: { fontSize: 13, fontWeight: 600, color: "#888", marginBottom: 12, letterSpacing: "0.06em" },
        priceRow: { display: "flex", gap: 12, alignItems: "center", marginBottom: 16 },
        input: { flex: 1, padding: "8px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13 },
        applyBtn: { background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, cursor: "pointer" },
        resetBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", marginLeft: 8 },
        activeBadge: { background: "#FAEEDA", color: "#633806", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 },
    };

    if (loading) {
        return (
            <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-dark mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-muted" style={{ fontWeight: 500 }}>Đang tải danh sách sản phẩm...</h5>
            </div>
        );
    }
    if (error) return <div className="container mt-5"><h4 className="text-center text-danger">Lỗi: {error}</h4></div>;

    return (
        <div className="container">
            {/* Filter bar */}
            <div style={s.filterBar}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                        style={{ ...s.filterBtn, ...(showFilter ? s.filterBtnActive : {}) }}
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        ⚡ Bộ lọc
                        {isFiltered && <span style={s.activeBadge}>Đang lọc</span>}
                    </button>
                    {isFiltered && (
                        <button style={s.filterBtn} onClick={handleResetFilter}>
                            ✕ Xóa lọc
                        </button>
                    )}
                </div>

                {/* Sắp xếp nhanh */}
                <select
                    style={s.sortSelect}
                    value={sortBy}
                    onChange={e => { setSortBy(e.target.value); setAppliedSort(e.target.value); setCurrentPage(1); }}
                >
                    <option value="id,desc">Mới nhất</option>
                    <option value="id,asc">Cũ nhất</option>
                    <option value="sellingPrice,asc">Giá thấp → cao</option>
                    <option value="sellingPrice,desc">Giá cao → thấp</option>
                </select>
            </div>

            {/* Panel lọc giá */}
            {showFilter && (
                <div style={s.panel}>
                    <div style={s.panelTitle}>LỌC THEO GIÁ</div>
                    <div style={s.priceRow}>
                        <input
                            style={s.input}
                            type="number"
                            placeholder="Giá từ (đ)"
                            value={minPrice}
                            onChange={e => setMinPrice(e.target.value)}
                        />
                        <span style={{ color: "#aaa" }}>—</span>
                        <input
                            style={s.input}
                            type="number"
                            placeholder="Giá đến (đ)"
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                        />
                    </div>

                    {/* Gợi ý khoảng giá nhanh */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 16 }}>
                        {[
                            { label: "Dưới 5 triệu", min: "", max: "5000000" },
                            { label: "5 - 10 triệu", min: "5000000", max: "10000000" },
                            { label: "10 - 20 triệu", min: "10000000", max: "20000000" },
                            { label: "Trên 20 triệu", min: "20000000", max: "" },
                        ].map(range => (
                            <button
                                key={range.label}
                                style={{
                                    ...s.filterBtn,
                                    fontSize: 12,
                                    padding: "5px 12px",
                                    ...(minPrice === range.min && maxPrice === range.max ? s.filterBtnActive : {})
                                }}
                                onClick={() => { setMinPrice(range.min); setMaxPrice(range.max); }}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>

                    <div>
                        <button style={s.applyBtn} onClick={handleApplyFilter}>Áp dụng</button>
                        <button style={s.resetBtn} onClick={handleResetFilter}>Đặt lại</button>
                    </div>
                </div>
            )}

            {/* Danh sách sản phẩm */}
            <div className="row mt-2 mb-4">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductProps key={product.id} product={product} />
                    ))
                ) : (
                    <div className="container mt-5">
                        <h4 className="text-center">Không tìm thấy sản phẩm phù hợp.</h4>
                    </div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={(page: number) => setCurrentPage(page)}
            />
        </div>
    );
};

export default ProductList;