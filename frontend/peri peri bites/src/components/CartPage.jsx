import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import menuItems from '../data/items.json';
import './CartPage.css';

function loadCart() {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCart(obj) {
  localStorage.setItem('cart', JSON.stringify(obj));
}

export default function CartPage() {
  const [cart, setCart] = useState({}); // { id: qty }
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const addToCart = (id) => {
    const next = { ...cart };
    next[id] = (next[id] || 0) + 1;
    setCart(next);
    saveCart(next);
    setMessage('Added to cart');
  };

  const changeQty = (id, val) => {
    const q = Math.max(1, Number(val) || 1);
    const next = { ...cart, [id]: q };
    setCart(next); saveCart(next);
  };

  const removeItem = (id) => {
    const next = { ...cart }; delete next[id]; setCart(next); saveCart(next);
  };

  const items = Object.keys(cart).map(id => {
    const meta = menuItems.find(m => m.id === id) || { id, name: id, price: 0 };
    return { ...meta, qty: cart[id] };
  });

  const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
  const gst = +(subtotal * 0.18).toFixed(2);
  const total = +(subtotal + gst).toFixed(2);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [orderProcessingLocal, setOrderProcessingLocal] = useState(false);

  const placeOrder = () => {
    if (items.length === 0) { setMessage('Your cart is empty.'); return; }
    setShowSummaryModal(true);
  };

  const confirmOrder = async () => {
    const stored = localStorage.getItem('user');
    if (!stored) { setMessage('Please log in to place an order.'); setShowSummaryModal(false); return; }
    const user = JSON.parse(stored);
    const order = { items: items.map(it => ({ productId: it.id, name: it.name, qty: it.qty, price: it.price })), subtotal, gst, total, createdAt: new Date() };
    // proceed to checkout so payment/UTR can be provided before saving order
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      setShowSummaryModal(false);
      navigate('/checkout');
    } catch (err) {
      console.error(err);
      setMessage('Failed to proceed to checkout.');
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <Link to="/">Continue shopping</Link>
      </div>

      <section className="cart-products">
        <h3>Products</h3>
        <div className="products-grid">
          {menuItems.map(mi => (
            <div className="product-card" key={mi.id}>
              <div className="prod-left">
                <div className="product-name">{mi.name}</div>
                <div className="product-price">₹{(Number(mi.price) || 0).toFixed(2)}</div>
              </div>
              <div className="prod-right">
                <button className="btn small primary" onClick={() => addToCart(mi.id)}>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {message && <div className="cart-message">{message}</div>}

      <div className="cart-grid">
        <div className="cart-items">
          {items.length === 0 && (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <Link to="/">Browse products</Link>
            </div>
          )}

          {items.map((it) => (
            <div className="cart-card" key={it.id}>
              <div className="card-left">
                <div className="product-name">{it.name}</div>
                <div className="product-price">₹{(Number(it.price) || 0).toFixed(2)}</div>
              </div>
              <div className="card-right">
                <div className="qty-controls">
                  <button onClick={() => changeQty(it.id, Math.max(1, it.qty - 1))}>-</button>
                  <input value={it.qty} onChange={(e) => changeQty(it.id, e.target.value)} />
                  <button onClick={() => changeQty(it.id, it.qty + 1)}>+</button>
                </div>
                <div className="line-total">₹{(it.price * it.qty).toFixed(2)}</div>
                <button className="remove-btn" onClick={() => removeItem(it.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>₹{gst.toFixed(2)}</span></div>
          <div className="summary-total"><strong>Total</strong><strong>₹{total.toFixed(2)}</strong></div>
          <button className="place-order" onClick={placeOrder} disabled={orderProcessing || orderProcessingLocal}>{(orderProcessing || orderProcessingLocal) ? 'Processing...' : 'Checkout'}</button>
        </aside>
      </div>

      {showSummaryModal && (
        <div className="order-modal-overlay" onClick={() => setShowSummaryModal(false)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Order Summary</h3>
            <div className="order-items">
              {items.map((it, idx) => (
                <div key={idx} className="order-item-row">
                  <span>{it.name} x{it.qty}</span>
                  <span>₹{(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="order-totals">
              <div><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</div>
              <div><strong>GST (18%):</strong> ₹{gst.toFixed(2)}</div>
              <div><strong>Total:</strong> ₹{total.toFixed(2)}</div>
            </div>
            <div className="order-actions">
              <button onClick={() => setShowSummaryModal(false)} className="btn">Cancel</button>
              <button onClick={() => { setShowSummaryModal(false); navigate('/checkout'); }} className="btn primary">Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
