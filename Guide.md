## 1. การแบ่งหน้าที่รับผิดชอบในกลุ่ม

---
1. ดาน (คนที่ 1): Backend API สำหรับ Login, Register, Role และ Admin Backoffice
2. ตั้น (คนที่ 2): Backend API สำหรับ Product, Cart, Confirm และ Order History
3. เซีย (คนที่ 3): Frontend หน้า Login, Register, ข้อมูลส่วนตัวสมาชิก และหน้ารายการสินค้า
4. ริว (คนที่ 4): Frontend หน้า Admin Backoffice, ตารางจัดการสมาชิก และประวัติคำสั่งซื้อ

## 2. ขั้นตอนการติดตั้งหลัง Clone โปรเจกต์

---
1. Clone โปรเจกต์จาก GitHub ลงมาที่เครื่อง
```bash
git clone https://github.com/kooigol123/Figure-and-Model-Store.git
cd Figure-and-Model-Store
```
2. ติดตั้งโมดูลสำหรับระบบ Backend
```bash
cd backend
npm install
```
3. ติดตั้งโมดูลสำหรับระบบ Frontend
```bash
cd ../frontend
npm install
```

## 3. การเตรียมฐานข้อมูล PostgreSQL

---
1. เปิด pgAdmin หรือ psql แล้วสร้างฐานข้อมูลใหม่ชื่อ figure_model
2. เปิดไฟล์ database/schema.sql แล้วรันคำสั่งทั้งหมดเพื่อสร้างตาราง
3. สร้างข้อมูลตัวอย่างเริ่มต้นได้ 2 วิธี (เลือกวิธีใดวิธีหนึ่ง)
- วิธีที่ 1 (แนะนำ): รันผ่านสคริปต์ Node.js ในโฟลเดอร์ backend
```bash
cd backend
npm run seed
```
- วิธีที่ 2: นำเข้าไฟล์ database/seed.sql ผ่าน Query Tool ใน pgAdmin

## 4. การตั้งค่า Environment และการรันระบบ

---
1. สร้างไฟล์คอนฟิก .env ในโฟลเดอร์ backend โดยก็อปปี้จากไฟล์ตัวอย่าง .env.example
2. ตรวจสอบข้อมูลเชื่อมต่อฐานข้อมูลใน backend/.env ให้ตรงกับเครื่องของตนเอง เช่น พอร์ตและรหัสผ่านของ postgres
3. เริ่มรันระบบหลังบ้าน Backend (พอร์ต 3000)
```bash
cd backend
npm run dev
```
- ตรวจสอบ API Documentation ได้ที่ http://localhost:3000/api-docs
4. เปิด Terminal อีกหน้าต่าง แล้วเริ่มรันระบบหน้าบ้าน Frontend (พอร์ต 5173)
```bash
cd frontend
npm run dev
```
- เข้าใช้งานเว็บไซต์ได้ที่ http://localhost:5173/

## 5. ข้อมูลบัญชีสำหรับทดสอบระบบ

---
1. บัญชีผู้ดูแลระบบ (Admin)
- อีเมล: admin@model.store
- รหัสผ่าน: admin1234
2. บัญชีสมาชิกทั่วไป (Member)
- อีเมล: test@gmail.com
- รหัสผ่าน: test1234

## 6. ข้อตกลงการใช้งาน Git และการส่งงาน

---
1. ห้าม Push โค้ดเข้า branch main ตรงๆ โดยเด็ดขาด ให้ทุกคนทำงานบน Feature Branch ของตนเอง
2. ห้าม Commit ไฟล์ .env, .db หรือโฟลเดอร์ node_modules ขึ้น GitHub
3. ก่อนเริ่มทำงานใหม่ทุกครั้ง ให้อัปเดตโค้ดล่าสุดจาก main เสมอ
```bash
git checkout main
git pull origin main
```
4. สร้าง Branch ใหม่สำหรับงานของตนเอง
```bash
git checkout -b feature/<ชื่องาน>
```
5. ตรวจสอบไฟล์ที่แก้ไขและบันทึก Commit
```bash
git status
git add .
git commit -m "ระบุรายละเอียดงานที่ทำเป็นภาษาไทยกระชับ คั่นด้วยลูกน้ำ"
```
6. ส่งโค้ดขึ้น GitHub
```bash
git push -u origin feature/<ชื่องาน>
```
7. เปิดหน้า GitHub แล้วกดสร้าง Pull Request เพื่อให้เพื่อนช่วยตรวจและ Merge เข้า main
8. เมื่อ Merge เข้า main เรียบร้อย ให้สลับกลับมาที่ main แล้วลบ branch เดิมในเครื่อง
```bash
git checkout main
git pull origin main
git branch -d feature/<ชื่องาน>
```
