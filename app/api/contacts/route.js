// DATABASE DISABLED - Using hardcoded data instead
// import pool from '../../../lib/db';

export async function GET(request) {
  // DATABASE DISABLED
  // try {
  //   const [rows] = await pool.query('SELECT * FROM contacts');
  //   return new Response(JSON.stringify({ contacts: rows }), {
  //     status: 200,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), {
  //     status: 500,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }
  return new Response(JSON.stringify({ contacts: [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request) {
  // DATABASE DISABLED
  // try {
  //   const { description } = await request.json();
  //   const [result] = await pool.query('INSERT INTO contacts (description) VALUES (?)', [description]);
  //   return new Response(JSON.stringify({ id: result.insertId }), {
  //     status: 200,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), {
  //     status: 500,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }
  return new Response(JSON.stringify({ error: 'Database disabled - POST not available' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function PUT(request) {
  // DATABASE DISABLED
  // try {
  //   const { id, description } = await request.json();
  //   if (!id) {
  //     return new Response(JSON.stringify({ error: 'Missing id' }), {
  //       status: 400,
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //   }
  //   await pool.query('UPDATE contacts SET description = ? WHERE id = ?', [description, id]);
  //   return new Response(JSON.stringify({ message: 'Contact updated successfully' }), {
  //     status: 200,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), {
  //     status: 500,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }
  return new Response(JSON.stringify({ error: 'Database disabled - PUT not available' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function DELETE(request) {
  // DATABASE DISABLED
  // try {
  //   const { searchParams } = new URL(request.url);
  //   const id = searchParams.get('id');
  //   if (!id) {
  //     return new Response(JSON.stringify({ error: 'Missing id' }), {
  //       status: 400,
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //   }
  //   await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
  //   return new Response(JSON.stringify({ message: 'Contact deleted successfully' }), {
  //     status: 200,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), {
  //     status: 500,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }
  return new Response(JSON.stringify({ error: 'Database disabled - DELETE not available' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}
