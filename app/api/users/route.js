import pool from '../../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // optional param

    if (id) {
      // fetch single user
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    } else {
      // fetch all users
      const [rows] = await pool.query(`
        SELECT 
          id, siteId, username, name, email, truckType, customTruckType,
          vehicleImage, idNumber, phone, iban, swiftCode, recipientName,
          drivingLicenseFront, drivingLicenseBack, idCardFront, idCardBack, created_at, isDeleted
        FROM users
      `);
      return NextResponse.json({ users: rows });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const {
      id,
      username,
      name,
      email,
      truckType,
      customTruckType,
      vehicleImage,
      idNumber,
      phone,
      iban,
      swiftCode,
      recipientName,
      drivingLicenseFront,
      drivingLicenseBack,
      idCardFront,
      idCardBack,
      password // new plain text password (if provided)
    } = data;

    if (!id) {
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
    }

    // Build the update query. We update all fields.
    let query = `UPDATE users SET
      username = ?,
      name = ?,
      email = ?,
      truckType = ?,
      customTruckType = ?,
      vehicleImage = ?,
      idNumber = ?,
      phone = ?,
      iban = ?,
      swiftCode = ?,
      recipientName = ?,
      drivingLicenseFront = ?,
      drivingLicenseBack = ?,
      idCardFront = ?,
      idCardBack = ?`;
    const params = [
      username,
      name,
      email,
      truckType,
      customTruckType,
      vehicleImage,
      idNumber,
      phone,
      iban,
      swiftCode,
      recipientName,
      drivingLicenseFront,
      drivingLicenseBack,
      idCardFront,
      idCardBack
    ];

    // If a new password is provided (nonempty), hash it before updating.
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }
    query += ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);

    // Return the updated record.
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found after update' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (!id) {
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
