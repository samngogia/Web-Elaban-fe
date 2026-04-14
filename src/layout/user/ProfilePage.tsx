import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API = "http://localhost:8089";

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const fileRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"info" | "password">("info");
    const [msg, setMsg] = useState("");
    const [isError, setIsError] = useState(false);

    // Password fields
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const getUserId = (): number => {
        const token = localStorage.getItem("token");
        if (!token) return 0;
        const decoded: any = jwtDecode(token);
        return decoded.userId ?? 0;
    };

    useEffect(() => {
        const userId = getUserId();
        if (!userId) { navigate("/login"); return; }

        fetch(`${API}/api/profile/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(r => r.json())
            .then(data => { setProfile(data); setIsLoading(false); })
            .catch(() => setIsLoading(false));
    }, []);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`${API}/api/profile/${getUserId()}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(profile)
            });
            const text = await res.text();
            setMsg(text);
            setIsError(!res.ok);
        } catch {
            setMsg("Lỗi kết nối!");
            setIsError(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMsg("Mật khẩu xác nhận không khớp!");
            setIsError(true);
            return;
        }
        if (newPassword.length < 6) {
            setMsg("Mật khẩu mới phải có ít nhất 6 ký tự!");
            setIsError(true);
            return;
        }
        setIsSaving(true);
        try {
            const res = await fetch(`${API}/api/profile/${getUserId()}/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            const text = await res.text();
            setMsg(text);
            setIsError(!res.ok);
            if (res.ok) {
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch {
            setMsg("Lỗi kết nối!");
            setIsError(true);
        } finally {
            setIsSaving(false);
        }
    };

    // Upload avatar — convert sang base64
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setProfile({ ...profile, avatar: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const s: Record<string, React.CSSProperties> = {
        page:       { minHeight: "100vh", background: "#f8f7f4", padding: "40px 0", fontFamily: "sans-serif" },
        container:  { maxWidth: 700, margin: "0 auto", padding: "0 20px" },
        heading:    { fontSize: 24, fontWeight: 400, marginBottom: 24, color: "#1a1a1a" },
        card:       { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e5e0", padding: 32 },
        avatarWrap: { display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: "0.5px solid #f0ede8" },
        avatar:     { width: 80, height: 80, borderRadius: "50%", objectFit: "cover" as const, background: "#e8e5e0" },
        avatarPlaceholder: { width: 80, height: 80, borderRadius: "50%", background: "#e8e5e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#aaa", cursor: "pointer" },
        uploadBtn:  { background: "none", border: "0.5px solid #ddd", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer" },
        tabs:       { display: "flex", gap: 0, marginBottom: 28, borderBottom: "0.5px solid #e8e5e0" },
        tab:        { padding: "10px 20px", fontSize: 13, cursor: "pointer", background: "none", border: "none", color: "#888", borderBottom: "2px solid transparent" },
        tabActive:  { color: "#1a1a1a", borderBottom: "2px solid #1a1a1a", fontWeight: 500 },
        grid:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" },
        label:      { display: "block", fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 600, letterSpacing: "0.05em" },
        input:      { width: "100%", padding: "10px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: "border-box" as const },
        select:     { width: "100%", padding: "10px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, marginBottom: 16 },
        saveBtn:    { background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 13, cursor: "pointer" },
        msg:        { fontSize: 13, padding: "10px 14px", borderRadius: 8, marginTop: 16 },
    };

    if (isLoading) return (
        <div style={s.page}>
            <div style={s.container}>
                <p style={{ color: "#aaa" }}>Đang tải...</p>
            </div>
        </div>
    );

    return (
        <div style={s.page}>
            <div style={s.container}>
                <h2 style={s.heading}>Thông tin cá nhân</h2>

                <div style={s.card}>
                    {/* Avatar */}
                    <div style={s.avatarWrap}>
                        {profile?.avatar ? (
                            <img src={profile.avatar} alt="avatar" style={s.avatar} />
                        ) : (
                            <div style={s.avatarPlaceholder}
                                onClick={() => fileRef.current?.click()}>
                                👤
                            </div>
                        )}
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
                                {profile?.firstName} {profile?.lastName}
                            </div>
                            <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>
                                @{profile?.username}
                            </div>
                            <button style={s.uploadBtn}
                                onClick={() => fileRef.current?.click()}>
                                Đổi ảnh đại diện
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={s.tabs}>
                        <button
                            style={{ ...s.tab, ...(activeTab === "info" ? s.tabActive : {}) }}
                            onClick={() => { setActiveTab("info"); setMsg(""); }}
                        >
                            Thông tin cá nhân
                        </button>
                        <button
                            style={{ ...s.tab, ...(activeTab === "password" ? s.tabActive : {}) }}
                            onClick={() => { setActiveTab("password"); setMsg(""); }}
                        >
                            Đổi mật khẩu
                        </button>
                    </div>

                    {/* Tab: Thông tin */}
                    {activeTab === "info" && profile && (
                        <div>
                            <div style={s.grid}>
                                <div>
                                    <label style={s.label}>HỌ</label>
                                    <input style={s.input} type="text"
                                        value={profile.firstName ?? ""}
                                        onChange={e => setProfile({ ...profile, firstName: e.target.value })} />
                                </div>
                                <div>
                                    <label style={s.label}>TÊN</label>
                                    <input style={s.input} type="text"
                                        value={profile.lastName ?? ""}
                                        onChange={e => setProfile({ ...profile, lastName: e.target.value })} />
                                </div>
                            </div>

                            <label style={s.label}>EMAIL</label>
                            <input style={s.input} type="email"
                                value={profile.email ?? ""}
                                onChange={e => setProfile({ ...profile, email: e.target.value })} />

                            <label style={s.label}>GIỚI TÍNH</label>
                            <select style={s.select}
                                value={profile.gender ?? ""}
                                onChange={e => setProfile({ ...profile, gender: e.target.value })}>
                                <option value="">-- Chọn giới tính --</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>

                            <label style={s.label}>ĐỊA CHỈ GIAO HÀNG</label>
                            <input style={s.input} type="text"
                                value={profile.shippingAddress ?? ""}
                                onChange={e => setProfile({ ...profile, shippingAddress: e.target.value })} />

                            <label style={s.label}>ĐỊA CHỈ THANH TOÁN</label>
                            <input style={s.input} type="text"
                                value={profile.billingAddress ?? ""}
                                onChange={e => setProfile({ ...profile, billingAddress: e.target.value })} />

                            <button style={s.saveBtn} disabled={isSaving} onClick={handleSaveProfile}>
                                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    )}

                    {/* Tab: Đổi mật khẩu */}
                    {activeTab === "password" && (
                        <div>
                            <label style={s.label}>MẬT KHẨU CŨ</label>
                            <input style={s.input} type="password"
                                placeholder="Nhập mật khẩu hiện tại"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)} />

                            <label style={s.label}>MẬT KHẨU MỚI</label>
                            <input style={s.input} type="password"
                                placeholder="Ít nhất 6 ký tự"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)} />

                            <label style={s.label}>XÁC NHẬN MẬT KHẨU MỚI</label>
                            <input style={s.input} type="password"
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)} />

                            <button style={s.saveBtn} disabled={isSaving} onClick={handleChangePassword}>
                                {isSaving ? "Đang xử lý..." : "Đổi mật khẩu"}
                            </button>
                        </div>
                    )}

                    {/* Message */}
                    {msg && (
                        <div style={{
                            ...s.msg,
                            background: isError ? "#FCEBEB" : "#EAF3DE",
                            color: isError ? "#791F1F" : "#27500A"
                        }}>
                            {msg}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;