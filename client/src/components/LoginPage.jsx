import React, { useState } from 'react';

export function LoginPage({ onSubmit }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onSubmit(mode === 'login'
        ? { username, password }
        : { username, email, password, name }, mode);
    } catch (err) {
      setError(err.message || 'Please check your details and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-art" aria-label="Buzzaxi city illustration">
        <div className="map-dots" />
        <div className="auth-brand"><span className="auth-brand-mark">B</span><span>BUZZAXI</span></div>
        <div className="auth-art-copy">
          <span className="eyebrow">YOUR CITY, IN MOTION</span>
          <h1>Every journey<br />starts somewhere.</h1>
          <p>Find your route. Choose your ride. Get there together.</p>
        </div>
        <div className="auth-route-art"><span>ANDHERI</span><i /><b>✦</b><i /><span>BANDRA</span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand">BUZZAXI <span>• MUMBAI</span></div>
          <span className="eyebrow">WELCOME TO BUZZAXI</span>
          <h2>{mode === 'login' ? 'Sign in to continue' : 'Create your account'}</h2>
          <p className="auth-intro">{mode === 'login' ? 'Your next ride is just a few steps away.' : 'Join us and plan your next city ride.'}</p>
          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Sign in</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>Create account</button>
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={submit}>
            {mode === 'register' && <label>Full name<input autoComplete="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" /></label>}
            <label>Username<input autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required minLength={3} placeholder="At least 3 characters" /></label>
            {mode === 'register' && <label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" /></label>}
            <label>Password<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" /></label>
            <button className="auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <span>→</span></button>
          </form>
          <p className="auth-footnote">{mode === 'login' ? 'New to Buzzaxi? ' : 'Already have an account? '}<button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p>
          <p className="auth-security">Your password is encrypted before it is saved.</p>
        </div>
      </section>
    </main>
  );
}
