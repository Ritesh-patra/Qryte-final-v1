import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
}

interface CartItem extends MenuItem {
  qty: number;
}

const CustomerMenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || '7';

  const menuItems: MenuItem[] = [
    { id: 1, name: 'Biryani', category: 'Mains', price: 250, description: 'Fragrant rice dish' },
    { id: 2, name: 'Butter Chicken', category: 'Mains', price: 320, description: 'Creamy chicken curry' },
    { id: 3, name: 'Dal Makhani', category: 'Mains', price: 180, description: 'Creamy lentil curry' },
    { id: 4, name: 'Garlic Naan', category: 'Breads', price: 60, description: 'Soft naan with garlic' },
    { id: 5, name: 'Paneer Tikka', category: 'Appetizers', price: 200, description: 'Grilled cottage cheese' },
    { id: 6, name: 'Samosa', category: 'Appetizers', price: 80, description: 'Crispy pastry with potato' },
    { id: 7, name: 'Gulab Jamun', category: 'Desserts', price: 100, description: 'Sweet milk solids' },
    { id: 8, name: 'Mango Lassi', category: 'Beverages', price: 120, description: 'Sweet yogurt drink' },
  ];

  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [couponCode, setCouponCode] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlights, setHighlights] = useState<{ highlightedItemId?: number; topDealItemId?: number }>({});

  useEffect(() => {
    api.getTodaysHighlight().then(hl => {
      if (hl) setHighlights(hl);
    });
  }, []);

  // Group menu by category
  const categorizedMenu = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => ({
      ...prev,
      [item.id]: {
        ...item,
        qty: (prev[item.id]?.qty || 0) + 1
      }
    }));
  };

  const handleUpdateQty = (itemId: number, qty: number) => {
    if (qty <= 0) {
      setCart(prev => {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      });
    } else {
      setCart(prev => ({
        ...prev,
        [itemId]: { ...prev[itemId], qty }
      }));
    }
  };

  const getTotalAmount = () => {
    return Object.values(cart).reduce((sum: number, item: CartItem) => sum + (item.price * item.qty), 0);
  };

  const applyCoupon = () => {
    if (couponCode === 'SAVE10') {
      alert('✅ Coupon applied! 10% discount');
    } else if (couponCode) {
      alert('❌ Invalid coupon code');
    }
  };

  const shareOnWhatsApp = () => {
    const itemsList = Object.values(cart)
      .map(item => `${item.name} x${item.qty} - ₹${item.price * item.qty}`)
      .join('\n');
    
    const message = `*My Order from QRyte*\nTable #${tableNumber}\n\n${itemsList}\n\n*Total: ₹${getTotalAmount()}*`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePlaceOrder = async () => {
    if (Object.keys(cart).length === 0) {
      alert('❌ Please add items to cart');
      return;
    }

    setLoading(true);
    try {
      const items = Object.values(cart).map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price
      }));

      const payload = {
        tableNumber: parseInt(tableNumber),
        items,
        couponCode: couponCode || null,
        totalAmount: getTotalAmount()
      };

      const response = await api.placeCustomerOrder(payload);
      
      // Deduct inventory for each item
      for (const item of items) {
        await api.deductInventory(item.id, item.qty);
      }
      
      // Mark table as occupied
      await api.updateTableStatus(parseInt(tableNumber), 'occupied');

      alert('✅ Order placed successfully! Order ID: ' + response.orderId);
      setCart({});
      setCouponCode('');
      setShowCart(false);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      alert('❌ Error placing order: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const highlightedItem = highlights.highlightedItemId ? menuItems.find(i => i.id === highlights.highlightedItemId) : null;
  const topDealItem = highlights.topDealItemId ? menuItems.find(i => i.id === highlights.topDealItemId) : null;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
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
          <h1 style={{ margin: 0 }}>📱 Customer Menu</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Table #{tableNumber}</p>
        </div>
      </div>

      {/* Highlights Section */}
      {(highlightedItem || topDealItem) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {highlightedItem && (
            <div style={{
              backgroundColor: 'linear-gradient(135deg, #fff9c4 0%, #fffde7 100%)',
              border: '3px solid #fbc02d',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 'bold', color: '#f57f17' }}>⭐ TODAY'S HIGHLIGHT</p>
              <h3 style={{ margin: '10px 0 5px 0', fontSize: '20px' }}>{highlightedItem.name}</h3>
              <p style={{ margin: '5px 0 15px 0', fontSize: '14px', color: '#666' }}>{highlightedItem.description}</p>
              <p style={{ margin: '10px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#f57f17' }}>₹{highlightedItem.price}</p>
              <button
                onClick={() => handleAddToCart(highlightedItem)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#f57f17',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginTop: '10px'
                }}
              >
                ➕ Add to Cart
              </button>
            </div>
          )}

          {topDealItem && (
            <div style={{
              backgroundColor: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
              border: '3px solid #d32f2f',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 'bold', color: '#d32f2f' }}>🎁 TOP DEAL OF THE DAY</p>
              <h3 style={{ margin: '10px 0 5px 0', fontSize: '20px' }}>{topDealItem.name}</h3>
              <p style={{ margin: '5px 0 15px 0', fontSize: '14px', color: '#666' }}>{topDealItem.description}</p>
              <p style={{ margin: '10px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#d32f2f' }}>₹{topDealItem.price}</p>
              <button
                onClick={() => handleAddToCart(topDealItem)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginTop: '10px'
                }}
              >
                ➕ Add to Cart
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Menu Section */}
        <div style={{ flex: 2 }}>
          {Object.entries(categorizedMenu).map(([category, items]) => (
            <div key={category} style={{ marginBottom: '30px' }}>
              <h2 style={{ color: '#4caf50', borderBottom: '2px solid #d0e7cd', paddingBottom: '10px' }}>
                {category}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {items.map(item => (
                  <div key={item.id} style={{
                    border: '1px solid #d0e7cd',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{item.name}</h3>
                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>{item.description}</p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '10px'
                    }}>
                      <span style={{ fontWeight: 'bold', color: '#4caf50', fontSize: '16px' }}>
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{
                          padding: '5px 15px',
                          backgroundColor: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ➕ Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Section */}
        {showCart && (
          <div style={{
            flex: 1,
            border: '2px solid #4caf50',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f1faf3',
            height: 'fit-content',
            position: 'sticky',
            top: '20px'
          }}>
            <h2 style={{ margin: '0 0 15px 0', color: '#4caf50' }}>🛒 Your Cart</h2>

            {Object.values(cart).length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999' }}>Cart is empty</p>
            ) : (
              <>
                {Object.values(cart).map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #d0e7cd'
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 3px 0', fontWeight: 'bold' }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>₹{item.price} x {item.qty}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleUpdateQty(item.id, item.qty - 1)}
                        style={{
                          padding: '3px 8px',
                          border: '1px solid #ccc',
                          background: 'white',
                          cursor: 'pointer',
                          borderRadius: '3px'
                        }}
                      >
                        −
                      </button>
                      <span style={{ width: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.qty}</span>
                      <button
                        onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                        style={{
                          padding: '3px 8px',
                          border: '1px solid #ccc',
                          background: 'white',
                          cursor: 'pointer',
                          borderRadius: '3px'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                {/* Coupon */}
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #d0e7cd' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                    Coupon Code (Try: SAVE10)
                  </label>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        fontSize: '12px'
                      }}
                    />
                    <button 
                      onClick={applyCoupon}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* WhatsApp Share */}
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={shareOnWhatsApp}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#25D366',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    💬 Share on WhatsApp
                  </button>
                </div>

                {/* Total */}
                <div style={{
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '2px solid #d0e7cd',
                  backgroundColor: '#e8f5e9',
                  padding: '12px',
                  borderRadius: '5px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    fontWeight: 'bold'
                  }}>
                    <span>Total:</span>
                    <span style={{ color: '#4caf50', fontSize: '18px' }}>₹{getTotalAmount()}</span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? '⏳ Placing...' : '✅ Place Order'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {!showCart && (
        <button
          onClick={() => setShowCart(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          🛒
          {Object.keys(cart).length > 0 && (
            <div style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#d32f2f',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {Object.keys(cart).length}
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default CustomerMenuPage;
