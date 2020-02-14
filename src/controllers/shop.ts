import { Request, Response, NextFunction } from 'express';

import { Product } from '../models/product';
import { Cart } from '../models/cart';

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll()
    .then(result => {
      res.render('shop/product-list', {
        products: result,
        pageTitle: 'All Products',
        path: 'products'
      });
    })
    .catch(err => console.log(err));
};

const getProduct = (req: Request, res: Response, next: NextFunction) => {
  const productID = req.params.productID;
  Product.findByID(parseInt(productID))
    .then(result => {
      if (result !== undefined) {
        res.render('shop/product-detail', {
          product: result,
          pageTitle: result.title,
          path: 'products'
        });
      } else {
        res.redirect('/');
      }
    })
    .catch(err => console.log(err));
};

const getIndex = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll()
    .then(result => {
      res.render('shop/index', {
        products: result,
        pageTitle: 'Shop',
        path: 'shop'
      });
    })
    .catch(err => console.log(err));
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.user!.id;
  const cart = new Cart(userID);

  cart
    .load()
    .then(() => {
      cart.getTotalPrice().then(totalPrice => {
        res.render('shop/cart', {
          pageTitle: 'Shopping Cart',
          path: 'cart',
          cartProducts: cart.cartProducts,
          totalPrice: totalPrice.toFixed(2)
        });
      });
    })
    .catch(err => console.log(err));
};

const postCart = (req: Request, res: Response, next: NextFunction) => {
  const productID = parseInt(req.body.productID);
  const userID = req.user!.id;
  const cart = new Cart(userID);

  cart.load().then(() => {
    cart.addProduct(productID).then(() => {
      res.redirect('/cart');
    });
  });
};

const postCartDeleteItem = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productID = req.body.productID;
  const userID = req.user!.id;
  const cart = new Cart(userID);
  cart.load().then(() => {
    cart.deleteProduct(productID).then(() => {
      res.redirect('/cart');
    });
  });
};

const getOrders = (req: Request, res: Response, next: NextFunction) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: 'orders'
  });
};

const getCheckout = (req: Request, res: Response, next: NextFunction) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: 'checkout'
  });
};

export {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  postCartDeleteItem,
  getOrders,
  getCheckout
};
