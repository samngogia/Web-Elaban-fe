import React, { useEffect, useState } from "react";
import { Search, Person, Cart, GridFill } from "react-bootstrap-icons";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchKeyword, setSearchKeyword }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tempKeyword, setTempKeyword] = useState(searchKeyword || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  // Trạng thái mở menu
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Tự động đóng menu khi chuyển trang
  useEffect(() => {
    setUserDropdownOpen(false);
    const toggler = document.getElementById("navbarSupportedContent");
    if (toggler?.classList.contains("show")) {
      (toggler as any).classList.remove("show");
    }
  }, [location]);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setTempKeyword(e.target.value);

  const handleSearch = () => {
    setSearchKeyword(tempKeyword.trim());
  };

  const loadUserAndCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setCartCount(0);
      setIsAdmin(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      setIsLoggedIn(true);
      setIsAdmin(decoded.role === "ADMIN");

      const response = await fetch(`http://localhost:8089/cart/${decoded.userId}?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" }
      });
      if (response.ok) {
        const data = await response.json();
        const total = data.cartItems?.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0) || 0;
        setCartCount(total);
      }
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    loadUserAndCart();
    window.addEventListener("cartUpdated", loadUserAndCart);
    return () => window.removeEventListener("cartUpdated", loadUserAndCart);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCartCount(0);
    setIsAdmin(false);
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/login");
  };

  const { t, i18n } = useTranslation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container">
        {/* Logo sáng và đậm nét hơn */}
        <Link className="navbar-brand fw-bold fs-3" to="/" style={{ letterSpacing: '1px' }}>
          Ela<span className="text-warning">Ban</span>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link px-3" to="/">Trang chủ</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link px-3" to="/introduce">Giới thiệu</NavLink></li>

            {/* Nội thất - Dropdown mượt */}
            <li className="nav-item dropdown custom-dropdown">
              <a href="#" className="nav-link dropdown-toggle px-3" role="button">Nội thất</a>
              <ul className="dropdown-menu border-0 shadow-lg">
                <li className="dropend">
                  <a className="dropdown-item dropdown-toggle" href="#">Phòng Khách</a>
                  <ul className="dropdown-menu shadow-lg">
                    <li><NavLink className="dropdown-item" to="/category/5">Ghế sofa</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/6">Kệ tivi</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/7">Tủ giày</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/8">Tủ rượu</NavLink></li>
                  </ul>
                </li>
                <li className="dropend">
                  <a className="dropdown-item dropdown-toggle" href="#">Phòng Ngủ</a>
                  <ul className="dropdown-menu shadow-lg">
                    <li><NavLink className="dropdown-item" to="/category/9">Bàn trang điểm</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/10">Giường</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/11">Tủ quần áo</NavLink></li>
                  </ul>
                </li>
                <li className="dropend">
                  <a className="dropdown-item dropdown-toggle" href="#">Phòng Bếp</a>
                  <ul className="dropdown-menu shadow-lg">
                    <li><NavLink className="dropdown-item" to="/category/12">Bàn ăn</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/13">Tủ bếp</NavLink></li>
                  </ul>
                </li>
              </ul>
            </li>

            {/* Quy định - Giữ nguyên các mục của bạn */}
            <li className="nav-item dropdown custom-dropdown">
              <a href="#" className="nav-link dropdown-toggle px-3" role="button">Quy định bán hàng</a>
              <ul className="dropdown-menu border-0 shadow-lg">
                <li><a className="dropdown-item" href="#">Quy định 1</a></li>
                <li><a className="dropdown-item" href="#">Quy định 2</a></li>
                <li><a className="dropdown-item" href="#">Quy định 3</a></li>
              </ul>
            </li>

            <li className="nav-item"><NavLink className="nav-link px-3" to="/news">Tin tức</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link px-3" to="/contact">Liên hệ</NavLink></li>
          </ul>


          <div className="d-flex gap-2 ms-3">
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => i18n.changeLanguage("vi")}
            >
              VI
            </button>

            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => i18n.changeLanguage("en")}
            >
              EN
            </button>
          </div>


          {/* Tìm kiếm tinh chỉnh bo tròn */}
          <form className="d-flex me-lg-3" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <div className="input-group">
              <input
                type="search"
                className="form-control border-0 bg-secondary text-white"
                placeholder="Tìm sản phẩm..."
                style={{ borderRadius: "20px 0 0 20px", minWidth: "200px" }}
                value={tempKeyword}
                onChange={onSearchInputChange}
              />
              <button className="btn btn-warning" type="submit" style={{ borderRadius: "0 20px 20px 0" }}>
                <Search />
              </button>
            </div>
          </form>

          <div className="d-flex align-items-center gap-3">
            {isAdmin && (
              <Link to="/admin/orders" className="btn btn-sm btn-outline-warning d-flex align-items-center gap-2 rounded-pill px-3">
                <GridFill /> <span className="d-none d-xl-inline">Quản trị</span>
              </Link>
            )}

            <Link className="nav-link text-white d-flex align-items-center gap-1 hover-warning" to="/wishlist">
              <i className="fa fa-heart text-danger"></i> <span className="small d-lg-none d-xl-inline">Yêu thích</span>
            </Link>

            <Link to="/cart" className="nav-link text-white position-relative p-0 mx-2">
              <Cart size={24} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown tinh tế hơn */}
            <div className="dropdown">
              <button
                className="nav-link text-white p-0 border-0 bg-transparent"
                data-bs-toggle="dropdown"
              >
                <div
                  className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '36px', height: '36px' }}
                >
                  <Person size={22} />
                </div>
              </button>

              <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2">
                {!isLoggedIn ? (
                  <>
                    <li>
                      <Link className="dropdown-item py-2" to="/login">
                        Đăng nhập
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/register">
                        Đăng ký
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item py-2" to="/profile">
                        Thông tin cá nhân
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/my-orders">
                        Đơn hàng của tôi
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/my-addresses">
                        Địa chỉ của tôi
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item text-danger py-2"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Hiệu ứng hover cho dropdown menu */
        @media (min-width: 992px) {
          .custom-dropdown:hover > .dropdown-menu { display: block; margin-top: 0; }
          .dropend:hover > .dropdown-menu { display: block; top: 0; left: 100%; margin-top: 0; }
        }
        .dropdown-menu { 
          animation: fadeIn 0.2s ease-in; 
          border-radius: 12px;
          padding: 8px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item { border-radius: 8px; transition: 0.2s; }
        .dropdown-item:hover { background-color: #f8f9fa; color: #333; padding-left: 1.25rem; }
        .nav-link { transition: 0.3s; }
        .hover-warning:hover { color: #ffc107 !important; }
        .navbar-dark .nav-link.active { color: #ffc107 !important; font-weight: 600; }
      `}</style>
    </nav>
  );
};

export default Navbar;