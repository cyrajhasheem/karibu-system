import React, { useState } from 'react';
import axios from 'axios';

const ReservationSection = () => {
  const [form, setForm]     = useState({ guest_name: '', guest_phone: '', reserved_at: '', party_size: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async () => {
    if (!form.guest_name || !form.guest_phone || !form.reserved_at || !form.party_size) {
      return setError('Please fill in all fields.');
    }
    try {
      await axios.post('http://localhost:5000/api/reservations', {
        guest_name:  form.guest_name,
        guest_phone: form.guest_phone,
        reserved_at: form.reserved_at,
        party_size:  parseInt(form.party_size),
      });
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Failed to make reservation. Please try again.');
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <p style={styles.successIcon}>📅</p>
          <h3 style={styles.successTitle}>Reservation Confirmed!</h3>
          <p style={styles.successText}>We look forward to seeing you. We will contact you to confirm your booking.</p>
          <button style={styles.resetBtn} onClick={() => { setSuccess(false); setForm({ guest_name: '', guest_phone: '', reserved_at: '', party_size: '' }); }}>
            Make Another Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Make a Reservation</h2>
      <p style={styles.subheading}>Book a table for your next visit</p>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.card}>
        <label style={styles.label}>Full Name</label>
        <input
          style={styles.input}
          placeholder="Enter your full name"
          value={form.guest_name}
          onChange={e => setForm({ ...form, guest_name: e.target.value })}
        />

        <label style={styles.label}>Phone Number</label>
        <input
          style={styles.input}
          placeholder="Enter your phone number"
          value={form.guest_phone}
          onChange={e => setForm({ ...form, guest_phone: e.target.value })}
        />

        <label style={styles.label}>Date and Time</label>
        <input
          style={styles.input}
          type="datetime-local"
          value={form.reserved_at}
          onChange={e => setForm({ ...form, reserved_at: e.target.value })}
        />

        <label style={styles.label}>Number of People</label>
        <input
          style={styles.input}
          type="number"
          placeholder="How many people?"
          min="1"
          value={form.party_size}
          onChange={e => setForm({ ...form, party_size: e.target.value })}
        />

        <button style={styles.submitBtn} onClick={handleSubmit}>
          Confirm Reservation 📅
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px 16px 100px' },
  heading: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' },
  subheading: { fontSize: '14px', color: '#888', marginBottom: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  label: { fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px', display: 'block', marginTop: '14px' },
  input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  submitBtn: { width: '100%', padding: '14px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', marginTop: '24px' },
  error: { backgroundColor: '#fff0f0', border: '1px solid #e74c3c', borderRadius: '8px', padding: '10px 14px', color: '#e74c3c', marginBottom: '14px', fontSize: '13px' },
  successBox: { textAlign: 'center', marginTop: '60px' },
  successIcon: { fontSize: '60px', marginBottom: '16px' },
  successTitle: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
  successText: { fontSize: '14px', color: '#888', marginBottom: '24px' },
  resetBtn: { padding: '12px 28px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600' },
};

export default ReservationSection;