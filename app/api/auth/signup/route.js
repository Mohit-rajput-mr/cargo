import pool from '../../../../lib/db';
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
    return new Response(
      JSON.stringify({ error: 'Username admin is reserved.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (password !== confirmPassword) {
    return new Response(
      JSON.stringify({ error: 'Passwords do not match.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Username is already in use' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
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
    return new Response(
      JSON.stringify({ id: result.insertId, siteId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
