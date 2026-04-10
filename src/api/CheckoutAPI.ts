const API_BASE = "http://localhost:8089";

export interface CheckoutItem {
    productId: number;
    quantity: number;
    price: number;
}

export interface CheckoutRequest {
    userId: number;
    fullName: string; 
    phoneNumber: string;
    shippingAddress: string;
    billingAddress: string;
    paymentMethodId: number;
    shippingMethodId: number;
    items: CheckoutItem[];
    note?: string;
}

export interface OrderResponse {
    orderId: number;
    totalAmount: number;
    paymentStatus: string;
    shippingStatus: string;
}

export interface PaymentMethodModel {
    id: number;
    name: string;
    description: string;
    paymentFee: number;
}

export interface ShippingMethodModel {
    id: number;
    name: string;
    description: string;
    shippingFee: number;
}

const getToken = () => localStorage.getItem("token");

export async function getPaymentMethods(): Promise<PaymentMethodModel[]> {
    const response = await fetch(`${API_BASE}/payment_method`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    const data = await response.json();
    return data._embedded?.paymentMethods ?? [];
}

export async function getShippingMethods(): Promise<ShippingMethodModel[]> {
    const response = await fetch(`${API_BASE}/shipping_method`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    const data = await response.json();
    return data._embedded?.shippingMethods ?? [];
}

export async function placeOrder(request: CheckoutRequest): Promise<OrderResponse> {
    const response = await fetch(`${API_BASE}/order/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(request)
    });
    if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg);
    }
    return response.json();
}