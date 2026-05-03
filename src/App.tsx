import React, { useState } from 'react';

import Navbar from './layout/header/Navbar';
import Footer from './layout/header/Footer';
import HomePage from './homepage/HomePage';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import About from './layout/about/about';
import Test from './layout/user/Test';
import ProductDetail from './layout/product/ProductDetail';
import Register from './layout/user/Register';
import Login from './layout/user/Login';
import ActivateAccount from './layout/user/ActivateAccount';
import ProductForm_Admin from './layout/admin/ProductForm';
import Introduce from './layout/product/components/Introduce';
import CartPage from './layout/cart/CartPage';
import CheckoutPage from './layout/cart/CheckoutPage';
import OrderSuccessPage from './layout/cart/OrderSuccessPage';
import ContactPage from './layout/about/ContactPage';
import ForgotPasswordPage from './layout/auth/ForgotPasswordPage';
import PaymentResultPage from './layout/cart/PaymentResultPage';
import AdminDashboard from './layout/admin/AdminDashboard';
import AdminProduct from './layout/admin/AdminProduct';
import AdminOrder from './layout/admin/AdminOrder';
import AdminCategory from './layout/admin/AdminCategory';
import AdminUser from './layout/admin/AdminUser';
import AdminLayout from './layout/admin/AdminLayout';
import { Chat } from 'react-bootstrap-icons';
import Chatbot from './layout/utils/Chatbot';
import MyOrdersPage from './layout/cart/MyOrdersPage';
import AdminReview from './layout/admin/AdminReview';
import WishListPage from './layout/user/WishListPage';
import ProfilePage from './layout/user/ProfilePage';
import AuthLayout from './layout/AuthLayout';
import MainLayout from './layout/MainLayout';
import MyAddresses from './homepage/componets/MyAddresses';
import AdminVoucher from './layout/admin/AdminVoucher';
import BlogPage from './layout/blog/BlogPage';
import BlogDetailPage from './layout/blog/BlogDetailPage';
import AdminBlog from './layout/admin/AdminBlog';

import RequireStaff from "./layout/admin/RequireStaff";
import RequireAdmin from './layout/admin/RequireAdmin';



// 1. COMPONENT KIỂM TRA ĐIỀU KIỆN HIỂN THỊ CHATBOT
const ConditionalChatbot = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Danh sách các đường dẫn (route) muốn ẨN Chatbot
  const hiddenRoutes = [
    '/admin', 
    '/login', 
    '/register', 
    '/forgot-password', 
    '/activate'
  ];

  // Kiểm tra xem đường dẫn hiện tại có chứa bất kỳ từ khóa nào trong danh sách ẩn không
  const isHidden = hiddenRoutes.some(route => currentPath.startsWith(route));

  if (isHidden) {
    return null; // Không render gì cả nếu lọt vào danh sách ẩn
  }
  
  return <Chatbot />; // Các trang khác thì render Chatbot bình thường
};


function App() {
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <div className='App'>
      <BrowserRouter>
        
        {/* 2. THAY THẾ <Chatbot /> CŨ BẰNG COMPONENT MỚI NÀY */}
        <ConditionalChatbot />

        <Routes>
          <Route
            element={
              <MainLayout
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
              />
            }
          >
            <Route path='/' element={<HomePage searchKeyword={searchKeyword} />} />
            <Route path='/HomePage' element={<HomePage searchKeyword={searchKeyword} />} />
            <Route path='/category/:categoryId' element={<HomePage searchKeyword={searchKeyword} />} />



            <Route path='/about' element={<About />} />

            <Route path='/product/:productId' element={<ProductDetail />} />

            <Route path='/activate/:email/:activationCode' element={<ActivateAccount />} />

            <Route path='/test' element={<Test />} />

            <Route path='/introduce' element={<Introduce />} />

            <Route path="/cart" element={<CartPage />} />

            <Route path="/checkout" element={<CheckoutPage />} />

            <Route path="/order-success" element={<OrderSuccessPage />} />

            <Route path='/contact' element={<ContactPage />} />

            <Route path="/payment-result" element={<PaymentResultPage />} />

            <Route path="/my-orders" element={<MyOrdersPage />} />

            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/wishlist" element={<WishListPage />} />



            <Route path="/my-addresses" element={<MyAddresses />} />

            <Route path="/vouchers" element={<AdminVoucher />} />

            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
          </Route>

          {/* Auth riêng */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/activate" element={<ActivateAccount />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<RequireStaff><AdminLayout /></RequireStaff>}>
            <Route path="products" element={<AdminProduct />} />
            <Route path="categories" element={<AdminCategory />} />
            <Route path="orders" element={<AdminOrder />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="reviews" element={<AdminReview />} />

            <Route path="dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="users" element={<RequireAdmin><AdminUser /></RequireAdmin>} />
            <Route path="vouchers" element={<RequireAdmin><AdminVoucher /></RequireAdmin>} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
