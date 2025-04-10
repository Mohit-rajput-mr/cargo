import pool from '../../../lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY created_at DESC LIMIT 1');
    return new Response(JSON.stringify(rows[0] || { description: '' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request) {
  try {
    const { description } = await request.json();
    const [result] = await pool.query('INSERT INTO services (description) VALUES (?)', [description]);
    const [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [result.insertId]);

    return new Response(JSON.stringify(rows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
