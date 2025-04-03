'use client';
import { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import './toggle.css';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [dark]);

  return (
    <button className="theme-toggle" onClick={() => setDark(!dark)} title="Toggle Theme">
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  );
}
