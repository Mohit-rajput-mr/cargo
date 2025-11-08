// DATABASE DISABLED - Using hardcoded data instead
// import pool from '../../../lib/db';
import pusher from '../../../lib/pusher';

export async function GET(request) {
  // DATABASE DISABLED
  // const { searchParams } = new URL(request.url);
  // const userId = searchParams.get('userId');
  // if (!userId) {
  //   return new Response(JSON.stringify({ error: 'Missing userId' }), {
  //     status: 400,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }
  // try {
  //   const [rows] = await pool.query('SELECT notifications FROM users WHERE id = ?', [userId]);
  //   if (!rows.length) {
  //     return new Response(JSON.stringify({ error: 'User not found' }), {
  //       status: 404,
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //   }
  //   let notifications = [];
  //   if (rows[0].notifications) {
  //     try {
  //       notifications = JSON.parse(rows[0].notifications);
  //     } catch (e) {
  //       notifications = [];
  //     }
  //   }
  //   return new Response(JSON.stringify({ notifications }), {
  //     status: 200,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), {
  //     status: 500,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }
  return new Response(JSON.stringify({ notifications: [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request) {
  // DATABASE DISABLED
  // try {
  //   const data = await request.json();
  //   const { userId, message } = data;
  //   if (!userId || !message) {
  //     return new Response(JSON.stringify({ error: 'Missing parameters' }), {
  //       status: 400,
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //   }
  //   const newNotification = {
  //     id: Date.now(), // For production, consider using a UUID
  //     message,
  //     timestamp: new Date().toISOString()
  //   };

  //   const [rows] = await pool.query('SELECT notifications FROM users WHERE id = ?', [userId]);
  //   if (!rows.length) {
  //     return new Response(JSON.stringify({ error: 'User not found' }), {
  //       status: 404,
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //   }
  //   let notifications = [];
  //   if (rows[0].notifications) {
  //     try {
  //       notifications = JSON.parse(rows[0].notifications);
  //     } catch (e) {
  //       notifications = [];
  //     }
  //   }
  //   notifications.push(newNotification);
  //   await pool.query('UPDATE users SET notifications = ? WHERE id = ?', [JSON.stringify(notifications), userId]);

  //   pusher.trigger(`notifications-${userId}`, 'new-notification', newNotification);

  //   return new Response(JSON.stringify({ notification: newNotification }), {
  //     status: 200,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), {
  //     status: 500,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }
  return new Response(JSON.stringify({ error: 'Database disabled - POST not available' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function DELETE(request) {
  // DATABASE DISABLED
  // try {
  //   const { searchParams } = new URL(request.url);
  //   const userId = searchParams.get('userId');
  //   const notificationId = searchParams.get('notificationId');
  //   if (!userId || !notificationId) {
  //     return new Response(JSON.stringify({ error: 'Missing parameters' }), {
  //       status: 400,
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //   }
  //   const [rows] = await pool.query('SELECT notifications FROM users WHERE id = ?', [userId]);
  //   if (!rows.length) {
  //     return new Response(JSON.stringify({ error: 'User not found' }), {
  //       status: 404,
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //   }
  //   let notifications = [];
  //   if (rows[0].notifications) {
  //     try {
  //       notifications = JSON.parse(rows[0].notifications);
  //     } catch (e) {
  //       notifications = [];
  //     }
  //   }
  //   notifications = notifications.filter(n => n.id.toString() !== notificationId.toString());
  //   await pool.query('UPDATE users SET notifications = ? WHERE id = ?', [JSON.stringify(notifications), userId]);
  //   return new Response(JSON.stringify({ success: true }), {
  //     status: 200,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), {
  //     status: 500,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }
  return new Response(JSON.stringify({ error: 'Database disabled - DELETE not available' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}
