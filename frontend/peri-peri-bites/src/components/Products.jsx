import { useState, useEffect } from 'react';
import menuItems from '../data/items.json';
import './Products.css';

function loadCartObj() {
  try { const raw = localStorage.getItem('cart'); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

function saveCartObj(obj) { localStorage.setItem('cart', JSON.stringify(obj)); }

export default function Products() {
  const [cart, setCart] = useState({});

  useEffect(() => { setCart(loadCartObj()); }, []);

  const addToCart = (id) => {
    const next = { ...loadCartObj() };
    next[id] = (next[id] || 0) + 1;
    saveCartObj(next);
    setCart(next);
  };

  const removeFromCart = (id) => {
    const next = { ...loadCartObj() };
    if (!next[id]) return;
    next[id] = Math.max(0, next[id] - 1);
    if (next[id] === 0) delete next[id];
    saveCartObj(next);
    setCart(next);
  };

  return (
    <section id="product" className="products-section">
      <h2>Products</h2>
      <div className="products-grid">
        {menuItems.map(item => (
          <div className="product-card" key={item.id}>
            <div className="product-body">
              <div className="product-name">{item.name}</div>
              <div className="product-price">₹{(Number(item.price) || 0).toFixed(2)}</div>
            </div>
            <div className="product-actions">
              <button className="btn small" onClick={() => removeFromCart(item.id)}>-</button>
              <div className="qty">{cart[item.id] || 0}</div>
              <button className="btn small primary" onClick={() => addToCart(item.id)}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
