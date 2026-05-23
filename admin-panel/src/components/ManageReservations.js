import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);

  const fetchReservations = () => {
    axios.get('https://karibu-system.onrender.com/api/reservations')
      .then(res => { setReservations(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchReservations(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://karibu-system.onrender.com/api/reservations/${id}`, { status });
      fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reservation?')) return;
    try {
      await axios.delete(`https://karibu-system.onrender.com/api/reservations/${id}`);
      fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Reservations</h2>

      {loading ? (
        <p style={styles.loading}>Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p style={styles.loading}>No reservations yet.</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Guest Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Party Size</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r._id} style={styles.tr}>
                  <td style={styles.td}>{r.guest_name}</td>
                  <td style={styles.td}>{r.guest_phone}</td>
                  <td style={styles.td}>{new Date(r.reserved_at).toLocaleString()}</td>
                  <td style={styles.td}>{r.party_size} people</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor:
                        r.status === 'confirmed' ? '#2ecc71' :
                        r.status === 'pending'   ? '#f39c12' : '#e74c3c'
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {r.status === 'pending' && (
                      <button style={styles.confirmBtn} onClick={() => updateStatus(r._id, 'confirmed')}>
                        Confirm
                      </button>
                    )}
                    <button style={styles.deleteBtn} onClick={() => handleDelete(r._id)}>
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
  heading: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', marginBottom: '24px' },
  tableWrap: { backgroundColor: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f8f9fa' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#555', borderBottom: '1px solid #eee' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#fff', fontWeight: '500' },
  confirmBtn: { padding: '6px 12px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginRight: '8px' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  loading: { textAlign: 'center', color: '#888', marginTop: '40px' },
};

export default ManageReservations;