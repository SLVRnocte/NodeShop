import express from 'express';
import { check, body } from 'express-validator';
import validator from 'validator';

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
  [
    body('title')
      .custom(value => {
        // Custom validator
        // Name has to be alphanumeric however spaces are allowed
        if (!validator.isAlphanumeric(validator.blacklist(value, ' '))) {
          return false;
        }
        return true;
      })
      .trim(),
    //body('image').exists(),
    body('price').isFloat(),
    body('description').isLength({ min: 1 })
  ],
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
  [
    body('title')
      .custom(value => {
        // Custom validator
        // Name has to be alphanumeric however spaces are allowed
        if (!validator.isAlphanumeric(validator.blacklist(value, ' '))) {
          return false;
        }
        return true;
      })
      .trim(),
    //body('imageURL').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min: 1 })
  ],
  isAuth,
  adminController.postEditProduct
);

router.post(
  `${adminURLPrefix}/delete-product`,
  isAuth,
  adminController.postDeleteProduct
);

export default router;
