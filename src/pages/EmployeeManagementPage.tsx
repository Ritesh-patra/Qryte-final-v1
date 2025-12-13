import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Employee } from '../services/api';

export const EmployeeManagementPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: { amount: 0, currency: 'INR', paymentFrequency: 'monthly' },
    leaves: { totalLeaves: 20, usedLeaves: 0, availableLeaves: 20 },
    basicDetails: { dob: '', address: '', joinDate: '' },
    active: true,
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    const data = await api.getEmployees();
    setEmployees(data);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...((prev as any)[parent] || {}),
          [child]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await api.updateEmployee(editingId, formData);
      setEmployees(prev =>
        prev.map(emp => (emp.id === editingId ? { ...emp, ...formData } : emp))
      );
    } else {
      const newEmp = await api.addEmployee(formData as Omit<Employee, 'id'>);
      setEmployees(prev => [...prev, newEmp]);
    }

    resetForm();
  };

  const handleEdit = (emp: Employee) => {
    setFormData(emp);
    setEditingId(emp.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await api.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      employeeId: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: { amount: 0, currency: 'INR', paymentFrequency: 'monthly' },
      leaves: { totalLeaves: 20, usedLeaves: 0, availableLeaves: 20 },
      basicDetails: { dob: '', address: '', joinDate: '' },
      active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>👥 Employee Management</h1>
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
          ➕ Add Employee
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name *</label>
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Employee ID *</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId || ''}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleInputChange}
                  placeholder="Chef, Waiter, Manager, etc."
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Department</label>
                <select
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">Select Department</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Front of House">Front of House</option>
                  <option value="Administration">Administration</option>
                  <option value="Cleaning">Cleaning</option>
                </select>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '15px' }}>
              <h3 style={{ marginTop: 0 }}>Basic Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date of Birth</label>
                  <input
                    type="date"
                    name="basicDetails.dob"
                    value={formData.basicDetails?.dob || ''}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address</label>
                  <input
                    type="text"
                    name="basicDetails.address"
                    value={formData.basicDetails?.address || ''}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Join Date</label>
                  <input
                    type="date"
                    name="basicDetails.joinDate"
                    value={formData.basicDetails?.joinDate || ''}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Aadhaar Card (Upload)</label>
                  <input
                    type="text"
                    name="aadhaarCard"
                    value={formData.aadhaarCard || ''}
                    onChange={handleInputChange}
                    placeholder="File path or name"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '15px' }}>
              <h3 style={{ marginTop: 0 }}>Salary Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Salary Amount</label>
                  <input
                    type="number"
                    name="salary.amount"
                    value={formData.salary?.amount || 0}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Currency</label>
                  <input
                    type="text"
                    name="salary.currency"
                    value={formData.salary?.currency || 'INR'}
                    onChange={handleInputChange}
                    disabled
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#f0f0f0' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Payment Frequency</label>
                  <select
                    name="salary.paymentFrequency"
                    value={formData.salary?.paymentFrequency || 'monthly'}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '15px' }}>
              <h3 style={{ marginTop: 0 }}>Leave Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Total Leaves</label>
                  <input
                    type="number"
                    name="leaves.totalLeaves"
                    value={formData.leaves?.totalLeaves || 20}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Used Leaves</label>
                  <input
                    type="number"
                    name="leaves.usedLeaves"
                    value={formData.leaves?.usedLeaves || 0}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Available Leaves</label>
                  <input
                    type="number"
                    name="leaves.availableLeaves"
                    value={formData.leaves?.availableLeaves || 20}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
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
                {editingId ? '✏️ Update' : '➕ Add'} Employee
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

      {loading ? (
        <p style={{ textAlign: 'center', color: '#999', fontSize: '18px' }}>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', fontSize: '18px' }}>No employees yet. Add one to get started!</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {employees.map(emp => (
            <div
              key={emp.id}
              style={{
                backgroundColor: '#fff',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: `3px solid ${emp.active ? '#4caf50' : '#f44336'}`,
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '10px' }}>
                <div>
                  <span style={{ color: '#999', fontSize: '12px' }}>NAME</span>
                  <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>{emp.name}</p>
                </div>
                <div>
                  <span style={{ color: '#999', fontSize: '12px' }}>EMPLOYEE ID</span>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>{emp.employeeId}</p>
                </div>
                <div>
                  <span style={{ color: '#999', fontSize: '12px' }}>POSITION</span>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>{emp.position}</p>
                </div>
                <div>
                  <span style={{ color: '#999', fontSize: '12px' }}>DEPARTMENT</span>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>{emp.department}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', padding: '10px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
                <div>
                  <span style={{ color: '#999', fontSize: '12px' }}>EMAIL</span>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>{emp.email || 'N/A'}</p>
                </div>
                <div>
                  <span style={{ color: '#999', fontSize: '12px' }}>PHONE</span>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>{emp.phone || 'N/A'}</p>
                </div>
                <div>
                  <span style={{ color: '#999', fontSize: '12px' }}>SALARY</span>
                  <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold' }}>
                    ₹{(emp.salary?.amount || 0).toLocaleString('en-IN')} {emp.salary?.paymentFrequency}
                  </p>
                </div>
                <div>
                  <span style={{ color: '#999', fontSize: '12px' }}>LEAVES</span>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>
                    {emp.leaves?.availableLeaves || 0} / {emp.leaves?.totalLeaves || 20}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleEdit(emp)}
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
                  onClick={() => handleDelete(emp.id)}
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
          ))}
        </div>
      )}
    </div>
  );
};
