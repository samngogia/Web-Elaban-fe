import React from 'react';

const ContactPage: React.FC = () => {
    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                {/* Cột trái: Thông tin liên hệ */}
                <div className="col-md-6">
                    <h2 className="fw-bold mb-4">THÔNG TIN LIÊN HỆ</h2>
                    <h5 className="fw-bold">THÔNG TIN CÔNG TY - CỬA HÀNG</h5>
                    <p><strong>Địa chỉ:</strong> 473/8B Lê Văn Quới, P. Bình Trị Đông A, Q. Bình Tân, TP. HCM</p>
                    <p><strong>Tel:</strong> (028) 36 36 1080 - Ext: 101 - 103</p>
                    <p><strong>Hotline:</strong> 0862613804</p>
                    <p><strong>Email:</strong> info@webso.vn</p>
                    <p><strong>Mã số thuế:</strong> 0311177962</p>
                    <p><strong>Website:</strong> www.webelaban.vn</p>
                </div>

                {/* Cột phải: Form liên hệ */}
                <div className="col-md-6">
                    <form className="p-4 border rounded shadow-sm">
                        <div className="row mb-3">
                            <div className="col">
                                <input type="text" className="form-control" placeholder="Họ tên *" required />
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" placeholder="Điện thoại *" required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" placeholder="Email" />
                        </div>
                        <div className="mb-3">
                            <textarea className="form-control" rows={4} placeholder="Ghi chú thêm"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-2">
                            <i className="fas fa-paper-plane me-2"></i>Gửi
                        </button>
                    </form>
                </div>
            </div>

            {/* Bản đồ phía dưới (nếu cần) */}
            <div className="mt-5">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d4418.82973849091!2d105.97505907593444!3d21.147630980531588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDA4JzUxLjUiTiAxMDXCsDU4JzM5LjUiRQ!5e1!3m2!1svi!2s!4v1774775923844!5m2!1svi!2s" 
                    width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy">
                </iframe>
            </div>
        </div>
    );
};

export default ContactPage;