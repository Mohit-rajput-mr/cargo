import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

// GET: Retrieve all contact records
export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts');
    return NextResponse.json({ contacts: rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Insert a new contact record
export async function POST(request) {
  try {
    const { description } = await request.json();
    const [result] = await pool.query('INSERT INTO contacts (description) VALUES (?)', [description]);
    return NextResponse.json({ id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing contact record
export async function PUT(request) {
  try {
    const { id, description } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    await pool.query('UPDATE contacts SET description = ? WHERE id = ?', [description, id]);
    return NextResponse.json({ message: 'Contact updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a contact record by id (passed as a query parameter)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
