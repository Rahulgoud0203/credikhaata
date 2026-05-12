import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import './index.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">CrediKhaata</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/add-customer" className={`nav-link ${location.pathname === '/add-customer' ? 'active' : ''}`}>
            Add Customer
          </Link>
          <Link to="/add-loan" className={`nav-link ${location.pathname === '/add-loan' ? 'active' : ''}`}>
            Add Loan
          </Link>
        </div>

        <div className="navbar-user">
          <span className="navbar-username">{user?.name}</span>
          <button onClick={logout} className="navbar-logout">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
