# หน้าที่
ดาน หน้าที่ 1 Backend : API Login,Register,Role,Admin
ตั้น หน้าที่ 2 Backend : API Product,Cart,Confirm,Historyแ
เซีย หน้าที่ 3 Frontend : Login + Register Page,แก้ไขข้อมูลส่วนตัว,หน้าโชว์โมเดลและรายละเอียดสินค้า
ริว หน้าที่ 4 Frontend : Admin Page เพิ่ม+แก้ไขสินค้า,หน้าโชว์ Member ทั้งหมดและเปลี่ยน Role ประวัติการสั่งซื้อ
# Git Workflow Guide

ข้อตกลงการใช้ Git ในกลุ่ม:
* ห้าม push โค้ดเข้า `main` ตรงๆ ให้ทุกคนแตก branch ของตัวเองเสมอ
* ห้าม commit ไฟล์ `.env` หรือโฟลเดอร์ที่ไม่จำเป็นขึ้น GitHub เด็ดขาด
* ห้ามทำงานชิ้นใหม่ใน branch เดิม ให้สลับกลับ main ดึงโค้ดล่าสุด แล้วแตก branch ใหม่เสมอ
---

## หลังจากที่ Git Clone Repo นี้มาให้ติดตั้ง Node

# ติดตั้งฝั่ง Backend
cd backend
npm install
# ติดตั้งฝั่ง Frontend
cd ../frontend
npm install

---
## คำสั่งที่ต้องใช้ประจำ

1. อัปเดตโค้ดล่าสุดก่อนเริ่มทำ:
```bash
git checkout main
git pull
```

2. สร้าง branch ใหม่ทำงานตัวเอง:
```bash
git checkout -b feature/<ชื่องาน>

# ตัวอย่างตามหน้าที่:
git checkout -b feature/auth        # ระบบ Login / Register
git checkout -b feature/products    # ระบบจัดการสินค้าฟิกเกอร์
git checkout -b feature/cart        # ระบบตะกร้าสินค้า
git checkout -b feature/admin       # ระบบจัดการหลังบ้าน
```

3. เช็คไฟล์และเซฟ commit:
```bash
git status                          # ตรวจสอบว่าไม่มีไฟล์แปลกปลอม (เช่น .env)
git add .
git commit -m "อธิบายสั้นๆ ว่าแก้อะไรไป"

# ตัวอย่าง:
git commit -m "feat: add login api and jwt token"
git commit -m "feat: add product list component"
```

4. ดันโค้ดขึ้น GitHub:
```bash
# พิมพ์ครั้งแรกเพื่อผูก branch (ครั้งต่อไปถ้ามี commit เพิ่ม พิมพ์แค่ git push ได้เลย)
git push -u origin feature/<ชื่องาน>

git push origin feature/<ชื่องาน>

# ตัวอย่างตามหน้าที่:
git push origin feature/auth
git push origin feature/products
git push origin feature/cart
git push origin feature/admin
```

5. เปิดหน้าเว็บ GitHub แล้วกดสร้าง Pull Request (PR) ให้เพื่อนช่วยเช็คก่อน merge เข้า main

6. เมื่อ Merge เสร็จแล้ว (เตรียมเริ่มงานใหม่):
# สลับกลับมาที่ main แล้วดึงโค้ดใหม่ที่มีงานเพื่อนๆ เข้ามา
git checkout main
git pull origin main

# ลบ branch เก่าที่เสร็จแล้วทิ้งจากเครื่อง (เพื่อไม่ให้รก)
git branch -d feature/<ชื่องาน>