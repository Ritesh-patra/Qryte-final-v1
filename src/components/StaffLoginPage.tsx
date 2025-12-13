import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validUsers: Record<string, string> = {
    waiter1: 'waiter',
    chef1: 'kitchen',
    desk1: 'admin'
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!username || !password) {
      setError('❌ Please enter username and password');
      setLoading(false);
      return;
    }

    if (password !== '1234') {
      setError('❌ Invalid password (hint: try 1234)');
      setLoading(false);
      return;
    }

    if (!validUsers[username]) {
      setError('❌ Invalid username (valid: waiter1, chef1, desk1)');
      setLoading(false);
      return;
    }

    // Valid login
    const role = validUsers[username];
    localStorage.setItem('role', role);
    localStorage.setItem('staffUser', username);

    // Redirect based on role
    setLoading(false);
    if (role === 'waiter') {
      navigate('/waiter');
    } else if (role === 'kitchen') {
      navigate('/kitchen');
    } else if (role === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f1faf3'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#4caf50' }}>🔐 Staff Login</h1>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Welcome to QRyte</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '5px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #ef5350'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Username
            </label>
            <input
              type="text"
              placeholder="waiter1 / chef1 / desk1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d0e7cd',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'Arial, sans-serif'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d0e7cd',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'Arial, sans-serif'
              }}
            />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>Hint: 1234</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: '15px'
            }}
          >
            {loading ? '⏳ Logging in...' : '✅ Login'}
          </button>

          <div style={{
            backgroundColor: '#e8f5e9',
            padding: '15px',
            borderRadius: '5px',
            fontSize: '12px',
            color: '#2e7d32'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '8px' }}>Demo Credentials:</p>
            <p style={{ margin: '5px 0' }}>👨‍🍳 chef1 → Kitchen</p>
            <p style={{ margin: '5px 0' }}>👔 waiter1 → Waiter Orders</p>
            <p style={{ margin: '5px 0' }}>💼 desk1 → Admin</p>
            <p style={{ margin: '8px 0 0 0', fontWeight: 'bold' }}>Password: 1234</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffLoginPage;
