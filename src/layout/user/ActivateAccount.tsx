import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ActivateAccount: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = new URLSearchParams(location.search).get("email") ?? "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [msg, setMsg] = useState("");
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resendMsg, setResendMsg] = useState("");
    const [countdown, setCountdown] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown resend
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Chỉ nhận số
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Chỉ lấy 1 ký tự
        setOtp(newOtp);
        // Auto focus ô tiếp theo
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        text.split("").forEach((char, i) => { newOtp[i] = char; });
        setOtp(newOtp);
        inputRefs.current[Math.min(text.length, 5)]?.focus();
    };

    const handleSubmit = async () => {
        const code = otp.join("");
        if (code.length < 6) {
            setMsg("Vui lòng nhập đủ 6 số!"); setIsError(true); return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8089/account/activate?email=${encodeURIComponent(email)}&otp=${code}`,
                { method: "POST" }
            );
            const text = await res.text();
            if (res.ok) {
                setIsSuccess(true);
                setMsg(text);
                setIsError(false);
                setTimeout(() => navigate("/login"), 2500);
            } else {
                setMsg(text); setIsError(true);
            }
        } catch {
            setMsg("Lỗi kết nối!"); setIsError(true);
        } finally { setIsLoading(false); }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        try {
            const res = await fetch(
                `http://localhost:8089/account/resend-otp?email=${encodeURIComponent(email)}`,
                { method: "POST" }
            );
            const text = await res.text();
            setResendMsg(text);
            setCountdown(60);
        } catch {
            setResendMsg("Lỗi kết nối!");
        }
    };

    const s: Record<string, React.CSSProperties> = {
        page: { minHeight: "100vh", background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" },
        card: { background: "#fff", borderRadius: 16, padding: "48px 40px", maxWidth: 440, width: "100%", border: "0.5px solid #e8e5e0", textAlign: "center" },
        icon: { fontSize: 48, marginBottom: 16 },
        title: { fontSize: 22, fontWeight: 500, color: "#1a1a1a", marginBottom: 8 },
        sub: { fontSize: 13, color: "#888", marginBottom: 8 },
        email: { fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 32 },
        otpRow: { display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 },
        otpInput: { width: 48, height: 56, textAlign: "center" as const, fontSize: 22, fontWeight: 600, border: "0.5px solid #ddd", borderRadius: 10, outline: "none", fontFamily: "monospace" },
        otpFocus: { border: "1.5px solid #1a1a1a" },
        btn: { width: "100%", padding: "12px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, cursor: "pointer", marginBottom: 16 },
        msg: { fontSize: 13, padding: "10px 14px", borderRadius: 8, marginBottom: 16 },
        resend: { fontSize: 12, color: "#888" },
        resendLink: { color: "#1a1a1a", cursor: "pointer", fontWeight: 500, textDecoration: "underline" },
    };

    if (!email) return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={s.icon}>⚠️</div>
                <div style={s.title}>Thiếu thông tin</div>
                <p style={s.sub}>Không tìm thấy email. Vui lòng đăng ký lại.</p>
            </div>
        </div>
    );

    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={s.icon}>{isSuccess ? "✅" : "📧"}</div>
                <div style={s.title}>
                    {isSuccess ? "Kích hoạt thành công!" : "Xác thực email"}
                </div>
                <p style={s.sub}>
                    {isSuccess
                        ? "Tài khoản đã được kích hoạt. Đang chuyển hướng..."
                        : "Nhập mã OTP 6 số đã gửi đến"}
                </p>
                {!isSuccess && <div style={s.email}>{email}</div>}

                {!isSuccess && (
                    <>
                        {/* OTP Input */}
                        <div style={s.otpRow} onPaste={handlePaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => { inputRefs.current[i] = el; }}
                                    style={{
                                        ...s.otpInput,
                                        borderColor: digit ? "#1a1a1a" : "#ddd",
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                />
                            ))}
                        </div>

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

                        {/* Submit */}
                        <button style={s.btn} onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Đang xác thực...
                                </>
                            ) : (
                                "Xác thực"
                            )}
                        </button>

                        {/* Resend */}
                        <div style={s.resend}>
                            Không nhận được mã?{" "}
                            {countdown > 0 ? (
                                <span style={{ color: "#aaa" }}>Gửi lại sau {countdown}s</span>
                            ) : (
                                <span style={s.resendLink} onClick={handleResend}>
                                    Gửi lại OTP
                                </span>
                            )}
                        </div>
                        {resendMsg && (
                            <div style={{ fontSize: 12, color: "#27500A", marginTop: 8 }}>
                                {resendMsg}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ActivateAccount;