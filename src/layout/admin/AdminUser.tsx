import React, { useEffect, useState } from "react";

const API = "http://localhost:8089";
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ "Authorization": `Bearer ${getToken()}` });

const AdminUser: React.FC = () => {
    const [users, setUsers]         = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch]       = useState("");
    const [filterRole, setFilterRole] = useState("");

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/admin/users`, { headers: authHeader() });
            const data = await res.json();
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

    const filteredUsers = users.filter(u => {
        const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase()) ||
                           u.email?.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === "" || u.roles?.includes(filterRole);
        return matchSearch && matchRole;
    });

    const s: Record<string, React.CSSProperties> = {
        header:    { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
        card:      { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", padding: 24 },
        table:     { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
        th:        { textAlign: "left" as const, padding: "10px 12px", color: "#aaa", fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", borderBottom: "0.5px solid #eee" },
        td:        { padding: "12px", borderBottom: "0.5px solid #f5f5f5", verticalAlign: "middle" as const },
        badge:     { padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 },
        filterBtn: { padding: "6px 14px", border: "0.5px solid #ddd", borderRadius: 20, fontSize: 12, cursor: "pointer", marginRight: 8, background: "#fff" },
        filterBtnActive: { background: "#1a1a1a", color: "#fff", border: "0.5px solid #1a1a1a" },
        toggleBtn: { background: "none", border: "0.5px solid #ddd", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", marginRight: 6 },
        deleteBtn: { background: "none", border: "0.5px solid #ffcdd2", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#d32f2f" },
        avatar:    { width: 32, height: 32, borderRadius: "50%", background: "#e8e5e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, color: "#666" },
    };

    const getRoleBadge = (roles: string[]): React.CSSProperties => {
        if (roles?.includes("ROLE_ADMIN")) return { ...s.badge, background: "#FCEBEB", color: "#791F1F" };
        if (roles?.includes("ROLE_STAFF")) return { ...s.badge, background: "#EEEDFE", color: "#3C3489" };
        return { ...s.badge, background: "#f0f0f0", color: "#666" };
    };

    const getRoleLabel = (roles: string[]) => {
        if (roles?.includes("ROLE_ADMIN")) return "ADMIN";
        if (roles?.includes("ROLE_STAFF")) return "STAFF";
        return "USER";
    };

    return (
        <div>
            <div style={s.header}>
                <h2 style={{ fontSize: 22, fontWeight: 400 }}>Quản lý người dùng</h2>
                <input
                    style={{ padding: "8px 14px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, width: 260 }}
                    placeholder="Tìm theo username hoặc email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Filter role */}
            <div style={{ marginBottom: 20 }}>
                {[
                    { label: "Tất cả", value: "" },
                    { label: "Admin",  value: "ROLE_ADMIN" },
                    { label: "Staff",  value: "ROLE_STAFF" },
                    { label: "User",   value: "ROLE_USER" },
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
                    <p style={{ color: "#aaa", fontSize: 13 }}>Đang tải...</p>
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
        </div>
    );
};

export default AdminUser;