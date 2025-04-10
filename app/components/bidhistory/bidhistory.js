'use client';
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import './bidhistory.css';

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
          const userBids = data.bids.filter(bid => bid.userId === currentUser.id);
          setAllBids(userBids);
        }
      } catch (error) {
        console.error('Failed to fetch bids:', error);
      }
    }

    if (currentUser) {
      fetchBids();

      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      });

      const channel = pusher.subscribe(`load_${currentUser.id}`);
      channel.bind('new-bid', (data) => {
        if (data.userId === currentUser.id) {
          setAllBids(prev => {
            if (prev.some(b => b.id === data.id)) return prev;
            return [data, ...prev];
          });
        }
      });

      return () => {
        pusher.unsubscribe(`load_${currentUser.id}`);
      };
    }
  }, [currentUser]);

  const activeBids = allBids.filter(bid => Number(bid.isRemoved) === 0);
  const removedBids = allBids.filter(bid => Number(bid.isRemoved) === 1);

  // Sort by the most recent timestamp from either created_at or status_updated_at
  const sortByLatest = (a, b) => {
    const aTime = new Date(a.status_updated_at || a.created_at);
    const bTime = new Date(b.status_updated_at || b.created_at);
    return bTime - aTime;
  };

  const sortedActiveBids = activeBids.sort(sortByLatest);
  const sortedRemovedBids = removedBids.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleRemove = async (bidId) => {
    try {
      const res = await fetch('/api/bids', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId, isRemoved: true })
      });
      if (!res.ok) throw new Error('Failed to remove bid');
      setAllBids(prev => prev.map(bid => bid.id === bidId ? { ...bid, isRemoved: 1, removed_at: new Date() } : bid));
    } catch (error) {
      console.error('Error removing bid:', error);
    }
  };

  const handleRestore = async (bidId) => {
    try {
      const res = await fetch('/api/bids', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId, isRemoved: false })
      });
      if (!res.ok) throw new Error('Failed to restore bid');
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
                <p><strong>Message from Admin:</strong> {bid.adminMessage}</p>
              )}
              <p><strong>Placed:</strong> {getRelativeTime(bid.created_at)}</p>
              {viewBin ? (
                <button className="restore-btn" onClick={() => handleRestore(bid.id)}>Restore</button>
              ) : (
                <button className="remove-btn" onClick={() => handleRemove(bid.id)}>Remove</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
