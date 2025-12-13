import React from 'react';

const BillingActions: React.FC = () => {
  return (
    <div>
      <button style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        Generate Bill
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button style={{ padding: '10px', border: '1px solid #4caf50', borderRadius: '5px', background: 'white', cursor: 'pointer' }}>
          + Add Item from Menu
        </button>
        <button style={{ padding: '10px', border: '1px solid #4caf50', borderRadius: '5px', background: 'white', cursor: 'pointer' }}>
          Calculate GST
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ flex: 1, padding: '10px', border: '1px solid #4caf50', borderRadius: '5px', background: 'white', cursor: 'pointer' }}>Print</button>
          <button style={{ flex: 1, padding: '10px', border: '1px solid #4caf50', borderRadius: '5px', background: 'white', cursor: 'pointer' }}>Share</button>
        </div>
      </div>
    </div>
  );
};

export default BillingActions;


