import mysql from 'mysql2/promise';

export async function GET(request) {
  const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  const [rows] = await db.execute('SELECT * FROM client_transactions ORDER BY created_at DESC');
  return new Response(JSON.stringify({ transactions: rows }), { status: 200 });
}
