import React, { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState(``);
    const [password, setPassword] = useState(``);
    const [error, setError] = useState(``);

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
            // Handle successful login
            const { jwt } = data;
            if (jwt) {
                // Save token to localStorage
                localStorage.setItem('token', jwt);
                setError('Login successful!');
                
                // Redirect after 1 second
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            }
        })
        .catch((error) => {
            // Handle login error
            console.error('Login error: ', error);
            setError('Login failed. Please check your username and password.');
        });
    };

    return (
        <div className="container">
            <div className="form-signin" style={{ maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
                <h1 className="h3 mb-3 fw-normal text-center">Sign In</h1>
                
                <div className="form-floating">
                    <input 
                        type="text" 
                        className="form-control mb-2" 
                        id="floatingInput" 
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Username</label>
                </div>

                <div className="form-floating">
                    <input 
                        type="password" 
                        className="form-control mb-2" 
                        id="floatingPassword" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="form-check text-start my-3">
                    <input className="form-check-input" type="checkbox" value="remember-me" id="checkDefault" />
                    <label className="form-check-label" htmlFor="checkDefault">
                        Remember me
                    </label> 
                </div>

                <button 
                    className="btn btn-primary w-100 py-2" 
                    type="submit"
                    onClick={handleLogin}
                >
                    Sign in
                </button>

                {error && (
                    <div className={`mt-3 text-center ${error.includes('successful') ? 'text-success' : 'text-danger'}`}>
                        {error}
                    </div>
                )}
                
                <p className="mt-5 mb-3 text-body-secondary text-center">© 2026 ElaBan Furniture</p>
            </div>
        </div>
    );
}

export default Login;