'use client';
import { useState } from 'react';
import './signupform.css';

export default function SignupForm({ setUser, onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    truckType: 'Flatbed Trucks',
    customTruckType: '',
    vehicleImage: '',
    idNumber: '',
    phone: '',
    iban: '',
    swiftCode: '',
    recipientName: '',
    drivingLicenseFront: '',
    drivingLicenseBack: '',
    idCardFront: '',
    idCardBack: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (field) => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'dxngqy4ss',
        uploadPreset: 'cargoo',
        sources: ['local', 'camera'],
        cropping: false,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setFormData((prev) => ({ ...prev, [field]: result.info.secure_url }));
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Register the user
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // Auto-login after successful signup
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok && loginData.user) {
        setUser(loginData.user);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        alert('Registration and login successful!');
        onClose();
      } else {
        alert(loginData.error || 'Login failed after registration.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong during registration.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <div className="form-grid">
        {/* Username */}
        <div className="grid-item">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Full Name */}
        <div className="grid-item">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="grid-item">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="grid-item password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="toggle-eye">
            {showPassword ? 'Hide' : 'Show'}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="grid-item password-field">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-eye">
            {showConfirmPassword ? 'Hide' : 'Show'}
          </span>
        </div>

        {/* Phone */}
        <div className="grid-item">
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* ID Number */}
        <div className="grid-item">
          <input
            type="text"
            name="idNumber"
            placeholder="ID Number"
            value={formData.idNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Truck Type */}
        <div className="grid-item">
          <select name="truckType" value={formData.truckType} onChange={handleChange}>
            <option value="Flatbed Trucks">Flatbed Trucks</option>
            <option value="Refrigerated Trucks (Reefer Trucks)">Refrigerated Trucks (Reefer Trucks)</option>
            <option value="Tanker Trucks">Tanker Trucks</option>
            <option value="Box Trucks (Enclosed Cargo Trucks)">Box Trucks (Enclosed Cargo Trucks)</option>
            <option value="Dump Trucks">Dump Trucks</option>
            <option value="Tow Trucks">Tow Trucks</option>
            <option value="Delivery Vans">Delivery Vans</option>
            <option value="Pickup Trucks">Pickup Trucks</option>
            <option value="Car Carrier Trucks">Car Carrier Trucks</option>
            <option value="Moving Trucks">Moving Trucks</option>
            <option value="Livestock Transport Trucks">Livestock Transport Trucks</option>
            <option value="Container Trucks">Container Trucks</option>
            <option value="Concrete Mixer Trucks">Concrete Mixer Trucks</option>
            <option value="Crane Trucks">Crane Trucks</option>
            <option value="Flatbed Tow Trucks">Flatbed Tow Trucks</option>
            <option value="Dry Van Trailers">Dry Van Trailers</option>
            <option value="Lowboy Trucks">Lowboy Trucks</option>
            <option value="Highboy Trucks">Highboy Trucks</option>
            <option value="Dump Trailers">Dump Trailers</option>
            <option value="Car Transport Trailers">Car Transport Trailers</option>
            <option value="Refrigerated Trailers (Reefer Trailers)">Refrigerated Trailers (Reefer Trailers)</option>
            <option value="Heavy Haul Trucks">Heavy Haul Trucks</option>
            <option value="Box Van Trucks">Box Van Trucks</option>
            <option value="Utility Trucks">Utility Trucks</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {formData.truckType === 'Other' && (
          <div className="grid-item">
            <input
              type="text"
              name="customTruckType"
              placeholder="Define your truck type"
              value={formData.customTruckType}
              onChange={handleChange}
            />
          </div>
        )}

        {/* IBAN */}
        <div className="grid-item">
          <input type="text" name="iban" placeholder="Bank IBAN" value={formData.iban} onChange={handleChange} />
        </div>

        {/* SWIFT Code */}
        <div className="grid-item">
          <input
            type="text"
            name="swiftCode"
            placeholder="SWIFT Code"
            value={formData.swiftCode}
            onChange={handleChange}
          />
        </div>

        {/* Recipient Name */}
        <div className="grid-item">
          <input
            type="text"
            name="recipientName"
            placeholder="Recipient Name"
            value={formData.recipientName}
            onChange={handleChange}
          />
        </div>

        {/* Vehicle Image */}
        <div className="grid-item file-upload">
          <label>Vehicle Image:</label>
          <button type="button" onClick={() => handleFileUpload('vehicleImage')}>
            Upload
          </button>
          {formData.vehicleImage && (
            <img src={formData.vehicleImage} alt="Vehicle" className="upload-preview" />
          )}
        </div>

        {/* Driving License Front */}
        <div className="grid-item file-upload">
          <label>Driving License Front:</label>
          <button type="button" onClick={() => handleFileUpload('drivingLicenseFront')}>
            Upload
          </button>
          {formData.drivingLicenseFront && (
            <img src={formData.drivingLicenseFront} alt="DL Front" className="upload-preview" />
          )}
        </div>

        {/* Driving License Back */}
        <div className="grid-item file-upload">
          <label>Driving License Back:</label>
          <button type="button" onClick={() => handleFileUpload('drivingLicenseBack')}>
            Upload
          </button>
          {formData.drivingLicenseBack && (
            <img src={formData.drivingLicenseBack} alt="DL Back" className="upload-preview" />
          )}
        </div>

        {/* ID Card Front */}
        <div className="grid-item file-upload">
          <label>ID Card Front:</label>
          <button type="button" onClick={() => handleFileUpload('idCardFront')}>
            Upload
          </button>
          {formData.idCardFront && (
            <img src={formData.idCardFront} alt="ID Front" className="upload-preview" />
          )}
        </div>

        {/* ID Card Back */}
        <div className="grid-item file-upload">
          <label>ID Card Back:</label>
          <button type="button" onClick={() => handleFileUpload('idCardBack')}>
            Upload
          </button>
          {formData.idCardBack && (
            <img src={formData.idCardBack} alt="ID Back" className="upload-preview" />
          )}
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Register
      </button>
    </form>
  );
}
