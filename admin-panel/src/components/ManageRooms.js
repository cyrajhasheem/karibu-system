import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageRooms = () => {
  const [rooms, setRooms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');
  const [form, setForm]         = useState({
    room_number:     '',
    type:            'single',
    price_per_night: '',
    description:     '',
    image_url:       '',
  });

  const fetchRooms = () => {
    axios.get('http://localhost:5000/api/rooms')
      .then(res => { setRooms(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleAdd = async () => {
    if (!form.room_number || !form.price_per_night) return setError('Room number and price are required.');
    try {
      await axios.post('http://localhost:5000/api/rooms', {
        room_number:     form.room_number,
        type:            form.type,
        price_per_night: parseFloat(form.price_per_night),
        description:     form.description,
        image_url:       form.image_url,
      });
      setForm({ room_number: '', type: 'single', price_per_night: '', description: '', image_url: '' });
      setShowForm(false);
      setError('');
      fetchRooms();
    } catch (err) {
      setError('Failed to add room. Room number may already exist.');
    }
  };

  const toggleAvailability = async (room) => {
    try {
      await axios.put(`http://localhost:5000/api/rooms/${room._id}`, {
        is_available: !room.is_available
      });
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Room Management</h2>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setError(''); }}>
          {showForm ? '✕ Cancel' : '+ Add Room'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Add New Room</h3>
          {error && <p style={styles.error}>{error}</p>}

          <label style={styles.label}>Room Number *</label>
          <input
            style={styles.input}
            placeholder="e.g. 101"
            value={form.room_number}
            onChange={e => setForm({ ...form, room_number: e.target.value })}
          />

          <label style={styles.label}>Room Type *</label>
          <select
            style={styles.input}
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
            <option value="family">Family</option>
          </select>

          <label style={styles.label}>Price Per Night (TSh) *</label>
          <input
            style={styles.input}
            placeholder="e.g. 80000"
            type="number"
            value={form.price_per_night}
            onChange={e => setForm({ ...form, price_per_night: e.target.value })}
          />

          <label style={styles.label}>Description (optional)</label>
          <input
            style={styles.input}
            placeholder="Brief description of the room"
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
            💡 Tip: Go to unsplash.com, search for a hotel room, click Share and copy the link. Add ?w=400 at the end.
          </p>

          <button style={styles.submitBtn} onClick={handleAdd}>
            ✅ Add Room
          </button>
        </div>
      )}

      {/* Rooms Table */}
      {loading ? (
        <p style={styles.loading}>Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p style={styles.loading}>No rooms yet. Add your first room!</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Photo</th>
                <th style={styles.th}>Room No.</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Price/Night</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room._id} style={styles.tr}>
                  <td style={styles.td}>
                    {room.image_url ? (
                      <img
                        src={room.image_url}
                        alt={`Room ${room.room_number}`}
                        style={styles.thumbnail}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={styles.noImage}>No photo</div>
                    )}
                  </td>
                  <td style={styles.td}><strong>{room.room_number}</strong></td>
                  <td style={styles.td}>{room.type.charAt(0).toUpperCase() + room.type.slice(1)}</td>
                  <td style={styles.td}>TSh {room.price_per_night.toLocaleString()}</td>
                  <td style={styles.td}>{room.description || '—'}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: room.is_available ? '#2ecc71' : '#e74c3c'
                    }}>
                      {room.is_available ? 'Available' : 'Booked'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.toggleBtn}
                      onClick={() => toggleAvailability(room)}
                    >
                      {room.is_available ? 'Mark Booked' : 'Mark Available'}
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(room._id)}
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
  preview: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', marginBottom: '8px', display: 'block' },
  hint: { fontSize: '12px', color: '#888', marginBottom: '16px', marginTop: '8px', fontStyle: 'italic' },
  submitBtn: { padding: '12px 24px', backgroundColor: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  error: { color: '#e74c3c', fontSize: '13px', marginBottom: '12px' },
  tableWrap: { backgroundColor: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f8f9fa' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#555', borderBottom: '1px solid #eee' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#333', verticalAlign: 'middle' },
  thumbnail: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', display: 'block' },
  noImage: { width: '60px', height: '60px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#aaa', textAlign: 'center' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#fff', fontWeight: '500' },
  toggleBtn: { padding: '6px 12px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginRight: '8px' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  loading: { textAlign: 'center', color: '#888', marginTop: '40px' },
};

export default ManageRooms;