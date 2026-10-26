import express from "express";
import * as productC from "../controllers/productController.js";

const router = express.Router();

router.get("/products", productC.getAllProduct);
router.get("/products/search/:id", productC.getSearchProduct);
router.get("/products/:id", productC.getProductById);

router.get("/categories", productC.getCategories);
router.get("/brands", productC.getBrands);

router.post("/products", productC.postProduct);

export default router;