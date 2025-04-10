import pool from '../../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params: { id } }) {
  try {
    const [rows] = await pool.query('SELECT * FROM load_images WHERE load_id=?', [id]);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Load images error:", err);
    return NextResponse.json({ error: 'Error fetching load images' }, { status: 500 });
  }
}
