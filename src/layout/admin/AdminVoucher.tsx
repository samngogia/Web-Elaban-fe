import React, { useEffect, useState } from "react";
import FormatNumber from "../utils/FormatNumber";

const API = "http://localhost:8089";
const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
});

const EMPTY_FORM = {
    code: "", discountType: "PERCENT", discountValue: 0,
    minOrderAmount: 0, maxUses: "", expiredDate: "", isActive: true,
};

const AdminVoucher: React.FC = () => {
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<any>(EMPTY_FORM);
    const [isLoading, setIsLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const [isError, setIsError] = useState(false);

    const fetchVouchers = async () => {
        setIsLoading(true);
        const res = await fetch(`${API}/api/voucher/admin`, { headers: authHeader() });
        const data = await res.json();
        setVouchers(Array.isArray(data) ? data : []);
        setIsLoading(false);
    };

    useEffect(() => { fetchVouchers(); }, []);

    const openAdd = () => {
        setEditId(null); setForm(EMPTY_FORM); setMsg(""); setShowForm(true);
    };

    const openEdit = (v: any) => {
        setEditId(v.id);
        setForm({
            code: v.code, discountType: v.discountType,
            discountValue: v.discountValue, minOrderAmount: v.minOrderAmount,
            maxUses: v.maxUses ?? "", isActive: v.isActive,
            expiredDate: v.expiredDate ? v.expiredDate.substring(0, 16) : "",
        });
        setMsg(""); setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.code || !form.discountValue) {
            setMsg("Vui lòng nhập đầy đủ!"); setIsError(true); return;
        }
        const body = {
            ...form,
            code: form.code.toUpperCase(),
            discountValue: Number(form.discountValue),
            minOrderAmount: Number(form.minOrderAmount),
            maxUses: form.maxUses ? Number(form.maxUses) : null,
            expiredDate: form.expiredDate ? form.expiredDate + ":00" : null,
        };
        const url = editId ? `${API}/api/voucher/admin/${editId}` : `${API}/api/voucher/admin`;
        const res = await fetch(url, {
            method: editId ? "PUT" : "POST",
            headers: authHeader(),
            body: JSON.stringify(body),
        });
        if (res.ok) {
            setShowForm(false); fetchVouchers();
        } else {
            setMsg("Lỗi lưu voucher!"); setIsError(true);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Xóa voucher này?")) return;
        await fetch(`${API}/api/voucher/admin/${id}`, { method: "DELETE", headers: authHeader() });
        fetchVouchers();
    };

    const s: Record<string, React.CSSProperties> = {
        header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
        addBtn: { background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer" },
        card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", padding: 24 },
        table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
        th: { textAlign: "left" as const, padding: "10px 12px", color: "#aaa", fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", borderBottom: "0.5px solid #eee" },
        td: { padding: "12px", borderBottom: "0.5px solid #f5f5f5", verticalAlign: "middle" as const },
        codeBadge: { background: "#1a1a1a", color: "#fff", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.05em" },
        editBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", marginRight: 6 },
        deleteBtn: { background: "none", border: "0.5px solid #ffcdd2", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#d32f2f" },
        overlay: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
        modal: { background: "#fff", borderRadius: 16, padding: 32, width: 480, maxHeight: "90vh", overflowY: "auto" as const, position: "relative" as const },
        label: { display: "block", fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 600 },
        input: { width: "100%", padding: "10px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: "border-box" as const },
        grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" },
        badge: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 },
    };

    return (
        <div>
            <div style={s.header}>
                <h2 style={{ fontSize: 22, fontWeight: 400 }}>Quản lý voucher</h2>
                <button style={s.addBtn} onClick={openAdd}>+ Thêm voucher</button>
            </div>

            <div style={s.card}>
                {isLoading ? (
                    <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
                        <div className="spinner-border text-secondary mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '15px', fontWeight: 500 }}>
                            Đang tải danh sách voucher...
                        </p>
                    </div>
                ) : (
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>MÃ</th>
                                <th style={s.th}>KIỂU GIẢM</th>
                                <th style={s.th}>MỨC GIẢM</th>
                                <th style={s.th}>ĐƠN TỐI THIỂU</th>
                                <th style={s.th}>ĐÃ DÙNG / GIỚI HẠN</th>
                                <th style={s.th}>HẾT HẠN</th>
                                <th style={s.th}>TRẠNG THÁI</th>
                                <th style={s.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map(v => (
                                <tr key={v.id}>
                                    <td style={s.td}>
                                        <span style={s.codeBadge}>{v.code}</span>
                                    </td>
                                    <td style={s.td}>
                                        {v.discountType === "PERCENT" ? "Phần trăm (%)" : "Tiền mặt"}
                                    </td>
                                    <td style={s.td}>
                                        {v.discountType === "PERCENT"
                                            ? `${v.discountValue}%`
                                            : `${FormatNumber(v.discountValue)}đ`}
                                    </td>
                                    <td style={s.td}>
                                        {v.minOrderAmount > 0 ? `${FormatNumber(v.minOrderAmount)}đ` : "Không có"}
                                    </td>
                                    <td style={s.td}>
                                        {v.usedCount} / {v.maxUses ?? "∞"}
                                    </td>
                                    <td style={s.td}>
                                        {v.expiredDate
                                            ? new Date(v.expiredDate).toLocaleDateString("vi-VN")
                                            : "Không giới hạn"}
                                    </td>
                                    <td style={s.td}>
                                        <span style={{
                                            ...s.badge,
                                            background: v.active ? "#EAF3DE" : "#f0f0f0",
                                            color: v.active ? "#27500A" : "#888"
                                        }}>
                                            {v.active ? "Hoạt động" : "Tắt"}
                                        </span>
                                    </td>
                                    <td style={s.td}>
                                        <button style={s.editBtn} onClick={() => openEdit(v)}>Sửa</button>
                                        <button style={s.deleteBtn} onClick={() => handleDelete(v.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showForm && (
                <div style={s.overlay} onClick={() => setShowForm(false)}>
                    <div style={s.modal} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24 }}>
                            {editId ? "Chỉnh sửa voucher" : "Thêm voucher mới"}
                        </h3>

                        {msg && (
                            <div style={{ fontSize: 13, padding: "10px 14px", borderRadius: 8, marginBottom: 16, background: isError ? "#FCEBEB" : "#EAF3DE", color: isError ? "#791F1F" : "#27500A" }}>
                                {msg}
                            </div>
                        )}

                        <label style={s.label}>MÃ VOUCHER</label>
                        <input style={{ ...s.input, textTransform: "uppercase", fontFamily: "monospace", fontWeight: 600 }}
                            value={form.code}
                            onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                            placeholder="VD: SUMMER20" />

                        <label style={s.label}>KIỂU GIẢM GIÁ</label>
                        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                            {["PERCENT", "FIXED"].map(type => (
                                <button key={type}
                                    style={{
                                        flex: 1, padding: "9px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                                        background: form.discountType === type ? "#1a1a1a" : "#fff",
                                        color: form.discountType === type ? "#fff" : "#333",
                                        border: `0.5px solid ${form.discountType === type ? "#1a1a1a" : "#ddd"}`,
                                    }}
                                    onClick={() => setForm({ ...form, discountType: type })}
                                >
                                    {type === "PERCENT" ? "% Phần trăm" : "💰 Tiền mặt"}
                                </button>
                            ))}
                        </div>

                        <div style={s.grid2}>
                            <div>
                                <label style={s.label}>
                                    MỨC GIẢM {form.discountType === "PERCENT" ? "(%)" : "(đ)"}
                                </label>
                                <input style={s.input} type="number"
                                    value={form.discountValue}
                                    onChange={e => setForm({ ...form, discountValue: e.target.value })} />
                            </div>
                            <div>
                                <label style={s.label}>ĐƠN TỐI THIỂU (đ)</label>
                                <input style={s.input} type="number"
                                    value={form.minOrderAmount}
                                    onChange={e => setForm({ ...form, minOrderAmount: e.target.value })} />
                            </div>
                        </div>

                        <div style={s.grid2}>
                            <div>
                                <label style={s.label}>GIỚI HẠN SỬ DỤNG</label>
                                <input style={s.input} type="number" placeholder="Để trống = không giới hạn"
                                    value={form.maxUses}
                                    onChange={e => setForm({ ...form, maxUses: e.target.value })} />
                            </div>
                            <div>
                                <label style={s.label}>NGÀY HẾT HẠN</label>
                                <input style={s.input} type="datetime-local"
                                    value={form.expiredDate}
                                    onChange={e => setForm({ ...form, expiredDate: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                            <input type="checkbox" id="isActive" checked={form.isActive}
                                onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                            <label htmlFor="isActive" style={{ fontSize: 13, cursor: "pointer" }}>
                                Kích hoạt voucher
                            </label>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                            <button onClick={() => setShowForm(false)}
                                style={{ background: "none", border: "0.5px solid #ddd", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer" }}>
                                Hủy
                            </button>
                            <button onClick={handleSave}
                                style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, cursor: "pointer" }}>
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVoucher;