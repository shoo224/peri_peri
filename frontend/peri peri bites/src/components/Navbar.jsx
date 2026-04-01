import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
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
          <li className="nav-item">
            <a href="#product" onClick={(e) => { e.preventDefault(); scrollToSection('product'); }} className="nav-link">Product</a>
          </li>
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
                  <div className="user-dropdown-menu">
                    <div className="user-info">
                      <p><strong>{user.name}</strong></p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <hr />
                    <button 
                      className="logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
              <li className="nav-item">
                <a href="#cart" className="nav-link cart-icon">🛒</a>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <a href="#cart" className="nav-link cart-icon">🛒</a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
