import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request) {
  const data = await request.json();
  const {
    username,
    password,
    confirmPassword,
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
  } = data;

  // Prevent use of reserved admin username
  if (username === 'admin') {
    return NextResponse.json({ error: 'Username admin is reserved.' }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Username is already in use' }, { status: 400 });
    }
    // Count current users to assign siteId
    const [usersCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    const count = usersCount[0].count;
    const siteId = 'T' + (count + 1);
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (siteId, username, password, name, email, truckType, customTruckType, vehicleImage, idNumber, phone, iban, swiftCode, recipientName, drivingLicenseFront, drivingLicenseBack, idCardFront, idCardBack) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [siteId, username, hashedPassword, name, email, truckType, customTruckType, vehicleImage, idNumber, phone, iban, swiftCode, recipientName, drivingLicenseFront, drivingLicenseBack, idCardFront, idCardBack]
    );
    return NextResponse.json({ id: result.insertId, siteId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
