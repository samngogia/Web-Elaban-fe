import React, { useEffect, useState } from "react";
import FormatNumber from "../utils/FormatNumber";

const INITIAL_PRODUCT = {
    id: 0,
    name: '',
    description: '',
    listPrice: 0,
    sellingPrice: 0,
    quantity: 0,
    avgRating: null as null,
    brand: '',
    dimensions: '',
    material: '',
    categoryId: '' // MỚI THÊM: Trạng thái lưu ID thể loại tạm thời
};

const API = "http://localhost:8089";
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ "Authorization": `Bearer ${getToken()}` });

const AdminProduct: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]); // MỚI THÊM: State chứa danh sách thể loại
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [product, setProduct] = useState(INITIAL_PRODUCT);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // MỚI THÊM: Hàm gọi API lấy danh sách Thể loại
    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API}/admin/categories`, { headers: authHeader() });
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error("Lỗi lấy danh sách thể loại:", err);
        }
    };

    const fetchProducts = async (page = 0) => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${API}/products?sort=id,desc&page=${page}&size=10`,
                { headers: authHeader() }
            );
            const data = await res.json();
            setProducts(data._embedded?.products ?? []);
            setTotalPages(data.page?.totalPages ?? 0);
            setCurrentPage(page);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // MỚI THÊM: Gọi fetchCategories khi component render lần đầu
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // MỚI THÊM: Tách categoryId ra, tạo mảng categories để map với entity @ManyToMany trong Java
            const { id, categoryId, ...productData } = product;

            const payload = {
                ...productData,
                // Gói id thể loại vào mảng object để Spring Boot hiểu
                categories: categoryId ? [`${API}/categories/${categoryId}`] : []
            };

            if (editMode) {
                const res = await fetch(`${API}/products/${product.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", ...authHeader() },
                    body: JSON.stringify(payload) // Gửi payload đã xử lý category
                });

                if (!res.ok) throw new Error("Cập nhật thất bại: " + await res.text());

            } else {
                const res = await fetch(`${API}/products`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...authHeader() },
                    body: JSON.stringify(payload) // Gửi payload đã xử lý category
                });

                if (!res.ok) throw new Error("Thêm thất bại: " + await res.text());

                const saved = await res.json();

                if (imageFile && saved.id) {
                    const formData = new FormData();
                    formData.append("file", imageFile);
                    formData.append("isThumbnail", "true");

                    const imgRes = await fetch(`${API}/api/images/upload/${saved.id}`, {
                        method: "POST",
                        headers: authHeader(),
                        body: formData
                    });

                    if (!imgRes.ok) throw new Error("Lưu thông tin thành công nhưng lỗi upload ảnh!");
                }
            }

            alert(editMode ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!");
            setProduct(INITIAL_PRODUCT);
            setImageFile(null);
            setPreviewUrl("");
            setShowForm(false);
            setEditMode(false);
            fetchProducts(currentPage);

        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (p: any) => {
        setProduct({
            id: p.id,
            name: p.name ?? '',
            description: p.description ?? '',
            listPrice: p.listPrice ?? 0,
            sellingPrice: p.sellingPrice ?? 0,
            quantity: p.quantity ?? 0,
            avgRating: p.avgRating ?? null,
            brand: p.brand ?? '',
            dimensions: p.dimensions ?? '',
            material: p.material ?? '',
            // MỚI THÊM: Nếu Spring Data trả về categories, lấy ID của phần tử đầu tiên để hiện lên form
            categoryId: p.categories && p.categories.length > 0 ? p.categories[0].id.toString() : ''
        });
        setEditMode(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            await fetch(`${API}/products/${id}`, {
                method: "DELETE",
                headers: authHeader()
            });
            fetchProducts(currentPage);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
    );

    const s: Record<string, React.CSSProperties> = {
        header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
        addBtn: { background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer" },
        addBtnDisabled: { background: "#e0e0e0", color: "#a0a0a0", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "not-allowed" },
        cancelBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer", marginLeft: 8 },
        card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", padding: 24, marginBottom: 24 },
        formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" },
        label: { display: "block", fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 600 },
        input: { width: "100%", padding: "10px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: "border-box" as const },
        table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
        th: { textAlign: "left" as const, padding: "10px 12px", color: "#aaa", fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", borderBottom: "0.5px solid #eee" },
        td: { padding: "12px", borderBottom: "0.5px solid #f5f5f5", verticalAlign: "middle" as const },
        editBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", marginRight: 6 },
        deleteBtn: { background: "none", border: "0.5px solid #ffcdd2", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#d32f2f" },
        searchInput: { padding: "8px 14px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, width: 240 },
        pageBtn: { padding: "6px 12px", border: "0.5px solid #ddd", borderRadius: 6, fontSize: 12, cursor: "pointer", margin: "0 3px", background: "#fff" },
        pageBtnActive: { background: "#1a1a1a", color: "#fff", border: "0.5px solid #1a1a1a" },
    };

    const isFormValid =
        product.name.trim() !== "" &&
        product.listPrice > 0 &&
        product.sellingPrice > 0 &&
        product.quantity >= 0 &&
        product.categoryId !== ""; // Bắt buộc phải chọn thể loại

    return (
        <div>
            <div style={s.header}>
                <h2 style={{ fontSize: 22, fontWeight: 400 }}>Quản lý sản phẩm</h2>
                <div>
                    <button style={s.addBtn} onClick={() => {
                        setProduct(INITIAL_PRODUCT);
                        setEditMode(false);
                        setShowForm(!showForm);
                    }}>
                        {showForm ? "Đóng" : "+ Thêm sản phẩm"}
                    </button>
                </div>
            </div>

            {/* Form thêm/sửa */}
            {showForm && (
                <div style={s.card}>
                    <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>
                        {editMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div style={s.formGrid}>
                            <div>
                                <label style={s.label}>TÊN SẢN PHẨM</label>
                                <input style={s.input} type="text" value={product.name}
                                    onChange={e => setProduct({ ...product, name: e.target.value })} required />

                                {/* MỚI THÊM: Giao diện Dropdown chọn Thể loại */}
                                <label style={s.label}>THỂ LOẠI</label>
                                <select
                                    style={s.input}
                                    value={product.categoryId}
                                    onChange={e => setProduct({ ...product, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Chọn thể loại sản phẩm --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>

                                <label style={s.label}>GIÁ NIÊM YẾT</label>
                                <input style={s.input} type="number" value={product.listPrice}
                                    onChange={e => setProduct({ ...product, listPrice: parseFloat(e.target.value) })} required />

                                <label style={s.label}>GIÁ BÁN</label>
                                <input style={s.input} type="number" value={product.sellingPrice}
                                    onChange={e => setProduct({ ...product, sellingPrice: parseFloat(e.target.value) })} required />

                                <label style={s.label}>SỐ LƯỢNG</label>
                                <input style={s.input} type="number" value={product.quantity}
                                    onChange={e => setProduct({ ...product, quantity: parseInt(e.target.value) })} required />
                            </div>

                            <div>
                                <label style={s.label}>THƯƠNG HIỆU</label>
                                <input style={s.input} type="text" value={product.brand}
                                    onChange={e => setProduct({ ...product, brand: e.target.value })} />

                                <label style={s.label}>CHẤT LIỆU</label>
                                <input style={s.input} type="text" value={product.material}
                                    onChange={e => setProduct({ ...product, material: e.target.value })} />

                                <label style={s.label}>KÍCH THƯỚC</label>
                                <input style={s.input} type="text" value={product.dimensions}
                                    onChange={e => setProduct({ ...product, dimensions: e.target.value })} />

                                {!editMode && (
                                    <>
                                        <label style={s.label}>ẢNH SẢN PHẨM</label>
                                        <input style={s.input} type="file" accept="image/*" onChange={handleImageChange} />
                                        {previewUrl && (
                                            <img src={previewUrl} alt="Preview"
                                                style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 16 }} />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <label style={s.label}>MÔ TẢ</label>
                        <textarea style={{ ...s.input, height: 80 }} value={product.description}
                            onChange={e => setProduct({ ...product, description: e.target.value })} />

                        <div>
                            <button
                                type="submit"
                                className="d-flex justify-content-center align-items-center"
                                style={(isSubmitting || !isFormValid) ? s.addBtnDisabled : s.addBtn}
                                disabled={isSubmitting || !isFormValid}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang lưu...
                                    </>
                                ) : (
                                    editMode ? "Cập nhật" : "Thêm sản phẩm"
                                )}
                            </button>

                            <button type="button" style={s.cancelBtn}
                                onClick={() => { setShowForm(false); setEditMode(false); setProduct(INITIAL_PRODUCT); }}>
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Danh sách sản phẩm giữ nguyên như cũ... */}
            {/* ... */}
            <div style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 13, color: "#888" }}>{filteredProducts.length} sản phẩm</span>
                    <input
                        style={s.searchInput}
                        placeholder="Tìm kiếm sản phẩm..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
                        <div className="spinner-border text-secondary mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '15px', fontWeight: 500 }}>
                            Đang tải danh sách sản phẩm...
                        </p>
                    </div>
                ) : (
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>ID</th>
                                <th style={s.th}>TÊN SẢN PHẨM</th>
                                <th style={s.th}>GIÁ BÁN</th>
                                <th style={s.th}>GIÁ NIÊM YẾT</th>
                                <th style={s.th}>SỐ LƯỢNG</th>
                                <th style={s.th}>THƯƠNG HIỆU</th>
                                <th style={s.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => (
                                <tr key={p.id}>
                                    <td style={s.td}>#{p.id}</td>
                                    <td style={{ ...s.td, maxWidth: 200 }}>
                                        <span style={{ fontWeight: 500 }}>{p.name}</span>
                                    </td>
                                    <td style={s.td}>{FormatNumber(p.sellingPrice)}đ</td>
                                    <td style={s.td}><del style={{ color: "#aaa" }}>{FormatNumber(p.listPrice)}đ</del></td>
                                    <td style={s.td}>{p.quantity}</td>
                                    <td style={s.td}>{p.brand}</td>
                                    <td style={s.td}>
                                        <button style={s.editBtn} onClick={() => handleEdit(p)}>Sửa</button>
                                        <button style={s.deleteBtn} onClick={() => handleDelete(p.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                style={{ ...s.pageBtn, ...(i === currentPage ? s.pageBtnActive : {}) }}
                                onClick={() => fetchProducts(i)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProduct;