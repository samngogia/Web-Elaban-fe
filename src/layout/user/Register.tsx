import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("M");
    const [avatar, setAvatar] = useState<File | null>(null);
    const navigate = useNavigate();
    // Error message states
    const [errorUsername, setErrorUsername] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
    const [notification, setNotification] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Convert file to Base64
    const getBase64 = (file: File): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result ? (reader.result as string).split(',')[1] : null);
            reader.onerror = (error) => reject(error);
        });
    };

    // Handle submit logic
    const handleSubmit = async (e: React.FormEvent) => {
        // Clear any previous error messages
        setErrorPassword('');
        setErrorConfirmPassword('');
        setErrorUsername('');
        setErrorEmail('');

        e.preventDefault();

        // Validate conditions and store results
        const isUsernameValid = !await checkUsernameExists(username);
        const isEmailValid = !await checkEmailExists(email);
        const isPasswordValid = !checkPasswordStrength(password);
        const isConfirmPasswordValid = !checkConfirmPassword(confirmPassword);

        // Check all conditions
        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            const base64Avatar = avatar ? await getBase64(avatar) : null;

            try {
                const url = `http://localhost:8089/account/register`;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        gender: gender,
                        phoneNumber: phoneNumber,
                        isEnabled: false,
                        activationCode: "",
                        avatar: base64Avatar
                    })
                });

                if (response.ok) {
                    navigate(`/activate?email=${encodeURIComponent(email)}`);
                } else {
                    setNotification("Đã xảy ra lỗi trong quá trình đăng ký.");
                }
            } catch (error) {
                setNotification("Đã xảy ra lỗi trong quá trình đăng ký.");
            }
        }
    }

    // Check Username Exists
    const checkUsernameExists = async (username: string) => {
        const url = `http://localhost:8089/users/search/existsByUsername?username=${username}`;
        try {
            const response = await fetch(url);
            const data = await response.text();
            if (data === "true") {
                setErrorUsername("Tên người dùng đã tồn tại!");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi khi kiểm tra tên người dùng: ", error);
            return false;
        }
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setErrorUsername('');
        return checkUsernameExists(e.target.value);
    }

    // Check Email Exists
    const checkEmailExists = async (email: string) => {
        const url = `http://localhost:8089/users/search/existsByEmail?email=${email}`;
        try {
            const response = await fetch(url);
            const data = await response.text();
            if (data === "true") {
                setErrorEmail("Email đã tồn tại rồi!");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi khi kiểm tra email: ", error);
            return false;
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrorEmail('');
        return checkEmailExists(e.target.value);
    }

    // Check Password Strength
    const checkPasswordStrength = (password: string) => {
        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorPassword("Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất 1 ký tự đặc biệt (!@#$%^&*)");
            return true;
        } else {
            setErrorPassword("");
            return false;
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setErrorPassword('');
        return checkPasswordStrength(e.target.value);
    }

    // Check Confirm Password
    const checkConfirmPassword = (confirmPass: string) => {
        if (confirmPass !== password) {
            setErrorConfirmPassword("Mật khẩu không khớp");
            return true;
        } else {
            setErrorConfirmPassword("");
            return false;
        }
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setErrorConfirmPassword('');
        return checkConfirmPassword(e.target.value);
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setAvatar(file);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-card">
                <h2 className="text-center mb-4">Đăng ký tài khoản</h2>

                <form onSubmit={handleSubmit} className="form">
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <div style={{ color: "red" }}>{errorUsername}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="text"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <div style={{ color: "red" }}>{errorEmail}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mật Khẩu</label>
                        {/* Đảm bảo password-wrapper có CSS position: relative */}
                        <div className="password-wrapper" style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="form-control" // Đã xóa dấu cách thừa
                                value={password}
                                onChange={handlePasswordChange}
                                autoComplete="new-password" // Thêm để kiểm soát gợi ý mật khẩu
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    zIndex: 10 // Thêm z-index để icon luôn nằm trên input
                                }}
                            >
                                {showPassword ? "👁️‍🗨️" : "👁️"}
                            </span>
                        </div>
                        <div className="text-error" style={{ color: 'red', fontSize: '0.875rem' }}>{errorPassword}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="form-control"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer"

                                }}
                            >
                                {showPassword ? "👁️‍🗨️" : "👁️"}
                            </span>
                        </div>
                        <div className="text-error">{errorConfirmPassword}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">Tên</label>
                        <input
                            type="text"
                            id="firstName"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Họ</label>
                        <input
                            type="text"
                            id="lastName"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            className="form-control"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">Giới tính</label>
                        <select
                            className="form-control"
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="M">Nam</option>
                            <option value="F">Nữ</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="avatar" className="form-label">Avatar</label>
                        <input
                            type="file"
                            id="avatar"
                            className="form-control"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Đăng ký</button>
                        <div style={{ color: "green" }} className="mt-2">{notification}</div>
                    </div>
                    <div className="text-center mt-3">
                        <span style={{ fontSize: 14 }}>
                            Đã có tài khoản?{" "}
                            <span
                                className="link strong"
                                onClick={() => navigate("/login")}
                                style={{ color: "#ee4d2d", cursor: "pointer", fontWeight: 600 }}
                            >
                                Đăng nhập
                            </span>
                        </span>
                    </div>
                </form>
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

/* input đẹp hơn */
.form-control {
    border-radius: 8px !important;
    padding: 10px 12px;
    font-size: 14px;
    transition: all 0.2s ease;
}

/* focus kiểu Shopee */
.form-control:focus {
    border-color: #ee4d2d !important;
    box-shadow: 0 0 0 2px rgba(238,77,45,0.15) !important;
}

/* label đẹp hơn */
.form-label {
    font-weight: 500;
    font-size: 14px;
}

/* icon mắt */
.password-wrapper {
    position: relative;
}

.password-wrapper span {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #888;
}

/* button */
.btn-primary {
    width: 100%;
    border-radius: 8px;
    background-color: #ee4d2d;
    border: none;
    padding: 10px;
    font-weight: 600;
    transition: 0.2s;
}

.btn-primary:hover {
    background-color: #d8431f;
}

/* error */
.text-error {
    color: red;
    font-size: 13px;
}

/* success */
.text-success {
    color: green;
    font-size: 14px;
}
`}
            </style>
        </div>
    );
}

export default Register;