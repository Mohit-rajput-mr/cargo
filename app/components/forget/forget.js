'use client';
import { useState } from 'react';
import './forget.css';

export default function ForgotPassword({ onClose }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [serverOtp, setServerOtp] = useState(''); // For demo only; in production, you wouldn't expose the OTP.
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrUsername }),
      });
      if (res.ok) {
        const data = await res.json();
        setServerOtp(data.otp || ''); // For demo—don't expose OTP in production.
        setStep(2);
      } else {
        alert('Error sending OTP');
      }
    } catch (error) {
      console.error(error);
      alert('Error sending OTP');
    }
  };

  const verifyOtp = () => {
    if (otp === serverOtp) {
      alert('OTP verified. Now you can login or update your password.');
      // Here you can call further logic to log in the user or open a password reset form.
      onClose(); // Close the modal after successful verification.
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="forget-container">
      <div className="forgot-modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        {step === 1 && (
          <div className="forget-form">
            <h2>Forgot Password</h2>
            <p>Enter your registered email or username</p>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Email or Username"
            />
            <button onClick={sendOtp}>Send OTP</button>
          </div>
        )}
        {step === 2 && (
          <div className="forget-form">
            <h2>Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
            />
            <button onClick={verifyOtp}>Verify OTP</button>
          </div>
        )}
      </div>
    </div>
  );
}
