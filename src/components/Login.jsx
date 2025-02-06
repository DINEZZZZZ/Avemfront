import { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.post('https://avem-production.up.railway.app/auth/login', {
        username: 'admin',
        password: password,
      });

      if (response.status === 200) {
        setErrorMessage('');
        navigate('/serial');
      } else {
        setErrorMessage('Login failed');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Incorrect credentials');
      } else {
        setErrorMessage('An error occurred, please try again');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input type="text" value="admin" readOnly />
          </div>
          
          <div className="input-container password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {loading && <div className="loading-spinner"></div>} {/* Loading Indicator */}
          {errorMessage && <div className="error">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
