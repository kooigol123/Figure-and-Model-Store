// สร้าง admin คนแรก: npm run seed
import 'dotenv/config';
import bcrypt from 'bcrypt';
import db from './services/db.js';

(async () => {
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await db.query(
    `INSERT INTO users (name, email, password, role) VALUES ('Admin', $1, $2, 'admin')
     ON CONFLICT (email) DO UPDATE SET role='admin'`,
    [process.env.ADMIN_EMAIL.toLowerCase(), hash]
  );
  console.log('Admin พร้อมใช้งาน:', process.env.ADMIN_EMAIL);
  await db.end();
})();
