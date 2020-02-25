import express from 'express';

import * as adminController from '../controllers/admin';
import isAuth from '../middleware/is-auth';

const router = express.Router();

const adminURLPrefix = '/admin';
router.get(
  `${adminURLPrefix}/add-product`,
  isAuth,
  adminController.getAddProduct
);

router.get(`${adminURLPrefix}/products`, isAuth, adminController.getProducts);

router.post(
  `${adminURLPrefix}/add-product`,
  isAuth,
  adminController.postAddProduct
);

router.get(
  `${adminURLPrefix}/edit-product/:productID`,
  isAuth,
  adminController.getEditProduct
);

router.post(
  `${adminURLPrefix}/edit-product`,
  isAuth,
  adminController.postEditProduct
);

router.post(
  `${adminURLPrefix}/delete-product`,
  isAuth,
  adminController.postDeleteProduct
);

/*exports.routes = router;
exports.products = products;*/
export default router;
