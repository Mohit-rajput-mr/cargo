// DATABASE DISABLED - Stripe webhook disabled
// Payment webhooks disabled for now since database is not available

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  // DATABASE DISABLED - Webhook processing not available without database
  return new Response(
    JSON.stringify({ 
      received: true,
      message: 'Webhook received but not processed. Database is not available.' 
    }), 
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
  
  // ORIGINAL CODE - DISABLED
  // import { buffer } from 'micro';
  // import Stripe from 'stripe';
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
  // try {
  //   const reqBuffer = await buffer(request.body);
  //   const sig = request.headers.get("stripe-signature");
  //   const event = stripe.webhooks.constructEvent(...);
  //   if (event.type === 'checkout.session.completed') {
  //     await pool.query(...);
  //   }
  //   return new Response(JSON.stringify({ received: true }), { status: 200 });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  // }
}
