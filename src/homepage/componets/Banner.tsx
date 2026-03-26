import React from "react";
function Banner(){
    return(
        <div className="p-5 mb-4 bg-dark ">
            <div className="container-fluid py-5 text-white d-flex align-items-center justify-content-center">
                <div>
                    <h3 className="display-5 fw-bold">
                        Đọc sách chính là hộ chiếu <br/>để đi đến những vùng đất mới
                    </h3>
                    <p className="">Mary Pope Osborne</p>
                    <button className="btn btn-primary btn-lg text-white float-end ">Xem thêm</button>
                </div>

            </div>
            

        </div>
    )
}
export default Banner;