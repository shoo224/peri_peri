import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard(){
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const stored = localStorage.getItem('user');
    if(!stored){ navigate('/admin'); return; }
    const user = JSON.parse(stored);
    if(!user.role || user.role.toLowerCase() !== 'admin'){ navigate('/admin'); return; }
    fetchOrders();
  },[]);

  const fetchOrders = async ()=>{
    setLoading(true);
    try{
      const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const token = JSON.parse(localStorage.getItem('user') || '{}').token;
      const resp = await fetch(`${API_ROOT.replace(/\/$/, '')}/api/admin/manual-orders`, { headers: { Authorization: token ? `Bearer ${token}` : '' } });
      const data = await resp.json();
      if(!resp.ok) throw new Error(data.message||'Failed');
      setOrders(data || []);
    }catch(err){
      console.error(err);
      setOrders([]);
    }finally{setLoading(false);}    
  };

  const verify = async (requestId)=>{
    try{
      const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const token = JSON.parse(localStorage.getItem('user') || '{}').token;
      const resp = await fetch(`${API_ROOT.replace(/\/$/, '')}/api/admin/manual-orders/${requestId}/verify`, { method: 'POST', headers: { Authorization: token ? `Bearer ${token}` : '' } });
      const data = await resp.json();
      if(!resp.ok) throw new Error(data.message||'Failed');
      fetchOrders();
    }catch(err){ console.error(err); }
  };

  const rejectRequest = async (requestId) => {
    try {
      const reason = window.prompt('Enter rejection reason (optional):');
      const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const token = JSON.parse(localStorage.getItem('user') || '{}').token;
      const resp = await fetch(`${API_ROOT.replace(/\/$/, '')}/api/admin/manual-orders/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ reason })
      });
      const data = await resp.json();
      if(!resp.ok) throw new Error(data.message||'Failed');
      fetchOrders();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard — Manual Payments</h2>
      {loading && <div>Loading...</div>}
      {!loading && orders.length===0 && <div>No pending manual payments.</div>}
      <div className="orders-list">
        {orders.map((o,i)=> (
          <div key={i} className="order-card">
            <div className="order-meta">
              <div><strong>User:</strong> {o.email}</div>
              <div><strong>UTR:</strong> {o.order.payment?.utr || '—'}</div>
              <div><strong>Total:</strong> ₹{(o.order.total||0).toFixed(2)}</div>
              <div><strong>Status:</strong> {o.order.status}</div>
            </div>
            <div className="order-actions">
              <button className="btn" onClick={()=>verify(o.requestId)}>Mark as Paid</button>
              <button className="btn" style={{ marginLeft: '8px', background: '#f44336', color: '#fff' }} onClick={()=>rejectRequest(o.requestId)}>Reject</button>
            </div>
            <div className="order-lines">
              {o.order.items.map((it, idx)=> <div key={idx} className="line">{it.name} x{it.qty} — ₹{(it.price*it.qty).toFixed(2)}</div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
