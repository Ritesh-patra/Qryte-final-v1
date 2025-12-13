import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api, getRooms as getInitialRooms } from '../services/api';
import type { Room } from '../services/api';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
}

interface Table {
  id: number;
  tableNumber: number;
  capacity: number;
  status: string;
}

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

interface NewMenuItemForm {
  name: string;
  category: string;
  price: string;
  description: string;
}

interface NewTableForm {
  tableNumber: string;
  capacity: number;
}

const AdminDashboardPage: React.FC = () => {
  const { logout } = useAuth('admin');

  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Biryani', category: 'Mains', price: 250, description: 'Fragrant rice dish' },
    { id: 2, name: 'Butter Chicken', category: 'Mains', price: 320, description: 'Creamy chicken curry' },
    { id: 3, name: 'Dal Makhani', category: 'Mains', price: 180, description: 'Creamy lentil curry' },
  ]);
  const [tables, setTables] = useState<Table[]>([
    { id: 1, tableNumber: 1, capacity: 2, status: 'available' },
    { id: 2, tableNumber: 2, capacity: 4, status: 'occupied' },
    { id: 3, tableNumber: 3, capacity: 6, status: 'available' },
  ]);
  const [rooms, setRooms] = useState<Room[]>(getInitialRooms());
  const [orders, setOrders] = useState<Order[]>([]);
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null);
  const [topDealItem, setTopDealItem] = useState<number | null>(null);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [roomFormData, setRoomFormData] = useState({ guestName: '', checkInDate: '', checkOutDate: '' });

  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showTableForm, setShowTableForm] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState<NewMenuItemForm>({ name: '', category: 'Mains', price: '', description: '' });
  const [newTable, setNewTable] = useState<NewTableForm>({ tableNumber: '', capacity: 2 });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  // Menu Management
  const handleAddMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.price) {
      alert('❌ Please fill all fields');
      return;
    }

    try {
      const item: MenuItem = {
        id: Date.now(),
        name: newMenuItem.name,
        category: newMenuItem.category,
        price: parseInt(newMenuItem.price),
        description: newMenuItem.description
      };
      await api.addMenuItem(item);
      setMenuItems([...menuItems, item]);
      setNewMenuItem({ name: '', category: 'Mains', price: '', description: '' });
      setShowMenuForm(false);
      alert('✅ Menu item added');
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      alert('❌ Error: ' + errorMsg);
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    try {
      await api.deleteMenuItem(id);
      setMenuItems(menuItems.filter(item => item.id !== id));
      alert('✅ Menu item deleted');
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      alert('❌ Error: ' + errorMsg);
    }
  };

  // Table Management
  const handleAddTable = async () => {
    if (!newTable.tableNumber) {
      alert('❌ Please enter table number');
      return;
    }

    try {
      const table: Table = {
        id: Date.now(),
        tableNumber: parseInt(newTable.tableNumber),
        capacity: parseInt(newTable.capacity.toString()),
        status: 'available'
      };
      await api.addTable(table);
      setTables([...tables, table]);
      setNewTable({ tableNumber: '', capacity: 2 });
      setShowTableForm(false);
      alert('✅ Table added');
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      alert('❌ Error: ' + errorMsg);
    }
  };

  // Room Management
  const handleCheckOutGuest = async (roomId: number) => {
    await api.checkOutGuest(roomId);
    setRooms(getInitialRooms());
    alert('✅ Guest checked out');
  };

  // Today's Highlights
  const handleSetHighlight = async () => {
    if (!highlightedItem || !topDealItem) {
      alert('❌ Please select both highlight and top deal items');
      return;
    }
    await api.setTodaysHighlight(highlightedItem, topDealItem);
    alert('✅ Highlights set successfully');
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
          <h1 style={{ margin: 0 }}>💼 Admin Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Manage menu, tables, rooms & orders</p>
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

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: '2px solid #d0e7cd',
        flexWrap: 'wrap'
      }}>
        {['menu', 'tables', 'rooms', 'highlights', 'orders'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px',
              backgroundColor: activeTab === tab ? '#4caf50' : 'transparent',
              color: activeTab === tab ? 'white' : '#333',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              fontSize: '14px',
              borderBottom: activeTab === tab ? '3px solid #4caf50' : 'none'
            }}
          >
            {tab === 'menu' && '📋 Menu Management'}
            {tab === 'tables' && '🪑 Table Management'}
            {tab === 'rooms' && '🛏️ Room Management'}
            {tab === 'highlights' && '⭐ Today\'s Highlight'}
            {tab === 'orders' && '📜 Order History'}
          </button>
        ))}
      </div>

      {/* Menu Management Tab */}
      {activeTab === 'menu' && (
        <div>
          <button
            onClick={() => setShowMenuForm(!showMenuForm)}
            style={{
              marginBottom: '20px',
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ➕ Add New Item
          </button>

          {showMenuForm && (
            <div style={{
              backgroundColor: '#f1faf3',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Add Menu Item</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Item name"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  style={{
                    padding: '10px',
                    border: '1px solid #d0e7cd',
                    borderRadius: '5px',
                    fontFamily: 'Arial, sans-serif'
                  }}
                />
                <select
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                  style={{
                    padding: '10px',
                    border: '1px solid #d0e7cd',
                    borderRadius: '5px',
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  <option>Mains</option>
                  <option>Breads</option>
                  <option>Appetizers</option>
                  <option>Desserts</option>
                  <option>Beverages</option>
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                  style={{
                    padding: '10px',
                    border: '1px solid #d0e7cd',
                    borderRadius: '5px',
                    fontFamily: 'Arial, sans-serif'
                  }}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                  style={{
                    padding: '10px',
                    border: '1px solid #d0e7cd',
                    borderRadius: '5px',
                    fontFamily: 'Arial, sans-serif',
                    gridColumn: '1 / -1'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  onClick={handleAddMenuItem}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✅ Add
                </button>
                <button
                  onClick={() => setShowMenuForm(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#e0e0e0',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            {menuItems.map(item => (
              <div key={item.id} style={{
                border: '1px solid #d0e7cd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>
                  <span style={{ backgroundColor: '#e8f5e9', padding: '2px 6px', borderRadius: '3px' }}>
                    {item.category}
                  </span>
                </p>
                <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>{item.description}</p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px',
                  paddingTop: '10px',
                  borderTop: '1px solid #d0e7cd'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#4caf50' }}>₹{item.price}</span>
                  <button
                    onClick={() => handleDeleteMenuItem(item.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table Management Tab */}
      {activeTab === 'tables' && (
        <div>
          <button
            onClick={() => setShowTableForm(!showTableForm)}
            style={{
              marginBottom: '20px',
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ➕ Add New Table
          </button>

          {showTableForm && (
            <div style={{
              backgroundColor: '#f1faf3',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Add Table</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  type="number"
                  placeholder="Table Number"
                  value={newTable.tableNumber}
                  onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                  style={{
                    padding: '10px',
                    border: '1px solid #d0e7cd',
                    borderRadius: '5px',
                    fontFamily: 'Arial, sans-serif'
                  }}
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 2 })}
                  style={{
                    padding: '10px',
                    border: '1px solid #d0e7cd',
                    borderRadius: '5px',
                    fontFamily: 'Arial, sans-serif'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  onClick={handleAddTable}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✅ Add
                </button>
                <button
                  onClick={() => setShowTableForm(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#e0e0e0',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            {tables.map(table => (
              <div key={table.id} style={{
                border: '2px solid #d0e7cd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: table.status === 'available' ? '#e8f5e9' : '#fff3e0',
                textAlign: 'center'
              }}>
                <h2 style={{ margin: '0', fontSize: '32px' }}>🪑</h2>
                <h3 style={{ margin: '10px 0 5px 0' }}>Table {table.tableNumber}</h3>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>Capacity: {table.capacity}</p>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: table.status === 'available' ? '#4caf50' : '#ff9800',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginTop: '10px'
                }}>
                  {table.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Room Management Tab */}
      {activeTab === 'rooms' && (
        <div>
          <button
            onClick={() => setShowRoomForm(!showRoomForm)}
            style={{
              marginBottom: '20px',
              padding: '12px 24px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            ➕ Check In Guest
          </button>

          {showRoomForm && (
            <div style={{
              backgroundColor: '#f1faf3',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #d0e7cd'
            }}>
              <h3 style={{ marginTop: 0 }}>Check In Guest</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Guest Name"
                  value={roomFormData.guestName}
                  onChange={(e) => setRoomFormData({ ...roomFormData, guestName: e.target.value })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d0e7cd' }}
                />
                <input
                  type="date"
                  value={roomFormData.checkInDate}
                  onChange={(e) => setRoomFormData({ ...roomFormData, checkInDate: e.target.value })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d0e7cd' }}
                />
                <input
                  type="date"
                  value={roomFormData.checkOutDate}
                  onChange={(e) => setRoomFormData({ ...roomFormData, checkOutDate: e.target.value })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d0e7cd' }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
            {rooms.map(room => (
              <div key={room.id} style={{
                border: '2px solid #d0e7cd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: room.status === 'available' ? '#e8f5e9' : room.status === 'occupied' ? '#e3f2fd' : '#ffe0b2',
              }}>
                <h3 style={{ margin: '0 0 10px 0' }}>🛏️ Room {room.number}</h3>
                {room.status === 'occupied' && room.guestName && (
                  <>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Guest:</strong> {room.guestName}</p>
                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>Check-in: {room.checkInDate}</p>
                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>Check-out: {room.checkOutDate}</p>
                    <button
                      onClick={() => handleCheckOutGuest(room.id)}
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        padding: '8px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Check Out
                    </button>
                  </>
                )}
                {room.status === 'available' && (
                  <button
                    onClick={() => {
                      setShowRoomForm(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '10px'
                    }}
                  >
                    Check In
                  </button>
                )}
                <div style={{
                  display: 'inline-block',
                  backgroundColor: room.status === 'available' ? '#4caf50' : room.status === 'occupied' ? '#2196F3' : '#ff9800',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginTop: '10px'
                }}>
                  {room.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Highlight Tab */}
      {activeTab === 'highlights' && (
        <div>
          <div style={{
            backgroundColor: '#f1faf3',
            padding: '25px',
            borderRadius: '8px',
            border: '2px solid #d0e7cd',
            marginBottom: '25px'
          }}>
            <h2 style={{ marginTop: 0 }}>⭐ Set Today's Highlight & Top Deal</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Select one menu item to highlight and one as the top deal of the day. These will be shown in the customer-facing menu.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Today's Highlight Item:</label>
                <select
                  value={highlightedItem || ''}
                  onChange={(e) => setHighlightedItem(e.target.value ? parseInt(e.target.value) : null)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d0e7cd', fontSize: '14px' }}
                >
                  <option value="">Select an item...</option>
                  {menuItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - ₹{item.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Top Deal of the Day:</label>
                <select
                  value={topDealItem || ''}
                  onChange={(e) => setTopDealItem(e.target.value ? parseInt(e.target.value) : null)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d0e7cd', fontSize: '14px' }}
                >
                  <option value="">Select an item...</option>
                  {menuItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - ₹{item.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSetHighlight}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              ✨ Set Highlights
            </button>

            {highlightedItem && topDealItem && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                <p><strong>Preview:</strong></p>
                <p>Highlight: {menuItems.find(i => i.id === highlightedItem)?.name}</p>
                <p>Top Deal: {menuItems.find(i => i.id === topDealItem)?.name}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order History Tab */}
      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#f1faf3',
              borderRadius: '8px',
              color: '#999'
            }}>
              📜 No orders yet
            </div>
          ) : (
            <div style={{
              overflowX: 'auto',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1faf3', borderBottom: '2px solid #d0e7cd' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Order ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Table</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Items</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #d0e7cd' }}>
                      <td style={{ padding: '12px' }}>#{order.id}</td>
                      <td style={{ padding: '12px' }}>Table {order.tableNumber}</td>
                      <td style={{ padding: '12px' }}>
                        {order.items.map((item, i) => (
                          <span key={i} style={{ display: 'block', fontSize: '12px' }}>
                            {item.name} x{item.qty}
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          backgroundColor: order.status === 'ready' ? '#4caf50' : order.status === 'preparing' ? '#2196F3' : '#ff9800',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>
                        {new Date(order.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
