/**
 * StaffOpsLanding
 * ===============
 * Main staff operations dashboard with 4 functional tabs:
 * 1. Generate Bill - Menu selector + invoice builder + activity feed + preview
 * 2. Table Management - Table grid with status, order details panel
 * 3. Room Management - Room circles with check-in/out
 * 4. Order Management - Online orders (Zomato/Swiggy) with polling
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from '../components/Menu/Menu';
import { OrderedStack } from '../components/Menu/OrderedStack';
import { useOrder } from '../context/OrderContext';
import {
  getTables,
  getRooms,
  getOnlineOrders,
  getOrderDetails,
  updateTableStatus,
  checkInGuest,
  checkOutGuest,
  updateOrderStatus,
} from '../services/api';
import type { Table, Room, OnlineOrder, MenuItem } from '../services/api';

type TabType = 'generate-bill' | 'table-management' | 'room-management' | 'order-management';

export const StaffOpsLanding: React.FC = () => {
  const navigate = useNavigate();
  const { invoice, addItem, removeItem, updateItemQty, updateItemNote, applyCoupon, clearInvoice } = useOrder();
  const [activeTab, setActiveTab] = useState<TabType>('generate-bill');

  // Table Management state
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableOrderDetails, setTableOrderDetails] = useState<any>(null);

  // Room Management state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkInRoomId, setCheckInRoomId] = useState<number | null>(null);
  const [checkInName, setCheckInName] = useState('');
  const [checkOutRoomId, setCheckOutRoomId] = useState<number | null>(null);

  // Order Management state
  const [onlineOrders, setOnlineOrders] = useState<OnlineOrder[]>([]);
  const [autoPolling, setAutoPolling] = useState(true);

  // Load data on mount
  useEffect(() => {
    const auth = localStorage.getItem('qryte_auth');
    if (!auth) {
      navigate('/demo-login');
      return;
    }

    setTables(getTables());
    setRooms(getRooms());
    setOnlineOrders(getOnlineOrders());
  }, [navigate]);

  // Online order polling
  useEffect(() => {
    if (!autoPolling || activeTab !== 'order-management') return;

    const interval = setInterval(() => {
      setOnlineOrders(getOnlineOrders());
    }, 12000); // 12 seconds

    return () => clearInterval(interval);
  }, [autoPolling, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('qryte_auth');
    navigate('/demo-login');
  };

  const handleAddMenuItemToInvoice = (item: MenuItem) => {
    addItem(item);
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    const details = getOrderDetails(table.id);
    setTableOrderDetails(details);
  };

  const handleTableStatusChange = (table: Table, newStatus: 'available' | 'occupied' | 'needs_cleaning') => {
    updateTableStatus(table.id, newStatus);
    setTables(getTables());
  };

  const handleCheckInGuest = () => {
    if (!checkInRoomId || !checkInName.trim()) return;
    checkInGuest(checkInRoomId, checkInName);
    setRooms(getRooms());
    setCheckInRoomId(null);
    setCheckInName('');
  };

  const handleCheckOutGuest = () => {
    if (!checkOutRoomId) return;
    checkOutGuest(checkOutRoomId);
    setRooms(getRooms());
    setCheckOutRoomId(null);
  };

  const handleUpdateOnlineOrderStatus = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus);
    setOnlineOrders(getOnlineOrders());
  };

  // Tab header styling
  const tabHeaderStyle = (tab: TabType) => ({
    padding: '12px 20px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: activeTab === tab ? '#4caf50' : '#f5f5f5',
    color: activeTab === tab ? 'white' : '#333',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #2e7d32' : '1px solid #e0e0e0',
    transition: 'all 0.2s ease',
  });

  return (

    <>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#333',
          color: 'white',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>🏨 Staff Operations</h1>
        <button
          onClick={handleLogout}
          aria-label="Logout from staff dashboard"
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Tab Headers */}
      <div style={{ display: 'flex', backgroundColor: 'white', borderBottom: '2px solid #e0e0e0', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('generate-bill')}
          style={tabHeaderStyle('generate-bill')}
          aria-label="Generate Bill tab"
          aria-pressed={activeTab === 'generate-bill'}
        >
          💰 Generate Bill
        </button>
        <button
          onClick={() => setActiveTab('table-management')}
          style={tabHeaderStyle('table-management')}
          aria-label="Table Management tab"
          aria-pressed={activeTab === 'table-management'}
        >
          🪑 Tables
        </button>
        <button
          onClick={() => setActiveTab('room-management')}
          style={tabHeaderStyle('room-management')}
          aria-label="Room Management tab"
          aria-pressed={activeTab === 'room-management'}
        >
          🛏️ Rooms
        </button>
        <button
          onClick={() => setActiveTab('order-management')}
          style={tabHeaderStyle('order-management')}
          aria-label="Order Management tab"
          aria-pressed={activeTab === 'order-management'}
        >
          🍕 Online Orders
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* Generate Bill Tab */}
        {activeTab === 'generate-bill' && (
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', height: '100%' }}>
              {/* Left: Menu Selector */}
              <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px', backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}>
                  🍽️ Menu
                </div>
                <Menu compactMode={true} onAdd={handleAddMenuItemToInvoice} />
              </div>

              {/* Middle: Invoice Stack */}
              <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                  📋 Invoice
                </h3>
                {invoice && invoice.items.length > 0 ? (
                  <>
                    <div
                      style={{
                        flex: 1,
                        overflowY: 'auto',
                        marginBottom: '12px',
                        paddingRight: '8px',
                      }}
                    >
                      <OrderedStack
                        items={invoice.items}
                        onRemoveItem={removeItem}
                        onUpdateQty={updateItemQty}
                        onUpdateNote={updateItemNote}
                        compactMode={true}
                      />
                    </div>

                    {/* Coupon input */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                      <input
                        type="text"
                        placeholder="Coupon code"
                        aria-label="Enter coupon code"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            applyCoupon((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          fontSize: '11px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                        }}
                      />
                      <button
                        onClick={() => {
                          const code = (document.querySelector('input[placeholder="Coupon code"]') as HTMLInputElement)?.value;
                          if (code) {
                            applyCoupon(code);
                            (document.querySelector('input[placeholder="Coupon code"]') as HTMLInputElement).value = '';
                          }
                        }}
                        aria-label="Apply coupon code"
                        style={{
                          padding: '6px 10px',
                          fontSize: '10px',
                          backgroundColor: '#ff6f00',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        Apply
                      </button>
                    </div>

                    {/* Totals */}
                    <div
                      style={{
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Subtotal:</span>
                        <span>₹{invoice.subtotal.toFixed(2)}</span>
                      </div>
                      {invoice.discountAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#ff6f00', fontWeight: 'bold' }}>
                          <span>Discount ({invoice.appliedCoupon}):</span>
                          <span>-₹{invoice.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>GST (12%):</span>
                        <span>₹{invoice.gstAmount.toFixed(2)}</span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          paddingTop: '8px',
                          borderTop: '1px solid #ddd',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          color: '#4caf50',
                        }}
                      >
                        <span>Total:</span>
                        <span>₹{invoice.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={clearInvoice}
                      aria-label="Clear invoice"
                      style={{
                        marginTop: '10px',
                        width: '100%',
                        padding: '8px',
                        fontSize: '11px',
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      ✕ Clear
                    </button>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '12px' }}>No items in invoice yet.</p>
                  </div>
                )}
              </div>

              {/* Right: Invoice Preview */}
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '600px',
                  overflowY: 'auto',
                  border: '2px solid #4caf50',
                }}
              >
                {/* Invoice Preview */}
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>
                    Hotel Bhubaneswari
                  </h2>
                  <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>
                    📍 Bhubaneswar, Odisha
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#999' }}>
                    {new Date().toLocaleDateString('en-IN')}
                  </p>
                </div>

                {invoice && invoice.items.length > 0 ? (
                  <>
                    <div style={{ borderTop: '1px dashed #ddd', borderBottom: '1px dashed #ddd', padding: '10px 0', marginBottom: '10px', fontSize: '11px' }}>
                      {invoice.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>
                            {item.qty}x {item.name.substring(0, 14)}
                            {item.name.length > 14 ? '...' : ''}
                          </span>
                          <span>₹{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: '11px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Subtotal:</span>
                        <span>₹{invoice.subtotal.toFixed(2)}</span>
                      </div>
                      {invoice.discountAmount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#ff6f00' }}>
                          <span>Discount:</span>
                          <span>-₹{invoice.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>GST (12%):</span>
                        <span>₹{invoice.gstAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        padding: '8px',
                        textAlign: 'center',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        marginBottom: '16px',
                      }}
                    >
                      ₹{invoice.total.toFixed(2)}
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '10px', color: '#666', margin: '0 0 8px 0' }}>
                      ─────────────────────
                    </p>
                    <p style={{ textAlign: 'center', fontSize: '11px', color: '#333', fontStyle: 'italic', margin: 0 }}>
                      Thank you for your visit!
                    </p>
                    <p style={{ textAlign: 'center', fontSize: '10px', color: '#999', margin: '4px 0 0 0' }}>
                      Please visit again 😊
                    </p>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '12px' }}>Invoice preview will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Table Management Tab */}
        {activeTab === 'table-management' && (
          <div>
            <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>🪑 Table Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              {tables.map((table) => (
                <div
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    border: selectedTable?.id === table.id ? '2px solid #4caf50' : '1px solid #ddd',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                      {table.name} #{table.number}
                    </h3>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor:
                          table.status === 'available'
                            ? '#4caf50'
                            : table.status === 'occupied'
                              ? '#f44336'
                              : '#ff9800',
                      }}
                      aria-label={`Table status: ${table.status}`}
                    />
                  </div>

                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
                    <strong>Status:</strong> {table.status.replace('_', ' ')}
                  </p>

                  <select
                    value={table.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleTableStatusChange(table, e.target.value as 'available' | 'occupied' | 'needs_cleaning');
                    }}
                    aria-label={`Change status for ${table.name}`}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '8px',
                    }}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="needs_cleaning">Needs Cleaning</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Table Details Panel */}
            {selectedTable && tableOrderDetails && (
              <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', maxWidth: '600px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                  📋 Table {selectedTable.number} Details
                </h3>

                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
                    <strong>Name:</strong> {selectedTable.name}
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
                    <strong>Status:</strong> {selectedTable.status}
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
                    <strong>Total:</strong> ₹{tableOrderDetails.total || '0'}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px' }}>
                    <strong>Items:</strong> {tableOrderDetails.items?.length || 0}
                  </p>
                </div>

                {tableOrderDetails.items && tableOrderDetails.items.length > 0 && (
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                      Order Items:
                    </h4>
                    {tableOrderDetails.items.map((item: any, idx: number) => (
                      <div key={idx} style={{ fontSize: '12px', marginBottom: '4px', padding: '6px', backgroundColor: '#f9f9f9' }}>
                        {item.name} × {item.qty} = ₹{item.price * item.qty}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Room Management Tab */}
        {activeTab === 'room-management' && (
          <div>
            <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>🛏️ Room Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {rooms.map((room) => (
                <div key={room.id} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor:
                        room.status === 'occupied'
                          ? '#f44336'
                          : room.status === 'available'
                            ? '#4caf50'
                            : '#ff9800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      margin: '0 auto 12px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                    aria-label={`Room ${room.id} - ${room.status}`}
                  >
                    {room.id}
                  </div>

                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
                    <strong>{room.name}</strong>
                  </p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#999' }}>
                    {room.status}
                    {room.guestInfo && ` - ${room.guestInfo}`}
                  </p>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setCheckInRoomId(room.id)}
                      aria-label={`Check in guest to room ${room.id}`}
                      disabled={room.status === 'occupied'}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        fontSize: '11px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: room.status === 'occupied' ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        opacity: room.status === 'occupied' ? 0.5 : 1,
                      }}
                    >
                      ✓ Check-in
                    </button>
                    <button
                      onClick={() => setCheckOutRoomId(room.id)}
                      aria-label={`Check out guest from room ${room.id}`}
                      disabled={room.status !== 'occupied'}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        fontSize: '11px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: room.status !== 'occupied' ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        opacity: room.status !== 'occupied' ? 0.5 : 1,
                      }}
                    >
                      ✕ Check-out
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Check-in Modal */}
            {checkInRoomId !== null && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
                onClick={() => setCheckInRoomId(null)}
              >
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    maxWidth: '400px',
                    width: '90%',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                    Check-in Guest - Room {checkInRoomId}
                  </h3>

                  <input
                    type="text"
                    placeholder="Guest name"
                    value={checkInName}
                    onChange={(e) => setCheckInName(e.target.value)}
                    aria-label="Guest name for check-in"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '13px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '16px',
                      boxSizing: 'border-box',
                    }}
                  />

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleCheckInGuest}
                      aria-label="Confirm check-in"
                      style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '13px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      ✓ Check-in
                    </button>
                    <button
                      onClick={() => {
                        setCheckInRoomId(null);
                        setCheckInName('');
                      }}
                      aria-label="Cancel check-in"
                      style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '13px',
                        backgroundColor: '#ddd',
                        color: '#333',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Check-out Confirmation Modal */}
            {checkOutRoomId !== null && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
                onClick={() => setCheckOutRoomId(null)}
              >
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    maxWidth: '400px',
                    width: '90%',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                    Check-out Guest - Room {checkOutRoomId}
                  </h3>

                  <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '13px' }}>
                    Are you sure you want to check out the guest from this room?
                  </p>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleCheckOutGuest}
                      aria-label="Confirm check-out"
                      style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '13px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      ✓ Check-out
                    </button>
                    <button
                      onClick={() => setCheckOutRoomId(null)}
                      aria-label="Cancel check-out"
                      style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '13px',
                        backgroundColor: '#ddd',
                        color: '#333',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Management Tab */}
        {activeTab === 'order-management' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, color: '#333' }}>🍕 Online Orders</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
                  <input
                    type="checkbox"
                    checked={autoPolling}
                    onChange={(e) => setAutoPolling(e.target.checked)}
                    aria-label="Auto-poll for new orders"
                    style={{ marginRight: '4px' }}
                  />
                  Auto-poll
                </label>
                <button
                  onClick={() => setOnlineOrders(getOnlineOrders())}
                  aria-label="Refresh online orders"
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  🔄 Sync
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Zomato Orders */}
              <div>
                <h3 style={{ margin: '0 0 12px 0', color: '#f14400', fontSize: '14px', fontWeight: 'bold' }}>
                  🍔 Zomato
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {onlineOrders
                    .filter((order) => order.platform === 'zomato')
                    .map((order) => (
                      <div
                        key={order.id}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          padding: '12px',
                          border: '1px solid #e0e0e0',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <p style={{ margin: '0 0 2px 0', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
                              Order #{order.id}
                            </p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>
                              {order.customerName}
                            </p>
                          </div>
                          <span
                            style={{
                              padding: '2px 8px',
                              fontSize: '10px',
                              backgroundColor: '#fff3e0',
                              color: '#e65100',
                              borderRadius: '12px',
                              fontWeight: 'bold',
                            }}
                          >
                            ₹{order.total}
                          </span>
                        </div>

                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#666' }}>
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>

                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOnlineOrderStatus(order.id, e.target.value)}
                          aria-label={`Status for order ${order.id}`}
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            fontSize: '11px',
                            border: '1px solid #ddd',
                            borderRadius: '3px',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    ))}
                  {onlineOrders.filter((order) => order.platform === 'zomato').length === 0 && (
                    <p style={{ color: '#999', fontSize: '12px', textAlign: 'center' }}>No Zomato orders</p>
                  )}
                </div>
              </div>

              {/* Swiggy Orders */}
              <div>
                <h3 style={{ margin: '0 0 12px 0', color: '#fc8019', fontSize: '14px', fontWeight: 'bold' }}>
                  🍜 Swiggy
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {onlineOrders
                    .filter((order) => order.platform === 'swiggy')
                    .map((order) => (
                      <div
                        key={order.id}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          padding: '12px',
                          border: '1px solid #e0e0e0',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <p style={{ margin: '0 0 2px 0', fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
                              Order #{order.id}
                            </p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>
                              {order.customerName}
                            </p>
                          </div>
                          <span
                            style={{
                              padding: '2px 8px',
                              fontSize: '10px',
                              backgroundColor: '#fff8e1',
                              color: '#f57f17',
                              borderRadius: '12px',
                              fontWeight: 'bold',
                            }}
                          >
                            ₹{order.total}
                          </span>
                        </div>

                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#666' }}>
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>

                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOnlineOrderStatus(order.id, e.target.value)}
                          aria-label={`Status for order ${order.id}`}
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            fontSize: '11px',
                            border: '1px solid #ddd',
                            borderRadius: '3px',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    ))}
                  {onlineOrders.filter((order) => order.platform === 'swiggy').length === 0 && (
                    <p style={{ color: '#999', fontSize: '12px', textAlign: 'center' }}>No Swiggy orders</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};
