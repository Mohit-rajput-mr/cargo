// Test database connection script
// Run with: node test-db-connection.js
// Note: This script reads from .env.local manually since Next.js env loading doesn't work in standalone scripts

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Simple .env.local parser
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
  
  return envVars;
}

const env = loadEnvFile();
// Set environment variables
Object.keys(env).forEach(key => {
  process.env[key] = env[key];
});

async function testConnection() {
  console.log('Testing database connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${process.env.MYSQL_HOST || 'not set'}`);
  console.log(`  Port: ${process.env.MYSQL_PORT || '3306 (default)'}`);
  console.log(`  User: ${process.env.MYSQL_USER || 'not set'}`);
  console.log(`  Database: ${process.env.MYSQL_DATABASE || 'not set'}`);
  console.log(`  Password: ${process.env.MYSQL_PASSWORD ? '***' : 'not set'}\n`);

  if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_DATABASE) {
    console.error('❌ Error: Missing required environment variables!');
    console.error('Please check your .env.local file.');
    process.exit(1);
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      connectTimeout: 10000,
    });

    console.log('✅ Successfully connected to database!');
    
    // Test a simple query
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('✅ Database query test successful!');
    console.log('✅ Connection is working properly.\n');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('\nError details:');
    console.error(`  Code: ${error.code}`);
    console.error(`  Message: ${error.message}`);
    console.error(`  Errno: ${error.errno}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Possible issues:');
      console.error('  1. MySQL server is not running');
      console.error('  2. Wrong host or port number');
      console.error('  3. Firewall is blocking the connection');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Possible issues:');
      console.error('  1. Wrong username or password');
      console.error('  2. User does not have permission to access the database');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Possible issues:');
      console.error('  1. Database does not exist');
      console.error('  2. Wrong database name');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n💡 Possible issues:');
      console.error('  1. Connection timeout - server is not responding');
      console.error('  2. Wrong host or port');
      console.error('  3. Network connectivity issues');
    }
    
    process.exit(1);
  }
}

testConnection();

