import database from "../services/db.js";

export async function getAllProduct(req, res) {
    console.log(`GET /products requested`);
    try {
        const strQry = `
      SELECT p.*,
        (
          SELECT row_to_json(brand_obj)
          FROM (
            SELECT "brandId", "brandName"
            FROM brands
            WHERE "brandId" = p."brandId"
          ) AS brand_obj
        ) AS brand,
        (
          SELECT row_to_json(cat_obj)
          FROM (
            SELECT "categoryId", "categoryName"
            FROM categories
            WHERE "categoryId" = p."categoryId"
          ) AS cat_obj
        ) AS category
      FROM products p
      ORDER BY p."pdId" ASC;
    `;

        const result = await database.query(strQry);
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(">>> ERROR DB DETAIL:", err);
        return res.status(500).json({
            message: err.message
        });
    }
}

export async function getProductById(req, res) {
    console.log(`GET /products/${req.params.id} requested`);
    try {
        const result = await database.query({
            text: `
        SELECT p.*,
          (
            SELECT row_to_json(brand_obj)
            FROM (
              SELECT "brandId", "brandName"
              FROM brands
              WHERE "brandId" = p."brandId"
            ) AS brand_obj
          ) AS brand,
          (
            SELECT row_to_json(cat_obj)
            FROM (
              SELECT "categoryId", "categoryName"
              FROM categories
              WHERE "categoryId" = p."categoryId"
            ) AS cat_obj
          ) AS category
        FROM products p
        WHERE p."pdId" = $1;
      `,
            values: [req.params.id]
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(">>> ERROR DB DETAIL:", err);
        return res.status(500).json({ message: err.message });
    }
}

export async function getCategories(req, res) {
    console.log(`GET /categories requested`);
    try {
        const result = await database.query(`SELECT * FROM categories ORDER BY "categoryId" ASC;`);
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(">>> ERROR DB DETAIL:", err);
        return res.status(500).json({ message: err.message });
    }
}

export async function postCategory(req, res) {
    console.log("POST /categories requested");
    const categoryName = (req.body.categoryName || "").trim();
    if (!categoryName) {
        return res.status(422).json({ message: "กรุณาระบุชื่อหมวดหมู่" });
    }
    try {
        const found = await database.query({
            text: `SELECT "categoryId", "categoryName" FROM categories WHERE LOWER("categoryName") = LOWER($1)`,
            values: [categoryName]
        });
        if (found.rowCount > 0) {
            return res.status(200).json(found.rows[0]);
        }
        const result = await database.query({
            text: `INSERT INTO categories ("categoryName") VALUES ($1) RETURNING "categoryId", "categoryName"`,
            values: [categoryName]
        });
        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(">>> ERROR DB DETAIL:", err);
        return res.status(500).json({ message: err.message });
    }
}

export async function getSearchProduct(req, res) {
    console.log(`GET /products/search/${req.params.id} requested`);
    try {
        const result = await database.query({
            text: `
        SELECT p.*,
          (
            SELECT row_to_json(brand_obj)
            FROM (
              SELECT "brandId", "brandName"
              FROM brands
              WHERE "brandId" = p."brandId"
            ) AS brand_obj
          ) AS brand,
          (
            SELECT row_to_json(cat_obj)
            FROM (
              SELECT "categoryId", "categoryName"
              FROM categories
              WHERE "categoryId" = p."categoryId"
            ) AS cat_obj
          ) AS category
        FROM products p
        WHERE (
          p."pdId" ILIKE $1 
          OR p."pdName" ILIKE $1
          OR p.description ILIKE $1
        )
        ORDER BY p."pdId" ASC;
      `,
            values: [`%${req.params.id}%`]
        });
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(">>> ERROR DB DETAIL:", err);
        return res.status(500).json({ message: err.message });
    }
}

export async function getBrands(req, res) {
    console.log(`GET /brands requested`);
    try {
        const result = await database.query(`SELECT * FROM brands ORDER BY "brandId" ASC;`);
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error(">>> ERROR DB DETAIL:", err);
        return res.status(500).json({ message: err.message });
    }
}

// ส่ง brandName มา: ใช้แบรนด์ที่มีอยู่ (ไม่สนตัวพิมพ์เล็ก/ใหญ่) ถ้ายังไม่มีให้เพิ่มใหม่
// ถ้าไม่ส่ง brandName ใช้ brandId ตามเดิม
async function resolveBrandId(bodyData) {
    const brandName = (bodyData.brandName || "").trim();
    if (!brandName) return bodyData.brandId || null;

    const found = await database.query({
        text: `SELECT "brandId" FROM brands WHERE LOWER("brandName") = LOWER($1)`,
        values: [brandName]
    });
    if (found.rowCount > 0) return found.rows[0].brandId;

    const inserted = await database.query({
        text: `INSERT INTO brands ("brandName") VALUES ($1) RETURNING "brandId"`,
        values: [brandName]
    });
    return inserted.rows[0].brandId;
}

// ส่ง categoryName มา: ใช้หมวดหมู่ที่มีอยู่ (ไม่สนตัวพิมพ์เล็ก/ใหญ่) ถ้ายังไม่มีให้เพิ่มใหม่
// ถ้าไม่ส่ง categoryName ใช้ categoryId ตามเดิม
async function resolveCategoryId(bodyData) {
    const categoryName = (bodyData.categoryName || "").trim();
    if (!categoryName) return bodyData.categoryId || null;

    const found = await database.query({
        text: `SELECT "categoryId" FROM categories WHERE LOWER("categoryName") = LOWER($1)`,
        values: [categoryName]
    });
    if (found.rowCount > 0) return found.rows[0].categoryId;

    const inserted = await database.query({
        text: `INSERT INTO categories ("categoryName") VALUES ($1) RETURNING "categoryId"`,
        values: [categoryName]
    });
    return inserted.rows[0].categoryId;
}

export async function postProduct(req, res) {
    console.log("POST /products is requested");
    const bodyData = req.body;
    try {
        if (!bodyData.pdId || !bodyData.pdName || !bodyData.price) {
            return res.status(422).json({ message: "ERROR: pdId, pdName และ price จำเป็นต้องกรอก" });
        }

        const chkRow = await database.query({
            text: `SELECT * FROM products WHERE "pdId" = $1`,
            values: [bodyData.pdId]
        });
        if (chkRow.rowCount !== 0) {
            return res.status(409).json({ message: `ERROR: รหัสสินค้า ${bodyData.pdId} มีอยู่ในระบบแล้ว` });
        }

        const brandId = await resolveBrandId(bodyData);
        const categoryId = await resolveCategoryId(bodyData);

        const result = await database.query({
            text: `
        INSERT INTO products ("pdId", "pdName", "brandId", "categoryId", "price", "stock", "description", "image")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
            values: [
                bodyData.pdId,
                bodyData.pdName,
                brandId,
                categoryId,
                bodyData.price,
                bodyData.stock || 10,
                bodyData.description || "",
                bodyData.image || "/img_pd/default.jpg"
            ]
        });

        return res.status(201).json({
            message: "เพิ่มสินค้าสำเร็จ",
            product: result.rows[0]
        });
    } catch (err) {
        console.error(">>> ERROR DB DETAIL:", err);
        return res.status(500).json({ message: err.message });
    }
}

export async function putProduct(req, res) {
    console.log(`PUT /products/${req.params.id} requested`);
    const bodyData = req.body;
    try {
        if (!bodyData.pdName || bodyData.price === undefined || bodyData.price === "" || Number(bodyData.price) < 0) {
            return res.status(422).json({ message: "ERROR: pdName และ price จำเป็นต้องกรอก (price ต้องไม่ติดลบ)" });
        }

        const brandId = await resolveBrandId(bodyData);
        const categoryId = await resolveCategoryId(bodyData);

        const result = await database.query({
            text: `
        UPDATE products
        SET "pdName" = $1, "brandId" = $2, "categoryId" = $3, "price" = $4, "description" = $5
        WHERE "pdId" = $6
        RETURNING *
      `,
            values: [
                bodyData.pdName,
                brandId,
                categoryId,
                bodyData.price,
                bodyData.description || "",
                req.params.id
            ]
        });

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "แก้ไขสินค้าสำเร็จ", product: result.rows[0] });
    } catch (err) {
        console.error(">>> ERROR DB DETAIL:", err);
        return res.status(500).json({ message: err.message });
    }
}

// รูปถูกบันทึกโดย multer ใน productRoutes แล้ว (img_pd/<pdId>.jpg)
export async function uploadProductImage(req, res) {
    console.log(`POST /products/${req.params.id}/image requested`);
    if (!req.file) {
        return res.status(400).json({ message: "กรุณาเลือกไฟล์รูปภาพ (JPG หรือ PNG)" });
    }
    try {
        await database.query({
            text: `UPDATE products SET "image" = $1 WHERE "pdId" = $2`,
            values: [`/img_pd/${req.params.id}.jpg`, req.params.id]
        });
        return res.status(200).json({ message: "อัปโหลดรูปสินค้าสำเร็จ" });
    } catch (err) {
        console.error(">>> ERROR DB DETAIL:", err);
        return res.status(500).json({ message: err.message });
    }
}

export async function deleteProduct(req, res) {
    console.log(`DELETE /products/${req.params.id} requested`);
    try {
        const result = await database.query({
            text: `DELETE FROM products WHERE "pdId" = $1`,
            values: [req.params.id]
        });
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "ลบสินค้าสำเร็จ" });
    } catch (err) {
        // cartDtl อ้างถึงสินค้านี้อยู่ (ON DELETE RESTRICT)
        if (err.code === "23503") {
            return res.status(409).json({ message: "ลบไม่ได้ เพราะสินค้านี้อยู่ในตะกร้าหรือคำสั่งซื้อของลูกค้า" });
        }
        console.error(">>> ERROR DB DETAIL:", err);
        return res.status(500).json({ message: err.message });
    }
}
