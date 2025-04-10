'use client';
import { useState, useEffect } from 'react';
import Modal from '../modal/modal';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './profile.css';

export default function ProfilePanel({ user, setUser, onClose }) {
  const [formData, setFormData] = useState({
    id: user?.id || '',
    username: user?.username || '',
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    truckType: user?.truckType || '',
    customTruckType: user?.customTruckType || '',
    vehicleImage: user?.vehicleImage || '',
    idNumber: user?.idNumber || '',
    phone: user?.phone || '',
    iban: user?.iban || '',
    swiftCode: user?.swiftCode || '',
    recipientName: user?.recipientName || '',
    drivingLicenseFront: user?.drivingLicenseFront || '',
    drivingLicenseBack: user?.drivingLicenseBack || '',
    idCardFront: user?.idCardFront || '',
    idCardBack: user?.idCardBack || '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sync formData with user updates
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || '',
        username: user.username || '',
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        truckType: user.truckType || '',
        customTruckType: user.customTruckType || '',
        vehicleImage: user.vehicleImage || '',
        idNumber: user.idNumber || '',
        phone: user.phone || '',
        iban: user.iban || '',
        swiftCode: user.swiftCode || '',
        recipientName: user.recipientName || '',
        drivingLicenseFront: user.drivingLicenseFront || '',
        drivingLicenseBack: user.drivingLicenseBack || '',
        idCardFront: user.idCardFront || '',
        idCardBack: user.idCardBack || '',
      });
    }
  }, [user]);

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
        if (!error && result && result.event === "success") {
          setFormData((prev) => ({ ...prev, [field]: result.info.secure_url }));
        }
      }
    );
  };

  const handleRemoveImage = (field) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if ((formData.password || formData.confirmPassword) && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const payload = { ...formData };
    if (!formData.password) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully.');
        onClose();
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating profile.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action is irreversible.')) return;
    try {
      const res = await fetch(`/api/users?id=${user.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Your account has been deleted.');
        setUser(null);
        localStorage.removeItem('user');
        onClose();
      } else {
        alert('Failed to delete account.');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting account.');
    }
  };

  const handleLogout = () => {
    if (!confirm('Are you sure you want to log out?')) return;
    setUser(null);
    localStorage.removeItem('user');
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="profile-panel">
        <h2>My Profile</h2>
        <form onSubmit={handleUpdateProfile} className="profile-form">
          <div className="profile-grid">
            {/* Username */}
            <div className="profile-item">
              <label>Username:</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} disabled />
            </div>
            {/* Full Name */}
            <div className="profile-item">
              <label>Full Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            {/* Email */}
            <div className="profile-item">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            {/* Password */}
            <div className="profile-item">
              <label>Password:</label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password (if changing)"
                />
                <button type="button" className="eye-btn" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {/* Confirm Password */}
            <div className="profile-item">
              <label>Confirm Password:</label>
              <div className="password-field">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
                <button type="button" className="eye-btn" onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {/* Truck Type */}
            <div className="profile-item">
              <label>Truck Type:</label>
              <select name="truckType" value={formData.truckType} onChange={handleChange}>
                <option value="Truck">Truck</option>
                <option value="Trailer">Trailer</option>
                <option value="Van">Van</option>
                <option value="Pickup">Pickup</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {formData.truckType === 'Other' && (
              <div className="profile-item">
                <label>Specify Truck Type:</label>
                <input type="text" name="customTruckType" value={formData.customTruckType} onChange={handleChange} />
              </div>
            )}
            {/* ID Number */}
            <div className="profile-item">
              <label>ID Number:</label>
              <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} />
            </div>
            {/* Phone */}
            <div className="profile-item">
              <label>Phone:</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            {/* IBAN */}
            <div className="profile-item">
              <label>IBAN:</label>
              <input type="text" name="iban" value={formData.iban} onChange={handleChange} />
            </div>
            {/* SWIFT Code */}
            <div className="profile-item">
              <label>SWIFT Code:</label>
              <input type="text" name="swiftCode" value={formData.swiftCode} onChange={handleChange} />
            </div>
            {/* Recipient Name */}
            <div className="profile-item">
              <label>Recipient Name:</label>
              <input type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} />
            </div>
            {/* Vehicle Image */}
            <div className="profile-item image-item">
              <label>Vehicle Image:</label>
              <button type="button" onClick={() => handleFileUpload('vehicleImage')}>
                Upload
              </button>
              {formData.vehicleImage && (
                <div className="image-preview">
                  <img src={formData.vehicleImage} alt="Vehicle" />
                  <button type="button" onClick={() => handleRemoveImage('vehicleImage')}>
                    Remove
                  </button>
                </div>
              )}
            </div>
            {/* Driving License Front */}
            <div className="profile-item image-item">
              <label>Driving License Front:</label>
              <button type="button" onClick={() => handleFileUpload('drivingLicenseFront')}>
                Upload
              </button>
              {formData.drivingLicenseFront && (
                <div className="image-preview">
                  <img src={formData.drivingLicenseFront} alt="DL Front" />
                  <button type="button" onClick={() => handleRemoveImage('drivingLicenseFront')}>
                    Remove
                  </button>
                </div>
              )}
            </div>
            {/* Driving License Back */}
            <div className="profile-item image-item">
              <label>Driving License Back:</label>
              <button type="button" onClick={() => handleFileUpload('drivingLicenseBack')}>
                Upload
              </button>
              {formData.drivingLicenseBack && (
                <div className="image-preview">
                  <img src={formData.drivingLicenseBack} alt="DL Back" />
                  <button type="button" onClick={() => handleRemoveImage('drivingLicenseBack')}>
                    Remove
                  </button>
                </div>
              )}
            </div>
            {/* ID Card Front */}
            <div className="profile-item image-item">
              <label>ID Card Front:</label>
              <button type="button" onClick={() => handleFileUpload('idCardFront')}>
                Upload
              </button>
              {formData.idCardFront && (
                <div className="image-preview">
                  <img src={formData.idCardFront} alt="ID Front" />
                  <button type="button" onClick={() => handleRemoveImage('idCardFront')}>
                    Remove
                  </button>
                </div>
              )}
            </div>
            {/* ID Card Back */}
            <div className="profile-item image-item">
              <label>ID Card Back:</label>
              <button type="button" onClick={() => handleFileUpload('idCardBack')}>
                Upload
              </button>
              {formData.idCardBack && (
                <div className="image-preview">
                  <img src={formData.idCardBack} alt="ID Back" />
                  <button type="button" onClick={() => handleRemoveImage('idCardBack')}>
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="profile-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" className="logout-btn" onClick={handleLogout}>Log Out</button>
            <button type="button" className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
