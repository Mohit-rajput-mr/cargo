import pool from '../../../../lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
  const data = await request.json();
  const { username, password } = data;
  
  // Admin login shortcut
  if (username === 'admin' && password === 'a123') {
    return new Response(
      JSON.stringify({ message: 'Admin login successful', user: { username: 'admin', siteId: 'ADMIN' } }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid username or password' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid username or password' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ message: 'Login successful', user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
