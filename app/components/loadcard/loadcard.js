'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import BidComponent from '../bidcomponent/bidcomponent';
import './loadcard.css';

export default function LoadCard({ load, currentUser }) {
  const [showBidModal, setShowBidModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parse image URLs
  let images = [];
  try {
    images = JSON.parse(load.imageUrl);
    if (!Array.isArray(images)) images = [load.imageUrl];
  } catch (error) {
    images = [load.imageUrl];
  }

  const openMapRoute = () => {
    const pickup = encodeURIComponent(load.pickup);
    const delivery = encodeURIComponent(load.delivery);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${delivery}&waypoints=${pickup}`;
    window.open(url, '_blank');
  };

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  // Format upload time
  const formattedDateTime = load.created_at
    ? new Date(load.created_at).toLocaleString()
    : '';

  return (
    <div className="load-card">
      {images.length > 0 && (
        <div className="image-slider">
          <button className="slider-btn slider-btn-left" onClick={prevImage}>
            &lt;
          </button>
          <img
            src={images[currentIndex]}
            alt={load.title}
            className="load-image"
          />
          <button className="slider-btn slider-btn-right" onClick={nextImage}>
            &gt;
          </button>
        </div>
      )}
      <h2>{load.title}</h2>
      <p>{load.description}</p>
      <p className="pickup">Pickup: {load.pickup}</p>
      <p className="delivery">Delivery: {load.delivery}</p>
      <p className="price">Pay: {load.pay}</p>
      {formattedDateTime && (
        <p className="upload-time">Uploaded: {formattedDateTime}</p>
      )}
      <div className="load-actions">
        <button className="route-btn" onClick={openMapRoute}>
          View Route
        </button>
        <button className="bid-btn" onClick={() => setShowBidModal(true)}>
          Bid
        </button>
      </div>
      {showBidModal &&
        createPortal(
          <BidComponent
            loadId={load.id}
            onClose={() => setShowBidModal(false)}
            currentUser={currentUser}
          />,
          document.getElementById('modal-root')
        )}
    </div>
  );
}
