import { Outlet } from "react-router-dom";
import Navbar from "./header/Navbar";
import Footer from "./header/Footer";

function MainLayout({ searchKeyword, setSearchKeyword }: any) {
    return (
        <>
            <Navbar 
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
            />
            <Outlet context={{ searchKeyword }} />
            <Footer />
        </>
    );
}

export default MainLayout;