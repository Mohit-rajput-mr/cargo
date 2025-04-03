'use client';
import { useState } from 'react';
import './bidcomponent.css';
import Modal from '../modal/modal';

export default function BidComponent({ onClose }) {
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState([
    { user: "User1", amount: "$1400" },
    { user: "User2", amount: "$1450" },
  ]);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (bidAmount.trim() !== '') {
      const newBid = { user: "You", amount: `$${bidAmount}` };
      setBids([...bids, newBid]);
      setBidAmount('');
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bid-modal">
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
          <h3>Recent Bids</h3>
          <ul>
            {bids.map((bid, index) => (
              <li key={index}>
                {bid.user}: {bid.amount}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
