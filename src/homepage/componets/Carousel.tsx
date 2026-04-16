import React, { useState, useEffect } from "react";
import ProductModel from "../../models/ProductModel";
import CarouselItem from "./CarouselItem";
import { getTop3LatestProducts } from "../../api/ProductApi";

// Gradient backgrounds cho từng slide
const GRADIENTS = [
    "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
    "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
    "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
];

const Carousel: React.FC = () => {
    const [productList, setProductList] = useState<ProductModel[]>([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        getTop3LatestProducts()
            .then(response => {
                setProductList(response.result);
                setIsLoading(false);
            })
            .catch(err => {
                setErrorMessage(err.message);
                setIsLoading(false);
            });
    }, []);

    // Auto slide
    useEffect(() => {
        if (productList.length === 0) return;
        const timer = setInterval(() => {
            setActiveIndex(i => (i + 1) % productList.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [productList.length]);

    if (errorMessage) return null;

    if (isLoading) return (
        <div style={{
            height: 500,
            background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div style={{
                width: 40, height: 40,
                border: "3px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite"
            }} />
        </div>
    );

    if (productList.length === 0) return null;

    return (
        <div style={{
            position: "relative",
            height: 500,
            overflow: "hidden",
            userSelect: "none",
        }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .carousel-slide-content { animation: fadeIn 0.6s ease forwards; }
            `}</style>

            {/* Slides */}
            {productList.map((product, index) => (
                <div
                    key={product.id}
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: GRADIENTS[index % GRADIENTS.length],
                        opacity: index === activeIndex ? 1 : 0,
                        transition: "opacity 0.8s ease",
                        pointerEvents: index === activeIndex ? "auto" : "none",
                    }}
                >
                    {/* Decorative circles */}
                    <div style={{
                        position: "absolute",
                        width: 400, height: 400,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.03)",
                        top: -100, right: -100,
                        pointerEvents: "none",
                    }} />
                    <div style={{
                        position: "absolute",
                        width: 200, height: 200,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.05)",
                        bottom: -50, left: 100,
                        pointerEvents: "none",
                    }} />

                    {/* Content */}
                    <div
                        className={index === activeIndex ? "carousel-slide-content" : ""}
                        style={{ height: "100%" }}
                    >
                        <CarouselItem product={product} />
                    </div>
                </div>
            ))}

            {/* Prev button */}
            <button
                onClick={() => setActiveIndex(i => (i - 1 + productList.length) % productList.length)}
                style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 44, height: 44,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    border: "0.5px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    fontSize: 20,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
                ‹
            </button>

            {/* Next button */}
            <button
                onClick={() => setActiveIndex(i => (i + 1) % productList.length)}
                style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 44, height: 44,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    border: "0.5px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    fontSize: 20,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
                ›
            </button>

            {/* Dot indicators */}
            <div style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 8,
                zIndex: 10,
            }}>
                {productList.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        style={{
                            width: index === activeIndex ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            background: index === activeIndex
                                ? "#fff"
                                : "rgba(255,255,255,0.4)",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            transition: "all 0.3s ease",
                        }}
                    />
                ))}
            </div>

            {/* Progress bar */}
            <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 3,
                background: "rgba(255,255,255,0.3)",
                width: "100%",
                zIndex: 10,
            }}>
                <div style={{
                    height: "100%",
                    background: "#fff",
                    width: `${((activeIndex + 1) / productList.length) * 100}%`,
                    transition: "width 0.3s ease",
                }} />
            </div>
        </div>
    );
};

export default Carousel;