import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep]             = useState<1 | 2>(1);
    const [email, setEmail]           = useState("");
    const [otp, setOtp]               = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage]       = useState("");
    const [isError, setIsError]       = useState(false);
    const [isLoading, setIsLoading]   = useState(false);

    const handleSendOtp = async () => {
        if (!email) return;
        setIsLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8089/account/forgot-password?email=${encodeURIComponent(email)}`,
                { method: "POST" }
            );
            const text = await res.text();
            if (res.ok) {
                setMessage(text);
                setIsError(false);
                setStep(2);
            } else {
                setMessage(text);
                setIsError(true);
            }
        } catch {
            setMessage("Lỗi kết nối!");
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu xác nhận không khớp!");
            setIsError(true);
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8089/account/reset-password?email=${encodeURIComponent(email)}&otp=${otp}&newPassword=${encodeURIComponent(newPassword)}`,
                { method: "POST" }
            );
            const text = await res.text();
            if (res.ok) {
                setMessage(text);
                setIsError(false);
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage(text);
                setIsError(true);
            }
        } catch {
            setMessage("Lỗi kết nối!");
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const s: Record<string, React.CSSProperties> = {
        page: { minHeight: "100vh", background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif" },
        card: { background: "#fff", borderRadius: 16, padding: "48px 40px", width: "100%", maxWidth: 420, border: "0.5px solid #e8e5e0" },
        heading: { fontSize: 24, fontWeight: 400, color: "#1a1a1a", marginBottom: 8 },
        sub: { fontSize: 13, color: "#aaa", marginBottom: 32, lineHeight: 1.6 },
        label: { display: "block", fontSize: 12, color: "#888", marginBottom: 6, letterSpacing: "0.05em" },
        input: { width: "100%", padding: "12px 14px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 14, color: "#1a1a1a", outline: "none", marginBottom: 16, boxSizing: "border-box" as const },
        btn: { width: "100%", padding: "13px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, cursor: "pointer", marginTop: 4 },
        btnDisabled: { background: "#ccc", cursor: "not-allowed" },
        msg: { fontSize: 13, padding: "10px 14px", borderRadius: 8, marginTop: 16, textAlign: "center" as const },
        msgOk: { background: "#EAF3DE", color: "#27500A" },
        msgErr: { background: "#FCEBEB", color: "#791F1F" },
        backLink: { display: "block", textAlign: "center" as const, marginTop: 20, fontSize: 13, color: "#aaa", cursor: "pointer" },
        otpHint: { fontSize: 12, color: "#aaa", textAlign: "center" as const, marginBottom: 16 },
        stepBar: { display: "flex", gap: 6, marginBottom: 28 },
        stepDot: { height: 3, flex: 1, borderRadius: 2, background: "#e8e5e0" },
        stepDotActive: { background: "#1a1a1a" },
    };

    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={s.stepBar}>
                    <div style={{ ...s.stepDot, ...s.stepDotActive }} />
                    <div style={{ ...s.stepDot, ...(step === 2 ? s.stepDotActive : {}) }} />
                </div>

                {step === 1 ? (
                    <>
                        <h2 style={s.heading}>Quên mật khẩu</h2>
                        <p style={s.sub}>Nhập email của bạn, chúng tôi sẽ gửi mã OTP 6 số để đặt lại mật khẩu.</p>

                        <label style={s.label}>EMAIL</label>
                        <input
                            style={s.input}
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                        />

                        <button
                            style={{ ...s.btn, ...(isLoading ? s.btnDisabled : {}) }}
                            disabled={isLoading || !email}
                            onClick={handleSendOtp}
                        >
                            {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
                        </button>
                    </>
                ) : (
                    <>
                        <h2 style={s.heading}>Đặt lại mật khẩu</h2>
                        <p style={s.otpHint}>Mã OTP đã gửi đến <b>{email}</b></p>

                        <label style={s.label}>MÃ OTP</label>
                        <input
                            style={{ ...s.input, letterSpacing: "0.3em", fontSize: 20, textAlign: "center" }}
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                        />

                        <label style={s.label}>MẬT KHẨU MỚI</label>
                        <input
                            style={s.input}
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />

                        <label style={s.label}>XÁC NHẬN MẬT KHẨU</label>
                        <input
                            style={s.input}
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />

                        <button
                            style={{ ...s.btn, ...(isLoading ? s.btnDisabled : {}) }}
                            disabled={isLoading || !otp || !newPassword || !confirmPassword}
                            onClick={handleResetPassword}
                        >
                            {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </button>

                        <span style={s.backLink} onClick={() => setStep(1)}>
                            ← Gửi lại mã OTP
                        </span>
                    </>
                )}

                {message && (
                    <div style={{ ...s.msg, ...(isError ? s.msgErr : s.msgOk) }}>
                        {message}
                    </div>
                )}

                <span style={s.backLink} onClick={() => navigate("/login")}>
                    Quay lại đăng nhập
                </span>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;