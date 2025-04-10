'use client';
import { useState, useEffect } from 'react';
import Modal from '../modal/modal';
import io from 'socket.io-client';
import './bidcomponent.css';

let socket;

export default function BidComponent({ loadId, onClose, currentUser }) {
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState([]);

  // Warn if no currentUser is passed
  useEffect(() => {
    if (!currentUser) {
      console.error('BidComponent: currentUser is undefined. Please pass the logged-in user as currentUser.');
    }
  }, [currentUser]);

  // Initialize socket and fetch existing bids
  useEffect(() => {
    socket = io();

    // When a new bid is broadcast, insert it at the top
    socket.on('bid', (data) => {
      if (data.loadId === loadId) {
        setBids((prevBids) => {
          // Deduplicate check
          if (prevBids.some((bid) => bid.id === data.id)) {
            return prevBids;
          }
          // Insert new bid at the beginning
          return [data, ...prevBids];
        });
      }
    });

    // Fetch current bids for this load
    async function fetchBids() {
      const res = await fetch('/api/bids');
      const data = await res.json();
      const loadBids = (data.bids || []).filter((bid) => bid.loadId == loadId);
      // Reverse so the latest bids are at the top
      setBids(loadBids.reverse());
    }
    fetchBids();

    return () => {
      socket.disconnect();
    };
  }, [loadId]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to place a bid.');
      return;
    }
    const userId = currentUser.id;

    // POST the new bid
    const res = await fetch('/api/bids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loadId, bidAmount, userId }),
    });
    const data = await res.json();

    if (data.id) {
      // Create the new bid object
      const newBid = {
        id: data.id,
        loadId,
        bidAmount,
        userId,
        userName: currentUser.name || currentUser.username || `User ${userId}`,
        status: 'pending',
      };

      // Broadcast new bid via socket. The socket listener will insert it at the top.
      socket.emit('bid', newBid);

      // Clear the input field
      setBidAmount('');
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bid-modal">
        {/* New close icon button */}
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
            <button type="submit" className="submit-btn">
              Submit
            </button>
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
                  // Use 'my-bid' for current user's bid, else 'other-bid'
                  const bidClass = bid.userId === currentUser?.id ? 'my-bid' : 'other-bid';
                  return (
                    <li key={bid.id} className={bidClass}>
                      <span>
                        {bid.userName ? bid.userName : `User ${bid.userId}`} : ${bid.bidAmount}
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
