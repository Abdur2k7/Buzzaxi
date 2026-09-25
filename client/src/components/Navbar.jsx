import React from 'react';

const initialsFrom = (user) => {
  const source = (user?.name || user?.username || 'U').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const Navbar = ({ user, onOpenAuth, onLogout, onOpenHistory, onOpenProfile, onHome, dbStatus }) => {
  return (
    <header className="navbar">
      <button type="button" className="brand-wrapper" onClick={onHome} aria-label="Go to Buzzaxi home">
        <img 
          src="/images/buzzaxi-logo.jpg" 
          alt="Buzzaxi" 
          className="brand-logo-img"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div>
          <div className="brand-title">Buzzaxi</div>
          <div className="brand-subtitle">Mumbai Shared Cabs</div>
        </div>
      </button>

      <div className="nav-actions">
        {dbStatus && (
          <div className="status-badge">
            <span className="status-dot"></span>
            <span>{dbStatus.isConnected ? 'MongoDB Connected' : 'Local In-Memory'}</span>
          </div>
        )}

        <button 
          className="btn-flat"
          onClick={onOpenHistory}
          disabled={!user}
        >
          Ride History
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" className="nav-profile-btn" onClick={onOpenProfile}>
              {user.profilePic ? (
                <img src={user.profilePic} alt="" className="nav-avatar" />
              ) : (
                <span className="nav-avatar nav-avatar-fallback">{initialsFrom(user)}</span>
              )}
              <span>{user.name || user.username}</span>
            </button>
            <button className="btn-flat" onClick={onLogout} style={{ padding: '6px 12px' }}>
              Log out
            </button>
          </div>
        ) : (
          <button className="btn-flat btn-primary" onClick={onOpenAuth}>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};
