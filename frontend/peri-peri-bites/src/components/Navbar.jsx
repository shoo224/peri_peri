import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import menuItems from '../data/items.json';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [selectedItems, setSelectedItems] = useState({}); // { id: qty }
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // listen for login/logout events to update navbar immediately
    const onLogin = () => {
      const s = localStorage.getItem('user');
      if (s) setUser(JSON.parse(s));
    };
    const onLogout = () => { setUser(null); };
    window.addEventListener('userLoggedIn', onLogin);
    window.addEventListener('userLoggedOut', onLogout);
    return () => { window.removeEventListener('userLoggedIn', onLogin); window.removeEventListener('userLoggedOut', onLogout); };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      // update local state so navbar re-renders immediately
      setUser(null);
      try { window.dispatchEvent(new Event('userLoggedOut')); } catch(e) {}
      setShowUserMenu(false);
      // navigate home and replace history entry
      navigate('/', { replace: true });
      // in case some components read localStorage directly and don't update,
      // force a quick reload to ensure UI reflects logout state.
      setTimeout(() => {
        if (localStorage.getItem('user')) return; // user logged back in elsewhere
        window.location.reload();
      }, 120);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const getCart = () => {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch (e) {
      return [];
    }
  };
  const computeSummaryFromSelection = (selection) => {
    const items = Object.entries(selection).map(([id, qty]) => {
      const meta = menuItems.find(m => m.id === id) || {};
      return { productId: id, name: meta.name || id, qty: qty || 1, price: meta.price || 0 };
    });
    const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
    const gst = +(subtotal * 0.18).toFixed(2); // 18% GST
    const total = +(subtotal + gst).toFixed(2);
    return { items, subtotal, gst, total, createdAt: new Date() };
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => {
      const copy = { ...prev };
      if (copy[id]) delete copy[id];
      else copy[id] = 1;
      return copy;
    });
  };

  const changeQty = (id, qty) => {
    setSelectedItems(prev => ({ ...prev, [id]: Math.max(1, Number(qty) || 1) }));
  };

  const placeOrder = () => {
    if (!user) { alert('Please log in to place an order'); return; }
    if (Object.keys(selectedItems).length === 0) { alert('Select at least one item'); return; }
    const summary = computeSummaryFromSelection(selectedItems);
    setOrderSummary(summary);
    setShowOrderModal(true);
  };

  const confirmAndSaveOrder = () => {
    if (!user || !orderSummary) return alert('No order to save');
    try {
      // store the selected items into cart and navigate to checkout for payment
      localStorage.setItem('cart', JSON.stringify(selectedItems));
      setShowOrderModal(false);
      setSelectedItems({});
      navigate('/checkout');
    } catch (err) {
      console.error(err);
      alert('Failed to proceed to checkout: ' + (err.message || err));
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>Peri Peri Bites</h1>
          </Link>
        </div>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          {/* Product removed from navbar per request */}
          <li className="nav-item">
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="nav-link">Contact</a>
          </li>
          
          {user ? (
            <>
              <li className="nav-item user-profile">
                <div 
                  className="user-icon-container"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user.name}</span>
                </div>
                
                {showUserMenu && (
                  <div className="user-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    <div className="user-info">
                      <p><strong>{user.name}</strong></p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <hr />
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                      <button
                        type="button"
                        className="logout-btn"
                        onPointerDown={(e) => { e.stopPropagation(); handleLogout(); }}
                        onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                      >
                        Logout
                      </button>
                      <button
                        type="button"
                        className="logout-btn"
                        style={{ background: '#f1f1f1', color: '#333', border: '1px solid #ddd', fontWeight: 600 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // clear auth tokens and user state
                          try {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            sessionStorage.removeItem('user');
                            // remove cookie named token if present
                            document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                            window.dispatchEvent(new Event('userLoggedOut'));
                            setUser(null);
                            setShowUserMenu(false);
                            alert('Session cleared');
                          } catch (err) { console.error(err); }
                        }}
                      >
                        Clear session
                      </button>
                    </div>
                  </div>
                )}
              </li>
              <li className="nav-item">
                <a
                  href="#cart"
                  className="nav-link cart-icon"
                  onClick={(e) => { e.preventDefault(); navigate('/cart'); }}
                >
                  🛒
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <a href="#cart" className="nav-link cart-icon" onClick={(e) => { e.preventDefault(); navigate('/cart'); }}>🛒</a>
              </li>
            </>
          )}
        </ul>
      </div>
      {showOrderModal && orderSummary && (
        <div className="order-modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Order Summary</h3>
            <div className="order-items">
              {orderSummary.items.length === 0 && <p>Your selection is empty.</p>}
              {orderSummary.items.map((it, idx) => (
                <div key={idx} className="order-item-row">
                  <span>{it.name} x{it.qty}</span>
                  <span>₹{(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="order-totals">
              <div><strong>Subtotal:</strong> ₹{orderSummary.subtotal.toFixed(2)}</div>
              <div><strong>GST (18%):</strong> ₹{orderSummary.gst.toFixed(2)}</div>
              <div><strong>Total:</strong> ₹{orderSummary.total.toFixed(2)}</div>
            </div>
            <div className="order-actions">
              <button onClick={() => { setShowOrderModal(false); }} className="btn">Close</button>
              <button onClick={confirmAndSaveOrder} className="btn primary">Confirm & Save</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
