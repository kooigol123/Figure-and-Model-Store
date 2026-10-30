-- ==============================================================
-- Figure and Model Store: Database Schema (โครงสร้างตาราง)
-- ==============================================================

-- 1. Users Table (ตารางผู้ใช้และผู้ดูแลระบบ)
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    status     VARCHAR(20)  NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended'))
);

-- 2. Brands Table (ตารางแบรนด์สินค้า)
CREATE TABLE IF NOT EXISTS brands (
    "brandId" SERIAL PRIMARY KEY,
    "brandName" VARCHAR(100) NOT NULL UNIQUE
);

-- 3. Categories Table (ตารางหมวดหมู่สินค้า)
CREATE TABLE IF NOT EXISTS categories (
    "categoryId" SERIAL PRIMARY KEY,
    "categoryName" VARCHAR(100) NOT NULL UNIQUE
);

-- 4. Products Table (ตารางสินค้าโมเดล/ฟิกเกอร์)
CREATE TABLE IF NOT EXISTS products (
    "pdId" VARCHAR(20) PRIMARY KEY,
    "pdName" VARCHAR(255) NOT NULL,
    "brandId" INT REFERENCES brands("brandId") ON DELETE SET NULL,
    "categoryId" INT REFERENCES categories("categoryId") ON DELETE SET NULL,
    "price" NUMERIC(10, 2) NOT NULL CHECK ("price" >= 0),
    "stock" INT NOT NULL DEFAULT 10 CHECK ("stock" >= 0),
    "description" TEXT,
    "image" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Carts Table (ตารางหัวตะกร้า/คำสั่งซื้อ)
CREATE TABLE IF NOT EXISTS carts (
    "cartId" VARCHAR(20) PRIMARY KEY,
    "userId" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "cartDate" DATE DEFAULT CURRENT_DATE,
    "cartCf" BOOLEAN DEFAULT FALSE,
    "cartPay" BOOLEAN DEFAULT FALSE,
    "cartSend" BOOLEAN DEFAULT FALSE,
    "cartRecv" BOOLEAN DEFAULT FALSE
);

-- 6. Cart Details Table (ตารางรายการสินค้าในตะกร้า)
CREATE TABLE IF NOT EXISTS "cartDtl" (
    "cartId" VARCHAR(20) NOT NULL REFERENCES carts("cartId") ON DELETE CASCADE,
    "pdId" VARCHAR(20) NOT NULL REFERENCES products("pdId") ON DELETE RESTRICT,
    "qty" INT NOT NULL DEFAULT 1 CHECK ("qty" > 0),
    "price" NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY ("cartId", "pdId")
);

-- 7. สิทธิ์การเข้าถึงสำหรับ Database Role (กรณีใช้ user dev ใน DATABASE_URL)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'dev') THEN
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dev;
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dev;
    END IF;
END $$;
