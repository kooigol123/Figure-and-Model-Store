import express from "express";
import * as cartC from "../controllers/cartController.js";

const router = express.Router();

router.post("/carts/chkcart", cartC.chkCart);
router.post("/carts/addcart", cartC.postCart);
router.post("/carts/addcartdtl", cartC.postCartDtl);
router.get("/carts/getcart/:id", cartC.getCart);
router.get("/carts/getcartdtl/:id", cartC.getCartDtl);
router.put("/carts/updateqty", cartC.updateCartQty);
router.delete("/carts/item", cartC.deleteCartDtl);
router.delete("/carts/:id", cartC.deleteCart);
router.post("/carts/confirm", cartC.confirmCart);

// History Routes (หน้าประวัติการสั่งซื้อ)
router.get("/carts/history/:userId", cartC.getCartByCustomer); // ตารางประวัติคำสั่งซื้อ
router.get("/carts/summary/:userId", cartC.getOrderSummary);

export default router;
