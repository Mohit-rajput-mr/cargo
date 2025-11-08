// DATABASE DISABLED - Payment functionality disabled
// Stripe payments disabled for now since database is not available

export async function POST(request) {
  // DATABASE DISABLED - Payment creation not available without database
  return new Response(
    JSON.stringify({ 
      error: 'Payment functionality is temporarily disabled. Database is not available.' 
    }), 
    { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    }
  );
  
  // ORIGINAL CODE - DISABLED
  // import Stripe from 'stripe';
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
  // try {
  //   const { loadId, driverId, clientEmail, amount } = await request.json();
  //   const session = await stripe.checkout.sessions.create({...});
  //   await pool.query(...);
  //   return new Response(JSON.stringify({ paymentLink: session.url, sessionId: session.id }), {
  //     status: 200,
  //   });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  // }
}
