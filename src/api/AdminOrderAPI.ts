// src/api/AdminOrderApi.ts

export interface OrderDetailAdmin {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

export interface OrderAdmin {
    id: number;
    fullName: string;
    phoneNumber: string;
    shippingAddress: string;
    paymentStatus: string;
    shippingStatus: string;
    totalAmount: number;
    createdDate: string;
    note: string;
    orderDetails: OrderDetailAdmin[];
}

const API = "http://localhost:8089/admin/orders";

const authHeader = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
    };
};

export async function getAllOrders() {
    const response = await fetch(API, {
        headers: authHeader(),
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
}

export async function updatePaymentStatus(orderId: number, status: string) {
    const response = await fetch(
        `${API}/${orderId}/payment-status?status=${status}`,
        {
            method: "PATCH",
            headers: authHeader(),
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    // backend trả text nên dùng text()
    return await response.text();
}

export async function updateShippingStatus(orderId: number, status: string) {
    const response = await fetch(
        `${API}/${orderId}/shipping-status?status=${status}`,
        {
            method: "PATCH",
            headers: authHeader(),
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    // backend trả text nên dùng text()
    return await response.text();
}