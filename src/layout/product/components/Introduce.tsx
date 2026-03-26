import React from 'react';
import anhBanner from '../../../images/books/AnhNoiThat.jpg';

const Introduce: React.FC = () => {
    return (
        <div className="container my-5">
            {/* Phần đầu: Banner đơn giản */}
            <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg mb-5" style={{ maxHeight: '450px' }} >
                <div className="col-lg-7 p-3 p-lg-5 pt-lg-3">
                    <h1 className="display-4 fw-bold lh-1 text-body-emphasis">Về ElaBan - Nội Thất Tinh Tế</h1>
                    <p className="lead mt-3">
                        Chào mừng bạn đến với ElaBan. Chúng tôi không chỉ bán nội thất, chúng tôi cùng bạn kiến tạo không gian sống mơ ước với những thiết kế hiện đại và chất lượng vượt trội.
                    </p>
                </div>
                <div className="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg d-flex">
                    <img
                        className="rounded-lg-3 shadow img-fluid" // Thêm img-fluid để ảnh không bị vỡ khung
                        src={anhBanner}
                        alt="Nội thất ElaBan"
                        style={{
                            objectFit: 'cover', // Cắt ảnh thông minh để lấp đầy khung
                            minHeight: '100%',  // Ép ảnh cao bằng khung chứa
                            width: '100%'
                        }}
                    />
                </div>
            </div>

            <div className="col  content-main  cotcontent_2cot ">
                <div className="ws-container noidungchitiet">

                    <div className="noidungchitiet">
                        <blockquote><i></i>
                            <p><b>[THUONGHIEU]&nbsp;</b>là một trong những công ty hàng đầu về thiết kế và thi công nội thất. Bằng tâm huyết, bằng kinh nghiệm, sự nhiệt tình và sáng tạo, đội ngũ <b>[THUONGHIEU]</b> tự tin mang đến cho khách hàng những phong cách nội thất thẩm mỹ, nâng tầm giá trị cho căn nhà bạn. Đến với chúng tôi, bạn chắc chắn sẽ hài lòng về không gian sống của mình.</p>

                            <p><strong>Tại sao </strong><b>[THUONGHIEU]</b><strong> thành lập và phát triển?</strong></p>

                            <p>Không gian sống của mỗi người thực sự rất quan trọng và luôn cần phải được đảm bảo rằng nó đẹp, có thể đáp ứng được nhu cầu sinh hoạt tối đa cho người dân. Tuy nhiên làm thế nào để có được một không gian sống đẹp và hợp ý thì không phải ai cũng có thể làm được. Chính bởi điều đó mà <b>[THUONGHIEU]</b> ra đời và thành lập nhằm mong muốn tư vấn thiết kế, thi công nội thất để giúp mỗi một không gian sống của quý khách hàng đều trở nên tuyệt vời hơn.</p>

                            <p></p>

                            <p>ẢNh</p>
                            <p><b>[THUONGHIEU]</b><strong> mang sứ mệnh nào?</strong></p>

                            <p>Home&amp;Home tự hào là đơn vị thiết kế và thi công kiến trúc nội ngoại thất uy tín hàng đầu tại Việt Nam. <b>[THUONGHIEU]</b> khởi nguồn từ những kiến trúc sư tâm huyết, sau 5 năm đi vào xây dựng và phát triển, <b>[THUONGHIEU]</b> đã trở thành một đơn vị đáng tin cậy trong việc tư vấn – thiết kế – thi công kiến trúc nội ngoại thất tại Việt Nam.</p>

                            <p>Chúng tôi hoạt động với sứ mệnh rằng:</p>

                            <ul>
                                <li>Cung cấp đến khách hàng những giá trị sáng tạo khi thiết kế, thi công nội thất để không gian sống của quý khách hàng trở nên tuyệt vời hơn.</li>
                                <li>Là điểm đến tin cậy mỗi khi khách hàng có nhu cầu thiết kế, thi công nội thất để sở hữu một nơi sống đích thực nhất.</li>
                                <li>Mang lại cuộc sống ngày càng tốt đẹp hơn, đưa cuộc sống của mỗi người không chỉ là sống mà còn là sự tận hưởng.</li>
                            </ul>

                            <p>Với đội ngũ kiến trúc sư dày dặn kinh nghiệm, chúng tôi thiết kế những công trình đẳng cấp như thiết kế biệt thự sang trọng, những sản phẩm vượt trội về chất lượng, đáp ứng được đúng nhu cầu cũng như sự kỳ vọng của khách hàng. Home&amp;Home không ngừng đổi mới, ngày càng hoàn thiện và nhanh chóng khẳng định được vị thế thương hiệu là một công ty tư vấn – thiết kế – thi công kiến trúc nội ngoại thất uy tín với phong cách thiết kế rất riêng chỉ có ở Home&amp;Home.</p>

                            <p>ẢNh</p>

                            <p><strong>Tầm nhìn của </strong><b>[THUONGHIEU]&nbsp;</b><strong>luôn không ngừng vươn xa</strong></p>

                            <p>Bằng chính sự đam mê và không ngừng học hỏi, &nbsp;đội ngũ của Home&amp;Home luôn cập nhật và bắt kịp xu thế kiến trúc nội ngoại thất trong và ngoài nước. Mỗi sự nỗ lực cố gắng của chúng tôi đều đem lại cho khách hàng sự hài lòng.</p>

                            <ul>
                                <li>Home&amp;Home luôn cố gắng hoạt động và đưa công ty phát triển lên một tầm cao mới.</li>
                                <li>Trở thành một trong những công ty hàng đầu trong lĩnh vực tư vấn, thiết kế và thi công nội thất.</li>
                                <li>Trở thành một điểm đến mà khi cứ nhắc đến lĩnh vực thiết kế hay thi công nội thất thì <b>[THUONGHIEU]</b> sẽ luôn là cái tên được mọi người nhắc đến.</li>
                            </ul>

                            <p>Mỗi thiết kế của <b>[THUONGHIEU]</b> luôn hướng tới sự tiện ích và tận dụng tối đa công năng của không gian bạn đang sống, làm việc nhưng vẫn đảm bảo đầy đủ yếu tố nghệ thuật. Thêm vào đó khách hàng có thể dễ dàng thay đổi lại thiết kế khi khách hàng có nhu cầu.</p>

                            <p>Với Home&amp;Home, chúng tôi luôn hoạt động dựa trên tiêu chí rằng thiết kế cho khách hàng cũng như thiết kế cho mình. Luôn đặt bản thân mình vào vị trí của khách hàng để có thể hiểu khách hàng và đem lại cho khách hàng những không gian sống tuyệt vời nhất.</p>

                            <p>ẢNh</p>

                            <p><b>[THUONGHIEU]</b><strong> hoạt động với giá trị cốt lõi nào?</strong></p>

                            <p>Với Home&amp;Home, chúng tôi hoạt động dựa trên tiêu chí giá trị cốt lõi sau đây:</p>

                            <ul>
                                <li>Trung thực để phát triển bền vững.</li>
                                <li>Đề cao tinh thần hợp tác cùng phát triển.</li>
                                <li>Hướng tới sự chuyên nghiệp hóa, tự động hóa.</li>
                                <li>Đặt lợi ích chung lên trên lợi ích cá nhân.</li>
                                <li>Tôn trọng, tin cậy và đề cao chữ tín.</li>
                            </ul>

                            <p><b>[THUONGHIEU]</b> chú trọng đầu tư vào Nhà xưởng, với trang thiết bị máy móc hiện đại cùng sự chuyên môn hóa trong từng bộ phận. Thêm vào đó đội ngũ quản lý và nhân viên chuyên nghiệp, giàu kinh nghiệm, có cái tâm và luôn đặt sự uy tín trong nghề nghiệp lên hàng đầu. Tất cả những điều đó đã làm nên một <b>[THUONGHIEU]</b> khác biệt, một <b>[THUONGHIEU]</b><strong>&nbsp;</strong>chuyên nghiệp và có thể khiến khách hàng không thể không hài lòng khi đến.</p>

                            <blockquote>
                                <p><b>[THUONGHIEU]</b><strong>&nbsp;</strong>luôn mang đến những sản phẩm có chất lượng cao, tiến độ giao hàng đảm bảo, giá thành hợp lý, chế độ bảo hành tốt nhất và đáp ứng những nhu cầu khác nhau của khách hàng.</p>
                            </blockquote>

                            <p><strong>Lĩnh vực hoạt động của </strong><b>[THUONGHIEU]</b><strong> là gì?</strong></p>

                            <p>Đến với <b>[THUONGHIEU]</b>, quý khách hàng có thể thấy được sự chuyên môn hóa trong từng lĩnh vực mà chúng tôi cung cấp đến cho khách hàng với:</p>

                            <ul>
                                <li>Tư vấn giải pháp thiết kế nội thất, ngoại thất cho không gian sống của khách hàng.</li>
                                <li>Thiết kế không gian nội thất, ngoại thất cho khách hàng.</li>
                                <li>Thực hiện thi công từ A – Z cho mọi công trình của khách hàng.</li>
                            </ul>

                            <p>Sự tin tưởng và ủng hộ của khách hàng trong suốt thời gian qua là nguồn động viên to lớn trên bước đường phát triển của Home&amp;Home. Chúng tôi sẽ không ngừng hoàn thiện, phục vụ khách hàng tốt nhất để luôn xứng đáng với niềm tin ấy.</p>
                            <i></i></blockquote>

                    </div>	</div>
            </div>

            {/* Phần thân: Sứ mệnh & Giá trị */}
            <div className="row g-4 py-5 row-cols-1 row-cols-lg-3 text-center">
                <div className="feature col">
                    <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3 px-3 py-2 rounded">
                        <i className="bi bi-star-fill"></i>
                    </div>
                    <h3 className="fs-2 text-body-emphasis">Chất Lượng</h3>
                    <p>Sử dụng vật liệu cao cấp, quy trình sản xuất nghiêm ngặt để đảm bảo độ bền cho từng sản phẩm.</p>
                </div>
                <div className="feature col">
                    <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3 px-3 py-2 rounded">
                        <i className="bi bi-pencil-square"></i>
                    </div>
                    <h3 className="fs-2 text-body-emphasis">Thiết Kế</h3>
                    <p>Luôn cập nhật xu hướng nội thất thế giới, tối ưu hóa công năng và thẩm mỹ cho căn hộ của bạn.</p>
                </div>
                <div className="feature col">
                    <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3 px-3 py-2 rounded">
                        <i className="bi bi-heart-fill"></i>
                    </div>
                    <h3 className="fs-2 text-body-emphasis">Tận Tâm</h3>
                    <p>Đội ngũ tư vấn nhiệt tình, hỗ trợ vận chuyển và lắp đặt tận nơi, bảo hành dài hạn.</p>
                </div>
            </div>
        </div>
    );
};

export default Introduce;