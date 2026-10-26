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

    const result = await database.query({
      text: `
        INSERT INTO products ("pdId", "pdName", "brandId", "categoryId", "price", "stock", "description", "image")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
      values: [
        bodyData.pdId,
        bodyData.pdName,
        bodyData.brandId || null,
        bodyData.categoryId || null,
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