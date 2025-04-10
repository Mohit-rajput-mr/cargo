import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request) {
  const data = await request.json();
  const { username, password } = data;
  
  // Admin login shortcut
  if (username === 'admin' && password === 'a123') {
    return NextResponse.json({ message: 'Admin login successful', user: { username: 'admin', siteId: 'ADMIN' } });
  }
  
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 400 });
    }
    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Login successful', user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
