import pool from '../../../../lib/db';

export async function POST(req) {
  const { bidId, message } = await req.json();
  try {
    await pool.query(
      'UPDATE bids SET status = ?, adminMessage = ?, status_updated_at = NOW() WHERE id = ?',
      ['approved', message, bidId]
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error approving bid' }), { status: 500 });
  }
}
