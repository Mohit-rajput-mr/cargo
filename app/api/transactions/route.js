import pool from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const isAdmin = searchParams.get('isAdmin') === 'true';

  try {
    let query = 'SELECT * FROM transactions';
    const params = [];

    if (!isAdmin && userId) {
      query += ' WHERE userId = ?';
      params.push(userId);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return new Response(JSON.stringify({ transactions: rows }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, payDescription, paidAmount, documentUrl } = await request.json();

    const [result] = await pool.query(
      'INSERT INTO transactions (userId, payDescription, paidAmount, documentUrl) VALUES (?, ?, ?, ?)',
      [userId, payDescription, paidAmount, documentUrl]
    );

    return new Response(JSON.stringify({ id: result.insertId }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(request) {
  const { id, userId, payDescription, paidAmount, documentUrl } = await request.json();

  try {
    await pool.query(
      'UPDATE transactions SET userId = ?, payDescription = ?, paidAmount = ?, documentUrl = ? WHERE id = ?',
      [userId, payDescription, paidAmount, documentUrl, id]
    );
    return new Response(JSON.stringify({ message: 'Transaction updated' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
    return new Response(JSON.stringify({ message: 'Transaction deleted' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
