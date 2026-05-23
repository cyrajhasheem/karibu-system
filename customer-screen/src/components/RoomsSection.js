import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TYPE_COLORS = {
  single: '#FF6B35',
  double: '#00B4D8',
  suite:  '#7B2D8B',
  family: '#1D9E75',
};

const TYPE_ICONS = {
  single: '🛏️',
  double: '🛏️🛏️',
  suite:  '👑',
  family: '👨‍👩‍👧‍👦',
};

const RoomsSection = () => {
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [form, setForm]       = useState({ guest_name: '', guest_phone: '', check_in: '', check_out: '' });
  const [success, setSuccess] = useState(false);

  const fetchRooms = () => {
    axios.get('https://karibu-system.onrender.com/api/rooms')
      .then(res => { setRooms(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSubmit = async () => {
    if (!form.guest_name || !form.guest_phone || !form.check_in || !form.check_out) {
      return alert('Please fill in all fields.');
    }
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        room_id:     booking._id,
        guest_name:  form.guest_name,
        guest_phone: form.guest_phone,
        check_in:    form.check_in,
        check_out:   form.check_out,
      });
      setSuccess(true);
      setBooking(null);
      fetchRooms();
    } catch {
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>

      {/* Hero */}
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>🛏️ Hotel Rooms</h2>
        <p style={styles.heroSub}>Comfort and luxury await you</p>
      </div>

      {/* Success Message */}
      {success && (
        <div style={styles.successMsg}>
          🎉 Room booked successfully! We will contact you to confirm.
        </div>
      )}

      {/* Booking Form */}
      {booking && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>
            {TYPE_ICONS[booking.type]} Booking Room {booking.room_number}
          </h3>
          <input
            style={styles.input}
            placeholder="Your full name"
            value={form.guest_name}
            onChange={e => setForm({ ...form, guest_name: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Your phone number"
            value={form.guest_phone}
            onChange={e => setForm({ ...form, guest_phone: e.target.value })}
          />
          <label style={styles.label}>Check-in date</label>
          <input
            style={styles.input}
            type="date"
            value={form.check_in}
            onChange={e => setForm({ ...form, check_in: e.target.value })}
          />
          <label style={styles.label}>Check-out date</label>
          <input
            style={styles.input}
            type="date"
            value={form.check_out}
            onChange={e => setForm({ ...form, check_out: e.target.value })}
          />
          <div style={styles.formBtns}>
            <button style={styles.cancelBtn} onClick={() => setBooking(null)}>Cancel</button>
            <button
              style={{ ...styles.confirmBtn, backgroundColor: TYPE_COLORS[booking.type] }}
              onClick={handleSubmit}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      {loading ? (
        <div style={styles.loading}>Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div style={styles.loading}>No rooms available yet.</div>
      ) : (
        <div style={styles.grid}>
          {rooms.map(room => (
            <div key={room._id} style={styles.card}>

              {/* Square Image Box */}
              <div style={{
                ...styles.imageBox,
                backgroundImage: `url(${room.image_url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'})`,
              }}>
                <div style={{
                  ...styles.typeBadge,
                  backgroundColor: TYPE_COLORS[room.type],
                }}>
                  {TYPE_ICONS[room.type]} {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                </div>
                <div style={{
                  ...styles.availBadge,
                  backgroundColor: room.is_available ? '#2ecc71' : '#e74c3c',
                }}>
                  {room.is_available ? '✓ Available' : '✗ Booked'}
                </div>
              </div>

              {/* Room Info */}
              <div style={styles.cardBody}>
                <p style={{
                  ...styles.roomLabel,
                  color: TYPE_COLORS[room.type],
                }}>
                  {TYPE_ICONS[room.type]} {room.type.toUpperCase()}
                </p>
                <h3 style={styles.roomNumber}>Room {room.room_number}</h3>
                {room.description && (
                  <p style={styles.description}>{room.description}</p>
                )}
                <div style={styles.cardFooter}>
                  <div>
                    <p style={{
                      ...styles.price,
                      color: TYPE_COLORS[room.type],
                    }}>
                      Tsh {room.price_per_night.toLocaleString()}
                    </p>
                    <p style={styles.perNight}>per night</p>
                  </div>
                  {room.is_available && (
                    <button
                      style={{
                        ...styles.bookBtn,
                        backgroundColor: TYPE_COLORS[room.type],
                      }}
                      onClick={() => { setBooking(room); setSuccess(false); }}
                    >
                      BOOK
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

const styles = {
  container: { paddingBottom: '100px', backgroundColor: '#f8f8f8' },
  hero: {
    padding: '28px 20px 24px',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
  },
  heroTitle: { color: '#fff', fontSize: '26px', fontWeight: '800', margin: '0 0 4px' },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '14px',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 3px 12px rgba(0,0,0,0.09)',
    display: 'flex',
    flexDirection: 'column',
  },

  imageBox: {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#f0f0f0',
  },

  typeBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
  },

  availBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
  },

  cardBody: {
    padding: '10px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },

  roomLabel: {
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '1px',
    margin: '0 0 6px',
    textTransform: 'uppercase',
  },

  roomNumber: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#1a1a2e',
    margin: '0 0 6px',
    lineHeight: '1.3',
  },

  description: {
    fontSize: '13px',
    color: '#999',
    margin: '0 0 10px',
    lineHeight: '1.5',
    flex: 1,
  },

  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },

  price: {
    fontSize: '18px',
    fontWeight: '800',
    margin: 0,
  },

  perNight: {
    fontSize: '12px',
    color: '#aaa',
    margin: '2px 0 0',
  },

  bookBtn: {
    padding: '10px 16px',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },

  formCard: {
    margin: '16px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
  },
  formTitle: { fontSize: '16px', fontWeight: '800', color: '#1a1a2e', marginBottom: '16px' },
  input: {
    width: '100%',
    padding: '12px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '10px',
    display: 'block',
    boxSizing: 'border-box',
  },
  label: { fontSize: '12px', color: '#888', marginBottom: '4px', display: 'block' },
  formBtns: { display: 'flex', gap: '10px', marginTop: '12px' },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    border: '1.5px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1,
    padding: '12px',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  successMsg: {
    margin: '16px',
    backgroundColor: '#eafaf1',
    border: '1.5px solid #2ecc71',
    borderRadius: '12px',
    padding: '14px 16px',
    color: '#27ae60',
    fontWeight: '700',
    fontSize: '14px',
  },
  loading: { textAlign: 'center', color: '#888', marginTop: '60px', fontSize: '16px' },
};

export default RoomsSection;