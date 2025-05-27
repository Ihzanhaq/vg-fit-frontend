import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import "../Styles/LoginPage.css"; // Add a custom CSS for styling

const LoginPage = () => {
  const { login,isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      username === process.env.REACT_APP_USERNAME &&
      password === process.env.REACT_APP_PASSWORD
    ) {
      login();
      navigate("/staff/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/staff/dashboard");
    }
  }, [isAuthenticated,navigate]);
  

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Staff Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
