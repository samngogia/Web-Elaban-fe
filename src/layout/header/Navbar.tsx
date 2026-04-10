import React, { useEffect, useState } from "react";
import { Search, Person, Cart, GridFill } from "react-bootstrap-icons";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface NavbarProps {
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchKeyword, setSearchKeyword }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ========================= STATE =========================
  const [tempKeyword, setTempKeyword] = useState(searchKeyword || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Submenu riêng lẻ
  const [openSubmenu, setOpenSubmenu] = useState<{ [key: string]: boolean }>({});

  // ========================= SEARCH =========================
  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempKeyword(e.target.value);
  };

  const handleSearch = () => {
    setSearchKeyword(tempKeyword.trim());
  };

  // ========================= DROPDOWN =========================
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleDropdown2 = () => setDropdown2Open((prev) => !prev);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const closeAllDropdowns = () => {
    setDropdownOpen(false);
    setDropdown2Open(false);
    setUserDropdownOpen(false);
    setOpenSubmenu({});
  };

  // ========================= LOAD USER + CART =========================
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

      const role = decoded.role || "";
      setIsAdmin(role === "ADMIN");

      const userId = decoded.userId;
      if (!userId) return;
      const response = await fetch(
        `http://localhost:8089/cart/${userId}?t=${Date.now()}`,
        { headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" } }
      );

      if (response.ok) {
        const data = await response.json();
        const total =
          data.cartItems?.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0) || 0;
        setCartCount(total);
      }
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
      setCartCount(0);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    loadUserAndCart();
    const handleCartUpdated = async () => await loadUserAndCart();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, [location.pathname]);

  // ========================= LOGOUT =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCartCount(0);
    setIsAdmin(false);
    setUserDropdownOpen(false);
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/login");
  };


  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">ElaBan</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Trang chủ</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/introduce">Giới thiệu</NavLink></li>

            {/* Nội thất */}
            <li className="nav-item dropdown">
              <a href="#" className="nav-link dropdown-toggle" onClick={(e) => { e.preventDefault(); toggleDropdown(); }}>
                Nội thất
              </a>
              <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                {/* Phòng Khách */}
                <li className="dropdown-submenu">
                  <a href="#" className="dropdown-item dropdown-toggle" onClick={(e) => { e.preventDefault(); toggleSubmenu("phongkhach"); }}>
                    Phòng Khách
                  </a>
                  <ul className={`dropdown-menu ${openSubmenu["phongkhach"] ? "show" : ""}`}>
                    <li><NavLink className="dropdown-item" to="/category/5">Ghế sofa</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/6">Kệ tivi</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/7">Tủ giày</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/8">Tủ rượu</NavLink></li>
                  </ul>
                </li>

                {/* Phòng Ngủ */}
                <li className="dropdown-submenu">
                  <a href="#" className="dropdown-item dropdown-toggle" onClick={(e) => { e.preventDefault(); toggleSubmenu("phongngu"); }}>
                    Phòng Ngủ
                  </a>
                  <ul className={`dropdown-menu ${openSubmenu["phongngu"] ? "show" : ""}`}>
                    <li><NavLink className="dropdown-item" to="/category/9">Bàn trang điểm</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/10">Giường</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/11">Tủ quần áo</NavLink></li>
                  </ul>
                </li>

                {/* Phòng Bếp */}
                <li className="dropdown-submenu">
                  <a href="#" className="dropdown-item dropdown-toggle" onClick={(e) => { e.preventDefault(); toggleSubmenu("phongbep"); }}>
                    Phòng Bếp
                  </a>
                  <ul className={`dropdown-menu ${openSubmenu["phongbep"] ? "show" : ""}`}>
                    <li><NavLink className="dropdown-item" to="/category/12">Bàn ăn</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/category/13">Tủ bếp</NavLink></li>
                  </ul>
                </li>
              </ul>
            </li>

            {/* Quy định */}
            <li className="nav-item dropdown">
              <a href="#" className="nav-link dropdown-toggle" onClick={(e) => { e.preventDefault(); toggleDropdown2(); }}>
                Quy định bán hàng
              </a>
              <ul className={`dropdown-menu ${dropdown2Open ? "show" : ""}`}>
                <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>Quy định 1</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>Quy định 2</a></li>
                <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>Quy định 3</a></li>
              </ul>
            </li>

            <li className="nav-item"><NavLink className="nav-link" to="/news">Tin tức</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact">Liên hệ</NavLink></li>
          </ul>

          {/* ================= SEARCH ================= */}
          <form className="d-flex me-3" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <input type="search" className="form-control me-2" placeholder="Tìm sản phẩm..." value={tempKeyword} onChange={onSearchInputChange} />
            <button type="submit" className="btn btn-outline-success"><Search /></button>
          </form>

          {/* ================= ADMIN BUTTON ================= */}
          {isAdmin && (
            <Link to="/admin/orders" className="btn btn-warning fw-bold me-3 d-flex align-items-center gap-2" style={{ borderRadius: "10px", padding: "8px 14px" }}>
              <GridFill /> Trang quản trị
            </Link>
          )}


          <li className="nav-item">
            <Link className="nav-link" to="/wishlist">
              <i className="fa fa-heart text-danger"></i> Yêu thích
            </Link>
          </li>



          {/* ================= CART ================= */}
          <ul className="navbar-nav me-2">
            <li className="nav-item">
              <Link to="/cart" className="nav-link text-white position-relative">
                <Cart size={24} />
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-8px",
                    background: "#D85A30",
                    color: "#fff",
                    borderRadius: "50%",
                    minWidth: "18px",
                    height: "18px",
                    padding: "0 5px",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>{cartCount > 99 ? "99+" : cartCount}</span>
                )}
              </Link>
            </li>
          </ul>

          {/* ================= USER ================= */}
          <ul className="navbar-nav">
            <li className="nav-item dropdown position-relative">
              <a href="#" className="nav-link text-white dropdown-toggle" onClick={(e) => { e.preventDefault(); setUserDropdownOpen(!userDropdownOpen); }}>
                <Person size={24} />
              </a>

              <ul className={`dropdown-menu dropdown-menu-end ${userDropdownOpen ? "show" : ""}`} style={{ right: 0, left: 'auto' }}>
                {!isLoggedIn ? (
                  <>
                    <li><Link className="dropdown-item" to="/login" onClick={() => setUserDropdownOpen(false)}>Đăng nhập</Link></li>
                    <li><Link className="dropdown-item" to="/register" onClick={() => setUserDropdownOpen(false)}>Đăng ký</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link className="dropdown-item" to="/profile" onClick={() => setUserDropdownOpen(false)}>Thông tin cá nhân</Link></li>
                    <li><Link className="dropdown-item" to="/my-orders" onClick={() => setUserDropdownOpen(false)}>Đơn hàng của tôi</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Đăng xuất</button></li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;