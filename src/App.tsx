import React, { useState } from 'react';

import Navbar from './layout/header/Navbar';
import Footer from './layout/header/Footer';
import HomePage from './homepage/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import AdminLayoutWrapped from './layout/admin/AdminLayoutWrapped';
import { Chat } from 'react-bootstrap-icons';
import Chatbot from './layout/utils/Chatbot';
import MyOrdersPage from './layout/cart/MyOrdersPage';
import AdminReview from './layout/admin/AdminReview';
import WishListPage from './layout/user/WishListPage';



function App() {
  //Nó dùng để lưu và cập nhật từ khóa tìm kiếm mà người dùng nhập vào
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <div className='App'>

      <BrowserRouter>
        <Chatbot />
        <Navbar searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} />

        <Routes>

          <Route path='/' element={<HomePage searchKeyword={searchKeyword} />} />
          <Route path='/HomePage' element={<HomePage searchKeyword={searchKeyword} />} />
          <Route path='/category/:categoryId' element={<HomePage searchKeyword={searchKeyword} />} />
          <Route path='/about' element={<About />} />
          <Route path='/product/:productId' element={<ProductDetail />} />
          {/* chi tiết sản phẩm */}
          <Route path='/register' element={<Register />} />
          <Route path='/activate/:email/:activationCode' element={<ActivateAccount />} />
          <Route path='/login' element={<Login />} />
          <Route path='/test' element={<Test />} />
          <Route path='/admin/add-product' element={<ProductForm_Admin />} />
          <Route path='/introduce' element={<Introduce />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path='/contact' element={<ContactPage />} />


          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/payment-result" element={<PaymentResultPage />} />

          <Route path="/my-orders" element={<MyOrdersPage />} />

          
          <Route path="/wishlist" element={<WishListPage />} />


          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayoutWrapped />}>
            <Route index element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProduct />} />
            <Route path="/admin/orders" element={<AdminOrder />} />
            <Route path="/admin/categories" element={<AdminCategory />} />
            <Route path="/admin/users" element={<AdminUser />} />
            <Route path="/admin/reviews" element={<AdminReview />} />
          </Route>


        </Routes>
        <Footer />

      </BrowserRouter>



    </div>
  );
}

export default App;

