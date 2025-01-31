import React from 'react';
import '../components/stylesheet/Login.css';

const Login = () => {
  const handleGoogleLogin = () => {
    // Add your Google login logic here
  };

  return (
    <div className="login">
        <div className="container">
            <div className="content">
              <div className="hero-text">
                <h1>ResQ-X</h1>
                <p className="tagline">Emergency Assistance Platform</p>
              </div>
              <div className="auth-section">
                <button 
                  className="google-login-button"
                  onClick={handleGoogleLogin}
                >
                  <span className="google-icon"></span>
                  Continue with Google
                </button>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Login;