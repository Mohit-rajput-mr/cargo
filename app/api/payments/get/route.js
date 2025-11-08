// DATABASE DISABLED - Using hardcoded data instead
// import pool from '@/lib/db';

export async function GET(request) {
  // DATABASE DISABLED
  // try {
  //   const [rows] = await pool.query('SELECT * FROM client_transactions ORDER BY created_at DESC');
  //   return new Response(JSON.stringify({ transactions: rows }), { status: 200 });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  // }
  return new Response(JSON.stringify({ transactions: [] }), { status: 200 });
}
