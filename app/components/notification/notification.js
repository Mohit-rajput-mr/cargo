'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './notification.css';

let socket;

export default function Notification({ currentUser }) {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Only connect socket if user is logged in
    if (!currentUser) return;
    socket = io();

    // Join a personal room based on user.id
    socket.emit('joinUserRoom', { userId: currentUser.id });

    socket.on('bidNotification', (data) => {
      // data = { message: '...', status: 'approved/rejected' }
      setNotification(data);
      // auto-hide after 5s
      setTimeout(() => setNotification(null), 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  if (!notification) return null;

  return (
    <div className={`notification ${notification.status}`}>
      {notification.message}
    </div>
  );
}
