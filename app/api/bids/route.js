// DATABASE DISABLED - Using hardcoded data instead
// import pool from '@/lib/db';
import pusher from '@/lib/pusher';

// GET => returns all bids
export async function GET() {
  // DATABASE DISABLED
  // try {
  //   const query = `
  //     SELECT 
  //       b.id, 
  //       b.loadId, 
  //       b.bidAmount, 
  //       b.userId, 
  //       b.status, 
  //       b.adminMessage, 
  //       b.created_at,
  //       b.status_updated_at,
  //       b.isRemoved,
  //       b.removed_at,
  //       u.name AS userName, 
  //       u.email AS userEmail, 
  //       u.truckType AS userTruckType
  //     FROM bids b
  //     LEFT JOIN users u ON b.userId = u.id
  //   `;
  //   const [rows] = await pool.query(query);
  //   return new Response(JSON.stringify({ bids: rows }), { status: 200 });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  // }
  return new Response(JSON.stringify({ bids: [] }), { status: 200 });
}

// POST => create a new bid and broadcast using Pusher
export async function POST(request) {
  // DATABASE DISABLED
  // try {
  //   const { loadId, bidAmount, userId } = await request.json();

  //   // 1. Insert the bid
  //   const [result] = await pool.query(
  //     'INSERT INTO bids (loadId, bidAmount, userId, status, isRemoved) VALUES (?, ?, ?, "pending", 0)',
  //     [loadId, bidAmount, userId]
  //   );

  //   const newBidId = result.insertId;

  //   // 2. Fetch user info
  //   const [[user]] = await pool.query(
  //     'SELECT name FROM users WHERE id = ?',
  //     [userId]
  //   );

  //   const userName = user?.name || `User ${userId}`;

  //   // 3. Create final bid payload
  //   const newBid = {
  //     id: newBidId,
  //     loadId,
  //     bidAmount,
  //     userId,
  //     userName,
  //     status: 'pending',
  //   };

  //   // 4. Broadcast via Pusher
  //   await pusher.trigger('global-bids', 'new-bid', newBid);
  //   // Also broadcast on per load channel if needed for user view:
  //   await pusher.trigger(`load_${loadId}`, 'new-bid', newBid);

  //   return new Response(JSON.stringify({ id: newBidId }), { status: 200 });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  // }
  return new Response(JSON.stringify({ error: 'Database disabled - POST not available' }), { status: 503 });
}

// PUT => update bid
export async function PUT(request) {
  // DATABASE DISABLED
  // const data = await request.json();
  // const { bidId, status, adminMessage, bidAmount, isRemoved } = data;

  // try {
  //   let query = 'UPDATE bids SET ';
  //   const fields = [];
  //   const params = [];

  //   if (status !== undefined) {
  //     fields.push(`status = ?`);
  //     params.push(status);
  //     fields.push(`status_updated_at = NOW()`);
  //   }
  //   if (adminMessage !== undefined) {
  //     fields.push(`adminMessage = ?`);
  //     params.push(adminMessage);
  //   }
  //   if (bidAmount !== undefined) {
  //     fields.push(`bidAmount = ?`);
  //     params.push(bidAmount);
  //   }
  //   if (isRemoved !== undefined) {
  //     fields.push(`isRemoved = ?`);
  //     params.push(isRemoved ? 1 : 0);
  //     fields.push(`removed_at = ${isRemoved ? 'NOW()' : 'NULL'}`);
  //   }

  //   if (fields.length === 0) {
  //     return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 400 });
  //   }

  //   query += fields.join(', ');
  //   query += ' WHERE id = ?';
  //   params.push(bidId);

  //   await pool.query(query, params);
  //   return new Response(JSON.stringify({ message: 'Bid updated successfully' }), { status: 200 });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  // }
  return new Response(JSON.stringify({ error: 'Database disabled - PUT not available' }), { status: 503 });
}

// DELETE => remove bid
export async function DELETE(request) {
  // DATABASE DISABLED
  // const { searchParams } = new URL(request.url);
  // const id = searchParams.get('id');

  // try {
  //   await pool.query('DELETE FROM bids WHERE id = ?', [id]);
  //   return new Response(JSON.stringify({ message: 'Bid deleted successfully' }), { status: 200 });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  // }
  return new Response(JSON.stringify({ error: 'Database disabled - DELETE not available' }), { status: 503 });
}
