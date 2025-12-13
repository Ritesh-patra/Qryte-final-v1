/**
 * DemoLoginPage
 * =============
 * Staff login page with demo credentials (hotel1/1234).
 * Sets auth state in localStorage and redirects to /staff-ops.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DemoLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('hotel1');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Demo validation: hotel1/1234
      if (username === 'hotel1' && password === '1234') {
        // Save auth state
        localStorage.setItem(
          'qryte_auth',
          JSON.stringify({
            username: 'hotel1',
            role: 'desk',
            loginTime: new Date().toISOString(),
          })
        );

        // Redirect to staff ops
        navigate('/staff-ops');
      } else {
        setError('Invalid credentials. Use hotel1 / 1234 for demo.');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '40px 32px',
          maxWidth: '400px',
          width: '100%',
          margin: '20px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
            🏨 QRyte
          </h1>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Hotel Management System
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              htmlFor="username"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '6px',
              }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username for staff login"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
                backgroundColor: '#f9f9f9',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'text',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password for staff login"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
                backgroundColor: '#f9f9f9',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'text',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '10px 12px',
                backgroundColor: '#ffebee',
                color: '#c62828',
                fontSize: '13px',
                borderRadius: '4px',
                border: '1px solid #ef9a9a',
              }}
              role="alert"
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-label="Login to staff operations dashboard"
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => {
              if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = '#45a049';
            }}
            onMouseOut={(e) => {
              if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = '#4caf50';
            }}
          >
            {loading ? '🔄 Logging in...' : '✓ Login'}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            padding: '12px',
            backgroundColor: '#e8f5e9',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#2e7d32',
            textAlign: 'center',
            border: '1px solid #c8e6c9',
          }}
        >
          <strong>Demo Credentials:</strong>
          <br />
          Username: <code style={{ fontWeight: 'bold' }}>hotel1</code>
          <br />
          Password: <code style={{ fontWeight: 'bold' }}>1234</code>
        </div>

        <p style={{ marginTop: '20px', fontSize: '11px', color: '#999', textAlign: 'center' }}>
          Demo account access to Staff Operations Dashboard
        </p>
      </div>
    </div>
  );
};
