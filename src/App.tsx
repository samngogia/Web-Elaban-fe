import React, { useState } from 'react';
import './App.css';
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

function App() {
  //Nó dùng để lưu và cập nhật từ khóa tìm kiếm mà người dùng nhập vào
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <div className='App'>

      <BrowserRouter>
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
          <Route path='/introduce' element={<Introduce/>}/>
        </Routes>
        <Footer />

      </BrowserRouter>



    </div>
  );
}

export default App;

