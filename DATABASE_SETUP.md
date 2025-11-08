# Database Setup Guide

## Overview
This document provides instructions for setting up the MySQL database for the Cargo Management System.

## Database Information
- **Database Type**: MySQL
- **Schema File**: `database.sql`
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci

## Tables Included

1. **users** - User/Driver accounts and profiles
2. **loads** - Cargo loads available for bidding
3. **load_images** - Multiple images per load
4. **bids** - Driver bids on loads
5. **transactions** - User transaction records
6. **client_transactions** - Stripe payment transactions
7. **contacts** - Contact form submissions
8. **services** - Service information

## Setup Instructions

### Step 1: Create MySQL Database

```sql
CREATE DATABASE cargo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Import Schema

**Option A: Using MySQL Command Line**
```bash
mysql -u your_username -p cargo_db < database.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Select the `cargo_db` database
4. File → Open SQL Script → Select `database.sql`
5. Execute the script

**Option C: Using MySQL CLI**
```sql
USE cargo_db;
source /path/to/database.sql;
```

### Step 3: Configure Environment Variables

Update your `.env` file with the following variables:

```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=11932
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=cargo_db

# Other required environment variables (already in your project)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_CURRENCY=usd
NEXT_PUBLIC_STRIPE_SUCCESS_URL=http://localhost:10000/payment-success
NEXT_PUBLIC_STRIPE_CANCEL_URL=http://localhost:10000/payment-cancel
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_gmail_app_password
```

### Step 4: Verify Installation

Run a test query to verify all tables were created:

```sql
USE cargo_db;
SHOW TABLES;
```

You should see 8 tables:
- users
- loads
- load_images
- bids
- transactions
- client_transactions
- contacts
- services

## Table Relationships

```
users (1) ────< (many) bids
users (1) ────< (many) transactions
users (1) ────< (many) client_transactions
loads (1) ────< (many) bids
loads (1) ────< (many) load_images
loads (1) ────< (many) client_transactions
```

## Important Notes

1. **Foreign Keys**: All foreign key relationships are set up with CASCADE delete/update for data integrity.

2. **Indexes**: Important fields are indexed for better query performance:
   - Usernames, emails, siteIds
   - Foreign key columns
   - Status fields
   - Timestamps for sorting

3. **Data Types**:
   - `DECIMAL(10, 2)` for monetary amounts
   - `TEXT` for long text fields and URLs
   - `JSON` for notifications array in users table
   - `ENUM` for status fields
   - `TIMESTAMP` for date/time fields

4. **Soft Deletes**: 
   - `users.isDeleted` - Soft delete flag for users
   - `bids.isRemoved` - Soft delete flag for bids

5. **Notifications**: Stored as JSON array in the `users.notifications` column.

## Testing the Connection

You can test the database connection by running your Next.js application:

```bash
npm run dev
```

If the database connection is successful, the application should start without database-related errors.

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MySQL server is running
   - Verify host, port, and credentials in `.env`

2. **Table Doesn't Exist**
   - Make sure you've imported the schema
   - Verify you're using the correct database

3. **Foreign Key Constraint Errors**
   - Ensure tables are created in the correct order
   - Check that referenced tables exist before creating foreign keys

4. **Character Encoding Issues**
   - Ensure database and tables use utf8mb4 character set
   - Verify connection charset in your application

## Backup and Restore

### Create Backup
```bash
mysqldump -u your_username -p cargo_db > backup.sql
```

### Restore from Backup
```bash
mysql -u your_username -p cargo_db < backup.sql
```

## Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MySQL2 Node.js Driver](https://github.com/sidorares/node-mysql2)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

