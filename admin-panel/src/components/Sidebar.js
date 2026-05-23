import React from 'react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const tabs = [
    { id: 'menu',         label: 'Menu Management',  icon: '🍽️' },
    { id: 'rooms',        label: 'Room Management',   icon: '🛏️' },
    { id: 'orders',       label: 'Orders',            icon: '📦' },
    { id: 'reservations', label: 'Reservations',      icon: '📅' },
    { id: 'reviews',      label: 'Reviews',           icon: '⭐' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h2 style={styles.logoText}>🏨 Karibu System</h2>
      </div>
      <nav style={styles.nav}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            style={{
              ...styles.tab,
              ...(activeSection === tab.id ? styles.activeTab : {})
            }}
          >
            <span style={styles.icon}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
  },
  logo: {
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoText: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '700',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 0',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeTab: {
    backgroundColor: 'rgba(233,69,96,0.15)',
    color: '#e94560',
    borderLeft: '3px solid #e94560',
  },
  icon: {
    fontSize: '18px',
  },
};

export default Sidebar;