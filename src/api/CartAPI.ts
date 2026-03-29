import { CartModel, CartItemModel } from "../models/CartModel";

const API_BASE = "http://localhost:8089/cart";

// Lấy giỏ hàng theo userId
// export async function getCartByUserId(userId: number): Promise<CartModel> {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`http://localhost:8089/cart/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     if (!response.ok) throw new Error("Failed to fetch cart");
//     return response.json();
// }
export async function getCartByUserId(userId: number): Promise<any> {
    const token = localStorage.getItem("token");
    console.log("Token:", token);           // kiểm tra token có không
    console.log("UserId:", userId);         // kiểm tra userId

    const response = await fetch(`http://localhost:8089/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Response status:", response.status); // kiểm tra status

    if (!response.ok) throw new Error("Failed to fetch cart");
    return response.json();
}

// Thêm vào giỏ
export async function addToCart(
    userId: number,
    productId: number,
    quantity: number
): Promise<CartModel> {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8089/cart/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            userId,
            productId,
            quantity
        })
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }

    return response.json();
}




// Cập nhật số lượng
export async function updateCartItem(cartItemId: number, quantity: number): Promise<void> {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/item/${cartItemId}?quantity=${quantity}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
    });
}

// Xóa 1 item
export async function removeCartItem(cartItemId: number): Promise<void> {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/item/${cartItemId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
}

// Xóa toàn bộ giỏ
export async function clearCart(userId: number): Promise<void> {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/clear/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
}
