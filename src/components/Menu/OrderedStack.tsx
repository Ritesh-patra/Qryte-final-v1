/**
 * OrderedStack
 * ============
 * Displays items added to the current order/invoice with quantity controls,
 * remove button, and "note for chef" field.
 */

import React, { useState } from 'react';
import type { OrderItem } from '../../services/api';

interface OrderedStackProps {
  items: OrderItem[];
  onRemoveItem: (itemId: number) => void;
  onUpdateQty: (itemId: number, qty: number) => void;
  onUpdateNote: (itemId: number, note: string) => void;
  compactMode?: boolean;
}

export const OrderedStack: React.FC<OrderedStackProps> = ({
  items,
  onRemoveItem,
  onUpdateQty,
  onUpdateNote,
  compactMode = false,
}) => {
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div
        style={{
          padding: compactMode ? '12px' : '16px',
          textAlign: 'center',
          color: '#999',
          fontSize: compactMode ? '12px' : '14px',
          backgroundColor: compactMode ? '#fafafa' : '#f5f5f5',
          borderRadius: compactMode ? '0' : '8px',
          border: compactMode ? 'none' : '1px dashed #ddd',
        }}
      >
        {compactMode ? 'No items added' : 'No items added to order yet'}
      </div>
    );
  }

  if (compactMode) {
    return (
      <div style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
        {items.map((item) => (
          <div key={item.id} style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#333', marginBottom: '2px' }}>
                  {item.qty}x {item.name}
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  ₹{item.price} × {item.qty} = <span style={{ fontWeight: 'bold', color: '#4caf50' }}>₹{item.price * item.qty}</span>
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                aria-label={`Remove ${item.name} from order`}
                style={{
                  padding: '2px 6px',
                  fontSize: '10px',
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            </div>

            {item.noteForChef && (
              <div style={{ fontSize: '10px', color: '#ff6f00', marginTop: '4px', padding: '4px', backgroundColor: '#fff3e0', borderRadius: '2px' }}>
                📝 {item.noteForChef}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Full mode
  return (
    <div style={{ backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '16px' }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
        📋 Order Stack ({items.length} items)
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: 'white',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
                  {item.name}
                </h4>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  ₹{item.price} each
                </div>
              </div>

              <button
                onClick={() => onRemoveItem(item.id)}
                aria-label={`Remove ${item.name} from order`}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ✕ Remove
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', minWidth: '30px' }}>Qty:</span>
              <button
                onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
                aria-label={`Decrease quantity of ${item.name}`}
                style={{
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                −
              </button>
              <div style={{ width: '28px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                {item.qty}
              </div>
              <button
                onClick={() => onUpdateQty(item.id, item.qty + 1)}
                aria-label={`Increase quantity of ${item.name}`}
                style={{
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                +
              </button>
              <div style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#4caf50', fontSize: '12px' }}>
                Subtotal: ₹{item.price * item.qty}
              </div>
            </div>

            <div>
              <button
                onClick={() => setExpandedNoteId(expandedNoteId === item.id ? null : item.id)}
                aria-label={`${expandedNoteId === item.id ? 'Hide' : 'Show'} notes for ${item.name}`}
                style={{
                  fontSize: '11px',
                  backgroundColor: '#fff3e0',
                  color: '#e65100',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginBottom: expandedNoteId === item.id ? '8px' : 0,
                }}
              >
                📝 {expandedNoteId === item.id ? 'Hide' : 'Add/Edit'} Note for Chef
              </button>

              {expandedNoteId === item.id && (
                <textarea
                  value={item.noteForChef || ''}
                  onChange={(e) => onUpdateNote(item.id, e.target.value)}
                  placeholder="Special instructions (e.g., less spicy, extra sauce)..."
                  aria-label={`Note for chef for ${item.name}`}
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    padding: '8px',
                    marginTop: '8px',
                    fontSize: '12px',
                    border: '1px solid #ffa726',
                    borderRadius: '4px',
                    fontFamily: 'Arial, sans-serif',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '12px',
          padding: '10px',
          backgroundColor: '#e8f5e9',
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#2e7d32',
          fontWeight: 'bold',
        }}
      >
        Total Items: {items.reduce((sum, item) => sum + item.qty, 0)} | Total Value: ₹
        {items.reduce((sum, item) => sum + item.price * item.qty, 0)}
      </div>
    </div>
  );
};
