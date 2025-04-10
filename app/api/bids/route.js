import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

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
    return NextResponse.json({ bids: rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST => create a new bid
export async function POST(request) {
  const data = await request.json();
  const { loadId, bidAmount, userId } = data;
  try {
    // Insert a new bid setting isRemoved = 0 by default
    const [result] = await pool.query(
      'INSERT INTO bids (loadId, bidAmount, userId, status, isRemoved) VALUES (?, ?, ?, "pending", 0)',
      [loadId, bidAmount, userId]
    );
    return NextResponse.json({ id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT => update a bid (approve/reject/edit/remove/restore)
export async function PUT(request) {
  const data = await request.json();
  // Allowed fields: status, adminMessage, bidAmount, isRemoved (true/false)
  const { bidId, status, adminMessage, bidAmount, isRemoved } = data;

  try {
    let query = 'UPDATE bids SET ';
    const fields = [];
    const params = [];
    // Only update the fields provided

    if (status !== undefined) {
      fields.push(`status = ?`);
      params.push(status);
      // When status is updated we also update the status_updated_at timestamp
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
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    query += fields.join(', ');
    query += ' WHERE id = ?';
    params.push(bidId);

    await pool.query(query, params);
    return NextResponse.json({ message: 'Bid updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE => permanently delete a bid (if needed)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    await pool.query('DELETE FROM bids WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Bid deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
