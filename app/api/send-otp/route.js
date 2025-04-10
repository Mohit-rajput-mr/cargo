import { Redis } from '@upstash/redis';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Generate a random 6-digit OTP string
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request) {
  try {
    // Expect JSON body with an "email" field
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Generate OTP
    const otp = generateOTP();

    // Store the OTP in Redis with a TTL of 300 seconds (5 minutes)
    await redis.set(`otp:${email}`, otp, { ex: 300 });

    // Configure Nodemailer transporter using Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Define mail options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    // Attempt to send the OTP email
    await transporter.sendMail(mailOptions);

    // Do not return the OTP to the client in production!
    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error("Error in /api/send-otp/route.js POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
