import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import FormatNumber from "../utils/FormatNumber";
import {
    getPaymentMethods,
    PaymentMethodModel, placeOrder
} from "../../api/CheckoutAPI";

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cartItemsRef = React.useRef<any[]>(null);

    if (cartItemsRef.current === null) {
        if (location.state?.cartItems?.length > 0) {
            cartItemsRef.current = location.state.cartItems;
        } else {
            const stored = sessionStorage.getItem("checkoutItems");
            if (stored) {
                cartItemsRef.current = JSON.parse(stored);
                sessionStorage.removeItem("checkoutItems");
            } else {
                cartItemsRef.current = [];
            }
        }
    }
    const cartItems: any[] = cartItemsRef.current ?? [];

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodModel[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [note, setNote] = useState("");

    const [voucherCode, setVoucherCode] = useState("");
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const [voucherMsg, setVoucherMsg] = useState("");
    const [voucherError, setVoucherError] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState("");
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [shippingAddress, setShippingAddress] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch("http://localhost:8089/api/addresses", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSavedAddresses(data);
                    const def = data.find((a: any) => a.isDefault);
                    if (def) {
                        setSelectedAddressId(def.id);
                        setFirstName(def.fullName?.split(" ")[0] ?? "");
                        setLastName(def.fullName?.split(" ").slice(1).join(" ") ?? "");
                        setPhoneNumber(def.phone ?? "");
                        setShippingAddress(`${def.addressLine}, ${def.ward}, ${def.district}, ${def.province}`);
                    }
                }
            })
            .catch((err) => { console.error("Error:", err); });
    }, []);

    const handleSelectAddress = (addr: any) => {
        setSelectedAddressId(addr.id);
        setFirstName(addr.fullName?.split(" ")[0] ?? "");
        setLastName(addr.fullName?.split(" ").slice(1).join(" ") ?? "");
        setPhoneNumber(addr.phone ?? "");
        setShippingAddress(`${addr.addressLine}, ${addr.ward}, ${addr.district}, ${addr.province}`);
    };

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;
        try {
            const res = await fetch(
                `http://localhost:8089/api/voucher/apply?code=${voucherCode}&orderAmount=${subtotal}`,
                { method: "POST" }
            );
            const text = await res.text();
            if (res.ok) {
                const data = JSON.parse(text);
                setVoucherDiscount(data.discountAmount);
                setAppliedVoucher(voucherCode.toUpperCase());
                setVoucherMsg(`Áp dụng thành công! Giảm ${FormatNumber(data.discountAmount)}đ`);
                setVoucherError(false);
            } else {
                setVoucherMsg(text);
                setVoucherError(true);
                setVoucherDiscount(0);
            }
        } catch {
            setVoucherMsg("Lỗi kết nối!"); setVoucherError(true);
        }
    };

    const getUserId = (): number => {
        const token = localStorage.getItem("token");
        if (!token) return 0;
        try {
            const decoded: any = jwtDecode(token);
            return decoded.userId ?? 0;
        } catch { return 0; }
    };

    useEffect(() => {
        getPaymentMethods().then(methods => {
            setPaymentMethods(methods);
            if (methods.length > 0) setSelectedPayment(methods[0].id);
        });
    }, []);

    const subtotal = cartItems.reduce(
        (sum: number, item: any) => sum + (item.product?.sellingPrice ?? 0) * item.quantity, 0
    );
    const total = subtotal - voucherDiscount;

    const handlePlaceOrder = async () => {
        if (!firstName || !lastName) {
            alert("Vui lòng nhập họ tên!"); return;
        }
        if (!phoneNumber || phoneNumber.length < 10) {
            alert("Vui lòng nhập số điện thoại hợp lệ!"); return;
        }
        if (!shippingAddress) {
            alert("Vui lòng nhập địa chỉ giao hàng!"); return;
        }
        if (cartItems.length === 0) {
            alert("Giỏ hàng trống!"); return;
        }

        setIsLoading(true);
        try {
            // MỚI THÊM: Tìm object phương thức thanh toán đang được chọn để check tên
            const selectedMethodObj = paymentMethods.find(m => m.id === selectedPayment);
            const methodName = selectedMethodObj?.name?.toLowerCase() || "";

            const orderResponse = await placeOrder({
                userId: getUserId(),
                fullName: `${firstName} ${lastName}`,
                phoneNumber,
                shippingAddress,
                billingAddress: shippingAddress,
                note,
                paymentMethodId: selectedPayment,
                shippingMethodId: 1,
                items: cartItems.map((item: any) => ({
                    productId: item.product?.id ?? 0,
                    quantity: item.quantity,
                    price: item.product?.sellingPrice ?? 0,
                }))
            });

            // MỚI THÊM: Phân luồng xử lý tùy theo phương thức thanh toán
            if (methodName.includes("cod") || methodName.includes("tiền mặt")) {
                // Nếu là COD -> Không gọi VNPAY, báo thành công và chuyển về trang Đơn hàng
                alert("Đặt hàng thành công! Vui lòng kiểm tra email xác nhận.");
                navigate("/my-orders");
            } else {
                // Nếu là VNPAY -> Gọi API lấy link và Redirect
                const token = localStorage.getItem("token");
                const res = await fetch(
                    `http://localhost:8089/vnpay/create-payment?orderId=${orderResponse.orderId}`,
                    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();

                if (data.paymentUrl) {
                    window.location.href = data.paymentUrl;
                } else {
                    alert("Có lỗi xảy ra khi tạo link thanh toán VNPAY.");
                }
            }

        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="border-bottom mb-4 pb-2">
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>THANH TOÁN</h1>
            </div>

            <div className="row">
                {/* CỘT TRÁI */}
                <div className="col-lg-7 col-md-12">
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>THÔNG TIN THANH TOÁN</h3>

                    {savedAddresses.length > 0 && (
                        <div style={{ marginBottom: 24, padding: 16, background: "#f8f7f4", borderRadius: 10, border: "0.5px solid #e8e5e0" }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#888", letterSpacing: "0.05em", marginBottom: 12 }}>
                                ĐỊA CHỈ ĐÃ LƯU
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {savedAddresses.map((addr: any) => (
                                    <div
                                        key={addr.id}
                                        onClick={() => handleSelectAddress(addr)}
                                        style={{
                                            padding: "12px 16px",
                                            borderRadius: 8,
                                            border: `1.5px solid ${selectedAddressId === addr.id ? "#1a1a1a" : "#e8e5e0"}`,
                                            background: selectedAddressId === addr.id ? "#f0ede8" : "#fff",
                                            cursor: "pointer",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div>
                                                <span style={{ fontSize: 13, fontWeight: 500 }}>{addr.fullName}</span>
                                                <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>{addr.phone}</span>
                                                {addr.isDefault && (
                                                    <span style={{ marginLeft: 8, background: "#EAF3DE", color: "#27500A", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 500 }}>
                                                        Mặc định
                                                    </span>
                                                )}
                                            </div>
                                            <span style={{ fontSize: 12 }}>
                                                {addr.addressType === "HOME" ? "🏠" : "🏢"}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                                            {addr.addressLine}, {addr.ward}, {addr.district}, {addr.province}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 10, fontSize: 12, color: "#888" }}>
                                Hoặc{" "}
                                <span
                                    style={{ color: "#1a1a1a", cursor: "pointer", textDecoration: "underline" }}
                                    onClick={() => {
                                        setSelectedAddressId(null);
                                        setFirstName(""); setLastName("");
                                        setPhoneNumber(""); setShippingAddress("");
                                    }}
                                >
                                    nhập địa chỉ mới
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Họ *</label>
                            <input type="text" className="form-control"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Tên *</label>
                            <input type="text" className="form-control"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Địa chỉ *</label>
                        <input type="text" className="form-control"
                            value={shippingAddress}
                            onChange={e => setShippingAddress(e.target.value)}
                            required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Số điện thoại *</label>
                        <input type="text" className="form-control"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                            required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email *</label>
                        <input type="email" className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ghi chú (tùy chọn)</label>
                        <textarea className="form-control" rows={3}
                            value={note}
                            onChange={e => setNote(e.target.value)} />
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="col-lg-5 col-md-12">
                    <div className="p-4" style={{ border: '2px solid #ddd', borderRadius: '4px', backgroundColor: '#fff' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>ĐƠN HÀNG CỦA BẠN</h3>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ fontSize: '14px' }}>SẢN PHẨM</th>
                                    <th className="text-end" style={{ fontSize: '14px' }}>TẠM TÍNH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item: any) => (
                                    <tr key={item.id}>
                                        <td style={{ fontSize: '14px', color: '#666' }}>
                                            {item.product?.name} <strong style={{ color: '#000' }}>× {item.quantity}</strong>
                                        </td>
                                        <td className="text-end fw-bold">
                                            {FormatNumber((item.product?.sellingPrice ?? 0) * item.quantity)}đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th style={{ fontSize: '15px' }}>Tạm tính</th>
                                    <td className="text-end fw-bold">{FormatNumber(subtotal)}đ</td>
                                </tr>
                                <tr>
                                    <td colSpan={2} style={{ padding: "8px 0" }}>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <input
                                                style={{ flex: 1, padding: "8px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13 }}
                                                placeholder="Nhập mã giảm giá"
                                                value={voucherCode}
                                                onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                                                disabled={!!appliedVoucher}
                                            />
                                            {appliedVoucher ? (
                                                <button
                                                    style={{ padding: "8px 14px", background: "none", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 12, cursor: "pointer", color: "#d32f2f" }}
                                                    onClick={() => { setAppliedVoucher(""); setVoucherCode(""); setVoucherDiscount(0); setVoucherMsg(""); }}
                                                >Hủy</button>
                                            ) : (
                                                <button
                                                    style={{ padding: "8px 14px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}
                                                    onClick={handleApplyVoucher}
                                                >Áp dụng</button>
                                            )}
                                        </div>
                                        {voucherMsg && (
                                            <div style={{ fontSize: 12, marginTop: 6, color: voucherError ? "#d32f2f" : "#27500A" }}>
                                                {voucherMsg}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                                {voucherDiscount > 0 && (
                                    <tr>
                                        <th style={{ fontSize: 13, color: "#27500A" }}>Giảm giá ({appliedVoucher})</th>
                                        <td style={{ textAlign: "right", color: "#27500A", fontWeight: 500 }}>
                                            -{FormatNumber(voucherDiscount)}đ
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <th style={{ fontSize: '18px' }}>TỔNG</th>
                                    <td className="text-end fw-bold" style={{ color: '#d0021b', fontSize: '20px' }}>
                                        {FormatNumber(total)}đ
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        <div className="mt-4 p-3" style={{ backgroundColor: '#f9f9f9', border: '1px solid #eee' }}>
                            {paymentMethods.map((method) => (
                                <div key={method.id} className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentMethod"
                                        id={`payment-${method.id}`}
                                        checked={selectedPayment === method.id}
                                        onChange={() => setSelectedPayment(method.id)}
                                    />
                                    <label className="form-check-label fw-bold" htmlFor={`payment-${method.id}`} style={{ cursor: 'pointer' }}>
                                        {method.name}
                                    </label>
                                    {selectedPayment === method.id && (
                                        <div className="mt-2 p-2 bg-white small border rounded">
                                            {method.description || "Thanh toán an toàn qua cổng thanh toán này."}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            className="btn btn-dark w-100 mt-4 py-3 fw-bold"
                            style={{ backgroundColor: '#000', borderRadius: '0', fontSize: '16px' }}
                            disabled={isLoading}
                            onClick={handlePlaceOrder}
                        >
                            {isLoading ? (
                                <>
                                    {/* Vòng xoay sẽ tự động lấy màu trắng đồng bộ với chữ nhờ class btn-dark */}
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ĐANG XỬ LÝ...
                                </>
                            ) : (
                                "ĐẶT HÀNG"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;