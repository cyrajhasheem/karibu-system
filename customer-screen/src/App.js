import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Navbar             from './components/Navbar';
import MenuSection        from './components/MenuSection';
import RoomsSection       from './components/RoomsSection';
import OrderSection       from './components/OrderSection';
import ReviewSection      from './components/ReviewSection';
import ReservationSection from './components/ReservationSection';
import './App.css';

const socket = io('http://localhost:5000');

// Table ID for this screen — in production each tablet has its own ID
const TABLE_ID = '000000000000000000000001';

function App() {
  const [activeSection, setActiveSection] = useState('menu');

  // Load cart from localStorage on startup
  const [orderItems, setOrderItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(orderItems));
  }, [orderItems]);

  const handleAddToOrder = (item) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setActiveSection('order');
  };

  const totalItems = orderItems.reduce((sum, i) => sum + i.quantity, 0); 

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Welcome To <em>🍽️KARIBU SYSTEM</em></h1>
        <span
          style={styles.cartCount}
          onClick={() => setActiveSection('order')}
        >
          🛒 {totalItems}
        </span>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {activeSection === 'menu'        && <MenuSection onAddToOrder={handleAddToOrder} />}
        {activeSection === 'rooms'       && <RoomsSection />}
        {activeSection === 'order'       && (
          <OrderSection
            orderItems={orderItems}
            setOrderItems={setOrderItems}
            tableId={TABLE_ID}
            socket={socket}
          />
        )}
        {activeSection === 'review'      && <ReviewSection />}
        {activeSection === 'reservation' && <ReservationSection />}
      </div>

      {/* Bottom Navigation */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
    </div>
  );
}

const styles = {
  app: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#1a1a2e',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 999
  },
  headerTitle: { color: '#fff', fontSize: '20px', fontWeight: '700' },
  cartCount: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: '#e94560',
    padding: '6px 14px',
    borderRadius: '20px',
  },
  content: { paddingBottom: '70px' },
};

export default App;