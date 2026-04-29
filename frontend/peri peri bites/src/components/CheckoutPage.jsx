import { useEffect, useState } from 'react';
import upiQr from '../assets/qr.jpeg';
import { useNavigate } from 'react-router-dom';
import menuItems from '../data/items.json';
// orders are saved by admin verification for manual payments
import './CheckoutPage.css';

function loadCart() {
  try { const raw = localStorage.getItem('cart'); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');
  const [utr, setUtr] = useState('');
  const [message, setMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const c = loadCart(); setCart(c);
    const its = Object.keys(c).map(id => {
      const meta = menuItems.find(m => m.id === id) || { id, name: id, price: 0 };
      return { ...meta, qty: c[id] };
    });
    setItems(its);
    const stored = localStorage.getItem('user');
    if (stored) {
      try { const u = JSON.parse(stored); setName(u.name || ''); }
      catch (e) {}
    }
  }, []);

  const subtotal = items.reduce((s,it) => s + (it.price||0) * (it.qty||1), 0);
  const gst = +(subtotal * 0.18).toFixed(2);
  const total = +(subtotal + gst).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!phone || !address) { setMessage('Please provide name, phone and address'); return; }
    if (!utr) { setMessage('Please pay using the scanner and enter the UTR/reference number'); return; }

    const stored = localStorage.getItem('user');
    if (!stored) { setMessage('Please login before checking out'); return; }
    const user = JSON.parse(stored);

    const orderPayload = {
      items: items.map(it => ({ productId: it.id, name: it.name, qty: it.qty, price: it.price })),
      subtotal, gst, total, createdAt: new Date(), address: { address, city, state: stateVal, pincode }, phone, payment: { method: 'manual', utr, status: 'pending_verification' }
    };

    setProcessing(true);
    try {
      // send to backend manual payment request endpoint
      const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const resp = await fetch(`${API_ROOT.replace(/\/$/, '')}/api/manual-payment/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, order: orderPayload })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Failed to submit order');
      // do NOT save the order into user's orders until admin verifies the payment
      localStorage.removeItem('cart');
      setMessage('Order submitted for verification. We will update you after UTR verification.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Failed to submit order');
    } finally { setProcessing(false); }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} />
          <label>Phone</label>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <label>Address</label>
          <textarea value={address} onChange={(e)=>setAddress(e.target.value)} />
          <div className="row">
            <div>
              <label>City</label>
              <input value={city} onChange={(e)=>setCity(e.target.value)} />
            </div>
            <div>
              <label>State</label>
              <input value={stateVal} onChange={(e)=>setStateVal(e.target.value)} />
            </div>
            <div>
              <label>Pincode</label>
              <input value={pincode} onChange={(e)=>setPincode(e.target.value)} />
            </div>
          </div>

          <h3>Payment</h3>
          <p>Please scan the code below from your UPI app or use your scanner to pay. After successful transfer, copy the UTR/Reference ID and paste it below for manual verification.</p>
          <div className="qr-box">
            {/* Load QR from assets/qr.jpeg (imported above) */}
            <img src={upiQr} alt="UPI QR" onError={(e)=>{ e.target.style.display='none'; }} />
            <div className="qr-fallback">Scan QR or use your scanner to pay</div>
          </div>

          <label>UTR / Reference ID</label>
          <input value={utr} onChange={(e)=>setUtr(e.target.value)} />

          {message && <div className="form-message">{message}</div>}
          <div className="actions">
            <button type="button" className="btn" onClick={()=>navigate('/cart')}>Back to cart</button>
            <button type="submit" className="btn primary" disabled={processing}>{processing ? 'Submitting...' : 'Submit Order & UTR'}</button>
          </div>
        </form>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          {items.map(it=> (
            <div key={it.id} className="summary-line"><span>{it.name} x{it.qty}</span><span>₹{(it.price*it.qty).toFixed(2)}</span></div>
          ))}
          <hr />
          <div className="summary-line"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="summary-line"><span>GST (18%)</span><span>₹{gst.toFixed(2)}</span></div>
          <div className="summary-total"><strong>Total</strong><strong>₹{total.toFixed(2)}</strong></div>
        </aside>
      </div>
    </div>
  );
}
