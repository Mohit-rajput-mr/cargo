import pool from '../../../../../lib/db';

export async function GET(request, { params: { id } }) {
  try {
    const [rows] = await pool.query('SELECT * FROM load_images WHERE load_id=?', [id]);
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("Load images error:", err);
    return new Response(JSON.stringify({ error: 'Error fetching load images' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
