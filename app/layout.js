'use client';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Cloudinary widget script */}
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
