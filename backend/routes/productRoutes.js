import express from "express";
import * as productC from "../controllers/productController.js";
import { auth, requireRole } from "./middleware.js";
import multer from "multer";

const router = express.Router();

// เก็บรูปสินค้าเป็น img_pd/<pdId>.jpg (ทับรูปเดิม)
const productImageUpload = multer({
    storage: multer.diskStorage({
        destination: "img_pd",
        filename: (req, file, cb) => cb(null, `${req.params.id}.jpg`),
    }),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, ["image/jpeg", "image/png"].includes(file.mimetype)),
});

router.get("/products", productC.getAllProduct);
router.get("/products/search/:id", productC.getSearchProduct);
router.get("/products/:id", productC.getProductById);

router.get("/categories", productC.getCategories);
router.post("/categories", auth, requireRole("admin"), productC.postCategory);
router.get("/brands", productC.getBrands);

// admin เท่านั้น
router.post("/products", auth, requireRole("admin"), productC.postProduct);
router.put("/products/:id", auth, requireRole("admin"), productC.putProduct);
router.post("/products/:id/image", auth, requireRole("admin"), productImageUpload.single("file"), productC.uploadProductImage);
router.delete("/products/:id", auth, requireRole("admin"), productC.deleteProduct);

export default router;