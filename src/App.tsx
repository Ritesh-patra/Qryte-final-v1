import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CustomerMenuPage from './components/CustomerMenuPage';
import StaffLoginPage from './components/StaffLoginPage';
import WaiterOrderPage from './components/WaiterOrderPage';
import KitchenDisplayPage from './components/KitchenDisplayPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import { DemoLoginPage } from './pages/DemoLoginPage';
import { StaffOpsLanding } from './pages/StaffOpsLanding';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { EmployeeManagementPage } from './pages/EmployeeManagementPage';
import { InventoryManagementPage } from './pages/InventoryManagementPage';

// Home Page Component - Modern Landing Page
const HomePage: React.FC = () => {
  const modules = [
    {
      category: 'Customer Facing',
      routes: [
        { path: '/customer', name: '📱 Customer Menu', description: 'Browse menu, add items to cart with floating button, apply coupons, share on WhatsApp' },
      ]
    },
    {
      category: 'Staff & Operations',
      routes: [
        { path: '/demo-login', name: '🔐 Demo Login', description: 'Login with hotel1/1234 credentials' },
        { path: '/staff-ops', name: '👨‍💼 Staff Operations', description: '4-tab dashboard: Generate Bill, Table Mgmt, Room Mgmt, Order Mgmt' },
        { path: '/staff-login', name: '🔑 Staff Login', description: 'Employee login portal' },
        { path: '/waiter', name: '🚶 Waiter Orders', description: 'Take orders from tables' },
      ]
    },
    {
      category: 'Kitchen & Display',
      routes: [
        { path: '/kitchen', name: '👨‍🍳 Kitchen Display', description: 'Real-time order display for kitchen' },
      ]
    },
    {
      category: 'Admin Dashboard',
      routes: [
        { path: '/admin', name: '💼 Admin Dashboard', description: 'Manage: Menu, Tables, Rooms, Highlights, Orders' },
        { path: '/order-history', name: '📜 Order History', description: 'View all orders with filters, print, download CSV' },
        { path: '/employees', name: '👥 Employee Management', description: 'Add/edit/delete employees, track salary & leaves' },
        { path: '/inventory', name: '📦 Inventory Management', description: 'Track items, auto-deduct on orders' },
      ]
    }
  ];

  return (
    <div style={{ 
      padding: '0',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.2)',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center',
        borderBottom: '3px solid #4caf50'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '48px', fontWeight: 'bold' }}>🏨 QRyte</h1>
        <p style={{ margin: '0', fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>Hotel Management & Ordering System</p>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Info Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '32px', margin: '0 0 10px 0' }}>10</p>
            <p style={{ margin: '0', color: '#666', fontWeight: 'bold' }}>Routes</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '32px', margin: '0 0 10px 0' }}>5</p>
            <p style={{ margin: '0', color: '#666', fontWeight: 'bold' }}>Modules</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '32px', margin: '0 0 10px 0' }}>✅</p>
            <p style={{ margin: '0', color: '#666', fontWeight: 'bold' }}>Full Integration</p>
          </div>
        </div>

        {/* All Routes */}
        {modules.map((module, idx) => (
          <div key={idx} style={{ marginBottom: '40px' }}>
            <h2 style={{
              color: 'white',
              marginBottom: '20px',
              borderBottom: '3px solid #4caf50',
              paddingBottom: '10px',
              fontSize: '24px'
            }}>
              {module.category}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {module.routes.map((route, i) => (
                <Link
                  key={i}
                  to={route.path}
                  style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    textDecoration: 'none',
                    color: '#333',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                    e.currentTarget.style.borderColor = '#4caf50';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <h3 style={{ margin: '0 0 10px 0', color: '#4caf50', fontSize: '18px', fontWeight: 'bold' }}>
                    {route.name}
                  </h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                    {route.description}
                  </p>
                  <div style={{ marginTop: '15px', color: '#4caf50', fontWeight: 'bold', fontSize: '12px' }}>
                    OPEN →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Access Demo */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          marginTop: '40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>🚀 Quick Demo Access</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>Use these credentials for testing:</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>Demo Login</p>
              <p style={{ margin: '0', fontWeight: 'bold', fontSize: '16px', color: '#4caf50' }}>hotel1 / 1234</p>
            </div>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>Table Number</p>
              <p style={{ margin: '0', fontWeight: 'bold', fontSize: '16px', color: '#4caf50' }}>#1 - #6</p>
            </div>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>Coupon Code</p>
              <p style={{ margin: '0', fontWeight: 'bold', fontSize: '16px', color: '#4caf50' }}>SAVE10</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          marginTop: '40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333', textAlign: 'center' }}>✨ Key Features</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {[
              '🛒 Floating Cart Button with item count badge',
              '⭐ Today\'s Highlights & Top Deals in menu',
              '💬 WhatsApp order sharing',
              '📊 Real-time inventory auto-deduction',
              '🛏️ Room management with guest tracking',
              '👥 Employee management with salary & leaves',
              '📜 Order history with filters & CSV export',
              '💳 Coupon codes support'
            ].map((feature, i) => (
              <div key={i} style={{
                padding: '15px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                borderLeft: '4px solid #4caf50',
                color: '#333'
              }}>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          color: 'white'
        }}>
          <p style={{ margin: '0' }}>QRyte v2.0 - Fully Integrated Hotel Management System</p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.8 }}>Built with React, TypeScript & Vite</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<HomePage />} />

      {/* New Pages */}
      <Route path="/customer" element={<CustomerMenuPage />} />
      <Route path="/staff-login" element={<StaffLoginPage />} />
      <Route path="/waiter" element={<WaiterOrderPage />} />
      <Route path="/kitchen" element={<KitchenDisplayPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />

      {/* New Routes - Phase 2 */}
      <Route path="/demo-login" element={<DemoLoginPage />} />
      <Route path="/staff-ops" element={<StaffOpsLanding />} />

      {/* New Routes - Phase 3 */}
      <Route path="/order-history" element={<OrderHistoryPage />} />
      <Route path="/employees" element={<EmployeeManagementPage />} />
      <Route path="/inventory" element={<InventoryManagementPage />} />
    </Routes>
  );
};

export default App;


