"use client";
import { useState } from "react";
import "./header.css";
import LoginSignupModal from "../loginsignupmodal/loginsignupmodal";
import LanguageSwitcher from "../language-switcher/switcher";
import ThemeToggle from "../theme-toggle/toggle";
import { FaBars, FaTimes, FaGlobe } from "react-icons/fa";

export default function Header({ user, setUser, onToggleBidHistory }) {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleToggleLangDropdown = () => {
    setShowLangDropdown(!showLangDropdown);
  };

  return (
    <header className="site-header">
      <div className="header-left">
        <h2 className="logo-text">ACELER AI</h2>
      </div>

      {/* Desktop Navigation */}
      <div className="desktop-nav">
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
            <li>
              <button onClick={onToggleBidHistory} className="nav-btn">
                Bid History
              </button>
            </li>
            <li><ThemeToggle /></li>
            <li>
              {user ? (
                <span className="user-name">Welcome, {user.name}</span>
              ) : (
                <button onClick={() => setShowModal(true)} className="login-btn">
                  Login/Signup
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>


      {/* Mobile Controls: Login/Signup and Hamburger Icon */}
      <div className="mobile-controls">
        {user ? (
          <span className="user-name">Welcome, {user.name}</span>
        ) : (
          <button onClick={() => setShowModal(true)} className="login-btn">
            Login/Signup
          </button>
        )}
        <div className="hamburger" onClick={handleToggleMenu}>
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </div>
      </div>

      {/* Mobile slide-in nav (without language switcher) */}
      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <button className="close-menu-btn" onClick={handleToggleMenu}>
            <FaTimes size={22} />
          </button>
        </div>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Contact</a></li>
          <li>
            <button onClick={onToggleBidHistory} className="nav-btn">
              Bid History
            </button>
          </li>
          <li><ThemeToggle /></li>
        </ul>
      </nav>

      {showModal && (
        <LoginSignupModal
          setUser={setUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </header>
  );
}
