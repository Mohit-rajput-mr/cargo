'use client';
import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import LoadCard from '../loadcard/loadcard';
import './hero.css';

export default function Hero({ loads, user }) {
  const [notifications, setNotifications] = useState([]);

  // Google Translate widget setup (unchanged)
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (document.getElementById('google-translate-script')) {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'en', autoDisplay: false },
            'google_translate_element'
          );
        }
        return;
      }
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&hl=en';
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element'
      );
    };

    addGoogleTranslateScript();
  }, []);

  // On component mount, if user is logged in, fetch existing notifications
  useEffect(() => {
    if (user) {
      fetch(`/api/notify?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.notifications) {
            setNotifications(data.notifications);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  // Set up a Pusher subscription for this user’s notification channel
  useEffect(() => {
    if (user) {
      const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      });
      const channel = pusherClient.subscribe(`notifications-${user.id}`);
      channel.bind('new-notification', (data) => {
        setNotifications(prev => [...prev, data]);
      });
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [user]);

  const removeNotification = async (index) => {
    const note = notifications[index];
    if (!note) return;
    await fetch(`/api/notify?userId=${user.id}&notificationId=${note.id}`, {
      method: 'DELETE'
    });
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  // Create a sorted copy of loads array so that newest load is first.
  const sortedLoads = [...loads].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <section className="hero-section">
      {/* Notification wrapper: displays notifications until user closes them */}
      <div className="notification-wrapper">
        {notifications.map((note, index) => (
          <div key={index} className="notification-container">
            <p>{note.message}</p>
            <button
              className="notification-close-btn"
              onClick={() => removeNotification(index)}
              aria-label="Close Notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Google Translate widget container */}
      <div id="google_translate_element" className="hero-translate-widget"></div>

      <h1>Connecting Shippers &amp; Drivers</h1>
      <div className="load-grid">
        {sortedLoads.map(load => (
          <LoadCard key={load.id} load={load} currentUser={user} />
        ))}
      </div>
    </section>
  );
}
