import { Request, Response, NextFunction } from 'express';

import { Product } from '../models/product';
import { Cart } from '../models/cart';
import { Order } from '../models/order';
import { User } from '../models/user';

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
  const productID = parseInt(req.params.productID);
  if (isNaN(productID)) {
    return res.redirect('/');
  }
  Product.findByID(productID)
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

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const session = req.session!;
  const cart = new Cart(session);

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
  if (isNaN(productID)) {
    return res.redirect('/cart');
  }
  const cart = new Cart(req.session!);

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
  const productID = parseInt(req.body.productID);
  if (isNaN(productID)) {
    return res.redirect('/cart');
  }
  const cart = new Cart(req.session!);

  cart.load().then(() => {
    cart.deleteProduct(productID).then(() => {
      res.redirect('/cart');
    });
  });
};

const postCartModifiyItemQuantity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productID = parseInt(req.body.productID);
  if (isNaN(productID)) {
    return res.redirect('/cart');
  }
  const cart = new Cart(req.session!);
  const modifyType = req.body.modifyType;

  cart.load().then(() => {
    const cartProduct = cart.cartProducts.find(
      cartProduct => cartProduct.product.id === productID
    )!;
    const newQuantity =
      cartProduct.quantity + (modifyType === 'increase' ? 1 : -1);

    cartProduct.modifyQuantity(newQuantity).then(() => {
      res.redirect('/cart');
    });
  });
};

const getOrders = (req: Request, res: Response, next: NextFunction) => {
  const userID = req.session!.user.id;
  Order.fetchAllBelongingToUser(userID).then(orders => {
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: 'orders',
      orders: orders
    });
  });
};

const postOrder = (req: Request, res: Response, next: NextFunction) => {
  const cart = new Cart(req.session!);

  cart
    .load()
    .then(async () => {
      const newOrder = new Order(undefined, cart.belongsToUser!.id);
      await newOrder.setup();
      for (const product of cart.cartProducts) {
        for (let i = 0; i < product.quantity; i++) {
          await newOrder.addProduct(product.product.id);
        }
      }
      return newOrder.save().then(() => {
        return cart.delete();
      });
    })
    .then(() => {
      res.redirect('/orders');
    });
};

const getCheckout = (req: Request, res: Response, next: NextFunction) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: 'checkout'
  });
};

export {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteItem,
  postCartModifiyItemQuantity,
  getOrders,
  postOrder,
  getCheckout
};
