import Stripe from 'stripe';
import mysql from 'mysql2/promise';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

// Create a new DB connection (in a real app, consider using a connection pool)
const db = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export async function POST(request) {
  try {
    const { loadId, driverId, clientEmail, amount } = await request.json();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: process.env.NEXT_PUBLIC_STRIPE_CURRENCY,
            product_data: { name: `Payment for Load ${loadId}` },
            unit_amount: Math.round(amount * 100), // convert to minor unit
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL,
      cancel_url: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL,
      metadata: { loadId, driverId, clientEmail },
    });

    // Insert the pending transaction record into DB
    await db.execute(
      `INSERT INTO client_transactions 
       (loadId, driverId, clientEmail, amount, stripePaymentId, paymentLink, status, adminStatus) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        loadId,
        driverId,
        clientEmail,
        amount,
        session.payment_intent || null,
        session.url || '',
        'pending',
        'pending',
      ]
    );

    return new Response(JSON.stringify({ paymentLink: session.url, sessionId: session.id }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
