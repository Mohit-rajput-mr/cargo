'use client';
import { useState, useEffect } from 'react';
import './transactionhistory.css';

export default function TransactionHistory({ currentUser }) {
  const [transactions, setTransactions] = useState([]);

  const isAdmin = currentUser && currentUser.username === 'admin';

  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      return;
    }

    async function fetchUserTransactions() {
      let url = '/api/transactions';
      if (isAdmin) {
        url += '?isAdmin=true';
      } else {
        url += `?userId=${currentUser.id}&isAdmin=false`;
      }

      const res = await fetch(url);
      const data = await res.json();

      const sortedTransactions = (data.transactions || []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setTransactions(sortedTransactions);
    }

    fetchUserTransactions();
  }, [currentUser, isAdmin]);

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.map((tx) => (
            <li key={tx.id}>
              <p><strong>Pay Description:</strong> {tx.payDescription}</p>
              <p><strong>Paid Amount:</strong> {tx.paidAmount}</p>
              {tx.documentUrl && (
                <p>
                  <a href={tx.documentUrl} target="_blank" rel="noopener noreferrer">View Document</a>
                </p>
              )}
              <p><em>{new Date(tx.created_at).toLocaleString()}</em></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
