import React, { useEffect, useState } from "react";

const API = "http://localhost:8089";
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ "Authorization": `Bearer ${getToken()}` });

const AdminCategory: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ id: 0, name: "", parentId: null as number | null });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/admin/categories`, { headers: authHeader() });
            // KIỂM TRA PHẢN HỒI TRƯỚC KHI .json()
            if (!res.ok) {
                if (res.status === 401) throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                if (res.status === 403) throw new Error("Bạn không có quyền truy cập mục này.");
                throw new Error(`Lỗi hệ thống: ${res.status}`);
            }
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : data._embedded?.categories ?? []);
        } catch (err: any) {

            console.error(err);
            alert(err.message);
        }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editMode) {
                await fetch(`${API}/admin/categories/${form.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", ...authHeader() },
                    body: JSON.stringify({ name: form.name, parentId: form.parentId })
                });
            } else {
                await fetch(`${API}/admin/categories`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...authHeader() },
                    body: JSON.stringify({ name: form.name, parentId: form.parentId })
                });
            }
            setForm({ id: 0, name: "", parentId: null });
            setShowForm(false);
            setEditMode(false);
            fetchCategories();
        } catch (err: any) { alert(err.message); }
        finally { setIsSubmitting(false); }
    };

    const handleEdit = (cat: any) => {
        setForm({ id: cat.id, name: cat.name, parentId: cat.parentId ?? null });
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Xóa danh mục này?")) return;
        await fetch(`${API}/admin/categories/${id}`, {
            method: "DELETE",
            headers: authHeader()
        });
        fetchCategories();
    };

    // Tách danh mục cha và con
    const parentCategories = categories.filter(c => !c.parentId);
    const childCategories = (parentId: number) => categories.filter(c => c.parentId === parentId);

    const s: Record<string, React.CSSProperties> = {
        header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
        addBtn: { background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer" },
        cancelBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer", marginLeft: 8 },
        card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", padding: 24, marginBottom: 24 },
        label: { display: "block", fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 600 },
        input: { width: "100%", padding: "10px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: "border-box" as const },
        select: { width: "100%", padding: "10px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, marginBottom: 16 },
        table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
        th: { textAlign: "left" as const, padding: "10px 12px", color: "#aaa", fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", borderBottom: "0.5px solid #eee" },
        td: { padding: "12px", borderBottom: "0.5px solid #f5f5f5" },
        editBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", marginRight: 6 },
        deleteBtn: { background: "none", border: "0.5px solid #ffcdd2", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#d32f2f" },
        parentRow: { background: "#fafaf8", fontWeight: 500 },
        childRow: { paddingLeft: 32 },
        badge: { background: "#f0f0f0", color: "#666", padding: "2px 8px", borderRadius: 12, fontSize: 11 },
    };

    return (
        <div>
            <div style={s.header}>
                <h2 style={{ fontSize: 22, fontWeight: 400 }}>Quản lý danh mục</h2>
                <button style={s.addBtn} onClick={() => {
                    setForm({ id: 0, name: "", parentId: null });
                    setEditMode(false);
                    setShowForm(!showForm);
                }}>
                    {showForm ? "Đóng" : "+ Thêm danh mục"}
                </button>
            </div>

            {/* Form thêm/sửa */}
            {showForm && (
                <div style={s.card}>
                    <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>
                        {editMode ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
                        <label style={s.label}>TÊN DANH MỤC</label>
                        <input
                            style={s.input}
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="VD: Ghế sofa cao cấp"
                            required
                        />

                        <label style={s.label}>DANH MỤC CHA (để trống nếu là danh mục gốc)</label>
                        <select
                            style={s.select}
                            value={form.parentId ?? ""}
                            onChange={e => setForm({ ...form, parentId: e.target.value ? Number(e.target.value) : null })}
                        >
                            <option value="">— Không có danh mục cha —</option>
                            {parentCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <div>
                            <button type="submit" style={s.addBtn} disabled={isSubmitting}>
                                {isSubmitting ? "Đang lưu..." : (editMode ? "Cập nhật" : "Thêm danh mục")}
                            </button>
                            <button type="button" style={s.cancelBtn}
                                onClick={() => { setShowForm(false); setEditMode(false); }}>
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Danh sách */}
            <div style={s.card}>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
                    {categories.length} danh mục
                </div>

                {isLoading ? (
                    <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
                        <div className="spinner-border text-secondary mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '15px', fontWeight: 500 }}>
                            Đang tải danh sách đơn hàng...
                        </p>
                    </div>
                ) : (
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>ID</th>
                                <th style={s.th}>TÊN DANH MỤC</th>
                                <th style={s.th}>DANH MỤC CHA</th>
                                <th style={s.th}>SỐ DANH MỤC CON</th>
                                <th style={s.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {parentCategories.map(cat => (
                                <React.Fragment key={cat.id}>
                                    {/* Danh mục cha */}
                                    <tr style={s.parentRow}>
                                        <td style={s.td}>{cat.id}</td>
                                        <td style={s.td}>
                                            <span style={{ fontWeight: 600 }}>📁 {cat.name}</span>
                                        </td>
                                        <td style={s.td}><span style={s.badge}>Gốc</span></td>
                                        <td style={s.td}>{childCategories(cat.id).length}</td>
                                        <td style={s.td}>
                                            <button style={s.editBtn} onClick={() => handleEdit(cat)}>Sửa</button>
                                            <button style={s.deleteBtn} onClick={() => handleDelete(cat.id)}>Xóa</button>
                                        </td>
                                    </tr>
                                    {/* Danh mục con */}
                                    {childCategories(cat.id).map(child => (
                                        <tr key={child.id}>
                                            <td style={s.td}>{child.id}</td>
                                            <td style={{ ...s.td, paddingLeft: 32 }}>
                                                └ {child.name}
                                            </td>
                                            <td style={s.td}>{cat.name}</td>
                                            <td style={s.td}>—</td>
                                            <td style={s.td}>
                                                <button style={s.editBtn} onClick={() => handleEdit(child)}>Sửa</button>
                                                <button style={s.deleteBtn} onClick={() => handleDelete(child.id)}>Xóa</button>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminCategory;