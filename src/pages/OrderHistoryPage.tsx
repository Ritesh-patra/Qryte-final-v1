import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Order } from '../services/api';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filterTable, setFilterTable] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const history = await api.getOrderHistory();
      setOrders(history);
      setFilteredOrders(history);
      setLoading(false);
    };
    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (filterTable) {
      filtered = filtered.filter(o => o.tableNumber.toString() === filterTable);
    }

    if (filterStatus) {
      filtered = filtered.filter(o => o.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (filterDate) {
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.timestamp).toISOString().split('T')[0];
        return orderDate === filterDate;
      });
    }

    setFilteredOrders(filtered);
  }, [filterTable, filterStatus, filterDate, orders]);

  const handlePrint = (order: Order) => {
    const printContent = `
      <html>
        <head><title>Order #${order.id}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Order #${order.id}</h2>
          <p><strong>Table:</strong> ${order.tableNumber}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Time:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
          <h3>Items:</h3>
          <ul>
            ${order.items.map(item => `<li>${item.name} x${item.qty} - ₹${(item.price * item.qty).toLocaleString('en-IN')}</li>`).join('')}
          </ul>
          <hr />
          <h3>Total: ₹${order.items.reduce((sum, item) => sum + item.price * item.qty, 0).toLocaleString('en-IN')}</h3>
        </body>
      </html>
    `;
    const win = window.open('', '', 'width=800,height=600');
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.print();
    }
  };

  const handleDownload = () => {
    const csv = [
      ['Order ID', 'Table', 'Items', 'Total', 'Status', 'Date/Time'],
      ...filteredOrders.map(o => [
        o.id,
        o.tableNumber,
        o.items.map(i => `${i.name}(${i.qty})`).join(', '),
        (o.items.reduce((sum, item) => sum + item.price * item.qty, 0)).toLocaleString('en-IN'),
        o.status,
        new Date(o.timestamp).toLocaleString(),
      ]),
    ].map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>📜 Order History</h1>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Table Number:</label>
            <input
              type="number"
              placeholder="Filter by table"
              value={filterTable}
              onChange={e => setFilterTable(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status:</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              setFilterTable('');
              setFilterStatus('');
              setFilterDate('');
            }}
            style={{
              padding: '10px 15px',
              backgroundColor: '#999',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
          <button
            onClick={handleDownload}
            style={{
              padding: '10px 15px',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            📥 Download CSV
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', fontSize: '18px' }}>No orders found</p>
      ) : (
        <div>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
          </p>
          <div style={{ display: 'grid', gap: '15px' }}>
            {filteredOrders.map(order => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#fff',
                  padding: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '10px' }}>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>ORDER ID</span>
                    <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>#{order.id}</p>
                  </div>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>TABLE</span>
                    <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>Table {order.tableNumber}</p>
                  </div>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>STATUS</span>
                    <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold', color: '#4caf50' }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>DATE & TIME</span>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>{new Date(order.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '10px', padding: '10px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                  <h4 style={{ margin: '5px 0', color: '#666' }}>Items:</h4>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {order.items.map(item => (
                      <li key={item.id} style={{ margin: '3px 0' }}>
                        {item.name} x{item.qty} = <strong>₹{(item.price * item.qty).toLocaleString('en-IN')}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>TOTAL</span>
                    <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>
                      ₹{order.items.reduce((sum, item) => sum + item.price * item.qty, 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handlePrint(order)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#2196F3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      🖨️ Print
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
