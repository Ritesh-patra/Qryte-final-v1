import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { InventoryItem } from '../services/api';

export const InventoryManagementPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    category: '',
    quantity: 0,
    unit: 'kg',
    minThreshold: 0,
    unitPrice: 0,
    supplier: '',
  });

  const categories = ['Grains', 'Proteins', 'Dairy', 'Oils', 'Condiments', 'Spices', 'Vegetables'];
  const units = ['kg', 'liters', 'pieces', 'grams', 'ml', 'units'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const invData = await api.getInventory();
    setInventory(invData);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await api.updateInventoryItem(editingId, formData);
      setInventory(prev =>
        prev.map(item => (item.id === editingId ? { ...item, ...formData } : item))
      );
    } else {
      const newItem = await api.addInventoryItem(formData as Omit<InventoryItem, 'id'>);
      setInventory(prev => [...prev, newItem]);
    }

    resetForm();
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: 0,
      unit: 'kg',
      minThreshold: 0,
      unitPrice: 0,
      supplier: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.minThreshold);
  };

  const getTotalValue = () => {
    return inventory.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const filteredInventory = filterCategory
    ? inventory.filter(item => item.category === filterCategory)
    : inventory;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>📦 Inventory Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          style={{
            padding: '12px 20px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          ➕ Add Item
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#999', margin: '0 0 10px 0', fontSize: '14px' }}>TOTAL ITEMS</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50', margin: 0 }}>{inventory.length}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#999', margin: '0 0 10px 0', fontSize: '14px' }}>TOTAL VALUE</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50', margin: 0 }}>₹{getTotalValue().toLocaleString('en-IN')}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: `4px solid ${getLowStockItems().length > 0 ? '#f44336' : '#4caf50'}` }}>
          <p style={{ color: '#999', margin: '0 0 10px 0', fontSize: '14px' }}>LOW STOCK ITEMS</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: getLowStockItems().length > 0 ? '#f44336' : '#4caf50', margin: 0 }}>
            {getLowStockItems().length}
          </p>
        </div>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit Item' : 'Add New Item'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Item Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quantity *</label>
                <input
                  type="number"
                  step="0.01"
                  name="quantity"
                  value={formData.quantity || 0}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Unit</label>
                <select
                  name="unit"
                  value={formData.unit || 'kg'}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Min Threshold</label>
                <input
                  type="number"
                  step="0.01"
                  name="minThreshold"
                  value={formData.minThreshold || 0}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Unit Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="unitPrice"
                  value={formData.unitPrice || 0}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {editingId ? '✏️ Update' : '➕ Add'} Item
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#999',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Low Stock Alert */}
      {getLowStockItems().length > 0 && (
        <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffc107' }}>
          <h3 style={{ marginTop: 0, color: '#856404' }}>⚠️ Low Stock Alert</h3>
          <p style={{ margin: '0 0 10px 0', color: '#856404' }}>The following items are below minimum threshold:</p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {getLowStockItems().map(item => (
              <li key={item.id} style={{ color: '#856404' }}>
                {item.name}: {item.quantity} {item.unit} (Min: {item.minThreshold} {item.unit})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'inline-block', marginRight: '15px', fontWeight: 'bold' }}>Filter by Category:</label>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#999', fontSize: '18px' }}>Loading inventory...</p>
      ) : filteredInventory.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', fontSize: '18px' }}>No items found</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {filteredInventory.map(item => {
            const totalValue = item.quantity * item.unitPrice;
            const isLowStock = item.quantity <= item.minThreshold;

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#fff',
                  padding: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: `3px solid ${isLowStock ? '#f44336' : '#4caf50'}`,
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '10px' }}>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>ITEM</span>
                    <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>{item.name}</p>
                  </div>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>CATEGORY</span>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>{item.category}</p>
                  </div>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>SUPPLIER</span>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>{item.supplier || 'N/A'}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', padding: '10px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>QUANTITY</span>
                    <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold', color: isLowStock ? '#f44336' : '#333' }}>
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>MIN THRESHOLD</span>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>{item.minThreshold} {item.unit}</p>
                  </div>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>UNIT PRICE</span>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>₹{item.unitPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span style={{ color: '#999', fontSize: '12px' }}>TOTAL VALUE</span>
                    <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold', color: '#4caf50' }}>₹{totalValue.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#2196F3',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#f44336',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
