import React from 'react';

const RecentItems: React.FC = () => {
  const items = [
    { name: 'Dal Tadka', price: 180 },
    { name: 'Paneer Butter Masala', price: 280 },
    { name: 'Naan (2 pcs)', price: 80 },
  ];

  return (
    <div style={{
      marginTop: '20px',
      border: '1px solid #d0e7cd',
      borderRadius: '8px',
      padding: '10px'
    }}>
      <h4>Recent Items</h4>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
          <span>{item.name}</span>
          <span>₹{item.price}</span>
        </div>
      ))}
    </div>
  );
};

export default RecentItems;


