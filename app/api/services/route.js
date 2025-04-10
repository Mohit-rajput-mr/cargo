import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

// GET: Retrieve all service records
export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT * FROM services');
    return NextResponse.json({ services: rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Insert a new service record
export async function POST(request) {
  try {
    const { description } = await request.json();
    const [result] = await pool.query('INSERT INTO services (description) VALUES (?)', [description]);
    return NextResponse.json({ id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing service record
export async function PUT(request) {
  try {
    const { id, description } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    await pool.query('UPDATE services SET description = ? WHERE id = ?', [description, id]);
    return NextResponse.json({ message: 'Service updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a service record by id (passed as a query parameter)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    await pool.query('DELETE FROM services WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
