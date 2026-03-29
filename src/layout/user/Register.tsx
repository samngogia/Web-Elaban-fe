import React, { useState } from "react";

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

    // Error message states
    const [errorUsername, setErrorUsername] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
    const [notification, setNotification] = useState("");

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
                    setNotification("Registration successful! Please check your email to activate your account.");
                } else {
                    setNotification("An error occurred during registration.");
                }
            } catch (error) {
                setNotification("An error occurred during registration.");
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
                setErrorUsername("Username already exists!");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error checking username: ", error);
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
                setErrorEmail("Email already exists!");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error checking email: ", error);
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
            setErrorPassword("Password must be at least 8 characters and include at least 1 special character (!@#$%^&*)");
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
            setErrorConfirmPassword("Passwords do not match");
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
        <div className="container">
            <h1 className="mt-5 text-center">Register</h1>
            <div className="mb-3 col-md-6 col-12 mx-auto">
                <form onSubmit={handleSubmit} className="form">
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
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
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <div style={{ color: "red" }}>{errorPassword}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        <div style={{ color: "red" }}>{errorConfirmPassword}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            className="form-control"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">Gender</label>
                        <select
                            className="form-control"
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
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
                        <button type="submit" className="btn btn-primary">Register</button>
                        <div style={{ color: "green" }} className="mt-2">{notification}</div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;