'use client';
import { useState, useEffect } from 'react';
import './service.css';

export default function Service() {
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.services && data.services.length > 0) {
        // If your API returns an array, you might use the first element
        setDescription(data.services[0].description);
      }
    }
    fetchServices();
  }, []);

  return (
    <div className="service-container">
      <h1>Our Services</h1>
      <div
        className="service-content"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
