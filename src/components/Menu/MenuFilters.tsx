/**
 * MenuFilters
 * ===========
 * Search, veg toggle, sorting, and prep time filtering for menu items.
 */

import React, { useState } from 'react';

interface MenuFiltersProps {
  onSearch: (query: string) => void;
  onVegToggle: (vegOnly: boolean) => void;
  onSortChange: (sort: 'name' | 'price' | 'prep') => void;
  onPrepTimeFilter: (maxTime: number | null) => void;
  compactMode?: boolean;
}

export const MenuFilters: React.FC<MenuFiltersProps> = ({
  onSearch,
  onVegToggle,
  onSortChange,
  onPrepTimeFilter,
  compactMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState<'name' | 'price' | 'prep'>('name');
  const [maxPrepTime, setMaxPrepTime] = useState<number | null>(null);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleVegToggle = () => {
    const newVegOnly = !vegOnly;
    setVegOnly(newVegOnly);
    onVegToggle(newVegOnly);
  };

  const handleSortChange = (newSort: 'name' | 'price' | 'prep') => {
    setSort(newSort);
    onSortChange(newSort);
  };

  const handlePrepTimeFilter = (time: number | null) => {
    setMaxPrepTime(time);
    onPrepTimeFilter(time);
  };

  if (compactMode) {
    return (
      <div style={{ padding: '10px 12px', borderBottom: '2px solid #4caf50', backgroundColor: '#f9f9f9' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search menu items"
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '6px 10px',
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />

          <button
            onClick={handleVegToggle}
            aria-label={vegOnly ? 'Show all items' : 'Show veg items only'}
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              backgroundColor: vegOnly ? '#4caf50' : '#fff',
              color: vegOnly ? '#fff' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🥬 Veg
          </button>

          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as 'name' | 'price' | 'prep')}
            aria-label="Sort menu items"
            style={{
              padding: '6px 8px',
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            <option value="name">Name</option>
            <option value="price">Price ↑</option>
            <option value="prep">Prep Time</option>
          </select>

          <select
            value={maxPrepTime ?? ''}
            onChange={(e) => handlePrepTimeFilter(e.target.value ? parseInt(e.target.value) : null)}
            aria-label="Filter by prep time"
            style={{
              padding: '6px 8px',
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            <option value="">All Prep Time</option>
            <option value="10">≤10m</option>
            <option value="20">≤20m</option>
            <option value="30">≤30m</option>
          </select>
        </div>
      </div>
    );
  }

  // Full mode
  return (
    <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
            Search
          </label>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search menu items"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '13px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
            Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as 'name' | 'price' | 'prep')}
            aria-label="Sort menu items"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '13px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          >
            <option value="name">Name</option>
            <option value="price">Price (Low to High)</option>
            <option value="prep">Prep Time</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
            Prep Time
          </label>
          <select
            value={maxPrepTime ?? ''}
            onChange={(e) => handlePrepTimeFilter(e.target.value ? parseInt(e.target.value) : null)}
            aria-label="Filter by prep time"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '13px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          >
            <option value="">All Prep Times</option>
            <option value="10">≤10 minutes</option>
            <option value="20">≤20 minutes</option>
            <option value="30">≤30 minutes</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            onClick={handleVegToggle}
            aria-label={vegOnly ? 'Show all items' : 'Show veg items only'}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '13px',
              backgroundColor: vegOnly ? '#4caf50' : '#fff',
              color: vegOnly ? '#fff' : '#333',
              border: vegOnly ? '1px solid #4caf50' : '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
            }}
          >
            🥬 Veg Only {vegOnly && '✓'}
          </button>
        </div>
      </div>
    </div>
  );
};
