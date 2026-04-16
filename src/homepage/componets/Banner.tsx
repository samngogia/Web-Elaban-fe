import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Banner() {
    const { t } = useTranslation();
    return (
        <div
            className="banner d-flex align-items-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "500px",
                position: "relative"
            }}
        >
            {/* Overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.5)"
                }}
            ></div>

            {/* Content */}
            <div className="container position-relative text-white text-center">
                <h1 className="fw-bold mb-3" style={{ fontSize: "2.8rem" }}>
                    Không gian đẹp bắt đầu <br /> từ những lựa chọn tinh tế
                </h1>

                <p className="mb-4" style={{ opacity: 0.85 }}>
                    Thiết kế nội thất hiện đại – nâng tầm cuộc sống của bạn
                </p>

                <Link to="/Introduce">
                    <button
                        className="btn px-4 py-2"
                        style={{
                            backgroundColor: "#c49a6c",
                            color: "#fff",
                            borderRadius: "30px",
                            border: "none",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#a67c52")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#c49a6c")
                        }
                    >
                        Khám phá ngay
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Banner;