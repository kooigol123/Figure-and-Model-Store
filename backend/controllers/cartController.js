import database from "../services/db.js";

export async function chkCart(req, res) {
  console.log(`POST /carts/chkcart requested`);
  try {
    if (!req.body.userId) {
      return res.status(400).json({ error: true, message: "userId is required" });
    }

    const result = await database.query({
      text: `SELECT * FROM carts WHERE "userId" = $1 AND "cartCf" != true`,
      values: [req.body.userId]
    });

    if (result.rows[0]) {
      return res.status(200).json({ cartExist: true, cartId: result.rows[0].cartId });
    } else {
      return res.status(200).json({ cartExist: false });
    }
  } catch (err) {
    console.error(">>> ERROR DB DETAIL:", err);
    return res.status(500).json({ message: err.message });
  }
}

export async function postCart(req, res) {
  console.log(`POST /carts/addcart requested`);
  try {
    if (!req.body.userId) {
      return res.status(400).json({ cartOK: false, message: "userId is required" });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const currentDate = `${year}${month}${day}`;

    let i = 0;
    let theId = "";
    let existsResult = [];

    do {
      i++;
      theId = `${currentDate}${String(i).padStart(4, "0")}`;
      existsResult = await database.query({
        text: `SELECT EXISTS (SELECT 1 FROM carts WHERE "cartId" = $1)`,
        values: [theId]
      });
    } while (existsResult.rows[0].exists);

    await database.query({
      text: `INSERT INTO carts ("cartId", "userId", "cartDate") VALUES ($1, $2, $3)`,
      values: [theId, req.body.userId, now]
    });

    return res.status(201).json({ cartOK: true, cartId: theId });
  } catch (err) {
    console.error(">>> ERROR DB DETAIL:", err);
    return res.status(500).json({ cartOK: false, message: err.message });
  }
}

export async function postCartDtl(req, res) {
  console.log(`POST /carts/addcartdtl requested`);
  try {
    const { cartId, pdId, price } = req.body;
    if (!cartId || !pdId || price === undefined) {
      return res.status(400).json({ cartDtlOK: false, message: "cartId, pdId and price are required" });
    }

    const pdResult = await database.query({
      text: `SELECT * FROM "cartDtl" WHERE "cartId" = $1 AND "pdId" = $2`,
      values: [cartId, pdId]
    });

    if (pdResult.rowCount === 0) {
      await database.query({
        text: `INSERT INTO "cartDtl" ("cartId", "pdId", qty, price) VALUES ($1, $2, 1, $3)`,
        values: [cartId, pdId, price]
      });
    } else {
      await database.query({
        text: `UPDATE "cartDtl" SET qty = qty + 1 WHERE "cartId" = $1 AND "pdId" = $2`,
        values: [cartId, pdId]
      });
    }

    return res.status(200).json({ cartDtlOK: true, cartId });
  } catch (err) {
    console.error(">>> ERROR DB DETAIL:", err);
    return res.status(500).json({ cartDtlOK: false, message: err.message });
  }
}

export async function getCart(req, res) {
  console.log(`GET /carts/getcart/${req.params.id} requested`);
  try {
    const result = await database.query({
      text: `
        SELECT ct.*, 
               COALESCE(SUM(ctd.qty), 0) AS sqty, 
               COALESCE(SUM(ctd.price * ctd.qty), 0) AS sprice
        FROM carts ct
        LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId"
        WHERE ct."cartId" = $1
        GROUP BY ct."cartId"
      `,
      values: [req.params.id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(">>> ERROR DB DETAIL:", err);
    return res.status(500).json({ message: err.message });
  }
}

export async function getCartDtl(req, res) {
  console.log(`GET /carts/getcartdtl/${req.params.id} requested`);
  try {
    const result = await database.query({
      text: `
        SELECT 
          ROW_NUMBER() OVER (ORDER BY ctd."pdId") AS row_number,
          ctd."pdId",
          pd."pdName",
          pd.image,
          ctd.price,
          ctd.qty,
          (ctd.price * ctd.qty) AS subtotal
        FROM "cartDtl" ctd
        LEFT JOIN products pd ON ctd."pdId" = pd."pdId"
        WHERE ctd."cartId" = $1
        ORDER BY ctd."pdId" ASC
      `,
      values: [req.params.id]
    });

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(">>> ERROR DB DETAIL:", err);
    return res.status(500).json({ message: err.message });
  }
}

export async function updateCartQty(req, res) {
  console.log(`PUT /carts/updateqty requested`);
  try {
    const { cartId, pdId, qty } = req.body;
    if (!cartId || !pdId || qty === undefined) {
      return res.status(400).json({ message: "cartId, pdId and qty are required" });
    }

    if (Number(qty) <= 0) {
      await database.query({
        text: `DELETE FROM "cartDtl" WHERE "cartId" = $1 AND "pdId" = $2`,
        values: [cartId, pdId]
      });
    } else {
      await database.query({
        text: `UPDATE "cartDtl" SET qty = $1 WHERE "cartId" = $2 AND "pdId" = $3`,
        values: [qty, cartId, pdId]
      });
    }

    return res.status(200).json({ message: "Quantity updated successfully" });
  } catch (err) {
    console.error(">>> ERROR DB DETAIL:", err);
    return res.status(500).json({ message: err.message });
  }
}

export async function deleteCartDtl(req, res) {
  console.log(`DELETE /carts/item requested`);
  try {
    const { cartId, pdId } = req.body;
    await database.query({
      text: `DELETE FROM "cartDtl" WHERE "cartId" = $1 AND "pdId" = $2`,
      values: [cartId, pdId]
    });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(">>> ERROR DB DETAIL:", err);
    return res.status(500).json({ message: err.message });
  }
}

export async function deleteCart(req, res) {
  console.log(`DELETE /carts/${req.params.id} requested`);
  try {
    await database.query({
      text: `DELETE FROM carts WHERE "cartId" = $1`,
      values: [req.params.id]
    });
    return res.status(200).json({ message: "Cart deleted successfully" });
  } catch (err) {
    console.error(">>> ERROR DB DETAIL:", err);
    return res.status(500).json({ message: err.message });
  }
}




export async function confirmCart(req, res) {
  console.log(`POST /carts/confirm requested`);
  const { cartId } = req.body;

  if (!cartId) {
    return res.status(400).json({ message: "cartId is required" });
  }

  const client = await database.connect();

  try {
    await client.query("BEGIN");

    const cartCheck = await client.query({
      text: `SELECT * FROM carts WHERE "cartId" = $1 AND "cartCf" = false`,
      values: [cartId]
    });

    if (cartCheck.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart not found or already confirmed" });
    }

    const itemsResult = await client.query({
      text: `
        SELECT ctd."pdId", ctd.qty, p.stock, p."pdName"
        FROM "cartDtl" ctd
        JOIN products p ON ctd."pdId" = p."pdId"
        WHERE ctd."cartId" = $1
      `,
      values: [cartId]
    });

    if (itemsResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of itemsResult.rows) {
      if (item.stock < item.qty) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: `สินค้า ${item.pdName} มีจำนวนไม่เพียงพอ (เหลือ ${item.stock} ชิ้น)`
        });
      }
    }

    for (const item of itemsResult.rows) {
      await client.query({
        text: `UPDATE products SET stock = stock - $1 WHERE "pdId" = $2`,
        values: [item.qty, item.pdId]
      });
    }

    await client.query({
      text: `UPDATE carts SET "cartCf" = true WHERE "cartId" = $1`,
      values: [cartId]
    });

    await client.query("COMMIT");
    return res.status(200).json({ message: "Order confirmed successfully", cartId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(">>> ERROR DB DETAIL:", err);
    return res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
}
// ==============================================================================
// History
// ==============================================================================
export async function getCartByCustomer(req, res) {
  console.log(`GET /carts/history/${req.params.userId} requested`);
  try {
    const result = await database.query({
      text: `
        SELECT 
          ROW_NUMBER() OVER (ORDER BY ct."cartId" DESC) AS row_number,
          ct."cartId",
          ct."cartDate",
          ct."cartCf",
          ct."cartPay",
          ct."cartSend",
          ct."cartRecv",
          COALESCE(SUM(ctd.qty), 0) AS total_items,
          COALESCE(SUM(ctd.price * ctd.qty), 0) AS total_amount
        FROM carts ct
        LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId"
        WHERE ct."userId" = $1
        GROUP BY ct."cartId"
        ORDER BY ct."cartId" DESC
      `,
      values: [req.params.userId]
    });

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(">>> ERROR DB DETAIL:", err);
    return res.status(500).json({ message: err.message });
  }
}

export async function getOrderSummary(req, res) {
  console.log(`GET /carts/summary/${req.params.userId} requested`);
  try {
    const result = await database.query({
      text: `
        SELECT 
          COUNT(DISTINCT ct."cartId") AS total_orders,
          COALESCE(SUM(CASE WHEN ct."cartCf" = true THEN ctd.qty ELSE 0 END), 0) AS confirmed_items,
          COALESCE(SUM(CASE WHEN ct."cartCf" = true THEN ctd.price * ctd.qty ELSE 0 END), 0) AS total_spent
        FROM carts ct
        LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId"
        WHERE ct."userId" = $1
      `,
      values: [req.params.userId]
    });

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(">>> ERROR DB DETAIL:", err);
    return res.status(500).json({ message: err.message });
  }
}