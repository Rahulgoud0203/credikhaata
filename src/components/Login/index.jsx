import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = isSignUp ? signup(email, password, name) : login(email, password);
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => navigate('/'), 500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-logo">CrediKhaata</h1>
          <p className="login-subtitle">Your Digital Credit Ledger</p>
        </div>

        <div className="login-card">
          <div className="login-tabs">
            <button
              className={`login-tab ${!isSignUp ? 'active' : ''}`}
              onClick={() => { setIsSignUp(false); setError(''); setSuccess(''); }}
            >
              Sign In
            </button>
            <button
              className={`login-tab ${isSignUp ? 'active' : ''}`}
              onClick={() => { setIsSignUp(true); setError(''); setSuccess(''); }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-input-royal"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input-royal"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input-royal"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">{success}</div>}

            <button type="submit" className="btn-primary-royal w-full mt-2">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="login-footer">
          Simple credit tracking for smart shopkeepers
        </p>
      </div>
    </div>
  );
};

export default Login;
