'use client';
import { useState } from 'react';
import LoginForm from '../loginform/loginform';
import SignupForm from '../signupform/signupform';
import Modal from '../modal/modal';
import './loginsignupmodal.css';

export default function LoginSignupModal({ onClose, setUser }) {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <Modal onClose={onClose}>
      <div className="modal-content">
        <div className="toggle-buttons">
          <button onClick={() => setIsSignup(false)} className={!isSignup ? 'active' : ''}>
            Login
          </button>
          <button onClick={() => setIsSignup(true)} className={isSignup ? 'active' : ''}>
            Signup
          </button>
        </div>
        {isSignup ? (
          <SignupForm setUser={setUser} onClose={onClose} />
        ) : (
          <LoginForm setUser={setUser} onClose={onClose} />
        )}
      </div>
    </Modal>
  );
}
