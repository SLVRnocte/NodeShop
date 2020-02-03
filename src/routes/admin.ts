import express from "express";

import * as adminController from "../controllers/admin";

const router = express.Router();

const adminURLPrefix = "/admin";
router.get(`${adminURLPrefix}/add-product`, adminController.getAddProduct);

router.get(`${adminURLPrefix}/products`, adminController.getProducts);

router.post(`${adminURLPrefix}/add-product`, adminController.postAddProduct);

/*exports.routes = router;
exports.products = products;*/
export { router as routes };
