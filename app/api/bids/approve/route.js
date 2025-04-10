import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { getIO } from '../../../../server';

export async function POST(req) {
  const { bidId, message, userId } = await req.json();
  try {
    await pool.query(
      'UPDATE bids SET status = ?, adminMessage = ?, status_updated_at = NOW() WHERE id = ?',
      ['approved', message, bidId]
    );
    const io = getIO();
    io.to(`user_${userId}`).emit('bidNotification', {
      message: `Your bid (ID: ${bidId}) was approved! Message: ${message}`,
      status: 'approved'
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Error approving bid' }, { status: 500 });
  }
}
