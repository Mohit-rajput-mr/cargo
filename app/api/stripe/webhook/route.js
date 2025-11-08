import { buffer } from 'micro';
import Stripe from 'stripe';
// DATABASE DISABLED - Using hardcoded data instead
// import pool from '@/lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export async function POST(request) {
  try {
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
      // DATABASE DISABLED - Transaction update not saved
      // const session = event.data.object;
      // const loadId = session.metadata?.loadId;
      // const driverId = session.metadata?.driverId;
      // const clientEmail = session.metadata?.clientEmail;
      // const amount = session.amount_total / 100; // convert back to main unit

      // Update the transaction record: set status to 'paid' and add stripePaymentId
      // await pool.query(
      //   `UPDATE client_transactions 
      //    SET status = ?, stripePaymentId = ? 
      //    WHERE loadId = ? AND driverId = ? AND clientEmail = ? AND status = 'pending'`,
      //   ['paid', session.payment_intent, loadId, driverId, clientEmail]
      // );
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
