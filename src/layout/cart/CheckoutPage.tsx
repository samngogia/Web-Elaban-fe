import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import FormatNumber from "../utils/FormatNumber";
import {
    getPaymentMethods,
    PaymentMethodModel, placeOrder
} from "../../api/CheckoutAPI";
import { CartItemModel } from "../../models/CartModel";


const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cartItemsRef = React.useRef<any[]>(null);

    if (cartItemsRef.current === null) {
        // Chỉ đọc 1 lần duy nhất
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
    // Dùng cartItemsRef.current thay vì cartItems từ getCartItems()
    const cartItems: any[] = cartItemsRef.current ?? [];

    // chỉ chạy 1 lần sau khi mount
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodModel[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [note, setNote] = useState("");





    // Lấy thông tin người dùng (giả định)
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
    const total = subtotal;

    // Thêm state shippingAddress
    const [shippingAddress, setShippingAddress] = useState("");
    // const handlePlaceOrder = async () => {
    //     setIsLoading(true);
    //     try {
    //         // 1. Tạo order trước
    //         const orderResponse = await placeOrder({
    //             userId: getUserId(),
    //             shippingAddress,
    //             billingAddress: shippingAddress,
    //             paymentMethodId: selectedPayment,
    //             shippingMethodId: 1,
    //             items: cartItems.map((item: any) => ({
    //                 productId: item.product?.id ?? 0,
    //                 quantity: item.quantity,
    //                 price: item.product?.sellingPrice ?? 0,
    //             }))
    //         });

    //         // 2. Nếu chọn VNPay thì redirect
    //         const token = localStorage.getItem("token");
    //         const res = await fetch(
    //             `http://localhost:8089/vnpay/create-payment?orderId=${orderResponse.orderId}`,
    //             {
    //                 method: "POST",
    //                 headers: { Authorization: `Bearer ${token}` }
    //             }
    //         );
    //         const data = await res.json();
    //         window.location.href = data.paymentUrl; // redirect sang VNPay

    //     } catch (err: any) {
    //         alert(err.message);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };



    const handlePlaceOrder = async () => {
        // Validate
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

            // Redirect sang VNPay
            const token = localStorage.getItem("token");
            const res = await fetch(
                `http://localhost:8089/vnpay/create-payment?orderId=${orderResponse.orderId}`,
                { method: "POST", headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            window.location.href = data.paymentUrl;

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

        {/* Bắt đầu hàng chính để chia 2 cột */}
        <div className="row">
            
            {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG (7 phần) */}
            <div className="col-lg-7 col-md-12">
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>THÔNG TIN THANH TOÁN</h3>
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

            {/* CỘT PHẢI: ĐƠN HÀNG & THANH TOÁN (5 phần) */}
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
                                <th style={{ fontSize: '18px' }}>TỔNG</th>
                                <td className="text-end fw-bold" style={{ color: '#d0021b', fontSize: '20px' }}>
                                    {FormatNumber(total)}đ
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* PHƯƠNG THỨC THANH TOÁN */}
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
                        {isLoading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
                    </button>
                </div>
            </div>

        </div> {/* Kết thúc row chính */}
    </div>
);
};

export default CheckoutPage;