import ProductModel from "./ProductModel";

class CartItemModel {
    id: number;
    quantity: number;
    product: ProductModel;

    constructor(id: number, quantity: number, product: ProductModel) {
        this.id = id;
        this.quantity = quantity;
        this.product = product;
    }
}

class CartModel {
    id: number;
    cartItems: CartItemModel[];

    constructor(id: number, cartItems: CartItemModel[]) {
        this.id = id;
        this.cartItems = cartItems;
    }
}

export { CartModel, CartItemModel };