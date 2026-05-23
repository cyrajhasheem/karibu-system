import React from 'react';

const Navbar = ({ activeSection, setActiveSection }) => {
  const tabs = [
    { id: 'menu',        label: 'Menu',        icon: '🍽️' },
    { id: 'rooms',       label: 'Rooms',       icon: '🛏️' },
    { id: 'order',       label: 'My Order',    icon: '🛒' },
    { id: 'review',      label: 'Review',      icon: '⭐' },
    { id: 'reservation', label: 'Reservation', icon: '📅' },
  ];

  return (
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
          <span style={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    backgroundColor: '#1a1a2e',
    padding: '8px 0',
    zIndex: 1000,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.3)',
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 4px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '11px',
    gap: '4px',
    transition: 'all 0.2s',
  },
  activeTab: {
    color: '#e94560',
    borderTop: '2px solid #e94560',
  },
  icon: {
    fontSize: '24px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
  }
};

export default Navbar;