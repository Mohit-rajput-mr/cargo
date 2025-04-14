'use client';
import { useState, useEffect, useRef } from 'react';
import Modal from '../components/modal/modal';
import { FaCopy, FaMoon, FaSun } from 'react-icons/fa';
import Pusher from 'pusher-js';
import ClientPay from '../clientpay/clientpay'; // NEW: Import for Client Payments section
import './page.css';

export default function AdminPage() {
  // Dark Mode Toggle State with persistence
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem("adminDarkMode", newMode.toString());
      return newMode;
    });
  };

  useEffect(() => {
    const storedMode = localStorage.getItem("adminDarkMode");
    setDarkMode(storedMode === "true");
  }, []);

  // Notification state and refresh control
  const [notifications, setNotifications] = useState([]);
  const markAllNotificationsAsRead = () => setNotifications([]);

  // Selected section control; added new tab "clientpayments"
  const [selectedSection, setSelectedSection] = useState('loads');

  // ================= LOADS SECTION =================
  const [loads, setLoads] = useState([]);
  const [newLoad, setNewLoad] = useState({
    images: [],
    title: '',
    description: '',
    pickup: '',
    delivery: '',
    pay: '',
  });
  const [editLoad, setEditLoad] = useState(null);
  const [loadsFilter, setLoadsFilter] = useState('');

  const fetchLoads = async () => {
    try {
      const res = await fetch('/api/loads');
      const data = await res.json();
      // Sort loads so that newest is first
      const sortedLoads = (data.loads || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setLoads(sortedLoads);
    } catch (error) {
      console.error('Error fetching loads:', error);
    }
  };

  const handleLoadInputChange = (e) => {
    const { name, value } = e.target;
    setNewLoad({ ...newLoad, [name]: value });
  };

  const handleImageUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'dxngqy4ss',
        uploadPreset: 'cargoo',
        sources: ['local', 'camera'],
        cropping: false,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setNewLoad(prev => ({
            ...prev,
            images: [...prev.images, result.info.secure_url],
          }));
        }
      }
    );
  };

  const handleLoadSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...newLoad, imageUrl: JSON.stringify(newLoad.images) };
    const res = await fetch('/api/loads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.id) {
      alert('Load created successfully!');
      setNewLoad({
        images: [],
        title: '',
        description: '',
        pickup: '',
        delivery: '',
        pay: '',
      });
      fetchLoads();
    }
  };

  const handleEditClick = (load) => {
    let images = [];
    try {
      images = JSON.parse(load.imageUrl);
      if (!Array.isArray(images)) images = [load.imageUrl];
    } catch (err) {
      images = [load.imageUrl];
    }
    setEditLoad({ ...load, images });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditLoad({ ...editLoad, [name]: value });
  };

  const removeEditImage = (index) => {
    setEditLoad(prev => {
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });
  };

  const handleEditImageUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'dxngqy4ss',
        uploadPreset: 'cargoo',
        sources: ['local', 'camera'],
        cropping: false,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setEditLoad(prev => ({
            ...prev,
            images: [...prev.images, result.info.secure_url],
          }));
        }
      }
    );
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: editLoad.id,
      imageUrl: JSON.stringify(editLoad.images),
      title: editLoad.title,
      description: editLoad.description,
      pickup: editLoad.pickup,
      delivery: editLoad.delivery,
      pay: editLoad.pay,
    };
    const res = await fetch('/api/loads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      alert('Load updated successfully!');
      setEditLoad(null);
      fetchLoads();
    }
  };

  const handleDeleteLoad = async (loadId) => {
    if (confirm('Are you sure you want to delete this load?')) {
      const res = await fetch(`/api/loads?id=${loadId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Load deleted');
        fetchLoads();
      }
    }
  };

  // Filter loads by title or pickup/delivery address if needed
  const filteredLoads = loads.filter(load =>
    (load.title || '').toLowerCase().includes(loadsFilter.toLowerCase()) ||
    (load.pickup || '').toLowerCase().includes(loadsFilter.toLowerCase()) ||
    (load.delivery || '').toLowerCase().includes(loadsFilter.toLowerCase())
  );

  // ================= SERVICES SECTION =================
  const [services, setServices] = useState([]);
  const [serviceText, setServiceText] = useState('');
  const serviceEditorRef = useRef(null);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data.services || []);
      if (data.services && data.services.length > 0) {
        setServiceText(data.services[0].description);
      } else {
        setServiceText('');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleServiceSave = async () => {
    const htmlContent = serviceEditorRef.current.innerHTML;
    if (services.length > 0) {
      const id = services[0].id;
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, description: htmlContent }),
      });
      if (res.ok) alert('Service updated!');
    } else {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: htmlContent }),
      });
      if (res.ok) alert('Service created!');
    }
    fetchServices();
  };

  const handleServiceDelete = async () => {
    if (services.length > 0) {
      const id = services[0].id;
      if (confirm('Are you sure you want to delete this service record?')) {
        const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Service deleted!');
          fetchServices();
        }
      }
    }
  };

  const applyServiceFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  // ================= CONTACTS SECTION =================
  const [contacts, setContacts] = useState([]);
  const [contactText, setContactText] = useState('');
  const contactEditorRef = useRef(null);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      setContacts(data.contacts || []);
      if (data.contacts && data.contacts.length > 0) {
        setContactText(data.contacts[0].description);
      } else {
        setContactText('');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleContactSave = async () => {
    const htmlContent = contactEditorRef.current.innerHTML;
    if (contacts.length > 0) {
      const id = contacts[0].id;
      const res = await fetch('/api/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, description: htmlContent }),
      });
      if (res.ok) alert('Contacts updated!');
    } else {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: htmlContent }),
      });
      if (res.ok) alert('Contacts created!');
    }
    fetchContacts();
  };

  const handleContactDelete = async () => {
    if (contacts.length > 0) {
      const id = contacts[0].id;
      if (confirm('Are you sure you want to delete this contact record?')) {
        const res = await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Contacts deleted!');
          fetchContacts();
        }
      }
    }
  };

  const applyContactFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  // ================= BIDS SECTION =================
  const [bids, setBids] = useState([]);
  const [editBid, setEditBid] = useState(null);
  const [bidsTab, setBidsTab] = useState('pending'); // 'pending','approved','rejected'
  const [filterLoadId, setFilterLoadId] = useState('');
  const [unseenBidIds, setUnseenBidIds] = useState([]);
  const [bidSearch, setBidSearch] = useState('');

  const getRelativeTime = (ts) => {
    if (!ts) return '';
    const dateObj = new Date(ts);
    const diffMs = Date.now() - dateObj.getTime();
    const seconds = Math.floor(diffMs / 1000);
    const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (seconds < 60) return `${timeString} (Just now)`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${timeString} (${minutes} min ago)`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${timeString} (${hours} hr ago)`;
    const days = Math.floor(hours / 24);
    return `${timeString} (${days} day${days > 1 ? 's' : ''} ago)`;
  };

  const mergeBidsAndLoads = (bidsData, loadsData) => {
    return bidsData.map(bid => {
      const loadMatch = loadsData.find(ld => Number(ld.id) === Number(bid.loadId));
      return {
        ...bid,
        loadName: loadMatch ? loadMatch.title : '',
        loadPrice: loadMatch ? loadMatch.pay : '',
      };
    });
  };

  const fetchAllData = async () => {
    try {
      const loadRes = await fetch('/api/loads');
      const loadData = await loadRes.json();
      const allLoads = loadData.loads || [];
      // Sort loads newest first
      const sortedLoads = [...allLoads].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setLoads(sortedLoads);

      const bidRes = await fetch('/api/bids');
      const bidData = await bidRes.json();
      let fetchedBids = bidData.bids || [];
      // Merge load details with bids
      fetchedBids = mergeBidsAndLoads(fetchedBids, sortedLoads);
      // Sort bids newest first
      fetchedBids = fetchedBids.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setBids(fetchedBids);
    } catch (error) {
      console.error('Error fetching loads or bids:', error);
    }
  };

  // ======= Pusher for Bids (Replacing Socket.IO) =======
  useEffect(() => {
    fetchAllData();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
    const channel = pusher.subscribe('global-bids');
    channel.bind('new-bid', (incomingBid) => {
      fetchAllData();
      if (incomingBid.status === 'pending') {
        setUnseenBidIds(prev => [...prev, incomingBid.id]);
      }
    });
    return () => {
      pusher.unsubscribe('global-bids');
    };
  }, []);

  const pendingBids = bids.filter(b => b.status === 'pending');
  const approvedBids = bids.filter(b => b.status === 'approved');
  const rejectedBids = bids.filter(b => b.status === 'rejected');

  const filterBids = (list) => {
    const filtered = filterLoadId
      ? list.filter(bid => String(bid.loadId) === String(filterLoadId))
      : list;
    return bidSearch
      ? filtered.filter(bid => (bid.userName || '').toLowerCase().includes(bidSearch.toLowerCase()))
      : filtered;
  };

  // Update bid with persistent notification
  const updateBid = async (bidId, fields, targetUserId = null) => {
    const res = await fetch('/api/bids', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bidId, ...fields }),
    });
    if (res.ok) {
      alert('Bid updated successfully');
      setUnseenBidIds(prev => prev.filter(id => id !== bidId));
      fetchAllData();
      if (targetUserId) {
        const payload = {
          userId: targetUserId,
          message: 'Your bid history has been updated'
        };
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    }
  };

  const handleApprove = (bidId, adminMessage, targetUserId) => {
    updateBid(bidId, { status: 'approved', adminMessage }, targetUserId);
  };

  const handleReject = (bidId, adminMessage, targetUserId) => {
    updateBid(bidId, { status: 'rejected', adminMessage }, targetUserId);
  };

  const handleEditBidClick = (bid) => {
    setEditBid({ ...bid, adminMessage: bid.adminMessage || '' });
  };

  const handleDeleteBid = async (bidId) => {
    if (confirm('Are you sure you want to delete this bid?')) {
      const res = await fetch(`/api/bids?id=${bidId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Bid deleted');
        setUnseenBidIds(prev => prev.filter(id => id !== bidId));
        fetchAllData();
      }
    }
  };

  const handleEditBidSubmit = async (e) => {
    e.preventDefault();
    await updateBid(editBid.id, {
      bidAmount: editBid.bidAmount,
      adminMessage: editBid.adminMessage,
    });
    setEditBid(null);
  };

  // ================= USERS SECTION =================
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserImageModal, setShowUserImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [copyMessage, setCopyMessage] = useState({});
  const [userSearch, setUserSearch] = useState('');

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data.users || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(usr =>
    [usr.siteId, usr.username, usr.email, usr.name].some(field =>
      (field || '').toString().toLowerCase().includes(userSearch.toLowerCase())
    )
  );

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const res = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('User has been deleted.');
        fetchUsers();
      }
    }
  };

  const handleImageClick = (imgUrl) => {
    setSelectedImage(imgUrl);
    setShowUserImageModal(true);
  };

  const closeImageModal = () => {
    setSelectedImage('');
    setShowUserImageModal(false);
  };

  const downloadImage = () => {
    window.open(selectedImage, '_blank');
  };

  const copyToClipboard = (field, text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyMessage(prev => ({ ...prev, [field]: 'Copied!' }));
        setTimeout(() => {
          setCopyMessage(prev => ({ ...prev, [field]: '' }));
        }, 2000);
      })
      .catch(() => {
        setCopyMessage(prev => ({ ...prev, [field]: 'Error' }));
        setTimeout(() => {
          setCopyMessage(prev => ({ ...prev, [field]: '' }));
        }, 2000);
      });
  };

  // ================= TRANSACTIONS SECTION =================
  const [transactions, setTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState(null);
  // New state for document preview
  const [documentPreview, setDocumentPreview] = useState('');

  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions');
    const data = await res.json();
    // Sort transactions so newest is first
    const sortedTx = (data.transactions || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setTransactions(sortedTx);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEditTransaction = (tx) => {
    setEditTransaction(tx);
  };

  const handleDeleteTransaction = async (txId) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const res = await fetch(`/api/transactions?id=${txId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Transaction deleted');
        fetchTransactions();
      }
    }
  };

  const handleEditTransactionSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: editTransaction.id,
      userId: editTransaction.userId,
      payDescription: editTransaction.payDescription,
      paidAmount: editTransaction.paidAmount,
      documentUrl: editTransaction.documentUrl,
    };
    const res = await fetch('/api/transactions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      alert('Transaction updated');
      setEditTransaction(null);
      fetchTransactions();
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const userId = form.userId.value;
    const payDescription = form.payDescription.value;
    const paidAmount = form.paidAmount.value;
    const documentUrl = form.documentUrl.value;
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, payDescription, paidAmount, documentUrl }),
    });
    if (res.ok) {
      alert('Transaction recorded');
      fetchTransactions();
      // Notify user about transaction update
      const payload = { userId, message: 'Your transaction history has been updated' };
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      form.reset();
      setDocumentPreview('');
    }
  };

  // ================= NEW: Document Upload Preview for Transaction =================
  const handleDocumentUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'dxngqy4ss',
        uploadPreset: 'cargoo',
        sources: ['local', 'camera'],
        cropping: false,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const url = result.info.secure_url;
          document.querySelector('input[name="documentUrl"]').value = url;
          setDocumentPreview(url);
        }
      }
    );
  };

  // ================= Refresh Buttons =================
  const refreshLoads = () => fetchLoads();
  const refreshTransactions = () => fetchTransactions();
  const refreshUsers = () => fetchUsers();

  return (
    <div className={`admin-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* HEADER */}
      <header className="admin-header">
        <nav className="admin-nav">
          <ul>
            <li><button onClick={() => setSelectedSection('loads')}>Loads</button></li>
            <li><button onClick={() => setSelectedSection('services')}>Services</button></li>
            <li><button onClick={() => setSelectedSection('contacts')}>Contacts</button></li>
            <li><button onClick={() => setSelectedSection('bids')}>Bids</button></li>
            <li><button onClick={() => setSelectedSection('users')}>Users</button></li>
            <li><button onClick={() => setSelectedSection('transactions')}>Transactions</button></li>
            <li><button onClick={() => setSelectedSection('clientpayments')}>Client Payments</button></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button onClick={markAllNotificationsAsRead} title="Mark all notifications as read">Mark All Read</button>
          <div className="theme-toggle">
            {darkMode ? (
              <FaSun onClick={toggleDarkMode} title="Switch to Light Mode" />
            ) : (
              <FaMoon onClick={toggleDarkMode} title="Switch to Dark Mode" />
            )}
          </div>
        </div>
        <button
          className="admin-close-btn"
          onClick={() => {
            if (confirm('Are you sure you want to close the admin panel?')) {
              localStorage.removeItem('user');
              window.location.reload();
            }
          }}
          title="Close Admin Panel"
        >
          ✕
        </button>
      </header>

      {/* ================= LOADS SECTION ================= */}
      {selectedSection === 'loads' && (
        <section className="admin-section">
          <h2>Load Section</h2>
          <button className="refresh-btn" onClick={refreshLoads} title="Refresh Loads">Refresh Loads</button>
          <input 
            type="text"
            placeholder="Filter loads by title, pickup or delivery"
            value={loadsFilter}
            onChange={(e) => setLoadsFilter(e.target.value)}
            className="filter-input"
          />
          <form onSubmit={handleLoadSubmit} className="admin-form">
            <label>
              Load Images:
              <button type="button" onClick={handleImageUpload}>Upload Image</button>
              <div className="image-preview-container">
                {newLoad.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Upload ${idx}`} />
                ))}
              </div>
            </label>
            <label>
              Title:
              <input type="text" name="title" value={newLoad.title} onChange={handleLoadInputChange} required />
            </label>
            <label>
              Description:
              <textarea name="description" value={newLoad.description} onChange={handleLoadInputChange} required />
            </label>
            <label>
              Pickup Address:
              <input type="text" name="pickup" value={newLoad.pickup} onChange={handleLoadInputChange} required />
            </label>
            <label>
              Delivery Address:
              <input type="text" name="delivery" value={newLoad.delivery} onChange={handleLoadInputChange} required />
            </label>
            <label>
              Pay:
              <input type="text" name="pay" value={newLoad.pay} onChange={handleLoadInputChange} required />
            </label>
            <button type="submit">Submit Load</button>
          </form>
          <div className="admin-list">
            <h3>Existing Loads</h3>
            {loads.length === 0 ? (
              <p>No loads available.</p>
            ) : (
              <ul>
                {filteredLoads.map(load => (
                  <li key={load.id}>
                    <p><strong>{load.title}</strong></p>
                    <p>Load ID: {load.id} | Uploaded: {load.created_at ? new Date(load.created_at).toLocaleString() : 'N/A'}</p>
                    <p>{load.description}</p>
                    <p>From: {load.pickup} To: {load.delivery}</p>
                    <p>Pay: {load.pay}</p>
                    <div className="load-image-gallery">
                      {(() => {
                        let imgs = [];
                        try {
                          imgs = JSON.parse(load.imageUrl);
                          if (!Array.isArray(imgs)) imgs = [load.imageUrl];
                        } catch (err) {
                          imgs = [load.imageUrl];
                        }
                        return imgs.map((img, idx) => (
                          <img key={idx} src={img} alt={`Load ${load.id} Image ${idx}`} />
                        ));
                      })()}
                    </div>
                    <div className="load-actions">
                      <button className="edit-btn" onClick={() => handleEditClick(load)} title="Edit Load">Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteLoad(load.id)} title="Delete Load">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Modal for Editing Load */}
      {editLoad && (
        <Modal onClose={() => setEditLoad(null)}>
          <div className="edit-load-modal">
            <button className="modal-close-btn" onClick={() => setEditLoad(null)}>✕</button>
            <h3 className="edit-load-title">Edit Load</h3>
            <form onSubmit={handleEditSubmit} className="admin-form edit-load-form">
              <label>
                Title:
                <input type="text" name="title" value={editLoad.title} onChange={handleEditInputChange} required />
              </label>
              <label className="edit-load-description">
                Description:
                <textarea name="description" value={editLoad.description} onChange={handleEditInputChange} required />
              </label>
              <label>
                Pickup Address:
                <input type="text" name="pickup" value={editLoad.pickup} onChange={handleEditInputChange} required />
              </label>
              <label>
                Delivery Address:
                <input type="text" name="delivery" value={editLoad.delivery} onChange={handleEditInputChange} required />
              </label>
              <label>
                Pay:
                <input type="text" name="pay" value={editLoad.pay} onChange={handleEditInputChange} required />
              </label>
              <div className="edit-load-upload">
                <button type="button" onClick={handleEditImageUpload} title="Upload Additional Image">Upload Additional Image</button>
                <div className="image-preview-container">
                  {editLoad.images.map((img, idx) => (
                    <div key={idx} className="edit-image-preview">
                      <img src={img} alt={`Edit ${idx}`} />
                      <button type="button" onClick={() => removeEditImage(idx)} className="remove-img-btn" title="Remove Image">X</button>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit">Update Load</button>
            </form>
          </div>
        </Modal>
      )}

      {/* ================= SERVICES SECTION ================= */}
      {selectedSection === 'services' && (
        <section className="admin-section">
          <h2>Services Section</h2>
          <div className="wysiwyg-toolbar">
            <button onClick={() => applyServiceFormat('bold')} title="Bold"><b>B</b></button>
            <button onClick={() => applyServiceFormat('italic')} title="Italic"><i>I</i></button>
            <button onClick={() => applyServiceFormat('underline')} title="Underline"><u>U</u></button>
            <button onClick={() => applyServiceFormat('insertUnorderedList')} title="Bulleted List">• Bullets</button>
            <button onClick={() => applyServiceFormat('justifyLeft')} title="Align Left">Left</button>
            <button onClick={() => applyServiceFormat('justifyCenter')} title="Center">Center</button>
            <button onClick={() => applyServiceFormat('justifyRight')} title="Align Right">Right</button>
          </div>
          <div className="wysiwyg-editor" contentEditable ref={serviceEditorRef} dangerouslySetInnerHTML={{ __html: serviceText }} />
          <button onClick={handleServiceSave}>Save Service</button>
          {services.length > 0 && <button onClick={handleServiceDelete}>Delete Service</button>}
          {services.length > 0 && (
            <div className="admin-display">
              <h3>Saved Service (HTML Preview):</h3>
              <div dangerouslySetInnerHTML={{ __html: services[0].description }} />
            </div>
          )}
        </section>
      )}

      {/* ================= CONTACTS SECTION ================= */}
      {selectedSection === 'contacts' && (
        <section className="admin-section">
          <h2>Contacts Section</h2>
          <div className="wysiwyg-toolbar">
            <button onClick={() => applyContactFormat('bold')} title="Bold"><b>B</b></button>
            <button onClick={() => applyContactFormat('italic')} title="Italic"><i>I</i></button>
            <button onClick={() => applyContactFormat('underline')} title="Underline"><u>U</u></button>
            <button onClick={() => applyContactFormat('insertUnorderedList')} title="Bulleted List">• Bullets</button>
            <button onClick={() => applyContactFormat('justifyLeft')} title="Align Left">Left</button>
            <button onClick={() => applyContactFormat('justifyCenter')} title="Center">Center</button>
            <button onClick={() => applyContactFormat('justifyRight')} title="Align Right">Right</button>
          </div>
          <div className="wysiwyg-editor" contentEditable ref={contactEditorRef} dangerouslySetInnerHTML={{ __html: contactText }} />
          <button onClick={handleContactSave}>Save Contacts</button>
          {contacts.length > 0 && <button onClick={handleContactDelete}>Delete Contacts</button>}
          {contacts.length > 0 && (
            <div className="admin-display">
              <h3>Saved Contacts (HTML Preview):</h3>
              <div dangerouslySetInnerHTML={{ __html: contacts[0].description }} />
            </div>
          )}
        </section>
      )}

      {/* ================= BIDS SECTION ================= */}
      {selectedSection === 'bids' && (
        <section className="admin-section bids-section">
          <h2>Bids Section</h2>
          <div className="bids-tabs">
            <button className={bidsTab === 'pending' ? 'active-tab' : ''} onClick={() => setBidsTab('pending')}>Pending Bids</button>
            <button className={bidsTab === 'approved' ? 'active-tab' : ''} onClick={() => setBidsTab('approved')}>Approved Bids</button>
            <button className={bidsTab === 'rejected' ? 'active-tab' : ''} onClick={() => setBidsTab('rejected')}>Rejected Bids</button>
            <div className="bid-filter">
              <label>Filter by Load ID:</label>
              <input type="text" placeholder="Enter Load ID" value={filterLoadId} onChange={(e) => setFilterLoadId(e.target.value)} />
            </div>
            <div className="bid-filter">
              <label>Search Bidder:</label>
              <input type="text" placeholder="Search by bidder name" value={bidSearch} onChange={(e) => setBidSearch(e.target.value)} />
            </div>
          </div>
          {bidsTab === 'pending' && (
            <div className="bids-container">
              {filterBids(pendingBids).length === 0 ? (
                <p>No pending bids.</p>
              ) : (
                <ol>
                  {filterBids(pendingBids).map((bid, index) => (
                    <li key={bid.id} className={`bid-item ${unseenBidIds.includes(bid.id) ? 'unseen-bid' : ''}`}>
                      <span className="bid-serial">{index + 1}.</span>
                      {(() => {
                        const userInfo = users.find(u => u.id === bid.userId);
                        const siteId = userInfo ? userInfo.siteId : `T${bid.userId}`;
                        return (
                          <p><strong>{siteId} – {userInfo ? userInfo.username : 'Unknown'}</strong></p>
                        );
                      })()}
                      <p><strong>Email:</strong> {users.find(u => u.id === bid.userId)?.email || 'N/A'}</p>
                      <p><strong>Bid Amount:</strong> ${bid.bidAmount}</p>
                      <p><strong>Bid Updated:</strong> {getRelativeTime(bid.created_at)}</p>
                      <p><strong>Admin Message:</strong> {bid.adminMessage || ''}</p>
                      <div className="bid-actions">
                        <input
                          type="text"
                          placeholder="Admin Message..."
                          className="bid-message-input"
                          onChange={(e) => (bid.adminMessage = e.target.value)}
                        />
                        <button className="approve-btn" onClick={() => handleApprove(bid.id, bid.adminMessage, bid.userId)} title="Approve Bid">Approve</button>
                        <button className="reject-btn" onClick={() => handleReject(bid.id, bid.adminMessage, bid.userId)} title="Reject Bid">Reject</button>
                        <button className="delete-btn" onClick={() => handleDeleteBid(bid.id)} title="Delete Bid">Delete</button>
                        <button
                          className="profile-btn"
                          onClick={() => {
                            const userInfo = users.find(u => u.id === bid.userId);
                            alert(`Profile:\nUser ID: ${userInfo?.siteId}\nName: ${userInfo?.username}\nEmail: ${userInfo?.email || 'unknown'}\nTruck: ${userInfo?.truckType || 'unknown'}`);
                          }}
                          title="View Profile"
                        >
                          View Profile
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
          {bidsTab === 'approved' && (
            <div className="bids-container fixed-bids-container">
              {filterBids(approvedBids).length === 0 ? (
                <p>No approved bids.</p>
              ) : (
                <ol>
                  {filterBids(approvedBids).map((bid, index) => (
                    <li key={bid.id} className="bid-item">
                      <span className="bid-serial">{index + 1}.</span>
                      {(() => {
                        const userInfo = users.find(u => u.id === bid.userId);
                        const siteId = userInfo ? userInfo.siteId : `T${bid.userId}`;
                        return (
                          <p><strong>{siteId} – {userInfo ? userInfo.username : 'Unknown'}</strong></p>
                        );
                      })()}
                      <p><strong>Email:</strong> {users.find(u => u.id === bid.userId)?.email || 'N/A'}</p>
                      <p><strong>Bid Amount:</strong> ${bid.bidAmount}</p>
                      <p><strong>Bid Updated:</strong> {getRelativeTime(bid.created_at)}</p>
                      <p><strong>Admin Message:</strong> {bid.adminMessage || ''}</p>
                      <div className="bid-actions">
                        <button className="delete-btn" onClick={() => handleDeleteBid(bid.id)} title="Delete Bid">Delete</button>
                        <button
                          className="profile-btn"
                          onClick={() => {
                            const userInfo = users.find(u => u.id === bid.userId);
                            alert(`Profile:\nUser ID: ${userInfo?.siteId}\nName: ${userInfo?.username}\nEmail: ${userInfo?.email || 'unknown'}\nTruck: ${userInfo?.truckType || 'unknown'}`);
                          }}
                          title="View Profile"
                        >
                          View Profile
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
          {bidsTab === 'rejected' && (
            <div className="bids-container fixed-bids-container">
              {filterBids(rejectedBids).length === 0 ? (
                <p>No rejected bids.</p>
              ) : (
                <ol>
                  {filterBids(rejectedBids).map((bid, index) => (
                    <li key={bid.id} className="bid-item">
                      <span className="bid-serial">{index + 1}.</span>
                      {(() => {
                        const userInfo = users.find(u => u.id === bid.userId);
                        const siteId = userInfo ? userInfo.siteId : `T${bid.userId}`;
                        return (
                          <p><strong>{siteId} – {userInfo ? userInfo.username : 'Unknown'}</strong></p>
                        );
                      })()}
                      <p><strong>Email:</strong> {users.find(u => u.id === bid.userId)?.email || 'N/A'}</p>
                      <p><strong>Bid Amount:</strong> ${bid.bidAmount}</p>
                      <p><strong>Bid Updated:</strong> {getRelativeTime(bid.created_at)}</p>
                      <p><strong>Admin Message:</strong> {bid.adminMessage || ''}</p>
                      <div className="bid-actions">
                        <button className="delete-btn" onClick={() => handleDeleteBid(bid.id)} title="Delete Bid">Delete</button>
                        <button
                          className="profile-btn"
                          onClick={() => {
                            const userInfo = users.find(u => u.id === bid.userId);
                            alert(`Profile:\nUser ID: ${userInfo?.siteId}\nName: ${userInfo?.username}\nEmail: ${userInfo?.email || 'unknown'}\nTruck: ${userInfo?.truckType || 'unknown'}`);
                          }}
                          title="View Profile"
                        >
                          View Profile
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </section>
      )}

      {/* ================= USERS SECTION ================= */}
      {selectedSection === 'users' && (
        <section className="admin-section users-section">
          <h2>Users Section</h2>
          <button className="refresh-btn" onClick={refreshUsers} title="Refresh Users">Refresh Users</button>
          <div className="user-search-bar">
            <input type="text" placeholder="Search by Name, Email, ID or Username" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
          </div>
          <div className="admin-list users-list">
            <h3>Existing Users</h3>
            {filteredUsers.length === 0 ? (
              <p>No users match the search criteria.</p>
            ) : (
              <ul>
                {filteredUsers.map(usr => (
                  <li key={usr.id} onClick={() => setSelectedUser(usr)} className="clickable" style={{ backgroundColor: usr.isDeleted ? '#ffe6e6' : '#e6f7ff' }}>
                    {usr.siteId} – {usr.username} – {usr.email}
                    {usr.isDeleted && ' (Deleted)'}
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(usr.id); }} className="delete-user-btn" style={{ marginLeft: '10px' }} disabled={usr.isDeleted} title="Delete User">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* ================= TRANSACTIONS SECTION ================= */}
      {selectedSection === 'transactions' && (
        <section className="admin-section">
          <h2>Transaction History (Admin)</h2>
          <button className="refresh-btn" onClick={refreshTransactions} title="Refresh Transactions">Refresh Transactions</button>
          <form className="admin-form" onSubmit={handleTransactionSubmit}>
            <label>
              Select User:
              <select name="userId" required>
                <option value="">--Select User--</option>
                {users.map(usr => (
                  <option key={usr.id} value={usr.id}>
                    {usr.siteId} - {usr.username} ({usr.email})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Pay Description:
              <textarea name="payDescription" required />
            </label>
            <label>
              Paid Amount:
              <input type="text" name="paidAmount" required />
            </label>
            <label>
              Document Upload:
              <button type="button" onClick={handleDocumentUpload} title="Upload Document">Upload Document</button>
              {documentPreview && <img src={documentPreview} alt="Document Preview" className="doc-preview" />}
              <input type="hidden" name="documentUrl" required />
            </label>
            <button type="submit">Record Transaction</button>
          </form>
          <div className="admin-list">
            <h3>All Transactions</h3>
            {transactions.length === 0 ? (
              <p>No transactions recorded.</p>
            ) : (
              <ul>
                {transactions.map(tx => {
                  const userInfo = users.find(u => u.id === tx.userId);
                  return (
                    <li key={tx.id}>
                      <p><strong>User:</strong> {userInfo ? userInfo.siteId : `T${tx.userId}`} – {userInfo ? userInfo.username : 'Unknown'} – {userInfo ? userInfo.email : 'N/A'}</p>
                      <p><strong>Pay Description:</strong> {tx.payDescription}</p>
                      <p><strong>Paid Amount:</strong> {tx.paidAmount}</p>
                      <p><strong>Updated:</strong> {tx.created_at ? new Date(tx.created_at).toLocaleString() : 'N/A'}</p>
                      {tx.documentUrl && (
                        <p>
                          <a href={tx.documentUrl} target="_blank" rel="noopener noreferrer" title="View Document">View Document</a>
                        </p>
                      )}
                      <button className="edit-btn" onClick={() => handleEditTransaction(tx)} title="Edit Transaction">Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteTransaction(tx.id)} title="Delete Transaction">Delete</button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* NEW: CLIENT PAYMENTS SECTION */}
      {selectedSection === 'clientpayments' && (
        <section className="admin-section">
          <ClientPay />
        </section>
      )}

      {/* Modal for Editing Transaction */}
      {editTransaction && (
        <Modal onClose={() => setEditTransaction(null)}>
          <form onSubmit={handleEditTransactionSubmit} className="admin-form">
            <h3>Edit Transaction</h3>
            <label>
              User ID:
              <input type="text" value={editTransaction.userId} onChange={(e) => setEditTransaction({ ...editTransaction, userId: e.target.value })} />
            </label>
            <label>
              Pay Description:
              <textarea value={editTransaction.payDescription} onChange={(e) => setEditTransaction({ ...editTransaction, payDescription: e.target.value })} />
            </label>
            <label>
              Paid Amount:
              <input type="text" value={editTransaction.paidAmount} onChange={(e) => setEditTransaction({ ...editTransaction, paidAmount: e.target.value })} />
            </label>
            <label>
              Document URL:
              <input type="text" value={editTransaction.documentUrl} onChange={(e) => setEditTransaction({ ...editTransaction, documentUrl: e.target.value })} />
            </label>
            <button type="submit">Update Transaction</button>
          </form>
        </Modal>
      )}

      {/* Modal for Editing Bid */}
      {editBid && (
        <Modal onClose={() => setEditBid(null)}>
          <form onSubmit={handleEditBidSubmit} className="admin-form">
            <h3>Edit Bid</h3>
            <label>
              Bid Amount:
              <input type="number" value={editBid.bidAmount} onChange={(e) => setEditBid({ ...editBid, bidAmount: e.target.value })} />
            </label>
            <label>
              Admin Message:
              <input type="text" value={editBid.adminMessage || ''} onChange={(e) => setEditBid({ ...editBid, adminMessage: e.target.value })} />
            </label>
            <button type="submit">Update Bid</button>
          </form>
        </Modal>
      )}

      {/* Modal for Viewing User Details */}
      {selectedUser && (
        <Modal onClose={() => setSelectedUser(null)}>
          <div className="user-details-modal">
            <button className="user-close-btn" onClick={() => setSelectedUser(null)}>✕</button>
            <h3>User Details</h3>
            <div className="user-details-grid">
              <div className="user-main-info" style={{ backgroundColor: '#f1f1f1', padding: '10px', borderRadius: '8px' }}>
                {selectedUser.isDeleted && <p>(User deleted their profile)</p>}
                <p>
                  <strong>ID:</strong> {selectedUser.siteId}{' '}
                  <FaCopy className="copy-icon" onClick={() => copyToClipboard('ID', selectedUser.siteId)} title="Copy ID" />{' '}
                  {copyMessage['ID'] && <span className="copy-notice">{copyMessage['ID']}</span>}
                </p>
                <p>
                  <strong>Username:</strong> {selectedUser.username}{' '}
                  <FaCopy className="copy-icon" onClick={() => copyToClipboard('Username', selectedUser.username)} title="Copy Username" />{' '}
                  {copyMessage['Username'] && <span className="copy-notice">{copyMessage['Username']}</span>}
                </p>
                <p>
                  <strong>Name:</strong> {selectedUser.name}{' '}
                  <FaCopy className="copy-icon" onClick={() => copyToClipboard('Name', selectedUser.name)} title="Copy Name" />{' '}
                  {copyMessage['Name'] && <span className="copy-notice">{copyMessage['Name']}</span>}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}{' '}
                  <FaCopy className="copy-icon" onClick={() => copyToClipboard('Email', selectedUser.email)} title="Copy Email" />{' '}
                  {copyMessage['Email'] && <span className="copy-notice">{copyMessage['Email']}</span>}
                </p>
                <p>
                  <strong>Truck Type:</strong> {selectedUser.truckType}{' '}
                  {selectedUser.customTruckType && `(${selectedUser.customTruckType})`}{' '}
                  <FaCopy className="copy-icon" onClick={() =>
                    copyToClipboard(
                      'Truck Type',
                      selectedUser.truckType + (selectedUser.customTruckType ? ` (${selectedUser.customTruckType})` : '')
                    )
                  } title="Copy Truck Type" />{' '}
                  {copyMessage['Truck Type'] && <span className="copy-notice">{copyMessage['Truck Type']}</span>}
                </p>
                <p>
                  <strong>ID Number:</strong> {selectedUser.idNumber}{' '}
                  <FaCopy className="copy-icon" onClick={() => copyToClipboard('ID Number', selectedUser.idNumber)} title="Copy ID Number" />{' '}
                  {copyMessage['ID Number'] && <span className="copy-notice">{copyMessage['ID Number']}</span>}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedUser.phone}{' '}
                  <FaCopy className="copy-icon" onClick={() => copyToClipboard('Phone', selectedUser.phone)} title="Copy Phone" />{' '}
                  {copyMessage['Phone'] && <span className="copy-notice">{copyMessage['Phone']}</span>}
                </p>
                <p>
                  <strong>IBAN:</strong> {selectedUser.iban}{' '}
                  <FaCopy className="copy-icon" onClick={() => copyToClipboard('IBAN', selectedUser.iban)} title="Copy IBAN" />{' '}
                  {copyMessage['IBAN'] && <span className="copy-notice">{copyMessage['IBAN']}</span>}
                </p>
                <p>
                  <strong>SWIFT Code:</strong> {selectedUser.swiftCode}{' '}
                  <FaCopy className="copy-icon" onClick={() => copyToClipboard('SWIFT Code', selectedUser.swiftCode)} title="Copy SWIFT" />{' '}
                  {copyMessage['SWIFT Code'] && <span className="copy-notice">{copyMessage['SWIFT Code']}</span>}
                </p>
                <p>
                  <strong>Recipient Name:</strong> {selectedUser.recipientName}{' '}
                  <FaCopy className="copy-icon" onClick={() => copyToClipboard('Recipient Name', selectedUser.recipientName)} title="Copy Recipient Name" />{' '}
                  {copyMessage['Recipient Name'] && <span className="copy-notice">{copyMessage['Recipient Name']}</span>}
                </p>
              </div>
              <div className="user-doc-info">
                <div className="doc-item">
                  <h4>Vehicle Image:</h4>
                  {selectedUser.vehicleImage && (
                    <img src={selectedUser.vehicleImage} alt="Vehicle" className="user-doc-image" onClick={() => handleImageClick(selectedUser.vehicleImage)} />
                  )}
                </div>
                <div className="doc-item">
                  <h4>Driving License Front:</h4>
                  {selectedUser.drivingLicenseFront && (
                    <img src={selectedUser.drivingLicenseFront} alt="DL Front" className="user-doc-image" onClick={() => handleImageClick(selectedUser.drivingLicenseFront)} />
                  )}
                </div>
                <div className="doc-item">
                  <h4>Driving License Back:</h4>
                  {selectedUser.drivingLicenseBack && (
                    <img src={selectedUser.drivingLicenseBack} alt="DL Back" className="user-doc-image" onClick={() => handleImageClick(selectedUser.drivingLicenseBack)} />
                  )}
                </div>
                <div className="doc-item">
                  <h4>ID Card Front:</h4>
                  {selectedUser.idCardFront && (
                    <img src={selectedUser.idCardFront} alt="ID Front" className="user-doc-image" onClick={() => handleImageClick(selectedUser.idCardFront)} />
                  )}
                </div>
                <div className="doc-item">
                  <h4>ID Card Back:</h4>
                  {selectedUser.idCardBack && (
                    <img src={selectedUser.idCardBack} alt="ID Back" className="user-doc-image" onClick={() => handleImageClick(selectedUser.idCardBack)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= LIGHTBOX FOR USER IMAGE ================= */}
      {showUserImageModal && (
        <div className="image-lightbox">
          <div className="lightbox-overlay" onClick={closeImageModal}></div>
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={closeImageModal}>✕</button>
            <img src={selectedImage} alt="Full Preview" />
            <button className="download-btn" onClick={downloadImage}>Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
