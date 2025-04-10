'use client';
import { useState, useEffect } from 'react';
import Modal from '../modal/modal';
import Pusher from 'pusher-js';
import './bidcomponent.css';

export default function BidComponent({ loadId, onClose, currentUser }) {
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      console.error('BidComponent: currentUser is undefined.');
    }
  }, [currentUser]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(`load_${loadId}`);
    channel.bind('new-bid', (data) => {
      setBids((prevBids) => {
        if (prevBids.some((bid) => bid.id === data.id)) return prevBids;
        return [data, ...prevBids];
      });
    });

    // Fetch bids
    async function fetchBids() {
      const res = await fetch('/api/bids');
      if (!res.ok) {
        console.error('Failed to fetch bids:', res.statusText);
        return;
      }
      const data = await res.json();
      const loadBids = (data.bids || []).filter((bid) => bid.loadId == loadId);
      setBids(loadBids.reverse());
    }

    fetchBids();

    return () => {
      pusher.unsubscribe(`load_${loadId}`);
    };
  }, [loadId]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to place a bid.');
      return;
    }
    const userId = currentUser.id;

    const res = await fetch('/api/bids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loadId, bidAmount, userId }),
    });

    const data = await res.json();

    if (data.id) {
      setBidAmount('');
    } else {
      alert('Failed to place bid.');
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bid-modal">
        <button className="bid-close" onClick={onClose}>✕</button>
        <div className="bid-left">
          <h3>Place Bid</h3>
          <form onSubmit={handleBidSubmit} className="bid-form">
            <input
              type="number"
              placeholder="Enter bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="bid-input"
            />
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
        <div className="bid-right">
          <h3>All Bids for This Load</h3>
          <div className="bid-list-container">
            {bids.length === 0 ? (
              <p>No bids yet.</p>
            ) : (
              <ul>
                {bids.map((bid) => {
                  const bidClass = bid.userId === currentUser?.id ? 'my-bid' : 'other-bid';
                  return (
                    <li key={bid.id} className={bidClass}>
                      <span>
                        {bid.userName || `User ${bid.userId}`} : ${bid.bidAmount}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
