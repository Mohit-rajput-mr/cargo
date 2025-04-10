import pool from '../../../lib/db';
import bcrypt from 'bcrypt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify(rows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const [rows] = await pool.query(`
        SELECT 
          id, siteId, username, name, email, truckType, customTruckType,
          vehicleImage, idNumber, phone, iban, swiftCode, recipientName,
          drivingLicenseFront, drivingLicenseBack, idCardFront, idCardBack, created_at, isDeleted
        FROM users
      `);
      return new Response(JSON.stringify({ users: rows }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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
      password
    } = data;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing user id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }
    query += ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found after update' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing user id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
