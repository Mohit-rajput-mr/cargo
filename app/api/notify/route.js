// app/api/notify/route.js
import pool from '../../../lib/db';
import pusher from '../../../lib/pusher';
import { NextResponse } from 'next/server';

// GET notifications for a given user
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  try {
    const [rows] = await pool.query('SELECT notifications FROM users WHERE id = ?', [userId]);
    if (!rows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    let notifications = [];
    if (rows[0].notifications) {
      try {
        notifications = JSON.parse(rows[0].notifications);
      } catch (e) {
        notifications = [];
      }
    }
    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new notification for a user
export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, message } = data;
    if (!userId || !message) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    // Create a new notification object; we use the current timestamp as the id.
    const newNotification = {
      id: Date.now(), // You might use a UUID in production
      message,
      timestamp: new Date().toISOString(),
    };

    // Retrieve the current notifications for the user
    const [rows] = await pool.query('SELECT notifications FROM users WHERE id = ?', [userId]);
    if (!rows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    let notifications = [];
    if (rows[0].notifications) {
      try {
        notifications = JSON.parse(rows[0].notifications);
      } catch (e) {
        notifications = [];
      }
    }
    // Append the new notification
    notifications.push(newNotification);
    await pool.query('UPDATE users SET notifications = ? WHERE id = ?', [JSON.stringify(notifications), userId]);

    // Trigger Pusher event on a channel specific to the user
    pusher.trigger(`notifications-${userId}`, 'new-notification', newNotification);

    return NextResponse.json({ notification: newNotification });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a notification (when user clicks close)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const notificationId = searchParams.get('notificationId');
    if (!userId || !notificationId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    // Retrieve current notifications
    const [rows] = await pool.query('SELECT notifications FROM users WHERE id = ?', [userId]);
    if (!rows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    let notifications = [];
    if (rows[0].notifications) {
      try {
        notifications = JSON.parse(rows[0].notifications);
      } catch (e) {
        notifications = [];
      }
    }
    // Filter out the notification to delete
    notifications = notifications.filter(n => n.id.toString() !== notificationId.toString());
    await pool.query('UPDATE users SET notifications = ? WHERE id = ?', [JSON.stringify(notifications), userId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
