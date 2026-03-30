import React, { useState, useEffect } from "react";
import { Search, Person, Cart } from "react-bootstrap-icons";
import { Link, NavLink, useNavigate } from "react-router-dom";


interface NavbarProps {
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
}

function Navbar({ searchKeyword, setSearchKeyword }: NavbarProps) {
    // 1. Quản lý nội dung tìm kiếm // từ khóa tạm thời
    const [tempKeyword, setTempKeyword] = useState<string>('');
    // 2. Trạng thái Đăng nhập: Kiểm tra xem có token trong localStorage không
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);



    const navigate = useNavigate();

    // 4. Luôn kiểm tra trạng thái đăng nhập mỗi khi Navbar được hiển thị
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Chuyển đổi sang true nếu có token, false nếu không
    }, []);


    //ham thay doi tu khoa tim kiem
    const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempKeyword(e.target.value);
    };


    const handleSearch = () => {
        setSearchKeyword(tempKeyword.trim());
    }


    // 5. Hàm xử lý Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('token'); // Xóa "chìa khóa" khỏi máy
        setIsLoggedIn(false);            // Cập nhật giao diện ngay lập tức
        setUserDropdownOpen(false);      // Đóng menu
        navigate('/login');              // Đẩy người dùng về trang đăng nhập
    };


    // 3. Quản lý việc đóng/mở các Menu sổ xuống (Dropdown)
    const [dropdown1Open, setDropdown1Open] = useState(false);
    const [dropdown2Open, setDropdown2Open] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    useEffect(() => {
        // Initialize Bootstrap after component mounts
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const toggleDropdown1 = () => {
        setDropdown1Open(!dropdown1Open);
        setDropdown2Open(false);
    };

    const toggleDropdown2 = () => {
        setDropdown2Open(!dropdown2Open);
        setDropdown1Open(false);
    };

    const closeDropdowns = () => {
        setDropdown1Open(false);
        setDropdown2Open(false);
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand fw-bold" href="#">ElaBan</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/">Trang chủ</NavLink>
                        </li>

                        {/* dùng thẻ link thay cho a để chuyển trang mà không reload lại trang */}
                        <li className="nav-item">
                            <NavLink className="nav-link active" to="/introduce" aria-current="page">Giới thiệu</NavLink>
                        </li>

                        <li className="nav-item dropdown" onMouseLeave={closeDropdowns}>
                            <NavLink
                                className="nav-link dropdown-toggle"
                                to="#"
                                id="navbarDropdown1"
                                role="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown1();
                                }}
                            >
                                Nội thất
                            </NavLink>
                            <ul className={`dropdown-menu ${dropdown1Open ? "show" : ""}`}>

                                {/* ===== PHÒNG KHÁCH ===== */}
                                <li className="dropdown-submenu">
                                    <span className="dropdown-item dropdown-toggle">Phòng khách</span>
                                    <ul className="dropdown-menu">
                                        <li><NavLink className="dropdown-item" to="/category/5">Ghế sofa</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/category/6">Kệ tivi</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/category/7">Tủ giày</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/category/8">Tủ rượu</NavLink></li>
                                    </ul>
                                </li>

                                {/* ===== PHÒNG NGỦ ===== */}
                                <li className="dropdown-submenu">
                                    <span className="dropdown-item dropdown-toggle">Phòng ngủ</span>
                                    <ul className="dropdown-menu">
                                        <li><NavLink className="dropdown-item" to="/category/9">Bàn trang điểm</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/category/10">Giường</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/category/11">Tủ quần áo</NavLink></li>
                                    </ul>
                                </li>

                                {/* ===== PHÒNG BẾP ===== */}
                                <li className="dropdown-submenu">
                                    <span className="dropdown-item dropdown-toggle">Phòng bếp</span>
                                    <ul className="dropdown-menu">
                                        <li><NavLink className="dropdown-item" to="/category/12">Bàn ăn</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/category/13">Tủ bếp</NavLink></li>
                                    </ul>
                                </li>

                            </ul>
                        </li>
                        <li className="nav-item dropdown" onMouseLeave={closeDropdowns}>
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdown2"
                                role="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown2();
                                }}
                            >
                                Quý định bán hàng
                            </a>
                            <ul
                                className={`dropdown-menu ${dropdown2Open ? "show" : ""}`}
                                aria-labelledby="navbarDropdown2"
                                style={{ display: dropdown2Open ? "block" : "none" }}
                            >
                                <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>Quý định 1</a></li>
                                <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>Quý định 2</a></li>
                                <li><a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>Quý định 3</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Tin tức</a>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Liên hệ</Link>
                        </li>
                    </ul>
                </div>

                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={onSearchInputChange} value={tempKeyword} />
                    <button className="btn btn-outline-success" type="button" onClick={handleSearch}>

                        <Search></Search>
                    </button>
                </form>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        {/* Bỏ thẻ <a> cũ ở đây */}
                        <Link
                            className="nav-link text-white"
                            to="/cart"
                            aria-current="page"
                        >
                            <i className="fas fa-shopping-cart fa-lg"></i>
                        </Link>
                    </li>
                </ul>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a
                            className="nav-link text-white dropdown-toggle"
                            href="#"
                            role="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setUserDropdownOpen(!userDropdownOpen);
                            }}
                        >
                            <Person size={26} />
                        </a>

                        {/* Menu nội dung thay đổi dựa trên trạng thái isLoggedIn */}
                        <ul className={`dropdown-menu dropdown-menu-end ${userDropdownOpen ? "show" : ""}`}
                            style={{ right: 0, left: 'auto' }}>

                            {!isLoggedIn ? (
                                /* CHƯA ĐĂNG NHẬP */
                                <>
                                    <li>
                                        <Link className="dropdown-item" to="/login" onClick={() => setUserDropdownOpen(false)}>
                                            Đăng nhập
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/register" onClick={() => setUserDropdownOpen(false)}>
                                            Đăng ký
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                /* ĐÃ ĐĂNG NHẬP */
                                <>
                                    <li><Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link></li>
                                    <li><Link className="dropdown-item" to="/cart">Đơn hàng của tôi</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                                            Đăng xuất
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </li>
                </ul>
            </div>

        </nav>
    );
}

export default Navbar;