import React from 'react';

const InvoicePreview: React.FC = () => {
  const items = [
    { name: 'Dal Tadka', price: 180 },
    { name: 'Paneer Butter Masala', price: 280 },
    { name: 'Naan (2 pcs)', price: 80 },
  ];

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div style={{
      border: '1px solid #d0e7cd',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: '#f9fff9'
    }}>
      <h4>Invoice Preview</h4>
      <p><strong>The Grand Hotel</strong></p>
      <p>Table #5</p>
      <p>Date: 05/12/2025</p>
      <hr />
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
          <span>{item.name}</span>
          <span>₹{item.price}</span>
        </div>
      ))}
      <hr />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Subtotal:</span>
        <span>₹{subtotal}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>GST (18%):</span>
        <span>₹{gst.toFixed(2)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#4caf50' }}>
        <span>Total:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default InvoicePreview;


