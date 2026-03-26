import React from "react";
import Banner from './componets/Banner';
import Carousel from './componets/Carousel';
import { useParams } from "react-router-dom";
import ProductList from "../layout/product/ProductList";



interface HomePageProps {
    searchKeyword: string;
    categoryId?: number; // Thêm maTheLoai vào props nếu cần thiết
}



function HomePage(  {searchKeyword}: HomePageProps) {
    const { categoryId } = useParams<{ categoryId?: string }>();
    let categoryIdNumber = 0;

       try {
        if (categoryId) {
            categoryIdNumber = parseInt(categoryId, 10);
        }
    } catch (error) {
        // Nếu lỗi parse, mặc định về 0
        console.error("Error parsing categoryId:", error);
        categoryIdNumber = 0;
    }
    
    if(Number.isNaN(categoryIdNumber)){
        categoryIdNumber=0;
    }
    return(
        <>
            <Banner />
            <Carousel />
            <ProductList searchKeyword={searchKeyword} categoryId={categoryIdNumber} />
        </>
    )
}
export default HomePage;