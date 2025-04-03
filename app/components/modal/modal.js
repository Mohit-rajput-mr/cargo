'use client';
import './modal.css';

export default function Modal({ children, onClose }) {
  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="modal" onClick={handleModalClick}>
        <button onClick={onClose} className="close-btn">x</button>
        {children}
      </div>
    </div>
  );
}
