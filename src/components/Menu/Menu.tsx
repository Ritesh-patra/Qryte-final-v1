/**
 * Menu
 * ====
 * Reusable menu component with filters, items grid, and ordered stack.
 * Integrates with OrderContext for cart management.
 * 
 * Props:
 * - compactMode: boolean - Render in compact horizontal layout
 * - onAdd: (item) => void - Callback when item is added (for modal mode)
 * - editable: boolean - Show edit buttons (admin mode)
 * - adminMode: boolean - Admin-specific features
 */

import React, { useState, useMemo } from 'react';
import { MenuItemCard } from './MenuItemCard';
import { MenuFilters } from './MenuFilters';
import { OrderedStack } from './OrderedStack';
import { useOrder } from '../../context/OrderContext';
import { getMenuItems } from '../../services/api';
import type { MenuItem } from '../../services/api';

interface MenuProps {
  compactMode?: boolean;
  onAdd?: (item: MenuItem) => void;
  editable?: boolean;
}

export const Menu: React.FC<MenuProps> = ({
  compactMode = false,
  onAdd,
  editable = false,
}) => {
  const { invoice, addItem, removeItem, updateItemQty, updateItemNote } = useOrder();
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'prep'>('name');
  const [maxPrepTime, setMaxPrepTime] = useState<number | null>(null);

  const menuItems = getMenuItems();

  const filteredItems = useMemo(() => {
    let items = [...menuItems];

    // Apply veg filter
    if (vegOnly) {
      items = items.filter((item) => item.vegNonVeg === 'veg');
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    // Apply prep time filter
    if (maxPrepTime !== null) {
      items = items.filter((item) => item.prepTime <= maxPrepTime);
    }

    // Apply sorting
    items.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      } else if (sortBy === 'prep') {
        return a.prepTime - b.prepTime;
      }
      return 0;
    });

    return items;
  }, [menuItems, searchQuery, vegOnly, sortBy, maxPrepTime]);

  const orderedItems = useMemo(() => {
    return invoice?.items || [];
  }, [invoice?.items]);

  const handleAddItem = (item: MenuItem, qty: number) => {
    if (onAdd) {
      onAdd(item);
    } else {
      for (let i = 0; i < qty; i++) {
        addItem(item);
      }
    }
  };

  if (compactMode && onAdd) {
    // Compact modal mode
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white' }}>
        <MenuFilters
          onSearch={setSearchQuery}
          onVegToggle={setVegOnly}
          onSortChange={setSortBy}
          onPrepTimeFilter={setMaxPrepTime}
          compactMode={true}
        />

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              qty={0}
              onAddItem={handleAddItem}
              disabled={!item.active}
              compactMode={true}
            />
          ))}
        </div>
      </div>
    );
  }

  // Full mode with OrderContext
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
      <h2 style={{ margin: 0, color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
        🍽️ Menu
      </h2>

      <MenuFilters
        onSearch={setSearchQuery}
        onVegToggle={setVegOnly}
        onSortChange={setSortBy}
        onPrepTimeFilter={setMaxPrepTime}
        compactMode={false}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              qty={0}
              onAddItem={handleAddItem}
              editable={editable}
              disabled={!item.active}
              compactMode={false}
            />
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', padding: '24px', textAlign: 'center', color: '#999' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>No items match your filters</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {!onAdd && invoice && invoice.items.length > 0 && (
        <OrderedStack
          items={orderedItems}
          onRemoveItem={removeItem}
          onUpdateQty={updateItemQty}
          onUpdateNote={updateItemNote}
          compactMode={false}
        />
      )}
    </div>
  );
};
