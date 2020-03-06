import express from 'express';

import * as shopController from '../controllers/shop';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productID', shopController.getProduct);

router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.postOrder);

router.get('/orders/:orderID', isAuth, shopController.getInvoice);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post(
  '/cart-modify-item-quantity',
  shopController.postCartModifiyItemQuantity
);

router.post('/cart-delete-item', shopController.postCartDeleteItem);

router.get('/checkout', shopController.getCheckout);

//module.exports = router;
export default router;
