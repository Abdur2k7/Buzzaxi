import React, { useState } from 'react';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess, required = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await onLoginSuccess({ username, password }, 'login');
      } else {
        await onLoginSuccess({ username, email, password, name }, 'register');
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '18px' }}>
              {isLogin ? 'Sign in' : 'Create account'}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              {required ? 'Sign in to book a ride.' : 'Access your rides and profile.'}
            </p>
          </div>
          {!required && (
            <button type="button" className="close-btn" onClick={onClose}>&times;</button>
          )}
        </div>

        <div className="auth-toggle">
          <button 
            type="button" 
            className={`cat-btn ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Login
          </button>
          <button 
            type="button" 
            className={`cat-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Register
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full name</label>
              <input
                type="text"
                className="text-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Username</label>
            <input
              type="text"
              className="text-input"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="text-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="text-input"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn-flat btn-primary"
            disabled={loading}
            style={{ justifyContent: 'center' }}
          >
            {loading ? 'Please wait…' : (isLogin ? 'Sign in' : 'Create account')}
          </button>
        </form>
      </div>
    </div>
  );
};
