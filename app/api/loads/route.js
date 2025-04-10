import pool from '../../../lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM loads');
    return new Response(JSON.stringify({ loads: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function POST(request) {
  const data = await request.json();
  const { imageUrl, title, description, pickup, delivery, pay } = data;
  try {
    const [result] = await pool.query(
      'INSERT INTO loads (imageUrl, title, description, pickup, delivery, pay) VALUES (?, ?, ?, ?, ?, ?)',
      [imageUrl, title, description, pickup, delivery, pay]
    );
    return new Response(JSON.stringify({ id: result.insertId }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, imageUrl, title, description, pickup, delivery, pay } = body;
    await pool.query(
      'UPDATE loads SET imageUrl = ?, title = ?, description = ?, pickup = ?, delivery = ?, pay = ? WHERE id = ?',
      [imageUrl, title, description, pickup, delivery, pay, id]
    );
    return new Response(JSON.stringify({ message: 'Load updated successfully' }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id' }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await pool.query('DELETE FROM loads WHERE id = ?', [id]);
    return new Response(JSON.stringify({ message: 'Load deleted successfully' }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
