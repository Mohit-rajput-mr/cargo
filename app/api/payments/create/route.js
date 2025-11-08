import Stripe from 'stripe';
// DATABASE DISABLED - Using hardcoded data instead
// import pool from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

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

    // DATABASE DISABLED - Transaction record not saved
    // Insert the pending transaction record into DB using connection pool
    // await pool.query(
    //   `INSERT INTO client_transactions 
    //    (loadId, driverId, clientEmail, amount, stripePaymentId, paymentLink, status, adminStatus) 
    //    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    //   [
    //     loadId,
    //     driverId,
    //     clientEmail,
    //     amount,
    //     session.payment_intent || null,
    //     session.url || '',
    //     'pending',
    //     'pending',
    //   ]
    // );

    return new Response(JSON.stringify({ paymentLink: session.url, sessionId: session.id }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
