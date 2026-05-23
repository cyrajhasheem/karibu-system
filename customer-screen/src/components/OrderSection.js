import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://karibu-system.onrender.com';
const TABLE_ID = '000000000000000000000001';

const OrderSection = ({ orderItems, setOrderItems, socket }) => {
  const [placedOrder, setPlacedOrder] = useState(null);
  const [timeLeft, setTimeLeft]       = useState(null);
  const [placing, setPlacing]         = useState(false);

  useEffect(() => {
    const savedOrderId = localStorage.getItem('active_order_id');
    if (savedOrderId) {
      axios.get(`${API}/api/orders/${savedOrderId}`)
        .then(res => {
          const order = res.data;
          if (order && order.status !== 'delivered') {
            setPlacedOrder(order);
          } else {
            localStorage.removeItem('active_order_id');
          }
        })
        .catch(() => localStorage.removeItem('active_order_id'));
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('order_status_updated', (updatedOrder) => {
      if (placedOrder && updatedOrder._id === placedOrder._id) {
        setPlacedOrder(updatedOrder);
      }
    });
    return () => socket.off('order_status_updated');
  }, [socket, placedOrder]);

  // Countdown timer — stops when delivered
  useEffect(() => {
    if (!placedOrder || !placedOrder.estimated_ready) return;
    if (placedOrder.status === 'delivered') {
      setTimeLeft(null);
      return;
    }
    const interval = setInterval(() => {
      const diff = new Date(placedOrder.estimated_ready) - new Date();
      if (diff <= 0) {
        setTimeLeft('Your order is ready!');
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [placedOrder]);

  const updateQty = (id, delta) => {
    setOrderItems(prev => prev
      .map(i => i._id === id ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const placeOrder = async () => {
    if (orderItems.length === 0) return alert('Add items to your order first!');
    setPlacing(true);
    try {
      const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const res = await axios.post(`${API}/api/orders`, {
        table_id: TABLE_ID,
        items: orderItems.map(i => ({
          menu_item_id: i._id,
          quantity:     i.quantity,
          unit_price:   i.price,
        })),
        total_amount: total,
      });
      localStorage.setItem('active_order_id', res.data._id);
      setPlacedOrder(res.data);
      setOrderItems([]);
      localStorage.removeItem('cart');
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
    setPlacing(false);
  };

  const handleNewOrder = () => {
    setPlacedOrder(null);
    localStorage.removeItem('active_order_id');
  };

  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Order</h2>

      {placedOrder && (
        <div style={styles.statusCard}>
          <h3 style={styles.statusTitle}>Order Placed! 🎉</h3>
          <p style={styles.orderId}>
            Order ID: <strong>{placedOrder._id}</strong>
          </p>
          <div style={styles.statusRow}>
            <span style={styles.statusLabel}>Status:</span>
            <span style={{
              ...styles.statusBadge,
              backgroundColor:
                placedOrder.status === 'delivered' ? '#2ecc71' :
                placedOrder.status === 'ready'     ? '#3498db' :
                placedOrder.status === 'preparing' ? '#f39c12' : '#95a5a6'
            }}>
              {placedOrder.status.toUpperCase()}
            </span>
          </div>

          {placedOrder.status === 'delivered' ? (
            <div style={{ ...styles.timerBox, backgroundColor: '#eafaf1' }}>
              <span style={{ ...styles.timerLabel, color: '#2ecc71', fontSize: '20px', fontWeight: '700' }}>
                ✅ Your order has been delivered. Enjoy your meal!
              </span>
            </div>
          ) : timeLeft && (
            <div style={styles.timerBox}>
              <span style={styles.timerLabel}>⏱️ Ready in:</span>
              <span style={styles.timerValue}>{timeLeft}</span>
            </div>
          )}

          <button style={styles.newOrderBtn} onClick={handleNewOrder}>
            Place Another Order
          </button>
        </div>
      )}

      {!placedOrder && (
        <>
          {orderItems.length === 0 ? (
            <div style={styles.emptyCart}>
              <p style={styles.emptyText}>Your order is empty.</p>
              <p style={styles.emptySubtext}>Go to the Menu tab and add items!</p>
            </div>
          ) : (
            <>
              <div style={styles.itemsList}>
                {orderItems.map(item => (
                  <div key={item._id} style={styles.orderItem}>
                    <div style={styles.orderItemInfo}>
                      <span style={styles.orderItemName}>{item.name}</span>
                      <span style={styles.orderItemPrice}>
                        TSh {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    <div style={styles.qtyControls}>
                      <button style={styles.qtyBtn} onClick={() => updateQty(item._id, -1)}>−</button>
                      <span style={styles.qtyNum}>{item.quantity}</span>
                      <button style={styles.qtyBtn} onClick={() => updateQty(item._id, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalAmount}>TSh {total.toLocaleString()}</span>
              </div>

              <button
                style={styles.placeBtn}
                onClick={placeOrder}
                disabled={placing}
              >
                {placing ? 'Placing Order...' : '✅ Place Order'}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px 16px 100px' },
  heading: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px' },
  statusCard: { backgroundColor: '#fff', borderRadius: '14px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  statusTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
  orderId: { fontSize: '12px', color: '#888', marginBottom: '14px', wordBreak: 'break-all' },
  statusRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' },
  statusLabel: { fontSize: '14px', color: '#888' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#fff', fontWeight: '700' },
  timerBox: { backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '14px', textAlign: 'center', marginBottom: '14px' },
  timerLabel: { display: 'block', fontSize: '13px', color: '#888', marginBottom: '6px' },
  timerValue: { fontSize: '28px', fontWeight: '700', color: '#e94560' },
  newOrderBtn: { width: '100%', padding: '12px', backgroundColor: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  emptyCart: { textAlign: 'center', marginTop: '60px' },
  emptyText: { fontSize: '18px', fontWeight: '600', color: '#888' },
  emptySubtext: { fontSize: '14px', color: '#aaa', marginTop: '8px' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
  orderItem: { backgroundColor: '#fff', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.07)' },
  orderItemInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  orderItemName: { fontSize: '15px', fontWeight: '600', color: '#1a1a2e' },
  orderItemPrice: { fontSize: '15px', fontWeight: '700', color: '#e94560' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '12px' },
  qtyBtn: { width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5', fontSize: '18px', fontWeight: '700', color: '#333', cursor: 'pointer' },
  qtyNum: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', minWidth: '20px', textAlign: 'center' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.07)' },
  totalLabel: { fontSize: '16px', fontWeight: '600', color: '#888' },
  totalAmount: { fontSize: '20px', fontWeight: '700', color: '#1a1a2e' },
  placeBtn: { width: '100%', padding: '16px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
};

export default OrderSection;