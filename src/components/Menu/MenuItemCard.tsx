/**
 * MenuItemCard
 * ============
 * Individual menu item display with veg/non-veg badge, price, description, prep time.
 * Supports +/- quantity controls and edit mode for admin.
 */

import React, { useState } from 'react';
import type { MenuItem } from '../../services/api';

interface MenuItemCardProps {
  item: MenuItem;
  qty?: number;
  onAddItem: (item: MenuItem, qty: number) => void;
  onQtyChange?: (qty: number) => void;
  editable?: boolean;
  onEdit?: (item: MenuItem) => void;
  disabled?: boolean;
  compactMode?: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  qty = 0,
  onAddItem,
  onQtyChange,
  editable = false,
  onEdit,
  disabled = !item.active,
  compactMode = false,
}) => {
  const [localQty, setLocalQty] = useState(qty);

  const handleQtyChange = (newQty: number) => {
    if (newQty < 0) return;
    setLocalQty(newQty);
    onQtyChange?.(newQty);
  };

  const handleAddClick = () => {
    if (localQty > 0) {
      onAddItem(item, localQty);
      setLocalQty(0);
    }
  };

  if (compactMode) {
    return (
      <div
        style={{
          padding: '10px 12px',
          borderBottom: '1px solid #e0e0e0',
          opacity: disabled ? 0.5 : 1,
          backgroundColor: disabled ? '#f5f5f5' : 'white',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>
                {item.name}
              </h4>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  backgroundColor: item.vegNonVeg === 'veg' ? '#e8f5e9' : '#ffebee',
                  color: item.vegNonVeg === 'veg' ? '#2e7d32' : '#c62828',
                }}
              >
                {item.vegNonVeg === 'veg' ? '🥬' : '🍗'}
              </span>
              <span style={{ fontSize: '10px', color: '#999' }}>
                {item.prepTime}m
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#666' }}>
              {item.description}
            </p>
          </div>
          <div style={{ textAlign: 'right', minWidth: '70px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#4caf50', marginBottom: '6px' }}>
              ₹{item.price}
            </div>
            <div style={{ display: 'flex', gap: '3px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleQtyChange(Math.max(0, localQty - 1))}
                aria-label={`Decrease quantity of ${item.name}`}
                disabled={disabled || localQty === 0}
                style={{
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  borderRadius: '3px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  opacity: disabled || localQty === 0 ? 0.5 : 1,
                }}
              >
                −
              </button>
              <div style={{ width: '24px', textAlign: 'center', lineHeight: '24px', fontSize: '12px', fontWeight: 'bold' }}>
                {localQty}
              </div>
              <button
                onClick={() => handleQtyChange(localQty + 1)}
                aria-label={`Increase quantity of ${item.name}`}
                disabled={disabled}
                style={{
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  borderRadius: '3px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                +
              </button>
            </div>
            {localQty > 0 && (
              <button
                onClick={handleAddClick}
                aria-label={`Add ${item.name} to cart`}
                disabled={disabled}
                style={{
                  marginTop: '6px',
                  width: '100%',
                  padding: '4px 6px',
                  fontSize: '11px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full mode card
  return (
    <div
      style={{
        border: '1px solid #d0e7cd',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: disabled ? '#f5f5f5' : 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        opacity: disabled ? 0.6 : 1,
        position: 'relative',
      }}
    >
      {disabled && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#f44336',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 'bold',
          }}
        >
          Disabled
        </div>
      )}

      <h3 style={{ margin: '0 0 6px 0', color: '#333', fontSize: '14px', fontWeight: '600' }}>
        {item.name}
      </h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '11px' }}>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '3px',
            backgroundColor: item.vegNonVeg === 'veg' ? '#e8f5e9' : '#ffebee',
            color: item.vegNonVeg === 'veg' ? '#2e7d32' : '#c62828',
            fontWeight: 'bold',
          }}
        >
          {item.vegNonVeg === 'veg' ? '🥬 Veg' : '🍗 Non-Veg'}
        </span>
        <span style={{ color: '#666' }}>⏱️ {item.prepTime}m</span>
      </div>

      <p style={{ margin: '6px 0', fontSize: '12px', color: '#666' }}>
        {item.description}
      </p>

      <div style={{ fontSize: '13px', color: '#4caf50', fontWeight: 'bold', marginBottom: '10px' }}>
        ₹{item.price}
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button
          onClick={() => handleQtyChange(Math.max(0, localQty - 1))}
          aria-label={`Decrease quantity of ${item.name}`}
          disabled={disabled || localQty === 0}
          style={{
            width: '28px',
            height: '28px',
            padding: 0,
            border: '1px solid #ccc',
            backgroundColor: 'white',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: disabled || localQty === 0 ? 0.5 : 1,
          }}
        >
          −
        </button>
        <div style={{ width: '30px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>
          {localQty}
        </div>
        <button
          onClick={() => handleQtyChange(localQty + 1)}
          aria-label={`Increase quantity of ${item.name}`}
          disabled={disabled}
          style={{
            width: '28px',
            height: '28px',
            padding: 0,
            border: '1px solid #ccc',
            backgroundColor: 'white',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          +
        </button>
        {localQty > 0 && (
          <button
            onClick={handleAddClick}
            aria-label={`Add ${item.name} to cart`}
            disabled={disabled}
            style={{
              flex: 1,
              padding: '6px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              opacity: disabled ? 0.5 : 1,
            }}
          >
            Add to Cart
          </button>
        )}
      </div>

      {editable && onEdit && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '6px' }}>
          <button
            onClick={() => onEdit(item)}
            aria-label={`Edit ${item.name}`}
            style={{
              flex: 1,
              padding: '6px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            ✏️ Edit
          </button>
        </div>
      )}
    </div>
  );
};
