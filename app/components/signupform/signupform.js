'use client';
import { useState } from 'react';
import './signupform.css';

export default function SignupForm({ setUser, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    truckType: 'truck',
    otherTruckType: '',
    idNumber: '',
    phone: '',
    email: '',
    drivingLicenseFront: null,
    drivingLicenseBack: null,
    idCardFront: null,
    idCardBack: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ name: formData.name || 'User' });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="input-field"
        required
      />

      <select
        name="truckType"
        value={formData.truckType}
        onChange={handleChange}
        className="input-field"
      >
        <option value="truck">Truck</option>
        <option value="trailer">Trailer</option>
        <option value="van">Van</option>
        <option value="other">Other</option>
      </select>

      {formData.truckType === 'other' && (
        <input
          type="text"
          name="otherTruckType"
          placeholder="Enter Truck Type"
          value={formData.otherTruckType}
          onChange={handleChange}
          className="input-field"
        />
      )}

      <input
        type="text"
        name="idNumber"
        placeholder="ID Number"
        value={formData.idNumber}
        onChange={handleChange}
        className="input-field"
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="input-field"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="input-field"
        required
      />

      <label className="label">Driving License Front:</label>
      <input
        type="file"
        name="drivingLicenseFront"
        onChange={handleChange}
        className="input-field"
        accept="image/*"
        required
      />

      <label className="label">Driving License Back:</label>
      <input
        type="file"
        name="drivingLicenseBack"
        onChange={handleChange}
        className="input-field"
        accept="image/*"
        required
      />

      <label className="label">ID Card Front:</label>
      <input
        type="file"
        name="idCardFront"
        onChange={handleChange}
        className="input-field"
        accept="image/*"
        required
      />

      <label className="label">ID Card Back:</label>
      <input
        type="file"
        name="idCardBack"
        onChange={handleChange}
        className="input-field"
        accept="image/*"
        required
      />

      <button type="submit" className="signup-btn">
        Register
      </button>
    </form>
  );
}
