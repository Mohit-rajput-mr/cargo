'use client';
import { useState, useEffect } from 'react';
import './contact.css';

export default function Contact() {
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function fetchContacts() {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      if (data.contacts && data.contacts.length > 0) {
        // Use the description from the first contact record
        setDescription(data.contacts[0].description);
      }
    }
    fetchContacts();
  }, []);

  return (
    <div className="contact-container">
      <h1>Contact Information</h1>
      <div
        className="contact-content"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
