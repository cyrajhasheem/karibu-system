import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageReviews = () => {
  const [reviews, setReviews]   = useState([]);
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/reviews')
      .then(res => { setReviews(res.data); setLoading(false); });
    axios.get('http://localhost:5000/api/reviews/summary')
      .then(res => setSummary(res.data));
  }, []);

  const Stars = ({ count }) => (
    <span>{Array.from({ length: 5 }, (_, i) => i < count ? '⭐' : '☆').join('')}</span>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Customer Reviews</h2>

      {/* Summary Cards */}
      {summary && summary.total_reviews > 0 && (
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <p style={styles.summaryValue}>{summary.total_reviews}</p>
            <p style={styles.summaryLabel}>Total Reviews</p>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryValue}>{summary.food_avg} ⭐</p>
            <p style={styles.summaryLabel}>Food Avg</p>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryValue}>{summary.service_avg} ⭐</p>
            <p style={styles.summaryLabel}>Service Avg</p>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryValue}>{summary.ambiance_avg} ⭐</p>
            <p style={styles.summaryLabel}>Ambiance Avg</p>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <p style={styles.loading}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p style={styles.loading}>No reviews yet.</p>
      ) : (
        <div style={styles.grid}>
          {reviews.map(review => (
            <div key={review._id} style={styles.card}>
              <div style={styles.ratingRow}>
                <div style={styles.ratingItem}>
                  <span style={styles.ratingLabel}>Food</span>
                  <Stars count={review.food_rating} />
                </div>
                <div style={styles.ratingItem}>
                  <span style={styles.ratingLabel}>Service</span>
                  <Stars count={review.service_rating} />
                </div>
                <div style={styles.ratingItem}>
                  <span style={styles.ratingLabel}>Ambiance</span>
                  <Stars count={review.ambiance_rating} />
                </div>
              </div>
              {review.comment && (
                <p style={styles.comment}>"{review.comment}"</p>
              )}
              <p style={styles.date}>{new Date(review.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '30px' },
  heading: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', marginBottom: '24px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' },
  summaryCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  summaryValue: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px' },
  summaryLabel: { fontSize: '13px', color: '#888' },
  grid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  ratingRow: { display: 'flex', gap: '24px', marginBottom: '12px' },
  ratingItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  ratingLabel: { fontSize: '12px', color: '#888', fontWeight: '600' },
  comment: { fontSize: '14px', color: '#555', fontStyle: 'italic', marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' },
  date: { fontSize: '12px', color: '#aaa' },
  loading: { textAlign: 'center', color: '#888', marginTop: '40px' },
};

export default ManageReviews;