import React, { useEffect, useState } from "react";

const API = "http://localhost:8089";
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ "Authorization": `Bearer ${getToken()}` });

const AdminUser: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("");

    // --- STATE CHO MODAL THÊM NHÂN VIÊN ---
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        roleName: "STAFF" // Mặc định là tạo Staff
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/admin/users`, { headers: authHeader() });
            const data = await res.json();
            console.log("Dữ liệu 1 user từ Java gửi xuống:", data[0]);
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleToggleEnabled = async (id: number) => {
        await fetch(`${API}/admin/users/${id}/toggle-enabled`, {
            method: "PATCH",
            headers: authHeader()
        });
        fetchUsers();
    };

    const handleDelete = async (id: number, username: string) => {
        if (!window.confirm(`Xóa tài khoản "${username}"?`)) return;
        await fetch(`${API}/admin/users/${id}`, {
            method: "DELETE",
            headers: authHeader()
        });
        fetchUsers();
    };


    // --- HÀM XỬ LÝ LƯU NHÂN VIÊN MỚI ---
    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/admin/users`, {
                method: "POST",
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert("Thêm người dùng thành công!");
                setShowModal(false); // Đóng modal
                setFormData({ username: "", email: "", password: "", firstName: "", lastName: "", roleName: "STAFF" }); // Reset form
                fetchUsers(); // Tải lại danh sách
            } else {
                const text = await res.text();
                alert("Lỗi: " + text);
            }
        } catch (err) {
            console.error(err);
            alert("Không thể thêm người dùng. Vui lòng kiểm tra lại mạng hoặc server.");
        }
    };

    // 1. Thêm hàm kiểm tra thông minh này
    const hasRole = (roles: any[], roleName: string) => {
        if (!roles || !Array.isArray(roles)) return false;
        // Kiểm tra xem role đang là chuỗi "ROLE_ADMIN" hay là object { name: "ROLE_ADMIN" }
        return roles.some(r => r === roleName || r.name === roleName || r.authority === roleName);
    };



    // 2. Cập nhật lại logic tìm lọc (để nút bấm Filter hoạt động chuẩn)
    const filteredUsers = users.filter(u => {
        const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        // Thay thế u.roles?.includes(...) bằng hàm hasRole
        const matchRole = filterRole === "" || hasRole(u.roles, filterRole);
        return matchSearch && matchRole;
    });

    const s: Record<string, React.CSSProperties> = {
        header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
        card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", padding: 24 },
        table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
        th: { textAlign: "left" as const, padding: "10px 12px", color: "#aaa", fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", borderBottom: "0.5px solid #eee" },
        td: { padding: "12px", borderBottom: "0.5px solid #f5f5f5", verticalAlign: "middle" as const },
        badge: { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 },
        filterBtn: { padding: "6px 14px", border: "0.5px solid #ddd", borderRadius: 20, fontSize: 12, cursor: "pointer", marginRight: 8, background: "#fff" },
        filterBtnActive: { background: "#1a1a1a", color: "#fff", border: "0.5px solid #1a1a1a" },
        toggleBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", marginRight: 6 },
        deleteBtn: { background: "none", border: "0.5px solid #ffcdd2", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#d32f2f" },
        avatar: { width: 32, height: 32, borderRadius: "50%", background: "#e8e5e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, color: "#666" },
        modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
        modalContent: { background: "#fff", padding: 24, borderRadius: 12, width: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
        inputGroup: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
        input: { padding: "10px 12px", border: "0.5px solid #ddd", borderRadius: 6, fontSize: 13, width: "100%", boxSizing: "border-box" },
        label: { fontSize: 12, fontWeight: 600, color: "#555" },
        btnPrimary: { background: "#1a1a1a", color: "#fff", border: "none", padding: "10px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, flex: 1 },
        btnSecondary: { background: "#f0f0f0", color: "#333", border: "none", padding: "10px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, flex: 1 }
    };

    // 3. Sửa lại hàm lấy màu Badge
    const getRoleBadge = (roles: any[]): React.CSSProperties => {
        if (hasRole(roles, "ADMIN") || hasRole(roles, "ROLE_ADMIN")) return { ...s.badge, background: "#FCEBEB", color: "#791F1F" };
        if (hasRole(roles, "STAFF") || hasRole(roles, "ROLE_STAFF")) return { ...s.badge, background: "#EEEDFE", color: "#3C3489" };
        return { ...s.badge, background: "#f0f0f0", color: "#666" };
    };

    // 4. Sửa lại hàm lấy Text Label
    const getRoleLabel = (roles: any[]) => {
        if (hasRole(roles, "ADMIN") || hasRole(roles, "ROLE_ADMIN")) return "ADMIN";
        if (hasRole(roles, "STAFF") || hasRole(roles, "ROLE_STAFF")) return "STAFF";
        return "USER";
    };

    return (
        <div>

            <div style={s.header}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 400 }}>Quản lý người dùng</h2>

                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <input
                        style={{ padding: "8px 14px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, width: 260 }}
                        placeholder="Tìm theo username hoặc email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {/* NÚT BẤM MỞ MODAL THÊM NHÂN VIÊN */}
                    <button
                        style={{ background: "#d32f2f", color: "#fff", border: "none", borderRadius: 8, padding: "0 16px", cursor: "pointer", fontSize: 13, fontWeight: 500 }}
                        onClick={() => setShowModal(true)}
                    >
                        + Thêm nhân viên
                    </button>
                </div>
            </div>


            {/* Filter role */}
            <div style={{ marginBottom: 20 }}>
                {[
                    { label: "Tất cả", value: "" },
                    { label: "Admin", value: "ADMIN" },
                    { label: "Staff", value: "STAFF" },
                    { label: "User", value: "USER" },
                ].map(item => (
                    <button
                        key={item.value}
                        style={{ ...s.filterBtn, ...(filterRole === item.value ? s.filterBtnActive : {}) }}
                        onClick={() => setFilterRole(item.value)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div style={s.card}>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
                    {filteredUsers.length} người dùng
                </div>

                {isLoading ? (
                    <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
                        <div className="spinner-border text-secondary mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '15px', fontWeight: 500 }}>
                            Đang tải danh sách người dùng...
                        </p>
                    </div>
                ) : (
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>NGƯỜI DÙNG</th>
                                <th style={s.th}>EMAIL</th>
                                <th style={s.th}>VAI TRÒ</th>
                                <th style={s.th}>TRẠNG THÁI</th>
                                <th style={s.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td style={s.td}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={s.avatar}>
                                                {user.username?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{user.username}</div>
                                                <div style={{ fontSize: 12, color: "#aaa" }}>
                                                    {user.firstName} {user.lastName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={s.td}>{user.email}</td>
                                    <td style={s.td}>
                                        <span style={getRoleBadge(user.roles)}>
                                            {getRoleLabel(user.roles)}
                                        </span>
                                    </td>
                                    <td style={s.td}>
                                        <span style={{
                                            ...s.badge,
                                            background: user.isEnabled ? "#EAF3DE" : "#f0f0f0",
                                            color: user.isEnabled ? "#27500A" : "#888"
                                        }}>
                                            {user.isEnabled ? "Hoạt động" : "Bị khóa"}
                                        </span>
                                    </td>
                                    <td style={s.td}>
                                        <button
                                            style={s.toggleBtn}
                                            onClick={() => handleToggleEnabled(user.id)}
                                        >
                                            {user.isEnabled ? "Khóa" : "Mở khóa"}
                                        </button>
                                        <button
                                            style={s.deleteBtn}
                                            onClick={() => handleDelete(user.id, user.username)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ========================================== */}
            {/* MODAL FORM THÊM NHÂN VIÊN */}
            {/* ========================================== */}
            {showModal && (
                <div style={s.modalOverlay}>
                    <div style={s.modalContent}>
                        <h3 style={{ margin: "0 0 20px 0", fontSize: 18, fontWeight: 500 }}>Thêm tài khoản mới</h3>
                        <form onSubmit={handleAddUser}>

                            <div style={{ display: "flex", gap: 12 }}>
                                <div style={{ ...s.inputGroup, flex: 1 }}>
                                    <label style={s.label}>Họ (Last Name)</label>
                                    <input style={s.input} required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                                <div style={{ ...s.inputGroup, flex: 1 }}>
                                    <label style={s.label}>Tên (First Name)</label>
                                    <input style={s.input} required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                </div>
                            </div>

                            <div style={s.inputGroup}>
                                <label style={s.label}>Tên đăng nhập (Username)</label>
                                <input style={s.input} required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                            </div>

                            <div style={s.inputGroup}>
                                <label style={s.label}>Email</label>
                                <input type="email" style={s.input} required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>

                            <div style={s.inputGroup}>
                                <label style={s.label}>Mật khẩu</label>
                                <input type="password" style={s.input} required minLength={6} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>

                            <div style={s.inputGroup}>
                                <label style={s.label}>Vai trò (Role)</label>
                                <select style={s.input} value={formData.roleName} onChange={e => setFormData({ ...formData, roleName: e.target.value })}>
                                    <option value="STAFF">Nhân viên (STAFF)</option>
                                    <option value="ADMIN">Quản trị viên (ADMIN)</option>
                                    <option value="USER">Khách hàng (USER)</option>
                                </select>
                            </div>

                            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                                <button type="button" style={s.btnSecondary} onClick={() => setShowModal(false)}>Hủy bỏ</button>
                                <button type="submit" style={s.btnPrimary}>Tạo tài khoản</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUser;