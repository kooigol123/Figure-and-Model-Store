-- ==============================================================
-- 1. User Table (ตารางผู้ใช้)
-- ==============================================================
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ==============================================================
-- 1. Brands Table (ตารางแบรนด์สินค้า)
-- ==============================================================
CREATE TABLE IF NOT EXISTS brands (
    "brandId" SERIAL PRIMARY KEY,
    "brandName" VARCHAR(100) NOT NULL UNIQUE
);

-- ข้อมูลตัวอย่างแบรนด์
INSERT INTO brands ("brandName") VALUES
('Good Smile Company'),
('Bandai Spirits'),
('Kotobukiya')
ON CONFLICT ("brandName") DO NOTHING;

-- ==============================================================
-- 2. Categories Table (ตารางหมวดหมู่สินค้า)
-- ==============================================================
CREATE TABLE IF NOT EXISTS categories (
    "categoryId" SERIAL PRIMARY KEY,
    "categoryName" VARCHAR(100) NOT NULL UNIQUE
);

-- ข้อมูลตัวอย่างหมวดหมู่สินค้า
INSERT INTO categories ("categoryName") VALUES
('สเกลฟิกเกอร์ (Scale Figure)'),
('เนนโดรอยด์ (Nendoroid)')
ON CONFLICT ("categoryName") DO NOTHING;

-- ==============================================================
-- 3. Products Table (ตารางสินค้าโมเดล/ฟิกเกอร์)
-- ==============================================================
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

-- ข้อมูลตัวอย่างสินค้า
INSERT INTO products ("pdId", "pdName", "brandId", "categoryId", "price", "stock", "description", "image") VALUES
('001', 'Frieren 1/7 Scale Figure', 1, 1, 8990.00, 10, 'ฟิกเกอร์ฟรีเรนสเกล 1/7 ความสูง 24 ซม.', '/img_pd/001.jpg'),
('002', 'MG 1/100 RX-78-2 Gundam Ver.Ka', 2, 2, 2290.00, 15, 'โมเดลกันพลาเกรด MG สเกล 1/100', '/img_pd/002.jpg')
ON CONFLICT ("pdId") DO NOTHING;

-- ==============================================================
-- 4. Carts Table (ตารางหัวตะกร้า/คำสั่งซื้อ)
-- ==============================================================
CREATE TABLE IF NOT EXISTS carts (
    "cartId" VARCHAR(20) PRIMARY KEY,
    "cusId" VARCHAR(100) NOT NULL,
    "cartDate" DATE DEFAULT CURRENT_DATE,
    "cartCf" BOOLEAN DEFAULT FALSE,
    "cartPay" BOOLEAN DEFAULT FALSE,
    "cartSend" BOOLEAN DEFAULT FALSE,
    "cartRecv" BOOLEAN DEFAULT FALSE
);

-- ==============================================================
-- 5. Carts Details Table (ตารางรายการสินค้าในตะกร้า)
-- ==============================================================
CREATE TABLE IF NOT EXISTS "cartDtl" (
    "cartId" VARCHAR(20) NOT NULL REFERENCES carts("cartId") ON DELETE CASCADE,
    "pdId" VARCHAR(20) NOT NULL REFERENCES products("pdId") ON DELETE RESTRICT,
    "qty" INT NOT NULL DEFAULT 1 CHECK ("qty" > 0),
    "price" NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY ("cartId", "pdId")
);