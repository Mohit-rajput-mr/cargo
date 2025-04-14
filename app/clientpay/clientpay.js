'use client';
import { useState, useEffect } from 'react';
import styles from './clientpay.css';

export default function ClientPay() {
  const [loadId, setLoadId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [transactions, setTransactions] = useState([]);

  const handleGeneratePayment = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loadId, driverId, clientEmail, amount }),
    });
    const data = await res.json();
    if (data.paymentLink) {
      setPaymentLink(data.paymentLink);
      alert('Payment link generated successfully!');
      fetchTransactions();
    } else {
      alert('Error generating payment link: ' + data.error);
    }
  };

  const fetchTransactions = async () => {
    const res = await fetch('/api/payments/get');
    const data = await res.json();
    setTransactions(data.transactions || []);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Client-to-Admin Payment Setup</h2>
      <form onSubmit={handleGeneratePayment} className={styles.form}>
        <label>
          Load ID:
          <input
            type="text"
            value={loadId}
            onChange={(e) => setLoadId(e.target.value)}
            required
          />
        </label>
        <label>
          Driver ID:
          <input
            type="text"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            required
          />
        </label>
        <label>
          Client Email:
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <button type="submit">Generate Payment Link</button>
      </form>
      {paymentLink && (
        <div className={styles.paymentLink}>
          <p>
            <strong>Payment Link:</strong>
          </p>
          <a href={paymentLink} target="_blank" rel="noopener noreferrer">
            {paymentLink}
          </a>
        </div>
      )}
      <div className={styles.transactions}>
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul>
            {transactions.map((tx) => (
              <li key={tx.id}>
                <p>
                  <strong>Load ID:</strong> {tx.loadId} | <strong>Amount:</strong> {tx.amount} |{' '}
                  <strong>Client:</strong> {tx.clientEmail}
                </p>
                <p>
                  <strong>Status:</strong> {tx.status} | <strong>Admin Status:</strong> {tx.adminStatus}
                </p>
                <p>
                  <strong>Stripe Payment ID:</strong> {tx.stripePaymentId || 'N/A'}
                </p>
                <p>
                  <strong>Payment Link:</strong>{' '}
                  <a href={tx.paymentLink} target="_blank" rel="noopener noreferrer">
                    View Link
                  </a>
                </p>
                <p>
                  <strong>Created at:</strong>{' '}
                  {new Date(tx.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
