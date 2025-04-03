'use client';
import './bidhistory.css';

export default function BidHistory({ onClose }) {
  const history = [
    { load: "Sample Load", bid: "$1400", bidder: "User1" },
    { load: "Sample Load", bid: "$1450", bidder: "User2" },
    { load: "Sample Load", bid: "$1500", bidder: "You" },
  ];

  return (
    <div className="bid-history">
      <button className="close-history" onClick={onClose}>×</button>
      <h2>Bid History</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            Load: {item.load} – Bid: {item.bid} by {item.bidder}
          </li>
        ))}
      </ul>
    </div>
  );
}
