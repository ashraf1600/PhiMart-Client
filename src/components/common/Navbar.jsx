import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileDropdownOpen(false);
  };

  const openAdminPanel = () => {
    window.open('http://127.0.0.1:8000/admin', '_blank');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container mx-auto px-6 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-heading font-bold tracking-wider text-[#1a1a1a]">
          EXPORT-MART
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Shop</Link>
          <Link to="/cart" className="relative nav-link">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 18v3" />
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-3 bg-[#b8a28c] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          {isAdmin && (
            <button onClick={openAdminPanel} className="nav-btn text-sm">Admin</button>
          )}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex items-center space-x-2 nav-link">
                <span className="w-8 h-8 rounded-full bg-[#b8a28c] text-white flex items-center justify-center text-sm font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
                <svg className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 z-50 border border-gray-100">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setIsProfileDropdownOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setIsProfileDropdownOpen(false)}>
                    Orders
                  </Link>
                  <hr className="my-1" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-btn">Register</Link>
            </div>
          )}
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6">
          <Link to="/" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link to="/cart" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Cart ({cartItemsCount})</Link>
          {isAdmin && <button onClick={() => { openAdminPanel(); setIsMenuOpen(false); }} className="block py-2 nav-link">Admin</button>}
          {user ? (
            <>
              <Link to="/profile" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <Link to="/orders" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Orders</Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block py-2 nav-link" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;