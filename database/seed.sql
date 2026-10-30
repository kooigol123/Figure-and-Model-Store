-- ==============================================================
-- Figure and Model Store: Initial Seed Data (ข้อมูลเริ่มต้น)
-- ==============================================================

-- 1. ผู้ใช้งานเริ่มต้น (รหัสผ่านเข้ารหัสผ่าน bcrypt)
-- admin@model.store / รหัสผ่าน: admin1234
-- test@gmail.com    / รหัสผ่าน: test1234
-- anupat.so@ku.th   / รหัสผ่าน: 12345678
INSERT INTO users (name, email, password, role, status) VALUES
('ผู้ดูแลระบบ (Admin)', 'admin@model.store', '$2b$10$VMoPOgc7S.KMYBe6Pl4WBOtV8O.tjxDFcOKWHYrrTPVT6ogTFoW.i', 'admin', 'active'),
('สมาชิกทดลอง (Member)', 'test@gmail.com', '$2b$10$L9cqhNBhkU8Ajh.fKzDEA.hhP68g6UeniWI8zqq2XejcoJkLT3n/m', 'user', 'active'),
('อนุภัทร สมบัติศรี', 'anupat.so@ku.th', '$2b$10$VMoPOgc7S.KMYBe6Pl4WBOtV8O.tjxDFcOKWHYrrTPVT6ogTFoW.i', 'admin', 'active')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, status = EXCLUDED.status;

-- 2. แบรนด์สินค้าเริ่มต้น
INSERT INTO brands ("brandName") VALUES
('Good Smile Company'),
('Bandai Spirits'),
('Kotobukiya')
ON CONFLICT ("brandName") DO NOTHING;

-- 3. หมวดหมู่สินค้าเริ่มต้น
INSERT INTO categories ("categoryName") VALUES
('สเกลฟิกเกอร์ (Scale Figure)'),
('เนนโดรอยด์ (Nendoroid)')
ON CONFLICT ("categoryName") DO NOTHING;

-- 4. สินค้าตัวอย่างเริ่มต้น
INSERT INTO products ("pdId", "pdName", "brandId", "categoryId", "price", "stock", "description", "image") VALUES
('001', 'Frieren 1/7 Scale Figure', 1, 1, 8990.00, 10, 'ฟิกเกอร์ฟรีเรนสเกล 1/7 จากเรื่อง Frieren: Beyond Journey''s End ความสูงประมาณ 24 ซม. งานสีละเอียดประณีต พร้อมฐานตั้งและไม้เท้าคู่ใจ', '/img_pd/001.jpg'),
('002', 'MG 1/100 RX-78-2 Gundam Ver.Ka', 2, 2, 2290.00, 15, 'โมเดลกันพลาเกรด Master Grade (MG) สเกล 1/100 RX-78-2 Gundam เวอร์ชัน Katoki Hajime สัดส่วนและดีเทลสวยงามสมจริง', '/img_pd/002.jpg')
ON CONFLICT ("pdId") DO NOTHING;
