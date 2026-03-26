class ProductModel {

    id: number;
    name?: string;               // Tên sản phẩm (Bàn gỗ sồi, Ghế Ergonomic...)
    description?: string;        // Mô tả chi tiết
    listPrice?: number;          // Giá niêm yết (list_price)
    sellingPrice?: number;       // Giá bán thực tế (selling_price)
    quantity?: number;           // Số lượng trong kho
    avgRating?: number;          // Trung bình đánh giá (avg_rating)
    brand?: string;              // Thương hiệu (ElaHome, Sihoo...)
    dimensions?: string;         // Kích thước (120x60x75cm...)
    material?: string;           // Chất liệu (Gỗ sồi, Lưới & Hợp kim...)

    constructor(
        id: number,
        name: string,
        description: string,
        listPrice: number,
        sellingPrice: number,
        quantity: number,
        avgRating: number,
        brand: string,
        dimensions: string,
        material: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.listPrice = listPrice;
        this.sellingPrice = sellingPrice;
        this.quantity = quantity;
        this.avgRating = avgRating;
        this.brand = brand;
        this.dimensions = dimensions;
        this.material = material;
    }
}
export default ProductModel;