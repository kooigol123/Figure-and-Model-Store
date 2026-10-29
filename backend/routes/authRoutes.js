import express from "express";
import * as cartC from "../controllers/cartController.js";
import * as authC from "../controllers/authController.js";
import { auth } from "./middleware.js";
import multer from "multer";

const router = express.Router();

// เก็บรูปโปรไฟล์เป็น img_mem/<userId>.jpg (ทับรูปเดิม)
const avatarUpload = multer({
    storage: multer.diskStorage({
        destination: "img_mem",
        filename: (req, file, cb) => cb(null, `${req.user.id}.jpg`),
    }),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, ["image/jpeg", "image/png"].includes(file.mimetype)),
});

router.post("/register", authC.register);
router.post("/login", authC.login);
router.get("/me", auth, authC.me);
router.put("/me", auth, authC.updateMe);
router.post("/me/avatar", auth, avatarUpload.single("file"), authC.uploadAvatar);
router.post("/logout", authC.logout);

router.post("/carts/chkcart", cartC.chkCart);
router.post("/carts/addcart", cartC.postCart);
router.post("/carts/addcartdtl", cartC.postCartDtl);
router.get("/carts/getcart/:id", cartC.getCart);
router.get("/carts/getcartdtl/:id", cartC.getCartDtl);
router.put("/carts/updateqty", cartC.updateCartQty);
router.delete("/carts/item", cartC.deleteCartDtl);
router.delete("/carts/:id", cartC.deleteCart);
router.post("/carts/confirm", cartC.confirmCart);

// --- History Routes (หน้าประวัติการสั่งซื้อ) ---
router.get("/carts/history/:userId", cartC.getCartByCustomer); // ตารางประวัติคำสั่งซื้อ
router.get("/carts/summary/:userId", cartC.getOrderSummary);

export default router;