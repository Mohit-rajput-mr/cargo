# Project Credentials

## Admin Credentials

**⚠️ IMPORTANT: These are hardcoded in the application code and NOT stored in the database.**

- **Username:** `admin`
- **Password:** `a123`
- **SiteId:** `ADMIN`

### Location in Code:
- `app/api/auth/login/route.js` (line 9)
- `app/api/admin/route.js` (line 9)

### Security Note:
🔒 **For production, you should change these credentials or move them to environment variables!**

---

## Sample Test Users (Database)

These users are optional and can be added to the database for testing. Uncomment the sample data section in `database.sql` to use them.

### Sample User 1 - Driver
- **SiteId:** `T1`
- **Username:** `driver1`
- **Password:** `driver123`
- **Name:** `John Driver`
- **Email:** `driver1@test.com`
- **Phone:** `+1234567890`

### Sample User 2 - Driver
- **SiteId:** `T2`
- **Username:** `driver2`
- **Password:** `user123`
- **Name:** `Jane Driver`
- **Email:** `driver2@test.com`
- **Phone:** `+1234567891`

---

## How to Add Sample Users

1. **Option 1: Uncomment in database.sql**
   - Open `database.sql`
   - Find the "OPTIONAL: SAMPLE DATA" section
   - Uncomment the INSERT statements
   - Run the SQL file again

2. **Option 2: Use the Signup API**
   - Use the signup form in the application
   - Create users through the UI

3. **Option 3: Manual SQL Insert**
   ```sql
   INSERT INTO `users` (`siteId`, `username`, `password`, `name`, `email`, `phone`, `truckType`) 
   VALUES ('T1', 'driver1', '$2b$10$LwCg5q6Bu.rGuayTRDcA/ubs0bxYfSnZxuFgiFbP2eVhFR.UXTus6', 'John Driver', 'driver1@test.com', '+1234567890', 'Flatbed');
   ```

---

## Password Hashes

All passwords are hashed using **bcrypt** with 10 salt rounds.

- `driver123` → `$2b$10$LwCg5q6Bu.rGuayTRDcA/ubs0bxYfSnZxuFgiFbP2eVhFR.UXTus6`
- `user123` → `$2b$10$g/zdxg5xfIPqWcBaCJ/o2uRI.MtP4Ijdl5xyPy0RHdBnhbm3F7H7q`

---

## Reserved Usernames

- `admin` - Reserved for admin access (hardcoded, cannot be used by regular users)

---

## Testing the Login

### Admin Login:
```
POST /api/auth/login
{
  "username": "admin",
  "password": "a123"
}
```

### Regular User Login:
```
POST /api/auth/login
{
  "username": "driver1",
  "password": "driver123"
}
```

---

## Security Recommendations

1. **Change Admin Password**: Update the hardcoded admin credentials in the code
2. **Use Environment Variables**: Move admin credentials to `.env` file
3. **Strong Passwords**: Use strong, unique passwords for production
4. **Remove Sample Users**: Delete test users before going to production
5. **Database Security**: Ensure MySQL user has appropriate permissions only

---

## Notes

- The admin user is **NOT stored in the database** - it's a hardcoded check
- Regular users are stored in the `users` table with bcrypt hashed passwords
- The `username` field must be unique
- The `siteId` is auto-generated for new users (T1, T2, T3, etc.)

