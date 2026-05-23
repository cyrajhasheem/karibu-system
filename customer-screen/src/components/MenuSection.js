import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CATEGORY_CONFIG = {
  food:   { icon: '🍽️', color: '#FF6B35', gradient: 'linear-gradient(135deg, #FF6B35, #FF8C5A)' },
  drink:  { icon: '🥤', color: '#00B4D8', gradient: 'linear-gradient(135deg, #00B4D8, #0096C7)' },
  liquor: { icon: '🍷', color: '#7B2D8B', gradient: 'linear-gradient(135deg, #7B2D8B, #9B59B6)' },
};

const MenuSection = ({ onAddToOrder }) => {
  const [items, setItems]       = useState([]);
  const [category, setCategory] = useState('food');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/menu')
      .then(res => { setItems(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter(i => i.category === category);
  const config   = CATEGORY_CONFIG[category];

  return (
    <div style={styles.container}>

      {/* Hero Header */}
      <div style={{ ...styles.hero, background: config.gradient }}>
        <h2 style={styles.heroTitle}>🍽️ Our Menu</h2>
        <p style={styles.heroSub}>Fresh, delicious, made for you</p>
      </div>

      {/* Category Tabs */}
      <div style={styles.tabs}>
        {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              ...styles.tabBtn,
              background: category === cat ? cfg.gradient : '#f5f5f5',
              color: category === cat ? '#fff' : '#555',
              border: category === cat ? 'none' : '1px solid #ddd',
            }}
          >
            {cfg.icon} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div style={styles.loading}>Loading menu...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.loading}>No items in this category yet.</div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(item => (
            <div key={item._id} style={styles.card}>

              {/* Image Box */}
              <div style={{
                ...styles.imageBox,
                backgroundImage: `url(${item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'})`,
              }}>
                {/* Availability Badge */}
                <div style={{
                  ...styles.badge,
                  backgroundColor: item.is_available ? '#2ecc71' : '#e74c3c',
                }}>
                  {item.is_available ? '✓ Available' : '✗ Unavailable'}
                </div>
              </div>

              {/* Card Info */}
              <div style={styles.cardBody}>
                <p style={{ ...styles.categoryLabel, color: config.color }}>
                  {config.icon} {category.toUpperCase()}
                </p>
                <h3 style={styles.itemName}>{item.name}</h3>
                {item.description && (
                  <p style={styles.description}>{item.description}</p>
                )}
                <div style={styles.cardFooter}>
                  <p style={{ ...styles.price, color: config.color }}>
                    Tsh {item.price.toLocaleString()}
                  </p>
                  {item.is_available && (
                    <button
                      style={{ ...styles.addBtn, background: config.gradient }}
                      onClick={() => onAddToOrder(item)}
                    >
                      ADD
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
  },
  heroTitle: { color: '#fff', fontSize: '30px', fontWeight: '800', margin: '0 0 6px' },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: '16px', margin: 0 },

  tabs: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
  },

  tabBtn: {
    flex: 1,
    padding: '14px 10px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.5px',
  },

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

  badge: {
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

  categoryLabel: {
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '1px',
    margin: '0 0 6px',
    textTransform: 'uppercase',
  },

  itemName: {
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

  addBtn: {
    padding: '10px 16px',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },

  loading: {
    textAlign: 'center',
    color: '#888',
    marginTop: '60px',
    fontSize: '16px',
  },
};

export default MenuSection;