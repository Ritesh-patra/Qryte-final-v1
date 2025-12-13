import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const navigationItems = [
    { label: '📱 Customer Menu', path: '/customer?table=7', color: '#4caf50' },
    { label: '🔐 Staff Login', path: '/staff-login', color: '#2196F3' },
    { label: '👔 Waiter Orders', path: '/waiter', color: '#FF9800' },
    { label: '👨‍🍳 Kitchen', path: '/kitchen', color: '#f44336' },
    { label: '💼 Admin', path: '/admin', color: '#9C27B0' },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      {/* Left side */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <h2 style={{ margin: 0 }}>Hotel Name</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>USER : FRONT DESK 1</p>
        <button style={{
          width: '120px',
          padding: '5px 10px',
          border: '1px solid #4caf50',
          borderRadius: '5px',
          background: 'white',
          cursor: 'pointer'
        }}>
          ☰ Menu
        </button>
      </div>

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        flex: 1,
        minWidth: '500px'
      }}>
        {navigationItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: '8px 16px',
              backgroundColor: item.color,
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px',
              whiteSpace: 'nowrap'
            }}
            title={item.label}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div style={{ textAlign: 'right', fontSize: '14px', color: '#555' }}>
        <p style={{ margin: 0 }}>{new Date().toLocaleDateString()}</p>
        <p style={{ margin: 0 }}>{new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default Header;


