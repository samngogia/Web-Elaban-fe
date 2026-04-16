import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                home: "Home",
                introduce: "About",
                furniture: "Furniture",
                livingRoom: "Living Room",
                bedroom: "Bedroom",
                kitchen: "Kitchen",
                search: "Search products...",
                wishlist: "Wishlist",
                login: "Login",
                register: "Register",
                logout: "Logout",
                profile: "Profile",
                myOrders: "My Orders"
            }
        },
        vi: {
            translation: {
                home: "Trang chủ",
                introduce: "Giới thiệu",
                furniture: "Nội thất",
                livingRoom: "Phòng khách",
                bedroom: "Phòng ngủ",
                kitchen: "Phòng bếp",
                search: "Tìm sản phẩm...",
                wishlist: "Yêu thích",
                login: "Đăng nhập",
                register: "Đăng ký",
                logout: "Đăng xuất",
                profile: "Thông tin cá nhân",
                myOrders: "Đơn hàng của tôi"
            }
        }
    },
    lng: localStorage.getItem("lang") || "vi",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;