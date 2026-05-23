import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API = 'https://karibu-system.onrender.com';

const statusColors = {
  pending:   '#95a5a6',
  preparing: '#f39c12',
  ready:     '#3498db',
  delivered: '#2ecc71',
};

const ManageOrders = () => {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [notification, setNotification] = useState(null);
  const socketRef = useRef(null);
  const prevOrderIds = useRef(new Set());

  const fetchOrders = () => {
    axios.get(`${API}/api/orders`)
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => {
    fetchOrders();

    // Connect to socket for real-time new order alerts
    socketRef.current = io(API);

    socketRef.current.on('new_order', (order) => {
      // Play alert sound
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.frequency.value = 880;
        oscillator.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.8);
      } catch (e) {}

      // Show notification banner
      setNotification(`🔔 New order received! Order #${order._id.slice(-6).toUpperCase()}`);
      setTimeout(() => setNotification(null), 5000);

      // Refresh orders list
      fetchOrders();
    });

    socketRef.current.on('order_status_updated', () => {
      fetchOrders();
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/api/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>

      {/* Notification Banner */}
      {notification && (
        <div style={styles.notificationBanner}>
          {notification}
        </div>
      )}

      <div style={styles.header}>
        <h2 style={styles.heading}>Orders</h2>
        <button style={styles.refreshBtn} onClick={fetchOrders}>🔄 Refresh</button>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={styles.loading}>No orders yet.</p>
      ) : (
        <div style={styles.grid}>
          {orders.map(order => (
            <div key={order._id} style={{
              ...styles.card,
              border: order.status === 'pending' ? '2px solid #f39c12' : '2px solid transparent',
            }}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p style={styles.orderTime}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span style={{
                  ...styles.badge,
                  backgroundColor: statusColors[order.status]
                }}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div style={styles.itemsList}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={styles.orderItem}>
                    <span>{item.menu_item_id?.name || 'Item'} x{item.quantity}</span>
                    <span>TSh {(item.unit_price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalAmount}>TSh {order.total_amount.toLocaleString()}</span>
              </div>

              {order.status !== 'delivered' && (
                <div style={styles.actions}>
                  {['pending','preparing','ready','delivered'].map(status => (
                    <button
                      key={status}
                      style={{
                        ...styles.statusBtn,
                        backgroundColor: order.status === status ? statusColors[status] : '#f0f0f0',
                        color: order.status === status ? '#fff' : '#555',
                      }}
                      onClick={() => updateStatus(order._id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {order.status === 'delivered' && (
                <p style={styles.deliveredNote}>✅ Delivered</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '30px' },
  notificationBanner: {
    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
    backgroundColor: '#f39c12', color: '#fff', padding: '14px 28px',
    borderRadius: '12px', fontSize: '16px', fontWeight: '700',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: 9999,
    animation: 'none',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heading: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e' },
  refreshBtn: { padding: '10px 20px', backgroundColor: '#f0f0f0', color: '#333', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  grid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  orderId: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e' },
  orderTime: { fontSize: '12px', color: '#888', marginTop: '4px' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#fff', fontWeight: '700' },
  itemsList: { borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginBottom: '12px' },
  orderItem: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#333', padding: '4px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginBottom: '16px' },
  totalLabel: { fontSize: '14px', fontWeight: '600', color: '#888' },
  totalAmount: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e' },
  actions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  statusBtn: { padding: '8px 14px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  deliveredNote: { fontSize: '14px', fontWeight: '700', color: '#2ecc71', textAlign: 'center', padding: '8px 0' },
  loading: { textAlign: 'center', color: '#888', marginTop: '40px' },
};

export default ManageOrders;