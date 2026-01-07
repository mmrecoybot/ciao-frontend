# Database Setup Notes

This file contains important information regarding the database initialization performed on **January 5, 2026**.

## 1. Production/cPanel Database Details

These are the credentials currently used in your `.env` file to connect to the cPanel-ready environment.

- **Database Type:** PostgreSQL
- **Host:** `localhost` (Internal Port: 5432)
- **Database Name:** `ciaomobi_PostgreSQL`
- **Username:** `ciaomobi_ciaomobi`
- **Password:** `hdsf!4fsm;Dksd8vh`

---

## 2. SuperAdmin Credentials

Use these credentials to log in to the administrative dashboard of your application.

- **Email:** `admin@ciaomobi.com`
- **Password:** `Admin@123`
- **Role:** `SuperAdmin`

---

## 3. Initialization Steps Taken

If you ever need to reset this database again, these were the commands executed:

1.  **Sync Migrations:** `npx prisma migrate deploy` (Created all tables).
2.  **Generate Client:** `npx prisma generate` (Synced code with DB).
3.  **Seed Data:** `npx prisma db seed` (Populated roles and permissions).
4.  **Create Admin:** Executed `create-admin.js` to insert the SuperAdmin account above.

---

**Note:** Keep this file secure as it contains plain-text credentials.
