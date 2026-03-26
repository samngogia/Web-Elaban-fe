import React from "react";

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
    return (
    <div className="col-md-3 mt-2">
  <div className="card">
    <img
      src={product.url}
      className="card-img-top"
      alt={product.title}
      style={{ height: '200px', objectFit: 'cover' }}
    />
    <div className="card-body">
      <h5 className="card-title">{product.title}</h5>
      <p className="card-text">{product.description}</p>
      
      <div className="price mb-3">
        <span className="original-price me-2">
          <del>{product.originalPrice}đ</del>
        </span>
        <span className="discounted-price text-danger">
          <strong>{product.discountedPrice}đ</strong>
        </span>
      </div>

      <div className="btn-group w-100" role="group">
        <button type="button" className="btn btn-primary">
          Mua ngay
        </button>
        <button type="button" className="btn btn-outline-secondary">
          Chi tiết
        </button>
      </div>
    </div>
  </div>
</div>
    );
}
export default ProductCard;
