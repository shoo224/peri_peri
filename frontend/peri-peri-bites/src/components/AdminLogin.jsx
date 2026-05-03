import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // reset any stored user when visiting admin login
    try { localStorage.removeItem('user'); window.dispatchEvent(new Event('userLoggedOut')); } catch(e) {}
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try{
      const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const resp = await fetch(`${API_ROOT.replace(/\/$/, '')}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
      const data = await resp.json();
      if(!resp.ok) throw new Error(data.message || 'Login failed');
      // expect role on returned object
      if(data.role && data.role.toLowerCase() === 'admin'){
        localStorage.setItem('user', JSON.stringify(data));
        try { window.dispatchEvent(new Event('userLoggedIn')); } catch(e) {}
        navigate('/admin/dashboard');
      } else {
        setMessage('Not an admin user');
      }
    }catch(err){
      setMessage(err.message || 'Login failed');
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={submit} className="admin-login-form">
        <h2>Admin Login</h2>
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {message && <div className="msg">{message}</div>}
        <div className="actions"><button className="btn primary" type="submit">Login</button></div>
      </form>
    </div>
  );
}
