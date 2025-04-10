import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM loads');
    return NextResponse.json({ loads: rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT => update an existing load
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, imageUrl, title, description, pickup, delivery, pay } = body;
    await pool.query(
      'UPDATE loads SET imageUrl = ?, title = ?, description = ?, pickup = ?, delivery = ?, pay = ? WHERE id = ?',
      [imageUrl, title, description, pickup, delivery, pay, id]
    );
    return NextResponse.json({ message: 'Load updated successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE => remove a load
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    await pool.query('DELETE FROM loads WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Load deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
