'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './loginsignupmodal.css';
import Modal from '../modal/modal';
import SignupForm from '../signupform/signupform';

export default function LoginSignupModal({ onClose, setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Admin credentials
    if (username === 'admin' && password === 'a123') {
      router.push('/admin');
      onClose();
      return;
    }
    // Otherwise normal user
    setUser({ name: username });
    onClose();
  };

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
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
