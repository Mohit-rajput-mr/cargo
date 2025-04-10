'use client';
import { useEffect, useState } from 'react';
import './bidhistory.css';

// Helper function to format a timestamp relative to now.
function getRelativeTime(ts) {
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
}

export default function BidHistory({ currentUser }) {
  const [allBids, setAllBids] = useState([]);
  const [viewBin, setViewBin] = useState(false);

  useEffect(() => {
    async function fetchBids() {
      try {
        const res = await fetch('/api/bids');
        const data = await res.json();
        if (Array.isArray(data.bids) && currentUser) {
          // Filter bids to only those of the current user.
          const userBids = data.bids.filter(bid => bid.userId === currentUser.id);
          setAllBids(userBids);
        }
      } catch (error) {
        console.error('Failed to fetch bids:', error);
      }
    }
    if (currentUser) {
      fetchBids();
    }
  }, [currentUser]);

  // Separate bids into active and removed.
  // We assume: isRemoved = 0 means active, and isRemoved = 1 means removed.
  const activeBids = allBids.filter(bid => Number(bid.isRemoved) === 0);
  const removedBids = allBids.filter(bid => Number(bid.isRemoved) === 1);

  // In active bids, show updated bids (approved/rejected with status_updated_at) on top,
  // then pending bids sorted by creation time.
  const updatedBids = activeBids
    .filter(bid => bid.status !== 'pending' && bid.status_updated_at)
    .sort((a, b) => new Date(b.status_updated_at) - new Date(a.status_updated_at));
  const pendingBids = activeBids
    .filter(bid => bid.status === 'pending' || !bid.status_updated_at)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const sortedActiveBids = [...updatedBids, ...pendingBids];

  // Sort removed bids (from the bin) by created_at descending.
  const sortedRemovedBids = removedBids.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Handler to "remove" a bid (i.e. set isRemoved = true in the database)
  const handleRemove = async (bidId) => {
    try {
      const res = await fetch('/api/bids', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId, isRemoved: true })
      });
      if (!res.ok) throw new Error('Failed to remove bid');
      // Update local state with new removal flag.
      setAllBids(prev => prev.map(bid => bid.id === bidId ? { ...bid, isRemoved: 1, removed_at: new Date() } : bid));
    } catch (error) {
      console.error('Error removing bid:', error);
    }
  };

  // Handler to "restore" a bid (i.e. set isRemoved = false in the database)
  const handleRestore = async (bidId) => {
    try {
      const res = await fetch('/api/bids', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId, isRemoved: false })
      });
      if (!res.ok) throw new Error('Failed to restore bid');
      // Update local state with restored bid.
      setAllBids(prev => prev.map(bid => bid.id === bidId ? { ...bid, isRemoved: 0, removed_at: null } : bid));
    } catch (error) {
      console.error('Error restoring bid:', error);
    }
  };

  return (
    <div className="bid-history">
      <h2>{viewBin ? 'Removed Bids' : 'Your Bid History'}</h2>
      <button className="toggle-bin-btn" onClick={() => setViewBin(!viewBin)}>
        {viewBin ? 'Back to Active Bids' : 'View Bids Bin'}
      </button>

      {(!viewBin ? sortedActiveBids : sortedRemovedBids).length === 0 ? (
        <p>{viewBin ? 'No bids in bin.' : 'You have not placed any bids.'}</p>
      ) : (
        <ul>
          {(!viewBin ? sortedActiveBids : sortedRemovedBids).map(bid => (
            <li key={bid.id}>
              <p><strong>Load ID:</strong> {bid.loadId}</p>
              <p><strong>Bid Amount:</strong> ${bid.bidAmount}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status-${bid.status.toLowerCase()}`}>
                  {bid.status}
                </span>
                {bid.status !== 'pending' && bid.status_updated_at && (
                  <span className="status-update-time">
                    (Updated: {getRelativeTime(bid.status_updated_at)})
                  </span>
                )}
              </p>
              {bid.adminMessage && (
                <p>
                  <strong>Message from Admin:</strong> {bid.adminMessage}
                </p>
              )}
              <p><strong>Placed:</strong> {getRelativeTime(bid.created_at)}</p>
              {viewBin ? (
                <button className="restore-btn" onClick={() => handleRestore(bid.id)}>
                  Restore
                </button>
              ) : (
                <button className="remove-btn" onClick={() => handleRemove(bid.id)}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
