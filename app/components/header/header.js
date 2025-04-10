'use client';
import { useState, useEffect } from 'react';
import './header.css';
import LoginSignupModal from '../loginsignupmodal/loginsignupmodal';
import ProfilePanel from '../profile/profile'; // new profile modal component

export default function Header({ user, setUser, onNavClick }) {
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to add a class to header if needed
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      {/* Left side: Logo */}
      <div className="header-left">
        <h2 className="logo-text">ACELER AI</h2>
      </div>

      {/* Mobile Right: Display full user name (if logged in) and Hamburger */}
      <div className="mobile-right">
        {user && (
          <span className="mobile-username" onClick={() => setShowProfile(true)}>
            Hi, {user.username}
          </span>
        )}
        <button
          className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <ul>
          {['home', 'services', 'contacts', 'bidHistory', 'transactionHistory'].map((item) => (
            <li key={item}>
              <button
                onClick={() => onNavClick(item)}
                className="nav-link"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            </li>
          ))}
          <li>
            {user ? (
              <span className="user-name" onClick={() => setShowProfile(true)}>
                Hi, {user.username}
              </span>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="login-btn"
              >
                Login/Signup
              </button>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation: Slide-in Menu */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <ul>
          {['home', 'services', 'contacts', 'bidHistory', 'transactionHistory'].map((item) => (
            <li key={item}>
              <button
                onClick={() => {
                  onNavClick(item);
                  setMobileMenuOpen(false);
                }}
                className="nav-link"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            </li>
          ))}
          {!user && (
            <li>
              <button
                onClick={() => {
                  setShowModal(true);
                  setMobileMenuOpen(false);
                }}
                className="login-btn"
              >
                Login/Signup
              </button>
            </li>
          )}
        </ul>
      </nav>

      {showModal && (
        <LoginSignupModal setUser={setUser} onClose={() => setShowModal(false)} />
      )}

      {showProfile && (
        <ProfilePanel user={user} setUser={setUser} onClose={() => setShowProfile(false)} />
      )}
    </header>
  );
}
