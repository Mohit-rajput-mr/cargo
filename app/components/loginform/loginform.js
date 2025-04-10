'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './loginform.css';

export default function LoginForm({ setUser, onClose }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      // For admin, redirect to /admin; otherwise, set user state and persist user info
      if (data.user && data.user.username === 'admin') {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/admin');
      } else {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        onClose();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={credentials.username}
        onChange={handleChange}
        required
      />
      <div className="password-field">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-eye"
        >
          {showPassword ? 'Hide' : 'Show'}
        </span>
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
