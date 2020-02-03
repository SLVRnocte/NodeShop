import express from "express";

import * as shopController from "../controllers/shop";

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/orders", shopController.getOrders);

router.get("/cart", shopController.getCart);

router.get("/checkout", shopController.getCheckout);

//module.exports = router;
export default router;
