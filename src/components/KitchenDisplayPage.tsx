import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

interface OrderItem {
  id: number;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: number;
  tableNumber: number;
  items: OrderItem[];
  status: string;
  timestamp: Date;
}

const KitchenDisplayPage: React.FC = () => {
  const { logout } = useAuth('kitchen');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getKitchenOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Poll every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartPreparing = async (orderId: number) => {
    try {
      await api.updateOrderStatus(orderId, 'preparing');
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: 'preparing' } : order
      ));
      alert('✅ Status updated to Preparing');
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      alert('❌ Error updating status: ' + errorMsg);
    }
  };

  const handleReady = async (orderId: number) => {
    try {
      await api.updateOrderStatus(orderId, 'ready');
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: 'ready' } : order
      ));
      alert('✅ Status updated to Ready');
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      alert('❌ Error updating status: ' + errorMsg);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'preparing':
        return '#2196F3';
      case 'ready':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'preparing':
        return '👨‍🍳';
      case 'ready':
        return '✅';
      default:
        return '❓';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #4caf50',
        paddingBottom: '15px'
      }}>
        <div>
          <h1 style={{ margin: 0 }}>👨‍🍳 Kitchen Display System</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Live order status</p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🚪 Logout
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
          ⏳ Loading orders...
        </div>
      ) : (
        <div>
          {orders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              backgroundColor: '#f1faf3',
              borderRadius: '8px',
              color: '#4caf50',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              ✨ No pending orders
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {orders.map(order => (
                <div
                  key={order.id}
                  style={{
                    border: `3px solid ${getStatusColor(order.status)}`,
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  {/* Order Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px',
                    paddingBottom: '10px',
                    borderBottom: '2px solid #e0e0e0'
                  }}>
                    <div>
                      <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', color: '#333' }}>
                        🪑 Table {order.tableNumber}
                      </h2>
                      <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                        Order #{order.id}
                      </p>
                    </div>
                    <div style={{
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: '14px'
                    }}>
                      {getStatusIcon(order.status)} {order.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      📦 Items
                    </h3>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '8px',
                        marginBottom: '8px',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>
                          {item.name}
                        </span>
                        <span style={{
                          backgroundColor: '#e8f5e9',
                          color: '#2e7d32',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {item.qty}x
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Time Stamp */}
                  <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '8px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    🕐 {new Date(order.timestamp).toLocaleTimeString()}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStartPreparing(order.id)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}
                      >
                        👨‍🍳 Start Preparing
                      </button>
                    )}

                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <button
                        onClick={() => handleReady(order.id)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}
                      >
                        ✅ Mark Ready
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <div style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        borderRadius: '5px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}>
                        ✨ Ready for Pickup
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KitchenDisplayPage;
