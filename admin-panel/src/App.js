import React, { useState } from 'react';
import Sidebar               from './components/Sidebar';
import ManageMenu            from './components/ManageMenu';
import ManageRooms           from './components/ManageRooms';
import ManageOrders          from './components/ManageOrders';
import ManageReservations    from './components/ManageReservations';
import ManageReviews         from './components/ManageReviews';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('menu');

  return (
    <div style={styles.app}>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div style={styles.main}>
        {activeSection === 'menu'         && <ManageMenu />}
        {activeSection === 'rooms'        && <ManageRooms />}
        {activeSection === 'orders'       && <ManageOrders />}
        {activeSection === 'reservations' && <ManageReservations />}
        {activeSection === 'reviews'      && <ManageReviews />}
      </div>
    </div>
  );
}

const styles = {
  app: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  main: {
    marginLeft: '240px',
    flex: 1,
    minHeight: '100vh',
    overflowY: 'auto',
  },
};

export default App;