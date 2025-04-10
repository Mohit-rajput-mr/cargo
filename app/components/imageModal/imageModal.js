'use client';
import { useEffect } from 'react';
import './imageModal.css';

export default function ImageModal({ image, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <img src={image} alt="Full view" className="full-image" />
        <a href={image} download className="download-btn">Download</a>
      </div>
    </div>
  );
}
