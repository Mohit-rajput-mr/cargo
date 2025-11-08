# Troubleshooting Guide

## Database Connection Issues (500 Errors)

If you're seeing **500 Internal Server Error** on all API routes, it's likely a database connection issue.

### Symptoms:
- All API routes return `500` status code
- Response times are very long (10+ seconds)
- Errors like: `GET /api/loads 500`, `GET /api/users 500`, etc.

### Causes & Solutions:

#### 1. Database Server Not Running
**Check if MySQL is running:**
```bash
# Windows (check services)
services.msc
# Look for MySQL service

# Or check if port is listening
netstat -ano | findstr :11932
```

**Solution:** Start your MySQL server

#### 2. Wrong Port Number
**Check your `.env.local` file:**
```env
MYSQL_PORT=11932
```

**Verify MySQL is listening on port 11932:**
- Check MySQL configuration file (`my.cnf` or `my.ini`)
- Look for `port = 11932`
- If using a cloud database, verify the port in your hosting dashboard

**Solution:** 
- Update `.env.local` with correct port
- Restart your dev server: `npm run dev`

#### 3. Incorrect Credentials
**Check your `.env.local` file:**
```env
MYSQL_HOST=localhost
MYSQL_PORT=11932
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=cargo_db
```

**Solution:**
- Verify all credentials are correct
- Test connection using: `node test-db-connection.js`
- Make sure database `cargo_db` exists

#### 4. Database Doesn't Exist
**Check if database exists:**
```sql
SHOW DATABASES LIKE 'cargo_db';
```

**Solution:**
- Create the database: `CREATE DATABASE cargo_db;`
- Import the schema: `mysql -u username -p cargo_db < database.sql`

#### 5. Firewall Blocking Connection
**Check if firewall is blocking port 11932:**
- Windows Firewall
- Cloud hosting firewall rules
- Network firewall

**Solution:**
- Allow port 11932 in firewall settings
- If using cloud database, whitelist your IP address

#### 6. Environment Variables Not Loading
**Check if `.env.local` is in project root:**
```
cargo/
  ├── .env.local  ← Should be here
  ├── package.json
  ├── lib/
  └── app/
```

**Solution:**
- Ensure `.env.local` exists in project root
- Restart dev server after changing `.env.local`
- Check for typos in variable names

### Test Database Connection

Run the test script:
```bash
node test-db-connection.js
```

This will:
- ✅ Verify all environment variables are set
- ✅ Test database connection
- ✅ Show detailed error messages if connection fails

---

## Image Upload Issues

### Symptoms:
- Images not uploading
- Cloudinary errors
- 500 errors on `/api/upload`

### Causes & Solutions:

#### 1. Cloudinary Not Configured
**Check your `.env.local` file:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Solution:**
- Get credentials from Cloudinary dashboard
- Add to `.env.local`
- Restart dev server

#### 2. Upload Preset Not Found
**Check Cloudinary upload preset:**
- Go to Cloudinary Dashboard → Settings → Upload
- Verify preset "cargoo" exists
- Check if preset allows unsigned uploads

**Solution:**
- Create upload preset "cargoo" in Cloudinary
- Set it to "Unsigned" if using from client-side

#### 3. File Size Limits
**Check file size:**
- Cloudinary has size limits
- Next.js has body size limits

**Solution:**
- Compress images before upload
- Check Cloudinary account limits

#### 4. CORS Issues
**If uploading from browser:**
- Check browser console for CORS errors
- Verify Cloudinary CORS settings

**Solution:**
- Configure CORS in Cloudinary dashboard
- Use server-side upload route if needed

---

## Quick Fix Checklist

1. ✅ Verify MySQL is running on port 11932
2. ✅ Check `.env.local` has correct credentials
3. ✅ Test database connection: `node test-db-connection.js`
4. ✅ Restart dev server: `npm run dev`
5. ✅ Check server logs for detailed error messages
6. ✅ Verify database `cargo_db` exists
7. ✅ Check firewall settings
8. ✅ Verify Cloudinary credentials (for image uploads)

---

## Getting More Help

If issues persist:

1. **Check server logs:** Look at your terminal/console for detailed error messages
2. **Test database connection:** Run `node test-db-connection.js`
3. **Check MySQL logs:** Look at MySQL error logs
4. **Verify network:** Test if you can connect to MySQL from another tool (MySQL Workbench, DBeaver)

---

## Common Error Messages

### `ECONNREFUSED`
- MySQL server is not running
- Wrong host or port
- Firewall blocking connection

### `ER_ACCESS_DENIED_ERROR`
- Wrong username or password
- User doesn't have permissions

### `ER_BAD_DB_ERROR`
- Database doesn't exist
- Wrong database name

### `ETIMEDOUT`
- Connection timeout
- Server not responding
- Network issues

### `ENOTFOUND`
- Hostname cannot be resolved
- Wrong MYSQL_HOST value

