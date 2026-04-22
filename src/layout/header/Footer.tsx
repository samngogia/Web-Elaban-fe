import React from "react";

function Footer() {
    return (
        <div className="container-fluid bg-light mt-5">
            <div className="container">
                <footer className="py-5">
                    <div className="row">
                        {/* Cột 1: Giới thiệu & Liên hệ */}
                        <div className="col-12 col-md-4 mb-3">
                            <h5 className="fw-bold text-primary">ElaBan - Nội Thất Hiện Đại</h5>
                            <p className="text-body-secondary mt-3">
                                Chuyên cung cấp các giải pháp nội thất thông minh, mang lại không gian sống đẳng cấp và ấm cúng cho gia đình bạn.
                            </p>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2 text-body-secondary">
                                    <i className="bi bi-geo-alt-fill me-2"></i> Đường Cầu Diễn, Bắc Từ Liêm, Hà Nội
                                </li>
                                <li className="nav-item mb-2 text-body-secondary">
                                    <i className="bi bi-telephone-fill me-2"></i> Hotline: 0123 456 789
                                </li>
                                <li className="nav-item mb-2 text-body-secondary">
                                    <i className="bi bi-envelope-fill me-2"></i> Email: support@elaban.vn
                                </li>
                            </ul>
                        </div>

                        {/* Cột 2: Danh mục sản phẩm */}
                        <div className="col-6 col-md-2 mb-3">
                            <h5>Sản Phẩm</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2"><a href="/products/sofa" className="nav-link p-0 text-body-secondary">Sofa & Ghế</a></li>
                                <li className="nav-item mb-2"><a href="/products/ban-an" className="nav-link p-0 text-body-secondary">Bàn Ăn</a></li>
                                <li className="nav-item mb-2"><a href="/products/giuong" className="nav-link p-0 text-body-secondary">Giường Ngủ</a></li>
                                <li className="nav-item mb-2"><a href="/products/tu-do" className="nav-link p-0 text-body-secondary">Tủ Quần Áo</a></li>
                                <li className="nav-item mb-2"><a href="/products/trang-tri" className="nav-link p-0 text-body-secondary">Đồ Trang Trí</a></li>
                            </ul>
                        </div>

                        {/* Cột 3: Hỗ trợ khách hàng */}
                        <div className="col-6 col-md-2 mb-3">
                            <h5>Hỗ Trợ</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2"><a href="/policy/shipping" className="nav-link p-0 text-body-secondary">Chính sách vận chuyển</a></li>
                                <li className="nav-item mb-2"><a href="/policy/warranty" className="nav-link p-0 text-body-secondary">Bảo hành & Đổi trả</a></li>
                                <li className="nav-item mb-2"><a href="/faq" className="nav-link p-0 text-body-secondary">Câu hỏi thường gặp</a></li>
                                <li className="nav-item mb-2"><a href="/blog" className="nav-link p-0 text-body-secondary">Tin tức nội thất</a></li>
                                <li className="nav-item mb-2"><a href="/contact" className="nav-link p-0 text-body-secondary">Liên hệ</a></li>
                            </ul>
                        </div>

                        {/* Cột Newsletter */}
                        <div className="col-md-3 offset-md-1 mb-3">
                            <form>
                                <h5>Đăng ký nhận tin</h5>
                                <p>Nhận ngay thông tin khuyến mãi và các mẫu thiết kế mới nhất.</p>
                                <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                                    <label htmlFor="newsletter1" className="visually-hidden">Email address</label>
                                    <input
                                        id="newsletter1"
                                        type="email"
                                        className="form-control"
                                        placeholder="Địa chỉ Email"
                                    />
                                    <button className="btn btn-primary" type="button">Đăng ký</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                        <ul className="list-unstyled d-flex">
                            <li className="ms-3"><a className="link-body-secondary" href="#"><i className="bi bi-facebook"></i></a></li>
                            <li className="ms-3"><a className="link-body-secondary" href="#"><i className="bi bi-instagram"></i></a></li>
                            <li className="ms-3"><a className="link-body-secondary" href="#"><i className="bi bi-youtube"></i></a></li>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Footer;