'use client';
import { useState } from 'react';
import './loadcard.css';
import BidComponent from '../bidcomponent/bidcomponent';

export default function LoadCard({ load }) {
  const [showBidModal, setShowBidModal] = useState(false);

  const sampleLoad = load || {
    name: "Sample Load",
    description: "This is a sample load description for cargo transport.",
    pickup: "Riga",
    delivery: "Barcelona",
    price: "$1500",
  };

  const openMapRoute = () => {
    const pickup = encodeURIComponent(sampleLoad.pickup);
    const delivery = encodeURIComponent(sampleLoad.delivery);
    // show route with pickup->delivery, current location is auto-detected by google
    const url = `https://www.google.com/maps/dir/?api=1&destination=${delivery}&waypoints=${pickup}`;
    window.open(url, '_blank');
  };

  return (
    <div className="load-card">
      <img src="/load.jpg" alt="Load" className="load-image" />
      <h2>{sampleLoad.name}</h2>
      <p>{sampleLoad.description}</p>
      <p className="pickup">Pickup: {sampleLoad.pickup}</p>
      <p className="delivery">Delivery: {sampleLoad.delivery}</p>
      <p className="price">Pay: {sampleLoad.price}</p>
      <div className="load-actions">
        <button className="route-btn" onClick={openMapRoute}>View Route</button>
        <button className="bid-btn" onClick={() => setShowBidModal(true)}>Bid</button>
      </div>
      {showBidModal && <BidComponent onClose={() => setShowBidModal(false)} />}
    </div>
  );
}
