// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import FormatNumber from "../utils/FormatNumber";
// import {
//     getPaymentMethods,
//     getShippingMethods,
//     placeOrder,
//     PaymentMethodModel,
//     ShippingMethodModel,
//     CheckoutItem,
// } from "../../api/CheckoutAPI";
// import { CartItemModel } from "../../models/CartModel";

// const CheckoutPage: React.FC = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const cartItems: CartItemModel[] = location.state?.cartItems ?? [];

//     const getUserId = (): number => {
//         const token = localStorage.getItem("token");
//         if (!token) return 0;
//         const decoded: any = jwtDecode(token);
//         return decoded.userId ?? 0;
//     };

//     const [shippingAddress, setShippingAddress] = useState("");
//     const [billingAddress, setBillingAddress] = useState("");
//     const [sameAddress, setSameAddress] = useState(true);
//     const [paymentMethods, setPaymentMethods] = useState<PaymentMethodModel[]>([]);
//     const [shippingMethods, setShippingMethods] = useState<ShippingMethodModel[]>([]);
//     const [selectedPayment, setSelectedPayment] = useState<number>(0);
//     const [selectedShipping, setSelectedShipping] = useState<number>(0);
//     const [isLoading, setIsLoading] = useState(false);
//     const [step, setStep] = useState(1); // 1: address, 2: payment/shipping, 3: confirm

//     useEffect(() => {
//         getPaymentMethods().then(setPaymentMethods);
//         getShippingMethods().then(setShippingMethods);
//     }, []);

//     const selectedShippingMethod = shippingMethods.find(s => s.id === selectedShipping);
//     const selectedPaymentMethod = paymentMethods.find(p => p.id === selectedPayment);

//     const subtotal = cartItems.reduce(
//         (sum, item) => sum + (item.product?.sellingPrice ?? 0) * item.quantity, 0
//     );
//     const shippingFee = selectedShippingMethod?.shippingFee ?? 0;
//     const paymentFee = selectedPaymentMethod?.paymentFee ?? 0;
//     const total = subtotal + shippingFee + paymentFee;

//     const handlePlaceOrder = async () => {
//         setIsLoading(true);
//         try {
//             const items: CheckoutItem[] = cartItems.map(item => ({
//                 productId: item.product?.id ?? 0,
//                 quantity: item.quantity,
//                 price: item.product?.sellingPrice ?? 0,
//             }));

//             const response = await placeOrder({
//                 userId: getUserId(),
//                 shippingAddress,
//                 billingAddress: sameAddress ? shippingAddress : billingAddress,
//                 paymentMethodId: selectedPayment,
//                 shippingMethodId: selectedShipping,
//                 items,
//             });

//             navigate("/order-success", { state: { order: response } });
//         } catch (err: any) {
//             alert(err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const styles: Record<string, React.CSSProperties> = {
//         page: {
//             minHeight: "100vh",
//             background: "#f8f7f4",
//             fontFamily: "'Georgia', serif",
//             padding: "40px 0",
//         },
//         container: {
//             maxWidth: 1100,
//             margin: "0 auto",
//             padding: "0 20px",
//             display: "grid",
//             gridTemplateColumns: "1fr 380px",
//             gap: 32,
//         },
//         heading: {
//             fontSize: 28,
//             fontWeight: 400,
//             color: "#1a1a1a",
//             marginBottom: 8,
//             letterSpacing: "-0.5px",
//         },
//         subheading: {
//             fontSize: 13,
//             color: "#888",
//             marginBottom: 32,
//         },
//         card: {
//             background: "#fff",
//             borderRadius: 12,
//             padding: "28px 32px",
//             marginBottom: 20,
//             border: "0.5px solid #e8e5e0",
//         },
//         sectionTitle: {
//             fontSize: 13,
//             fontWeight: 600,
//             letterSpacing: "0.08em",
//             textTransform: "uppercase" as const,
//             color: "#888",
//             marginBottom: 20,
//         },
//         label: {
//             display: "block",
//             fontSize: 13,
//             color: "#555",
//             marginBottom: 6,
//         },
//         input: {
//             width: "100%",
//             padding: "10px 14px",
//             border: "0.5px solid #ddd",
//             borderRadius: 8,
//             fontSize: 14,
//             color: "#1a1a1a",
//             background: "#fff",
//             outline: "none",
//             marginBottom: 16,
//             boxSizing: "border-box" as const,
//         },
//         methodCard: {
//             border: "0.5px solid #ddd",
//             borderRadius: 10,
//             padding: "14px 18px",
//             marginBottom: 10,
//             cursor: "pointer",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             transition: "all 0.15s",
//         },
//         methodCardSelected: {
//             border: "1.5px solid #1a1a1a",
//             background: "#fafaf8",
//         },
//         methodName: {
//             fontSize: 14,
//             fontWeight: 500,
//             color: "#1a1a1a",
//         },
//         methodDesc: {
//             fontSize: 12,
//             color: "#999",
//             marginTop: 2,
//         },
//         methodFee: {
//             fontSize: 13,
//             fontWeight: 500,
//             color: "#1a1a1a",
//         },
//         summaryCard: {
//             background: "#fff",
//             borderRadius: 12,
//             padding: "28px 32px",
//             border: "0.5px solid #e8e5e0",
//             position: "sticky" as const,
//             top: 20,
//         },
//         summaryItem: {
//             display: "flex",
//             justifyContent: "space-between",
//             fontSize: 13,
//             color: "#555",
//             marginBottom: 10,
//         },
//         summaryTotal: {
//             display: "flex",
//             justifyContent: "space-between",
//             fontSize: 16,
//             fontWeight: 600,
//             color: "#1a1a1a",
//             borderTop: "0.5px solid #eee",
//             paddingTop: 14,
//             marginTop: 14,
//         },
//         btn: {
//             width: "100%",
//             padding: "14px",
//             background: "#1a1a1a",
//             color: "#fff",
//             border: "none",
//             borderRadius: 10,
//             fontSize: 14,
//             fontWeight: 500,
//             cursor: "pointer",
//             marginTop: 20,
//             letterSpacing: "0.03em",
//         },
//         btnDisabled: {
//             background: "#ccc",
//             cursor: "not-allowed",
//         },
//         productRow: {
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "10px 0",
//             borderBottom: "0.5px solid #f0ede8",
//             fontSize: 13,
//         },
//         productName: {
//             color: "#333",
//             flex: 1,
//         },
//         productQty: {
//             color: "#999",
//             margin: "0 16px",
//         },
//         productPrice: {
//             color: "#1a1a1a",
//             fontWeight: 500,
//         },
//         stepIndicator: {
//             display: "flex",
//             gap: 8,
//             marginBottom: 28,
//         },
//         step: {
//             height: 3,
//             flex: 1,
//             borderRadius: 2,
//             background: "#e8e5e0",
//         },
//         stepActive: {
//             background: "#1a1a1a",
//         },
//         checkboxRow: {
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             fontSize: 13,
//             color: "#555",
//             marginBottom: 16,
//             cursor: "pointer",
//         },
//     };

//     const isStep1Valid = shippingAddress.trim().length > 5;
//     const isStep2Valid = selectedPayment > 0 && selectedShipping > 0;

//     return (
//         <div style={styles.page}>
//             <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", marginBottom: 32 }}>
//                 <h1 style={styles.heading}>Checkout</h1>
//                 <p style={styles.subheading}>Complete your order in a few simple steps</p>

//                 {/* Step indicator */}
//                 <div style={styles.stepIndicator}>
//                     {[1, 2, 3].map(s => (
//                         <div key={s} style={{
//                             ...styles.step,
//                             ...(step >= s ? styles.stepActive : {})
//                         }} />
//                     ))}
//                 </div>
//             </div>

//             <div style={styles.container}>
//                 {/* Left column */}
//                 <div>
//                     {/* Step 1: Address */}
//                     <div style={styles.card}>
//                         <div style={styles.sectionTitle}>01 — Delivery address</div>

//                         <label style={styles.label}>Shipping address</label>
//                         <input
//                             style={styles.input}
//                             placeholder="Enter your full shipping address"
//                             value={shippingAddress}
//                             onChange={e => setShippingAddress(e.target.value)}
//                         />

//                         <label style={{ ...styles.checkboxRow } as React.CSSProperties}
//                             onClick={() => setSameAddress(!sameAddress)}>
//                             <input
//                                 type="checkbox"
//                                 checked={sameAddress}
//                                 onChange={() => setSameAddress(!sameAddress)}
//                             />
//                             Billing address same as shipping
//                         </label>

//                         {!sameAddress && (
//                             <>
//                                 <label style={styles.label}>Billing address</label>
//                                 <input
//                                     style={styles.input}
//                                     placeholder="Enter your billing address"
//                                     value={billingAddress}
//                                     onChange={e => setBillingAddress(e.target.value)}
//                                 />
//                             </>
//                         )}
//                     </div>

//                     {/* Step 2: Shipping method */}
//                     <div style={styles.card}>
//                         <div style={styles.sectionTitle}>02 — Shipping method</div>
//                         {shippingMethods.map(method => (
//                             <div
//                                 key={method.id}
//                                 style={{
//                                     ...styles.methodCard,
//                                     ...(selectedShipping === method.id ? styles.methodCardSelected : {})
//                                 }}
//                                 onClick={() => { setSelectedShipping(method.id); setStep(Math.max(step, 2)); }}
//                             >
//                                 <div>
//                                     <div style={styles.methodName}>{method.name}</div>
//                                     <div style={styles.methodDesc}>{method.description}</div>
//                                 </div>
//                                 <div style={styles.methodFee}>
//                                     {method.shippingFee === 0 ? "Free" : `${FormatNumber(method.shippingFee)}đ`}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Step 3: Payment method */}
//                     <div style={styles.card}>
//                         <div style={styles.sectionTitle}>03 — Payment method</div>
//                         {paymentMethods.map(method => (
//                             <div
//                                 key={method.id}
//                                 style={{
//                                     ...styles.methodCard,
//                                     ...(selectedPayment === method.id ? styles.methodCardSelected : {})
//                                 }}
//                                 onClick={() => { setSelectedPayment(method.id); setStep(3); }}
//                             >
//                                 <div>
//                                     <div style={styles.methodName}>{method.name}</div>
//                                     <div style={styles.methodDesc}>{method.description}</div>
//                                 </div>
//                                 <div style={styles.methodFee}>
//                                     {method.paymentFee === 0 ? "No fee" : `+${FormatNumber(method.paymentFee)}đ`}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Right column — Order summary */}
//                 <div>
//                     <div style={styles.summaryCard}>
//                         <div style={styles.sectionTitle}>Order summary</div>

//                         {/* Product list */}
//                         <div style={{ marginBottom: 16 }}>
//                             {cartItems.map(item => (
//                                 <div key={item.id} style={styles.productRow}>
//                                     <span style={styles.productName}>{item.product?.name}</span>
//                                     <span style={styles.productQty}>×{item.quantity}</span>
//                                     <span style={styles.productPrice}>
//                                         {FormatNumber((item.product?.sellingPrice ?? 0) * item.quantity)}đ
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Price breakdown */}
//                         <div style={styles.summaryItem}>
//                             <span>Subtotal</span>
//                             <span>{FormatNumber(subtotal)}đ</span>
//                         </div>
//                         <div style={styles.summaryItem}>
//                             <span>Shipping</span>
//                             <span>{shippingFee === 0 ? "Free" : `${FormatNumber(shippingFee)}đ`}</span>
//                         </div>
//                         {paymentFee > 0 && (
//                             <div style={styles.summaryItem}>
//                                 <span>Payment fee</span>
//                                 <span>{FormatNumber(paymentFee)}đ</span>
//                             </div>
//                         )}
//                         <div style={styles.summaryTotal}>
//                             <span>Total</span>
//                             <span>{FormatNumber(total)}đ</span>
//                         </div>

//                         <button
//                             style={{
//                                 ...styles.btn,
//                                 ...(!isStep1Valid || !isStep2Valid || isLoading ? styles.btnDisabled : {})
//                             }}
//                             disabled={!isStep1Valid || !isStep2Valid || isLoading}
//                             onClick={handlePlaceOrder}
//                         >
//                             {isLoading ? "Processing..." : "Place order"}
//                         </button>

//                         {(!isStep1Valid || !isStep2Valid) && (
//                             <p style={{ fontSize: 12, color: "#aaa", textAlign: "center", marginTop: 10 }}>
//                                 {!isStep1Valid
//                                     ? "Please enter your shipping address"
//                                     : "Please select shipping & payment method"}
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CheckoutPage;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import FormatNumber from "../utils/FormatNumber";
import {
    getPaymentMethods,
    getShippingMethods,
    placeOrder,
    PaymentMethodModel,
    ShippingMethodModel,
    CheckoutItem,
} from "../../api/CheckoutAPI";
import { CartItemModel } from "../../models/CartModel";

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems: CartItemModel[] = location.state?.cartItems ?? [];

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodModel[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

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

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.sellingPrice ?? 0) * item.quantity, 0);
    const total = subtotal;

    return (
        <div className="container mt-5 mb-5" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Tiêu đề giống mẫu */}
            <div className="border-bottom mb-4 pb-2">
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>THANH TOÁN</h1>
            </div>

            <div className="row">
                {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG */}
                <div className="col-md-7">
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>THÔNG TIN THANH TOÁN</h3>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Họ *</label>
                            <input type="text" className="form-control" placeholder="Họ" required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Tên *</label>
                            <input type="text" className="form-control" placeholder="Tên" required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Địa chỉ *</label>
                        <input type="text" className="form-control" placeholder="Địa chỉ" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Số điện thoại *</label>
                        <input type="text" className="form-control" placeholder="Số điện thoại" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Địa chỉ email *</label>
                        <input type="email" className="form-control" placeholder="Email" required />
                    </div>

                    <h3 className="mt-4" style={{ fontSize: '20px', fontWeight: 'bold' }}>THÔNG TIN BỔ SUNG</h3>
                    <div className="mb-3">
                        <label className="form-label">Ghi chú đơn hàng (tùy chọn)</label>
                        <textarea className="form-control" rows={3} placeholder="Ghi chú về đơn hàng..."></textarea>
                    </div>
                </div>

                {/* CỘT PHẢI: ĐƠN HÀNG & THANH TOÁN */}
                <div className="col-md-5">
                    <div className="p-4" style={{ border: '2px solid #ddd', borderRadius: '4px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>ĐƠN HÀNG CỦA BẠN</h3>
                        
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ fontSize: '14px' }}>SẢN PHẨM</th>
                                    <th className="text-end" style={{ fontSize: '14px' }}>TẠM TÍNH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id}>
                                        <td style={{ fontSize: '14px', color: '#666' }}>
                                            {item.product?.name} <strong style={{ color: '#000' }}>× {item.quantity}</strong>
                                        </td>
                                        <td className="text-end fw-bold">
                                            <FormatNumber number={(item.product?.sellingPrice ?? 0) * item.quantity} />₫
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th style={{ fontSize: '15px' }}>Tạm tính</th>
                                    <td className="text-end fw-bold"><FormatNumber number={subtotal} />₫</td>
                                </tr>
                                <tr>
                                    <th style={{ fontSize: '18px' }}>TỔNG</th>
                                    <td className="text-end fw-bold" style={{ color: '#d0021b', fontSize: '20px' }}>
                                        <FormatNumber number={total} />₫
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
                        >
                            {isLoading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;