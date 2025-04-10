import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

// GET => role-based fetch
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    const username = searchParams.get('username'); // e.g. "admin" or "mohit"
    const isAdmin = searchParams.get('isAdmin') === 'true'; // from the client

    let query = 'SELECT * FROM transactions';
    const params = [];

    // If the user is not admin, show only their transactions
    if (!isAdmin && userIdParam) {
      query += ' WHERE userId = ?';
      params.push(userIdParam);
    }
    const [rows] = await pool.query(query, params);
    return NextResponse.json({ transactions: rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST => admin can create transactions for any user
export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, payDescription, paidAmount, documentUrl } = data;
    const [result] = await pool.query(
      'INSERT INTO transactions (userId, payDescription, paidAmount, documentUrl) VALUES (?, ?, ?, ?)',
      [userId, payDescription, paidAmount, documentUrl]
    );
    return NextResponse.json({ id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT => update an existing transaction
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, userId, payDescription, paidAmount, documentUrl } = data;
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    await pool.query(
      'UPDATE transactions SET userId = ?, payDescription = ?, paidAmount = ?, documentUrl = ? WHERE id = ?',
      [userId, payDescription, paidAmount, documentUrl, id]
    );
    return NextResponse.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE => remove a transaction record by id (passed as a query parameter)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
