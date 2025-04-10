import pool from '../../../lib/db';

// GET => returns all bids, joined with user data (name, email, truckType, etc.)
export async function GET() {
  try {
    const query = `
      SELECT 
        b.id, 
        b.loadId, 
        b.bidAmount, 
        b.userId, 
        b.status, 
        b.adminMessage, 
        b.created_at,
        b.status_updated_at,
        b.isRemoved,
        b.removed_at,
        u.name AS userName, 
        u.email AS userEmail, 
        u.truckType AS userTruckType
      FROM bids b
      LEFT JOIN users u ON b.userId = u.id
    `;
    const [rows] = await pool.query(query);
    return new Response(JSON.stringify({ bids: rows }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST => create a new bid
export async function POST(request) {
  const data = await request.json();
  const { loadId, bidAmount, userId } = data;
  try {
    const [result] = await pool.query(
      'INSERT INTO bids (loadId, bidAmount, userId, status, isRemoved) VALUES (?, ?, ?, "pending", 0)',
      [loadId, bidAmount, userId]
    );
    return new Response(JSON.stringify({ id: result.insertId }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PUT => update a bid (approve/reject/edit/remove/restore)
export async function PUT(request) {
  const data = await request.json();
  const { bidId, status, adminMessage, bidAmount, isRemoved } = data;

  try {
    let query = 'UPDATE bids SET ';
    const fields = [];
    const params = [];

    if (status !== undefined) {
      fields.push(`status = ?`);
      params.push(status);
      fields.push(`status_updated_at = NOW()`);
    }
    if (adminMessage !== undefined) {
      fields.push(`adminMessage = ?`);
      params.push(adminMessage);
    }
    if (bidAmount !== undefined) {
      fields.push(`bidAmount = ?`);
      params.push(bidAmount);
    }
    if (isRemoved !== undefined) {
      fields.push(`isRemoved = ?`);
      params.push(isRemoved ? 1 : 0);
      if (isRemoved) {
        fields.push(`removed_at = NOW()`);
      } else {
        fields.push(`removed_at = NULL`);
      }
    }

    if (fields.length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 400 });
    }

    query += fields.join(', ');
    query += ' WHERE id = ?';
    params.push(bidId);

    await pool.query(query, params);
    return new Response(JSON.stringify({ message: 'Bid updated successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// DELETE => permanently delete a bid (if needed)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    await pool.query('DELETE FROM bids WHERE id = ?', [id]);
    return new Response(JSON.stringify({ message: 'Bid deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
