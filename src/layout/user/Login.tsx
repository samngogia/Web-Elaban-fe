import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [username, setUsername] = useState(``);
    const [password, setPassword] = useState(``);
    const [error, setError] = useState(``);



    const navigate = useNavigate();




    // Handle login logic
    const handleLogin = () => {
        const loginRequest = {
            username: username,
            password: password
        };

        fetch('http://localhost:8089/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginRequest)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Login failed!');
                }
            })
            .then((data) => {
                const { jwt } = data;

                if (jwt) {
                    localStorage.setItem("token", jwt);

                    const decoded: any = jwtDecode(jwt);
                    console.log(decoded);

                    if (decoded.isAdmin) {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }
                }
            })
            .catch((error) => {
                // Handle login error
                console.error('Login error: ', error);
                setError('Login failed. Please check your username and password.');
            });
    };

    return (
        <div className="register-wrapper">
            <div className="register-card">

                <h2 className="text-center mb-4">Đăng nhập</h2>

                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Tên đăng nhập</label>
                </div>

                <div className="form-floating mb-3 password-wrapper">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="floatingPassword">Mật khẩu</label>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="checkDefault" />
                        <label className="form-check-label" htmlFor="checkDefault">
                            Ghi nhớ
                        </label>
                    </div>

                    <span
                        className="link"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Quên mật khẩu?
                    </span>
                </div>

                <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={handleLogin}
                >
                    Đăng nhập
                </button>

                <div className="text-center mt-3">
                    <span style={{ fontSize: 14 }}>
                        Chưa có tài khoản?{" "}
                        <span
                            className="link strong"
                            onClick={() => navigate("/register")}
                        >
                            Đăng ký
                        </span>
                    </span>
                </div>

                {error && (
                    <div className={`mt-3 text-center ${error.includes('successful') ? 'text-success' : 'text-error'}`}>
                        {error}
                    </div>
                )}

                <p className="footer text-center mt-4">© 2026 ElaBan Furniture</p>

            </div>
            <style>
{`
.register-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #fff6f3, #ffffff);
}

.register-card {
    width: 450px;
    background: #fff;
    padding: 30px;
    border-radius: 14px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}

/* giữ Bootstrap nhưng làm đẹp hơn */
.form-control {
    border-radius: 8px !important;
    padding: 10px 12px;
}

.form-control:focus {
    border-color: #ee4d2d !important;
    box-shadow: 0 0 0 2px rgba(238,77,45,0.15) !important;
}

.link {
    color: #ee4d2d;
    cursor: pointer;
}

.link:hover {
    text-decoration: underline;
}

.btn-primary {
    width: 100%;
    border-radius: 8px;
    background-color: #ee4d2d;
    border: none;
}

.btn-primary:hover {
    background-color: #d8431f;
}

.text-error {
    color: red;
}

.footer {
    font-size: 12px;
    color: #999;
}
`}
</style>
        </div>
    );
}

export default Login;