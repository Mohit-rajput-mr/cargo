'use client';
import { useState, useEffect } from 'react';
import Header from './components/header/header';
import Hero from './components/hero/hero';
import Service from './components/service/service';
import Contact from './components/contact/contact';
import BidHistory from './components/bidhistory/bidhistory';
import TransactionHistory from './components/transactionhistory/transactionhistory';
import AdminPage from './admin/page.client'; // Import AdminPage

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loads, setLoads] = useState([]);
  const [selectedView, setSelectedView] = useState('home');

  // Load user from localStorage once
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch loads from backend
  useEffect(() => {
    async function fetchLoads() {
      const res = await fetch('/api/loads');
      const data = await res.json();
      setLoads(data.loads || []);
    }
    fetchLoads();
  }, []);

  // 🧠 Render AdminPage if admin is logged in
  if (user?.username === 'admin') {
    return <AdminPage />;
  }

  const renderView = () => {
    switch (selectedView) {
      case 'home':
        return <Hero loads={loads} user={user} />;
      case 'services':
        return <Service />;
      case 'contacts':
        return <Contact />;
      case 'bidHistory':
        return <BidHistory currentUser={user} />;
      case 'transactionHistory':
        return <TransactionHistory currentUser={user} />;
      default:
        return <Hero loads={loads} user={user} />;
    }
  };

  return (
    <>
      <Header user={user} setUser={setUser} onNavClick={setSelectedView} />
      <div style={{ marginTop: '80px' }}>
        {renderView()}
      </div>
      <div id="modal-root"></div>
    </>
  );
}
