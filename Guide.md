# Git Workflow Guide

ข้อตกลงการใช้ Git ในกลุ่ม:
* ห้าม push โค้ดเข้า `main` ตรงๆ ให้ทุกคนแตก branch ของตัวเอง
* รันเทสในเครื่องตัวเองให้ผ่านก่อน แล้วค่อยเปิด PR รวมเข้า `main`

---

## คำสั่งที่ต้องใช้ประจำ

1. อัปเดตโค้ดล่าสุดก่อนเริ่มงาน:
```bash
git checkout main
git pull
```

2. สร้าง branch ใหม่ทำงานตัวเอง:
```bash
git checkout -b feature/<ชื่องาน>

# ตัวอย่างตามหน้าที่:
git checkout -b feature/auth        # คนทำระบบ Login / Register
git checkout -b feature/products    # คนทำระบบสินค้าฟิกเกอร์
git checkout -b feature/cart        # คนทำระบบตะกร้าสินค้า
git checkout -b feature/admin       # คนทำระบบจัดการหลังบ้าน
```

3. เช็คไฟล์และเซฟ commit:
```bash
git status
git add .
git commit -m "อธิบายสั้นๆ ว่าแก้อะไรไป"

# ตัวอย่าง:
git commit -m "feat: add login api and jwt token"
git commit -m "feat: add product list component"
```

4. ดันโค้ดขึ้น GitHub:
```bash
git push origin feature/<ชื่องาน>

# ตัวอย่างตามหน้าที่:
git push origin feature/auth
git push origin feature/products
git push origin feature/cart
git push origin feature/admin
```

5. เปิดหน้าเว็บ GitHub แล้วกดสร้าง Pull Request (PR) ให้เพื่อนช่วยเช็คก่อน merge เข้า main
