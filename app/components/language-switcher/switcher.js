'use client';
import { useEffect } from 'react';
import "./switcher.css";

export default function LanguageSwitcher() {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (document.getElementById('google-translate-script')) return;
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&hl=en';
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL
        }, 'google_translate_element');
      }
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <div id="google_translate_element" className="lang-widget"></div>
  );
}
