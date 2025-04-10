import { createPool } from '@vercel/postgres';
import { NextResponse } from 'next/server';

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET() {
  try {
    const { rows } = await pool.sql`SELECT * FROM services ORDER BY updated_at DESC LIMIT 1`;
    return NextResponse.json(rows[0] || { description: '' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { description } = await request.json();
    
    // Update or insert
    const { rows } = await pool.sql`
      INSERT INTO services (description)
      VALUES (${description})
      ON CONFLICT (id) DO UPDATE
      SET description = EXCLUDED.description
      RETURNING *
    `;
    
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}