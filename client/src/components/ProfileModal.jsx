import React, { useEffect, useState } from 'react';

const initialsFrom = (user) => {
  const source = (user?.name || user?.username || 'U').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const ProfileModal = ({ isOpen, user, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;
    setName(user.name || '');
    setPhone(user.phone || '');
    setProfilePic(user.profilePic || '');
    setError('');
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 250 * 1024) {
      setError('Use a photo smaller than 250 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(String(reader.result || ''));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ name, phone, profilePic });
      onClose();
    } catch (err) {
      setError(err.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2 style={{ fontSize: '18px' }}>Profile</h2>
          <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="profile-avatar-row">
          {profilePic ? (
            <img src={profilePic} alt="" className="profile-avatar" />
          ) : (
            <div className="profile-avatar profile-avatar-fallback">{initialsFrom({ name, username: user.username })}</div>
          )}
          <div>
            <div style={{ fontWeight: 700 }}>{user.username}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{user.email}</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: 4 }}>
              {user.rideCount ?? 0} rides
            </div>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="profile-name">Name</label>
            <input
              id="profile-name"
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="profile-phone">Phone</label>
            <input
              id="profile-phone"
              className="text-input"
              type="tel"
              placeholder="Optional"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="profile-photo">Photo</label>
            <input id="profile-photo" type="file" accept="image/*" onChange={handlePhoto} />
            {profilePic && (
              <button
                type="button"
                className="btn-flat"
                style={{ marginTop: 8 }}
                onClick={() => setProfilePic('')}
              >
                Remove photo
              </button>
            )}
          </div>

          <button type="submit" className="btn-flat btn-primary" disabled={saving} style={{ justifyContent: 'center' }}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      </div>
    </div>
  );
};
