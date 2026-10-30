// สคริปต์สร้างข้อมูลเริ่มต้นในระบบ: npm run seed
import 'dotenv/config';
import bcrypt from 'bcrypt';
import db from './services/db.js';

async function seed() {
    console.log('Seeding initial data...');

    try {
        // 1. สร้างบัญชีผู้ใช้งานเริ่มต้น
        const adminPass = process.env.ADMIN_PASSWORD || 'admin1234';
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@model.store').toLowerCase();
        const memberPass = 'test1234';
        const memberEmail = 'test@gmail.com';
        const anupatPass = '12345678';
        const anupatEmail = 'anupat.so@ku.th';

        const adminHash = await bcrypt.hash(adminPass, 10);
        const memberHash = await bcrypt.hash(memberPass, 10);
        const anupatHash = await bcrypt.hash(anupatPass, 10);

        await db.query(`
            INSERT INTO users (name, email, password, role, status) VALUES
            ('ผู้ดูแลระบบ (Admin)', $1, $2, 'admin', 'active'),
            ('สมาชิกทดลอง (Member)', $3, $4, 'user', 'active'),
            ('อนุภัทร สมบัติศรี', $5, $6, 'admin', 'active')
            ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, status = EXCLUDED.status;
        `, [adminEmail, adminHash, memberEmail, memberHash, anupatEmail, anupatHash]);
        

        // 2. สร้างแบรนด์สินค้า
        await db.query(`
            INSERT INTO brands ("brandName") VALUES
            ('Good Smile Company'),
            ('Bandai Spirits'),
            ('Kotobukiya')
            ON CONFLICT ("brandName") DO NOTHING;
        `);
        

        // 3. สร้างหมวดหมู่สินค้า
        await db.query(`
            INSERT INTO categories ("categoryName") VALUES
            ('สเกลฟิกเกอร์ (Scale Figure)'),
            ('เนนโดรอยด์ (Nendoroid)')
            ON CONFLICT ("categoryName") DO NOTHING;
        `);
        

        // 4. สร้างสินค้าตัวอย่าง
        await db.query(`
            INSERT INTO products ("pdId", "pdName", "brandId", "categoryId", "price", "stock", "description", "image") VALUES
            ('001', 'Frieren 1/7 Scale Figure', 1, 1, 8990.00, 10, 'ฟิกเกอร์ฟรีเรนสเกล 1/7 จากเรื่อง Frieren: Beyond Journey''s End ความสูงประมาณ 24 ซม. งานสีละเอียดประณีต พร้อมฐานตั้งและไม้เท้าคู่ใจ', '/img_pd/001.jpg'),
            ('002', 'MG 1/100 RX-78-2 Gundam Ver.Ka', 2, 2, 2290.00, 15, 'โมเดลกันพลาเกรด Master Grade (MG) สเกล 1/100 RX-78-2 Gundam เวอร์ชัน Katoki Hajime สัดส่วนและดีเทลสวยงามสมจริง', '/img_pd/002.jpg')
            ON CONFLICT ("pdId") DO NOTHING;
        `);
        

        console.log('Seed completed successfully');
    } catch (err) {
        console.error('เกิดข้อผิดพลาดระหว่าง Seed:', err);
    } finally {
        await db.end();
    }
}

seed();
