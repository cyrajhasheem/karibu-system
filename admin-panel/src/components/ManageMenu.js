import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageMenu = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');
  const [form, setForm]         = useState({
    name:        '',
    category:    'food',
    price:       '',
    description: '',
    image_url:   '',
  });

  const fetchItems = () => {
    axios.get('https://karibu-system.onrender.com/api/menu')
      .then(res => { setItems(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.price) return setError('Name and price are required.');
    try {
      await axios.post('https://karibu-system.onrender.com/api/menu', {
        name:        form.name,
        category:    form.category,
        price:       parseFloat(form.price),
        description: form.description,
        image_url:   form.image_url,
      });
      setForm({ name: '', category: 'food', price: '', description: '', image_url: '' });
      setShowForm(false);
      setError('');
      fetchItems();
    } catch (err) {
      setError('Failed to add item. Please try again.');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await axios.put(`https://karibu-system.onrender.com/api/menu/${item._id}`, {
        is_available: !item.is_available
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`https://karibu-system.onrender.com/api/menu/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Menu Management</h2>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setError(''); }}>
          {showForm ? '✕ Cancel' : '+ Add Item'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Add New Menu Item</h3>
          {error && <p style={styles.error}>{error}</p>}

          <label style={styles.label}>Item Name *</label>
          <input
            style={styles.input}
            placeholder="e.g. Grilled Chicken"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <label style={styles.label}>Category *</label>
          <select
            style={styles.input}
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="food">Food</option>
            <option value="drink">Drink</option>
            <option value="liquor">Liquor</option>
          </select>

          <label style={styles.label}>Price (TSh) *</label>
          <input
            style={styles.input}
            placeholder="e.g. 15000"
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />

          <label style={styles.label}>Description (optional)</label>
          <input
            style={styles.input}
            placeholder="Brief description of the item"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <label style={styles.label}>Photo URL (optional)</label>
          <input
            style={styles.input}
            placeholder="Paste an Unsplash or Imgur image link"
            value={form.image_url}
            onChange={e => setForm({ ...form, image_url: e.target.value })}
          />

          {/* Live image preview */}
          {form.image_url ? (
            <img
              src={form.image_url}
              alt="preview"
              style={styles.preview}
              onError={e => { e.target.style.display = 'none'; }}
              onLoad={e => { e.target.style.display = 'block'; }}
            />
          ) : null}

          <p style={styles.hint}>
            💡 Tip: Go to unsplash.com, find an image, click Share and copy the link. Add ?w=400 at the end.
          </p>

          <button style={styles.submitBtn} onClick={handleAdd}>
            ✅ Add Item
          </button>
        </div>
      )}

      {/* Items Table */}
      {loading ? (
        <p style={styles.loading}>Loading menu items...</p>
      ) : items.length === 0 ? (
        <p style={styles.loading}>No menu items yet. Add your first item!</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Photo</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id} style={styles.tr}>
                  <td style={styles.td}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={styles.thumbnail}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={styles.noImage}>No photo</div>
                    )}
                  </td>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>{item.category}</td>
                  <td style={styles.td}>TSh {item.price.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: item.is_available ? '#2ecc71' : '#e74c3c'
                    }}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.toggleBtn}
                      onClick={() => toggleAvailability(item)}
                    >
                      {item.is_available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '30px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heading: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e' },
  addBtn: { padding: '10px 20px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  formCard: { backgroundColor: '#fff', borderRadius: '14px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  formTitle: { fontSize: '17px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '5px', display: 'block', marginTop: '12px' },
  input: { width: '100%', padding: '11px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '4px', display: 'block', boxSizing: 'border-box' },
  preview: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', marginBottom: '8px', display: 'block' },
  hint: { fontSize: '12px', color: '#888', marginBottom: '16px', marginTop: '8px', fontStyle: 'italic' },
  submitBtn: { padding: '12px 24px', backgroundColor: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  error: { color: '#e74c3c', fontSize: '13px', marginBottom: '12px' },
  tableWrap: { backgroundColor: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f8f9fa' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#555', borderBottom: '1px solid #eee' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#333', verticalAlign: 'middle' },
  thumbnail: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', display: 'block' },
  noImage: { width: '50px', height: '50px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#aaa' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#fff', fontWeight: '500' },
  toggleBtn: { padding: '6px 12px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginRight: '8px' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  loading: { textAlign: 'center', color: '#888', marginTop: '40px' },
};

export default ManageMenu;