'use client';
import { useState } from 'react';
import Header from './components/header/header';
import Hero from './components/hero/hero';
import BidHistory from './components/bidhistory/bidhistory';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [showBidHistory, setShowBidHistory] = useState(false);

  return (
    <>
      <Header
        user={user}
        setUser={setUser}
        onToggleBidHistory={() => setShowBidHistory(!showBidHistory)}
      />
      {/* Hero at the top (fills the first 100vh) */}
      <Hero />

      {/* Scrollable content below hero */}
      <div id="main-scrollable-content">
        {showBidHistory && <BidHistory onClose={() => setShowBidHistory(false)} />}
        {/* You can place more sections here if needed */}
      </div>
    </>
  );
}
