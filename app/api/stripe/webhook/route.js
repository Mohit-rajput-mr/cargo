import { buffer } from 'micro';
import Stripe from 'stripe';
import mysql from 'mysql2/promise';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

// Create a DB connection (consider using a pool for production)
const db = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export async function POST(request) {
  const reqBuffer = await buffer(request.body);
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const loadId = session.metadata?.loadId;
    const driverId = session.metadata?.driverId;
    const clientEmail = session.metadata?.clientEmail;
    const amount = session.amount_total / 100; // convert back to main unit

    // Update the transaction record: set status to 'paid' and add stripePaymentId
    await db.execute(
      `UPDATE client_transactions 
       SET status = ?, stripePaymentId = ? 
       WHERE loadId = ? AND driverId = ? AND clientEmail = ? AND status = 'pending'`,
      ['paid', session.payment_intent, loadId, driverId, clientEmail]
    );
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
