import React, { useState } from 'react';
import axios from 'axios';

const ReviewSection = () => {
  const [form, setForm]       = useState({ food_rating: 0, service_rating: 0, ambiance_rating: 0, comment: '' });
  const [orderId, setOrderId] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const StarRow = ({ label, field }) => (
    <div style={styles.starRow}>
      <span style={styles.starLabel}>{label}</span>
      <div style={styles.stars}>
        {[1,2,3,4,5].map(star => (
          <button
            key={star}
            style={styles.star}
            onClick={() => setForm({ ...form, [field]: star })}
          >
            {star <= form[field] ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    </div>
  );

  const handleSubmit = async () => {
    if (!orderId) return setError('Please enter your Order ID.');
    if (form.food_rating === 0 || form.service_rating === 0 || form.ambiance_rating === 0) {
      return setError('Please rate all three categories.');
    }
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        order_id:        orderId,
        food_rating:     form.food_rating,
        service_rating:  form.service_rating,
        ambiance_rating: form.ambiance_rating,
        comment:         form.comment,
      });
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Failed to submit review. Please check your Order ID.');
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <p style={styles.successIcon}>🎉</p>
          <h3 style={styles.successTitle}>Thank you for your review!</h3>
          <p style={styles.successText}>Your feedback helps us serve you better.</p>
          <button style={styles.resetBtn} onClick={() => { setSuccess(false); setForm({ food_rating: 0, service_rating: 0, ambiance_rating: 0, comment: '' }); setOrderId(''); }}>
            Submit Another Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Rate Your Experience</h2>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.card}>
        <label style={styles.label}>Order ID</label>
        <input
          style={styles.input}
          placeholder="Enter your order ID"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
        />

        <StarRow label="Food Quality"  field="food_rating"     />
        <StarRow label="Service"       field="service_rating"  />
        <StarRow label="Ambiance"      field="ambiance_rating" />

        <label style={styles.label}>Comment (optional)</label>
        <textarea
          style={styles.textarea}
          placeholder="Tell us about your experience..."
          value={form.comment}
          onChange={e => setForm({ ...form, comment: e.target.value })}
        />

        <button style={styles.submitBtn} onClick={handleSubmit}>
          Submit Review ⭐
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px 16px 100px' },
  heading: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  label: { fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px', display: 'block', marginTop: '14px' },
  input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  starRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' },
  starLabel: { fontSize: '14px', fontWeight: '600', color: '#333' },
  stars: { display: 'flex', gap: '6px' },
  star: { fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' },
  textarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', minHeight: '90px', marginTop: '6px', resize: 'vertical' },
  submitBtn: { width: '100%', padding: '14px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', marginTop: '20px' },
  error: { backgroundColor: '#fff0f0', border: '1px solid #e74c3c', borderRadius: '8px', padding: '10px 14px', color: '#e74c3c', marginBottom: '14px', fontSize: '13px' },
  successBox: { textAlign: 'center', marginTop: '60px' },
  successIcon: { fontSize: '60px', marginBottom: '16px' },
  successTitle: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
  successText: { fontSize: '14px', color: '#888', marginBottom: '24px' },
  resetBtn: { padding: '12px 28px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600' },
};

export default ReviewSection;